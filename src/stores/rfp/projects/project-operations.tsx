import { PayloadAction } from "@reduxjs/toolkit";
import actions from "stores/actions";
import { put, all } from "@redux-saga/core/effects";
import { client } from "stores/gql-client";
import {
    ACCEPT_BID_REQUEST,
    CREATE_BID_RESPONSE,
    GET_BID_RESPONSE,
    getProjectsAvailableToUser,
    GET_BID_REQUEST_BY_PROJECT,
    ACCEPT_OR_DECLINE_BID,
    GET_BID_REQUEST_BY_ID,
} from "./project-queries";

export function* fetchProjectDetails(action: PayloadAction<any>) {
    try {
        const response: { rfp_bid_details: Record<string, string | number>; [x: string]: any }[] =
            yield client.query("getProjectsAvailableToUser", getProjectsAvailableToUser, {
                userId: action.payload.user_id,
                organizationId: action.payload.organization_id,
                rfpProjectVersion: "2.0",
            });
        // Sorting the bid due dates from all projects
        let resp = [...response].sort(
            (a: any, b: any) =>
                // Fallback to 0 i.e 1st jan 1970 if any bid due date is null
                new Date(a?.rfp_bid_details?.bid_due_date ?? "1/1/1970").getTime() -
                new Date(b?.rfp_bid_details?.bid_due_date ?? "1/1/1970").getTime(),
        );
        const data = {
            loading: false,
            response: resp,
        };
        yield put(actions.rfpService.fetchProjectDetailsSuccess(data));
    } catch (error) {
        console.error(error);
        yield put(actions.rfpService.fetchProjectDetailsFailure(action));
    }
}

export function* getBidRequestByProject(action: PayloadAction<any>) {
    try {
        const response: {
            data: {
                getBidRequestByProject: any[];
            };
        } = yield client.query("getBidRequestByProject", GET_BID_REQUEST_BY_PROJECT, {
            projectId: action.payload.projectId,
            contractorOrgId: action.payload.contractorOrgId,
        });

        const data = {
            loading: false,
            response: response,
        };
        yield put(actions.rfpService.getBidRequestByProjectSuccess(data));
    } catch (error) {
        yield put(actions.rfpService.getBidRequestByProjectFailure(action));
    }
}

export function* getBidRequestById(action: PayloadAction<any>) {
    try {
        const response: {
            data: {
                getBidRequestById: any[];
            };
        } = yield client.query("getBidRequestById", GET_BID_REQUEST_BY_ID, {
            id: action?.payload?.id,
        });
        yield put(actions.rfpService.getBidRequestByIdSuccess({ response: response }));
    } catch (error) {
        yield put(actions.rfpService.getBidRequestByIdFailure(action));
    }
}

export function* acceptBidRequestById(action: PayloadAction<any>) {
    try {
        yield client.mutate("acceptBidRequestById", ACCEPT_BID_REQUEST, {
            Id: action?.payload?.Id,
            respondedBy: action?.payload?.respondedBy,
        });
        const bidRequest: {
            data: {
                getBidRequestByProject: any[];
            };
        } = yield client.query("getBidRequestByProject", GET_BID_REQUEST_BY_PROJECT, {
            projectId: action.payload.projectId,
            contractorOrgId: action.payload.contractorOrgId,
        });

        //@ts-ignore
        const bidResponse = yield client.query("getBidResponse", GET_BID_RESPONSE, {
            projectId: action?.payload?.projectId,
            contractorOrgId: action?.payload?.contractorOrgId,
        });

        yield put(
            actions.rfpService.acceptBidRequestByIdSuccess({
                bidRequest: bidRequest,
                bidResponse: bidResponse,
            }),
        );
    } catch (error) {
        yield put(actions.rfpService.acceptBidRequestByIdFailure({}));
    }
}

export function* getBidResponse(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const response = yield client.query("getBidResponse", GET_BID_RESPONSE, {
            projectId: action?.payload?.projectId,
            contractorOrgId: action?.payload?.contractorOrgId,
        });
        yield put(actions.rfpService.getBidResponseSuccess({ response: response }));
    } catch (error) {
        yield put(actions.rfpService.getBidResponseFailure({}));
    }
}

export function* createBidResponse(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const response = yield client.mutate("createBidResponse", CREATE_BID_RESPONSE, {
            input: action?.payload?.input,
        });
        // Add New Bid Response to Response Array , Refetch Project details and disable editing
        yield all([
            put(actions.rfpService.createBidResponseSuccess({ response: response })),
            put(
                actions.rfpService.fetchProjectDetailsStart({
                    user_id: action.payload.userID,
                    organization_id: action.payload.organization_id,
                }),
            ),
            put(
                actions.biddingPortal.unlockProjectForEditingStart({
                    projectId: action.payload.projectId,
                    organization_id: action.payload.organization_id,
                }),
            ),
        ]);
    } catch (error) {
        yield put(actions.rfpService.createBidResponseFailure({}));
    }
}

export function* acceptOrDeclineBid(action: PayloadAction<any>) {
    try {
        yield client.mutate("acceptOrDeclineBid", ACCEPT_OR_DECLINE_BID, {
            input: action?.payload?.input,
        });

        // const response: {
        //     data: {
        //         getProjectsAvailableToUser: any[];
        //     };
        // } = yield client.query("getProjectsAvailableToUser", getProjectsAvailableToUser, {
        //     userId: action.payload?.user_id,
        //     organizationId: action.payload?.organization_id,
        //     rfpProjectVersion: "2.0",
        // });

        yield put(actions.rfpService.acceptOrDeclineBidSuccess({}));
    } catch (error) {
        yield put(actions.rfpService.acceptOrDeclineBidFailure({}));
    }
}
