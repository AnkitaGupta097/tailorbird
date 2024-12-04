import { put, all } from "@redux-saga/core/effects";
import {
    GET_ALL_BASE_SCOPE_DETAILS,
    GET_ALL_INVENTORIES,
    GET_ALL_FLOORPLAN_COSTS,
    GET_ALL_MATERIAL_OPTIONS,
    GET_BASE_SCOPE_ITEMS,
    GET_EDIT_BASE_SCOPE_DETAILS,
    GET_ALL_LABOR_OPTIONS,
    GET_DATA_SOURCE_NEW_ITEMS,
} from "./base-scope-queries";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { client } from "../../../../gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { fetchItemFailure } from "../snack-messages";

interface baseScopeResponse {
    baseScopeDetails: any[];
}

interface inventoryDetails {
    baseScopeDetails: {
        id: string;
        name: string;
        summary: string;
        baseScopeId: string;
        data: any[];
    };
}

export function* fetchBaseScopeDetails(action: PayloadAction<any>) {
    try {
        const response: baseScopeResponse = yield graphQLClient.query(
            "",
            GET_ALL_BASE_SCOPE_DETAILS,
            {
                project_id: action.payload.projectId,
                scope_id: action.payload.scopeId,
            },
        );
        let res = {
            baseScopeDetails: response.baseScopeDetails.map((category: any) => {
                let categoryCopy = {
                    ...category,
                    items: category.items.map((item: any) => {
                        let itemCopy = {
                            ...item,
                            scopes: item.scopes.map((scope: any) => {
                                return merge({}, scope, { isSelected: scope.isBase });
                            }),
                        };
                        return merge({}, itemCopy, {
                            isSelected: item.scopes.some((sc: any) => sc.isBase),
                        });
                    }),
                };
                return merge({}, categoryCopy, {
                    isSelected: categoryCopy.items.some((cc: any) => cc.isSelected),
                }); // !!category.items.length
            }),
        };
        yield put(actions.budgeting.fetchBaseScopeDetailsSuccess(res));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchBaseScopeDetailsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("base scope tree"))),
        ]);
    }
}

export function* fetchInventories(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_INVENTORIES, {
            projectId: action.payload.projectId,
        });
        yield put(actions.budgeting.fetchInventoriesSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchInventoriesFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("base scope inventories"))),
        ]);
    }
}

export function* getDataSourceNewItems(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_DATA_SOURCE_NEW_ITEMS, {
            projectId: action.payload.projectId,
        });
        yield put(actions.budgeting.fetchDataSourceNewItemsSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchFloorplanCosts(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_FLOORPLAN_COSTS, {
            renovationId: action.payload.renovationId,
        });
        yield put(actions.budgeting.fetchFloorplanCostsSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchFloorplanCostsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("base scope floorplan costs"))),
        ]);
    }
}

export function* fetchMaterialoptions(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_MATERIAL_OPTIONS, {
            input: {
                category: action.payload.category,
                subcategory: action.payload.subcategory,
                package_id: action.payload.packageId,
                version: action.payload.version,
            },
        });
        yield put(actions.budgeting.fetchMaterialOptionsSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchMaterialOptionsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("base scope skus"))),
        ]);
    }
}

export function* fetchLaborOptions(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_LABOR_OPTIONS, {
            input: {
                category: action.payload.category,
                subcategory: action.payload.subcategory,
                package_id: action.payload.packageId,
                version: action.payload.version,
            },
        });
        yield put(actions.budgeting.fetchLaborOptionsSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchLaborOptionsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("base scope skus"))),
        ]);
    }
}

export function* fetchMaterialsForSearch(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_MATERIAL_OPTIONS, {
            input: {
                category: action.payload.category,
                subcategory: action.payload.subcategory,
                description: action.payload.description,
                version: action.payload.version,
            },
        });
        yield put(actions.budgeting.fetchMaterialsForSearchSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchMaterialsForSearchFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("base scope sku search"))),
        ]);
    }
}

export function* fetchBaseScopeRenos(action: PayloadAction<any>) {
    try {
        const response: any[] = yield client.query("renovations", GET_BASE_SCOPE_ITEMS, {
            project_id: action.payload.projectId,
        });
        yield put(actions.budgeting.fetchBaseScopeRenosSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchBaseScopeRenosFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("renovation items in base scope"))),
        ]);
    }
}

export function* fetchInventoryDetails(action: PayloadAction<any>) {
    try {
        const response: inventoryDetails = yield graphQLClient.query(
            "",
            GET_EDIT_BASE_SCOPE_DETAILS,
            {
                inventoryDetailsId: action.payload.inventoryDetailsId,
            },
        );
        let res = {
            baseScopeDetails: response.baseScopeDetails.data.map((category: any) => {
                let categoryCopy = {
                    ...category,
                    items: category.items.map((item: any) => {
                        let itemCopy = {
                            ...item,
                            scopes: item.scopes.map((scope: any) => {
                                return merge({}, scope, { isSelected: scope.isBase });
                            }),
                        };
                        return merge({}, itemCopy, { isSelected: !item.excluded });
                    }),
                };
                return merge({}, categoryCopy, { isSelected: !!category.items.length });
            }),
        };
        yield put(actions.budgeting.fetchInventoryDetailsSuccess(res));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchInventoryDetailsFailure(error)),
            put(
                actions.common.openSnack(
                    fetchItemFailure("Unable to fetch base scope inventory details"),
                ),
            ),
        ]);
    }
}
