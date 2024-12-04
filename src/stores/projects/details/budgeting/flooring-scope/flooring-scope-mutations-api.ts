import { put, all } from "@redux-saga/core/effects";
import { UPSERT_GROUP, SETUP_GROUP, DELETE_GROUP } from "./flooring-scope-mutation";
import { actions } from "../budgeting-slice";
import { commonActions } from "../../../../common";
import { graphQLClient } from "../../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { addItem, addItemFailure, removeItem, removeItemFailure } from "../snack-messages";

export function* setupGroup(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("SetupGroup", SETUP_GROUP, {
            projectId: action.payload.projectId,
            createdBy: action.payload.createdBy,
        });
        yield all([
            put(actions.setupGroupSuccess(response)),
            put(actions.fetchFlooringTakeOffsStart({ projectId: action.payload.projectId })),
            put(commonActions.openSnack(addItem("flooring scope"))),
            put(
                actions.fetchFlooringRenoItemsStart({
                    projectId: action.payload.projectId,
                }),
            ),
        ]);
    } catch (error) {
        yield all([
            put(actions.setupGroupFailure(error)),
            put(commonActions.openSnack(addItemFailure("flooring scope"))),
        ]);
    }
}

export function* upsertGroup(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate(
            "flooringScopeRenovations",
            UPSERT_GROUP,
            {
                projectId: action.payload.projectId,
                data: action.payload.data,
                createdBy: action.payload.createdBy,
            },
        );
        yield all([
            put(actions.upsertGroupSuccess({ renovations: response })),
            put(commonActions.openSnack(addItem("flooring scope group"))),
            put(actions.fetchFlooringTakeOffsStart({ projectId: action.payload.projectId })),
            put(actions.fetchBudgetingDetailsStart({ projectId: action.payload.projectId })),
            put(
                actions.fetchFlooringRenoItemsStart({
                    projectId: action.payload.projectId,
                }),
            ),
        ]);
        if (response?.length == 0 && action.payload.scopeType && action.payload.currentInv) {
            window.location.href = `${window.location.href}?origin=${action.payload.scopeType}&inv_id=${action.payload.currentInv}`;
        }
    } catch (error) {
        yield all([
            put(actions.upsertGroupFailure(error)),
            put(commonActions.openSnack(addItemFailure("flooring scope group"))),
        ]);
    }
}
export function* deleteGroup(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("DeleteGroup", DELETE_GROUP, {
            projectId: action.payload.projectId,
            updatedBy: action.payload.updatedBy,
        });
        yield all([
            put(actions.deleteGroupSuccess(response)),
            put(commonActions.openSnack(removeItem("flooring scope"))),
            put(
                actions.fetchFlooringRenoItemsStart({
                    projectId: action.payload.projectId,
                }),
            ),
            put(actions.fetchAltScopeStart({ projectId: action.payload.projectId })),
        ]);
    } catch (error) {
        yield all([
            put(actions.deleteGroupFailure(error)),
            put(commonActions.openSnack(removeItemFailure("flooring scope"))),
        ]);
    }
}
