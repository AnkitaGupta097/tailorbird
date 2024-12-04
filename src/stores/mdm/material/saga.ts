import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./slice";
import { fetchMaterials } from "./operation";

export const saga = [takeEvery(actions.fetchMaterialsStart.type, fetchMaterials)];
