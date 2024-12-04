import { takeEvery } from "@redux-saga/core/effects";
import {
    fetchRenovationUnits,
    updateRenovationUnit,
    unscheduleRenovationUnit,
    releaseRenovationUnit,
    fetchRenovationUnitBudgetStat,
    fetchRenovaionUnit,
    scheduleRenovationUnit,
    updateRenovationUnitDates,
} from "./operation";

import { actions } from "./slice";

export const UnitsSaga = [
    takeEvery(actions.fetchRenovationUnitsStart.type, fetchRenovationUnits),
    takeEvery(actions.fetchRenovationUnitStart.type, fetchRenovaionUnit),
    takeEvery(actions.updateSingleRenovationUnitStart.type, updateRenovationUnit),
    takeEvery(actions.unscheduleRenovationUnitStart.type, unscheduleRenovationUnit),
    takeEvery(actions.releaseRenovationUnitStart.type, releaseRenovationUnit),
    takeEvery(actions.fetchRenovationUnitBudgetStatStart.type, fetchRenovationUnitBudgetStat),
    takeEvery(actions.scheduleRenovationUnitStart.type, scheduleRenovationUnit),
    takeEvery(actions.updateRenovationUnitDatesStart.type, updateRenovationUnitDates),
];
