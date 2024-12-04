const PROJECT_TYPE: any = {
    INTERIOR: {
        label: "Unit Interior",
        value: "INTERIOR",
        background_color: "#BCDFEF",
        text_color: "#00344D",
    },
    COMMON_AREA: {
        label: "Common Area",
        value: "COMMON_AREA",
        background_color: "#FFD79D",
        text_color: "#B86800",
    },
    EXTERIOR: {
        label: "Unit Exterior",
        value: "EXTERIOR",
        background_color: "#AEE9D1",
        text_color: "#0E845C",
    },
};
const PROJECT_STATUS_LIST: any = {
    "Pending Design Specifications": {
        backgroundColor: "#FFD79D",
        color: "#B86800",
        state: "Renovation in Planning",
    },
    Draft: {
        backgroundColor: "#FFD79D",
        color: "#B86800",
        state: "Renovation in Planning",
    },
    "Bidbook Documents in Creation": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Bidbook Documents Created": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Initial Bids in Process": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Initial Bids Ready for Review": {
        backgroundColor: "#FFD79D",
        color: "#B86800",
        state: "Renovation in Planning",
    },
    "Finalists Selected and Invited to Sitewalk": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Sitewalk Completed": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Final Bids Ready for Review": {
        backgroundColor: "#FFD79D",
        color: "#B86800",
        state: "Renovation in Planning",
    },
    "Winner Selected / In Contract Negotiations": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Winner Selected / Contract Signed": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
        state: "Renovation in Planning",
    },
    "Production Started": {
        backgroundColor: "#AEE9D1",
        color: "#0E845C",
        state: "Active Renovations",
    },
    "Production Finished": {
        backgroundColor: "#AEE9D1",
        color: "#0E845C",
        state: "Inactive Renovations",
    },
    Unspecified: {
        backgroundColor: "#FDFD96",
        color: "#FE7D6A",
        state: "Active Renovations",
    },
};

const PROJECT_STATE_ORDER: string[] = [
    "Active Renovations",
    "Renovation in Planning",
    "Inactive Renovations",
];
// const PROJECT_STATUS: any = {
//     "GARDEN STYLE": "Garden Style",
//     "HIGH RISE": "Highrise",
//     "MID RISE": "Midrise",
// };
// export { PROPERTY_FILTERS, PROPERTY_TYPE, PROPERTY_TABS };
export { PROJECT_TYPE, PROJECT_STATUS_LIST, PROJECT_STATE_ORDER };
