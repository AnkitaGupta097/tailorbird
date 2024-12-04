import {
    archiveProjectFiles,
    createProjectFiles,
    deleteProjectFiles,
    downloadFilesAndZip,
    getProjectFiles,
    refetchProjectFiles,
    undoProjectFiles,
} from "./file-utility-operations";
import { actions } from "./file-utility-slice";
import { takeEvery, takeLatest } from "@redux-saga/core/effects";

export const fileUtilitySaga = [
    takeEvery(actions.createProjectFilesStart, createProjectFiles),
    takeEvery(actions.getProjectFilesStart, getProjectFiles),
    takeEvery(actions.DeleteFilesStart, deleteProjectFiles),
    takeEvery(actions.ArchiveProjectStart, archiveProjectFiles),
    takeEvery(actions.UndoProjectStart, undoProjectFiles),
    takeLatest(actions.UndoProjectSuccess, refetchProjectFiles),
    takeLatest(actions.ArchiveProjectSuccess, refetchProjectFiles),
    takeLatest(actions.DeleteFilesSuccess, refetchProjectFiles),
    takeEvery(actions.downloadFilesAndZipStart.type, downloadFilesAndZip),
];
