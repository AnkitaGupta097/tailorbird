import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import { IBasePackages } from "./base-package-models";
import initAjaxState from "../../../../common/models/initAjaxState.json";

export const basePackage: IBasePackages = {
    ...initAjaxState,
    data: [],
};

// eslint-disable-next-line
function fetchBasePackageStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: true,
            },
        },
    });
}

// eslint-disable-next-line
function fetchBasePackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                data: [action.payload.basePackage],
                loading: false,
            },
        },
    });
}

function fetchBasePackageFailure(state: IBudgeting) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: false,
            },
        },
    });
}

// eslint-disable-next-line
function addBasePackageStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: true,
            },
        },
    });
}

// eslint-disable-next-line
function addBasePackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: false,
                data: [action.payload],
            },
        },
    });
}

function addBasePackageFailure(state: IBudgeting) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: false,
            },
        },
    });
}

// eslint-disable-next-line
function deleteBasePackageStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: true,
            },
        },
    });
}

// eslint-disable-next-line
function deleteBasePackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: false,
                data: action.payload,
            },
        },
    });
}

// eslint-disable-next-line
function fetchPackageByIdStart(state: IBudgeting, action: PayloadAction<any>) {
    return state;
}

function fetchPackageByIdSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: updateObject(state.details, { packageList: action.payload }),
    });
}

function deleteBasePackageFailure(state: IBudgeting) {
    return updateObject(state, {
        details: {
            ...state.details,
            basePackage: {
                ...state.details.basePackage,
                loading: false,
            },
        },
    });
}

export const actions = {
    addBasePackageStart,
    addBasePackageSuccess,
    addBasePackageFailure,
    deleteBasePackageStart,
    deleteBasePackageSuccess,
    deleteBasePackageFailure,
    fetchPackageByIdStart,
    fetchBasePackageStart,
    fetchPackageByIdSuccess,
    fetchBasePackageSuccess,
    fetchBasePackageFailure,
};
