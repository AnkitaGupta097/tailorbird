import { PayloadAction } from "@reduxjs/toolkit";
import { find } from "lodash";
import { graphQLClient } from "utils/gql-client";
import {
    CREATE_PROJECT_FILES,
    DELETE_PROJECT_FILES,
    GET_PROJECT_FILES,
    MARK_FILE_UPLOADED,
    ARCHIVE_PROJECT_FILES,
    UNDO_PROJECT_FILES,
    GET_PROJECT_FILE,
} from "./file-utility-queries";
import { put } from "@redux-saga/core/effects";
import actions from "stores/actions";
import { IFileDetails } from "./file-utility-models";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function* createProjectFiles(action: PayloadAction<any>) {
    try {
        const response: [
            {
                id: string;
                file_name: string;
                signed_url: string;
            },
        ] = yield graphQLClient.mutate("createProjectFiles", CREATE_PROJECT_FILES, {
            input: action?.payload.input,
        });

        if (response.length > 0) {
            // @ts-ignore
            const responseArr = yield Promise.allSettled(
                response.map(async (e) => {
                    let file = find(action.payload.files, { name: e.file_name });
                    const options = {
                        method: "PUT",
                        body: file,
                    };
                    const uploadResponse = await fetch(e.signed_url, options);
                    return Object.assign(uploadResponse, {
                        file_name: e.file_name,
                        file: e,
                    });
                }),
            );

            yield Promise.allSettled(
                response.map((e) => {
                    return graphQLClient.mutate("markFileUploaded", MARK_FILE_UPLOADED, {
                        file_id: e.id,
                    });
                }),
            );
            const res = responseArr.map((r: any) => {
                if (r.value?.status !== 200) {
                    return {
                        file_name: r?.value?.file_name,
                        file: r?.value?.file,
                        remote_file_reference: "",
                        loading: false,
                        error: true,
                        data: r?.value?.file_name,
                    };
                } else {
                    return {
                        file_name: r?.value?.file_name,
                        file: r?.value?.file,
                        loading: false,
                        error: "",
                        data: null,
                    };
                }
            });

            yield put(actions.fileUtility.createProjectFilesSuccess(res));
        }
    } catch (error) {
        console.log(error);
    }
}

export function* getProjectFiles(action: PayloadAction<any>) {
    try {
        const responseFinalistFiles: {
            getProjectFiles: IFileDetails[];
        } = yield graphQLClient.query("getProjectFiles", GET_PROJECT_FILES, {
            project_id: action?.payload?.project_id,
            file_type: "RFP_FINALIST_DOCUMENT",
        });

        const responseBidderFiles: {
            getProjectFiles: IFileDetails[];
        } = yield graphQLClient.query("getProjectFiles", GET_PROJECT_FILES, {
            project_id: action?.payload?.project_id,
            file_type: "BID_DOCUMENT",
        });

        const responseImageFiles: {
            getProjectFiles: IFileDetails[];
        } = yield graphQLClient.query("getProjectFiles", GET_PROJECT_FILES, {
            project_id: action?.payload?.project_id,
            file_type: "PROJECT_IMAGE",
        });

        yield put(
            actions.fileUtility.getProjectFilesSuccess({
                data: [
                    ...responseBidderFiles.getProjectFiles,
                    ...responseFinalistFiles.getProjectFiles,
                    ...responseImageFiles.getProjectFiles,
                ],
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* deleteProjectFiles(action: PayloadAction<any>) {
    try {
        const response: boolean[] = yield Promise.allSettled(
            action?.payload?.files.map((file: any) => {
                return graphQLClient.mutate("deleteProjectFile", DELETE_PROJECT_FILES, {
                    input: {
                        file_id: file.id,
                        user_id: action.payload.user_id,
                    },
                });
            }),
        );
        yield put(
            actions.fileUtility.DeleteFilesSuccess({
                response: response,
                project_id: action?.payload?.project_id,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* archiveProjectFiles(action: PayloadAction<any>) {
    try {
        const response: boolean[] = yield Promise.allSettled(
            action?.payload?.files.map((file: any) => {
                return graphQLClient.mutate("archiveProjectFile", ARCHIVE_PROJECT_FILES, {
                    file_id: file?.id,
                });
            }),
        );
        yield put(
            actions.fileUtility.ArchiveProjectSuccess({
                response: response,
                project_id: action?.payload?.project_id,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* undoProjectFiles(action: PayloadAction<any>) {
    try {
        const response: boolean[] = yield Promise.allSettled(
            action?.payload?.files.map((file: any) => {
                return graphQLClient.mutate("undoArchiveProjectFile", UNDO_PROJECT_FILES, {
                    file_id: file.id,
                });
            }),
        );
        yield put(
            actions.fileUtility.UndoProjectSuccess({
                response: response,
                project_id: action?.payload?.project_id,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* refetchProjectFiles(action: PayloadAction<any>) {
    yield put(
        actions.fileUtility.getProjectFilesStart({
            project_id: action.payload.project_id,
        }),
    );
}

const download = async (url: string) => {
    const resp = await fetch(url);
    return resp.blob();
};

const downloadMany = (urls: Array<string>) => {
    return Promise.all(urls.map((url: string) => download(url)));
};
export function* downloadFilesAndZip(action: PayloadAction<any>) {
    try {
        let ids: Array<String> = action.payload.ids;
        //@ts-ignore
        let files: Array<any> = yield Promise.allSettled(
            ids.map((id) => {
                return graphQLClient.query("getProjectFile", GET_PROJECT_FILE, {
                    fileId: id,
                });
            }),
        );
        let links: Array<string> = files.map(
            ({ value }: any) => value?.getProjectFile?.download_link,
        );
        //@ts-ignore
        let files_data: any = yield downloadMany(links);
        let zip = new JSZip();
        files.forEach((file: any, index) => {
            zip.file(file.value?.getProjectFile?.file_name, files_data[index]);
        });
        //@ts-ignore
        const projectDetails = yield zip.generateAsync({ type: "blob" });
        saveAs(projectDetails, `${action.payload.projectName}.zip`);
        yield put(actions.fileUtility.downloadFilesAndZipSuccess({}));
    } catch (err) {
        yield put(actions.fileUtility.downloadFilesAndZipFailure({}));
    }
}
