import { gql } from "@apollo/client";

export const GET_CURRENT_SESSION = gql`
    query GetCurrentSession($projectId: String!, $contractorOrgId: String!) {
        getCurrentSession(project_id: $projectId, contractor_org_id: $contractorOrgId) {
            project_id
            user_id
            organization_id
            session_id
            session_started_at
        }
    }
`;

export const CREATE_NEW_SESSION = gql`
    mutation CreateNewSession($input: SessionInput) {
        createNewSession(input: $input) {
            project_id
            user_id
            organization_id
            session_id
            session_started_at
        }
    }
`;

export const DELETE_CURRENT_SESSION = gql`
    mutation DeleteCurrentSession($projectId: String!, $contractorOrgId: String!) {
        deleteCurrentSession(project_id: $projectId, contractor_org_id: $contractorOrgId)
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($getUserByIdId: String) {
        getUserById(id: $getUserByIdId) {
            id
            name
        }
    }
`;

export const createBidItems = gql`
    mutation createBidItems($input: BidInput) {
        createBidItems(input: $input)
    }
`;

export const getBidItems = gql`
    query GetBidItems(
        $renovationVersion: Int
        $projectId: String!
        $contractorOrgId: String!
        $bidRequestId: String
    ) {
        getBidItems(
            renovation_version: $renovationVersion
            project_id: $projectId
            contractor_org_id: $contractorOrgId
            bid_request_id: $bidRequestId
        ) {
            total_reno_units
            bid_items {
                id
                floor_plan_id
                subgroup_id
                inventory_id
                reno_item_id
                is_unique_price
                default_price
                unique_price
                bid_request_id
                total_price
                price_expression
                specific_uom
                updated_by_user_id
                quantity
                category
                subcategory
                uom
                scope
                work_type
                location
                fp_name
                inventory_name
                total_units
                is_active
                is_deleted
                is_default
                is_combined
                parent_bid_item_id
                sub_group_name
                description
                comments
                finish
                model_no
                manufacturer
                fp_area_uom
                baths_count
                beds_count
                fp_area
                reason
                alt_bid_id
                is_alternate
                type_of_change
                is_ownership_alt
                pc_item_id
                total_take_off_value
                type
                specific_quantity
                is_historical_price
                is_revised_price
                combo_name
                l1_name
                l2_name
                l3_name
                is_historical_price
                is_revised_price
                price_expression
                fp_commercial_name
            }
        }
    }
`;

export const getBidItemsHistory = gql`
    query GetBidItemHistory($bidResponseId: String!, $projectId: String!) {
        getBidItemHistory(bid_response_id: $bidResponseId, project_id: $projectId) {
            total_reno_units
            bid_items {
                id
                floor_plan_id
                subgroup_id
                inventory_id
                reno_item_id
                is_unique_price
                default_price
                unique_price
                bid_request_id
                total_price
                price_expression
                specific_uom
                updated_by_user_id
                quantity
                category
                subcategory
                uom
                scope
                work_type
                location
                fp_name
                inventory_name
                total_units
                is_active
                is_deleted
                is_default
                is_combined
                parent_bid_item_id
                sub_group_name
                description
                finish
                model_no
                manufacturer
                fp_area_uom
                baths_count
                beds_count
                fp_area
                reason
                alt_bid_id
                is_alternate
                type_of_change
                is_ownership_alt
                pc_item_id
                total_take_off_value
                type
                specific_quantity
                is_historical_price
                is_revised_price
                combo_name
                l1_name
                l2_name
                l3_name
                price_expression
                fp_commercial_name
            }
        }
    }
`;

export const updateBidItems = gql`
    mutation updateBidItems($input: [BidItemUpdate!]!) {
        updateBidItems(input: $input) {
            id
            floor_plan_id
            reno_item_id
            is_unique_price
            default_price
            unique_price
            total_price
            specific_uom
            updated_by_user_id
            quantity
            category
            subcategory
            uom
            scope
            work_type
            location
            fp_name
            inventory_name
            total_units
            price_expression
            fp_commercial_name
        }
    }
`;

