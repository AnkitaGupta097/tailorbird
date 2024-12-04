import { put, all } from "@redux-saga/core/effects";
import {
    GET_ALL_FLOOR_PLAN_DATA,
    GET_ALL_FLOOR_SPLIT_DATA,
    GET_ALL_INVENTORY_MIX_DATA,
    GET_UNIT_MIX_DATA,
    GET_USER_REMARK,
} from "./floor-plans-queries";
import { actions } from "./index";
import { graphQLClient } from "../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { commonActions } from "../../../common";
import { fetchItemFailure } from "../budgeting/snack-messages";

export function* fetchFloorplanData(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_FLOOR_PLAN_DATA, {
            id: action.payload.id,
        });

        yield put(actions.fetchFloorplanDataSuccess(response));
    } catch (error) {
        yield all([
            put(actions.fetchFloorplanDataFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("project floor plans"))),
        ]);
    }
}

export function* fetchUnitMixData(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_UNIT_MIX_DATA, {
            projectId: action.payload,
        });
        yield put(actions.fetchUnitMixDataSuccuss(response));
    } catch (error) {
        console.log(error);
    }
}

export function* getUserRemark(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getProjectUserRemarks",
            GET_USER_REMARK,
            {
                ...action.payload,
            },
        );
        yield put(actions.fetchUserRemarkSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchFloorSplitData(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_FLOOR_SPLIT_DATA, {
            id: action.payload.id,
        });
        yield put(actions.fetchFloorSplitDataSuccess(response));
    } catch (error) {
        yield all([
            put(actions.fetchFloorSplitDataFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("floor split"))),
        ]);
    }
}

export function* fetchInventoryMixData(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALL_INVENTORY_MIX_DATA, {
            id: action.payload.id,
        });
        yield put(actions.fetchInventoryMixSuccess(response));
    } catch (error) {
        yield all([
            put(actions.fetchInventoryMixFailure(error)),
            put(commonActions.openSnack(fetchItemFailure("floor split"))),
        ]);
    }
}
