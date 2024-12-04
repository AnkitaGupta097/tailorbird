import { gql } from "@apollo/client";

const SELECT_AS_FINALIST = gql`
    mutation SelectAsProjectFinalist($projectId: String, $organizationId: String) {
        selectAsProjectFinalist(project_id: $projectId, organization_id: $organizationId)
    }
`;

const GET_PROJECT_FINALISTS = gql`
    query getProjectFinalist($projectId: String, $organizationId: String) {
        getProjectFinalist(project_id: $projectId, organization_id: $organizationId)
    }
`;

const GET_ORGANIZATION_SITEWALK_STATUS = gql`
    query getOrganizationSitewalkStatus($projectId: String, $organizationId: String) {
        getOrganizationSitewalkStatus(project_id: $projectId, organization_id: $organizationId) {
            status
            created_at
            id
            is_active
            organization_id
            project_id
            updated_at
            invite_config
        }
    }
`;

const INVITE_TO_SITEWALK = gql`
    mutation inviteToSitewalk(
        $projectId: String
        $organizationId: String
        $sitewalkDate: String
        $sitewalkTime: String
        $buildingContact: String
        $buildingContactEmail: String
        $buildingContactPhone: String
        $note: String
    ) {
        inviteToSitewalk(
            project_id: $projectId
            organization_id: $organizationId
            sitewalk_date: $sitewalkDate
            sitewalk_time: $sitewalkTime
            building_contact: $buildingContact
            building_contact_email: $buildingContactEmail
            building_contact_phone: $buildingContactPhone
            note: $note
        ) {
            id
            organization_id
            project_id
            is_active
            created_at
            updated_at
            status
        }
    }
`;

const GENERATE_SITEWALK_REPORT = gql`
    mutation GenerateSitewalkReport($projectId: String, $organizationId: String) {
        generateSitewalkReport(project_id: $projectId, organization_id: $organizationId)
    }
`;

export {
    SELECT_AS_FINALIST,
    GET_PROJECT_FINALISTS,
    GET_ORGANIZATION_SITEWALK_STATUS,
    INVITE_TO_SITEWALK,
    GENERATE_SITEWALK_REPORT,
};
