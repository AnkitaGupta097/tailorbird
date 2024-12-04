import { all } from "@redux-saga/core/effects";
import { floorPlansSaga } from "./floor-plans-saga";

export type { IFloorplans } from "./floor-plans-models";
export { actions, reducer } from "./floor-plans-slice";

export function* floorplanSagas() {
    yield all([...floorPlansSaga]);
}
