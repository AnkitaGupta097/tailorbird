import {
    IConfigurationFormData,
    IContractorFormData,
    IContractorErrors,
    IOwnershipFormData,
    IUserErrors,
    IUserFormData,
    IOrganization,
    IUserInfo,
} from "./interfaces";
import { ReactComponent as KebabMenu } from "../../../../assets/icons/kebab-menu.svg";
import BaseSvgIcon from "components/svg-icon";
import React from "react";

export const adminTabs = [
    {
        value: "/users",
        label: "Users",
    },
    {
        value: "/contractors",
        label: "Contractors",
    },
    {
        value: "/ownerships",
        label: "Ownerships +",
    },
];

export const userTab = [
    {
        value: "/users",
        label: "Users",
    },
];

export const ContractorDialogConstants = {
    CONTRACTOR_NAME: "Contractor Name*",
    GOOGLE_WORKSPACE_EMAIL: "Google Workspace Email*",
    TAILORBIRD_US: `${process.env.REACT_APP_GOOGLE_WORKSPACE_DOMAIN}`,
    STREET_ADRESS: "Street Address*",
    CITY: "City*",
    STATE: "State",
    ZIPCODE: "ZIP CODE",
    DELETE_TEXT: "Are you sure you want to delete this contractor",
    SAVED_TEXT: "Contractor has been added successfully",
    LOADER_TEXT: "Contractor is being added, Please wait",
    LOADER_EDIT_TEXT: "Contractor is being updated, Please wait",
    SAVED_EDIT_TEXT: "Contractor has been updated successfully",
    ERROR_TEXT: "An Error Occured while performing this operation, Please try again later",
    DELETED_TEXT: "Contractor has been deleted successfully",
    DELETING_ORG: "Contractor is being deleted, Please wait",
};

export const intitalFormData: IContractorFormData = {
    contractorName: "",
    googleWorkspaceEmail: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
};

export const initialContractorErrors: IContractorErrors = {
    contractorName: false,
    googleWorkspaceEmail: false,
    streetAddress: false,
    city: false,
};

export const menuOptions = {
    EDIT: "Edit",
    DELETE: "Delete",
    RESEND: "Resend Invite",
};

export const OwnershipDialogConstants = {
    title: "Ownership and Other Demand Organizations",
    OWNERSHIP_NAME: "Organization Name*",
    OWNERSHIP_URL: "Organization Url",
    ORGANIZATION_TYPE: "Organization Types*",
    ORG_TYPES: [
        {
            value: "CONSTRUCTION_MANAGEMENT_GROUP",
            label: "Construction Management Group",
        },
        {
            value: "OPERATOR",
            label: "Operator",
        },
        {
            value: "OWNERSHIP_GROUP",
            label: "Ownership Group",
        },
        {
            value: "CONTRACTOR_DEMAND",
            label: "Contractor Demand",
        },
        {
            value: "TAILORBIRD",
            label: "Tailorbird",
        },
    ],
    TAILORBIRD_CONTACT: "Primary Tailorbird Contact",
    CITY: "City",
    STREET_ADDRESS: "Street Address",
    STATE: "State",
    ZIPCODE: "ZIP Code",
    TAILORBIRD_CONTACT_HELPER_TEXT: "Select a Tailorbird contact from the list",
    ORGANIZATION_TYPE_HELPER_TEXT: "Select an Organization Type from the list",
    DELETE_TEXT: "Are you sure you want to delete this ownership",
    SAVED_TEXT: "Ownership has been added successfully",
    LOADER_TEXT: "Ownership is being added, Please wait",
    LOADER_EDIT_TEXT: "Ownership is being updated, Please wait",
    SAVED_EDIT_TEXT: "Ownership has been updated successfully",
    ERROR_TEXT: "An Error Occured while performing this operation, Please try again later",
    DELETED_TEXT: "Ownership has been deleted successfully",
    DELETING_ORG: "Organization is being deleted, Please wait",
    // org type by Id
    ORG_TYPES_MAP: {
        CONSTRUCTION_MANAGEMENT_GROUP: " Construction Management Group",
        OPERATOR: " Operator",
        OWNERSHIP_GROUP: " Ownership Group",
        CONTRACTOR_DEMAND: "Contractor Demand",
        TAILORBIRD: "Tailorbird",
    },
    GOOGLE_WORKSPACE_EMAIL: "Google Workspace Email*",
};

export const initialOwnershipData: IOwnershipFormData = {
    city: "",
    ownershipName: "",
    ownershipUrl: "",
    state: "",
    streetAddress: "",
    zipCode: "",
    tailorbirdContact: "",
    organizationType: [""],
    googleWorkspaceEmail: "",
};

export const initialConfigurationData: IConfigurationFormData = {
    name: "",
    projectIds: [""],
};

