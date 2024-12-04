import { all } from "@redux-saga/core/effects";
import { fileUtilitySaga } from "./file-utility-saga";
import reducer from "./file-utility-slice";

export type { IFileUtility } from "./file-utility-models";
export { actions } from "./file-utility-slice";
export { reducer };

export function* fileUtilitySagas() {
    yield all([...fileUtilitySaga]);
}
