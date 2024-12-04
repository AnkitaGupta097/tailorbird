const overviewTabs = [
    "Renovation Wizard",
    "Design Documents",
    "RFP",
    "Production",
    "Project Analytics",
];
// const overviewTabs = ["Design Documents", "RFP", "Production"];
// const overviewTabs = ["Renovation Wizard", "RFP", "Production"];
// add this back to overviewTabs to see analytics in project details
// "Project Analytics"
const InfoMessages = {
    keyPeople:
        "Please email support@tailorbird.us to add anyone associated with this project. We will contact them and make sure they are up to date with the relevant information.",
};

const RENO_STEPS = ["welcome", "inventory", "package", "rooms", "category_questions"];

const STEPS_NAME = {
    WELCOME: "welcome",
    INVENTORY: "inventory",
    PACKAGE: "package",
    ROOMS: "rooms",
    CATEGORY_QUESTIONS: "category_questions",
    SCOPE_SUMMARY: "scope_summary",
};

const MATERIAL_DETAILS = {
    name: "",
    style: "",
    finish: "",
    grade: "",
    manufacturer: "",
    model_id: "",
    supplier: "",
    sku_id: "",
};

const PARAMETER_DETAILS = {
    manufacturers: [],
    organisation_container_id: "",
    low_price: 0,
    high_price: 0,
    user_id: "",
    finish: "",
};

const BREADCRUM_INIT = [
    {
        name: "Program Details",
        icon: "new program",
        categoryId: null,
    },
    {
        name: "Select Package",
        icon: "package",
        categoryId: null,
    },
    {
        name: "Select Rooms",
        icon: "rooms",
        categoryId: null,
    },
];

const RENO_WIZARD_V2_STEPS = [
    { label: "Create Project", value: "CREATE_PROJECT" },
    { label: "Package Selection", value: "PACKAGE_SELECTION", backLabel: "Back to creation" },
    {
        label: "Applied Property Data",
        value: "APPLIED_PROPERTY_DATA",
        backLabel: "Back to package selection",
    },
    { label: "Upload & Notes", value: "UPLOAD_AND_NOTES", backLabel: "Back to selections" },
    { label: "Summary", value: "SUMMARY", backLabel: "Back to uploads" },
];

export {
    InfoMessages,
    overviewTabs,
    RENO_STEPS,
    STEPS_NAME,
    MATERIAL_DETAILS,
    BREADCRUM_INIT,
    PARAMETER_DETAILS,
    RENO_WIZARD_V2_STEPS,
};
