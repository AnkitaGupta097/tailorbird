import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IMaterials } from "./interface";
import { updateObject } from "../../../utils/store-helpers";
import initState from "./init-state";

//@ts-ignore
const initialState: IMaterials = cloneDeep(initState);

initialState.newSkuRows = [];
initialState.loading = false;
function fetchMaterialsStart(state: IMaterials) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchMaterialsSuccess(state: IMaterials, action: PayloadAction<any>) {
    //@ts-ignore
    action.payload.forEach((element) => {
        if (element.package_id) console.log("element : ", element);
    });
    return updateObject(state, {
        loading: false,
        data: action.payload,
    });
}

function fetchMaterialsFailure(state: IMaterials) {
    return updateObject(state, {
        loading: false,
    });
}

function addNewSKUStart(state: IMaterials) {
    return updateObject(state, {
        loading: true,
    });
}

function addNewSKUSuccess(state: IMaterials, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: action.payload,
    });
}

function addNewSKUFailure(state: IMaterials) {
    return updateObject(state, {
        loading: false,
    });
}

const slice = createSlice({
    name: "MATERIAL",
    initialState: initialState,
    reducers: {
        fetchMaterialsStart,
        fetchMaterialsSuccess,
        fetchMaterialsFailure,
        addNewSKUStart,
        addNewSKUSuccess,
        addNewSKUFailure,
    },
});

export const actions = slice.actions;

export default slice.reducer;
