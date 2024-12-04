import { updateObject } from "../../../utils/store-helpers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, groupBy, mapValues } from "lodash";
import { IProjectDemand } from "./interfaces";
import initialState from "../demand/projects-init";
import { PROJECT_STATUS_LIST } from "modules/projects/demand/constants";
const initState: any = cloneDeep(initialState);

// eslint-disable-next-line
function fetchAllProjectsStart(state: IProjectDemand, action: PayloadAction<any>) {
    state.loading = true;
}

function fetchAllProjectsSuccess(state: IProjectDemand, action: PayloadAction<any>) {
    const filtersArr = mapValues(
        groupBy(action.payload.filters, "name"),
        (value: any) => value[0].filter_values,
    );
    const projects_state_map: any = {};
    let projects: any = action.payload.projects.slice();
    projects.sort((one: any, two: any) => {
        let oneName = one.name.toLowerCase();
        let twoName = two.name.toLowerCase();
        if (oneName > twoName) return 1;
        if (oneName < twoName) return -1;
        return 0;
    });
    projects.forEach((project: { status: string | number }) => {
        projects_state_map[PROJECT_STATUS_LIST[project.status]?.state] =
            projects_state_map[PROJECT_STATUS_LIST[project.status]?.state] || [];
        projects_state_map[PROJECT_STATUS_LIST[project.status]?.state]?.push(project);
    });
    return updateObject(state, {
        loading: false,
        projects_state_map: projects_state_map,
        filters: filtersArr,
    });
}

const slice = createSlice({
    name: "projects",
    initialState: initState,
    reducers: {
        fetchAllProjectsStart,
        fetchAllProjectsSuccess,
    },
});

export const actions = slice.actions;

export default slice.reducer;
