import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import initState from "./tpsm-init";
import { ITPSM } from "./tpsm-models";
import { updateObject } from "../../../utils/store-helpers";

const initialState: ITPSM = cloneDeep(initState);

// eslint-disable-next-line
function fetchAllProjectStart(state: ITPSM, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function fetchArchiveProjectStart(state: ITPSM, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function deleteProjectStart(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        archive_projects: updateObject(state.archive_projects, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function restoreProjectStart(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        archive_projects: updateObject(state.archive_projects, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function restoreProjectSuccess(state: ITPSM, action: PayloadAction<any>) {
    const projects = state.archive_projects.data.filter((project: any) => {
        return project.id !== action.payload.id;
    });
    return updateObject(state, {
        archive_projects: updateObject(state.archive_projects, {
            data: projects,
            loading: false,
        }),
    });
}

// eslint-disable-next-line
function deleteProjectSuccess(state: ITPSM, action: PayloadAction<any>) {
    const projects = state.projects.filter((project: any) => {
        return project.id !== action.payload.id;
    });
    return updateObject(state, {
        projects: projects,
        archive_projects: updateObject(state.archive_projects, {
            loading: false,
            data: [action.payload, ...state.archive_projects.data],
        }),
    });
}
function deleteProjectError(state: ITPSM, action: PayloadAction<any>) {
    const projects = state.projects.filter((project: any) => {
        return project.id !== action.payload.id;
    });
    return updateObject(state, {
        projects: projects,
        archive_projects: updateObject(state.archive_projects, {
            loading: false,
            data: [action.payload, ...state.archive_projects.data],
        }),
    });
}

function fetchArchiveProjectSuccess(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        archive_projects: updateObject(state.archive_projects, {
            data: action.payload.getArchivedProjects,
        }),
    });
}

// eslint-disable-next-line
function fetchOrganizationStart(state: ITPSM, action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function fetchOrganizationUsersStart(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        user_organization: updateObject(state.user_organization, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line
function fetchAllUserStart(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        all_User: updateObject(state.user_organization, {
            loading: true,
        }),
    });
}

function fetchAllUserSuccess(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        all_User: updateObject(state.user_organization, {
            loading: false,
            users: action.payload.getAllUsers,
        }),
    });
}

// eslint-disable-next-line
function createProjectStart(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        created_project: updateObject(state.created_project, {
            loading: true,
        }),
    });
}

function createProjectSuccess(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        created_project: updateObject(state.created_project, {
            loading: false,
            projectDetails: action.payload,
        }),
        projects: [action.payload, ...state.projects],
    });
}
// eslint-disable-next-line
function createProjectModify(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        created_project: updateObject(state.created_project, {
            loading: false,
            projectDetails: null,
        }),
    });
}

function fetchOrganizationUsersSuccess(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        user_organization: updateObject(state.user_organization, {
            loading: false,
            users: action.payload?.getAllUsersByOrgId,
        }),
    });
}

function fetchAllProjectSuccess(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        projects: action.payload?.getProjects,
    });
}

function fetchOrganizationSuccess(state: ITPSM, action: PayloadAction<any>) {
    return updateObject(state, {
        organization: action.payload?.getAllOrganizations,
    });
}

// eslint-disable-next-line
function addPropertyOrProjectRequest(state: ITPSM, action: PayloadAction<any>) {}

const slice = createSlice({
    name: "tpsm",
    initialState: initialState,
    reducers: {
        fetchAllProjectStart,
        fetchAllProjectSuccess,
        fetchOrganizationStart,
        fetchOrganizationSuccess,
        fetchOrganizationUsersStart,
        fetchOrganizationUsersSuccess,
        createProjectStart,
        createProjectSuccess,
        fetchAllUserStart,
        createProjectModify,
        fetchAllUserSuccess,
        fetchArchiveProjectStart,
        fetchArchiveProjectSuccess,
        deleteProjectStart,
        restoreProjectStart,
        deleteProjectSuccess,
        restoreProjectSuccess,
        deleteProjectError,
        addPropertyOrProjectRequest,
    },
});

export const actions = slice.actions;

export default slice.reducer;
