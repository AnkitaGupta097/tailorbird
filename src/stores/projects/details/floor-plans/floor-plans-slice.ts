import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { actions as queryActions } from "./floor-plans-queries-slice";
import { actions as mutationActions } from "./floor-plans-mutations-slice";
import initAjaxState from "../../../initAjaxState.json";
import { IFloorplans } from "./floor-plans-models";
import { cloneDeep } from "lodash";

const initState: IFloorplans = {
    ...initAjaxState,
    floorplan: {
        ...initAjaxState,
        loading: false,
        data: {},
    },
    floorplans: {
        ...initAjaxState,
        loading: false,
        data: [],
    },
    floorplanSplits: {
        ...initAjaxState,
        subGroups: [],
        subGroupMappers: [],
    },
    inventories: {
        ...initAjaxState,
        data: [],
    },
    inventoryMixes: {
        ...initAjaxState,
        data: [],
    },
    unitMix: {
        ...initAjaxState,
        loading: false,
        projectFloorPlan: [],
        inventory: [],
        inventoryMix: [],
        unitMixes: [],
        propertyUnits: [],
    },
    missingFileUploading: false,
    commentLogs: { ...initAjaxState, data: null },
    deleteInProgress: false,
};

const initialState: IFloorplans = cloneDeep(initState);

// eslint-disable-next-line
function projectFloorplansStateInit(state: IFloorplans, action: PayloadAction<any>) {
    return initialState;
}

const slice = createSlice({
    name: "projectFloorplans",
    initialState,
    reducers: {
        ...mutationActions,
        ...queryActions,
        projectFloorplansStateInit,
    },
});

export const actions = slice.actions;

export const reducer = slice.reducer;
