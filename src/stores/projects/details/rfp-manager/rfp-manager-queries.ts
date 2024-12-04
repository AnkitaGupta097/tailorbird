/* eslint-disable */
import { gql } from "@apollo/client";
export const GET_CONTRACTOR_LIST = gql`
    query getContractorListForProject(
        $projectId: String
        $rfpProjectVersion: String
        $isDemandSide: Boolean
    ) {
        getContractorListForProject(
            project_id: $projectId
            rfp_project_version: $rfpProjectVersion
            is_demand_side: $isDemandSide
        ) {
            contractor_ids
            organization_details {
                bid_status
                invited_on
                organization_id
                bid_versions {
                    exh_c_copy_url
                    date_created
                    baseline_bidbook_url
                    baseline_version
                }
                bid_requests {
                    created_at
                    id
                    reno_item_version
                    revision_version
                }
                bid_responses {
                    created_at
                    id
                    reno_item_version
                    version
                }
            }
            user_list {
                contractor_id
                organization_id
                invited_on
                project_id
            }
        }
    }
`;

export const GET_CONTRACTORLIST_FOR_PROJECT_BY_ORGANIZATION = gql`
    query getContractorListForProjectByOrganization($input: contractorsListRequest) {
        getContractorListForProjectByOrganization(input: $input) {
            name
            roles
            id
            email
            organization {
                id
                name
            }
            status
            contact_number
        }
    }
`;

export const GET_USERS_FOR_CONTRACTOR = gql`
    query getAllUsers($input: getAllUsersInput) {
        getAllUsers(input: $input) {
            name
            roles
            id
            email
            organization {
                id
                name
            }
            status
        }
    }
`;

export const GET_CONTRACTOR_BY_ID = gql`
    query getOrganization($organizationId: String) {
        getOrganization(organization_id: $organizationId) {
            name
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query getUserById($userId: String) {
        getUserById(id: $userId) {
            organization {
                id
                name
            }
            roles
            name
            id
            email
            contact_number
        }
    }
`;

export const GET_ALL_ORGANIZATION_BY_TYPE = gql`
    query getAllOrganizations($organizationType: OrganizationType) {
        getAllOrganizations(organization_type: $organizationType) {
            city
            contact_number
            created_by
            google_workspace_email
            id
            name
            state
            zip_code
            street_name
        }
    }
`;

export const ASSIGN_PROJECT = gql`
    mutation Mutation($input: AssignProjectToContractorAndOrganizationRequest) {
        assignProjectsToContractorOrEstimator(assignContractorOrEstimatorRequest: $input)
    }
`;

export const UPDATE_EMAIL_METADATA = gql`
    mutation updateEmailMetaData($input: RFPProjectEmailMetadataRequest) {
        updateEmailMetaData(input: $input)
    }
`;

export const GET_EMAIL_METADATA = gql`
    query getEmailMetaData($projectId: String) {
        getEmailMetaData(project_id: $projectId) {
            bid_due_date
            include_alt_bid_requests
            include_flooring_scope
            project_specific_notes
            tailorbird_contact_phone_number
            tailorbird_contact_user_id
        }
    }
`;

export const GET_BASELINE_BIDBOOK = gql`
    query GetBaselineBidBookForProject($projectId: String) {
        getBaselineBidBookForProject(project_id: $projectId) {
            bidbook_url
            folder_url
        }
    }
`;

export const UPDATE_BID_STATUS = gql`
    mutation Mutation($updateBidStatus: UpdateBidStatusRequest) {
        updateOrganizationBidStatus(UpdateBidStatus: $updateBidStatus)
    }
`;

export const SEND_FOR_REVISION = gql`
    mutation Mutation($sendForRevisionRequest: BaseOrganizationRequest) {
        sendForRevision(sendForRevisionRequest: $sendForRevisionRequest) {
            status
        }
    }
`;

export const COPY_APPENDIX_TO_GC_FOLDER = gql`
    mutation Mutation($projectId: String) {
        copyAppendixToGCFolder(project_id: $projectId) {
            organization_id
            status
        }
    }
`;

export const CREATE_BID_BOOK = gql`
    mutation Mutation($input: GenerateBidbookCopiesRequest) {
        generateBidbookCopies(input: $input)
    }
`;

export const REMOVE_ORGANIZATION_FOR_PROJECT = gql`
    mutation RemoveOrganizationAssignedToProject(
        $removeOrganizationAssignedToProject: organizationForProjectRequest
    ) {
        removeOrganizationAssignedToProject(
            removeOrganizationAssignedToProject: $removeOrganizationAssignedToProject
        )
    }
`;

export const REMOVE_USER_FOR_CONTRACTOR_FOR_PROJECT = gql`
    mutation RemoveProjectsPreviouslyAssignedToContractorOrEstimator(
        $removeContractorOrEstimatorRequest: BaseRemoveContractorOrEstimatorRequest
    ) {
        removeProjectsPreviouslyAssignedToContractorOrEstimator(
            removeContractorOrEstimatorRequest: $removeContractorOrEstimatorRequest
        )
    }
`;

export const SEND_INVITE_TO_COLLABORATORS = gql`
    mutation sendInviteToCollaborators(
        $sendInviteToCollaboratorsRequest: BaseSendInviteToCollaboratorsRequest
    ) {
        sendInviteToCollaborators(
            sendInviteToCollaboratorsRequest: $sendInviteToCollaboratorsRequest
        ) {
            status
        }
    }
`;

export const CREATE_NEW_BILLING_OPPORTUNITY = gql`
    mutation Mutation($project_id: String, $rfpProjectVersion: String) {
        createNewBillingOpportunity(
            project_id: $project_id
            rfp_project_version: $rfpProjectVersion
        ) {
            success
            billing_opportunity_id
            error
        }
    }
`;

export const GET_BILLING_OPPORTUNITY_ID = gql`
    query getBillingOpportunityID($projectId: String, $rfpProjectVersion: String) {
        getBillingOpportunityID(project_id: $projectId, rfp_project_version: $rfpProjectVersion)
    }
`;
export const SET_DESCRIPTIONS = gql`
    mutation Mutation($input: SetDescriptionInput) {
        setDescriptions(input: $input)
    }
`;

export const GET_DESCRIPTIONS = gql`
    query Query($project_id: String) {
        getDescriptions(project_id: $project_id) {
            project_id
            resource_type
            resource_id
            description
        }
    }
`;

export const CREATE_BID_REQUEST = gql`
    mutation CreateBidRequest($input: BidRequestInput) {
        createBidRequest(input: $input) {
            id
            project_id
            type
            contractor_org_id
            reno_item_version
            description
            is_accepted
            created_by
            created_at
        }
    }
`;

export const COMPUTE_BID_ITEMS_EXTENDED = gql`
    mutation ComputeBidItemExtended($projectId: String!) {
        computeBidItemExtended(project_id: $projectId)
    }
`;
export const GET_DEMAND_USERS_AND_ALL_USERS_LIST = gql`
    query GetAllUsers(
        $input: getAllUsersInput
        $projectId: String
        $rfpProjectVersion: String
        $isDemandSide: Boolean
    ) {
        getAllUsers(input: $input) {
            id
            email
            name
            organization {
                id
                name
                street_name
                organization_type
                primary_tb_contact
            }
            roles
        }
        getContractorListForProject(
            project_id: $projectId
            rfp_project_version: $rfpProjectVersion
            is_demand_side: $isDemandSide
        ) {
            user_list {
                project_id
                contractor_id
                organization_id
                invited_on
            }
        }
    }
`;
