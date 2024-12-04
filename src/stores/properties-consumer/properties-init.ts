import initAjaxState from "../initAjaxState.json";

export default {
    ...initAjaxState,
    properties: [],
    filters: {},
    propertyDetails: {
        ...initAjaxState,
        missingInfo: [],
        isHavingMissingInfo: false,
        loading: true,
    },
    rentRoll: { ...initAjaxState, data: [] },
    propertyStats: { ...initAjaxState, data: {} },
    unitMixes: { ...initAjaxState, data: [], loading: true },
    propertyImages: { ...initAjaxState, data: [], loading: true },
    propertyFloorplan: { ...initAjaxState, building: [], loading: true, commonArea: [] },
    propertyInteriorDetails: {
        loading: false,
        data: [],
    },
    propertyExteriorDetails: {
        loading: false,
        data: [],
    },
    loading: true,
    propertyDetailStatsForAllUnits: { ...initAjaxState, data: [] },
};
