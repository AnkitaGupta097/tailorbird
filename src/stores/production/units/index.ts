import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { UnitsSaga } from "./saga";

export { actions } from "./slice";
export { reducer as unitReducer };

export function* unitsSaga() {
    yield all([...UnitsSaga]);
}

export type { IRenovationUnits } from "./interfaces";
