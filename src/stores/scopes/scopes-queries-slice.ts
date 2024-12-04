/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../utils/store-helpers";
import { IScopes } from "./scopes-models";

// const initialState: IScopes = _.cloneDeep(initState);

function fetchOwnershipListStart(state: IScopes, action: PayloadAction<any>) {
    return state;
}

function fetchOwnershipListSuccess(state: IScopes, action: PayloadAction<any>) {
    return state;
}

function fetchOwnershipListFailure(state: IScopes, action: PayloadAction<any>) {
    return state;
}

function fetchMDMContainerTreeStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchMDMContainerTreeSuccess(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        containerTree: action.payload.containerTree,
        showScopeEditor: true,
    });
}

function fetchMDMContainerTreeFailure(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchScopeLibrariesListStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchScopeLibrariesListSuccess(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        scopeLibraries: action.payload.scopeLibraries,
    });
}

function fetchScopeLibrariesListFailure(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchScopeLibraryStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchScopeLibrarySuccess(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        loading: false,
        scopeContainerTree: action.payload.scopeLibrary,
        showScopeEditor: true,
    });
}

function fetchScopeLibraryFailure(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function hideScopeEdit(state: IScopes) {
    return updateObject(state, {
        ...state,
        showScopeEditor: false,
        loading: false,
    });
}

function fetchMergeRenoItemByOwnershipStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingRollup: true,
    });
}
function fetchMergeRenoItemByOwnershipSuccess(state: IScopes, action: PayloadAction<any>) {
    return { ...state, scopeMerge: action.payload.scopeMergeRenoItem, loadingRollup: false };
}
function fetchMergeRenoItemByOwnershipFailure(state: IScopes, action: PayloadAction<any>) {
    return { ...state, scopeMerge: null };
}

function fetchMergeRenoItemByProjectStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingRollup: true,
    });
}
function fetchMergeRenoItemByProjectSuccess(state: IScopes, action: PayloadAction<any>) {
    return {
        ...state,
        projectMerge: action.payload.projectMergeRenoItem,
        loadingRollup: false,
    };
}
function fetchMergeRenoItemByProjectFailure(state: IScopes, action: PayloadAction<any>) {
    return { ...state, projectMerge: null, loadingRollup: false };
}

function fetchDependantScopeItemsStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchDependantScopeItemsSuccess(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        dependantScopeItems: action.payload.getDependentScopes,
    });
}
function fetchDependantScopeItemsFailure(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

export const actions = {
    fetchOwnershipListStart,
    fetchOwnershipListSuccess,
    fetchOwnershipListFailure,
    fetchMDMContainerTreeStart,
    fetchMDMContainerTreeSuccess,
    fetchMDMContainerTreeFailure,
    fetchScopeLibrariesListStart,
    fetchScopeLibrariesListSuccess,
    fetchScopeLibrariesListFailure,
    fetchScopeLibraryStart,
    fetchScopeLibrarySuccess,
    fetchScopeLibraryFailure,
    hideScopeEdit,
    fetchMergeRenoItemByOwnershipSuccess,
    fetchMergeRenoItemByOwnershipFailure,
    fetchMergeRenoItemByOwnershipStart,
    fetchMergeRenoItemByProjectSuccess,
    fetchMergeRenoItemByProjectStart,
    fetchMergeRenoItemByProjectFailure,
    fetchDependantScopeItemsSuccess,
    fetchDependantScopeItemsFailure,
    fetchDependantScopeItemsStart,
};
