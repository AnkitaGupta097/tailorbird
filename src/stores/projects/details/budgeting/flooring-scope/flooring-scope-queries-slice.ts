import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";

function fetchFlooringRenoItemsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,
                    loading: action.payload?.feature ? false : true,
                },
            },
        },
    });
}

function fetchFlooringRenoItemsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,
                    data: action.payload.renovations,
                    loading: false,
                },
            },
        },
    });
}

function fetchFlooringRenoItemsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchFlooringTakeOffsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    loading: true,
                },
            },
        },
    });
}

function fetchFlooringTakeOffsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...action.payload.flooringTakeOffs,
                    loading: false,
                },
                subGroups: {
                    data: action.payload.subGroups,
                },
            },
        },
    });
}

function fetchFlooringTakeOffsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    loading: false,
                },
                renovations: {
                    ...state.details.flooringScope.renovations,
                    loading: false,
                },
            },
        },
    });
}

export const actions = {
    fetchFlooringRenoItemsStart,
    fetchFlooringRenoItemsSuccess,
    fetchFlooringRenoItemsFailure,
    fetchFlooringTakeOffsStart,
    fetchFlooringTakeOffsSuccess,
    fetchFlooringTakeOffsFailure,
};
