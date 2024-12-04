import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { updateObject } from "../../../../utils/store-helpers";
import initAjaxState from "../../../common/models/initAjaxState.json";
import { IBudgeting } from "./budgeting-models";
import {
    actions as commonEntitiesActions,
    commonEntities,
} from "./common-entities/common-entities-slice";
import { actions as variationActions, variations } from "./variation";
import { actions as baseScopeDetailsActions, baseScope } from "./base-scope";
import { actions as flooringScopeActions, flooringScope } from "./flooring-scope";
import { actions as basePackageActions, basePackage } from "./base-package";
import { actions as altScopeActions, altScope } from "./alt-scope";

const initState: IBudgeting = {
    commonEntities,
    details: {
        ...initAjaxState,
        basePackage,
        altScope,
        variations,
        baseScope,
        flooringScope,
        newItemList: [],
        newItem: {},
        newItemStatus: { ...initAjaxState, loading: null, insertedNewItemIndex: null },
        packageList: [],
    },
    bidbook: {
        ...initAjaxState,
        data: {
            bidbookUrl: undefined,
            disableExportButton: undefined,
            folderUrl: undefined,
            generateBidbookStatus: undefined,
            rfpManagerSupported: false,
            renoVersion: {
                renovation_version: -1,
                created_at: "",
            },
        },
    },
};

const initialState: IBudgeting = cloneDeep(initState);

// eslint-disable-next-line
function fetchBudgetingDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            loading: true,
        },
    });
}

// eslint-disable-next-line
function fetchExportDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            loading: true,
        },
    });
}

// eslint-disable-next-line
function fetchExportDetailsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            data: {
                ...state.bidbook.data,
                ...action.payload.bidbook,
            },
            loading: false,
        },
    });
}

// eslint-disable-next-line
function fetchExportDetailsFailure(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function saveBidBookStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line
function createBidBookStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            loading: true,
        },
    });
}

// eslint-disable-next-line
function createBidBookSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            data: {
                ...state.bidbook.data,
                ...action.payload.bidbook,
            },
            loading: false,
        },
    });
}

// eslint-disable-next-line
function saveBidBookSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            data: {
                renoVersion: action?.payload?.renoVersion,
            },
            loading: false,
        },
    });
}

// eslint-disable-next-line
function createBidBookFailure(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            loading: false,
        },
    });
}

// eslint-disable-next-line
function saveBidBookFailure(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        bidbook: {
            ...state.bidbook,
            loading: false,
        },
    });
}

const slice = createSlice({
    name: "budgeting",
    initialState: initialState,
    reducers: {
        fetchBudgetingDetailsStart,
        fetchExportDetailsStart,
        fetchExportDetailsSuccess,
        fetchExportDetailsFailure,
        createBidBookStart,
        createBidBookSuccess,
        createBidBookFailure,
        saveBidBookStart,
        saveBidBookSuccess,
        saveBidBookFailure,
        ...commonEntitiesActions,
        ...variationActions,
        ...baseScopeDetailsActions,
        ...basePackageActions,
        ...altScopeActions,
        ...flooringScopeActions,
    },
});

export const actions = slice.actions;

export const reducer = slice.reducer;
