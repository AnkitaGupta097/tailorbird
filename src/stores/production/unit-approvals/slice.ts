import { updateObject } from "../../../utils/store-helpers";
import initialState from "./unit-approval-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, isEmpty } from "lodash";
import { IUnitApprovalState } from "./interfaces";

const initState: any = cloneDeep(initialState);

/* eslint-disable no-unused-vars */
function fetchUnitApprovalsStart(state: IUnitApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {});
}

function setLoading(state: IUnitApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: action.payload.loading,
    });
}

function fetchUnitApprovalsSuccess(state: IUnitApprovalState, action: PayloadAction<any>) {
    const { unitStatus, approvalType, isReviewed, unitApprovals } = action?.payload ?? {};
    const isFilterApplied = !isEmpty(unitStatus) || !isEmpty(approvalType);
    const updatedApprovals = {
        [isReviewed ? "resolvedUnitApprovals" : "pendingUnitApprovals"]: unitApprovals,
    };

    const stateToBeUpdated = isFilterApplied ? state.filteredUnits : state.allUnits;
    const stateToBeUpdatedKey = isFilterApplied ? "filteredUnits" : "allUnits";

    return updateObject(state, {
        loading: false,
        [stateToBeUpdatedKey]: updateObject(stateToBeUpdated, updatedApprovals),
    });
}

function fetchUnitApprovalsFailure(state: IUnitApprovalState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function resetFilteredState(state: IUnitApprovalState) {
    return updateObject(state, {
        filteredUnits: {
            pendingUnitApprovals: undefined,
            resolvedUnitApprovals: undefined,
        },
    });
}

function resetState() {
    return initState;
}

const slice = createSlice({
    name: "UnitApprovals",
    initialState: initState,
    reducers: {
        fetchUnitApprovalsStart,
        fetchUnitApprovalsSuccess,
        fetchUnitApprovalsFailure,
        resetState,
        setLoading,
        resetFilteredState,
    },
});

export const actions = slice.actions;

export default slice.reducer;
