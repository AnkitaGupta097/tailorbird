import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "../budgeting-slice";
import { fetchBudgetMetaData, fetchCommonEntities } from "./common-entities-api";

export const commonEntitiesSaga = [
    takeEvery(actions.fetchCommonEntitiesStart.type, fetchCommonEntities),
    takeEvery(actions.fetchBudgetingDetailsStart.type, fetchBudgetMetaData),
];
