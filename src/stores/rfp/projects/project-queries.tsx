import { gql } from "@apollo/client";
export const getProjectsAvailableToUser = gql`
    query GetProjectsAvailableToUser(
        $userId: String
        $rfpProjectVersion: String
        $organizationId: String
    ) {
        getProjectsAvailableToUser(
            user_id: $userId
            rfp_project_version: $rfpProjectVersion
            organization_id: $organizationId
        ) {
            project_name
            project_id
            folder_url
            bidbook_url
            bid_status
            address
            property_type
            ownership_group_name
            organization_id
            billing_opportunity_id
            bid_percentage
            bid_due_date
            rfp_project_version
            rfp_bid_details
            property_images {
                cdn_path
                name
                download_link
            }
            management
            management_url
            submitted_on
            max_bidders
            is_restricted_max_bidders
            available_bidding_slots
        }
    }
`;

export const GET_BID_REQUEST_BY_PROJECT = gql`
    query GetBidRequestByProject($projectId: String!, $contractorOrgId: String, $type: String) {
        getBidRequestByProject(
            project_id: $projectId
            contractor_org_id: $contractorOrgId
            type: $type
        ) {
            id
            project_id
            type
            contractor_org_id
            reno_item_version
            description
            is_accepted
            created_by
            created_at
            revision_version
            bid_items_status
            agreement_metadata {
                work_type
                categories
                floor_inv_subgroups
                total_agreement_cost
            }
            saved_at
            bid_response_id
        }
    }
`;

export const GET_BID_REQUEST_BY_ID = gql`
    query GetBidRequestById($id: String!) {
        getBidRequestById(id: $id) {
            id
            project_id
            type
            contractor_org_id
            reno_item_version
            bid_items_status
        }
    }
`;

export const ACCEPT_BID_REQUEST = gql`
    mutation Mutation($Id: String!, $respondedBy: String!) {
        acceptBidRequestById(id: $Id, responded_by: $respondedBy) {
            status
        }
    }
`;

export const GET_BID_RESPONSE = gql`
    query GetBidResponse($projectId: String!, $contractorOrgId: String!) {
        getBidResponse(project_id: $projectId, contractor_org_id: $contractorOrgId) {
            id
            bid_request_id
            project_id
            contractor_org_id
            reno_item_version
            is_submitted
            submitted_by
            version
        }
    }
`;

export const CREATE_BID_RESPONSE = gql`
    mutation CreateBidResponse($input: BidResponseInput) {
        createBidResponse(input: $input) {
            id
            bid_request_id
            project_id
            contractor_org_id
            reno_item_version
            is_submitted
            submitted_by
        }
    }
`;

export const ACCEPT_OR_DECLINE_BID = gql`
    mutation AcceptOrDeclineBid($input: AcceptBidInput) {
        acceptOrDeclineBid(input: $input) {
            status
            description
        }
    }
`;

export const getBidLevelingData = gql`
    query Query($project_id: String!) {
        getBidLevelingData(project_id: $project_id) {
            contractor_org_id
            bid_items {
                id
                bid_request_id
                type
                is_active
                is_deleted
                is_default
                is_combined
                parent_bid_item_id
                project_id
                contractor_org_id
                floor_plan_id
                subgroup_id
                inventory_id
                reno_item_id
                is_unique_price
                default_price
                unique_price
                total_price
                specific_uom
                specific_quantity
                is_ownership_alt
                description
                manufacturer
                model_no
                reason
                created_by
                select
                gc_name
                gc_email
                category
                location
                scope
                item
                subcategory
                work_type
                inv_name
                cost_code
                uom
                quantity
                total_reno_units
                price
                floorplan_name
                area
                total_floorplan_units
                weighted_floorplan_price
                weighted_unit_price
                total_inventory_count
                weighted_inventory_price
                agg_price
                tab_name
                unit_qty
                flooring_weighted_unit_price
                flooring_weighted_inventory_price
                flooring_total_reno_units
                flooring_total_inventory_units
                alt_or_base
            }
        }
    }
`;
