import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { updateObject } from "../../../../../utils/store-helpers";
import initAjaxState from "../../../../common/models/initAjaxState.json";
import { IPropertyDetails } from "./index-models";

const initState: IPropertyDetails = {
    ...initAjaxState,
    data: null,
};

const initialState: IPropertyDetails = cloneDeep(initState);

// eslint-disable-next-line
function fetchPropertyDetailsStart(state: IPropertyDetails, action: PayloadAction<any>) {
    console.log("E!!");
    return updateObject(state, {
        loading: true,
        data: null,
    });
}

function fetchPropertyDetailsSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    console.log("e!!RWED", action.payload);
    return updateObject(state, {
        loading: false,
        data: { ...action.payload.getProperty /*rentRoll: action.payload.getRentRoll*/ },
    });
}

// eslint-disable-next-line no-unused-vars
function fetchEntrataFloorPlansStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingEntrataData: true,
    });
}

function fetchEntrataFloorPlansSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: updateObject(state.data, { entrataFloorplans: action.payload.getEntrataFloorplans }),
        loadingEntrataData: false,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchEntrataFloorPlansFailure(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingEntrataData: false,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchFloorPlansStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return state;
}

function fetchFloorPlansSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: updateObject(state.data, { floorplans: action.payload.getProjectFloorPlans }),
    });
}

// eslint-disable-next-line no-unused-vars
function fetchUnitsStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return state;
}

function fetchUnitsSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: updateObject(state.data, { units: action.payload.getPropertyUnits }),
    });
}

// eslint-disable-next-line no-unused-vars
function fetchEntrataUnitsStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingEntrataData: true,
    });
}

function fetchEntrataUnitsSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: updateObject(state.data, { entrataUnits: action.payload.getEntrataPropertyUnits }),
        loadingEntrataData: false,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchEntrataUnitsFailure(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingEntrataData: false,
    });
}

function updateRentRoll(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: { ...state.data, rentRoll: action.payload },
    });
}

function updateRentRollStatus(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: {
            ...state.data,
            rentRoll: updateObject(state.data.rentRoll, { status: action.payload }),
        },
    });
}

// eslint-disable-next-line
function fetchPropertyDetailsFailure(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line
function importRentRollFromEntrataStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        importingRentRoll: true,
    });
}

// eslint-disable-next-line
function importRentRollFromEntrataSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        importingRentRoll: false,
    });
}

// eslint-disable-next-line
function importRentRollFromEntrataFailure(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        importingRentRoll: false,
    });
}

// eslint-disable-next-line
function mapEntrataUnitsStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        mappingUnits: true,
    });
}

// eslint-disable-next-line
function mapEntrataUnitsSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        mappingUnits: false,
    });
}

// eslint-disable-next-line
function mapEntrataUnitsFailure(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        mappingUnits: false,
    });
}

// eslint-disable-next-line
function mapEntrataFloorPlanStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        mappingFloorplan: true,
    });
}

// eslint-disable-next-line
function mapEntrataFloorPlanSuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        mappingFloorplan: false,
    });
}

// eslint-disable-next-line
function mapEntrataFloorPlanFailure(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        mappingFloorplan: false,
    });
}

// eslint-disable-next-line
function updatePropertyStart(state: IPropertyDetails, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function updatePropertySuccess(state: IPropertyDetails, action: PayloadAction<any>) {
    return updateObject(state, {
        data: updateObject(state.data, {
            ...action.payload,
            loading: false,
            isHavingMissingInfo: action.payload.is_missing_info,
        }),
    });
}

// eslint-disable-next-line
function propertyDetailsInit(state: IPropertyDetails, action: PayloadAction<any>) {
    return { ...initAjaxState, data: null };
}

// eslint-disable-next-line
function sendWhatsappMessage(state: IPropertyDetails, action: PayloadAction<any>) {}

const slice = createSlice({
    name: "propertyDetails",
    initialState: initialState,
    reducers: {
        fetchPropertyDetailsStart,
        fetchPropertyDetailsSuccess,
        fetchPropertyDetailsFailure,
        fetchFloorPlansStart,
        fetchFloorPlansSuccess,
        fetchEntrataFloorPlansStart,
        fetchEntrataFloorPlansSuccess,
        fetchEntrataFloorPlansFailure,
        fetchUnitsStart,
        fetchUnitsSuccess,
        fetchEntrataUnitsStart,
        fetchEntrataUnitsSuccess,
        fetchEntrataUnitsFailure,
        updatePropertyStart,
        updatePropertySuccess,
        updateRentRoll,
        updateRentRollStatus,
        propertyDetailsInit,
        importRentRollFromEntrataStart,
        importRentRollFromEntrataSuccess,
        importRentRollFromEntrataFailure,
        mapEntrataUnitsStart,
        mapEntrataUnitsSuccess,
        mapEntrataUnitsFailure,
        mapEntrataFloorPlanStart,
        mapEntrataFloorPlanSuccess,
        mapEntrataFloorPlanFailure,
        sendWhatsappMessage,
    },
});

export const actions = slice.actions;

export const reducer = slice.reducer;
