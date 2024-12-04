import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { ProjectSaga } from "./saga";

export { actions } from "./slice";
export { reducer as productionProjectReducer };

export function* productionProjectSaga() {
    yield all([...ProjectSaga]);
}

export type { IProject } from "./interfaces";
