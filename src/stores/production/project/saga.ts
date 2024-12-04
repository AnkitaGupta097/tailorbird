import { takeEvery } from "@redux-saga/core/effects";
import { fetchProductionProjectStateData } from "./operation";

import { actions } from "./slice";

export const ProjectSaga = [
    takeEvery(actions.setProductionProjectStateStart.type, fetchProductionProjectStateData),
];
