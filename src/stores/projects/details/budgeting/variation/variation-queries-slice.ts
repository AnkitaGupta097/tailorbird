import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";

// eslint-disable-next-line
function fetchVariationDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: { ...state.details.variations.details, loading: true },
            },
        },
    });
}

function fetchVariationDetailsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                details: {
                    ...state.details.variations.details,
                    data: action.payload,
                    loading: false,
                },
            },
        },
    });
}

function fetchVariationDetailsFailure(state: IBudgeting, action: PayloadAction<any>) {
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
function fetchVariationsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                items: {
                    ...state.details.variations.items,
                    loading: true,
                },
            },
        },
    });
}

function fetchVariationsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                items: {
                    ...state.details.variations.items,
                    data: action.payload.variations,
                    loading: false,
                },
            },
        },
    });
}

function fetchVariationsFailure(state: IBudgeting, action: PayloadAction<any>) {
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
            },
        },
    });
}

// eslint-disable-next-line
function fetchVariationInitItemsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                initItems: {
                    ...state.details.variations.initItems,
                    loading: true,
                },
            },
        },
    });
}

function fetchVariationInitItemsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                initItems: {
                    ...state.details.variations.initItems,
                    data: action.payload.initItems,
                    loading: false,
                },
            },
        },
    });
}

function fetchVariationInitItemsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                initItems: {
                    ...state.details.variations.initItems,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchFloorplansStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                baseFloorplans: {
                    ...state.details.variations.baseFloorplans,
                    loading: true,
                },
            },
        },
    });
}

function fetchFloorplansSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                baseFloorplans: {
                    ...state.details.variations.baseFloorplans,
                    data: action.payload.floorplans,
                    loading: false,
                },
            },
        },
    });
}

function fetchFloorplansFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            variations: {
                ...state.details.variations,
                baseFloorplans: {
                    ...state.details.variations.baseFloorplans,
                    loading: false,
                },
            },
        },
    });
}

export const actions = {
    fetchVariationDetailsStart,
    fetchVariationDetailsSuccess,
    fetchVariationDetailsFailure,
    fetchVariationsStart,
    fetchVariationsSuccess,
    fetchVariationsFailure,
    fetchVariationInitItemsStart,
    fetchVariationInitItemsSuccess,
    fetchVariationInitItemsFailure,
    fetchFloorplansStart,
    fetchFloorplansSuccess,
    fetchFloorplansFailure,
};
