import { takeEvery } from "@redux-saga/core/effects";
import { fetchProjectsWithFilter } from "./operation";
import { actions } from "./slice";

export const saga = [takeEvery(actions.fetchAllProjectsStart.type, fetchProjectsWithFilter)];
