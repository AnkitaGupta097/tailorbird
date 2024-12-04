import { put, all } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    GET_OWNERSHIP_LIST,
    GET_MDM_CONTAINER_TREE,
    GET_SCOPE_LIBRARIERS_LIST,
    GET_SCOPE_LIBRARY,
    GET_SCOPE_MERGE_RENO_ITEMS_BY_OWNERSHIP,
    GET_PROJECT_MERGE_RENO_ITEMS,
    GET_DEPENDANT_SCOPE_ITEMES,
} from "./scopes-queries";
import actions from "../actions";
import { graphQLClient } from "../../utils/gql-client";
import { commonActions } from "../common";
import { fetchItemFailure } from "../projects/details/budgeting/snack-messages";

// eslint-disable-next-line
export function* fetchOwnershipList(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("getProjectsV2", GET_OWNERSHIP_LIST);
        yield put(actions.scopes.fetchOwnershipListSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line
export function* fetchMDMContainerTree(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("ContainerTree", GET_MDM_CONTAINER_TREE, {
            containerType: action.payload.projectType,
            containerVersion: action.payload.containerVersion,
        });
        yield put(actions.scopes.fetchMDMContainerTreeSuccess(response));
    } catch (error) {
        yield all([
            put(actions.scopes.fetchMDMContainerTreeFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("scopes container tree"))),
        ]);
    }
}

// eslint-disable-next-line
export function* fetchScopeLibrariesList(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "ScopeLibraries",
            GET_SCOPE_LIBRARIERS_LIST,
        );
        yield put(actions.scopes.fetchScopeLibrariesListSuccess(response));
    } catch (error) {
        yield all([
            put(actions.scopes.fetchScopeLibrariesListFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("scopes libraries"))),
        ]);
    }
}

export function* fetchScopeLibrary(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("ScopeLibrary", GET_SCOPE_LIBRARY, {
            id: action.payload.id,
        });
        yield put(actions.scopes.fetchScopeLibrarySuccess(response));
    } catch (error) {
        window.history.replaceState({}, "", "/scopes");
        yield all([
            put(actions.scopes.fetchScopeLibraryFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("scopes library"))),
        ]);
    }
}

// eslint-disable-next-line
export function* fetchMergeRenoItemByOwnership(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "scopeMerge",
            GET_SCOPE_MERGE_RENO_ITEMS_BY_OWNERSHIP,
            {
                organizationId: action.payload.organizationId,
            },
        );
        yield put(actions.scopes.fetchMergeRenoItemByOwnershipSuccess(response));
    } catch (error) {
        yield all([
            put(actions.scopes.fetchMergeRenoItemByOwnershipFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("Ownership Rollups"))),
        ]);
    }
}

// eslint-disable-next-line
export function* fetchMergeRenoItemByProjectId(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "ProjectScopeRollup",
            GET_PROJECT_MERGE_RENO_ITEMS,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(actions.scopes.fetchMergeRenoItemByProjectSuccess(response));
    } catch (error) {
        yield all([
            put(actions.scopes.fetchMergeRenoItemByProjectFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("Project Rollups"))),
        ]);
    }
}

// eslint-disable-next-line
export function* fetchDependantScopeItems(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getDependentScopes",
            GET_DEPENDANT_SCOPE_ITEMES,
        );
        yield put(actions.scopes.fetchDependantScopeItemsSuccess(response));
    } catch (error) {
        yield all([put(actions.scopes.fetchDependantScopeItemsFailure(error))]);
    }
}
