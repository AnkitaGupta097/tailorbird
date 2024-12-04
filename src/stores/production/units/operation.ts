/* eslint-disable no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import {
    GET_RENOVATION_UNITS,
    UPDATE_RENOVATION_UNIT,
    UNSCHEDULE_RENO_UNIT,
    RELEASE_RENOVATION_UNIT,
    GET_RENOVATION_UNIT_BUDGET_STAT,
    GET_RENOVATION_UNIT,
    SCHEDULE_UNIT,
    UPDATE_RENOVATION_UNIT_DATES,
} from "./queries";
import actions from "../../actions";
import { client as graphQLClient } from "../../gql-client";
import TrackerUtil from "utils/tracker";

//eslint-disable-next-line
export function* fetchRenovationUnits(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getRenovationUnits } = yield graphQLClient.query(
            "getRenovationUnits",
            GET_RENOVATION_UNITS,
            {
                projectId: action.payload.project_id,
            },
        );
        yield put(
            actions.production.unit.fetchRenovationUnitsSuccess({
                renoUnits: response || [],
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.unit.fetchRenovationUnitsFailure({
                renoUnits: [],
            }),
        );
    }
}

export function* fetchRenovaionUnit(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: any = yield graphQLClient.query(
            "getRenovationUnits",
            GET_RENOVATION_UNITS,
            {
                renoUnitId: action.payload.renoUnitId,
            },
        );
        yield put(
            actions.production.unit.fetchRenovationUnitSuccess({
                renoUnit: response?.[0],
            }),
        );
    } catch (exception) {
        yield put(actions.production.unit.fetchRenovationUnitFailure({}));
    }
}

export function* fetchRenovationUnitBudgetStat(action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;
    try {
        // @ts-ignore
        const response: { getRenovationUnitBudgetStat } = yield graphQLClient.query(
            "getRenovationUnitBudgetStat",
            GET_RENOVATION_UNIT_BUDGET_STAT,
            {
                renoUnitId,
            },
        );
        yield put(
            actions.production.unit.fetchRenovationUnitBudgetStatSuccess({
                renoUnitBudgetStat: response,
                renoUnitId,
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.unit.fetchRenovationUnitBudgetStatFailure({
                renoUnitId,
            }),
        );
    }
}

export function* updateRenovationUnit(action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;
    const editedData = action.payload.editedData;
    const type = action.payload.type;
    try {
        //@ts-ignore
        const response = yield graphQLClient.mutate(
            "updateRenovationUnit",
            UPDATE_RENOVATION_UNIT,
            {
                renoUnitId: renoUnitId,
                ...editedData,
                remark: "",
                attachments: [],
            },
        );
        yield put(
            actions.production.unit.updateSingleRenovationUnitSuccess({
                updatedRenoUnit: response,
                renoUnitId,
            }),
        );

        yield put(
            actions.common.openSnack({
                message: "Updated Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(
            actions.production.unit.updateSingleRenovationUnitFailure({
                renoUnits: {},
            }),
        );
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                projectName: action.payload.projectName,
            },
            type === "scheduleUnit" ? "SCHEDULE_UNIT_FAILED" : "UPDATE_UNIT_FAILED",
        );
        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* unscheduleRenovationUnit(action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;
    try {
        //@ts-ignore
        const response = yield graphQLClient.mutate(
            "unscheduleRenovationUnit",
            UNSCHEDULE_RENO_UNIT,
            {
                renoUnitId,
            },
        );
        yield put(
            actions.production.unit.updateSingleRenovationUnitSuccess({
                updatedRenoUnit: response,
                renoUnitId,
            }),
        );

        yield put(
            actions.common.openSnack({
                message: "Unscheduled Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(
            actions.production.unit.updateSingleRenovationUnitFailure({
                renoUnits: {},
            }),
        );
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                projectName: action.payload.projectName,
            },
            "UNSCHEDULE_UNIT_FAILED",
        );
        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* releaseRenovationUnit(action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;
    try {
        //@ts-ignore
        const response = yield graphQLClient.mutate(
            "releaseRenovationUnit",
            RELEASE_RENOVATION_UNIT,
            {
                renoUnitId,
            },
        );
        yield put(
            actions.production.unit.updateSingleRenovationUnitSuccess({
                updatedRenoUnit: response,
                renoUnitId,
            }),
        );
        yield put(
            actions.common.openSnack({
                message: "Released Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(
            actions.production.unit.updateSingleRenovationUnitFailure({
                renoUnits: {},
            }),
        );
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                projectName: action.payload.projectName,
            },
            "RELEASE_UNIT_FAILED",
        );
        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* scheduleRenovationUnit(action: PayloadAction<any>) {
    const {
        payload: { renoUnitId, scheduled_date },
    } = action;
    try {
        //@ts-ignore
        yield graphQLClient.mutate("releaseRenovationUnit", SCHEDULE_UNIT, {
            releaseDate: scheduled_date,
            scheduleRenoUnitId: [renoUnitId],
        });
        yield put(
            actions.production.unit.updateSingleRenovationUnitSuccess({
                updatedRenoUnit: { status: "scheduled", release_date: scheduled_date },
                renoUnitId,
            }),
        );
        yield put(
            actions.common.openSnack({
                message: "Scheduled Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(
            actions.production.unit.updateSingleRenovationUnitFailure({
                renoUnits: {},
            }),
        );
        const descMsg = exception.graphQLErrors[0].message;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                projectName: action.payload.projectName,
            },
            "SCHEDULE_UNIT_FAILED",
        );
        yield put(
            actions.common.openSnack({
                message: descMsg,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* updateRenovationUnitDates(action: PayloadAction<any>) {
    const {
        payload: {
            renoUnitId,
            renovation_start_date,
            renovation_end_date,
            move_in_date,
            move_out_date,
            make_ready_date,
        },
    } = action;
    try {
        const updatedData = {} as any;
        if (renovation_start_date) {
            updatedData["renovationStartDate"] = renovation_start_date;
        }
        if (renovation_end_date) {
            updatedData["renovationEndDate"] = renovation_end_date;
        }
        if (move_in_date) {
            updatedData["moveInDate"] = move_in_date;
        }
        if (move_out_date) {
            updatedData["moveOutDate"] = move_out_date;
        }
        if (make_ready_date) {
            updatedData["makeReadyDate"] = make_ready_date;
        }
        const payload = {
            updateRenovationUnitDatesId: renoUnitId,
            ...updatedData,
        };
        //@ts-ignore
        yield graphQLClient.mutate(
            "updateRenovationUnitDates",
            UPDATE_RENOVATION_UNIT_DATES,
            payload,
        );
        yield put(actions.production.unit.updateSingleRenovationUnitSuccess(payload));
        yield put(
            actions.common.openSnack({
                message: "Update Unit Dates Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(
            actions.production.unit.updateSingleRenovationUnitFailure({
                renoUnits: {},
            }),
        );
        const descMsg = exception.graphQLErrors[0].message;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                projectName: action.payload.projectName,
            },
            "UPDATE_RENOVATION_UNIT_DATES_FAILED",
        );
        yield put(
            actions.common.openSnack({
                message: descMsg,
                variant: "error",
                open: true,
            }),
        );
    }
}
