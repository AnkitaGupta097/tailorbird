import { all } from "@redux-saga/core/effects";
import { scopesSaga } from "./scopes-saga";
export { actions } from "./scopes-slice";
export { reducer } from "./scopes-slice";
export type { IScopes } from "./scopes-models";

export function* scopesSagas() {
    yield all([...scopesSaga]);
}
