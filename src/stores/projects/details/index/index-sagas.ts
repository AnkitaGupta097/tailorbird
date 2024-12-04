import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./index-slice";
import {
    fetchProjectDetails,
    updateProject,
    fetchRentRoll,
    updateProjectStatus,
} from "./index-api";

export const projectDetailsSaga = [
    takeEvery(actions.fetchProjectDetailsStart.type, fetchProjectDetails),
    takeEvery(actions.updateProjectStart.type, updateProject),
    takeEvery(actions.fetchRentRollStart.type, fetchRentRoll),
    takeEvery(actions.updateProjectStatusStart.type, updateProjectStatus),
];
