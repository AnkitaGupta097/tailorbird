import { put } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    GET_ALL_PROJECTS,
    GET_ALL_ORGANIZATIONS,
    GET_USERS_BY_ORG_ID,
    GET_ARCHIVE_PROJECTS,
    GET_ALL_USER,
    CREATE_PROJECT,
    ADD_PROPERTY_OR_PROJECT_REQUEST,
} from "./tpsm-queries";
import actions from "../../actions";
import { graphQLClient } from "../../../utils/gql-client";
import TrackerUtil from "utils/tracker";

// eslint-disable-next-line
export function* fetchAllProjects(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("getProjectsV2", GET_ALL_PROJECTS, {
            version: "1.0",
        });
        yield put(actions.tpsm.fetchAllProjectSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line
export function* fetchArchiveProjects(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getArchivedProjects",
            GET_ARCHIVE_PROJECTS,
            { version: "1.0" },
        );
        yield put(actions.tpsm.fetchArchiveProjectSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line
export function* fetchAllUsers(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("getAllUsers", GET_ALL_USER);
        yield put(actions.tpsm.fetchAllUserSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line
export function* fetchOrganization(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "GetAllOrganizations",
            GET_ALL_ORGANIZATIONS,
            {
                organizationType: action.payload.organizationType,
            },
        );
        yield put(actions.tpsm.fetchOrganizationSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchOrganizationUsers(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("GetUsersByOrgId", GET_USERS_BY_ORG_ID, {
            orgId: action.payload,
        });
        yield put(actions.tpsm.fetchOrganizationUsersSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* createProject(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("createProject", CREATE_PROJECT, {
            input: action.payload,
        });
        yield put(actions.tpsm.createProjectSuccess(response));
        // //MIXPANEL : Event tracking for project creation
        TrackerUtil.event("PROJECT : Project Created", {
            eventId: "project_project_created",
            projectId: JSON.parse(JSON.stringify(response))?.id,
            projectName: JSON.parse(JSON.stringify(response))?.name,
            bidStatus: "Pending",
            isProjectPublished: false,
        });
    } catch (error) {
        console.log(error);
    }
}

export function* addPropertyOrProjectRequest(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("addPropertyOrProjectRequest", ADD_PROPERTY_OR_PROJECT_REQUEST, {
            input: action.payload,
        });
    } catch (error) {
        console.log(error);
    }
}
