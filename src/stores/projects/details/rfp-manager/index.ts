import reducer from "./rfp-manager-slice";
import { all } from "@redux-saga/core/effects";
import { rfpProjectManagerSaga } from "./rfp-manager-saga";

//export type { IProjectOverview } from "./rfp-manager-models";
export { actions } from "./rfp-manager-slice";
export { reducer };

export function* rfpProjectManagerSagas() {
    yield all([...rfpProjectManagerSaga]);
}

export type { IRfpManagerState } from "./rfp-manager-models";
