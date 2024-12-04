import { takeEvery } from "@redux-saga/core/effects";
import { fetchUnitApprovals } from "./operation";

import { actions } from "./slice";

export const UnitApprovalSaga = [
    takeEvery(actions.fetchUnitApprovalsStart.type, fetchUnitApprovals),
];
