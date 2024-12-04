import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import React from "react";

const PROJECTS_TABS = [
    {
        label: "Active",
        value: "/active",
    },
    {
        label: "Archived",
        value: "/archived",
    },
];

export const RFP_TABS_1 = [
    {
        label: "Contractors",
        value: "/contractors",
    },
];

export const RFP_TABS_2 = (isBidSetup: boolean, bidLevelingFeatureFlag: boolean) => {
    return !bidLevelingFeatureFlag
        ? [
              {
                  label: "Contractors",
                  value: "/contractors",
              },
              {
                  label: "Bid Setup",
                  value: "/bid-setup",
                  icon: !isBidSetup && <ErrorOutlineOutlined htmlColor="#410099" />,
              },
              {
                  label: "Documents",
                  value: "/documents",
              },
          ]
        : [
              {
                  label: "Contractors",
                  value: "/contractors",
              },
              {
                  label: "Bid Setup",
                  value: "/bid-setup",
                  icon: !isBidSetup && <ErrorOutlineOutlined htmlColor="#410099" />,
              },
              {
                  label: "Documents",
                  value: "/documents",
              },
              {
                  label: "Bid Leveling",
                  value: "/bid-leveling",
              },
          ];
};

const PROJECT_TYPE = [
    {
        label: "Unit Interior ",
        value: "INTERIOR",
    },
    {
        label: "Common Area",
        value: "COMMON_AREA",
    },
    {
        label: "Unit Exterior",
        value: "EXTERIOR",
    },
];

const PROJECT_DATA = {
    ownership_group_id: "",
    opportunity_id: "",
    organisation_container_id: "",
    name: "",
    street_address: "",
    city: "",
    state: "",
    zipcode: "",
    property_url: "",
    property_type: "",
    project_type: PROJECT_TYPE[0].value,
    per_unit_target_budget: "",
    management: "",
    management_url: "",
    user_id: "",
    container_version: "2.0",
    rfp_project_version: "1.0",
    rfp_bid_details: {},
    msa: "",
};

const PHASE_TYPE = [
    {
        label: "Pre-sitewalk",
        value: "pre_site_walk",
    },
    {
        label: "Post-sitewalk",
        value: "post_site_walk",
    },
];

export const USER_DETAILS = JSON.parse(localStorage.getItem("user_details") || "{}");

export const FETCH_USER_DETAILS = () => JSON.parse(localStorage.getItem("user_details") || "{}");

const FILE_TYPE = ["text/csv", "application/zip", "application/x-zip-compressed"];
const Rent_ROLL_FILE_TYPE = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const USER_INFO = JSON.parse(localStorage.getItem("user_details") || "{}");

export const ADD_CONTRACTOR = {
    roles: ["CONTRACTOR_ADMIN", "ESTIMATOR"],
    NOT_INVITED: "Not Invited",
    CONTRACTOR_LOADING: "Contractors are being added",
    CONTRACTOR_FAILURE: "Failed to add contractors",
    CONTRACTOR_SAVED: "Contractors successfully added",
    ADD: "Add Contractors",
    SAVE: "Save",
    CONTENT_PLACEHOLDER_TEXT: "No users selected.",
    CONTENT_PLACEHOLDER_ATEXT: "Please select users",
    WARNING_TEXT: "Please select at least one Contractor Admin",
    ADMIN_TEXT: "admin",
    ESTIMATOR_TEXT: "estimator",
};

export const BID_BOOK_DIALOG = {
    GC_COPIES_LOADING: "Generating bidbook copies",
    GC_COPIES_FAILED: "Generating bidbook copies failed",
    GC_COPIES_SAVED: "Bidbook copies generated",
    GC_COPIES_WARNING:
        "Generating new bidbook copies will erase any data contractors have already entered. If you'd like to proceed, type ERASE below:",
    CANCEL: "Cancel",
    PROCEED: "Proceed",
    ERASE: "ERASE",
};
export const REVOKE_DIALOG = {
    CANCEL: "Cancel",
    REVOKE: "Revoke Award",
    DIALOG_TEXT_1: "You are trying to remove an awarded contractor.",
    DIALOG_TEXT_2: "You need to revoke the award first.",
};

export const UNAWARD_CONTRACTOR_DIALOG = {
    REMOVE_CONTRACTOR: `You are about to revoke a project award,`,
    CONTRACTOR_NAME: (contractor: string) => `Please type ${contractor} below:`,
    UNAWARDING: "Contractor is being unawarded",
    ERROR: "Changes not successful",
    SAVED: "Contractor unawarded",
    CANCEL: "Cancel",
    PROCEED: "Proceed",
};

export const SENT_TO_BILLING_DIALOG = {
    DIALOG_TEXT_1: `Once sent for billing,`,
    DIALOG_TEXT_2: "this project award cannot be revoked",
    CONTRACTOR_NAME: (contractor: string) => `Please type ${contractor} below:`,
    LOADING: "Sending to billing manager",
    ERROR: "Could not push to billing",
    SAVED: "Successfully pushed to billing",
    CANCEL: "Cancel",
    PROCEED: "Proceed",
};

