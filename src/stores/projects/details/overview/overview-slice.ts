import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { map, find, filter, isEmpty, cloneDeep } from "lodash";
import initState from "./overview-init";
import { IProjectOverview } from "./overview-models";
import { updateObject } from "../../../../utils/store-helpers";
import initAjaxState from "../../../common/models/initAjaxState.json";

const initialState: IProjectOverview = cloneDeep(initState);

// eslint-disable-next-line
function overviewStateInIt(state: IProjectOverview, action: PayloadAction<any>) {
    return initState;
}

// eslint-disable-next-line
function fetchDataSourceUploadStatusStart(state: IProjectOverview, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function fetchDownloadLinkStart(state: IProjectOverview, action: PayloadAction<any>) {
    return state;
}

function fileNameValidationStart(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        uploadFileDetails: updateObject(state.uploadFileDetails, {
            loading: true,
            uploadDetails: [
                ...state.uploadFileDetails.uploadDetails,
                ...action.payload.fileContent,
            ],
        }),
    });
}

// eslint-disable-next-line
function createS3UploadStart(state: IProjectOverview, action: PayloadAction<any>) {
    let files = [];
    let validatedFile = [];
    if (state.uploadFileDetails.uploadDetails?.length > 0) {
        files = map(state.uploadFileDetails.uploadDetails, (file) => {
            const letestFile = find(action.payload.fileContent, { name: file.name });
            return letestFile ? letestFile : file;
        });
        validatedFile = filter(action.payload.fileContent, (file) => {
            return !file?.validateFileName?.error;
        });
    } else {
        files = [...state.uploadFileDetails.uploadDetails, ...action.payload.fileContent];
    }
    return updateObject(state, {
        uploadFileDetails: updateObject(state.uploadFileDetails, {
            loading: isEmpty(validatedFile) ? false : true,
            uploadDetails: [...files],
        }),
    });
}

function reS3UploadStart(state: IProjectOverview, action: PayloadAction<any>) {
    const { position } = action.payload.fileContent[0];
    state.uploadFileDetails.uploadDetails[position] = action.payload.fileContent[0];
    return state;
}

// eslint-disable-next-line
function fetchDataSourceListStart(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        dataSourceList: updateObject(state.dataSourceList, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function rentRollFileS3UploadStart(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRoll: updateObject(state.rentRoll, {
            loading: true,
            s3Path: "",
        }),
    });
}

// eslint-disable-next-line
function rentRollFileDbUploadStart(state: IProjectOverview, action: PayloadAction<any>) {
    console.log("here?! in rent roll?");
    return updateObject(state, {
        rentRollDb: updateObject(state.rentRollDb, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function updateRentRollColumnStart(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, { loading: true });
}

// eslint-disable-next-line
function updateRentRollColumnSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        rentRollDb: updateObject(state.rentRollDb, {
            status: "success",
        }),
    });
}

// eslint-disable-next-line
function updateRentRollColumnError(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        rentRollDb: updateObject(state.rentRollDb, {
            status: "error",
            error: { ...state.rentRoll.error, msg: action.payload },
        }),
    });
}

function rentRollFileDbUploadSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRollDb: updateObject(state.rentRollDb, {
            loading: false,
            data: action.payload,
        }),
        rentRoll: updateObject(state.rentRoll, {
            ...initAjaxState,
            s3Path: "",
            loading: false,
        }),
    });
}

function rentRollFileS3UploadSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    const splitedPath = action.payload.config.url.split("/");
    splitedPath.splice(0, 3);
    splitedPath[splitedPath.length - 1] = splitedPath[splitedPath.length - 1].split("?")[0];
    const exactPath = splitedPath.join("/");
    return updateObject(state, {
        rentRoll: updateObject(state.rentRoll, {
            loading: false,
            s3Path: exactPath,
        }),
    });
}
// eslint-disable-next-line
function rentRollFileInIt(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRoll: updateObject(state.rentRoll, {
            s3Path: "",
            loading: false,
        }),
    });
}

function rentRollFileS3UploadError(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRoll: updateObject(state.rentRoll, {
            loading: false,
            error: { ...state.rentRoll.error, msg: action.payload },
        }),
    });
}

// eslint-disable-next-line
function setVersionOnDatasource(state: IProjectOverview, action: PayloadAction<any>) {
    return state;
}

