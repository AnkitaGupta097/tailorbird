import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./scopes-slice";
import {
    fetchOwnershipList,
    fetchMDMContainerTree,
    fetchScopeLibrariesList,
    fetchScopeLibrary,
    fetchMergeRenoItemByOwnership,
    fetchMergeRenoItemByProjectId,
    fetchDependantScopeItems,
} from "./scopes-queries-api";
import {
    upsertScopeLibrary,
    copyScopeLibrary,
    deleteScopeLibrary,
    upsertMergeRenoItemConfig,
    upsertMergeRenoItemByProjectId,
    upsertSubcategoryScopeOptions,
} from "./scopes-mutations-api";

export const scopesSaga = [
    takeEvery(actions.fetchOwnershipListStart.type, fetchOwnershipList),
    takeEvery(actions.fetchMDMContainerTreeStart.type, fetchMDMContainerTree),
    takeEvery(actions.fetchScopeLibrariesListStart.type, fetchScopeLibrariesList),
    takeEvery(actions.fetchScopeLibraryStart.type, fetchScopeLibrary),
    takeEvery(actions.upsertScopeLibraryStart.type, upsertScopeLibrary),
    takeEvery(actions.copyScopeLibraryStart.type, copyScopeLibrary),
    takeEvery(actions.deleteScopeLibraryStart.type, deleteScopeLibrary),
    takeEvery(actions.fetchMergeRenoItemByOwnershipStart.type, fetchMergeRenoItemByOwnership),
    takeEvery(actions.fetchMergeRenoItemByProjectStart.type, fetchMergeRenoItemByProjectId),
    takeEvery(actions.upsertMergeRenoItemStart.type, upsertMergeRenoItemConfig),
    takeEvery(actions.upsertProjectMergeRenoItemStart.type, upsertMergeRenoItemByProjectId),
    takeEvery(actions.fetchDependantScopeItemsStart.type, fetchDependantScopeItems),
    takeEvery(actions.upsertSubcategoryScopeOptionsStart.type, upsertSubcategoryScopeOptions),
];