export const UserDialogConstants = {
    title: "User",
    ORG_TYPE: "Organization Type*:",
    CONTRACTOR: "Contractor",
    OWNERSHIP: "Ownership",
    CONTRACTOR_NAME: "Contractor Name*",
    OWNERSHIP_NAME: "Ownership Name*",
    NAME: "Name*",
    EMAIL: "Email*",
    PH_NUMBER: "Phone Number",
    ROLE: "Role*",
    SAVING_TEXT: `The user is being added. 
    This user will receive an email notification to 
    generate their password for the login.`,
    EDIT_TEXT: `Saving Updated Details`,
    SAVED_TEXT: "User has been successfully added",
    EDITED_TEXT: "User has been successfully edited",
    DELETE_TEXT: "Are you sure you want to delete this user",
    ERROR_USER_CREATE: "Error in Creating User",
    ERROR_EDIT: "Error in Saving this user",
    ERROR_DELETE: "Error while deleting this user",
    RESEND_INVITE_LOADING: "Invite is being sent",
    RESENT_INVITE: "Invite has been successfully sent",
    LOADER_DELETE: "User is being deleted, Please wait",
    DELETED_USER: "User has been deleted Successfully",
    ERROR_RESEND_INVITE: "Failed to send invite",
    STREET_ADDRESS: "Street Address",
    CITY: "City",
    STATE: "State",
    ZIP_CODE: "ZIP Code",
    // PERSONA: "Persona",
    IS_BILLING_MANAGER_ACCESS: "is billing manager accessible",
    IS_APPROVAL_WORKFLOW: "is approval workflow",
};

export const ROLES = [
    {
        value: "CONTRACTOR_ADMIN",
        label: "Contractor Admin",
    },
    {
        value: "ESTIMATOR",
        label: "Estimator",
    },
];

export const TOGGLE_ACCESS: any = {
    ADMIN: [],
    CONSTRUCTION_MANAGER: ["IS_BILLING_MANAGER_ACCESS", "IS_APPROVAL_WORKFLOW"],
    OPERATOR: ["IS_BILLING_MANAGER_ACCESS", "IS_APPROVAL_WORKFLOW"],
    PROJECT_ADMIN: ["IS_BILLING_MANAGER_ACCESS", "IS_APPROVAL_WORKFLOW"],
    CONTRACTOR_ADMIN: ["IS_BILLING_MANAGER_ACCESS"],
    CONSTRUCTION_OPERATIONS: [],
    ASSET_MANAGER: [],
    ESTIMATOR: [],
};

export const OWNERSHIP_ROLES = [
    {
        value: "ADMIN",
        label: "Admin",
    },
    {
        value: "ASSET_MANAGER",
        label: "Asset Manager",
    },
    {
        value: "CONSTRUCTION_MANAGER",
        label: "Construction Manager",
    },
    {
        value: "CONSTRUCTION_OPERATIONS",
        label: "Construction Operations",
    },
    {
        value: "OPERATOR",
        label: "Operator",
    },
    {
        value: "PROJECT_ADMIN",
        label: "Project Admin",
    },
];

// export const PERSONA = [
//     {
//         value: "GENERAL MANAGER",
//         label: "General Manager",
//     },
//     {
//         value: "GENERAL CONTRACTOR",
//         label: "General Contractor",
//     },
//     {
//         value: "OPERATOR",
//         label: "Operator",
//     },
// ];

export const ALL_ROLES = [...ROLES, ...OWNERSHIP_ROLES];

export const ROLE_MAPPING: any = {
    ADMIN: "Tailorbird Admin",
    CONTRACTOR_ADMIN: "Contractor Admin",
    ESTIMATOR: "Estimator",
    CONSTRUCTION_MANAGER: "Construction Manager",
    OPERATOR: "Operator",
    PROJECT_ADMIN: "Project Admin",
    CONSTRUCTION_OPERATIONS: "Construction Operations",
    ASSET_MANAGER: "Asset Manager",
};

export const ORGANIZATION_TYPE = [
    {
        label: "Contractor",
        value: "contractor",
    },
    {
        label: "Demand Organization",
        value: "demand organization",
    },
];

export const intitalUserFormData: IUserFormData = {
    organizationType: "Contractor",
    contractor: null,
    email: "",
    name: "",
    phoneNumber: "",
    roles: null,
    state: "",
    streetAddress: "",
    city: "",
    zipCode: "",
};

export const USER_INFO: IUserInfo = {
    contractor: "",
    email: "",
    name: "",
    contact_number: "",
    roles: "",
    state: "",
    street_address: "",
    city: "",
    status: "",
    zip_code: "",
    is_billing_manager_access: false,
    is_approval_workflow: false,
    organization: { city: "", contact_number: "", google_workspace_email: "", id: "", name: "" },
};

export const userErrors: IUserErrors = {
    roles: false,
    name: false,
    email: false,
    contractor: false,
    ownership: false,
};

export const getBgColor = (status: string) => {
    return status.toLowerCase() === "Active".toLowerCase() ? "#57B6B2" : "#004D71";
};

export const STATUS: any = {
    ACTIVE: "Active",
    NEW: "New",
    INVITE_SENT: "Invited",
    DEACTIVATED: "Deactivated",
    REVOKED: "Revoked",
};

export const checkOwnership = (ownerships: IOrganization[], name?: string | null) => {
    if (!name) {
        return false;
    } else {
        return !!ownerships.find(
            (ownership) => ownership.name.toLowerCase() == name?.toLowerCase(),
        );
    }
};

// Check if Email is already used for not
export const checkEmail = (contractors: IOrganization[], email?: string | null | undefined) => {
    if (!email) return true;
    email = `${email}${ContractorDialogConstants.TAILORBIRD_US}`;
    return !!contractors.find((contractor) => contractor.google_workspace_email === email);
};

export const KebabMenuIcon = () => <BaseSvgIcon svgPath={<KebabMenu />} />;
