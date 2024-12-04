import { combineReducers, Reducer } from "redux";
import { all } from "@redux-saga/core/effects";

import packageReducer, { packageManagerSaga, actions as packageActions } from "./creation";

import { IPackagesstate } from "./creation/slice";

// State interface
export interface IPackageManagerState {
    packages: IPackagesstate;
}

// State reducer
export const packageManagerReducer: Reducer<IPackageManagerState> =
    combineReducers<IPackageManagerState>({
        packages: packageReducer,
    });

// Actions
export const packageManagerActions = {
    ...packageActions,
};

// Saga worker
export function* packagesSaga() {
    yield all([...packageManagerSaga]);
}