export const deleteAlternateItems = gql`
    mutation DeleteAlternateBidItem($input: DeleteBidItemInput!) {
        deleteAlternateBidItem(input: $input)
    }
`;

export const createAlternateItems = gql`
    mutation CreateAlternateBidItems($input: CreateAlternateBidItemInput!) {
        createAlternateBidItems(input: $input) {
            id
            floor_plan_id
            reno_item_id
            is_unique_price
            default_price
            unique_price
            bid_request_id
            total_price
            specific_uom
            updated_by_user_id
            quantity
            category
            subcategory
            uom
            scope
            work_type
            location
            fp_name
            inventory_name
            total_units
            is_active
            is_deleted
            is_default
            is_combined
            parent_bid_item_id
            sub_group_name
            description
            finish
            model_no
            manufacturer
            fp_area_uom
            baths_count
            beds_count
            fp_area
            reason
            alt_bid_id
            is_alternate
            is_ownership_alt
            is_historical_price
            is_revised_price
            fp_commercial_name
        }
    }
`;

export const updateAlternateBidItem = gql`
    mutation UpdateAlternateBidItems($input: updateAlternateBidItemInput!) {
        updateAlternateBidItems(input: $input) {
            id
        }
    }
`;

export const COMBINE_LINE_ITEMS = gql`
    mutation CombineLineItems(
        $ids: [String!]!
        $userId: String!
        $projectId: String!
        $comboName: String!
        $uom: String
        $quantityIds: [String]
        $percentage: Float
    ) {
        combineLineItems(
            ids: $ids
            user_id: $userId
            project_id: $projectId
            combo_name: $comboName
            uom: $uom
            quantity_ids: $quantityIds
            percentage: $percentage
        ) {
            id
            floor_plan_id
            reno_item_id
            is_unique_price
            default_price
            unique_price
            bid_request_id
            total_price
            specific_uom
            updated_by_user_id
            quantity
            category
            subcategory
            uom
            scope
            work_type
            location
            fp_name
            inventory_name
            total_units
            is_active
            is_deleted
            is_default
            is_combined
            parent_bid_item_id
            sub_group_name
            description
            finish
            model_no
            manufacturer
            fp_area_uom
            baths_count
            beds_count
            fp_area
            reason
            alt_bid_id
            is_alternate
            type_of_change
            is_ownership_alt
            pc_item_id
            total_take_off_value
            type
            specific_quantity
            is_historical_price
            combo_name
            is_historical_price
            l1_name
            l2_name
            l3_name
            is_revised_price
            fp_commercial_name
        }
    }
`;

export const UNCOMBINE_LINE_ITEMS = gql`
    mutation UncombineLineItems($uncombineLineItemsId: String!, $userId: String!) {
        uncombineLineItems(id: $uncombineLineItemsId, user_id: $userId)
    }
`;

export const UPDATE_UNIT_OF_MEASURE = gql`
    mutation UpdateUom($input: [updateUomInput!]) {
        updateUom(input: $input) {
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
            is_alternate
            is_ownership_alt
            is_unique_price
            default_price
            unique_price
            total_price
            specific_uom
            specific_quantity
            updated_by_user_id
            change_log
            created_at
            updated_at
        }
    }
`;

export const UPDATE_COMBO_NAME = gql`
    mutation UpdateComboName($updateComboNameId: String!, $userId: String!, $comboName: String!) {
        updateComboName(id: $updateComboNameId, user_id: $userId, combo_name: $comboName)
    }
`;

export const GET_HISTORICAL_PRICING = gql`
    query GetBidItemsHistoricalPricing(
        $renovationVersion: Int!
        $projectId: String!
        $contractorOrgId: String!
    ) {
        getBidItemsHistoricalPricing(
            renovation_version: $renovationVersion
            project_id: $projectId
            contractor_org_id: $contractorOrgId
        ) {
            pc_item_id
            historical_prices {
                project_id
                unit_price
                uom
                is_finalist
                submitted_on
                ownership_group_id
                project_name
                ownership_org_name
                street_address
                city
                state
                zipcode
                project_type
            }
        }
    }
`;
