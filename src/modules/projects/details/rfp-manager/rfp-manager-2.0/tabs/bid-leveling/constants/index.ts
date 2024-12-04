const BL_TABS = [
    {
        label: "Aggregate",
        value: "aggregate",
    },
];

const BL_TABS_INTERIOR = [
    {
        label: "Wtd Average",
        value: "wtd_avg",
    },
    {
        label: "Aggregate",
        value: "aggregate",
    },
];

const CONTENT_FILTERS_WBS = {
    KEY: "Content",
    VALUE: ["Child Category", "Sub Child Category", "Scope Detail", "Description"],
};
const CONTENT_FILTERS_NON_WBS = {
    KEY: "Content",
    VALUE: ["Scope Detail", "Description"],
};
const WORK_TYPE_FILTERS = { KEY: "Work Type", VALUE: ["Labor", "Material"] };
const FLOORING_FILTERS = { KEY: "Flooring", VALUE: ["Ground", "Upper"] };

const getRowFilters = (isFloorSplitUsed: boolean, isWBSProject = false) => {
    const ROW_FILTERS = {
        ...(isWBSProject
            ? { [CONTENT_FILTERS_WBS.KEY]: CONTENT_FILTERS_WBS.VALUE }
            : { [CONTENT_FILTERS_NON_WBS.KEY]: CONTENT_FILTERS_NON_WBS.VALUE }),
        [WORK_TYPE_FILTERS.KEY]: WORK_TYPE_FILTERS.VALUE,
        ...(isFloorSplitUsed && { [FLOORING_FILTERS.KEY]: FLOORING_FILTERS.VALUE }),
    };
    return {
        ROW_FILTERS,
        TOTAL_FILTERS: Object.values(ROW_FILTERS).flat().length,
    };
};
const FONT_COLOR = {
    selectedFont: "white",
    defaultFont: "#6A6464",
};
const FILTER_CHIP_BG_COLOR = "#BCDFEF";

const TREE_DATA_CELL_FONT_COLOR = "#004D71";

export type FLOORING_STATE_TYPE = "default" | "ground" | "upper" | "consolidated";

export {
    BL_TABS,
    BL_TABS_INTERIOR,
    FONT_COLOR,
    getRowFilters,
    FILTER_CHIP_BG_COLOR,
    TREE_DATA_CELL_FONT_COLOR,
};
