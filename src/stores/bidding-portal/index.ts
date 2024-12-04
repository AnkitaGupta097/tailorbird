import { reducer } from "./bidding-portal-slice";
import { all } from "@redux-saga/core/effects";
import { BiddingPortalSaga } from "./bidding-portal-saga";

export { actions } from "./bidding-portal-slice";
export { reducer as biddingPortalReducer };

export function* biddingPortalSaga() {
    yield all([...BiddingPortalSaga]);
}

export type { IBiddingPortal } from "./bidding-portal-models";
