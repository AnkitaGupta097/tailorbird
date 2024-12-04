import { put, all } from "@redux-saga/core/effects";
import { ADD_BASE_PACKAGE, DELETE_BASE_PACKAGE } from "./base-packages-mutations";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { addItemFailure, addItem, removeItem, removeItemFailure } from "../snack-messages";

export function* addBasePackage(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("basePackage", ADD_BASE_PACKAGE, {
            projectId: action.payload.projectId,
            packageId: action.payload.packageId,
            ownershipGroupId: action.payload.ownershipId,
            createdBy: action.payload.createdBy,
        });
        yield all([
            put(actions.budgeting.addBasePackageSuccess(response)),
            put(
                actions.budgeting.fetchBaseScopeRenosStart({ projectId: action.payload.projectId }),
            ),
            put(actions.budgeting.fetchAltScopeStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(addItem("base package"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.addBasePackageFailure()),
            put(actions.common.openSnack(addItemFailure("base package"))),
        ]);
    }
}

export function* deleteBasePackage(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("basePackage", DELETE_BASE_PACKAGE, {
            projectId: action.payload.projectId,
            createdBy: action.payload.createdBy,
        });
        yield all([
            put(actions.budgeting.removeCommonBasePackage(action.payload.packageId)),
            put(actions.budgeting.deleteBasePackageSuccess(response)),
            put(
                actions.budgeting.fetchBaseScopeRenosStart({ projectId: action.payload.projectId }),
            ),
            put(actions.common.openSnack(removeItem("base package"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.deleteBasePackageFailure()),
            put(actions.common.openSnack(removeItemFailure("base package"))),
        ]);
    }
}
