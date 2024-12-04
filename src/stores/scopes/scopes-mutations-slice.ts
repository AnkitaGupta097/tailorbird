import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../utils/store-helpers";
import { IScopes } from "./scopes-models";

// eslint-disable-next-line
function upsertScopeLibraryStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line
function copyScopeLibraryStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line
function upsertScopeLibrarySuccess(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        showScopeEditor: false,
        loading: false,
    });
}

// eslint-disable-next-line
function upsertScopeLibraryFailure(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line
function deleteScopeLibraryStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line
function deleteScopeLibrarySuccess(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        scopeLibraries: [
            ...state.scopeLibraries.filter((scope: any) => scope.id !== action.payload.id),
        ],
        loading: false,
    });
}

// eslint-disable-next-line
function deleteScopeLibraryFailure(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}
// eslint-disable-next-line
function upsertMergeRenoItemSuccess(state: IScopes, action: PayloadAction<any>) {
    return { ...state, scopeMerge: action.payload, loadingRollup: false };
}
// eslint-disable-next-line
function upsertMergeRenoItemStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingRollup: true,
    });
}
// eslint-disable-next-line
function upsertMergeRenoItemFailure(state: IScopes, action: PayloadAction<any>) {
    return { ...state, loadingRollup: false };
}
// eslint-disable-next-line
function upsertMergeRenoItemByProjectIDSuccess(state: IScopes, action: PayloadAction<any>) {
    return { ...state, projectMerge: action.payload, loadingRollup: false };
}
// eslint-disable-next-line
function upsertProjectMergeRenoItemStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingRollup: true,
    });
}
// eslint-disable-next-line
function upsertMergeRenoItemByProjectIDFailure(state: IScopes, action: PayloadAction<any>) {
    return { ...state, loadingRollup: false };
}
// eslint-disable-next-line
function updateScopeEditorReduxData(state: IScopes, action: PayloadAction<any>) {
    return { ...state, ...action.payload };
}
// eslint-disable-next-line no-unused-vars
function upsertSubcategoryScopeOptionsStart(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingAddNewScope: true,
    });
}
// eslint-disable-next-line
function upsertSubcategoryScopeOptionsFailure(state: IScopes, action: PayloadAction<any>) {
    return { ...state, loadingAddNewScope: false };
}
// eslint-disable-next-line
function upsertSubcategoryScopeOptionsSuccess(state: IScopes, action: PayloadAction<any>) {
    const newScopeContIds = action?.payload?.response.filter((item: any) =>
        action?.payload?.newScopes?.includes(item.scope),
    );
    return updateObject(state, {
        ...state,
        loadingAddNewScope: false,
        newlyAddedScopesContIds: newScopeContIds || [],
    });
}
// eslint-disable-next-line no-unused-vars
function clearNewlyAddedScopeIds(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        newlyAddedScopesContIds: [],
    });
}
// eslint-disable-next-line no-unused-vars
function createNewItemScopesReqDetails(state: IScopes, action: PayloadAction<any>) {
    let updatedNewItemScopesReqData = [...state.createNewItemScopesReqData];
    updatedNewItemScopesReqData.push(action.payload);
    return updateObject(state, {
        ...state,
        createNewItemScopesReqData: updatedNewItemScopesReqData,
    });
}
// eslint-disable-next-line no-unused-vars
function clearNewItemScopesReqDetails(state: IScopes, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        createNewItemScopesReqData: [],
    });
}

export const actions = {
    upsertScopeLibraryStart,
    upsertScopeLibrarySuccess,
    upsertScopeLibraryFailure,
    copyScopeLibraryStart,
    deleteScopeLibraryStart,
    deleteScopeLibrarySuccess,
    deleteScopeLibraryFailure,
    upsertMergeRenoItemByProjectIDSuccess,
    upsertMergeRenoItemStart,
    upsertMergeRenoItemSuccess,
    upsertProjectMergeRenoItemStart,
    updateScopeEditorReduxData,
    upsertMergeRenoItemByProjectIDFailure,
    upsertMergeRenoItemFailure,
    upsertSubcategoryScopeOptionsStart,
    upsertSubcategoryScopeOptionsFailure,
    upsertSubcategoryScopeOptionsSuccess,
    clearNewlyAddedScopeIds,
    createNewItemScopesReqDetails,
    clearNewItemScopesReqDetails,
};
