import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";
import {
    GET_PROPERTIES_WITH_FILTER,
    GET_PROPERTY_DETAILS,
    GET_PROPERTY_FILES,
    GET_UNIT_MIXES,
    GET_FLOORPLAN,
    GET_FORGE_VIEWER_DETAILS,
    GET_PROPERTY_STATS,
    CREATE_PROJECT_FILES_MISSING_INFO,
    PROPERTY_DETAILED_STATS,
    PROPERTY_DETAILED_STATS_WITH_ALL_UNITS,
} from "./queries";
import actions from "../actions";
import { client as graphQLClient } from "../gql-client";
import { find } from "lodash";
import { MARK_FILE_UPLOADED } from "stores/single-project/queries";

export function* fetchPropertiesWithFilter(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query(
            "getPropertiesWithFilter",
            GET_PROPERTIES_WITH_FILTER,
            {
                filters: action.payload.filters,
            },
        );
        yield put(actions.propertiesConsumer.fetchAllPropertiesSuccess(response));
    } catch (error) {
        console.log(error);
    }
}
export function* fetchPropertyDetailedStats(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query(
            "propertyDetailedStats",
            PROPERTY_DETAILED_STATS,
            {
                property_id: action.payload.propertyId,
            },
        );
        if (action.payload.isAllUnits) {
            // @ts-ignore
            const responseWithAllUnits: any = yield graphQLClient.query(
                "propertyDetailedStats",
                PROPERTY_DETAILED_STATS_WITH_ALL_UNITS,
                {
                    propertyId: action.payload.propertyId,
                    isAllFloorplansToAllUnits: action.payload.isAllUnits,
                },
            );
            yield put(
                actions.propertiesConsumer.fetchPropertyDetailedStatsForAllUnitsSuccess(
                    responseWithAllUnits,
                ),
            );
        } else {
            console.log("fetchPropertyDetailedStats", response);
            yield put(actions.propertiesConsumer.fetchPropertyDetailedStatsSuccess(response));
        }
    } catch (error) {
        console.log(error);
    }
}

export function* fetchPropertyStats(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("propertyStats", GET_PROPERTY_STATS, {
            propertyId: action.payload,
        });
        yield put(actions.propertiesConsumer.fetchPropertyStatsSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

//eslint-disable-next-line
export function* fetchPropertyDetails(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getProperty", GET_PROPERTY_DETAILS, {
            propertyId: action.payload,
        });
        yield put(actions.propertiesConsumer.fetchPropertyDetailSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

//eslint-disable-next-line
export function* fetchPropertyFiles(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getProjectFiles", GET_PROPERTY_FILES, {
            ...action.payload,
        });
        yield put(
            actions.propertiesConsumer.fetchPropertyFilesSuccess({
                response,
                fileType: action.payload.fileType,
            }),
        );
    } catch (error) {
        console.log(error);
    }
}

//eslint-disable-next-line
export function* fetchUnitMixes(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getUnitMixes", GET_UNIT_MIXES, {
            property_id: action.payload,
        });
        console.log("response", response);
        yield put(actions.propertiesConsumer.fetchUnitMixesSuccess(response));
    } catch (error) {
        console.log(error);
    }
}

//eslint-disable-next-line
export function* fetchFloorPlan(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const res = yield graphQLClient.query("getProjectFloorPlans", GET_FLOORPLAN, {
            projectId: action.payload,
        });
        yield put(actions.propertiesConsumer.fetchFloorPlanSuccess(res));
    } catch (error) {
        console.log(error);
    }
}
//eslint-disable-next-line
export function* fetchForgeViewerDetails(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const res = yield graphQLClient.query("getForgeViewerDetails", GET_FORGE_VIEWER_DETAILS, {
            property_id: action.payload.propertyId,
        });
        console.log("call resp", res);
        yield put(
            actions.propertiesConsumer.fetchForgeViewerDetailsSuccess({
                data: res,
            }),
        );
    } catch (error) {
        yield put(actions.propertiesConsumer.fetchForgeViewerDetailsFailure({}));
        console.log(error);
    }
}

export function* createMissingInfo(action: PayloadAction<any>) {
    console.log("action.payload>>>>>", action.payload);
    try {
        const response: [
            {
                id: string;
                file_name: string;
                signed_url: string;
            },
        ] = yield graphQLClient.mutate("createProjectFiles", CREATE_PROJECT_FILES_MISSING_INFO, {
            input: action?.payload.input,
        });
        if (response.length > 0) {
            // @ts-ignore
            const responseArr = yield Promise.allSettled(
                response.map(async (e) => {
                    let file = find(action.payload.files, { name: e.file_name });
                    const options = {
                        method: "PUT",
                        body: file,
                        headers: {
                            "Content-Type": file.type,
                        },
                    };
                    const uploadResponse = await fetch(e.signed_url, options);
                    return Object.assign(uploadResponse, {
                        file_name: e.file_name,
                        file: e,
                    });
                }),
            );

            yield Promise.allSettled(
                response.map((e) => {
                    return graphQLClient.mutate("markFileUploaded", MARK_FILE_UPLOADED, {
                        file_id: e.id,
                    });
                }),
            );
            const res = responseArr.map((r: any) => {
                if (r.value?.status !== 200) {
                    return {
                        file_name: r?.value?.file_name,
                        file: r?.value?.file,
                        remote_file_reference: "",
                        loading: false,
                        error: true,
                        data: r?.value?.file_name,
                    };
                } else {
                    return {
                        file_name: r?.value?.file_name,
                        file: r?.value?.file,
                        loading: false,
                        error: "",
                        data: null,
                    };
                }
            });
            if (action?.payload?.isPropertyMissingInfo) {
                yield put(actions.propertiesConsumer.createPropertyMissingInfoSuccess(res));
                yield put(actions.projectFloorplans.createMissingInfoSuccess({}));
            } else {
                yield put(
                    actions.projectFloorplans.createMissingInfoSuccess({
                        res: res,
                        floor_plan_id: action.payload.floor_plan_id,
                        isPropertyMissingInfo: action?.payload?.isPropertyMissingInfo,
                    }),
                );
            }
            yield put(
                actions.projectFloorplans.fetchFloorplanDataStart({
                    id: action.payload.project_id,
                }),
            );
        }
    } catch (error) {
        yield put(actions.projectFloorplans.createMissingInfoFailure({}));

        console.log("error on missinginfo creation", error);
    }
}
