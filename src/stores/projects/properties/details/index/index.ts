import { all } from "@redux-saga/core/effects";
import { propertyDetailsSaga } from "./index-sagas";

export type { IPropertyDetails } from "./index-models";
export { actions, reducer } from "./index-slice";

export function* propertyDetailsSagas() {
    yield all([...propertyDetailsSaga]);
}
