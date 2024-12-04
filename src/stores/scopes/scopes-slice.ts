import { createSlice } from "@reduxjs/toolkit";
import initState from "./scopes-init";
import { actions as queryActions } from "./scopes-queries-slice";
import { actions as mutationActions } from "./scopes-mutations-slice";

const scopesSlice = createSlice({
    name: "scopes",
    initialState: initState,
    reducers: {
        ...queryActions,
        ...mutationActions,
    },
});

export const actions = scopesSlice.actions;

export const reducer = scopesSlice.reducer;
