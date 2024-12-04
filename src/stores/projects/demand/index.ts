import reducer from "./slice";
import { saga } from "./saga";
import { actions } from "./slice";
import { all } from "@redux-saga/core/effects";

export type { IProjectDemand } from "./interfaces";
export { reducer };

export default reducer;

// Actions
export const ProjectsDemandActions = {
    ...actions,
};

// Saga worker
export function* projectsDemandSaga() {
    yield all([...saga]);
}
