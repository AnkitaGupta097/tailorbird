import { updateObject } from "../../utils/store-helpers";
import initialState from "./ims-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { IIMS } from "./interfaces";
const initState: any = cloneDeep(initialState);

function fetchUsersStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchUsersComplete(state: IIMS, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        users: action.payload.users,
    });
}

function fetchUsersByOrgIdStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchUsersByOrgIdComplete(state: IIMS, action: PayloadAction<any>) {
    const usersByOrg = cloneDeep(state.usersByOrg);
    usersByOrg[action.payload.organization_id] = action.payload.users;
    return updateObject(state, {
        loading: false,
        usersByOrg: usersByOrg,
    });
}

function fetchOwnershipStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}
function fetchOwnershipComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        ownerships: action.payload.ownerships,
    });
}

function fetchContractorStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}
function fetchContractorComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        contractors: action.payload.contractors,
    });
}

function addUserStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function addUserComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    let users = [...state.users];
    users.push(action.payload.user);
    return updateObject(state, {
        loading: false,
        saved: true,
        users: users,
    });
}
function addUserFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

function addOrganizationStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function editUserStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function editUserComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    const userIndex = state.users.findIndex((user) => user.id === action.payload.id);
    let users = [...state.users];
    users[userIndex] = action.payload.updated;
    return updateObject(state, {
        loading: false,
        users: users,
        saved: true,
    });
}
function editUserFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}
function addOrganizationFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

function getOrganizationContainersStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        ...state,
        configurations: [],
        confugration_fetched: false,
    });
}

function getOrganizationContainersComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        ...state,
        configurations: action.payload.configurations,
        confugration_fetched: true,
    });
}

function getOrganizationContainersFailure(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    console.log(action.payload.configurations);
    return updateObject(state, {
        ...state,
        configurations: [],
        confugration_fetched: true,
    });
}

function updateOrganizationContainerStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return state;
}

function updateOrganizationContainerComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    const configurations = state.configurations.filter((elm: any) => elm.id !== action.payload.id);
    configurations.push(action.payload.container_config);
    return updateObject(state, {
        configurations: configurations,
    });
}

function updateOrganizationContainerFailure(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        configurations: [...state.configurations],
    });
}

function deleteOrganizationContainerStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        configurations: [...state.configurations],
    });
}

function deleteOrganizationContainerComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    const configurations = state.configurations.filter((elm: any) => elm.id !== action.payload.id);

    return updateObject(state, {
        configurations: configurations,
    });
}

function deleteOrganizationContainerFailure(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        configurations: [...state.configurations],
    });
}

function addOrganizationContainerStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        configuration: {
            ...state.configuration,
            loading: true,
        },
    });
}

function addOrganizationContainerComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        configuration: {
            ...state.configuration,
            loading: false,
            error: false,
        },
        configurations: [...state.configurations, action.payload.configuration],
    });
}

function addOrganizationContainerFailure(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        configuration: {
            ...state.configuration,
            loading: false,
            error: true,
        },
    });
}

function getOrganisationnByIdStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function getOrganisationnByIdComplete(state: IIMS, action: PayloadAction<any>) {
    const ownershipIndex = state.ownerships.findIndex(
        (ownership) => ownership.id === action.payload.organization.id,
    );
    let ownerships = [...state.ownerships];
    ownerships[ownershipIndex] = action.payload.organization;
    return updateObject(state, {
        loading: false,
        ownership: action.payload.organization,
        ownerships: ownerships,
        saved: true,
    });
}

function getOrganisationnByIdFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

