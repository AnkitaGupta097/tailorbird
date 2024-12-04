import { gql } from "@apollo/client";

export const GET_APPROVALS = gql`
    query GetUnitApprovals(
        $projectId: String
        $isReviewed: Boolean
        $approvalType: [String]
        $unitStatus: [String]
    ) {
        getUnitApprovals(
            project_id: $projectId
            is_reviewed: $isReviewed
            approval_type: $approvalType
            unit_status: $unitStatus
        ) {
            id
            unit_name
            count
            approval_ids
            status
            renovation_start_date
            general_contractor
            subs {
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
            unit_stats {
                reno_unit_id
                completed_work
                total_work
            }
        }
    }
`;
