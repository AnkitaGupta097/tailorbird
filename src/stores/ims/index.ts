import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { IIMS } from "./interfaces";
import reducer from "./slice";
import { saga } from "./saga";
import { actions } from "./slice";
import { all } from "@redux-saga/core/effects";
export default reducer;

export interface IIMSState {
    ims: IIMS;
}

export const imsReducer: Reducer<IIMSState> = combineReducers<IIMSState>({
    ims: reducer,
});

// Actions
export const imsActions = {
    ...actions,
};

// Saga worker
export function* imsSaga() {
    yield all([...saga]);
}
