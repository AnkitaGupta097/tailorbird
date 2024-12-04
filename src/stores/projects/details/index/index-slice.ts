import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { updateObject } from "../../../../utils/store-helpers";
import initAjaxState from "../../../common/models/initAjaxState.json";
import { IProjectDetails } from "./index-models";

const initState: IProjectDetails = {
    ...initAjaxState,
    data: null,
};

const initialState: IProjectDetails = cloneDeep(initState);

// eslint-disable-next-line
function fetchProjectDetailsStart(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
        data: null,
    });
}

function fetchProjectDetailsSuccess(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: {
            ...action.payload.getProjectById,
            rentRoll: action.payload.getRentRoll,
            latestRenovationVersion: action.payload.latestRenovationVersion,
        },
    });
}

function updateRentRoll(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: { ...state.data, rentRoll: action.payload },
    });
}

function updateRentRollStatus(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: {
            ...state.data,
            rentRoll: updateObject(state.data.rentRoll, { status: action.payload }),
        },
    });
}

function fetchProjectDetailsFailure(state: IProjectDetails, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line
function updateProjectStart(state: IProjectDetails, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function updateProjectSuccess(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: { ...state.data, ...action.payload },
    });
}

// eslint-disable-next-line
function projectDetailsInit(state: IProjectDetails, action: PayloadAction<any>) {
    return { ...initAjaxState, data: null };
}

// eslint-disable-next-line
function fetchRentRollStart(state: IProjectDetails, action: PayloadAction<any>) {
    console.log("fetchRentRollStart");
    return updateObject(state, {
        loading: true,
        data: { ...state.data, rentRoll: {} },
    });
}

// eslint-disable-next-line
function updateProjectStatusSuccess(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: { ...state.data, status: action.payload },
    });
}

// eslint-disable-next-line
function fetchRentRollSuccess(state: IProjectDetails, action: PayloadAction<any>) {
    console.log("fetchRentRollSuccess", action.payload);
    return updateObject(state, {
        loading: false,
        data: { ...state.data, rentRoll: action.payload },
    });
}

// eslint-disable-next-line
function fetchRentRollFailure(state: IProjectDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: { ...state.data },
    });
}
// eslint-disable-next-line
function updateProjectStatusStart(state: IProjectDetails, action: PayloadAction<any>) {
    return state;
}

const slice = createSlice({
    name: "projectDetails",
    initialState: initialState,
    reducers: {
        fetchProjectDetailsStart,
        fetchProjectDetailsSuccess,
        fetchProjectDetailsFailure,
        updateProjectStart,
        updateProjectStatusStart,
        updateProjectSuccess,
        updateRentRoll,
        updateRentRollStatus,
        projectDetailsInit,
        fetchRentRollStart,
        fetchRentRollFailure,
        fetchRentRollSuccess,
        updateProjectStatusSuccess,
    },
});

export const actions = slice.actions;

export const reducer = slice.reducer;
