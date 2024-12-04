import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./index-slice";
import {
    fetchPropertyDetails,
    sendWhatsappMessage,
    updateProperty,
    fetchFloorPlans,
    importRentRollFromEntrata,
    fetchEntrataFloorPlans,
    mapEntrataFloorPlan,
    fetchUnits,
    fetchEntrataUnits,
    mapEntrataUnits,
} from "./index-api";

export const propertyDetailsSaga = [
    takeEvery(actions.fetchPropertyDetailsStart.type, fetchPropertyDetails),
    takeEvery(actions.fetchFloorPlansStart.type, fetchFloorPlans),
    takeEvery(actions.fetchEntrataFloorPlansStart.type, fetchEntrataFloorPlans),
    takeEvery(actions.fetchUnitsStart.type, fetchUnits),
    takeEvery(actions.fetchEntrataUnitsStart.type, fetchEntrataUnits),
    takeEvery(actions.updatePropertyStart.type, updateProperty),
    takeEvery(actions.mapEntrataUnitsStart.type, mapEntrataUnits),
    takeEvery(actions.mapEntrataFloorPlanStart.type, mapEntrataFloorPlan),
    takeEvery(actions.importRentRollFromEntrataStart.type, importRentRollFromEntrata),
    takeEvery(actions.sendWhatsappMessage.type, sendWhatsappMessage),
];
