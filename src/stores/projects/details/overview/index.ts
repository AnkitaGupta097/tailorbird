import reducer from "./overview-slice";
import { all } from "@redux-saga/core/effects";
import { overviewSaga } from "./overview-saga";

export type { IProjectOverview } from "./overview-models";
export { actions } from "./overview-slice";
export { reducer };

export function* overviewSagas() {
    yield all([...overviewSaga]);
}
