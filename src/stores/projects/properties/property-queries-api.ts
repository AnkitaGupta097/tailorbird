import { put } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    GET_ALL_PROPERTIES,
    // GET_ALL_ORGANIZATIONS,
    // GET_USERS_BY_ORG_ID,
    GET_ARCHIVE_PROPERTIES,
    // GET_ALL_USER,
    CREATE_PROPERTY,
    // CREATE_PROJECT_MERGE_FROM_OWNERSHIP,
} from "./property-queries";
import actions from "../../actions";
import { graphQLClient } from "../../../utils/gql-client";

// eslint-disable-next-line
export function* fetchAllProperties(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("GetProperties", GET_ALL_PROPERTIES);
        console.log(response, "'response!!!'");
        yield put(actions.property.fetchAllPropertySuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line
export function* fetchArchiveProperties(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getArchivedProjects",
            GET_ARCHIVE_PROPERTIES,
        );
        yield put(actions.property.fetchArchivePropertySuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line
// export function* fetchAllUsers(action: PayloadAction<any>) {
//     try {
//         const response: any[] = yield graphQLClient.query("getAllUsers", GET_ALL_USER);
//         yield put(actions.tpsm.fetchAllUserSuccess(response));
//     } catch (error) {
//         console.log(error);
//     }
// }

// eslint-disable-next-line
// export function* fetchOrganization(action: PayloadAction<any>) {
//     try {
//         const response: any[] = yield graphQLClient.query(
//             "GetAllOrganizations",
//             GET_ALL_ORGANIZATIONS,
//         );
//         yield put(actions.tpsm.fetchOrganizationSuccess(response));
//     } catch (error) {
//         console.log(error);
//     }
// }

// export function* fetchOrganizationUsers(action: PayloadAction<any>) {
//     try {
//         const response: any[] = yield graphQLClient.query("GetUsersByOrgId", GET_USERS_BY_ORG_ID, {
//             orgId: action.payload,
//         });
//         yield put(actions.tpsm.fetchOrganizationUsersSuccess(response));
//     } catch (error) {
//         console.log(error);
//     }
// }

export function* createProperty(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("createProperty", CREATE_PROPERTY, {
            ...action.payload,
        });
        if (action.payload?.ownership_group_id) {
            yield put(actions.property.createProjectMergeFromOwnership(response));
        }
        yield put(actions.property.createPropertySuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// export function* createProjectMergeFromOwnership(action: PayloadAction<any>) {
//     try {
//         // eslint-disable-next-line no-unused-vars
//         const response: any[] = yield graphQLClient.mutate(
//             "createProjectFromOrganizationMerge",
//             CREATE_PROJECT_MERGE_FROM_OWNERSHIP,
//             {
//                 payload: {
//                     organization_id: action.payload.ownershipGroupId,
//                     project_id: action.payload.id,
//                 },
//             },
//         );
//     } catch (error) {
//         console.log(error);
//     }
// }
