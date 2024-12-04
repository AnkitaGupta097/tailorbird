import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IFileDetails, IFileUtility } from "./file-utility-models";
import initState from "./file-utility-init";
import { updateObject } from "utils/store-helpers";

const initialState: IFileUtility = cloneDeep(initState);

function createProjectFilesStart(state: IFileUtility, action: PayloadAction<any>) {
    let files = action?.payload?.input?.files?.map((file: IFileDetails) => {
        return {
            file_name: file?.file_name,
            loading: true,
            error: "",
        };
    });
    return updateObject(state, {
        loading: true,
        fileDetails: state?.fileDetails,
        uploadDetails: files,
    });
}

function createProjectFilesSuccess(state: IFileUtility, action: PayloadAction<any>) {
    const existingImageFiles = cloneDeep(state?.imageFiles);
    const imageFiles = action?.payload?.map((details: any) => {
        if (details?.file?.file_type === "PROJECT_IMAGE") {
            return details?.file;
        }
    });

    const isImageFile = action?.payload?.some((details: any) => {
        return details?.file?.file_type === "PROJECT_IMAGE";
    });

    return updateObject(state, {
        loading: false,
        uploadDetails: isImageFile ? [] : [...action.payload],
        imageFiles:
            imageFiles?.length > 0
                ? [...(existingImageFiles ?? []), ...imageFiles]
                : existingImageFiles,
    });
}
// eslint-disable-next-line no-unused-vars
function getProjectFilesStart(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
        archivedFiles: [],
        imageFiles: [],
        fileDetails: [],
        finalistFiles: [],
    });
}

function getProjectFilesSuccess(state: IFileUtility, action: PayloadAction<any>) {
    let archivedFiles = cloneDeep(state?.archivedFiles);
    const bidderFiles =
        action?.payload?.data?.length === 0
            ? []
            : action?.payload?.data?.filter(
                  (file: IFileDetails) =>
                      file?.is_active &&
                      (file?.tags?.is_archive === undefined || file?.tags?.is_archive === false) &&
                      file?.file_type === "BID_DOCUMENT",
              );
    const finalistFiles =
        action?.payload?.data?.length === 0
            ? []
            : action?.payload?.data?.filter(
                  (file: IFileDetails) =>
                      file?.is_active &&
                      (file?.tags?.is_archive === undefined || file?.tags?.is_archive === false) &&
                      file?.file_type === "RFP_FINALIST_DOCUMENT",
              );

    const imageFiles =
        action?.payload?.data?.length === 0
            ? []
            : action?.payload?.data?.filter(
                  (file: IFileDetails) => file?.is_active && file?.file_type === "PROJECT_IMAGE",
              );
    if (
        action?.payload?.data?.some(
            (file: IFileDetails) => file?.tags?.is_archive === true && file?.is_active,
        )
    ) {
        archivedFiles = [
            ...action.payload.data.filter((file: IFileDetails) => file?.tags?.is_archive === true),
        ];
    }
    return updateObject(state, {
        loading: false,
        fileDetails: bidderFiles,
        finalistFiles: finalistFiles,
        archivedFiles: archivedFiles,
        uploadDetails: [],
        imageFiles: imageFiles,
    });
}

// eslint-disable-next-line no-unused-vars
function DeleteFilesStart(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function DeleteFilesSuccess(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        fileDetails: state?.fileDetails,
    });
}

// eslint-disable-next-line no-unused-vars
function ArchiveProjectStart(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function ArchiveProjectSuccess(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: false,
    });
}

// eslint-disable-next-line no-unused-vars
function UndoProjectStart(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function UndoProjectSuccess(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: false,
    });
}

// eslint-disable-next-line no-unused-vars
function downloadFilesAndZipStart(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        downloadingFiles: true,
        downlodingError: false,
    });
}

// eslint-disable-next-line no-unused-vars
function downloadFilesAndZipSuccess(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        downloadingFiles: false,
    });
}

// eslint-disable-next-line no-unused-vars
function downloadFilesAndZipFailure(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        downloadingFiles: false,
        downloadingError: true,
    });
}

// eslint-disable-next-line no-unused-vars
function resetUploadedFilesState(state: IFileUtility, action: PayloadAction<any>) {
    return updateObject(state, {
        uploadDetails: [],
    });
}

const slice = createSlice({
    name: "file_utility",
    initialState: initialState,
    reducers: {
        createProjectFilesStart,
        createProjectFilesSuccess,
        getProjectFilesStart,
        getProjectFilesSuccess,
        DeleteFilesStart,
        DeleteFilesSuccess,
        ArchiveProjectStart,
        ArchiveProjectSuccess,
        UndoProjectStart,
        UndoProjectSuccess,
        downloadFilesAndZipStart,
        downloadFilesAndZipSuccess,
        downloadFilesAndZipFailure,
        resetUploadedFilesState,
    },
});

export const actions = slice.actions;
export default slice.reducer;
