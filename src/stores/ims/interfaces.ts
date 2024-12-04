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
    organization_type: string[];
    primary_tb_contact: string;
    org_category: string;
}

export interface IUser {
    id: string;
    auth0_id: string;
    email: string;
    name: string;
    status: string;
    roles: string;
    contact_number?: string | null;
    organization: IOrganization;
    activity: string;
}

export interface IConfiguration {
    loading?: boolean;
    error?: boolean;
    saved?: boolean;
}

export interface IContainerConfig {
    name: string;
    id: string;
    is_default: boolean;
    organisation_id: string;
    project_ids: string[];
}

export interface IIMS {
    users: IUser[];
    usersByOrg: any;
    ownerships: IOrganization[];
    ownership: IOrganization;
    contractors: IOrganization[];
    configuration: IConfiguration;
    configurations: IContainerConfig[];
    confugration_fetched: boolean;
    loading?: boolean;
    saved?: boolean;
    error?: boolean;
}
