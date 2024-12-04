import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./slice";
import {
    createPackage,
    fetchPackages,
    updatePKGErrorState,
    updatePackageMetaData,
} from "./operation";

export const saga = [
    takeEvery(actions.fetchPackagesStart.type, fetchPackages),
    takeEvery(actions.createPackageStart.type, createPackage),
    takeEvery(actions.updatePackageErrorStateStart.type, updatePKGErrorState),
    takeEvery(actions.updatePackageMetaDataStart.type, updatePackageMetaData),
];
