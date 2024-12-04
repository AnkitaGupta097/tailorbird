import { put, all } from "@redux-saga/core/effects";
import {
    GET_ALL_VARIATION_DETAILS,
    GET_ALL_VARIATIONS,
    GET_VARIATION_INIT_ITEMS,
    GET_ALL_FLOOR_PLANS,
} from "./variation-queries";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { client } from "../../../../gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchItemFailure } from "../snack-messages";

export function* fetchVariations(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_VARIATIONS, {
            projectId: action.payload.projectId,
        });
        yield all([put(actions.budgeting.fetchVariationsSuccess(response))]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchVariationsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("variations"))),
        ]);
    }
}

export function* fetchVariationDetails(action: PayloadAction<any>) {
    try {
        const response: any[] = yield client.query("variationDetails", GET_ALL_VARIATION_DETAILS, {
            id: action.payload.id,
        });
        yield all([put(actions.budgeting.fetchVariationDetailsSuccess(response))]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchVariationDetailsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("variation details"))),
        ]);
    }
}

export function* fetchVariationInitItems(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_VARIATION_INIT_ITEMS, {
            id: action.payload.id,
        });
        yield all([put(actions.budgeting.fetchVariationInitItemsSuccess(response))]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchVariationInitItemsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("variation init items"))),
        ]);
    }
}

export function* fetchFloorplans(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_FLOOR_PLANS, {
            projectCodexId: action.payload.projectCodexId,
        });
        yield all([put(actions.budgeting.fetchFloorplansSuccess(response))]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchFloorplansFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("floorplans"))),
        ]);
    }
}
