import { pkgColumns } from "./interfaces";

export const DropdownMenusConstants = {
    OWNERSHIP: "Ownership",
    PACKAGE: "Package",
    MANUFACTURER: "Manufacturer",
    CATEGORY: "Category",
    SUBCATEGORY: "Sub Category",
    STYLE: "Style",
    FINISH: "Finish",
    GRADE: "Grade",
    SEARCH: "Search",
    ITEM: "Item",
};

export const BackNavigationBarConstants = {
    BY_LABOR: "By Labor",
    CREATE_SKU: "Create a SKU",
    COPY_SELECTED_TEXT: "Copy Selected To Package",
    SAVE: "Save",
    REMOVE: "Remove",
    BACK: "Back",
};

export const Package = {
    PACKAGE_DATA: "Package Data",
    PACKAGE_SELECTION: "Package Selection",
    FILTERS: "Filters",
};

export const AddNewSKUModalConstants = {
    CREATE_SKU: "Create a SKU",
    SCRAPE_FROM_LINK: "Scrape from a link",
    SCRAPE_IN_PROGRESS: "Your Product is being created. It will take sometime.",
    SCRAPE_COMPLETED: "Your Product successfully created",
    SCRAPE: "Scrape",
    OR: "Or",
    ADD_UPDATE_SKU: "Add & Update SKU data manually",
    CANCEL: "Cancel",
    DESC: "Description",
    SUBMIT: "Submit",
    COLUMNS: [
        { name: "Manufacturer", label: "Manufacturer" },
        { name: "ModelNumber", label: "Model Number" },
        { name: "Supplier", label: "Supplier" },
        { name: "ItemNumber", label: "Item Number" },
        { name: "UOM", label: "UoM" },
        { name: "Grade", label: "Grade" },
        { name: "Style", label: "Style" },
        { name: "Finish", label: "Finish" },
    ],
    UOM_OPTIONS: ["Count", "SQFT", "LNIN"],
    ADD_NEW_SUBCAT_DESC: "More Subcategories/Description",
    SUB_CATEGORY: "Sub Category",
    CATEGORY: "Category",
    UPLOAD_IMAGE_MANUALLY: "Upload Image Manually",
};

export const SavePackageModalConstants = {
    CREATE_PACKAGE: "Create Package",
    EDIT_PACKAGE: "Edit Package",
    COLUMN_NAMES: ["Name", "Ownership Group", "Description"],
    CANCEL: "Cancel",
    SAVE: "Save",
    EDIT: "Edit",
};

export const warningDialog = {
    WARNING: "Warning",
    WARNING_TEXT1: "Are you sure you want to leave this page?",
    WARNING_TEXT2: "Unsaved changes will be lost.",
    CANCEL: "Cancel",
    LEAVE: "Leave",
};

export const emptyProjectOwner = "N/A";

export const ownership = {
    YES: "Yes",
    NO: "No",
    OWNERSHIP_ADDED: "Ownership group successfully Added",
    ARE_YOU_SURE: "Are you sure that you want to create a new Ownership",
    FAILED: "Failed to Add Ownership group",
};

export const landingPageConstants = {
    PACKAGES: "Packages",
    SUBMIT: "Submit",
    STANDARD_PKG: "Standard Package",
    SETTINGS: "Settings",
    MANAGE: "Manage",
    PKG_SETTINGS: "Package Settings",
    DOWNLOAD: "Download File",
    NAME: "Name",
    DESC: "Description",
    CANCEL: "CANCEL",
    SAVE: "SAVE",
    OWNERSHIP_GROUP: "Ownership Group",
    CREATE: "Create",
    CONTAINER_VERSION: "Container Version",
};

export const FilterNames = {
    BASE: "Base",
    ALT: "Alt",
    STANDARD: "Standard",
    SCRAPER: "Scraper",
};

export const DialogRows = [
    { label: "Ownership", id: "ownership_group_name" },
    { label: "Created By", id: "created_by" },
    { label: "Date Created", id: "date_created" },
    { label: "Date Updated", id: "date_updated" },
];

export const PkgColumns: readonly pkgColumns[] = [
    { label: "Name", id: "Name", align: "left" },
    { label: "Ownership", id: "Ownership", align: "left" },
    { label: "Description", id: "Description", align: "left" },
    { label: "Actions", id: "Actions", align: "center" },
];

export const CONTAINER_VERSIONS = [
    {
        label: "Version 2.0",
        value: "2.0",
    },
];
