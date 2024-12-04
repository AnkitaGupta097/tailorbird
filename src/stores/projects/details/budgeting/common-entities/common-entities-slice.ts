import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import initAjaxState from "../../../../common/models/initAjaxState.json";

export const commonEntities = {
    ...initAjaxState,
    packages: [],
    scopes: [],
    budgetMetadata: {
        isAltScopeDefined: false,
        isFlooringScopeDefined: false,
        isFloorSplit: false,
    },
    isOneOfEach: false,
    overallWavg: 0,
    selectedInv: null,
};

// eslint-disable-next-line
function fetchCommonEntitiesStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: true,
        },
    });
}

function fetchCommonEntitiesSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: false,
            packages: action.payload?.packages,
            scopes: action.payload?.scopeLibraries,
        },
    });
}

function fetchCommonEntitiesFailure(state: IBudgeting) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: false,
        },
    });
}

function fetchBudgetMetadataStart(state: IBudgeting) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: true,
        },
    });
}

function fetchBudgetMetadataSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: false,
            budgetMetadata: {
                ...state.commonEntities.budgetMetadata,
                ...action.payload.meta,
            },
        },
    });
}

function fetchBudgetMetadataFailure(state: IBudgeting) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: false,
        },
    });
}

function removeCommonBasePackage(state: IBudgeting, action: PayloadAction<any>) {
    const packageIndex = state.commonEntities.packages.findIndex((t) => (t.id = action.payload));

    return updateObject(state, {
        commonEntities: updateObject(state.commonEntities, {
            packages: state.commonEntities.packages.splice(packageIndex, 1),
        }),
    });
}

function clearBudgetingMetaData(state: IBudgeting) {
    return updateObject(state, {
        commonEntities: updateObject(state.commonEntities, {
            budgetMetadata: updateObject(
                state.commonEntities.budgetMetadata,
                commonEntities.budgetMetadata,
            ),
        }),
    });
}

function updateOneOfEach(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            isOneOfEach: action.payload.isOneOfEach,
        },
    });
}
function updateOverallWavg(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            overallWavg: action.payload.overallWavg,
        },
    });
}
function updateCurrentInv(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            selectedInv: action.payload.selectedInv,
        },
    });
}

export const actions = {
    fetchCommonEntitiesStart,
    fetchCommonEntitiesSuccess,
    fetchCommonEntitiesFailure,
    fetchBudgetMetadataStart,
    fetchBudgetMetadataSuccess,
    fetchBudgetMetadataFailure,
    removeCommonBasePackage,
    clearBudgetingMetaData,
    updateOneOfEach,
    updateOverallWavg,
    updateCurrentInv,
};
