import { put, all } from "@redux-saga/core/effects";
import { GET_FLOORING_TAKEOFFS, GET_RENOVATION_ITEMS } from "./flooring-scope-queries";
import { actions } from "../budgeting-slice";
import { commonActions } from "../../../../common";
import { graphQLClient } from "../../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { fetchItemFailure } from "../snack-messages";

export function* fetchFlooringRenoItems(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_RENOVATION_ITEMS, {
            projectId: action.payload.projectId,
        });
        yield put(actions.fetchFlooringRenoItemsSuccess(response));
    } catch (error) {
        yield all([put(actions.fetchFlooringRenoItemsFailure(error))]);
    }
}

export function* fetchFlooringTakeOffs(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_FLOORING_TAKEOFFS, {
            projectId: action.payload.projectId,
        });
        yield put(actions.fetchFlooringTakeOffsSuccess(response));
    } catch (error) {
        yield all([
            put(actions.fetchFlooringTakeOffsFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("fetch flooring takeOffs"))),
        ]);
    }
}
