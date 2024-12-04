import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { ISnackbar } from "./interface";
import { updateObject } from "../../../utils/store-helpers";
import initState from "./initState.json";

//@ts-ignore
const initialState: ISnackbar = cloneDeep(initState);

function openSnack(state: ISnackbar, action: PayloadAction<any>) {
    return updateObject(state, {
        open: true,
        message: action.payload.message,
        variant: action.payload.variant,
        action: action.payload.action,
    });
}

function closeSnack(state: ISnackbar) {
    return updateObject(state, {
        open: false,
        message: "",
        action: undefined,
    });
}

const slice = createSlice({
    name: "SNACKBAR",
    initialState: initialState,
    reducers: {
        openSnack,
        closeSnack,
    },
});

export const actions = slice.actions;

export default slice.reducer;
