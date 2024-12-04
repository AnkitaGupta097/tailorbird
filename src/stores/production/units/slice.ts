import { updateObject } from "../../../utils/store-helpers";
import initialState from "./units-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IRenovationUnits } from "./interfaces";

const initState: any = cloneDeep(initialState);

/* eslint-disable no-unused-vars */
function fetchRenovationUnitsStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchRenovationUnitsSuccess(state: IRenovationUnits, action: PayloadAction<any>) {
    const renoUnits = action.payload.renoUnits;
    return updateObject(state, {
        loading: false,
        renoUnits,
    });
}

function fetchRenovationUnitsFailure(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchRenovationUnitStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {});
}

function fetchRenovationUnitSuccess(state: IRenovationUnits, action: PayloadAction<any>) {
    const updatedRenoUnit = action.payload.renoUnit;
    const currentRenoUnits = state?.renoUnits;

    const updatedUnits = currentRenoUnits?.map((renoUnit: any) => {
        if (renoUnit.id == updatedRenoUnit.id) {
            return updatedRenoUnit;
        }
        return renoUnit;
    });

    return updateObject(state, {
        loading: false,
        renoUnits: updatedUnits,
    });
}

function fetchRenovationUnitFailure(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, { loading: false });
}

//helper function
function getUpdatedRenoUnits(state: IRenovationUnits, action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;
    const response = action.payload.updatedRenoUnit;
    const currentProjectRenoUnits = state?.renoUnits;

    const updatedUnits = currentProjectRenoUnits?.map((renoUnit: any) => {
        if (renoUnit.id === renoUnitId) {
            const updatedRenoUnit = {
                ...renoUnit,
                renovation_start_date: response?.renovation_start_date,
                renovation_end_date: response?.renovation_end_date,
                move_out_date: response?.move_out_date,
                make_ready_date: response?.make_ready_date,
                move_in_date: response?.move_in_date,
                status: response?.status,
                release_date: response?.release_date,
            };
            return updatedRenoUnit;
        }
        return renoUnit;
    });
    return updatedUnits;
}

function updateSingleRenovationUnitSuccess(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        isUpdating: false,
        renoUnits: getUpdatedRenoUnits(state, action),
    });
}

function updateSingleRenovationUnitStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        isUpdating: true,
    });
}

function updateSingleRenovationUnitFailure(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        isUpdating: false,
    });
}

function unscheduleRenovationUnitStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        isUpdating: true,
    });
}

function releaseRenovationUnitStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        isUpdating: true,
    });
}

function fetchRenovationUnitBudgetStatStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {});
}

function fetchRenovationUnitBudgetStatSuccess(state: IRenovationUnits, action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;
    const renoUnitBudgetStat = action.payload.renoUnitBudgetStat;

    return updateObject(state, {
        unitsBudget: updateObject(state.unitsBudget, {
            [renoUnitId]: renoUnitBudgetStat,
        }),
    });
}

function fetchRenovationUnitBudgetStatFailure(state: IRenovationUnits, action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;

    const renoUnits = state.renoUnits;
    const updatedRenoUnits = renoUnits?.map((unit: any) => {
        if (unit.id === renoUnitId) {
            return { ...unit, renoBudgetStat: {} };
        }
        return unit;
    });
    return updateObject(state, {
        renoUnits: updatedRenoUnits,
    });
}

function resetState() {
    return initState;
}

function scheduleRenovationUnitStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {
        isUpdating: true,
    });
}

function updateRenovationUnitDatesStart(state: IRenovationUnits, action: PayloadAction<any>) {
    return updateObject(state, {});
}

const slice = createSlice({
    name: "Units",
    initialState: initState,
    reducers: {
        fetchRenovationUnitsStart,
        fetchRenovationUnitsSuccess,
        fetchRenovationUnitsFailure,
        fetchRenovationUnitStart,
        fetchRenovationUnitSuccess,
        fetchRenovationUnitFailure,
        updateSingleRenovationUnitStart,
        updateSingleRenovationUnitSuccess,
        updateSingleRenovationUnitFailure,
        unscheduleRenovationUnitStart,
        releaseRenovationUnitStart,
        fetchRenovationUnitBudgetStatStart,
        fetchRenovationUnitBudgetStatSuccess,
        fetchRenovationUnitBudgetStatFailure,
        resetState,
        scheduleRenovationUnitStart,
        updateRenovationUnitDatesStart,
    },
});

export const actions = slice.actions;

export default slice.reducer;
