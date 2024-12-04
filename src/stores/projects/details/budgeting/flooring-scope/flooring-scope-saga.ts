import { takeEvery } from "@redux-saga/core/effects";
import { actions } from "../budgeting-slice";
import { fetchFlooringRenoItems, fetchFlooringTakeOffs } from "./flooring-scope-queries-api";
import { deleteGroup, setupGroup, upsertGroup } from "./flooring-scope-mutations-api";

export const flooringScopeSaga = [
    takeEvery(actions.fetchFlooringRenoItemsStart.type, fetchFlooringRenoItems),
    takeEvery(actions.fetchFlooringTakeOffsStart.type, fetchFlooringTakeOffs),
    takeEvery(actions.setupGroupStart.type, setupGroup),
    takeEvery(actions.upsertGroupStart.type, upsertGroup),
    takeEvery(actions.deleteGroupStart.type, deleteGroup),
];
