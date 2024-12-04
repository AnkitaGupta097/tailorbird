import { put, all } from "@redux-saga/core/effects";
import { GET_ALL_COMMON_ENTITIES, GET_BUDGETING_META_DATA } from "./common-entities-queries";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { fetchItemFailure } from "../snack-messages";
import { PayloadAction } from "@reduxjs/toolkit";

export function* fetchCommonEntities(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_COMMON_ENTITIES, {
            ownershipId: action.payload.ownershipId,
            projectType: action.payload.projectType,
            containerVersion: action.payload.containerVersion,
        });
        yield all([put(actions.budgeting.fetchCommonEntitiesSuccess(response))]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchCommonEntitiesFailure()),
            put(actions.common.openSnack(fetchItemFailure("packages and scope libraries"))),
        ]);
    }
}

export function* fetchBudgetMetaData(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_BUDGETING_META_DATA, {
            projectId: action.payload.projectId,
        });
        yield all([put(actions.budgeting.fetchBudgetMetadataSuccess(response))]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchBudgetMetadataFailure()),
            put(actions.common.openSnack(fetchItemFailure("budget meta data"))),
        ]);
    }
}
