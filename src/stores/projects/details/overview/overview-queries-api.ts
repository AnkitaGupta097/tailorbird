import { put } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    GET_DATASORCE_LIST,
    GET_DATASORCE_DOWNLOAD_LINK,
    GET_DATASORCE_UPLOAD_STATUS,
    VALIDATE_FILE_NAME,
    UPDATE_RENT_ROLL_COLUMN,
    UPLOAD_RENT_ROLL,
    DELETE_RENT_ROLL,
    DOWNLOAD_UNIT_MIX,
} from "./overview-queries";
import actions from "../../../actions";
import { graphQLClient } from "../../../../utils/gql-client";
import { map, find, filter } from "lodash";
import axios from "axios";
import { CREATE_S3_SIGNED_URL } from "../../../common/queries";

export function* fetchDataSourceUploadStatus(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getDataSourceStatus",
            GET_DATASORCE_UPLOAD_STATUS,
            {
                project_id: action.payload,
            },
        );
        yield put(actions.projectOverview.dataSourceUploadStatusSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* fileNameValidation(action: PayloadAction<any>) {
    const fileNames = map(action.payload.fileContent, (file) => file.name);
    const projectId = action.payload.projectId;
    console.log(projectId, "projectId");

    try {
        const response: { validateDataSourceFileName: any } = yield graphQLClient.query(
            "ValidateDataSourceFile",
            VALIDATE_FILE_NAME,
            {
                fileNames: fileNames,
                project_id: projectId,
            },
        );
        const fileContent = [...action.payload.fileContent];
        const update = map(fileContent, (file) => {
            const obj = find(response.validateDataSourceFileName, { file_name: file.name });
            return { ...file, validateFileName: obj };
        });
        action.payload.fileContent = update;
        yield put(actions.projectOverview.createS3UploadStart(action.payload));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchDownloadLink(action: PayloadAction<any>) {
    try {
        const response: { getDataSourceDownloadableLink: any } = yield graphQLClient.query(
            "getDataSourceDownloadableLink",
            GET_DATASORCE_DOWNLOAD_LINK,
            {
                fileIds: action.payload,
            },
        );
        yield put(
            actions.projectOverview.fetchDownloadLinkSuccess({
                urls: response.getDataSourceDownloadableLink.map((d: any) => d.URL),
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* downloadRentRollFile(action: PayloadAction<any>) {
    try {
        const response: { getDataSourceDownloadableLink: any } = yield graphQLClient.query(
            "downloadUnitMixes",
            DOWNLOAD_UNIT_MIX,
            {
                projectId: action.payload,
            },
        );
        yield put(actions.projectOverview.downloadRentRollFileSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchDataSourceList(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getDatasourceListByProjectID",
            GET_DATASORCE_LIST,
            {
                project_id: action.payload,
            },
        );
        yield put(actions.projectOverview.fetchDataSourceListSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* createS3Upload(action: PayloadAction<any>) {
    const { isReupload, filePath, fileContent } = action.payload;
    const validatedFile = filter(fileContent, (file) => {
        return !file?.validateFileName?.error;
    });
    const fileNames = map(validatedFile, (fileDetails) => fileDetails.name);
    try {
        const response: [
            {
                file_name: string;
                signed_url: string;
            },
        ] = yield graphQLClient.mutate("createS3SignedURL", CREATE_S3_SIGNED_URL, {
            input: {
                file_names: fileNames,
                prefix_path: filePath,
            },
        });
        if (response.length > 0) {
            // @ts-ignore
            const responseArr = yield Promise.allSettled(
                response.map((e) => {
                    return uploadToS3(e, find(action.payload.files, { name: e.file_name }));
                }),
            );
            const res = responseArr.map((r: any, i: any) => {
                if (r.value?.message == "error") {
                    return {
                        // @ts-ignore
                        position: validatedFile[i]?.position,
                        name: r.value?.data.name, // @ts-ignore
                        remote_file_reference: "",
                        remark: null,
                        loading: false,
                        error: true,
                        data: r.value?.data,
                    };
                } else {
                    const splitedPath = r.value?.config?.url?.split("/");
                    splitedPath?.splice(0, 3);
                    splitedPath[splitedPath.length - 1] =
                        splitedPath[splitedPath.length - 1]?.split("?")[0];
                    const exactPath = splitedPath?.join("/");
                    return {
                        // @ts-ignore
                        position: validatedFile[i]?.position,
                        name: r?.value?.config?.data?.name, // @ts-ignore
                        remote_file_reference: exactPath,
                        remark: null,
                        loading: false,
                        error: "",
                        data: null,
                    };
                }
            });
            if (isReupload) {
                yield put(actions.projectOverview.reS3UploadSuccess(res));
            } else {
                yield put(actions.projectOverview.createS3UploadSuccess(res));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export function* rentRollFileS3Upload(action: PayloadAction<any>) {
    const { file, filePath } = action.payload;

    try {
        const response: [
            {
                file_name: string;
                signed_url: string;
            },
        ] = yield graphQLClient.mutate("createS3SignedURL", CREATE_S3_SIGNED_URL, {
            input: {
                file_names: [file.name],
                prefix_path: filePath,
            },
        });
        if (response.length > 0) {
            // @ts-ignore
            const res = yield uploadToS3(response[0], file);
            yield put(actions.projectOverview.rentRollFileS3UploadSuccess(res));
        }
    } catch (error) {
        yield put(
            actions.projectOverview.rentRollFileS3UploadError("Upload failed due to system error"),
        );
    }
}

export function* updateRentRollColumn(action: PayloadAction<any>) {
    try {
        const response: {
            id: string;
            error: string;
        } = yield graphQLClient.mutate("updateRentRoll", UPDATE_RENT_ROLL_COLUMN, {
            project_id: action.payload.projectId,
            unit_column: action.payload[0],
            floor_plan_name_column: action.payload[1],
            floor_plan_type_column: action.payload[2],
            sqft_column: action.payload[3],
            inventory_column: action.payload[4],
            commercial_name_column: action.payload[5],
            unit_type_column: action.payload[6],
        });
        if (response?.id) {
            yield put(actions.projectOverview.updateRentRollColumnSuccess(response));
            yield put(actions.projectDetails.updateRentRollStatus("success"));
        } else {
            yield put(actions.projectOverview.updateRentRollColumnError(response?.error));
        }
    } catch (error) {
        yield put(actions.projectOverview.updateRentRollColumnError(error));
    }
}

export function* deleteRentRoll(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("DeleteRentRoll", DELETE_RENT_ROLL, {
            projectId: action.payload,
        });
        yield put(actions.projectOverview.deleteRentRollUpdate("success"));
        yield put(actions.projectDetails.updateRentRollStatus("uploaded"));
    } catch (error) {
        yield put(actions.projectOverview.deleteRentRollUpdate("error"));
    }
}

export function* rentRollFileDbUpload(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("uploadRentRoll", UPLOAD_RENT_ROLL, {
            input: action.payload,
        });

        yield put(actions.projectOverview.rentRollFileDbUploadSuccess(response));
        yield put(actions.projectDetails.updateRentRoll(response));
    } catch (error) {
        yield put(actions.projectOverview.rentRollFileDbUploadSuccess(error));
    }
}

export async function uploadToS3(
    data: {
        file_name: string;
        signed_url: string;
    },
    subArray: any,
) {
    const CancelToken = axios.CancelToken;
    CancelToken.source();
    let statusArray: any = [];
    let signedRequest = data?.signed_url;
    // let signedRequest =
    //     "https://tailorbirdhomes-dev.s3.amazonaws.com/project_spec/datasource_files/3771114a20d6413bbc50e0188a712659/B1_1.1.Cabinets.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4GTKQC7YUQRVYUEH%2F20220926%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220926T111755Z&X-Amz-Expires=6000&X-Amz-SignedHeaders=host&X-Amz-Signature=7ca6a7315f9c1243ee15c5e5c045f82a64380ea5031024ee1166f3599abe0231";
    let file = subArray;
    let options = {
        cancelToken: new CancelToken(function executor() {}),
    };
    let res = axios
        .put(signedRequest, file, options)
        .then((response) => {
            if (response.status == 200) {
                return response;
            }
        })
        .catch((error) => {
            return { message: "error", status: error, data: subArray };
        });
    statusArray = await Promise.resolve(res);
    return statusArray;
}

export async function getFileFromS3AsArrayBuffer(fileUrl: string) {
    let response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "arraybuffer",
    });
    return response.data;
}
