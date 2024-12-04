import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { UnitScopesSaga } from "./saga";

export { actions } from "./slice";
export { reducer as unitScopesReducer };

export function* unitScopesSaga() {
    yield all([...UnitScopesSaga]);
}

export type { IUnitScopeState } from "./interfaces";
