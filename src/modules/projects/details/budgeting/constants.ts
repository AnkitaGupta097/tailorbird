export const APP_PAGES = ["Projects", "Scopes", "Packages", "Scraper", "Admin"];
export const APP_PAGE_ROUTES: { [key: string]: string } = {
    Projects: "/admin-projects/active",
    Scopes: "/scopes",
    Packages: "/packages",
    Scraper: "/scraper",
    Admin: "/admin/users",
    Rfp: "/rfp",
    Bidbook: "/bidbook",
    ContainerAdmin: "/container",
    CostCodeMapper: "/cost-code-mapper",
    PropertyTagging: "/property-tagging",
    ProjectV1Migration: "/property-data-backfill",
};
export const DRAWER_WIDTH = 240;
export const PROJECT_DETAILS_PAGES = [
    { label: "Overview", value: "overview", enable: true },
    { label: "Floorplans", value: "floorplans", enable: true },
    { label: "Budgeting", value: "budgeting", enable: true },
    { label: "SOW (Ex A)", value: "sow_ex_a", enable: true },
    {
        label: "Bidbook",
        value: "bidbook",
        enable: true,
    },
    { label: "RFP Manager", value: "rfp_manager", enable: true },
    { label: "Demand Users", value: "demand_users", enable: true },
    { label: "Resource Access", value: "resource_access", enable: true },
];
export const PROPERTY_TABS = [
    { label: "Overview", value: "overview", enable: true },
    { label: "Floorplans", value: "floorplans", enable: true },
    { label: "Projects", value: "projects", enable: true },
];

export const BUDGETING_LOCKED_SCOPES = ["alt-scope", "flooring-scope"];
export const BUDGETING_SCOPES = ["Base Scope", "Alt Scope", "Flooring Scope"];
export const TABLE_SKU_OPTIONS = ["Floorplan Cost", "Assign SKU", "Remove SKU"];
export const BASE_PACKAGE_HEADER = "Add a base package";
export const BASE_PACKAGE_FIELD_LABEL = "Existing base packages for this ownership group";
export const VARIATION_HEADER = "Add a variation";
export const VARIATION_TABLE_HEADER = "Take-off Adjustments:";
export const VARIATION_ITEM_FIELD_LABEL = "Which item has SKU variations?";
export const VARIATION_COUNT_FIELD_LABEL = "How many SKUs would this item have?";
export const SCOPE_INVENTORY_DEFINITION_MESSAGE = "Inventory definition pending!";
export const SCOPE_INVENTORY_TEXT_FIELD_PLACEHOLDER =
    "Search for Category / Sub Category / Description";
export const SCOPE_INVENTORY_PAGINATION_OPTIONS = {
    itemsPerPage: 5,
    start: 0,
};
export const SCOPE_INVENTORY_WAVG_PRETEXT = "WAVG: $";
export const SCOPE_INVENTORY_SHOW_HIDE_BUTTON = "Show / hide All";
export const SCOPE_INVENTORY_INV_WAVG_PRETEXT = "Inventory WAVG: $";
export const SCOPE_INVENTORY_PAGE_VIEW_LABEL = "Page View";
export const SCOPE_INVENTORY_INCOMPLETE_FILTER_LABEL = "Incomplete";
export const SCOPE_INVENTORY_VARIATION_FILTER_LABEL = "Variations";
export const CATEGORY_INCOMPLETE_TEXT = "Some item details incomplete under this category.";

export const CATEGORIES_ORDER = {
    "Kitchen & Bath Finishes": 0,
    Appliances: 1,
    "Bath Accessories": 2,
    Hardware: 3,
    Lighting: 4,
    Electric: 5,
    "HVAC & Waterheater": 6,
    Plumbing: 7,
    Flooring: 8,
    Paint: 9,
    Blinds: 10,
    "Repairs & Make Ready": 11,
    "Floorplan Modifications": 12,
    "General Conditions": 13,
    "Profit & Overhead": 14,
};

export const WORK_PACKAGE = [
    {
        label: "Material and Labor",
        value: "Material and Labor",
    },
    {
        label: "Material and Labor and Kit",
        value: "Material and Labor and Kit",
    },
    {
        label: "Material and Labor combined",
        value: "Material and Labor combined",
    },
    {
        label: "Labor only",
        value: "Labor only",
    },
];

export const UOM = ["Count", "Area", "Length"];

export const SCOP_ITEMS = [
    { value: "Demo Existing", label: "Demolish Existing" },
    { value: "Install New", label: "Install New" },
    { value: "Remove and Store", label: "Remove and Store" },
    { value: "Reinstall Existing", label: "Reinstall Existing" },
    { value: "Repair Existing", label: "Repair Existing" },
    { value: "Refinish Existing", label: "Refinish Existing" },
    { value: "Add New", label: "Add New" },
];

export const ITEM_DETAILS = { scopes: [], category: "", work_package: "", item_name: "", uom: "" };

export const MATERIAL_DETAILS = {
    version: "2.0",
    user_id: "",
    supplier: "",
    url: "",
    subcategory: "",
    style: "",
    sku_id: "",
    model_id: "",
    manufacturer: "",
    is_kit: false,
    grade: "",
    finish: "",
    description: "",
    created_by: "",
    category: "",
};
export const ERROR_FIELD = {
    scopes: false,
    category: false,
    work_package: false,
    item_name: "",
    uom: false,
    description_material: false,
    description_kit: false,
};

export const SKU_TYPE = { MATERIAL: "material", KIT: "kit" };
export const BIDBOOK_2_0_STEPS = [
    { label: "Floor Plans", value: "FLOOR_PLANS" },
    { label: "Inventories", value: "INVENTORIES" },
    { label: "Manage Units", value: "MANAGE_UNITS" },
    { label: "Base Bid", value: "BASE_BID" },
    { label: "Alternates", value: "ALTERNATIVES" },
    { label: "Flooring", value: "FLOORING" },
];
