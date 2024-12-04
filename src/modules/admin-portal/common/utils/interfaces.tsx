import React from "react";
import {
    // PERSONA,
    ROLES,
} from "./constants";
import { GridColDef } from "@mui/x-data-grid";
export interface IOwnershipDialog {
    open: boolean;
    onClose: Function;
    isEdit?: boolean;
    data?: any;
    isDelete?: boolean;
}
export interface IConfigurationFormData {
    name?: string;
    projectIds?: string[];
}
export interface IOwnershipFormData {
    ownershipName?: string | null;
    ownershipUrl?: string | null;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    organizationType?: Array<string>;
    tailorbirdContact?: string;
    googleWorkspaceEmail: string | null | undefined;
}
export interface IContractorErrors {
    contractorName: boolean;
    googleWorkspaceEmail: boolean;
    streetAddress: boolean;
    city: boolean;
}
export interface IContractorFormData {
    contractorName?: string;
    googleWorkspaceEmail?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface ICommonDialog {
    iconSrc?: any;
    open: boolean;
    onClose?: Function;
    children?: React.ReactNode;
    title?: string;
    onSave?: Function;
    loading?: boolean;
    saved?: boolean;
    loaderText?: string;
    savedText?: string;
    deleteDialog?: boolean;
    deleteText?: string;
    onDelete?: Function;
    errorText?: string;
    error?: boolean;
    minHeight?: string;
    width?: string;
    errorName?: string | boolean;
    downloadFile?: Function | null;
    saveLabel?: string | null;
}

export interface IContractorDialog {
    open: boolean;
    onClose: Function;
    isEdit?: boolean;
    data?: any;
    isDelete?: boolean;
}

export interface IUserDialog {
    open: boolean;
    onClose: Function;
    roles?: Array<Object>;
    isEdit?: boolean;
    data?: any;
    isDelete?: boolean;
    isResendInvite?: boolean;
}
export interface IUserFormData {
    organizationType: "Contractor" | "Ownership";
    contractor?: any | null;
    name: string;
    email: string;
    phoneNumber?: string;
    roles?: (typeof ROLES)[0] | null;
    streetAddress: string;
    city: string;
    state?: string;
    zipCode?: string;
    // persona?: (typeof PERSONA)[0] | null;
    is_billing_manager_access?: boolean;
    is_approval_workflow?: boolean;
}

export interface IUserInfo {
    name: string;
    email: string;
    contact_number?: string;
    roles: string;
    street_address: string;
    city: string;
    state?: string;
    zip_code?: string;
    contractor?: string;
    status?: string;
    id?: string;
    is_billing_manager_access: boolean;
    is_approval_workflow: boolean;
    organization?: any;
}

export interface IUserErrors {
    contractor?: boolean;
    name: boolean;
    email: boolean;
    ownership: boolean;
    roles?: boolean;
}

export interface IOrganization {
    id: string;
    google_workspace_email?: string | null;
    street_name: string;
    ownership_url: string | null;
    city: string;
    state?: string;
    zip_code?: string;
    contact_number?: string;
    name: string;
    primary_tb_contact?: string;
    organization_type: string[];
}

export interface IUser {
    id: string;
    email: string;
    name: string;
    status: string;
    roles: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    contact_number?: any;
    organization: any;
    is_billing_manager_access?: boolean;
    is_approval_workflow?: boolean;
}

export interface IAdminTemplate {
    onClick: Function;
    title: string;
    buttonText: string;
    columns: GridColDef[];
    rows: any[];
    rowsPerPage: number[];
    onSearch: Function;
    disabled?: boolean;
    onRowClick?: any;
}
