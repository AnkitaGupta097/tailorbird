import actions from "stores/actions";
import { put } from "@redux-saga/core/effects";
import { client } from "stores/gql-client";
import { GET_PROJECTS_WITH_FILTERS } from "./queries";

export function* fetchProjects() {
    try {
        const response: {
            projects: any[];
        } = yield client.query("getProjectsWithFilters", GET_PROJECTS_WITH_FILTERS, {
            projectFilters: [
                {
                    name: "status",
                    values: ["Production Started", "Production Finished"],
                },
            ],
        });

        const data = {
            loading: false,
            response: response?.projects ?? [],
        };

        yield put(actions.rfpService.fetchProjectsSuccess(data));
    } catch (error) {
        yield put(
            actions.common.openSnack({
                message: `Failed to load production projects`,
                variant: "error",
                open: true,
            }),
        );
        yield put(actions.rfpService.fetchProjectsFailure());
    }
}
