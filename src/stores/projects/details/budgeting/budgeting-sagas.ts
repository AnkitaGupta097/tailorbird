import { commonEntitiesSaga } from "./common-entities/common-entities-sagas";
import { variationsSaga } from "./variation/variation-sagas";
import { baseScopeSaga } from "./base-scope/base-scope-sagas";
import { flooringScopeSaga } from "./flooring-scope/flooring-scope-saga";
import { basePackagesSaga } from "./base-package/base-package-sagas";
import { altPackagesSaga } from "./alt-scope/alt-scope-sagas";
import { actions } from "./budgeting-slice";
import { takeEvery } from "@redux-saga/core/effects";
import { fetchBidBook, createBidBook, saveBidBook } from "./budgeting-api";

export const budgetingSaga = [
    takeEvery(actions.fetchExportDetailsStart.type, fetchBidBook),
    takeEvery(actions.createBidBookStart.type, createBidBook),
    takeEvery(actions.saveBidBookStart.type, saveBidBook),
    ...commonEntitiesSaga,
    ...variationsSaga,
    ...baseScopeSaga,
    ...basePackagesSaga,
    ...altPackagesSaga,
    ...flooringScopeSaga,
];
