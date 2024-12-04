import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";

// eslint-disable-next-line
function updateVariationDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    loading: true,
                },
            },
        },
    });
}

function updateVariationDetailsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    loading: false,
                },
                items: {
                    ...state.details.variations.items,
                    loading: false,
                    data: state.details.variations.items.data.map((v) =>
                        v.id === action.payload.id ? action.payload : v,
                    ),
                },
            },
        },
    });
}

function updateVariationDetailsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function createVariationDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    loading: true,
                },
            },
        },
    });
}

function createVariationDetailsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    loading: false,
                },
                items: {
                    ...state.details.variations.items,
                    loading: false,
                    data: [...state.details.variations.items.data, action.payload],
                },
            },
        },
    });
}

function createVariationDetailsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function deleteVariationsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                items: {
                    ...state.details.variations.items,
                    loading: true,
                },
                details: {
                    ...state.details.variations.details,
                    loading: true,
                },
            },
        },
    });
}

function deleteVariationsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                items: {
                    ...state.details.variations.items,
                    loading: false,
                    data: [
                        ...state.details.variations.items.data.filter(
                            (vitem) => vitem.id !== action.payload.id,
                        ),
                    ],
                },
                details: {
                    ...state.details.variations.details,
                    loading: false,
                },
            },
        },
    });
}

function deleteVariationsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                items: {
                    ...state.details.variations.items,
                    loading: false,
                },
                details: {
                    ...state.details.variations.details,
                    loading: false,
                },
            },
        },
    });
}

export const actions = {
    updateVariationDetailsStart,
    updateVariationDetailsSuccess,
    updateVariationDetailsFailure,
    createVariationDetailsStart,
    createVariationDetailsSuccess,
    createVariationDetailsFailure,
    deleteVariationsStart,
    deleteVariationsSuccess,
    deleteVariationsFailure,
};
