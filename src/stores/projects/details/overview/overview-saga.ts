import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./overview-slice";
import {
    createS3Upload,
    fetchDataSourceList,
    fetchDataSourceUploadStatus,
    fetchDownloadLink,
    fileNameValidation,
    rentRollFileS3Upload,
    rentRollFileDbUpload,
    updateRentRollColumn,
    deleteRentRoll,
    downloadRentRollFile,
} from "./overview-queries-api";

export const overviewSaga = [
    takeEvery(actions.createS3UploadStart.type, createS3Upload),
    takeEvery(actions.fetchDataSourceListStart.type, fetchDataSourceList),
    takeEvery(actions.fetchDataSourceUploadStatusStart.type, fetchDataSourceUploadStatus),
    takeEvery(actions.fetchDownloadLinkStart.type, fetchDownloadLink),
    takeEvery(actions.reS3UploadStart.type, createS3Upload),
    takeEvery(actions.fileNameValidationStart.type, fileNameValidation),
    takeEvery(actions.rentRollFileS3UploadStart.type, rentRollFileS3Upload),
    takeEvery(actions.rentRollFileDbUploadStart.type, rentRollFileDbUpload),
    takeEvery(actions.updateRentRollColumnStart.type, updateRentRollColumn),
    takeEvery(actions.deleteRentRollStart.type, deleteRentRoll),
    takeEvery(actions.downloadRentRollFileStart.type, downloadRentRollFile),
];
