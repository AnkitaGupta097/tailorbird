import { gql } from "@apollo/client";

export const GET_UNIT_SCOPES = gql`
    query GetUnitScopes($renoUnitId: String) {
        getUnitScopes(reno_unit_id: $renoUnitId) {
            id
            is_active
            reno_unit_id
            system_remarks
            started_at
            ended_at
            last_price
            updated_at
            project_id
            created_at
            scope
            status
            start_price
            price
            scope_approval_id
            renovation_start_date
            renovation_end_date
            material_price
            labor_price
            material_and_labor_price
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
            items {
                id
                category
                project_id
                floor_plan_id
                scope
                bid_item_id
                contractor_org_id
                inventory_id
                item
                work_type
                parent_bid_item_id
                price
                pricing_group_id
                takeoff_value
                status
                scope_approval_id
                uom
                percent_contrib_to_scope_total
                total_price
                start_price
                last_price
                manufacturer
                model_number
                description
                groups {
                    id
                    category
                    project_id
                    floor_plan_id
                    scope
                    bid_item_id
                    contractor_org_id
                    inventory_id
                    item
                    work_type
                    parent_bid_item_id
                    start_price
                    price
                    last_price
                    pricing_group_id
                    takeoff_value
                    status
                    uom
                    manufacturer
                    model_number
                    description
                }
            }
        }
    }
`;

export const UPDATE_UNIT_SCOPE = gql`
    mutation UpdateRenovationUnitScope(
        $scopeId: Int
        $status: String
        $renovation_start_date: String
        $renovation_end_date: String
        $remark: String
        $attachments: [Int]
        $material_price: Float
        $labor_price: Float
        $material_and_labor_price: Float
    ) {
        updateRenovationUnitScope(
            scope_id: $scopeId
            status: $status
            renovation_start_date: $renovation_start_date
            renovation_end_date: $renovation_end_date
            remark: $remark
            attachments: $attachments
            material_price: $material_price
            labor_price: $labor_price
            material_and_labor_price: $material_and_labor_price
        ) {
            id
            is_active
            reno_unit_id
            system_remarks
            started_at
            ended_at
            last_price
            updated_at
            project_id
            created_at
            scope
            status
            start_price
            price
            scope_approval_id
            renovation_start_date
            renovation_end_date
            material_price
            labor_price
            material_and_labor_price
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
        }
    }
`;

export const GET_SCOPE = gql`
    query GetUnitScope($unitScopeId: Int) {
        getUnitScope(unit_scope_id: $unitScopeId) {
            id
            is_active
            reno_unit_id
            system_remarks
            started_at
            ended_at
            last_price
            updated_at
            project_id
            created_at
            scope
            status
            start_price
            price
            scope_approval_id
            renovation_start_date
            renovation_end_date
            material_price
            labor_price
            material_and_labor_price
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
            items {
                id
                category
                project_id
                floor_plan_id
                scope
                bid_item_id
                contractor_org_id
                inventory_id
                scope_approval_id
                item
                work_type
                parent_bid_item_id
                start_price
                percent_contrib_to_scope_total
                price
                total_price
                last_price
                pricing_group_id
                takeoff_value
                status
                manufacturer
                model_number
                description
                groups {
                    id
                    category
                    project_id
                    floor_plan_id
                    scope
                    bid_item_id
                    contractor_org_id
                    inventory_id
                    item
                    work_type
                    parent_bid_item_id
                    start_price
                    price
                    last_price
                    pricing_group_id
                    takeoff_value
                    status
                    uom
                    manufacturer
                    model_number
                    description
                }
                uom
            }
        }
    }
`;

export const CHANGE_REQUEST = gql`
    mutation UpdateRenovationUnitScopeItem(
        $scopeItemId: Int
        $price: Float
        $uom: String
        $takeoff_value: Float
        $total_price: Float
        $remark: String
        $attachments: [Int]
    ) {
        updateRenovationUnitScopeItem(
            scope_item_id: $scopeItemId
            price: $price
            uom: $uom
            takeoff_value: $takeoff_value
            total_price: $total_price
            remark: $remark
            attachments: $attachments
        ) {
            id
            category
            project_id
            floor_plan_id
            scope
            bid_item_id
            contractor_org_id
            inventory_id
            item
            scope_approval_id
            work_type
            parent_bid_item_id
            start_price
            price
            last_price
            pricing_group_id
            takeoff_value
            status
            percent_contrib_to_scope_total
            total_price
            uom
        }
    }
`;

