/* eslint-disable */
import { put } from "@redux-saga/core/effects";

import { GetMaterials } from "../../../queries/b2b-project/b2b-project-query";
import { actions } from "./slice";

export function* fetchMaterials() {
    try {
        //@ts-ignore
        const response = yield client.query("getMaterials", GetMaterials);

        yield put(actions.fetchMaterialsSuccess(response));
    } catch (error) {
        yield put(actions.fetchMaterialsFailure());
    }
}
