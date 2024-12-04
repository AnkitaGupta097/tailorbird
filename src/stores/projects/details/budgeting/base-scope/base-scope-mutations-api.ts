import { put, all, delay } from "@redux-saga/core/effects";
import {
    UPDATE_INVENTORY,
    DEFINE_INVENTORY,
    UNDEFINED_INVENTORY,
    UPDATE_RENOVATION_ITEMS,
    UPDATE_SCOPE_OF_EXISTING_ITEM,
} from "./base-scope-mutations";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    addItem,
    addItemFailure,
    removeItem,
    removeItemFailure,
    updateItem,
    updateItemFailure,
} from "../snack-messages";

export function* createRenovationItems(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("renovations", DEFINE_INVENTORY, {
            payload: {
                project_id: action.payload.projectId,
                inventory_id: action.payload.inventoryId,
                summary: action.payload.summary ?? "",
                base_scope_id: action.payload.baseScopeId,
                base_package_id: action.payload.basePackageId ?? "",
                data: action.payload.data,
                created_by: action.payload.createdBy,
            },
        });
        yield all([
            put(actions.budgeting.defineInventorySuccess({ renovations: response })),
            // put(
            //     actions.budgeting.fetchFlooringRenoItemsStart({
            //         projectId: action.payload.projectId,
            //     }),
            // ),
            put(actions.budgeting.fetchInventoriesStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(addItem("base scope inventory definition"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.defineInventoryFailure(error)),
            put(actions.common.openSnack(addItemFailure("base scope inventory definition"))),
        ]);
    }
}

export function* updateInventory(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("renovations", UPDATE_INVENTORY, {
            payload: {
                inventory_id: action.payload.inventoryId,
                summary: action.payload.summary,
                base_package_id: action.payload.basePackageId,
                data: action.payload.data,
                updated_by: action.payload.updatedBy,
            },
        });
        if (action.payload.scopeType === "flooringScope") {
            yield put(
                actions.budgeting.upsertGroupStart({
                    ...action.payload.flooringTakeOffs,
                    scopeType: action.payload.scopeType,
                    currentInv: action.payload.currentInv,
                }),
            );
        } else {
            yield all([
                put(
                    actions.budgeting.fetchFlooringRenoItemsStart({
                        projectId: action.payload.projectId,
                    }),
                ),
                put(
                    actions.budgeting.fetchBaseScopeRenosStart({
                        projectId: action.payload.projectId,
                    }),
                ),
            ]);

            yield all([
                put(actions.budgeting.updateInventorySuccess()),
                put(
                    actions.budgeting.fetchInventoriesStart({
                        projectId: action.payload.projectId,
                    }),
                ),
                put(actions.common.openSnack(updateItem("base scope inventory definition"))),
            ]);
        }
    } catch (error) {
        yield all([
            put(actions.budgeting.updateInventoryFailure(error)),
            put(actions.common.openSnack(updateItemFailure("base scope inventory definition"))),
        ]);
    }
}

export function* deleteRenovationItems(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("renovation", UNDEFINED_INVENTORY, {
            inventoryId: action.payload.id,
        });
        yield all([
            put(actions.budgeting.deleteInventorySuccess({ id: action.payload.id })),
            put(actions.budgeting.fetchInventoriesStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(removeItem("base scope inventory definition"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.deleteInventoryFailure(error)),
            put(actions.common.openSnack(removeItemFailure("base scope inventory definition"))),
        ]);
    }
}

export function* updateRenovationItems(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("renovation", UPDATE_RENOVATION_ITEMS, {
            input: [
                {
                    reno_id: action.payload.id,
                    ...(action.payload.removeSku ? { remove_sku: action.payload.removeSku } : {}),
                    ...(action.payload.skuId ? { sku_id: action.payload.skuId } : {}),
                    work_price: action.payload.workPrice,
                },
            ],
        });
        yield all([
            put(actions.budgeting.updateRenovationItemSuccess(action.payload)),
            put(actions.common.openSnack(updateItem("sku details"))),
        ]);
        yield delay(1500);
        yield put(actions.budgeting.stopFlashingRenovationItem(action.payload));
    } catch (error) {
        yield all([
            put(actions.budgeting.updateRenovationItemFailure(error)),
            put(actions.common.openSnack(updateItemFailure("sku details"))),
        ]);
    }
}
export function* updateScopeOptionsOfItem(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("createNewItem", UPDATE_SCOPE_OF_EXISTING_ITEM, {
            input: action.payload.reqData,
        });
    } catch (error) {
        console.log("error", error);
    }
}
