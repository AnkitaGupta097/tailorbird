import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { updateObject } from "../../../utils/store-helpers";
import initAjaxState from "../../initAjaxState.json";

const initState = cloneDeep(initAjaxState) as any;

initState.loading = false;
initState.projects = [];

export interface IRfpProductionProjectState {
    loading: boolean;
    projects: Array<{
        [x: string]: any;
    }>;
}

const initialState: IRfpProductionProjectState = initState;

function fetchProjectsStart(state: IRfpProductionProjectState) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchProjectsSuccess(state: IRfpProductionProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        projects: action.payload.response,
    });
}

function fetchProjectsFailure(state: IRfpProductionProjectState) {
    return updateObject(state, {
        loading: false,
    });
}

const slice = createSlice({
    name: "Rfp Production Project",
    initialState: initialState,
    reducers: {
        fetchProjectsStart,
        fetchProjectsSuccess,
        fetchProjectsFailure,
    },
});

export const actions = slice.actions;

export const reducer = slice.reducer;
