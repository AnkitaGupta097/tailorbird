import { all } from "@redux-saga/core/effects";
import { projectDetailsSaga } from "./index-sagas";

export type { IProjectDetails } from "./index-models";
export { actions, reducer } from "./index-slice";

export function* projectDetailsSagas() {
    yield all([...projectDetailsSaga]);
}
