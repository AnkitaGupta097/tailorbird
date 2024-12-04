export const InviteEstimatorsText = {
    NO_USER_FOUND: "No User Found",
    NEW_USER: "New user",
    ADD_USER: "Add User",
    INVITE_ESTIMATORS: "Invite Estimators",
    CANCEL: "Cancel",
    SEND: "Send",
};

export interface IValue {
    name: string;
    email: string;
    contact_number: string;
    role: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
}

export const ProjectDetailsText = {
    INVITE: "Invite",
    COLLABORATORS: "Collaborators",
    PROPERTY_NAME: "Property Name",
    OWNERSHIP_GROUP: "Ownership Group",
    PROPERTY_TYPE: "Property Type",
    PROPERTY_ADDRESS: "Property Address",
    LAST_BIDDING_DATE: "Last Bidding Date",
    BIDBOOK: "Bidbook",
    OPEN: "Open",
    STATUS: "Status",
    RFP_FOLDER: "RFP Folder",
};

export const ProjectListText = {
    PROJECTS: "Projects",
    SEARCH_PLACEHOLDER: "Search by project name, address, owner",
};

export const PropertyListText = {
    PROPERTIES: "Properties",
    SEARCH_PLACEHOLDER: "Search by property name, address, owner",
};

export const AddUserText = {
    USER: "User",
    SAVE: "Save",
    ROLES: ["Contractor Admin", "Estimator"],
    SELECT_ROLE: "Select Role",
    USER_NAME: "User Name*",
    EMAIL: "Email*",
    PHONE_NO: "Phone Number",
    ROLE: "Role*",
    STREET_ADDRESS: "Street Address",
    CITY: "City",
    STATE: "State",
    ZIP_CODE: "ZIP Code",
};

export const ActionMenuText = {
    RESEND_INVITE: "Resend Invite",
    REMOVE: "Remove",
};

export const BidBookActionMenuText = {
    GENERATE_COPIES: "Generate Copies",
    REGENERATE_COPIES: "Regenerate Copies",
    GENERATE_COPIES_NEW_GCs: "Generate Copies (New GCs)",
    COPY_APPENDIX: "Copy Appendix to GC Folder",
};

export const BillingOpportunity = {
    SEND_FOR_BILLING: "Send for Billing",
    BILLING_OPPORTUNITY_LOADER: "Creating new billing opportunity",
    BILLING_OPPORTUNITY_FAILED: "Failed to create billing opportunity",
    BILLING_OPPORTUNITY_SUCCESS: "Sucessfully created billing opportunity",
};

export const EmptyTexts = {
    NO_BID: "You are not currently bidding on any Tailorbird projects.\n​If you’d like to be on Tailorbird’s bid list, please reach out:\n[sales@tailorbird.us]",
    NO_PROJECT:
        "You have no projects in production with Tailorbird.\nIf you’d like to use Tailorbird to manage your production process, please reach out:\n​[sales@tailorbird.us]​",
};

export const ProjectStatus: any = {
    "Production Started": {
        backgroundColor: "#BCDFEF",
        color: "#00344D",
    },
    "Production Finished": {
        backgroundColor: "#AEE9D1",
        color: "#0E845C",
    },
    Unspecified: {
        backgroundColor: "#FDFD96",
        color: "#FE7D6A",
    },
};

export const PROJECT_TYPE: any = {
    INTERIOR: {
        label: "Interior",
        value: "INTERIOR",
    },
    COMMON_AREA: {
        label: "Common Area",
        value: "COMMON_AREA",
    },
    EXTERIOR: {
        label: "Exterior",
        value: "EXTERIOR",
    },
};