function editOrganizationNavigate(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    const ownershipIndex = state.ownerships.findIndex(
        (ownership) => ownership.id === action.payload.input.id,
    );
    // console.log('ecit ownership', ownershipIndex, state.ownerships[ownershipIndex], action.payload.input.id)
    // console.log(state.ownerships[ownershipIndex], 'edit ownership', state.ownerships, action.payload.input.id);
    return updateObject(state, {
        ownership: state.ownerships[ownershipIndex],
    });
}
function editOrganizationStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}
function editOrganizationComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    if (action.payload.type === "Ownership") {
        const ownershipIndex = state.ownerships.findIndex(
            (ownership) => ownership.id === action.payload.id,
        );
        let ownerships = [...state.ownerships];
        ownerships[ownershipIndex] = action.payload.organization;
        return updateObject(state, {
            loading: false,
            ownerships: ownerships,
            ownership: action.payload.organization,
            saved: true,
        });
    } else {
        const contractorIndex = state.contractors.findIndex(
            (contractor) => contractor.id === action.payload.id,
        );
        let contractors = [...state.contractors];
        contractors[contractorIndex] = action.payload.organization;
        return updateObject(state, {
            loading: false,
            contractors: contractors,
            saved: true,
        });
    }
}

function addOrganizationComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    if (action.payload.type === "Ownership") {
        let ownerships = [...state.ownerships, action.payload.organization];
        return updateObject(state, {
            loading: false,
            ownerships: ownerships,
            saved: true,
        });
    } else {
        let contractors = [...state.contractors, action.payload.organization];
        return updateObject(state, {
            loading: false,
            contractors: contractors,
            saved: true,
        });
    }
}
function deleteUserStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}
function deleteUserComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    const users = state.users.filter((user) => user.id !== action.payload.id);
    return updateObject(state, {
        loading: false,
        saved: true,
        users: users,
    });
}

function deleteUserFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

function deleteOrganizationStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function deleteOrganizationComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    if (action.payload.type === "Ownership") {
        const ownerships = state.ownerships.filter(
            (ownership) => ownership.id !== action.payload.id,
        );
        return updateObject(state, {
            loading: false,
            ownerships: ownerships,
            saved: true,
        });
    } else {
        const contractors = state.contractors.filter(
            (contractor) => contractor.id !== action.payload.id,
        );
        return updateObject(state, {
            loading: false,
            contractors: contractors,
            saved: true,
        });
    }
}

function editOrganizationFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}
function deleteOrganizationFailed(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

function resetState(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        saved: false,
        error: false,
    });
}
function sendInviteStart(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: true,
    });
}

function sendInviteComplete(
    state: IIMS,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    if (action.payload.response)
        return updateObject(state, {
            loading: false,
            saved: true,
        });
    else
        return updateObject(state, {
            loading: false,
            error: true,
        });
}

// eslint-disable-next-line no-unused-vars
function fetchAllUsersStart(state: IIMS, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchAllUsersSuccess(state: IIMS, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        users: action.payload.users,
    });
}

const slice = createSlice({
    name: "IMS",
    initialState: initState,
    reducers: {
        getOrganisationnByIdComplete,
        getOrganisationnByIdFailed,
        getOrganisationnByIdStart,
        addOrganizationContainerComplete,
        addOrganizationContainerFailure,
        addOrganizationContainerStart,
        getOrganizationContainersComplete,
        getOrganizationContainersFailure,
        getOrganizationContainersStart,
        deleteOrganizationContainerComplete,
        deleteOrganizationContainerFailure,
        deleteOrganizationContainerStart,
        fetchContractorStart,
        fetchContractorComplete,
        fetchUsersByOrgIdStart,
        fetchUsersByOrgIdComplete,
        fetchOwnershipStart,
        fetchOwnershipComplete,
        fetchUsersStart,
        fetchUsersComplete,
        addUserStart,
        addUserComplete,
        addUserFailed,
        deleteUserStart,
        deleteUserComplete,
        deleteUserFailed,
        editUserStart,
        editUserComplete,
        editUserFailed,
        resetState,
        addOrganizationStart,
        addOrganizationComplete,
        addOrganizationFailed,
        editOrganizationComplete,
        editOrganizationNavigate,
        editOrganizationStart,
        deleteOrganizationComplete,
        deleteOrganizationStart,
        deleteOrganizationFailed,
        editOrganizationFailed,
        sendInviteComplete,
        sendInviteStart,
        fetchAllUsersStart,
        fetchAllUsersSuccess,
        updateOrganizationContainerStart,
        updateOrganizationContainerComplete,
        updateOrganizationContainerFailure,
    },
});

export const actions = slice.actions;

export default slice.reducer;
