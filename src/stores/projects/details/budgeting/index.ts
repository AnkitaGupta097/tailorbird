import { all } from "@redux-saga/core/effects";
import { budgetingSaga } from "./budgeting-sagas";

export type { IBudgeting } from "./budgeting-models";
export { actions, reducer } from "./budgeting-slice";

export function* budgetingSagas() {
    yield all([...budgetingSaga]);
}
