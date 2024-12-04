/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { updateObject } from "../../utils/store-helpers";
import initialState from "./properties-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { filter, groupBy, mapValues, map, size, cloneDeep } from "lodash";
import { IPropertiesConsumer } from "./interfaces";

const initState: any = cloneDeep(initialState);

// eslint-disable-next-line
function fetchAllPropertiesStart(state: IPropertiesConsumer, _action: PayloadAction<any>) {
    state.loading = true;
}

// eslint-disable-next-line
function fetchPropertyDetailedStatsStart(state: IPropertiesConsumer, _action: PayloadAction<any>) {
    return state;
}
function fetchPropertyDetailedStatsSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    const propertyDetailStat = new Map(
        action.payload.map(
            (propertyDetailStat: { floorplan_id: String; detailed_stats: any[]; units: any }) => [
                propertyDetailStat.floorplan_id,
                {
                    units: propertyDetailStat.units,
                    detailed_stats: propertyDetailStat.detailed_stats,
                },
            ],
        ),
    );
    return updateObject(state, {
        propertyDetailStats: updateObject(state.propertyDetailStats, {
            propertyDetailStat,
            loading: false,
        }),
    });
}
function fetchPropertyDetailedStatsForAllUnitsSuccess(
    state: IPropertiesConsumer,
    action: PayloadAction<any>,
) {
    console.log("action.payload", action.payload);

    return updateObject(state, {
        propertyDetailStatsForAllUnits: updateObject(state.propertyDetailStatsForAllUnits, {
            data: action.payload,
            loading: false,
        }),
    });
}

// eslint-disable-next-line
function fetchPropertyDetailStart(state: IPropertiesConsumer, _action: PayloadAction<any>) {
    return updateObject(state, {
        propertyDetails: updateObject(state.propertyDetails, { loading: true }),
    });
}

function fetchAllPropertiesSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    Object.entries(action.payload.filters).sort((a: any, b: any) => b.order - a.order);
    const filtersArr = mapValues(
        groupBy(action.payload.filters, "name"),
        (value: any) => value[0].filter_values,
    );
    let properties: any = action.payload.properties.slice();
    properties.sort((one: any, two: any) => {
        let oneName = one.name.toLowerCase();
        let twoName = two.name.toLowerCase();
        if (oneName > twoName) return 1;
        if (oneName < twoName) return -1;
        return 0;
    });

    return updateObject(state, {
        loading: false,
        properties,
        filters: filtersArr,
    });
}

function fetchPropertyDetailSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    // Add highestResolutionUrl to missingInfo for each item in response
    const updatedMissingInfo = (action.payload.missingInfo || []).map((info: any) => {
        const sortedUrls: any[] = [...(info?.cdn_path || [])].sort((a: any, b: any) => {
            const resolutionA = parseInt(a.split("AUTOx")[1], 10);
            const resolutionB = parseInt(b.split("AUTOx")[1], 10);
            return resolutionA - resolutionB;
        });
        const highestResolutionUrl: any = sortedUrls[sortedUrls.length - 1];

        return { ...info, highestResolutionUrl: highestResolutionUrl };
    });
    return updateObject(state, {
        propertyDetails: updateObject(state.propertyDetails, {
            ...action.payload,
            missingInfo: updatedMissingInfo,
            loading: false,
        }),
    });
}

function fetchUnitMixesSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    console.log("fetchUnitMixesSuccess", action.payload);
    let unitMixesByFP: any = groupBy(action.payload, "unit_type");
    const inventoryData = groupBy(action.payload, "inventory_name");
    let inventoryHeader = `Inventory (`;
    mapValues(inventoryData, (_inventory, key) => {
        inventoryHeader = `${inventoryHeader} ${key} ${
            key == Object.keys(inventoryData)[Object.keys(inventoryData).length - 1] ? ")" : ","
        }`;
    });
    unitMixesByFP = map(unitMixesByFP, (item) => {
        const groundCount = filter(item, (data) => data.floor === "ground").length;
        const upperCount = filter(item, (data) => data.floor === "upper").length;
        const itemByInventory = groupBy(item, "inventory_name");
        let sumString = `${item.length} (`;
        mapValues(inventoryData, (_inventory, key) => {
            const sizeOfInventory = size(itemByInventory[key]);
            sumString = `${sumString} ${sizeOfInventory} ${
                key == Object.keys(inventoryData)[Object.keys(inventoryData).length - 1] ? ")" : ","
            }`;
        });
        return {
            unit_type: item[0].unit_type,
            level: `${groundCount + upperCount} (${groundCount},${upperCount})`,
            inventoryHeader,
            [inventoryHeader]: sumString,
        };
    });
    return updateObject(state, {
        unitMixes: updateObject(state.unitMixes, {
            data: unitMixesByFP,
            loading: false,
        }),
    });
}

function fetchPropertyFilesSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(
        state,
        action.payload.fileType == "PROJECT_IMAGE"
            ? {
                  propertyImages: updateObject(state.propertyImages, {
                      data: action.payload.response,
                      loading: false,
                  }),
              }
            : {
                  rentRoll: updateObject(state.rentRoll, {
                      data: action.payload.response,
                      loading: false,
                  }),
              },
    );
}

// eslint-disable-next-line
function getLoaderStatus(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(
        state,
        action.payload.fileType === "PROJECT_IMAGE"
            ? {
                  propertyImages: updateObject(state.propertyImages, {
                      loading: true,
                  }),
              }
            : {
                  rentRoll: updateObject(state.rentRoll, {
                      loading: true,
                  }),
              },
    );
}

// eslint-disable-next-line
function fetchPropertyFilesStart(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(state, {
        propertyImages: updateObject(state.propertyImages, {
            loading: action.payload.fileType == "PROJECT_IMAGE" ? true : false,
        }),
        rentRoll: updateObject(state.rentRoll, {
            loading: action.payload.fileType == "RENT_ROLL_COSTUMER_UPLOAD" ? true : false,
        }),
    });
}

// eslint-disable-next-line
function fetchUnitMixesStart(state: IPropertiesConsumer, _action: PayloadAction<any>) {
    return state;
}

// eslint-disable-next-line
function fetchFloorPlanStart(state: IPropertiesConsumer, _action: PayloadAction<any>) {
    return updateObject(state, {
        propertyFloorplan: updateObject(state.propertyFloorplan, {
            loading: true,
        }),
    });
}

function deletePropertiesFile(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(
        state,
        action.payload.fileType == "PROJECT_IMAGE"
            ? {
                  propertyImages: updateObject(state.propertyImages, {
                      data: action.payload.data,
                      loading: false,
                  }),
              }
            : {
                  rentRoll: updateObject(state.rentRoll, {
                      data: action.payload.data,
                      loading: false,
                  }),
              },
    );
}

function fetchFloorPlanSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    const fpData = groupBy(action.payload, "take_off_type");
    return updateObject(state, {
        propertyFloorplan: updateObject(state.propertyFloorplan, {
            building: fpData["BUILDING"] || [],
            commonArea: fpData["COMMON_AREA"] || [],
            loading: false,
        }),
    });
}
// eslint-disable-next-line no-unused-vars
function fetchForgeViewerDetailsStart(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(state, {
        projectViews: updateObject(state.projectViews, {
            data: [],
            loading: true,
        }),
    });
}
function fetchForgeViewerDetailsSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    let projectViews = [
        {
            title: "Unit Interior Details",
            dataKey: "FLOORPLAN",
            order: 0,
            data: [], //mockdata.FLOORPLAN,
            subTitleForCard1: "Floorplan Name",
            warnCarditle: "Unit Interior Details",
        },
        {
            title: "Common Area Details",
            dataKey: "COMMON_AREA",
            order: 2,
            data: [], //mockdata.COMMON_AREA,
            subTitleForCard1: "Common Area",
            warnCarditle: "Common Area Details",
        },
        {
            title: "Exterior Details",
            dataKey: "BUILDING",
            order: 1,
            data: [], // mockdata.BUILDING,
            subTitleForCard1: "Building Type",
            warnCarditle: "Exterior Details",
        },
        {
            title: "Site Details",
            dataKey: "SITE",
            order: 3,
            data: [], // mockdata.SITE,
            subTitleForCard1: "Site Details",
            warnCarditle: "Site Details",
        },
    ];

    console.log("forgeviewer resp", action.payload);
    projectViews = projectViews?.map((item: any) => {
        item.data =
            action.payload.data && action?.payload?.data[item.dataKey]
                ? action.payload.data[item.dataKey].map((dataItem: any) => ({
                      ...dataItem,
                      missingInfo: dataItem.media_uploads,
                      isHavingMissingInfo: dataItem.is_missing_info,
                  }))
                : [];
        return { ...item };
    });
    return updateObject(state, {
        projectViews: updateObject(state.projectViews, {
            data: projectViews,
            loading: false,
        }),
    });
}
// eslint-disable-next-line no-unused-vars
function fetchForgeViewerDetailsFailure(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(state, {
        projectViews: updateObject(state.projectViews, {
            data: [
                {
                    title: "Unit Interior Details",
                    dataKey: "FLOORPLAN",
                    order: 0,
                    data: [], //mockdata.FLOORPLAN,
                    subTitleForCard1: "Floorplan Name",
                    warnCarditle: "Unit Interior",
                },
                {
                    title: "Common Area Details",
                    dataKey: "COMMON_AREA",
                    order: 2,
                    data: [], //mockdata.COMMON_AREA,
                    subTitleForCard1: "Common Area",
                    warnCarditle: "Common Area Details",
                },
                {
                    title: "Exterior Details",
                    dataKey: "BUILDING",
                    order: 1,
                    data: [], // mockdata.BUILDING,
                    subTitleForCard1: "Building Type",
                    warnCarditle: "Building Details",
                },
                {
                    title: "Site Details",
                    dataKey: "SITE",
                    order: 3,
                    data: [], // mockdata.SITE,
                    subTitleForCard1: "Site Details",
                    warnCarditle: "Site Details",
                },
            ],
            loading: false,
        }),
    });
}

