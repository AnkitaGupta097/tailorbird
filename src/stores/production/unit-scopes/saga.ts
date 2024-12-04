import { takeEvery } from "@redux-saga/core/effects";
import {
    fetchRenoUnitScopes,
    updateUnitScope,
    fetchSingleUnitScope,
    updateUnitScopeItem,
    updateMultipleUnitScopes,
    updateItemPricingGroup,
    addRenoUnitScopeItem,
    deActivateScopeItem,
    activateScopeItem,
    activatePricingGroup,
    deActivatePricingGroup,
} from "./operation";

import { actions } from "./slice";

export const UnitScopesSaga = [
    takeEvery(actions.fetchRenoUnitScopesStart.type, fetchRenoUnitScopes),
    takeEvery(actions.updateUnitScopeStart.type, updateUnitScope),
    takeEvery(actions.fetchSingleUnitScopeStart.type, fetchSingleUnitScope),
    takeEvery(actions.updateUnitScopeItemStart.type, updateUnitScopeItem),
    takeEvery(actions.updateItemPricingGroupStart.type, updateItemPricingGroup),
    takeEvery(actions.deActivateScopeItemStart.type, deActivateScopeItem),
    takeEvery(actions.activateScopeItemStart.type, activateScopeItem),
    takeEvery(actions.activatePricingGroupStart.type, activatePricingGroup),
    takeEvery(actions.deActivatePricingGroupStart.type, deActivatePricingGroup),
    takeEvery(actions.updateMultipleUnitScopesStart.type, updateMultipleUnitScopes),
    takeEvery(actions.addRenovationUnitScopeItemStart.type, addRenoUnitScopeItem),
];
