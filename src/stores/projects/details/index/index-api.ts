import { put } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    GET_PROJECT_DETAILS,
    UPDATE_PROJECT,
    GET_RENT_ROLL,
    UPDATE_PROJECT_STATUS,
} from "./index-queries";
import actions from "../../../actions";
import { graphQLClient } from "../../../../utils/gql-client";

export function* fetchProjectDetails(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("getProjectById", GET_PROJECT_DETAILS, {
            projectId: action.payload,
        });
        yield put(actions.projectDetails.fetchProjectDetailsSuccess(response));
    } catch (error) {
        yield put(actions.projectDetails.fetchProjectDetailsFailure(error));
    }
}

export function* updateProject(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("updateProject", UPDATE_PROJECT, {
            ...action.payload,
        });
        yield put(actions.projectDetails.updateProjectSuccess(response));
        yield put(
            actions.common.openSnack({
                message: "Updated Project",
                variant: "success",
                open: true,
            }),
        );
    } catch (error) {
        yield put(
            actions.common.openSnack({
                message: "Failed to update project",
                variant: "error",
                open: true,
            }),
        );
        console.log(error);
    }
}

export function* updateProjectStatus(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("updateProjectStatus", UPDATE_PROJECT_STATUS, {
            input: action.payload,
        });
        yield put(actions.projectDetails.updateProjectStatusSuccess(action.payload.status));
    } catch (error) {
        console.log(error);
    }
}

export function* fetchRentRoll(action: PayloadAction<any>) {
    try {
        console.log("in fetchRentRoll", action.payload);
        const response: any[] = yield graphQLClient.mutate("getRentRoll", GET_RENT_ROLL, {
            projectId: action.payload.projectId,
        });
        yield put(actions.projectDetails.fetchRentRollSuccess(response));
    } catch (error) {
        yield put(actions.projectDetails.fetchRentRollFailure(error));
        console.log(error);
    }
}
