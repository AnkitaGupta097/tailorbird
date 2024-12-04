import { updateObject } from "../../../utils/store-helpers";
import initialState from "./approval-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IApprovalState } from "./interfaces";

const initState: any = cloneDeep(initialState);

/* eslint-disable no-unused-vars */
function fetchApprovalsStart(state: IApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchApprovalsSuccess(state: IApprovalState, action: PayloadAction<any>) {
    const updatedApprovals = {
        allApprovals: updateObject(state.allApprovals, {
            [action.payload.renoUnitId]: action.payload.approvals,
        }),
    };

    return updateObject(state, {
        loading: false,
        ...updatedApprovals,
    });
}

function fetchApprovalsFailure(state: IApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function reviewApprovalStart(state: IApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {
        reviewing: true,
    });
}

function reviewApprovalSuccess(state: IApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {
        reviewing: false,
    });
}

function resetState() {
    return initState;
}

const slice = createSlice({
    name: "Approvals",
    initialState: initState,
    reducers: {
        fetchApprovalsStart,
        fetchApprovalsSuccess,
        fetchApprovalsFailure,
        reviewApprovalStart,
        reviewApprovalSuccess,
        resetState,
    },
});

export const actions = slice.actions;

export default slice.reducer;
