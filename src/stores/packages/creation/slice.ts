import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { ISKURow } from "./interface";
import { updateObject } from "../../../utils/store-helpers";
import initAjaxState from "../../common/models/initAjaxState.json";

const initState: any = cloneDeep(initAjaxState);
initState.loading = false;
initState.data = [];
initState.errorData = {};
initState.userInputs = {};
initState.allSubCats = [];

export interface IPackagesstate {
    loading: boolean;
    error?: boolean;
    saved?: boolean;
    packageId: string;
    data: [];
    userInputs: {
        name: string;
        style: string;
        finish: string;
        grade: string;
        workType: string;
    };
    errorData: {
        skuRows: ISKURow[];
        altRows: ISKURow[];
        skuErrors: { ISKURow: any } | {};
        altErrors: { ISKURow: any } | {};
        errorColumnsValue: {
            distinctStyles: boolean;
            distinctFinish: boolean;
            distinctGrades: boolean;
        };
        allSubCats: string[];
    };
    allSubCats: string[];
}
const initialState: IPackagesstate = initState;

function fetchPackagesStart(
    state: IPackagesstate,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchPackagesSuccess(state: IPackagesstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: action.payload,
    });
}

function fetchPackagesFailure(
    state: IPackagesstate,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
    });
}

function createPackageStart(
    state: IPackagesstate,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function createPackageSuccess(state: IPackagesstate, action: PayloadAction<any>) {
    if (action.payload.error) {
        return updateObject(state, {
            loading: false,
            error: action?.payload?.error,
            saved: false,
        });
    } else
        return updateObject(state, {
            loading: false,
            packageId: action?.payload?.response?.package_id,
            saved: true,
            error: false,
        });
}

function updateStoreWithData(state: IPackagesstate, action: PayloadAction<any>) {
    return updateObject(state, {
        ...action.payload,
    });
}

function createPackageFailure(globalState: IPackagesstate, action: PayloadAction<any>) {
    const { skus, alts, errorData, userInputs, allsubCats } = action.payload;
    if (errorData) {
        const state = cloneDeep(current(globalState));
        const skuData = state.errorData.skuErrors || {};
        const altData = state.errorData.altErrors || {};
        skus.forEach((sku: { row_id: string | number; errors: any[] }) => {
            //@ts-ignore
            if (!skuData[sku.row_id]) {
                //@ts-ignore
                skuData[sku.row_id] = {};
            }
            sku.errors.forEach((skuError: { column: string | number }) => {
                //@ts-ignore
                skuData[sku.row_id][skuError.column] = {
                    err: skuError,
                    userAction: { action: null, value: null },
                };
            });
        });
        alts.forEach((alt: { row_id: string | number; errors: any[] }) => {
            //@ts-ignore
            if (!altData[alt.row_id]) {
                //@ts-ignore
                altData[alt.row_id] = {};
            }
            alt.errors.forEach((altError: { column: string | number }) => {
                //@ts-ignore
                altData[alt.row_id][altError.column] = {
                    err: altError,
                    userAction: { action: null, value: null },
                };
            });
        });
        const stateObj = {
            skuRows: skus,
            altRows: alts,
            skuErrors: skuData,
            altErrors: altData,
            errorColumnsValue: {
                distinctStyles: errorData?.distinctStyles ?? false,
                distinctFinish: errorData?.distinctFinish ?? false,
                distinctGrades: errorData?.distinctGrades ?? false,
            },

            allSubCats: allsubCats ?? ([] as String[]),
        };

        return updateObject(state, {
            loading: false,
            userInputs: userInputs,
            errorData: stateObj,
        });
    } else {
        return updateObject(globalState, {
            loading: false,
        });
    }
}

function updatePackageErrorStateStart(
    state: IPackagesstate,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}
function updatePackageMetaDataStart(
    state: IPackagesstate,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}
function updatePackageMetaDataComplete(state: IPackagesstate, action: PayloadAction<any>) {
    if (action.payload.error) {
        return updateObject(state, {
            loading: false,
            error: action.payload.error,
        });
    }
    return updateObject(state, {
        loading: false,
        error: false,
    });
}
//eslint-disable-next-line
function updateState(state: IPackagesstate, action: PayloadAction<any>) {
    return updateObject(state, {
        saved: false,
        error: false,
        packageId: null,
    });
}

function updatePackageErrorState(state: IPackagesstate, action: PayloadAction<any>) {
    const stateObj = cloneDeep(current(state)).errorData;
    Object.keys(stateObj).forEach((key) => {
        if (action.payload[key]) {
            //@ts-ignore
            stateObj[key] = action.payload[key];
        }
    });
    // stateObj.skuErrors = skuErrors;
    console.log("stateUpated", stateObj);
    return updateObject(state, {
        loading: false,
        errorData: stateObj,
    });
}

const slice = createSlice({
    name: "PACKAGES",
    initialState: initialState,
    reducers: {
        fetchPackagesStart,
        fetchPackagesSuccess,
        fetchPackagesFailure,
        createPackageStart,
        createPackageSuccess,
        createPackageFailure,
        updateStoreWithData,
        updatePackageErrorStateStart,
        updatePackageErrorState,
        updatePackageMetaDataStart,
        updatePackageMetaDataComplete,
        updateState,
    },
});

export const actions = slice.actions;

export default slice.reducer;
