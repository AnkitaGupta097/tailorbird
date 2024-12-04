/* eslint-disable */
import { combineReducers, Reducer } from "redux";
import { all } from "@redux-saga/core/effects";
import materialReducer, { IMaterials, materialSaga, actions as materialActions } from "./material";

// State interface
export interface IMDMState {
    materials: IMaterials;
}

// State reducer
export const mdmReducer: Reducer<IMDMState> = combineReducers<IMDMState>({
    materials: materialReducer,
});

// Actions
export const mdmActions = {
    ...materialActions,
};

// Saga worker
export function* mdmSaga() {
    yield all([...materialSaga]);
}
