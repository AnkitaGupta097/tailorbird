/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import { GET_UNIT_SCOPE_APPROVALS, REVIEW_APPROVAL } from "./queries";
import actions from "../../actions";
import { client as graphQLClient } from "../../gql-client";
import { getTrackingEventPayload } from "components/production/approvals/utils";
import TrackerUtil from "utils/tracker";
import { capitalize, isNil, omit } from "lodash";

//eslint-disable-next-line
export function* fetchUnitScopeApprovals(action: PayloadAction<any>) {
    const payload: any = { renoUnitId: action.payload.renoUnitId };
    if (!isNil(action.payload.isReviewed)) {
        payload.isReviewed = action.payload.isReviewed;
    }
    try {
        // @ts-ignore
        const response: { getUnitScopeApprovals } = yield graphQLClient.query(
            "getUnitScopeApprovals",
            GET_UNIT_SCOPE_APPROVALS,
            {
                ...payload,
            },
        );
        const successPayload: any = {
            renoUnitId: action.payload.renoUnitId,
            approvals: response,
        };

        if (!isNil(action.payload.isReviewed)) {
            successPayload.isReviewed = action.payload.isReviewed;
        }

        yield put(
            actions.production.approval.fetchApprovalsSuccess({
                ...successPayload,
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.approval.fetchApprovalsFailure({
                approvals: {},
            }),
        );
    }
}

export function* reviewApprovals(action: PayloadAction<any>) {
    const {
        renoUnitId,
        scopeApprovalIds,
        reviewStatus,
        type,
        updatedRenoUnit,
        projectId,
        projectName,
        attachments,
        remark,
    } = action?.payload ?? {};
    try {
        yield graphQLClient.mutate("ReviewApprovals", REVIEW_APPROVAL, {
            scopeApprovalIds,
            reviewStatus,
            reviewerAttachments: attachments,
            reviewerRemarks: remark,
        });

        yield put(
            actions.production.unitApproval.fetchUnitApprovalsStart({
                projectId,
                isReviewed: false,
                approvalType: [],
                unitStatus: [],
            }),
        );

        yield put(
            actions.production.unitApproval.fetchUnitApprovalsStart({
                projectId,
                isReviewed: true,
                approvalType: [],
                unitStatus: [],
            }),
        );

        yield put(
            actions.production.unitScopes.fetchRenoUnitScopesStart({
                renoUnitId,
            }),
        );

        yield put(
            actions.production.approval.fetchApprovalsStart({
                renoUnitId,
            }),
        );

        yield put(
            actions.common.openSnack({
                message: `${
                    type === "signoff" ? "SignedOff" : capitalize(reviewStatus)
                } Successfully`,
                variant: "success",
                open: true,
            }),
        );
        yield put(actions.production.approval.reviewApprovalSuccess({}));
        if (type === "signoff") {
            yield put(
                actions.production.unit.updateSingleRenovationUnitSuccess({
                    updatedRenoUnit,
                    renoUnitId,
                }),
            );
        }
    } catch (exception) {
        const payload: any = getTrackingEventPayload(
            renoUnitId,
            reviewStatus,
            scopeApprovalIds,
            type,
            projectName,
        );
        TrackerUtil.error(exception, omit(payload, ["event"]), payload.event);
        yield put(
            actions.common.openSnack({
                message: `Failed to ${
                    reviewStatus === "cancelled"
                        ? "Cancel"
                        : reviewStatus === "approved"
                        ? "Approve"
                        : "Reject"
                }`,
                variant: "error",
                open: true,
            }),
        );
    }
}
