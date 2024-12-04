/* eslint-disable no-unused-vars */
import { put, all } from "@redux-saga/core/effects";
import {
    CREATE_FLOORING_SPLIT,
    UPDATE_FLOORING_SPLIT_TABLE_COUNT,
    UPDATE_INVENTORY_MIX,
    CREATE_FLOOR_PLAN,
    UPDATE_FLOOR_PLAN,
    DELETE_FLOOR_PLAN,
} from "./floor-plans-mutations";
import { actions } from "./index";
import commonActions from "../../../actions";
import { graphQLClient } from "../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    addItem,
    addItemFailure,
    updateItem,
    updateItemFailure,
} from "../budgeting/snack-messages";
import { DELETE_PROJECT_FILES } from "stores/single-project/queries";
import { propertiesConsumerActions } from "../../../properties-consumer/index";

export function* deleteFloorPlan(action: PayloadAction<any>) {
    try {
        console.log(action.payload, "payload!");
        const response: any[] = yield graphQLClient.mutate("deleteFloorPlan", DELETE_FLOOR_PLAN, {
            input: { id: action.payload.id },
        });
        console.log(response, "response?");
        yield put(actions.deleteFloorPlanSuccess(action.payload));
    } catch (error) {
        console.log(error);
        yield put(actions.deleteFloorPlanFailure(error));
    }
}

export function* updateFloorPlan(action: PayloadAction<any>) {
    try {
        console.log(action.payload, "payload!");
        const response: any[] = yield graphQLClient.mutate("updateFloorPlan", UPDATE_FLOOR_PLAN, {
            input: {
                ...action.payload,
                isFromMissingInfo: undefined,
            },
        });
        console.log(response, "response?");
        if (action.payload.isFromMissingInfo) {
            yield put(actions.fetchFloorplanDataStart({ id: action.payload.project_id }));
        } else {
            yield put(
                actions.updateFloorPlanSuccess({
                    response: response,
                    isFromMissingInfo: action.payload.isFromMissingInfo,
                    id: action.payload.id,
                }),
            );
        }
    } catch (error) {
        console.log(error);
        yield put(actions.updateFloorPlanFailure(error));
    }
}

export function* createFloorPlan(action: PayloadAction<any>) {
    try {
        console.log(action.payload, "payload!");
        const response: any[] = yield graphQLClient.mutate("createFloorPlan", CREATE_FLOOR_PLAN, {
            input: action.payload,
        });
        console.log(response, "response?");
        yield put(actions.createFloorPlanSuccess(response));
    } catch (error) {
        console.log(error);
        yield put(actions.createFloorPlanFailure(error));
    }
}

export function* createFlooringSplit(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("", CREATE_FLOORING_SPLIT, {
            id: action.payload.id,
        });
        yield all([
            put(actions.createFlooringSplitSuccess(response)),
            put(commonActions.common.openSnack(addItem("floorplan split"))),
        ]);
        yield put(actions.fetchFloorplanDataStart({ id: action.payload.id }));
    } catch (error) {
        yield all([
            put(actions.createFlooringSplitFailure(error)),
            put(commonActions.common.openSnack(addItemFailure("floorplan split"))),
        ]);
    }
}

export function* updateFlooringSplitTableCount(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate(
            "floorSplits",
            UPDATE_FLOORING_SPLIT_TABLE_COUNT,
            {
                input: {
                    project_id: action.payload.projectId,
                    updated_by: action.payload.updatedBy,
                    mapper: action.payload.mapper,
                },
            },
        );
        yield all([
            put(actions.updateFlooringSplitTableCountSuccess(response)),
            put(commonActions.common.openSnack(updateItem("floorplan split"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.updateFlooringSplitTableCountFailure(error)),
            put(commonActions.common.openSnack(updateItemFailure("floorplan split"))),
        ]);
    }
}

export function* updateInventoryMix(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("floorSplits", UPDATE_INVENTORY_MIX, {
            input: {
                project_id: action.payload.projectId,
                updated_by: action.payload.updatedBy,
                inventory_list: action.payload.inventoryList.map((inventory: any) => ({
                    inventory_name: inventory.inventoryName,
                    floor_plan_counts: inventory.floorplanCounts.map((plan: any) => ({
                        floor_plan_id: plan.floorplanId,
                        count: plan.count,
                    })),
                })),
            },
        });
        yield all([
            put(actions.fetchInventoryMixStart({ id: action.payload.projectId })),
            put(commonActions.common.openSnack(updateItem("inventory mix"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.updateInventoryMixFailure(error)),
            put(commonActions.common.openSnack(updateItemFailure("inventory mix"))),
        ]);
    }
}

export function* deleteMissingInfo(action: PayloadAction<any>) {
    try {
        const response: boolean[] = yield Promise.allSettled(
            action?.payload?.files.map((file: any) => {
                return graphQLClient.mutate("deleteProjectFile", DELETE_PROJECT_FILES, {
                    input: {
                        file_id: file.id,
                        user_id: action.payload.user_id,
                    },
                });
            }),
        );
        yield put(
            actions.DeleteMissingInfoSuccess({
                takeOffType: action.payload?.takeOffType,
                project_id: action?.payload?.project_id,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

export function* refetchMissingInfo(action: PayloadAction<any>) {
    console.log("action.payload?.takeOffType", action.payload?.takeOffType);

    if (action.payload?.takeOffType != "SITE") {
        yield put(
            actions.fetchFloorplanDataStart({
                id: action.payload.project_id,
            }),
        );
    } else {
        yield put(propertiesConsumerActions.fetchPropertyDetailStart(action.payload.project_id));
    }
}
