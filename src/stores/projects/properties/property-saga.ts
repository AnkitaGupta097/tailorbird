import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./property-slice";
import {
    fetchAllProperties,
    // fetchOrganization,
    // fetchOrganizationUsers,
    createProperty,
    // fetchAllUsers,
    fetchArchiveProperties,
    // createProjectMergeFromOwnership,
} from "./property-queries-api";

export const propertySaga = [
    takeEvery(actions.fetchAllPropertyStart.type, fetchAllProperties),
    // takeEvery(actions.fetchOrganizationStart.type, fetchOrganization),
    // takeEvery(actions.fetchOrganizationUsersStart.type, fetchOrganizationUsers),
    // takeEvery(actions.fetchAllUserStart.type, fetchAllUsers),
    takeEvery(actions.createPropertyStart.type, createProperty),
    takeEvery(actions.fetchArchivePropertyStart.type, fetchArchiveProperties),
    // takeEvery(actions.createProjectMergeFromOwnership.type, createProjectMergeFromOwnership),
];
