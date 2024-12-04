import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import { cloneDeep } from "lodash";

function defineInventoryStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    data: action.payload.categories,
                },
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: true,
                },
            },
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,

                    loading: true,
                },
            },
        },
    });
}

function defineInventorySuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    data: action.payload.renovations || [],
                    loading: false,
                },
            },
        },
    });
}

function defineInventoryFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function updateInventoryStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: true,
                },
            },
            flooringScope: {
                ...state.details.flooringScope,
                renovations: {
                    ...state.details.flooringScope.renovations,

                    loading: true,
                },
            },
        },
    });
}

function updateInventorySuccess(state: IBudgeting) {
    //     let renIdx =
    //         state.details.baseScope.renovations.data?.findIndex(
    //             (reno) => reno.id === action.payload.renovation.id,
    //         ) ?? -1;
    //
    //     if (renIdx >= 0 && state.details.baseScope.renovations.data?.length) {
    //         state.details.baseScope.renovations.data[renIdx] = updateObject(
    //             state.details.baseScope.renovations.data[renIdx],
    //             action.payload.renovation,
    //         );
    //     }

    state.details.baseScope.renovations.loading = false;
    // eslint-disable-next-line
    return state;
}

function updateInventoryFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function deleteInventoryStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function deleteInventorySuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    data: state.details.baseScope.renovations.data.filter(
                        (ren: any) => ren.inventoryId !== action.payload.id,
                    ),
                    loading: false,
                },
            },
        },
    });
}

function deleteInventoryFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function updateRenovationItemStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function updateRenovationItemSuccess(state: any, action: PayloadAction<any>) {
    const scopeType = action.payload.scopeType;
    const renoIdx = state.details[scopeType].renovations.data.findIndex(
        (reno: any) => reno.id === action.payload.id,
    );

    if (
        renoIdx >= 0 &&
        action.payload.removeSku &&
        state.details[scopeType].renovations.data[renoIdx]
    ) {
        state.details[scopeType].renovations.data[renoIdx].workId = "";
        state.details[scopeType].renovations.data[renoIdx].description = "";
        state.details[scopeType].renovations.data[renoIdx].unitCost = 0;
        state.details[scopeType].renovations.data[renoIdx].modelNo = "";
        state.details[scopeType].renovations.data[renoIdx].imageUrl = "";
        state.details[scopeType].renovations.data[renoIdx].manufacturer = "";
        state.details[scopeType].renovations.data[renoIdx].supplier = "";
        state.details[scopeType].renovations.data[renoIdx].itemNo = "";
        state.details[scopeType].renovations.data[renoIdx].initialCost = 0;
    } else if (
        renoIdx >= 0 &&
        state.details[scopeType].renovations.data[renoIdx] &&
        action.payload.workPrice
    ) {
        state.details[scopeType].renovations.data[renoIdx].description = action.payload.description;
        state.details[scopeType].renovations.data[renoIdx].workId = action.payload.skuId;
        state.details[scopeType].renovations.data[renoIdx].unitCost = action.payload.workPrice;
        state.details[scopeType].renovations.data[renoIdx].initialCost = action.payload.workPrice;
        state.details[scopeType].renovations.data[renoIdx].imageUrl = action.payload.imageUrl;
    } else if (
        renoIdx >= 0 &&
        state.details[scopeType].renovations.data[renoIdx] &&
        action.payload.skuId
    ) {
        state.details[scopeType].renovations.data[renoIdx] = {
            ...state.details[scopeType].renovations.data[renoIdx],
            unitCost: action.payload.workPrice,
            workId: action.payload.skuId,
            description: action.payload.description,
            imageUrl: action.payload.imageUrl,
            initialCost: action.payload.workPrice,
            location: action.payload.location,
            manufacturer: action.payload.manufacturer,
            modelNo: action.payload.modelNo,
            supplier: action.payload.supplier,
            itemNo: action.payload.itemNo,
        };
    }

    state.details[scopeType].renovations.data[renoIdx].updated = true;

    state.details[scopeType].renovations.loading = false;

    return state;
}

function updateRenovationItemFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: false,
                },
            },
        },
    });
}

function stopFlashingRenovationItem(state: any, action: PayloadAction<any>) {
    const scopeType = action.payload.scopeType;
    const renoIdx = state.details[scopeType].renovations.data.findIndex(
        (reno: any) => reno.id === action.payload.id,
    );
    state.details[scopeType].renovations.data[renoIdx].updated = false;
    return state;
}
function updateRenovationItemsWithSelectionFlag(state: any, action: PayloadAction<any>) {
    const scopeType = action.payload.scopeType;
    const updatedRenovations = action.payload.renoItems;
    state.details[scopeType].updatedRenovations = updatedRenovations;
    return state;
}

function createNewItem(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: updateObject(state.details, {
            newItem: action.payload,
        }),
    });
}

function createNewItemLoader(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: updateObject(state.details, {
            newItemStatus: updateObject(state.details.newItemStatus, {
                loading: action.payload,
            }),
        }),
    });
}

function updateNewlyInsertedItem(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: updateObject(state.details, {
            newItemStatus: updateObject(state.details.newItemStatus, {
                insertedNewItemIndex: action.payload,
            }),
        }),
    });
}
function updateBaseRenovationData(state: IBudgeting, action: PayloadAction<any>) {
    let data: any[] = cloneDeep(state.details.baseScope.renovations?.data) || [];

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
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    data: updatedData,
                    loading: false,
                },
            },
        },
    });
}

function createBaseRenovationData(state: IBudgeting, action: PayloadAction<any>) {
    console.log("created");
    const data: any[] = cloneDeep(state.details.baseScope.renovations?.data) || [];
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    data: [action.payload, ...data],
                    loading: false,
                },
            },
        },
    });
}

export const actions = {
    defineInventoryStart,
    defineInventorySuccess,
    defineInventoryFailure,
    updateInventoryStart,
    updateInventorySuccess,
    updateInventoryFailure,
    deleteInventoryStart,
    deleteInventorySuccess,
    deleteInventoryFailure,
    updateRenovationItemStart,
    createNewItem,
    createNewItemLoader,
    updateRenovationItemSuccess,
    updateRenovationItemFailure,
    stopFlashingRenovationItem,
    updateRenovationItemsWithSelectionFlag,
    updateNewlyInsertedItem,
    updateBaseRenovationData,
    createBaseRenovationData,
};
