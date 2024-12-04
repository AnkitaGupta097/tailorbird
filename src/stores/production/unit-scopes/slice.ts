import { updateObject } from "../../../utils/store-helpers";
import initialState from "./unit-scopes-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, entries, findIndex, forEach } from "lodash";
import { IUnitScopeState } from "./interfaces";

const initState: any = cloneDeep(initialState);

/* eslint-disable no-unused-vars */
function fetchRenoUnitScopesStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchSingleUnitScopeStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchSingleUnitScopeSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    const scopeId = action.payload.scopeId;
    const updatedScope = action.payload.scope;
    const renoUnitId = updatedScope.reno_unit_id;
    const scopes = state.unitScopes[renoUnitId]?.map((scope) => {
        if (scope.id == scopeId) {
            return updatedScope;
        }
        return scope;
    });

    return updateObject(state, {
        loading: false,
        unitScopes: updateObject(state.unitScopes, { [renoUnitId]: scopes || [] }),
    });
}

function updateScope(state: IUnitScopeState, action: PayloadAction<any>) {
    const scopeId = action.payload.scopeId;
    const updatedScope = action.payload.scope;
    const renoUnitId = updatedScope.reno_unit_id;
    if (state.unitScopes[renoUnitId]) {
        const scopes = state.unitScopes[renoUnitId]?.map((scope) => {
            if (scope.id == scopeId) {
                return updatedScope;
            }
            return scope;
        });

        return updateObject(state, {
            loading: false,
            unitScopes: updateObject(state.unitScopes, { [renoUnitId]: scopes || [] }),
        });
    }
    return updateObject(state, {
        loading: false,
    });
}

function updateItems(state: IUnitScopeState, action: PayloadAction<any>) {
    const itemsByUnit = action.payload.itemsByUnit;
    const previousScopes = JSON.parse(JSON.stringify(state.unitScopes));

    forEach(entries(itemsByUnit), ([unitId, value]: any) => {
        forEach(value, (item) => {
            const index = findIndex(previousScopes[unitId], { id: item.unit_scope_id });
            if (index !== -1) {
                const itemIndex = findIndex(previousScopes[unitId][index].items, { id: item.id });
                if (itemIndex !== -1) {
                    // Update the item
                    previousScopes[unitId][index].items[itemIndex].status = item.status;
                }
            }
        });
    });

    return updateObject(state, { unitScopes: previousScopes });
}

function updatePricingGroupAndItems(state: IUnitScopeState, action: PayloadAction<any>) {
    const pricingGroupByUnit = action.payload.pricingGroupByUnit;
    const previousScopes = JSON.parse(JSON.stringify(state.unitScopes));

    forEach(entries(pricingGroupByUnit), ([unitId, value]: any) => {
        forEach(value, (pricingGroup) => {
            const index = findIndex(previousScopes[unitId], { id: pricingGroup.unit_scope_id });
            if (index !== -1) {
                const pricingGroupIndex = findIndex(previousScopes[unitId][index].items, {
                    pricing_group_id: pricingGroup.id,
                });
                if (pricingGroupIndex !== -1) {
                    // Update the pricing group status
                    previousScopes[unitId][index].items[pricingGroupIndex].status =
                        pricingGroup.status;

                    // Update status of items belonging to pricing group
                    previousScopes[unitId][index].items[pricingGroupIndex].groups = previousScopes[
                        unitId
                    ][index].items[pricingGroupIndex].groups.map((item: any) => {
                        return {
                            ...item,
                            status: pricingGroup.status,
                        };
                    });
                }
            }
        });
    });

    return updateObject(state, { unitScopes: previousScopes });
}

function updateUnitScopeStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function updateMultipleUnitScopesStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function activateScopeItemStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function activateScopeItemSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function activateScopeItemFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function deActivateScopeItemStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function deActivateScopeItemSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function deActivateScopeItemFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function activatePricingGroupStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function activatePricingGroupSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function activatePricingGroupFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function deActivatePricingGroupStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function deActivatePricingGroupSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function deActivatePricingGroupFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function updateUnitScopeItemStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function addRenovationUnitScopeItemStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function updateItemPricingGroupStart(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchRenoUnitScopesSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    const unitScopes = action.payload.unitScopes;
    const renoUnitId = action.payload.renoUnitId;
    const unitScopesCurrentData = state.unitScopes;

    return updateObject(state, {
        loading: false,
        unitScopes: updateObject(unitScopesCurrentData, { [renoUnitId]: unitScopes }),
    });
}

function fetchRenoUnitScopesFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function updateUnitScopeFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function addRenovationUnitScopeItemFailure(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function addRenovationUnitScopeItemSuccess(state: IUnitScopeState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

//helper function
// function getUpdatedRenoUnits(state: IUnitScopeState, action: PayloadAction<any>) {
//     const renoUnitId = action.payload.renoUnitId;
//     const response = action.payload.updatedRenoUnit;
//     const currentProjectRenoUnits = state?.renoUnits;

//     const updatedUnits = currentProjectRenoUnits?.map((renoUnit: any) => {
//         if (renoUnit.id === renoUnitId) {
//             const updatedRenoUnit = {
//                 ...renoUnit,
//                 renovation_start_date: response?.renovation_start_date,
//                 renovation_end_date: response?.renovation_end_date,
//                 move_out_date: response?.move_out_date,
//                 make_ready_date: response?.make_ready_date,
//                 move_in_date: response?.move_in_date,
//                 status: response?.status,
//             };
//             return updatedRenoUnit;
//         }
//         return renoUnit;
//     });
//     return updatedUnits;
// }

function resetState() {
    return initState;
}

const slice = createSlice({
    name: "UnitScopes",
    initialState: initState,
    reducers: {
        fetchRenoUnitScopesStart,
        fetchSingleUnitScopeStart,
        fetchRenoUnitScopesSuccess,
        fetchRenoUnitScopesFailure,
        fetchSingleUnitScopeSuccess,
        updateScope,
        updateUnitScopeStart,
        addRenovationUnitScopeItemStart,
        addRenovationUnitScopeItemSuccess,
        updateMultipleUnitScopesStart,
        updateUnitScopeItemStart,
        updateItems,
        updatePricingGroupAndItems,
        activateScopeItemStart,
        activateScopeItemSuccess,
        activateScopeItemFailure,
        deActivateScopeItemStart,
        deActivateScopeItemSuccess,
        deActivateScopeItemFailure,
        activatePricingGroupStart,
        activatePricingGroupSuccess,
        activatePricingGroupFailure,
        deActivatePricingGroupStart,
        deActivatePricingGroupSuccess,
        deActivatePricingGroupFailure,
        updateItemPricingGroupStart,
        updateUnitScopeFailure,
        addRenovationUnitScopeItemFailure,
        resetState,
    },
});

export const actions = slice.actions;

export default slice.reducer;
