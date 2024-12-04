import reducer from "./tpsm-slice";
import { all } from "@redux-saga/core/effects";
import { tpsmSaga } from "./tpsm-saga";

export type { ITPSM } from "./tpsm-models";
export { actions } from "./tpsm-slice";
export { reducer };

export function* tpsmSagas() {
    yield all([...tpsmSaga]);
}
