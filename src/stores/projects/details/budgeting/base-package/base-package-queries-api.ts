import { put, all } from "@redux-saga/core/effects";
import { GET_PROJECT_BASE_PACKAGE, GET_PACKAGE_BY_ID } from "./base-package-queries";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { fetchItemFailure } from "../snack-messages";
import { PayloadAction } from "@reduxjs/toolkit";

export function* fetchBasePackages(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_PROJECT_BASE_PACKAGE, {
            projectId: action.payload.projectId,
        });
        yield all([
            put(actions.budgeting.fetchBasePackageSuccess(response)), // @ts-ignore
            put(actions.budgeting.fetchPackageByIdStart(response.basePackage.id)),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchBasePackageFailure()),
            put(actions.common.openSnack(fetchItemFailure("base package"))),
        ]);
    }
}

export function* getPackageById(action: PayloadAction<any>) {
    try {
        const res: any[] = yield graphQLClient.query("", GET_PACKAGE_BY_ID, {
            input: action.payload,
        });
        yield all([
            // @ts-ignore
            put(actions.budgeting.fetchPackageByIdSuccess(res.getPackage.materials)),
            put(actions.budgeting.createNewItemLoader(null)),
        ]);
    } catch (error) {
        console.log(error);
    }
}
