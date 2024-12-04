import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import { cloneDeep } from "lodash";
// eslint-disable-next-line
function setupGroupStart(state: IBudgeting, action: PayloadAction<any>) {
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
// eslint-disable-next-line
function setupGroupSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    loading: false,
                },
            },
        },
    });
}
// eslint-disable-next-line
function setupGroupFailure(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    loading: false,
                },
            },
        },
    });
}
// eslint-disable-next-line
function upsertGroupStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    loading: true,
                },
                renovations: {
                    ...state.details.flooringScope.renovations,
                    loading: true,
                },
            },
        },
    });
}
// eslint-disable-next-line
function upsertGroupSuccess(state: IBudgeting, action: PayloadAction<any>) {
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
                    data: action.payload.renovations,
                    loading: false,
                },
            },
        },
    });
}
// eslint-disable-next-line
function upsertGroupFailure(state: IBudgeting, action: PayloadAction<any>) {
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
// eslint-disable-next-line
function deleteGroupFailure(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            budgetMetadata: {
                ...state.commonEntities.budgetMetadata,
                isFlooringScopeDefined: false,
            },
        },
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,
                    data: [],
                    loading: false,
                },
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    flooringItems: [],
                    data: [],
                    loading: false,
                },
                subGroups: {
                    ...state.details.flooringScope.subGroups,
                    data: [],
                    loading: false,
                },
            },
        },
    });
}
// eslint-disable-next-line
function deleteGroupStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    loading: true,
                },
                renovations: {
                    ...state.details.flooringScope.renovations,
                    loading: true,
                },
            },
        },
    });
}
// eslint-disable-next-line
function deleteGroupSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        commonEntities: {
            ...state.commonEntities,
            budgetMetadata: {
                ...state.commonEntities.budgetMetadata,
                isFlooringScopeDefined: false,
            },
        },
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,
                    data: [],
                    loading: false,
                },
                flooringTakeOffs: {
                    ...state.details.flooringScope.flooringTakeOffs,
                    flooringItems: [],
                    data: [],
                    loading: false,
                },
                subGroups: {
                    ...state.details.flooringScope.subGroups,
                    data: [],
                    loading: false,
                },
            },
        },
    });
}
function updateFlooringRenovationData(state: IBudgeting, action: PayloadAction<any>) {
    let data: any[] = cloneDeep(state.details.flooringScope.renovations?.data) || [];

    const inactiveIds = action.payload
        .filter((item: any) => !item.is_active)
        .map((item: any) => item.id);
    const updatedData = data
        .filter((item: any) => !inactiveIds.includes(item.id)) // Remove items with IDs present in inactiveIds
        .map((item: any) => {
            const matchingPayloadItem = action.payload.find(
                (payloadItem: any) => payloadItem.id === item.id,
            );
            return matchingPayloadItem ? matchingPayloadItem : item;
        });

    return updateObject(state, {
        details: {
            ...state.details,
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,
                    data: updatedData,
                    loading: false,
                },
            },
        },
    });
}

export const actions = {
    setupGroupStart,
    setupGroupSuccess,
    setupGroupFailure,
    upsertGroupStart,
    upsertGroupSuccess,
    upsertGroupFailure,
    deleteGroupStart,
    deleteGroupSuccess,
    deleteGroupFailure,
    updateFlooringRenovationData,
};
