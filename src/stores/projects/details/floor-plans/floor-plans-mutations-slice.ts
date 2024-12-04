/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../utils/store-helpers";
import { IFloorplans } from "./floor-plans-models";

// eslint-disable-next-line
function deleteFloorPlanStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplans: {
            data: [...state.floorplans.data],
            loading: true,
        },
    });
}

// eslint-disable-next-line
function deleteFloorPlanSuccess(state: IFloorplans, action: PayloadAction<any>) {
    console.log(action.payload, "res>>>");
    const floorplans = state.floorplans.data.filter((floorplan: any) => {
        return floorplan.id !== action.payload.id;
    });
    return updateObject(state, {
        ...state,
        floorplans: {
            data: floorplans,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function deleteFloorPlanFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplans: {
            data: [...state.floorplans.data],
            loading: false,
            error: true,
        },
    });
}

// eslint-disable-next-line
function updateFloorPlanStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplan: {
            data: state.floorplan.data,
            loading: true,
        },
        floorplans: {
            data: [...state.floorplans.data],
            loading: true,
        },
    });
}

// eslint-disable-next-line
function updateFloorPlanSuccess(state: IFloorplans, action: PayloadAction<any>) {
    console.log(action.payload, "res>>>");

    const floorplans = state.floorplans.data.map((floorplan: any) => {
        if (floorplan.id === action.payload.id) {
            // Replace the floorplan with the updated one
            return action.payload.response || action.payload;
        }
        return floorplan;
    });

    return updateObject(state, {
        ...state,
        floorplan: {
            data: state.floorplan.data,
            // loading: false,
        },
        floorplans: {
            data: floorplans,
            // loading: false,
        },
    });
}

// eslint-disable-next-line
function updateFloorPlanFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplan: {
            data: state.floorplan.data,
            loading: false,
            error: true,
        },
        floorplans: {
            data: [...state.floorplans.data],
            // loading: false,
            // error: true,
        },
    });
}

// eslint-disable-next-line
function createFloorPlanStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplan: {
            data: state.floorplan.data,
            loading: true,
        },
        floorplans: {
            data: [...state.floorplans.data],
            // loading: true,
        },
    });
}

// eslint-disable-next-line
function createFloorPlanSuccess(state: IFloorplans, action: PayloadAction<any>) {
    console.log(action.payload, "res>>>");
    return updateObject(state, {
        ...state,
        floorplan: {
            data: state.floorplan.data,
            loading: false,
        },
        floorplans: {
            data: [...state.floorplans.data, ...action.payload],
            // loading: false,
        },
    });
}

// eslint-disable-next-line
function createFloorPlanFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplan: {
            data: state.floorplan.data,
            loading: false,
            error: true,
        },
        floorplans: {
            data: [...state.floorplans.data],
            // loading: false,
            // error: true,
        },
    });
}

// eslint-disable-next-line
function createFlooringSplitStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorPlans: {
            ...state.floorplans,
        },
    });
}

// eslint-disable-next-line
function createFlooringSplitSuccess(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorPlans: {
            ...state.floorplans,
        },
    });
}

// eslint-disable-next-line
function createFlooringSplitFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorPlans: {
            ...state.floorplans,
        },
    });
}

// eslint-disable-next-line
function updateFlooringSplitTableCountStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorPlans: {
            ...state.floorplans,
        },
    });
}

// eslint-disable-next-line
function updateFlooringSplitTableCountSuccess(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplanSplits: {
            ...state.floorplanSplits,
            subGroupMappers: action.payload.response,
        },
    });
}

// eslint-disable-next-line
function updateFlooringSplitTableCountFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorPlans: {
            ...state.floorplans,
        },
    });
}

// eslint-disable-next-line
function updateInventoryMixStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplans: updateObject(state.floorplans, { loading: true }),
    });
}

// eslint-disable-next-line
function updateUnitMixStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        unitMix: updateObject(state.unitMix, { loading: true }),
    });
}

// eslint-disable-next-line
function updateInventoryMixFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorPlans: {
            ...state.floorplans,
        },
    });
}
// eslint-disable-next-line
function updateUnitMixFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        unitMix: updateObject(state.unitMix, { loading: false }),
    });
}

function createMissingInfoStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        missingFileUploading: true,
    });
}
function createMissingInfoSuccess(state: IFloorplans, action: PayloadAction<any>) {
    // const missingInfoFiles = action?.payload?.res?.flatMap((details: any) => details?.file || []);

    // // Find matching floor_plan_id in action.payload
    // const matchingFloorPlan: any = state.floorplans.data.find(
    //     (dataItem: any) => dataItem.id === action.payload.floor_plan_id,
    // );

    // if (matchingFloorPlan) {
    //     // Ensure dataItem.missingInfo is an array
    //     if (!Array.isArray(matchingFloorPlan.missingInfo)) {
    //         matchingFloorPlan.missingInfo = [];
    //     }

    //     // Push new missingInfo to existing missingInfo items
    //     matchingFloorPlan.missingInfo = Array.from(
    //         new Set([...matchingFloorPlan.missingInfo, ...missingInfoFiles.flat()]),
    //     );
    // }

    // // Update the modified floorplan data
    // const updatedFloorplans = state.floorplans.data.map((dataItem: any) => {
    //     if (dataItem.id === action.payload.floor_plan_id) {
    //         return matchingFloorPlan;
    //     }
    //     return dataItem;
    // });

    // Update the state with the modified floorplan data
    // floorplans: updateObject(state.floorplans, { data: updatedFloorplans }),
    return updateObject(state, {
        missingFileUploading: false,
    });
}
function createMissingInfoFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        missingFileUploading: false,
    });
}
function DeleteMissingInfoStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        deleteInProgress: true,
    });
}

function DeleteMissingInfoSuccess(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        deleteInProgress: false,
    });
}

export const actions = {
    deleteFloorPlanStart,
    deleteFloorPlanSuccess,
    deleteFloorPlanFailure,
    updateFloorPlanStart,
    updateFloorPlanSuccess,
    updateFloorPlanFailure,
    createFloorPlanStart,
    createFloorPlanSuccess,
    createFloorPlanFailure,
    createFlooringSplitStart,
    createFlooringSplitSuccess,
    createFlooringSplitFailure,
    updateFlooringSplitTableCountStart,
    updateFlooringSplitTableCountSuccess,
    updateFlooringSplitTableCountFailure,
    updateInventoryMixStart,
    updateInventoryMixFailure,
    updateUnitMixStart,
    updateUnitMixFailure,
    createMissingInfoStart,
    createMissingInfoSuccess,
    createMissingInfoFailure,
    DeleteMissingInfoStart,
    DeleteMissingInfoSuccess,
};
