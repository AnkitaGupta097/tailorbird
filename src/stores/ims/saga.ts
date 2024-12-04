import { takeEvery } from "@redux-saga/core/effects";
import {
    fetchUsers,
    fetchContractors,
    fetchOwnership,
    addUser,
    editUser,
    deleteUser,
    editOrganization,
    deleteOrganization,
    addOrganization,
    resendInvite,
    fetchAllUsers,
    fetchUsersByOrgId,
    getOrganization,
    addOrganizationContainer,
    getOrganizationContainers,
    deleteOrganizationContainer,
    updateOrganizationContainer,
} from "./operation";

import { actions } from "./slice";

export const saga = [
    takeEvery(actions.getOrganizationContainersStart.type, getOrganizationContainers),
    takeEvery(actions.addOrganizationContainerStart.type, addOrganizationContainer),
    takeEvery(actions.getOrganisationnByIdStart.type, getOrganization),
    takeEvery(actions.deleteOrganizationContainerStart.type, deleteOrganizationContainer),
    takeEvery(actions.fetchUsersStart.type, fetchUsers),
    takeEvery(actions.fetchContractorStart.type, fetchContractors),
    takeEvery(actions.fetchOwnershipStart.type, fetchOwnership),
    takeEvery(actions.addUserStart.type, addUser),
    takeEvery(actions.editUserStart.type, editUser),
    takeEvery(actions.deleteUserStart.type, deleteUser),
    takeEvery(actions.editOrganizationStart.type, editOrganization),
    takeEvery(actions.deleteOrganizationStart.type, deleteOrganization),
    takeEvery(actions.addOrganizationStart.type, addOrganization),
    takeEvery(actions.sendInviteStart.type, resendInvite),
    takeEvery(actions.fetchUsersByOrgIdStart.type, fetchUsersByOrgId),
    takeEvery(actions.fetchAllUsersStart.type, fetchAllUsers),
    takeEvery(actions.updateOrganizationContainerStart.type, updateOrganizationContainer),
];
