import reducer from "./property-slice";
import { all } from "@redux-saga/core/effects";
import { propertySaga } from "./property-saga";

export type { IProperties } from "./property-models";
export { actions } from "./property-slice";
export { reducer };

export function* propertySagas() {
    yield all([...propertySaga]);
}
