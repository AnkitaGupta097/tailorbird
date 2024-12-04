import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import { categorySortingOrder } from "../base-scope/constants";

// eslint-disable-next-line
function fetchAltPackageStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                altPackages: {
                    ...state.details.altScope.altPackages,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltPackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                altPackages: {
                    ...state.details.altScope.altPackages,
                    data: action.payload.altPackages ? [action.payload.altPackages] : [],
                    loading: false,
                },
            },
        },
    });
}

function fetchAltPackageFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                altPackages: {
                    ...state.details.altScope.altPackages,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltPackagesStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                packages: {
                    ...state.details.altScope.packages,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltPackagesSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                packages: {
                    ...state.details.altScope.packages,
                    data: action.payload.packages ? [...action.payload.packages] : [],
                    loading: false,
                },
            },
        },
    });
}

function fetchAltPackagesFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                packages: {
                    ...state.details.altScope.packages,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltScopeTreeStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltScopeTreeSuccess(state: IBudgeting, action: PayloadAction<any>) {
    const sortedData = action.payload.scopeTree
        ?.slice()
        ?.map((t: any) => ({ ...t, initialCost: t.unitCost }))
        ?.sort((a: any, b: any) => {
            const categoryA = a.name.toLowerCase();
            const categoryB = b.name.toLowerCase();
            const positionA = categorySortingOrder.find(
                (item: any) => item.name.toLowerCase() === categoryA,
            )?.position;
            const positionB = categorySortingOrder.find(
                (item: any) => item.name.toLowerCase() === categoryB,
            )?.position;

            if (positionA !== undefined && positionB !== undefined) {
                return positionA - positionB;
            } else if (positionA !== undefined) {
                return -1;
            } else if (positionB !== undefined) {
                return 1;
            } else {
                return 0;
            }
        });

    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    data: sortedData,
                    loading: false,
                },
            },
        },
    });
}

function fetchAltScopeTreeFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltScopeEditTreeStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltScopeEditTreeSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    data: action.payload.scopeTree,
                    loading: false,
                },
            },
        },
    });
}

function fetchAltScopeEditTreeFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltScopeStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function fetchAltScopeSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    data: action.payload.renovations.slice().sort((a: any, b: any) => {
                        const textA = [a.category, a.item].join(" | ").toLowerCase();
                        const textB = [b.category, b.item].join(" | ").toLowerCase();
                        return textA.localeCompare(textB);
                    }),
                    loading: false,
                },
            },
        },
    });
}

function fetchAltScopeFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    loading: false,
                },
            },
        },
    });
}
function updateBaseDataForDiff(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                baseDataForDiff: {
                    ...state.details.altScope.baseDataForDiff,
                    categoryTree: action.payload.catTree || [],
                    totalWavg: { ...action.payload.totalWavg },
                },
            },
        },
    });
}

export const actions = {
    fetchAltPackageStart,
    fetchAltPackageSuccess,
    fetchAltPackageFailure,
    fetchAltPackagesStart,
    fetchAltPackagesSuccess,
    fetchAltPackagesFailure,
    fetchAltScopeTreeStart,
    fetchAltScopeTreeSuccess,
    fetchAltScopeTreeFailure,
    fetchAltScopeEditTreeStart,
    fetchAltScopeEditTreeSuccess,
    fetchAltScopeEditTreeFailure,
    fetchAltScopeStart,
    fetchAltScopeSuccess,
    fetchAltScopeFailure,
    updateBaseDataForDiff,
};
