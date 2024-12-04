/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import { GET_APPROVALS } from "./queries";
import actions from "../../actions";
import { client as graphQLClient } from "../../gql-client";

//eslint-disable-next-line
export function* fetchUnitApprovals(action: PayloadAction<any>) {
    try {
        if (action.payload.shouldShowSpinner) {
            yield put(actions.production.unitApproval.setLoading({ loading: true }));
        }
        // @ts-ignore
        const response: { getUnitApprovals } = yield graphQLClient.query(
            "getUnitApprovals",
            GET_APPROVALS,
            {
                projectId: action.payload.projectId,
                isReviewed: action.payload.isReviewed,
                approvalType: action.payload.approvalType,
                unitStatus: action.payload.unitStatus,
            },
        );
        yield put(
            actions.production.unitApproval.fetchUnitApprovalsSuccess({
                unitApprovals: response,
                approvalType: action.payload.approvalType,
                unitStatus: action.payload.unitStatus,
                isReviewed: action.payload.isReviewed,
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.unitApproval.fetchUnitApprovalsFailure({
                unitApprovals: {},
            }),
        );
    }
}
