import { IOrganization } from "stores/ims/interfaces";
import { IBaseState } from "../../../common/models/base-state";

export interface IRfpManagerState extends IBaseState {
    details: any;
    assignedContractorList: IContractor[];
    OrganizationList: IOrganization[];
    ContractorList: IUser[];
    AdminList: IUser[];
    emailMetaData: IEmailMetaData;
    loaderState: any;
    uploadFileDetails: any;
    billing_opportunity_id?: string;
    allDemandUsers?: any;
    allOrgsWithDemandUsers?: any;
    allOrgsWithUsers?: any;
    loadingComputeBidItems?: boolean;
}

export interface IContractor {
    admins: string[];
    contractor_id: string;
    estimators: string[];
    name: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    roles?: string;
    organization?: {
        id: string;
        name: string;
    };
    status: string;
}

export interface IEmailMetaData {
    project_id: string | undefined;
    bid_due_date: string;
    include_alt_bid_requests: boolean;
    include_flooring_scope: boolean;
    project_specific_notes: string;
    tailorbird_contact_phone_number: string;
    tailorbird_contact_user_id: string;
}
