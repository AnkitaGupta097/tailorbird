import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { ApprovalsSaga } from "./saga";

export { actions } from "./slice";
export { reducer as approvalReducer };

export function* approvalsSaga() {
    yield all([...ApprovalsSaga]);
}

export type { IApprovalState } from "./interfaces";