export const COPY_APPENDIX_DIALOG = {
    LOADING: "Appendix Folders and emailing GCs are being copied",
    ERROR: "Failed copying appendix Folders and emailing GCs",
    SAVED: "Appendix Folders and emailing GCs have been successfully copied",
    TEXT: "Copy Appendix to GC Folder",
    MESSAGE:
        "Please note: This will copy all files from Appendix into GC's folders as the new files. Please move older files from Appendix to Archived folder to avoid duplicates. Please provide a message below explaining the updates. This message will be emailed to general contractors along with a list of which documents have been updated.",
    LABEL: "Add Message",
    PLACEHOLDER: "Type your message here...",
    CANCEL: "Cancel",
    COPY: "Copy",
};

export const EMAIL_WARNING = {
    WARNING_TEXT: "Please fill in the Email Template before inviting GCs.",
    CANCEL: "Cancel",
    FILL_EMAIL_METADATA: "Fill Email Template",
};

export const EMAIL_METADATA = {
    LOADER_TEXT: "Email is being added",
    ERROR_TEXT: "Failed to add email",
    SAVE_TEXT: "Email added successfully",
    TITLE: "Email Template",
    DUE_DATE: "Due date",
    START_DATE: "Expected start date (optional)",
    PLACE_HOLDER: "Select Tailorbird Contact",
    CONTACT: "Tailorbird Contact",
    EMAIL: "Tailorbird Contact Email",
    PHONE_NUMBER: "Tailorbird Contact Phone Number",
    HELPER_TEXT: "No contact exist",
    OPTIONS: ["Yes", "No"],
    FLOORING_SCOPE: "Include Exhibit C - Flooring Scope?",
    ALTERNATIVE_BID_REQUEST: "Include Exhibit C - Alternative Bid Requests?",
    IS_VE_ACCEPTED: "Is VE accepted?",
    TOTAL_UNITS: "Total units (expected)",
    TURN_RATE: "Turn rate (expected)",
    PER_UNIT_TARGET_BUDGET: "Per Unit Target Budget (optional)",
    SELECT: "Select",
    NOTES: "Project Specific Notes (optional)",
    EDIT: "Edit",
    SAVE: "Save",
    CANCEL: "Cancel",
};

export const RFP_PROJECT = {
    BID_STATUS: {
        SENT: "sent",
        PENDING_SUBMISSION: "pending_submission",
        AWARDED: "awareded",
    },
};

const PROJECT_CONTAINER_VERSIONS = ["2.0"];

const RFP_PROJECT_VERSIONS = ["1.0", "2.0"];
export const BIDBOOK_TABS = () => {
    return [
        {
            label: "Bidbook Modifier",
            value: "/bidbookmodifier",
        },
        {
            label: "Saved Versions",
            value: "/bidversions",
        },
    ];
};

export const DEMAND_USERS_CONSTANTS = {
    roles: [
        "ADMIN",
        "CONSTRUCTION_MANAGER",
        "OPERATOR",
        "ASSET_MANAGER",
        "CONSTRUCTION_OPERATIONS",
        "PROJECT_ADMIN",
        "CONTRACTOR_ADMIN",
        "ESTIMATOR",
    ],
    NOT_INVITED: "Not Invited",
    CONTRACTOR_LOADING: "Demand Users are being added",
    CONTRACTOR_FAILURE: "Failed to add Users",
    CONTRACTOR_SAVED: "Users successfully added",
    ADD: "Add Demand Users",
    SAVE: "Save",
    CONTENT_PLACEHOLDER_TEXT: "No users selected.",
    CONTENT_PLACEHOLDER_ATEXT: "Please select users",
    WARNING_TEXT: "Please select at least one Admin",
    ADMIN_TEXT: "ADMIN",
    NOT_ADMIN: "NOT_ADMIN",
};

export const OWNERSHIP_ROLES_MAP = {
    ADMIN: "Admin",
    ASSET_MANAGER: "Asset Manager",
    CONSTRUCTION_MANAGER: "Construction Manager",
    CONSTRUCTION_OPERATIONS: "Construction Operations",
    OPERATOR: "Operator",
    PROJECT_ADMIN: "Project Admin",
};

const PROJECT_STATUS = [
    "Pending Design Specifications",
    "Draft",
    "Bidbook Documents in Creation",
    "Bidbook Documents Created",
    "Initial Bids in Process",
    "Initial Bids Ready for Review",
    "Finalists Selected and Invited to Sitewalk",
    "Sitewalk Completed",
    "Final Bids Ready for Review",
    "Winner Selected / In Contract Negotiations",
    "Winner Selected / Contract Signed",
    "Production Started",
];

export {
    PROJECTS_TABS,
    PROJECT_DATA,
    PHASE_TYPE,
    PROJECT_TYPE,
    FILE_TYPE,
    Rent_ROLL_FILE_TYPE,
    PROJECT_CONTAINER_VERSIONS,
    RFP_PROJECT_VERSIONS,
    PROJECT_STATUS,
};
