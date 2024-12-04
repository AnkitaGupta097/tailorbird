import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";
import { GET_PROJECTS_WITH_FILTER } from "./queries";
import { client as graphQLClient } from "../../gql-client";
import actions from "../../actions";
import { IProjectDemand } from ".";

export function* fetchProjectsWithFilter(action: PayloadAction<any>) {
    try {
        const filters = action.payload.filters;
        const response: IProjectDemand = yield graphQLClient.query(
            "getProjectsWithFilters",
            GET_PROJECTS_WITH_FILTER,
            {
                filters: filters,
            },
        );
        yield put(actions.projectDemand.fetchAllProjectsSuccess(response));
    } catch (error) {
        console.log(error);
    }
}