// eslint-disable-next-line no-unused-vars
function fetchPropertyStatsStart(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(state, {
        propertyStats: updateObject(state.propertyStats, {
            loading: true,
        }),
    });
}

// eslint-disable-next-line no-unused-vars
function fetchPropertyStatsSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    return updateObject(state, {
        propertyStats: updateObject(state.propertyStats, {
            loading: false,
            data: action.payload,
        }),
    });
}

function createPropertyMissingInfoSuccess(state: IPropertiesConsumer, action: PayloadAction<any>) {
    const missingInfoFiles = action?.payload?.flatMap((details: any) => details?.file || []);
    // Add highestResolutionUrl to missingInfo for each item in response

    const updatedMissingInfo = (missingInfoFiles || []).map((info: any) => {
        const sortedUrls: any[] = [...(info?.cdn_path || [])].sort((a: any, b: any) => {
            const resolutionA = parseInt(a.split("AUTOx")[1], 10);
            const resolutionB = parseInt(b.split("AUTOx")[1], 10);
            return resolutionA - resolutionB;
        });
        const highestResolutionUrl: any = sortedUrls[sortedUrls.length - 1];

        return { ...info, highestResolutionUrl: highestResolutionUrl };
    });

    return updateObject(state, {
        propertyDetails: updateObject(state.propertyDetails, {
            missingInfo: Array.from(
                new Set([...state.propertyDetails.missingInfo, ...updatedMissingInfo.flat()]),
            ),
            loading: false,
        }),
    });
}
// eslint-disable-next-line no-unused-vars
function resetPropertyDetails(state: IPropertiesConsumer, action: PayloadAction<any>) {
    // Can update this reset state for any other data within this redux state based on specific requirements
    return updateObject(state, {
        propertyStats: updateObject(state.propertyStats, {
            loading: false,
            data: {},
        }),
    });
}

const slice = createSlice({
    name: "properties",
    initialState: initState,
    reducers: {
        fetchAllPropertiesStart,
        fetchAllPropertiesSuccess,
        fetchPropertyDetailedStatsStart,
        fetchPropertyDetailedStatsSuccess,
        fetchPropertyDetailStart,
        fetchPropertyDetailSuccess,
        getLoaderStatus,
        fetchPropertyFilesStart,
        fetchPropertyFilesSuccess,
        fetchUnitMixesStart,
        fetchFloorPlanStart,
        fetchFloorPlanSuccess,
        fetchUnitMixesSuccess,
        deletePropertiesFile,
        fetchForgeViewerDetailsSuccess,
        fetchForgeViewerDetailsStart,
        fetchForgeViewerDetailsFailure,
        fetchPropertyStatsStart,
        fetchPropertyStatsSuccess,
        createPropertyMissingInfoSuccess,
        fetchPropertyDetailedStatsForAllUnitsSuccess,
        resetPropertyDetails,
    },
});

export const actions = slice.actions;

export default slice.reducer;
