import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { AgreementSaga } from "./saga";

export { actions } from "./slice";
export { reducer as agreementReducer };

export function* agreementSaga() {
    yield all([...AgreementSaga]);
}

export type { IAgreementState } from "./interfaces";
