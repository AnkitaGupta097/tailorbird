import { PayloadAction } from "@reduxjs/toolkit";
import { updateObject } from "../../../../../utils/store-helpers";
import { IBudgeting } from "../budgeting-models";
import { altScope as initState } from "./index";
import { cloneDeep } from "lodash";

// eslint-disable-next-line
function addAltPackageStart(state: IBudgeting, action: PayloadAction<any>) {
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
function addAltPackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                altPackages: {
                    ...state.details.altScope.altPackages,
                    data: [action.payload.altPackages],
                    loading: false,
                },
            },
        },
    });
}

function addAltPackageFailure(state: IBudgeting, action: PayloadAction<any>) {
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
function deleteAltPackageStart(state: IBudgeting, action: PayloadAction<any>) {
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
function deleteAltPackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                altPackages: {
                    ...state.details.altScope.altPackages,
                    data: [
                        ...state.details.altScope.altPackages.data.filter(
                            (pack: any) => pack.id !== action.payload.id,
                        ),
                    ],
                    loading: false,
                },
            },
        },
    });
}

function deleteAltPackageFailure(state: IBudgeting, action: PayloadAction<any>) {
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
function editAltPackageStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                packages: {
                    ...state.details.altScope.packages.data,
                    loading: true,
                },
            },
        },
    });
}

// eslint-disable-next-line
function editAltPackageSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                packages: {
                    ...state.details.altScope.packages.data,
                    data: action.payload.altPackages,
                    loading: false,
                },
            },
        },
    });
}

function editAltPackageFailure(state: IBudgeting, action: PayloadAction<any>) {
    console.error(action.payload);
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                packages: {
                    ...state.details.altScope.packages.data,
                    loading: false,
                },
            },
        },
    });
}

// eslint-disable-next-line
function createAltScopeStart(state: IBudgeting, action: PayloadAction<any>) {
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
function createAltScopeSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    data: action.payload.renovations,
                    loading: false,
                },
            },
        },
    });
}

function createAltScopeFailure(state: IBudgeting, action: PayloadAction<any>) {
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

// eslint-disable-next-line
function updateAltScopeStart(state: IBudgeting, action: PayloadAction<any>) {
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
function updateAltScopeSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    data: action.payload.renovations,
                    loading: false,
                },
            },
        },
    });
}

function updateAltScopeFailure(state: IBudgeting, action: PayloadAction<any>) {
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

// eslint-disable-next-line
function deleteAltScopeStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    loading: true,
                    data: [],
                },
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    loading: false,
                    data: [],
                },
            },
        },
    });
}

// eslint-disable-next-line
function deleteAltScopeSuccess(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    data: action.payload.renovations,
                    loading: false,
                },
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    data: action.payload.scopeTrees,
                    loading: false,
                },
            },
        },
    });
}

function deleteAltScopeFailure(state: IBudgeting, action: PayloadAction<any>) {
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

function updateScopeTreeStart(state: IBudgeting, action: PayloadAction<any>) {
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                scopeTrees: {
                    ...state.details.altScope.scopeTrees,
                    data: action.payload.scopeTrees,
                },
            },
        },
    });
}

function removeCommonAltPackage(state: IBudgeting, action: PayloadAction<any>) {
    const packageIndex = state.details.altScope.packages.data.findIndex(
        (t) => (t.id = action.payload),
    );

    return updateObject(state, {
        details: updateObject(state.details, {
            altScope: updateObject(state.details.altScope, {
                packages: updateObject(state.details.altScope.packages, {
                    data: state.details.altScope.packages.data.splice(packageIndex, 1),
                }),
            }),
        }),
    });
}

function clearCreateOrUpdateAltScope(state: IBudgeting) {
    return updateObject(state, {
        details: updateObject(state.details, {
            altScope: updateObject(state.details.altScope, {
                scopeTrees: updateObject(state.details.altScope.scopeTrees, initState.scopeTrees),
            }),
        }),
    });
}
function updateAltRenovationData(state: IBudgeting, action: PayloadAction<any>) {
    let data: any[] = cloneDeep(state.details.altScope.renovations?.data) || [];

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
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    data: updatedData,
                    loading: false,
                },
            },
        },
    });
}
function createAltRenovationData(state: IBudgeting, action: PayloadAction<any>) {
    const data: any[] = cloneDeep(state.details.altScope.renovations?.data) || [];
    return updateObject(state, {
        details: {
            ...state.details,
            altScope: {
                ...state.details.altScope,
                renovations: {
                    ...state.details.altScope.renovations,
                    data: [action.payload, ...data],
                    loading: false,
                },
            },
        },
    });
}

export const actions = {
    addAltPackageStart,
    addAltPackageSuccess,
    addAltPackageFailure,
    editAltPackageStart,
    editAltPackageSuccess,
    editAltPackageFailure,
    deleteAltPackageStart,
    deleteAltPackageSuccess,
    deleteAltPackageFailure,
    createAltScopeStart,
    createAltScopeSuccess,
    createAltScopeFailure,
    deleteAltScopeStart,
    deleteAltScopeSuccess,
    deleteAltScopeFailure,
    updateAltScopeStart,
    updateAltScopeSuccess,
    updateAltScopeFailure,
    updateScopeTreeStart,
    removeCommonAltPackage,
    clearCreateOrUpdateAltScope,
    updateAltRenovationData,
    createAltRenovationData,
};
