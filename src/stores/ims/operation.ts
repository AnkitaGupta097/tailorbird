import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";
import {
    EDIT_ORGANIZATION,
    EDIT_USER,
    GET_ALL_ORGANIZATIONS,
    GET_ALL_USERS,
    ADD_USER,
    DELETE_USER,
    ADD_ORGANIZATION,
    DELETE_ORGANIZATION,
    RESEND_INVITE,
    GET_ALL_USERS_BY_ORGANIZATION_ID,
    GET_ORGANIZATION_BY_ID,
    ADD_ORGANIZATION_CONFIGURATION,
    GET_ORGANISATION_CONTAINERS,
    DELETE_ORGANIZATION_CONFIGURATION,
    UPDATE_ORGANIZATION_CONFIGURATION,
} from "./queries";
import actions from "../actions";
import { client as graphQLClient } from "../gql-client";
import { getUserData } from "utils/store-helpers";
import { GET_USER_BY_ID } from "stores/projects/details/rfp-manager/rfp-manager-queries";

//eslint-disable-next-line
export function* fetchAllUsers(action: PayloadAction<any>) {
    const loggedUserRole = localStorage.getItem("role");
    const organization_id = localStorage.getItem("organization_id") ?? "";
    try {
        // @ts-ignore
        const response = yield graphQLClient.mutate("getAllUsers", GET_ALL_USERS, {
            input: loggedUserRole === "contractor_admin" ? { organization_id } : {},
        });
        yield put(
            actions.imsActions.fetchAllUsersSuccess({
                users: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.imsActions.fetchAllUsersSuccess({
                users: [],
            }),
        );
    }
}

export function* fetchUsers(action: PayloadAction<any>) {
    try {
        let response: any = {};

        if (action.payload.role === "contractor_admin") {
            //Get organization details by user id
            const getUserDetails: { organization: { id: string } } = yield graphQLClient.query(
                "getUserById",
                GET_USER_BY_ID,
                {
                    userId: action.payload.user_id,
                },
            );
            // @ts-ignore
            response = yield graphQLClient.query(
                "getUsersByOrgId",
                GET_ALL_USERS_BY_ORGANIZATION_ID,
                {
                    organization_id: getUserDetails.organization.id,
                },
            );
            const excludeInactiveUsers = response?.filter(
                (user: { status: string }) => user.status !== "INACTIVE",
            );
            response = excludeInactiveUsers;
        } else {
            let input = {
                organization_id: action?.payload?.organization_id,
                roles: action?.payload?.roles,
            };
            // @ts-ignore
            response = yield graphQLClient.mutate("getAllUsers", GET_ALL_USERS, {
                input: input,
            });
        }
        yield put(
            actions.imsActions.fetchUsersComplete({
                users: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.imsActions.fetchUsersComplete({
                users: [],
            }),
        );
    }
}

//eslint-disable-next-line
export function* fetchUsersByOrgId(action: PayloadAction<any>) {
    try {
        let organization_id = action?.payload?.organization_id;

        // @ts-ignore
        const response = yield graphQLClient.query(
            "getUsersByOrgId",
            GET_ALL_USERS_BY_ORGANIZATION_ID,
            {
                organization_id: organization_id,
            },
        );
        yield put(
            actions.imsActions.fetchUsersByOrgIdComplete({
                organization_id: organization_id,
                users: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.imsActions.fetchUsersComplete({
                users: [],
            }),
        );
    }
}

//eslint-disable-next-line
export function* fetchContractors(action: PayloadAction<any>) {
    try {
        let input = "Contractor";
        // @ts-ignore
        const response = yield graphQLClient.query("getAllOrganizations", GET_ALL_ORGANIZATIONS, {
            input: input,
        });
        yield put(
            actions.imsActions.fetchContractorComplete({
                contractors: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.imsActions.fetchContractorComplete({
                contractors: [],
            }),
        );
    }
}

//eslint-disable-next-line
export function* fetchOwnership(action: PayloadAction<any>) {
    try {
        let input = "Ownership";
        // @ts-ignore
        const response = yield graphQLClient.mutate("getAllOrganizations", GET_ALL_ORGANIZATIONS, {
            input: input,
        });
        yield put(
            actions.imsActions.fetchOwnershipComplete({
                ownerships: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.imsActions.fetchOwnershipComplete({
                contractors: [],
            }),
        );
    }
}

//eslint-disable-next-line
export function* editOrganization(action: PayloadAction<any>) {
    try {
        let input = {};
        Object.assign(input, action.payload.input);
        // @ts-ignore
        const response = yield graphQLClient.mutate("editOrganisation", EDIT_ORGANIZATION, {
            payload: input,
        });

        yield put(
            actions.imsActions.editOrganizationComplete({
                organization: response,
                id: response.id,
                type: action.payload.type,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.editOrganizationFailed({}));
    }
}

//eslint-disable-next-line
export function* addOrganization(action: PayloadAction<any>) {
    try {
        let input = {};
        Object.assign(input, action.payload.input);
        // @ts-ignore
        const response = yield graphQLClient.mutate("addOrganisation", ADD_ORGANIZATION, {
            payload: { ...input, created_by: getUsername() },
        });
        yield put(
            actions.imsActions.addOrganizationComplete({
                organization: response,
                type: action.payload.type,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.addOrganizationFailed({}));
    }
}

export function* getOrganizationContainers(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query(
            "getOrganisationContainers",
            GET_ORGANISATION_CONTAINERS,
            {
                organisationId: action.payload.id,
            },
        );

        yield put(
            actions.imsActions.getOrganizationContainersComplete({
                configurations: response,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.getOrganizationContainersFailure({}));
    }
}

export function* deleteOrganizationContainer(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        yield graphQLClient.mutate(
            "deleteOrganisationContainer",
            DELETE_ORGANIZATION_CONFIGURATION,
            {
                organisationContainerId: action.payload.id,
            },
        );

        yield put(
            actions.imsActions.deleteOrganizationContainerComplete({ id: action.payload.id }),
        );
    } catch (exception) {
        yield put(actions.imsActions.deleteOrganizationContainerFailure({}));
    }
}

export function* updateOrganizationContainer(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const container_config = yield graphQLClient.mutate(
            "updateOrganisationContainer",
            UPDATE_ORGANIZATION_CONFIGURATION,
            {
                organisationContainerId: action.payload.id,
                organisation_id: action.payload.organisationId,
                is_default: action.payload.is_default,
            },
        );

        yield put(
            actions.imsActions.updateOrganizationContainerComplete({
                id: action.payload.id,
                container_config: container_config,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.updateOrganizationContainerFailure({}));
    }
}

export function* addOrganizationContainer(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.mutate(
            "createOrganisationContainer",
            ADD_ORGANIZATION_CONFIGURATION,
            {
                input: action.payload.input,
            },
        );

        yield put(
            actions.imsActions.addOrganizationContainerComplete({
                configuration: response,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.addOrganizationContainerFailure({}));
    }
}

export function* getOrganization(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getOrganization", GET_ORGANIZATION_BY_ID, {
            organizationId: action.payload.input.id,
        });

        yield put(
            actions.imsActions.getOrganisationnByIdComplete({
                organization: response,
                type: action.payload.type,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.getOrganisationnByIdFailed({}));
    }
}

export function* editUser(action: PayloadAction<any>) {
    try {
        let input = {};
        Object.assign(input, action.payload.input);
        // @ts-ignore
        const response = yield graphQLClient.mutate("editUser", EDIT_USER, {
            payload: input,
        });
        yield put(
            actions.imsActions.editUserComplete({
                updated: response,
                id: response.id,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.editUserFailed({}));
    }
}

export function* addUser(action: PayloadAction<any>) {
    try {
        let input = {};
        Object.assign(input, action.payload.input);
        // @ts-ignore
        const response = yield graphQLClient.mutate("createUser", ADD_USER, {
            payload: input,
        });

        yield put(
            actions.imsActions.addUserComplete({
                user: response,
            }),
        );
    } catch (exception) {
        yield put(actions.imsActions.addUserFailed({}));
    }
}

export function* deleteUser(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.mutate("deleteUser", DELETE_USER, {
            deleteUserId: action.payload.id,
        });
        if (response)
            yield put(
                actions.imsActions.deleteUserComplete({
                    id: action.payload.id,
                }),
            );
        else {
            throw new Error(`Couldn't Delete user`);
        }
    } catch (exception) {
        yield put(actions.imsActions.deleteUserFailed({}));
    }
}

export function* deleteOrganization(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.mutate("deleteOrganization", DELETE_ORGANIZATION, {
            deleteOrganizationId: action.payload.id,
        });
        if (response)
            yield put(
                actions.imsActions.deleteOrganizationComplete({
                    id: action.payload.id,
                    type: action.payload.type,
                }),
            );
        else {
            throw new Error(`Couldn't Delete user`);
        }
    } catch (exception) {
        yield put(actions.imsActions.deleteOrganizationFailed({}));
    }
}

export function* resendInvite(action: PayloadAction<any>) {
    try {
        let input = {
            email: action.payload.email,
        };
        // @ts-ignore
        const response = yield graphQLClient.mutate("resendInvite", RESEND_INVITE, {
            payload: input,
        });
        yield put(
            actions.imsActions.sendInviteComplete({
                response: response,
            }),
        );
    } catch (exception) {
        yield put(
            actions.imsActions.sendInviteComplete({
                response: null,
            }),
        );
    }
}

function getUsername() {
    let userData = getUserData();
    let email = localStorage.getItem("email");
    let gname;

    if (userData && userData.name) {
        gname = "";
    } else if (email) {
        gname = email.split(`@`)[0];
    }
    return gname;
}
