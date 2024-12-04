import { put } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    UPDATE_PROPERTY,
    GET_PROPERTY_DETAILS,
    SEND_WHATSAPP_MESSAGE,
    IMPORT_RENT_ROLL_FROM_ENTRATA,
    GET_FLOORPLANS,
    GET_ENTRATA_FLOORPLANS,
    MAP_FLOORPLAN_WITH_ENTRATA,
    GET_UNITS,
    GET_ENTRATA_UNITS,
    MAP_UNIT_WITH_ENTRATA,
} from "./index-queries";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";

export function* fetchPropertyDetails(action: PayloadAction<any>) {
    try {
        console.log("here?!!?", action.payload);
        const response: any[] = yield graphQLClient.query("GetProperty", GET_PROPERTY_DETAILS, {
            propertyId: action.payload,
        });
        yield put(actions.propertyDetails.fetchPropertyDetailsSuccess(response));
    } catch (error) {
        yield put(actions.propertyDetails.fetchPropertyDetailsFailure(error));
    }
}

export function* fetchUnits(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("getPropertyUnits", GET_UNITS, {
            projectId: action.payload.projectId,
        });
        yield put(actions.propertyDetails.fetchUnitsSuccess(response));
    } catch (error) {
        actions.common.openSnack({
            message: "Failed to load tailorbird units",
            variant: "error",
            open: true,
        });
        console.log(error);
    }
}

export function* fetchEntrataUnits(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getEntrataPropertyUnits",
            GET_ENTRATA_UNITS,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(actions.propertyDetails.fetchEntrataUnitsSuccess(response));
    } catch (error) {
        actions.common.openSnack({
            message: "Failed to load entrata units",
            variant: "error",
            open: true,
        });
        yield put(actions.propertyDetails.fetchEntrataUnitsFailure({}));
        console.log(error);
    }
}

export function* fetchFloorPlans(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("getProjectFloorPlans", GET_FLOORPLANS, {
            projectId: action.payload.projectId,
        });
        yield put(actions.propertyDetails.fetchFloorPlansSuccess(response));
    } catch (error) {
        actions.common.openSnack({
            message: "Failed to load tailorbird floorplans",
            variant: "error",
            open: true,
        });
        console.log(error);
    }
}

export function* fetchEntrataFloorPlans(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query(
            "getEntrataFloorplans",
            GET_ENTRATA_FLOORPLANS,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(actions.propertyDetails.fetchEntrataFloorPlansSuccess(response));
    } catch (error) {
        actions.common.openSnack({
            message: "Failed to load entrata floorplans",
            variant: "error",
            open: true,
        });
        yield put(actions.propertyDetails.fetchEntrataFloorPlansFailure({}));
        console.log(error);
    }
}

export function* updateProperty(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("updateProperty", UPDATE_PROPERTY, {
            ...action.payload.input,
            propertyId: action.payload.property_id,
        });
        yield put(actions.propertyDetails.updatePropertySuccess(response));
    } catch (error) {
        console.log(error);
    }
}

export function* importRentRollFromEntrata(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("importRentRollFromEntrata", IMPORT_RENT_ROLL_FROM_ENTRATA, {
            projectId: action.payload.projectId,
        });
        yield put(actions.propertyDetails.importRentRollFromEntrataSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Imported Successfully",
                variant: "success",
                open: true,
            }),
        );
        yield put(
            actions.propertyDetails.fetchFloorPlansStart({ projectId: action.payload.projectId }),
        );
    } catch (error) {
        yield put(
            actions.common.openSnack({
                message: "Failed to import",
                variant: "error",
                open: true,
            }),
        );
        yield put(actions.propertyDetails.importRentRollFromEntrataFailure({}));
        console.log(error);
    }
}

export function* mapEntrataUnits(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("mapEntrataUnits", MAP_UNIT_WITH_ENTRATA, {
            input: {
                id_map: action.payload.mapping,
                project_id: action.payload.projectId,
            },
        });
        yield put(actions.propertyDetails.mapEntrataUnitsSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Mapped Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (error) {
        yield put(
            actions.common.openSnack({
                message: "Failed to map",
                variant: "error",
                open: true,
            }),
        );
        yield put(actions.propertyDetails.mapEntrataUnitsFailure({}));
        console.log(error);
    }
}

export function* mapEntrataFloorPlan(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("mapEntrataFloorPlans", MAP_FLOORPLAN_WITH_ENTRATA, {
            input: {
                id_map: action.payload.mapping,
                project_id: action.payload.projectId,
            },
        });
        yield put(actions.propertyDetails.mapEntrataFloorPlanSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Mapped Successfully",
                variant: "success",
                open: true,
            }),
        );
    } catch (error) {
        yield put(
            actions.common.openSnack({
                message: "Failed to map",
                variant: "error",
                open: true,
            }),
        );
        yield put(actions.propertyDetails.mapEntrataFloorPlanFailure({}));
        console.log(error);
    }
}

export function* sendWhatsappMessage(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("sendWhatsappMessage", SEND_WHATSAPP_MESSAGE, {
            input: action.payload.input,
        });
        yield put(
            actions.common.openSnack({
                variant: "success",
                message: "Whatsapp integration successful",
                open: true,
            }),
        );
    } catch (error) {
        console.log(error);
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Whatsapp integration failed, Try again!",
                open: true,
            }),
        );
    }
}
