import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import { categoryOrderObj } from "./constants";

// eslint-disable-next-line
function fetchBaseScopeDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    loading: true,
                },
            },
        },
    });
}

function fetchBaseScopeDetailsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    data: action.payload.baseScopeDetails,
                    loading: false,
                },
            },
            flooringScope: {
                ...state.details.flooringScope,
                categories: {
                    ...state.details.flooringScope.categories,
                    data: action.payload.baseScopeDetails.filter((item: any) =>
                        item.name.toLowerCase().includes("flooring"),
                    ),
                },
            },
        },
    });
}

function fetchBaseScopeDetailsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchInventoryDetailsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    loading: true,
                },
            },
        },
    });
}

function fetchInventoryDetailsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    data: action.payload.baseScopeDetails.slice().sort((a: any, b: any) => {
                        const textA = a.name.toLowerCase();
                        const textB = b.name.toLowerCase();
                        return textA.localeCompare(textB);
                    }),
                    loading: false,
                },
            },
            flooringScope: {
                ...state.details.flooringScope,
                categories: {
                    ...state.details.flooringScope.categories,
                    data: action.payload.baseScopeDetails.filter((item: any) =>
                        item.name.toLowerCase().includes("flooring"),
                    ),
                },
            },
        },
    });
}

function fetchInventoryDetailsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                categories: {
                    ...state.details.baseScope.categories,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchInventoriesStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                inventories: {
                    ...state.details.baseScope.inventories,
                    loading: true,
                },
            },
        },
    });
}

function fetchInventoriesSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                inventories: {
                    ...state.details.baseScope.inventories,
                    data: action.payload.inventories,
                    loading: false,
                },
            },
        },
    });
}

function fetchInventoriesFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                inventories: {
                    ...state.details.baseScope.inventories,
                    loading: false,
                },
            },
        },
    });
}

function fetchRenovationsFailure(state: IBudgeting, action: PayloadAction<any>) {
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
function fetchFloorplanCostsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                floorplanCosts: {
                    ...state.details.baseScope.floorplanCosts,
                    loading: true,
                },
            },
        },
    });
}

function fetchFloorplanCostsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                floorplanCosts: {
                    ...state.details.baseScope.floorplanCosts,
                    data: action.payload.floorplanCosts,
                    loading: false,
                },
            },
        },
    });
}

function fetchFloorplanCostsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                floorplanCosts: {
                    ...state.details.baseScope.floorplanCosts,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchMaterialOptionsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialOptions: {
                    ...state.details.baseScope.materialOptions,
                    loading: true,
                },
            },
        },
    });
}

function fetchMaterialOptionsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialOptions: {
                    ...state.details.baseScope.materialOptions,
                    data: [...action.payload.getMaterials],
                    loading: false,
                },
            },
        },
    });
}

function fetchMaterialOptionsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialOptions: {
                    ...state.details.baseScope.materialOptions,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchLaborOptionsStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialOptions: {
                    ...state.details.baseScope.materialOptions,
                    loading: true,
                },
            },
        },
    });
}

function fetchLaborOptionsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialOptions: {
                    ...state.details.baseScope.materialOptions,
                    data: [...action.payload.materialOptions],
                    loading: false,
                },
            },
        },
    });
}

function fetchLaborOptionsFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialOptions: {
                    ...state.details.baseScope.materialOptions,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchMaterialsForSearchStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialsForSearch: {
                    ...state.details.baseScope.materialsForSearch,
                    loading: true,
                },
            },
        },
    });
}

function fetchMaterialsForSearchSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialsForSearch: {
                    ...state.details.baseScope.materialsForSearch,
                    data: action.payload.getMaterials,
                    loading: false,
                },
            },
        },
    });
}

function fetchMaterialsForSearchFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                materialsForSearch: {
                    ...state.details.baseScope.materialsForSearch,
                    loading: false,
                },
            },
        },
    });
}

function fetchBaseScopeRenosStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    loading: action.payload?.feature ? false : true,
                },
            },
        },
    });
}

function fetchBaseScopeRenosSuccess(state: IBudgeting, action: PayloadAction<any>) {
    // const sortedData = action.payload
    //     .slice()
    //     .map((t: any) => ({ ...t, initialCost: t.unitCost }))
    //     .sort((a: any, b: any) => {
    //         const categoryA = a.category.toLowerCase();
    //         const categoryB = b.category.toLowerCase();
    //         const positionA = categorySortingOrder.find(
    //             (item: any) => item.name.toLowerCase() === categoryA,
    //         )?.position;
    //         const positionB = categorySortingOrder.find(
    //             (item: any) => item.name.toLowerCase() === categoryB,
    //         )?.position;

    //         if (positionA !== undefined && positionB !== undefined) {
    //             return positionA - positionB;
    //         } else if (positionA !== undefined) {
    //             return -1;
    //         } else if (positionB !== undefined) {
    //             return 1;
    //         } else {
    //             return 0;
    //         }
    //     });

    return updateObject(state, {
        details: {
            ...state.details,
            baseScope: {
                ...state.details.baseScope,
                renovations: {
                    ...state.details.baseScope.renovations,
                    data: action.payload
                        .slice()
                        .map((t: any) => ({ ...t, initialCost: t.unitCost }))
                        .sort((a: any, b: any) => {
                            const textA = [
                                `0${categoryOrderObj[a.category] || ""}`.slice(-2),
                                a.item,
                                a.workType,
                            ]
                                .join(" | ")
                                .toLowerCase();
                            const textB = [
                                `0${categoryOrderObj[b.category] || ""}`.slice(-2),
                                b.item,
                                b.workType,
                            ]
                                .join(" | ")
                                .toLowerCase();
                            return textA.localeCompare(textB);
                        }),
                    loading: false,
                },
            },
        },
    });
}

function fetchBaseScopeRenosFailure(state: IBudgeting, action: PayloadAction<any>) {
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
function fetchDataSourceNewItemsStart(state: IBudgeting, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function fetchDataSourceNewItemsSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: updateObject(state.details, { newItemList: action.payload.getDataSourceNewItems }),
    });
}

function updateItemList(state: IBudgeting, action: PayloadAction<any>) {
    const { key, value, itemIndex } = action.payload;
    state.details.newItemList.splice(itemIndex, 1, {
        ...state.details.newItemList[itemIndex],
        [key]: value,
    });
    return state;
}

export const actions = {
    fetchBaseScopeDetailsStart,
    fetchDataSourceNewItemsStart,
    fetchDataSourceNewItemsSuccess,
    fetchBaseScopeDetailsSuccess,
    fetchBaseScopeDetailsFailure,
    fetchInventoriesStart,
    fetchInventoriesSuccess,
    fetchInventoriesFailure,
    fetchRenovationsFailure,
    fetchFloorplanCostsStart,
    fetchFloorplanCostsSuccess,
    fetchFloorplanCostsFailure,
    fetchMaterialOptionsStart,
    fetchMaterialOptionsSuccess,
    fetchMaterialOptionsFailure,
    fetchLaborOptionsStart,
    fetchLaborOptionsSuccess,
    fetchLaborOptionsFailure,
    fetchMaterialsForSearchStart,
    fetchMaterialsForSearchSuccess,
    fetchMaterialsForSearchFailure,
    fetchBaseScopeRenosStart,
    fetchBaseScopeRenosSuccess,
    fetchBaseScopeRenosFailure,
    fetchInventoryDetailsStart,
    fetchInventoryDetailsSuccess,
    fetchInventoryDetailsFailure,
    updateItemList,
};
