import reducer from "./slice";
import { saga } from "./saga";
import { actions } from "./slice";
import { all } from "@redux-saga/core/effects";

export type { IPropertiesConsumer } from "./interfaces";
export { reducer };

export default reducer;

// Actions
export const propertiesConsumerActions = {
    ...actions,
};

// Saga worker
export function* propertiesConsumerSaga() {
    yield all([...saga]);
}
