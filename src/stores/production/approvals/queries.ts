import { gql } from "@apollo/client";

export const GET_UNIT_SCOPE_APPROVALS = gql`
    query GetUnitScopeApprovals($renoUnitId: String, $isReviewed: Boolean) {
        getUnitScopeApprovals(reno_unit_id: $renoUnitId, is_reviewed: $isReviewed) {
            id
            reno_unit_id
            unit_scope_item_id
            unit_scope_id
            created_at
            updated_at
            status
            requestor_id
            requestee_id
            requestor_remark
            requestee_remark
            is_active
            request_type
            requestor_org_id
            requestee_org_id
            requestee_attachments
            requestor_attachments
            change_data
            current_data
            pricing_group_id
            unit_scope_name
            unit_scope_status
            item_category
            item_name
            requestor_org {
                id
                name
                organization_type
            }
            requestee_org {
                id
                name
                organization_type
            }
            requestor_user {
                id
                organization_id
                name
            }
            requestee_user {
                id
                organization_id
                name
            }
            scope
        }
    }
`;

export const REVIEW_APPROVAL = gql`
    mutation ReviewApprovals(
        $scopeApprovalIds: [Int]
        $reviewStatus: String
        $reviewerAttachments: [Int]
        $reviewerRemarks: String
    ) {
        reviewApprovals(
            scope_approval_ids: $scopeApprovalIds
            review_status: $reviewStatus
            reviewer_attachments: $reviewerAttachments
            reviewer_remarks: $reviewerRemarks
        )
    }
`;
