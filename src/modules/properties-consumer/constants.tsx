const PROPERTY_FILTERS: any = {
    property_type: "Property Type",
    state: "State",
    MSA: "MSA",
    City: "City",
};

const PROPERTY_TYPE: any = {
    "GARDEN STYLE": "Garden Style",
    "HIGH RISE": "Highrise",
    "MID RISE": "Midrise",
};

const PROPERTY_TABS = [
    {
        label: "Details",
        value: "details",
    },
    {
        label: "Projects",
        value: "projects",
    },
];

const RENT_ROLL_FILE_TYPE = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
];

const FILE_TYPE = ["png", "jpg", "jpeg", "gif", "svg", "image/png", "image/svg+xml", "image/jpeg"];
const TAILORBIRD_PROVIDED_DATA = [
    {
        name: "Floor Plan Information",
        value: "floorPlan",
    },
    {
        name: "Building Details",
        value: "building",
    },
    {
        name: "Common Area Details",
        value: "commonArea",
    },
];
const FORGE_DETAIL_TYPES = [
    {
        title: "Unit Interior Details",
        dataKey: "FLOORPLAN",
        value: "FLOORPLAN",
        data: [],
        missingInfo: [],
    },
    {
        title: "Common Area Details",
        dataKey: "COMMON_AREA",
        value: "COMMON_AREA",
        data: [],
        missingInfo: [],
    },
    {
        title: "Exterior Details",
        dataKey: "BUILDING",
        value: "BUILDING",
        data: [],
        missingInfo: [],
    },
    {
        title: "Site Details",
        dataKey: "SITE",
        value: "SITE",
        data: [],
        missingInfo: [],
    },
];

const STATS_TYPE: any = {
    FLOORPLAN: { color: "#BCDFEF", name: "Unit Interiors" },
    COMMON_AREA: { color: "#FFD79D", name: "Common Areas" },
    BUILDING: { color: "#AEE9D1", name: "Exteriors" },
    SITE: { color: "#DDCBFB", name: "Site" },
};

export {
    STATS_TYPE,
    PROPERTY_FILTERS,
    PROPERTY_TYPE,
    PROPERTY_TABS,
    FILE_TYPE,
    RENT_ROLL_FILE_TYPE,
    TAILORBIRD_PROVIDED_DATA,
    FORGE_DETAIL_TYPES,
};
