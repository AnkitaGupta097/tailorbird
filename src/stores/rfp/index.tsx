import projectReducer, { rfpServiceSaga, actions as projectActions } from "./projects/index";
import productionProjectReducer, {
    rfpProductionServiceSaga,
    actions as productionProjectActions,
} from "./production-projects";

import { all } from "@redux-saga/core/effects";
import { IRfpProjectState } from "./projects/project-slice";
import { combineReducers, Reducer } from "redux";
import { IRfpProductionProjectState } from "./production-projects/slice";

// State interface
export interface IRfpServiceState {
    project: IRfpProjectState;
    productionProject: IRfpProductionProjectState;
}

// State reducer
export const rfpServiceReducer: Reducer<IRfpServiceState> = combineReducers<IRfpServiceState>({
    project: projectReducer,
    productionProject: productionProjectReducer,
});

// Actions
export const rfpServiceActions = {
    ...projectActions,
    ...productionProjectActions,
};

// Saga worker
export function* rfpSaga() {
    yield all([...rfpServiceSaga, ...rfpProductionServiceSaga]);
}
