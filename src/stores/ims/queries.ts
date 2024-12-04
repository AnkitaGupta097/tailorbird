import { gql } from "@apollo/client";

export const GET_ALL_USERS = gql`
    query getAllUsers($input: getAllUsersInput) {
        getAllUsers(input: $input) {
            id
            auth0_id
            email
            name
            status
            contact_number
            organization {
                id
                name
                city
                state
                zip_code
                google_workspace_email
                ownership_url
                contact_number
                organization_type
            }
            roles
            street_address
            city
            state
            zip_code
            is_billing_manager_access
            is_approval_workflow
        }
    }
`;

export const GET_ALL_USERS_BY_ORGANIZATION_ID = gql`
    query getUsersByOrgId($organization_id: String) {
        getUsersByOrgId(organization_id: $organization_id) {
            id
            auth0_id
            email
            name
            status
            contact_number
            organization {
                id
                name
                city
                state
                zip_code
                ownership_url
                google_workspace_email
                contact_number
            }
            roles
            street_address
            city
            state
            zip_code
            is_billing_manager_access
            is_approval_workflow
        }
    }
`;

export const GET_ALL_ORGANIZATIONS = gql`
    query getAllOrganizations($input: OrganizationType) {
        getAllOrganizations(organization_type: $input) {
            id
            name
            street_name
            city
            state
            zip_code
            ownership_url
            google_workspace_email
            contact_number
            primary_tb_contact
            organization_type
        }
    }
`;

export const GET_ORGANISATION_CONTAINERS = gql`
    query GetOrganisationContainers($organisationId: String) {
        getOrganisationContainers(organisation_id: $organisationId) {
            id
            organisation_id
            name
            project_ids
            is_default
        }
    }
`;

export const DELETE_ORGANIZATION_CONFIGURATION = gql`
    mutation DeleteOrganisationContainer($organisationContainerId: String) {
        deleteOrganisationContainer(organisation_container_id: $organisationContainerId)
    }
`;

export const UPDATE_ORGANIZATION_CONFIGURATION = gql`
    mutation UpdateOrganisationContainer(
        $organisationContainerId: String
        $organisation_id: String
        $is_default: Boolean
    ) {
        updateOrganisationContainer(
            organisation_container_id: $organisationContainerId
            organisation_id: $organisation_id
            is_default: $is_default
        ) {
            id
            organisation_id
            name
            project_ids
            is_default
        }
    }
`;

export const ADD_ORGANIZATION_CONFIGURATION = gql`
    mutation CreateOrganisationContainer($input: CreateOrganisationInput) {
        createOrganisationContainer(input: $input) {
            id
            organisation_id
            name
            project_ids
            is_default
        }
    }
`;

export const GET_ORGANIZATION_BY_ID = gql`
    query GetOrganization($organizationId: String) {
        getOrganization(organization_id: $organizationId) {
            id
            name
            street_name
            state
            city
            zip_code
            ownership_url
            google_workspace_email
            organization_type
            contact_number
            created_by
            primary_tb_contact
        }
    }
`;
export const ADD_USER = gql`
    mutation CreateUser($payload: UserInput) {
        createUser(payload: $payload) {
            id
            auth0_id
            email
            name
            status
            contact_number
            organization {
                id
                name
                city
                state
                zip_code
                google_workspace_email
                contact_number
            }
            roles
            street_address
            city
            state
            zip_code
            is_billing_manager_access
            is_approval_workflow
        }
    }
`;

export const ADD_ORGANIZATION = gql`
    mutation addOrganisation($payload: OrganisationInput) {
        addOrganisation(payload: $payload) {
            id
            name
            street_name
            city
            state
            zip_code
            ownership_url
            google_workspace_email
            created_by
            contact_number
            primary_tb_contact
            organization_type
            org_category
        }
    }
`;
export const EDIT_USER = gql`
    mutation editUser($payload: UserInputEdit) {
        editUser(payload: $payload) {
            id
            auth0_id
            email
            name
            status
            contact_number
            organization {
                id
                name
                city
                state
                zip_code
                google_workspace_email
                contact_number
            }
            roles
            street_address
            city
            state
            zip_code
            is_billing_manager_access
            is_approval_workflow
        }
    }
`;
export const EDIT_ORGANIZATION = gql`
    mutation editOrganisation($payload: OrganisationInputEdit) {
        editOrganisation(payload: $payload) {
            id
            name
            street_name
            city
            state
            zip_code
            google_workspace_email
            ownership_url
            primary_tb_contact
            organization_type
            created_by
            contact_number
        }
    }
`;
export const DELETE_USER = gql`
    mutation deleteUser($deleteUserId: String) {
        deleteUser(id: $deleteUserId) {
            updated
        }
    }
`;
export const DELETE_ORGANIZATION = gql`
    mutation DeleteOrganization($deleteOrganizationId: String) {
        deleteOrganization(id: $deleteOrganizationId) {
            updated
        }
    }
`;
export const RESEND_INVITE = gql`
    mutation resendInvite($payload: resetPassword) {
        resendInvite(payload: $payload) {
            id
        }
    }
`;

export const GET_USER_PROFILE = gql`
    query GetUserProfile {
        getUserProfile {
            organization_id
            id
            organization {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
            persona
            roles
            email
            name
        }
    }
`;
