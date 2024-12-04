import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "../budgeting-slice";
import {
    addAltPackage,
    editAltPackage,
    deleteAltPackage,
    fetchAltPackages,
    fetchAltPackage,
    fetchScopeTreeForAltScope,
    createAltScope,
    editAltScope,
    deleteAltScope,
    fetchEditAltScopeTree,
    fetchAltScope,
} from "./alt-scope-api";

export const altPackagesSaga = [
    takeEvery(actions.addAltPackageStart.type, addAltPackage),
    takeEvery(actions.editAltPackageStart.type, editAltPackage),
    takeEvery(actions.deleteAltPackageStart.type, deleteAltPackage),
    takeEvery(actions.fetchAltPackageStart.type, fetchAltPackage),
    takeEvery(actions.fetchAltPackagesStart.type, fetchAltPackages),
    takeEvery(actions.fetchAltScopeTreeStart.type, fetchScopeTreeForAltScope),
    takeEvery(actions.createAltScopeStart.type, createAltScope),
    takeEvery(actions.deleteAltScopeStart.type, deleteAltScope),
    takeEvery(actions.fetchAltScopeEditTreeStart.type, fetchEditAltScopeTree),
    takeEvery(actions.updateAltScopeStart.type, editAltScope),
    takeEvery(actions.fetchAltScopeStart.type, fetchAltScope),
];
