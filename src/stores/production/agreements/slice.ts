import { updateObject } from "../../../utils/store-helpers";
import initialState from "./init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IAgreementState } from "./interfaces";

const initState: any = cloneDeep(initialState);

// eslint-disable-next-line no-unused-vars
function fetchLiveAgreementStart(state: IAgreementState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchLiveAgreementSuccess(state: IAgreementState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        liveAgreement: action.payload.liveAgreement,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchLiveAgreementFailure(state: IAgreementState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

const slice = createSlice({
    name: "Agreements",
    initialState: initState,
    reducers: {
        fetchLiveAgreementStart,
        fetchLiveAgreementSuccess,
        fetchLiveAgreementFailure,
    },
});

export const actions = slice.actions;

export default slice.reducer;
