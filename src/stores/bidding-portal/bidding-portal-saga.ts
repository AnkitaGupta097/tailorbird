import { takeEvery } from "@redux-saga/core/effects";
import { actions } from "./bidding-portal-slice";
import {
    createBidItemsForContractor,
    fetchBidItems,
    lockProjectForEditing,
    syncStoreWithApi,
    unlockProject,
    createAlternateItem,
    editAlternateItem,
    deleteAlternateItem,
    fetchBidItemsHistory,
    combineLineItems,
    uncombineLineItems,
    updateUnitOfMeasure,
    updateComboName,
    fetchDiffFromRenovationVersion,
    fetchHistoricalPricingData,
} from "./bidding-portal-operations";

export const BiddingPortalSaga = [
    takeEvery(actions.fetchBidItemsHistoryStart, fetchBidItemsHistory),
    takeEvery(actions.fetchBidItemsStart, fetchBidItems),
    takeEvery(actions.syncStoreWithApiStart, syncStoreWithApi),
    takeEvery(actions.lockProjectForEditingStart.type, lockProjectForEditing),
    takeEvery(actions.unlockProjectForEditingStart.type, unlockProject),
    takeEvery(actions.createBidItemsForContractorStart.type, createBidItemsForContractor),
    takeEvery(actions.createAlternateItemStart.type, createAlternateItem),
    takeEvery(actions.editAlternateItemStart.type, editAlternateItem),
    takeEvery(actions.deleteAlternateItemStart.type, deleteAlternateItem),
    takeEvery(actions.combineLineItemsStart.type, combineLineItems),
    takeEvery(actions.uncombineLineItemsStart.type, uncombineLineItems),
    takeEvery(actions.updateUnitOfMeasureStart.type, updateUnitOfMeasure),
    takeEvery(actions.updateComboNameStart.type, updateComboName),
    takeEvery(actions.fetchDiffFromRenovationVersionStart.type, fetchDiffFromRenovationVersion),
    takeEvery(actions.fetchHistoricalPricingDataStart.type, fetchHistoricalPricingData),
];
