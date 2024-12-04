import { takeEvery } from "@redux-saga/core/effects";
import {
    acceptBidRequestById,
    acceptOrDeclineBid,
    createBidResponse,
    fetchProjectDetails,
    getBidRequestById,
    getBidRequestByProject,
    getBidResponse,
} from "./project-operations";

import { actions } from "./project-slice";

export const saga = [
    takeEvery(actions.fetchProjectDetailsStart.type, fetchProjectDetails),
    takeEvery(actions.getBidRequestByProjectStart.type, getBidRequestByProject),
    takeEvery(actions.acceptBidRequestByIdStart.type, acceptBidRequestById),
    takeEvery(actions.getBidResponseStart.type, getBidResponse),
    takeEvery(actions.createBidResponseStart.type, createBidResponse),
    takeEvery(actions.acceptOrDeclineBidStart.type, acceptOrDeclineBid),
    takeEvery(actions.getBidRequestByIdStart.type, getBidRequestById),
];
