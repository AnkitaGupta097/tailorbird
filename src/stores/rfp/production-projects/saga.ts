import { takeEvery } from "@redux-saga/core/effects";
import { fetchProjects } from "./operations";

import { actions } from "./slice";

export const saga = [takeEvery(actions.fetchProjectsStart.type, fetchProjects)];
