import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../utils/store-helpers";
import { IFloorplans } from "./floor-plans-models";

// eslint-disable-next-line
function fetchFloorplanDataStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplans: {
            ...state.floorplans,
            loading: true,
        },
        floorplanSplits: {
            ...state.floorplanSplits,
            loading: true,
        },
        inventories: {
            ...state.inventories,
            loading: true,
        },
        inventoryMixes: {
            ...state.inventoryMixes,
            loading: true,
        },
    });
}

// eslint-disable-next-line
function fetchFloorplanDataSuccess(state: IFloorplans, action: PayloadAction<any>) {
    // Add highestResolutionUrl to missingInfo for each item in response
    const updatedFPs = (action.payload.floorplans || []).map((item: any) => {
        const updatedMissingInfo = (item.missingInfo || []).map((info: any) => {
            const sortedUrls: any[] = [...(info?.cdn_path || [])].sort((a: any, b: any) => {
                const resolutionA = parseInt(a.split("AUTOx")[1], 10);
                const resolutionB = parseInt(b.split("AUTOx")[1], 10);
                return resolutionA - resolutionB;
            });
            const highestResolutionUrl: any = sortedUrls[sortedUrls.length - 1];

            return { ...info, highestResolutionUrl: highestResolutionUrl };
        });

        return { ...item, missingInfo: updatedMissingInfo };
    });
    console.log("updatedFPs", updatedFPs);
    console.log("updatedFPs", updatedFPs);

    return updateObject(state, {
        ...state,
        floorplans: {
            ...state.floorplans,
            data: updatedFPs,
            loading: false,
        },
        floorplanSplits: {
            ...state.floorplanSplits,
            subGroups: action.payload.subGroups,
            subGroupMappers: action.payload.subGroupMappers,
            loading: false,
        },
        inventories: {
            ...state.inventories,
            data: action.payload.inventories,
            loading: false,
        },
        inventoryMixes: {
            ...state.inventoryMixes,
            data: action.payload.inventoryMixes,
            loading: false,
        },
    });
}

function fetchFloorplanDataFailure(state: IFloorplans, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        ...state,
        floorplans: {
            ...state.floorplans,
            loading: false,
        },
        floorplanSplits: {
            ...state.floorplanSplits,
            loading: false,
        },
        inventories: {
            ...state.inventories,
            loading: false,
        },
        inventoryMixes: {
            ...state.inventoryMixes,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function fetchFloorSplitDataStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplanSplits: {
            ...state.floorplanSplits,
            loading: true,
        },
    });
}

// eslint-disable-next-line
function fetchUnitMixDataStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        unitMix: updateObject(state.unitMix, { loading: true }),
    });
}

function fetchUnitMixDataSuccuss(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        unitMix: {
            projectFloorPlan: action.payload.getProjectFloorPlans,
            inventory: action.payload.getInventory,
            inventoryMix: action.payload.getInventoryMix,
            unitMixes: action.payload.getUnitMixes,
            propertyUnits: action.payload?.getPropertyUnits,
            loading: false,
        },
    });
}

function fetchFloorSplitDataSuccess(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplanSplits: {
            ...state.floorplanSplits,
            subGroups: action.payload.subGroups,
            subGroupMappers: action.payload.subGroupMappers,
            loading: false,
        },
    });
}

function fetchFloorSplitDataFailure(state: IFloorplans, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        ...state,
        floorplanSplits: {
            ...state.floorplanSplits,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function fetchInventoryMixStart(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        inventories: {
            ...state.inventories,
            loading: false,
        },
        inventoryMixes: {
            ...state.inventoryMixes,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function fetchUserRemarkStart(state: IFloorplans, action: PayloadAction<any>) {
    return state;
}

function fetchUserRemarkSuccess(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        commentLogs: updateObject(state?.commentLogs, {
            data: action.payload.getProjectUserRemarks,
        }),
    });
}

function fetchInventoryMixSuccess(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        floorplans: {
            ...state.floorplans,
            loading: false,
        },
        inventories: {
            ...state.inventories,
            data: action.payload.inventories,
            loading: false,
        },
        inventoryMixes: {
            ...state.inventoryMixes,
            data: action.payload.inventoryMixes,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function fetchInventoryMixFailure(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        inventories: {
            ...state.inventories,
            loading: false,
        },
        inventoryMixes: {
            ...state.inventoryMixes,
            loading: false,
        },
    });
}
// eslint-disable-next-line no-unused-vars
function resetProjectFloorplans(state: IFloorplans, action: PayloadAction<any>) {
    return updateObject(state, {
        floorplans: {
            loading: false,
            data: [],
        },
    });
}

export const actions = {
    fetchFloorplanDataStart,
    fetchFloorplanDataSuccess,
    fetchFloorplanDataFailure,
    fetchFloorSplitDataStart,
    fetchFloorSplitDataSuccess,
    fetchFloorSplitDataFailure,
    fetchInventoryMixStart,
    fetchInventoryMixSuccess,
    fetchInventoryMixFailure,
    fetchUnitMixDataStart,
    fetchUnitMixDataSuccuss,
    fetchUserRemarkStart,
    fetchUserRemarkSuccess,
    resetProjectFloorplans,
};
