import { updateObject } from "../../../utils/store-helpers";
import initialState from "./project-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IProject } from "./interfaces";

const initState: any = cloneDeep(initialState);

/* eslint-disable no-unused-vars */
function setProductionProjectStateStart(state: IProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function setProductionAccessDenied(state: IProject, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        accessDenied: true,
        subscription: undefined,
        projectId: action.payload.projectId,
    });
}

function setProductionProjectStateSuccess(state: IProject, action: PayloadAction<any>) {
    const updatedObject: any = {};

    if (action.payload.features) {
        updatedObject.featureAccess = action.payload.features;
        updatedObject.accessDenied = false;
        updatedObject.loading = false;
        updatedObject.projectId = action.payload.projectId;
        updatedObject.subscription = action.payload.subscription;
    }
    if (action.payload.constants) {
        updatedObject.constants = action.payload.constants;
    }

    return updateObject(state, updatedObject);
}

function resetState(state: IProject) {
    return updateObject(state, {
        ...initState,
        constants: state.constants,
    });
}

function setSubscription(state: IProject, action: PayloadAction<any>) {
    return updateObject(state, {
        subscription: action.payload.subscription,
    });
}

const slice = createSlice({
    name: "Project",
    initialState: initState,
    reducers: {
        setProductionProjectStateStart,
        setProductionProjectStateSuccess,
        setProductionAccessDenied,
        resetState,
        setSubscription,
    },
});

export const actions = slice.actions;

export default slice.reducer;
