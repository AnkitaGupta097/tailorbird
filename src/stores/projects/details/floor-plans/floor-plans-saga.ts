import { takeEvery, takeLatest } from "@redux-saga/core/effects";

import { actions } from "./floor-plans-slice";
import {
    createFlooringSplit,
    updateFlooringSplitTableCount,
    updateInventoryMix,
    createFloorPlan,
    updateFloorPlan,
    deleteFloorPlan,
    deleteMissingInfo,
    refetchMissingInfo,
} from "./floor-plans-mutations-api";
import {
    fetchFloorplanData,
    fetchFloorSplitData,
    fetchInventoryMixData,
    getUserRemark,
    fetchUnitMixData,
} from "./floor-plans-queries-api";
import { createMissingInfo } from "stores/properties-consumer/operation";

export const floorPlansSaga = [
    takeEvery(actions.fetchFloorplanDataStart.type, fetchFloorplanData),
    takeEvery(actions.fetchFloorSplitDataStart.type, fetchFloorSplitData),
    takeEvery(actions.fetchInventoryMixStart.type, fetchInventoryMixData),
    takeEvery(actions.createFlooringSplitStart.type, createFlooringSplit),
    takeEvery(actions.updateFlooringSplitTableCountStart.type, updateFlooringSplitTableCount),
    takeEvery(actions.updateInventoryMixStart.type, updateInventoryMix),
    takeEvery(actions.fetchUnitMixDataStart.type, fetchUnitMixData),
    takeEvery(actions.fetchUserRemarkStart.type, getUserRemark),
    takeEvery(actions.createFloorPlanStart.type, createFloorPlan),
    takeEvery(actions.updateFloorPlanStart.type, updateFloorPlan),
    takeEvery(actions.deleteFloorPlanStart.type, deleteFloorPlan),
    takeEvery(actions.createMissingInfoStart.type, createMissingInfo),
    takeEvery(actions.DeleteMissingInfoStart, deleteMissingInfo),
    takeLatest(actions.DeleteMissingInfoSuccess, refetchMissingInfo),
];
