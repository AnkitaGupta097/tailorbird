import { takeEvery } from "@redux-saga/core/effects";

import {
    fetchVariationDetails,
    fetchVariations,
    fetchVariationInitItems,
    fetchFloorplans,
} from "./variation-queries-api";
import {
    createVariation,
    updateVariationDetails,
    deleteVariations,
} from "./variation-mutations-api";
import { actions } from "../budgeting-slice";

export const variationsSaga = [
    takeEvery(actions.fetchVariationDetailsStart.type, fetchVariationDetails),
    takeEvery(actions.updateVariationDetailsStart.type, updateVariationDetails),
    takeEvery(actions.createVariationDetailsStart.type, createVariation),
    takeEvery(actions.fetchVariationsStart.type, fetchVariations),
    takeEvery(actions.deleteVariationsStart.type, deleteVariations),
    takeEvery(actions.fetchVariationInitItemsStart.type, fetchVariationInitItems),
    takeEvery(actions.fetchFloorplansStart.type, fetchFloorplans),
    takeEvery(actions.fetchBudgetingDetailsStart.type, fetchVariations),
];
