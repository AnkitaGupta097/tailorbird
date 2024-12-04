import { put, all } from "@redux-saga/core/effects";
import {
    UPSERT_SCOPE_LIBRARY,
    COPY_SCOPE_LIBRARY,
    DELETE_SCOPE_LIBRARY,
    UPSERT_SCOPE_MERGE,
    UPSERT_PROJECT_MERGE_RENO_ITEM,
    CREATE_NEW_SCOPE_FOR_AN_SUBCAT_ITEM,
} from "./scopes-mutations";
import actions from "../actions";
import { commonActions } from "../common";
import { PayloadAction } from "@reduxjs/toolkit";
import { graphQLClient } from "../../utils/gql-client";
import {
    addItem,
    addItemFailure,
    removeItem,
    removeItemFailure,
} from "../projects/details/budgeting/snack-messages";

export function* upsertScopeLibrary(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("scopeLibrary", UPSERT_SCOPE_LIBRARY, {
            payload: {
                id: action.payload.id,
                scope_type: action.payload.type,
                ownership_group_id: action.payload.ownership,
                name: action.payload.name,
                description: action.payload.description,
                container_item_ids: action.payload.data,
                created_by: action.payload.createdBy,
                project_type: action.payload.projectType,
                container_version: action.payload.containerVersion,
            },
        });
        yield all([
            put(actions.scopes.upsertScopeLibrarySuccess(response)),
            put(actions.scopes.fetchScopeLibrariesListStart({})),
            put(commonActions.openSnack(addItem("scope library"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.scopes.upsertScopeLibraryFailure(error)),
            put(commonActions.openSnack(addItemFailure("scope library"))),
        ]);
    }
}

export function* copyScopeLibrary(action: PayloadAction<any>) {
    try {
        // eslint-disable-next-line
        const response: any[] = yield graphQLClient.mutate("scopeLibrary", COPY_SCOPE_LIBRARY, {
            payload: {
                id: action.payload.id,
                created_by: action.payload.createdBy,
            },
        });
        yield all([
            put(actions.scopes.fetchScopeLibrariesListStart({})),
            put(commonActions.openSnack(addItem("scope library"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.scopes.upsertScopeLibraryFailure(error)),
            put(commonActions.openSnack(addItemFailure("scope library"))),
        ]);
    }
}

export function* deleteScopeLibrary(action: PayloadAction<any>) {
    try {
        // eslint-disable-next-line
        const response: any[] = yield graphQLClient.mutate(
            "DeleteScopeLibrary",
            DELETE_SCOPE_LIBRARY,
            {
                deleteScopeLibraryId: action.payload.id,
            },
        );
        yield all([
            put(actions.scopes.deleteScopeLibrarySuccess({ id: action.payload.id })),
            put(commonActions.openSnack(removeItem("scope library"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.scopes.deleteScopeLibraryFailure(error)),
            put(commonActions.openSnack(removeItemFailure("scope library"))),
        ]);
    }
}

export function* upsertMergeRenoItemConfig(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate(
            "upsertMergeRenoItem",
            UPSERT_SCOPE_MERGE,
            {
                payload: action.payload,
            },
        );
        yield all([
            put(actions.scopes.upsertMergeRenoItemSuccess(response)),
            put(commonActions.openSnack(addItem("Rollup Configuration"))),
        ]);
    } catch (error) {
        yield all([
            put(commonActions.openSnack(addItemFailure("Rollup Configuration"))),
            put(actions.scopes.upsertMergeRenoItemFailure(error)),
        ]);
    }
}
export function* upsertMergeRenoItemByProjectId(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate(
            "upsertProjectMergeRenoItem",
            UPSERT_PROJECT_MERGE_RENO_ITEM,
            {
                payload: action.payload,
            },
        );
        yield all([
            put(actions.scopes.upsertMergeRenoItemByProjectIDSuccess(response)),
            put(commonActions.openSnack(addItem("Project Rollup Configuration"))),
        ]);
    } catch (error) {
        yield all([
            put(commonActions.openSnack(addItemFailure("Rollup Configuration"))),
            put(actions.scopes.upsertMergeRenoItemByProjectIDFailure(error)),
        ]);
    }
}
export function* upsertSubcategoryScopeOptions(action: PayloadAction<any>) {
    try {
        console.log("req", action.payload);

        const response: any[] = yield graphQLClient.mutate(
            "createContainerItemV2",
            CREATE_NEW_SCOPE_FOR_AN_SUBCAT_ITEM,
            {
                input: action.payload.reqData,
            },
        );

        yield all([
            put(
                actions.scopes.upsertSubcategoryScopeOptionsSuccess({
                    response: response,
                    newScopes: action.payload.newScopes,
                }),
            ),
        ]);
    } catch (error) {
        console.log("error adding scope option", error);
        yield all([
            put(commonActions.openSnack(addItemFailure("new scope options"))),
            put(actions.scopes.upsertSubcategoryScopeOptionsFailure(error)),
        ]);
    }
}
