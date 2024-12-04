import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IFeatureFlag } from "./interface";
import { updateObject } from "../../../utils/store-helpers";
import initState from "./initState.json";

//@ts-ignore
const initialState: IFeatureFlag = cloneDeep(initState);

function updateFeatureFlags(state: IFeatureFlag, action: PayloadAction) {
    return updateObject(state, {
        data: action.payload,
    });
}

const slice = createSlice({
    name: "FEATUREFLAG",
    initialState: initialState,
    reducers: {
        updateFeatureFlags,
    },
});

export const actions = slice.actions;

export default slice.reducer;
