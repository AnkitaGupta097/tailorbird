import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { SingleProjectDetailsSaga } from "./saga";

export { actions } from "./slice";
export { reducer as singleProjectReducer };

export function* singleProjectDetailsSaga() {
    yield all([...SingleProjectDetailsSaga]);
}

export type { ISingleProject } from "./interfaces";
