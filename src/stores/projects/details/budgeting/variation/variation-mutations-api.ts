import {
    UPDATE_VARIATION_DETAILS,
    CREATE_VARIATION_DETAILS,
    DELETE_VARIATION,
} from "./variation-mutations";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { put, all } from "@redux-saga/core/effects";
import {
    addItem,
    addItemFailure,
    removeItem,
    removeItemFailure,
    updateItem,
    updateItemFailure,
} from "../snack-messages";

export function* updateVariationDetails(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("variations", UPDATE_VARIATION_DETAILS, {
            id: action.payload.updateVariationInput.id,
            floorplans: action.payload.updateVariationInput.floorplans.map((plan: any) => ({
                id: plan.fpId,
                locations: plan.locations.map((loc: any) => ({
                    name: loc.name,
                    take_off: Number(loc.takeOff),
                })),
            })),
            updated_by: action.payload.updateVariationInput.updatedBy,
        });
        yield all([
            put(actions.budgeting.updateVariationDetailsSuccess(response)),
            put(
                actions.budgeting.fetchBaseScopeRenosStart({
                    projectId: action.payload.projectId,
                }),
            ),
            put(actions.budgeting.fetchAltScopeStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(updateItem("variation"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.updateVariationDetailsFailure(error)),
            put(actions.common.openSnack(updateItemFailure("variation"))),
        ]);
    }
}

export function* createVariation(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("variations", CREATE_VARIATION_DETAILS, {
            category: action.payload.createVariationInput.category,
            item: action.payload.createVariationInput.item,
            project_id: action.payload.createVariationInput.projectId,
            project_codex_id: action.payload.createVariationInput.projectCodexId,
            floorplans: action.payload.createVariationInput.floorplans.map((plan: any) => ({
                id: plan.fpId,
                locations: plan.locations.map((loc: any) => ({
                    name: loc.name,
                    take_off: loc.takeOff,
                })),
            })),
            created_by: action.payload.createVariationInput.createdBy,
        });
        yield all([
            put(actions.budgeting.createVariationDetailsSuccess(response)),
            put(
                actions.budgeting.fetchBaseScopeRenosStart({
                    projectId: action.payload.createVariationInput.projectId,
                }),
            ),
            put(
                actions.budgeting.fetchAltScopeStart({
                    projectId: action.payload.createVariationInput.projectId,
                }),
            ),
            put(actions.common.openSnack(addItem("variation"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.createVariationDetailsFailure(error)),
            put(actions.common.openSnack(addItemFailure("variation"))),
        ]);
    }
}

export function* deleteVariations(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("", DELETE_VARIATION, {
            id: action.payload.id,
        });
        yield all([
            put(actions.budgeting.deleteVariationsSuccess({ id: action.payload.id })),
            put(
                actions.budgeting.fetchBaseScopeRenosStart({
                    projectId: action.payload.projectId,
                }),
            ),
            put(actions.budgeting.fetchAltScopeStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(removeItem("variation"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.deleteVariationsFailure(error)),
            put(actions.common.openSnack(removeItemFailure("variation"))),
        ]);
    }
}
