import { takeEvery } from "@redux-saga/core/effects";
import { fetchUnitScopeApprovals, reviewApprovals } from "./operation";

import { actions } from "./slice";

export const ApprovalsSaga = [
    takeEvery(actions.fetchApprovalsStart.type, fetchUnitScopeApprovals),
    takeEvery(actions.reviewApprovalStart.type, reviewApprovals),
];