function createS3UploadSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    const abc = map(state.uploadFileDetails.uploadDetails, (file) => {
        const letestFile = find(action.payload, { name: file.name });
        return letestFile ? letestFile : file;
    });

    return updateObject(state, {
        uploadFileDetails: updateObject(state.uploadFileDetails, {
            loading: false,
            uploadDetails: [...abc],
        }),
    });
}

function reS3UploadSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    const { position } = action.payload[0];
    state.uploadFileDetails.uploadDetails[position] = action.payload[0];
    return state;
}

function updateRemark(state: IProjectOverview, action: PayloadAction<any>) {
    const { fileIndex, remark } = action.payload;
    state.uploadFileDetails.uploadDetails[fileIndex].remark = remark;
    return state;
}

function fetchDataSourceListSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        dataSourceList: updateObject(state.dataSourceList, {
            data: action.payload.getProjectDataSource,
            loading: false,
        }),
    });
}

function fetchDownloadLinkSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        downloadLink: updateObject(state.dataSourceList, {
            data: [...state.downloadLink.data, action.payload],
            loading: false,
        }),
    });
}

function dataSourceUploadStatusSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        dataSourceUploadStatus: action.payload.getDataSourceStatus,
    });
}

// eslint-disable-next-line
function createDataSourceSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        dataSourceUploadStatus: { status: "progress" },
        uploadFileDetails: { ...initAjaxState, uploadDetails: [] },
    });
}

// eslint-disable-next-line
function createDataSourceFail(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        uploadFileDetails: { ...initAjaxState, uploadDetails: [] },
    });
}
function deleteWrongFile(state: IProjectOverview, action: PayloadAction<any>) {
    state.uploadFileDetails.uploadDetails.splice(action.payload, 1);
    return state;
}
function emptyUploadedDetails(state: IProjectOverview) {
    return updateObject(state, {
        uploadFileDetails: { uploadDetails: [], loading: false },
    });
}
function deleteDSFile(state: IProjectOverview, action: PayloadAction<any>) {
    const updatedUploadDetails = state.uploadFileDetails.uploadDetails.filter(
        (f: any, i: number) => i !== action.payload,
    );

    return updateObject(state, {
        uploadFileDetails: {
            ...state.uploadFileDetails,
            uploadDetails: updatedUploadDetails,
        },
    });
}

// eslint-disable-next-line
function deleteRentRollStart(state: IProjectOverview, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function deleteRentRollUpdate(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRollDb: updateObject(state.rentRollDb, {
            isDeleteStatus: action.payload,
        }),
    });
}

// eslint-disable-next-line
function initStateUpdate(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRollDb: updateObject(state.rentRollDb, {
            loading: false,
            status: "",
            isDeleteStatus: "",
        }),
    });
}
// eslint-disable-next-line
function initStateForTakeOffs(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        uploadFileDetails: {
            uploadDetails: [],
        },
    });
}

// eslint-disable-next-line
function downloadRentRollFileStart(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRollDownloadLink: updateObject(state.rentRollDownloadLink, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function downloadRentRollFileSuccess(state: IProjectOverview, action: PayloadAction<any>) {
    return updateObject(state, {
        rentRollDownloadLink: updateObject(state.rentRollDownloadLink, {
            link: action.payload.downloadUnitMixes.s3_signed_url,
            loading: false,
        }),
    });
}

const slice = createSlice({
    name: "tpsm_overview",
    initialState: initialState,
    reducers: {
        createS3UploadStart,
        createS3UploadSuccess,
        createDataSourceSuccess,
        createDataSourceFail,
        fetchDataSourceListStart,
        fetchDataSourceListSuccess,
        updateRemark,
        setVersionOnDatasource,
        fetchDataSourceUploadStatusStart,
        dataSourceUploadStatusSuccess,
        fetchDownloadLinkStart,
        fetchDownloadLinkSuccess,
        reS3UploadStart,
        reS3UploadSuccess,
        fileNameValidationStart,
        deleteWrongFile,
        rentRollFileS3UploadStart,
        rentRollFileS3UploadSuccess,
        rentRollFileS3UploadError,
        rentRollFileDbUploadStart,
        rentRollFileInIt,
        rentRollFileDbUploadSuccess,
        updateRentRollColumnStart,
        updateRentRollColumnSuccess,
        deleteRentRollStart,
        updateRentRollColumnError,
        deleteRentRollUpdate,
        initStateUpdate,
        initStateForTakeOffs,
        downloadRentRollFileStart,
        downloadRentRollFileSuccess,
        overviewStateInIt,
        emptyUploadedDetails,
        deleteDSFile,
    },
});

export const actions = slice.actions;

export default slice.reducer;
