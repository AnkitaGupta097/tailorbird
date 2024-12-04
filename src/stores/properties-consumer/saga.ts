import { takeEvery } from "@redux-saga/core/effects";
import {
    fetchPropertiesWithFilter,
    fetchPropertyDetails,
    fetchPropertyDetailedStats,
    fetchPropertyFiles,
    fetchUnitMixes,
    fetchFloorPlan,
    fetchForgeViewerDetails,
    fetchPropertyStats,
} from "./operation";

import { actions } from "./slice";

export const saga = [
    takeEvery(actions.fetchAllPropertiesStart.type, fetchPropertiesWithFilter),
    takeEvery(actions.fetchPropertyDetailStart.type, fetchPropertyDetails),
    takeEvery(actions.fetchPropertyDetailedStatsStart.type, fetchPropertyDetailedStats),
    takeEvery(actions.fetchPropertyFilesStart.type, fetchPropertyFiles),
    takeEvery(actions.fetchUnitMixesStart.type, fetchUnitMixes),
    takeEvery(actions.fetchFloorPlanStart.type, fetchFloorPlan),
    takeEvery(actions.fetchForgeViewerDetailsStart.type, fetchForgeViewerDetails),
    takeEvery(actions.fetchPropertyStatsStart.type, fetchPropertyStats),
];
