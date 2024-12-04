import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "../budgeting-slice";
import {
    fetchBaseScopeDetails,
    fetchFloorplanCosts,
    fetchInventories,
    fetchMaterialoptions,
    fetchMaterialsForSearch,
    fetchBaseScopeRenos,
    fetchLaborOptions,
    fetchInventoryDetails,
    getDataSourceNewItems,
} from "./base-scope-queries-api";
import {
    createRenovationItems,
    updateRenovationItems,
    deleteRenovationItems,
    updateInventory,
} from "./base-scope-mutations-api";

export const baseScopeSaga = [
    takeEvery(actions.fetchBaseScopeDetailsStart.type, fetchBaseScopeDetails),
    takeEvery(actions.fetchInventoriesStart.type, fetchInventories),
    takeEvery(actions.fetchBudgetingDetailsStart.type, fetchInventories),
    takeEvery(actions.defineInventoryStart.type, createRenovationItems),
    takeEvery(actions.fetchFloorplanCostsStart.type, fetchFloorplanCosts),
    takeEvery(actions.fetchMaterialOptionsStart.type, fetchMaterialoptions),
    takeEvery(actions.fetchLaborOptionsStart.type, fetchLaborOptions),
    takeEvery(actions.fetchMaterialsForSearchStart.type, fetchMaterialsForSearch),
    takeEvery(actions.updateInventoryStart.type, updateInventory),
    takeEvery(actions.deleteInventoryStart.type, deleteRenovationItems),
    takeEvery(actions.fetchBaseScopeRenosStart.type, fetchBaseScopeRenos),
    takeEvery(actions.fetchInventoryDetailsStart, fetchInventoryDetails),
    takeEvery(actions.updateRenovationItemStart, updateRenovationItems),
    takeEvery(actions.fetchDataSourceNewItemsStart, getDataSourceNewItems),
];
