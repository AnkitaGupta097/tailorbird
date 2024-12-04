import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./tpsm-slice";
import {
    fetchAllProjects,
    fetchOrganization,
    fetchOrganizationUsers,
    createProject,
    fetchAllUsers,
    fetchArchiveProjects,
    addPropertyOrProjectRequest,
} from "./tpsm-queries-api";

export const tpsmSaga = [
    takeEvery(actions.fetchAllProjectStart.type, fetchAllProjects),
    takeEvery(actions.fetchOrganizationStart.type, fetchOrganization),
    takeEvery(actions.fetchOrganizationUsersStart.type, fetchOrganizationUsers),
    takeEvery(actions.fetchAllUserStart.type, fetchAllUsers),
    takeEvery(actions.createProjectStart.type, createProject),
    takeEvery(actions.fetchArchiveProjectStart.type, fetchArchiveProjects),
    takeEvery(actions.addPropertyOrProjectRequest.type, addPropertyOrProjectRequest),
];
