import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { UnitApprovalSaga } from "./saga";

export { actions } from "./slice";
export { reducer as unitApprovalsReducer };

export function* unitApprovalsSaga() {
    yield all([...UnitApprovalSaga]);
}

export type { IUnitApprovalState } from "./interfaces";
