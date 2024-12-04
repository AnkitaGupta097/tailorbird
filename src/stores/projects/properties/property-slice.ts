import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import initState from "./property-init";
import { IProperties } from "./property-models";
import { updateObject } from "../../../utils/store-helpers";

const initialState: IProperties = cloneDeep(initState);

// eslint-disable-next-line
function fetchAllPropertyStart(state: IProperties, action: PayloadAction<any>) {
    console.log("in fetchAll");
    return state;
}

// eslint-disable-next-line
function fetchArchivePropertyStart(state: IProperties, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function deletePropertyStart(state: IProperties, action: PayloadAction<any>) {
    return updateObject(state, {
        archive_properties: updateObject(state.archive_properties, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function restorePropertyStart(state: IProperties, action: PayloadAction<any>) {
    return updateObject(state, {
        archive_properties: updateObject(state.archive_properties, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function restorePropertySuccess(state: IProperties, action: PayloadAction<any>) {
    const properties = state.archive_properties.data.filter((property: any) => {
        return property.id !== action.payload.id;
    });
    return updateObject(state, {
        archive_properties: updateObject(state.archive_properties, {
            data: properties,
            loading: false,
        }),
    });
}

// eslint-disable-next-line
function deletePropertySuccess(state: IProperties, action: PayloadAction<any>) {
    const properties = state.properties.filter((property: any) => {
        return property.id !== action.payload.id;
    });
    return updateObject(state, {
        properties: properties,
        archive_properties: updateObject(state.archive_properties, {
            loading: false,
            data: [action.payload, ...state.archive_properties.data],
        }),
    });
}
function deletePropertyError(state: IProperties, action: PayloadAction<any>) {
    const properties = state.properties.filter((property: any) => {
        return property.id !== action.payload.id;
    });
    return updateObject(state, {
        properties: properties,
        archive_properties: updateObject(state.archive_properties, {
            loading: false,
            data: [action.payload, ...state.archive_properties.data],
        }),
    });
}

function fetchArchivePropertySuccess(state: IProperties, action: PayloadAction<any>) {
    return updateObject(state, {
        archive_properties: updateObject(state.archive_properties, {
            data: action.payload.getProperties,
        }),
    });
}

// eslint-disable-next-line
// function fetchOrganizationStart(state: IProperties, action: PayloadAction<any>) {
//     return state;
// }

// // eslint-disable-next-line
// function fetchOrganizationUsersStart(state: IProperties, action: PayloadAction<any>) {
//     return updateObject(state, {
//         user_organization: updateObject(state.user_organization, {
//             loading: true,
//         }),
//     });
// }

// // eslint-disable-next-line
// function fetchAllUserStart(state: IProperties, action: PayloadAction<any>) {
//     return updateObject(state, {
//         all_User: updateObject(state.user_organization, {
//             loading: true,
//         }),
//     });
// }

// function fetchAllUserSuccess(state: IProperties, action: PayloadAction<any>) {
//     return updateObject(state, {
//         all_User: updateObject(state.user_organization, {
//             loading: false,
//             users: action.payload.getAllUsers,
//         }),
//     });
// }

// eslint-disable-next-line
function createPropertyStart(state: IProperties, action: PayloadAction<any>) {
    return updateObject(state, {
        created_property: updateObject(state.created_property, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function createProjectMergeFromOwnership(state: IProperties, action: PayloadAction<any>) {
    return { ...state };
}

function createPropertySuccess(state: IProperties, action: PayloadAction<any>) {
    console.log("!", state.properties, action.payload, "need to change here!");
    const prop = state.properties || [];
    return updateObject(state, {
        created_property: updateObject(state.created_property, {
            loading: false,
            propertyDetails: action.payload,
        }),
        properties: [action.payload, ...prop],
    });
}

// eslint-disable-next-line
function createPropertyModify(state: IProperties, action: PayloadAction<any>) {
    return updateObject(state, {
        created_property: updateObject(state.created_property, {
            loading: false,
            propertyDetails: null,
        }),
    });
}

// function fetchOrganizationUsersSuccess(state: IProperties, action: PayloadAction<any>) {
//     return updateObject(state, {
//         user_organization: updateObject(state.user_organization, {
//             loading: false,
//             users: action.payload?.getAllUsersByOrgId,
//         }),
//     });
// }

function fetchAllPropertySuccess(state: IProperties, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        properties: action.payload?.getProperties,
    });
}

// function fetchOrganizationSuccess(state: IProperties, action: PayloadAction<any>) {
//     return updateObject(state, {
//         organization: action.payload?.getAllOrganizations,
//     });
// }

const slice = createSlice({
    name: "property",
    initialState: initialState,
    reducers: {
        fetchAllPropertyStart,
        fetchAllPropertySuccess,
        // fetchOrganizationStart,
        // fetchOrganizationSuccess,
        // fetchOrganizationUsersStart,
        // fetchOrganizationUsersSuccess,
        createPropertyStart,
        createPropertySuccess,
        // fetchAllUserStart,
        createPropertyModify,
        // fetchAllUserSuccess,
        fetchArchivePropertyStart,
        fetchArchivePropertySuccess,
        deletePropertyStart,
        restorePropertyStart,
        deletePropertySuccess,
        restorePropertySuccess,
        deletePropertyError,
        createProjectMergeFromOwnership,
    },
});

export const actions = slice.actions;

export default slice.reducer;
