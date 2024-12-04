import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "../budgeting-slice";
import { fetchBasePackages, getPackageById } from "./base-package-queries-api";
import { addBasePackage, deleteBasePackage } from "./base-package-mutations-api";

export const basePackagesSaga = [
    takeEvery(actions.addBasePackageStart.type, addBasePackage),
    takeEvery(actions.deleteBasePackageStart.type, deleteBasePackage),
    takeEvery(actions.fetchBasePackageStart.type, fetchBasePackages),
    takeEvery(actions.fetchBudgetingDetailsStart.type, fetchBasePackages),
    takeEvery(actions.fetchPackageByIdStart.type, getPackageById),
];