export const DEACTIVATE_SCOPE_ITEM = gql`
    mutation DeActivateUnitScopeItems($deActivateUnitScopeItemsId: Int, $renoUnitIds: [String]) {
        deActivateUnitScopeItems(id: $deActivateUnitScopeItemsId, reno_unit_ids: $renoUnitIds)
    }
`;

export const ACTIVATE_SCOPE_ITEM = gql`
    mutation ActivateUnitScopeItems($activateUnitScopeItemsId: Int, $renoUnitIds: [String]) {
        activateUnitScopeItems(id: $activateUnitScopeItemsId, reno_unit_ids: $renoUnitIds)
    }
`;

export const DEACTIVATE_PRICING_GROUP = gql`
    mutation DeActivatePricingGroups($deActivatePricingGroupsId: Int, $renoUnitIds: [String]) {
        deActivatePricingGroups(id: $deActivatePricingGroupsId, reno_unit_ids: $renoUnitIds)
    }
`;

export const ACTIVATE_PRICING_GROUP = gql`
    mutation ActivatePricingGroups($activatePricingGroupsId: Int, $renoUnitIds: [String]) {
        activatePricingGroups(id: $activatePricingGroupsId, reno_unit_ids: $renoUnitIds)
    }
`;

export const UPDATE_PRICING_GROUP = gql`
    mutation UpdateItemPricingGroup(
        $price: Float
        $pricingGroupId: Int
        $items: [PricingGroupItem]
        $remark: String
        $attachments: [Int]
    ) {
        updateItemPricingGroup(
            price: $price
            pricing_group_id: $pricingGroupId
            items: $items
            remark: $remark
            attachments: $attachments
        ) {
            status
            scope_approval_id
        }
    }
`;

export const START_SCOPES = gql`
    mutation StartRenovationUnitScopes($scopeIds: [Int]!, $renoUnitId: String!) {
        startRenovationUnitScopes(scope_ids: $scopeIds, reno_unit_id: $renoUnitId)
    }
`;

export const MARK_AS_COMPLETE_SCOPES = gql`
    mutation MarkRenovationUnitScopesAsComplete(
        $scopeIds: [Int]!
        $remark: String
        $attachments: [Int]
        $renoUnitId: String!
    ) {
        markRenovationUnitScopesAsComplete(
            scope_ids: $scopeIds
            remark: $remark
            attachments: $attachments
            reno_unit_id: $renoUnitId
        )
    }
`;

export const ADD_UNIT_SCOPE_ITEM = gql`
    mutation AddRenovationUnitScopeItem(
        $unitScopeId: Int
        $name: String
        $workType: String
        $renoUnitIds: [String]
        $projectId: String
        $spec: String
        $takeOffValue: Float
        $uom: String
        $priceType: String
        $price: Float
        $remark: String
        $attachments: [Int]
    ) {
        addRenovationUnitScopeItem(
            unit_scope_id: $unitScopeId
            name: $name
            work_type: $workType
            reno_unit_ids: $renoUnitIds
            project_id: $projectId
            spec: $spec
            take_off_value: $takeOffValue
            uom: $uom
            price_type: $priceType
            price: $price
            remark: $remark
            attachments: $attachments
        ) {
            id
            category
            project_id
            floor_plan_id
            scope
            bid_item_id
            contractor_org_id
            inventory_id
            item
            work_type
            parent_bid_item_id
            start_price
            price
            last_price
            pricing_group_id
            manufacturer
            model_number
            description
            takeoff_value
            status
            uom
            renovation_start_date
            renovation_end_date
            total_price
            scope_approval_id
            percent_contrib_to_scope_total
        }
    }
`;
