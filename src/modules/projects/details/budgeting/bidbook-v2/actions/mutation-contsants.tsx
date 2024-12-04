import { gql } from "@apollo/client";

export const UPDATE_INVENTORY_DETAILS = gql`
    mutation UpdateInventoryDetails($payload: UpdateInventoryDetailsPayload) {
        updateInventoryDetails(payload: $payload) {
            project_id
            name
            id
            description
            base_scope_id
            package_id
        }
    }
`;

export const UPDATE_UNIT_MIX_DETAILS = gql`
    mutation UpdateUnitMix($input: UnitMixInput) {
        updateUnitMix(input: $input) {
            error
            success
        }
    }
`;

export const CREATE_UNIT_MIX_DETAILS = gql`
    mutation CreateUnitMix($input: CreateUnitMixInput) {
        createUnitMix(input: $input) {
            id
            project_id
            inventory_id
            property_unit_id
            floor
            is_renovated
            is_active
            system_remarks
        }
    }
`;

export const CREATE_FLOOR_PLAN_ITEM = gql`
    mutation CreateFloorPlan($input: FloorPlanCreateInput) {
        createFloorPlan(input: $input) {
            area
            baths_per_unit
            beds_per_unit
            name
        }
    }
`;

export const CREATE_INVENTORY_ITEM = gql`
    mutation UpdateInventoryMix($updateInventoryMix: UpdateInventoryMixInput) {
        updateInventoryMix(update_inventory_mix: $updateInventoryMix) {
            error
        }
    }
`;
export const CREATE_RENO_ITEM = gql`
    mutation CreateRenoItem($payload: CreateRenoItemPayload) {
        createRenoItem(payload: $payload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            workType: work_type
            uom
            pc_item_id
            location
            qualifier
            manufacturer
            modelNo: model_no
            supplier
            itemNo: item_no
            subGroupId: sub_group_id
            unitCost: unit_cost
            workId: work_id
            inventoryId: inventory_id
            projectCodexIdDerivedFrom: project_codex_id_derived_from
            renovation_item_project_takeoffs_id
            take_offs {
                fp_id
                take_off_value
            }
            price_floor_plan {
                floor_plan_id
                price
            }
        }
    }
`;
export const UPDATE_FLOOR_PLAN_DETAILS = gql`
    mutation UpdateFloorPlan($input: FloorPlanUpdateInput) {
        updateFloorPlan(input: $input) {
            name
            beds_per_unit
            baths_per_unit
            area
            id
        }
    }
`;

export const UPDATE_RENOVATIONS = gql`
    mutation UpdateRenoItem($payload: [UpdateRenoItemPayload]) {
        updateRenoItem(payload: $payload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            comments
            finish
            workType: work_type
            uom
            pc_item_id
            location
            qualifier
            manufacturer
            modelNo: model_no
            supplier
            itemNo: item_no
            subGroupId: sub_group_id
            unitCost: unit_cost
            workId: work_id
            inventoryId: inventory_id
            projectCodexIdDerivedFrom: project_codex_id_derived_from
            renovation_item_project_takeoffs_id
            take_offs {
                fp_id
                take_off_value
            }
            price_floor_plan {
                floor_plan_id
                price
            }
            is_active
            l1_name
            l2_name
            l3_name
        }
    }
`;
export const GET_LATEST_RENOVATION_VERSION = gql`
    query LatestRenovationVersion($projectId: String) {
        latestRenovationVersion(project_id: $projectId) {
            renovation_version
            created_at
        }
    }
`;

export const CREATE_RENOVATION_VERSION = gql`
    mutation CreateRenovationVersion(
        $createRenovationVersionPayload: createRenovationVersionPayload
    ) {
        createRenovationVersion(createRenovationVersionPayload: $createRenovationVersionPayload) {
            id
            project_id
            renovation_version
        }
    }
`;
export const CREATE_EXH_A = gql`
    mutation CreateExhADocument($projectId: String, $bidType: BidType) {
        createExhADocument(project_id: $projectId, bid_type: $bidType) {
            message
        }
    }
`;
export const GET_VERSIONED_DATA = gql`
    query RenovationVersion($projectId: String, $version: Int) {
        renovationVersion(project_id: $projectId, version: $version) {
            id
            project_id
            renovation_version
            all_renovation_items {
                alt_scope {
                    id
                    category
                    item
                    pc_item_id
                    scope
                    subcategory
                    component
                    image_url
                    description
                    finish
                    workType: work_type
                    uom
                    location
                    qualifier
                    manufacturer
                    subGroupId: sub_group_id
                    modelNo: model_no
                    supplier
                    item_no
                    unitCost: unit_cost
                    work_id
                    inventoryId: inventory_id
                    project_codex_id_derived_from
                    renovation_item_project_takeoffs_id
                    take_offs {
                        fp_id
                        take_off_value
                    }
                    type_of_change
                    price_floor_plan {
                        floor_plan_id
                        price
                    }
                    l1_name
                    l2_name
                    l3_name
                }
                base_scope {
                    id
                    category
                    item
                    pc_item_id
                    scope
                    subcategory
                    component
                    image_url
                    description
                    finish
                    workType: work_type
                    uom
                    location
                    qualifier
                    manufacturer
                    subGroupId: sub_group_id
                    modelNo: model_no
                    supplier
                    item_no
                    unitCost: unit_cost
                    work_id
                    inventoryId: inventory_id
                    project_codex_id_derived_from
                    renovation_item_project_takeoffs_id
                    take_offs {
                        fp_id
                        take_off_value
                    }
                    type_of_change
                    price_floor_plan {
                        floor_plan_id
                        price
                    }
                    l1_name
                    l2_name
                    l3_name
                }
                flooring_scope {
                    id
                    category
                    item
                    pc_item_id
                    scope
                    subcategory
                    component
                    image_url
                    description
                    finish
                    workType: work_type
                    uom
                    location
                    qualifier
                    manufacturer
                    subGroupId: sub_group_id
                    modelNo: model_no
                    supplier
                    item_no
                    unitCost: unit_cost
                    work_id
                    inventoryId: inventory_id
                    project_codex_id_derived_from
                    renovation_item_project_takeoffs_id
                    take_offs {
                        fp_id
                        take_off_value
                    }
                    type_of_change
                    price_floor_plan {
                        floor_plan_id
                        price
                    }
                    l1_name
                    l2_name
                    l3_name
                }
            }

            change_log {
                alt_renovation_change_log {
                    change_log {
                        id
                        reno_item_diff
                        type_of_change
                    }
                }
                base_renovation_change_log {
                    change_log {
                        id
                        reno_item_diff
                        type_of_change
                    }
                }
                flooring_renovation_change_log {
                    change_log {
                        id
                        reno_item_diff
                        type_of_change
                    }
                }
            }
            created_by
            created_at
            updated_at
        }
    }
`;

export const GET_PROJECT_ITEMS = gql`
    query GetProjectContainer($input: GetProjectContainer) {
        getProjectContainer(input: $input) {
            item
            project_codex_id
            category
            work_type
            created_at
            container_item_id
            id
            project_id
            scope
            subcategory
            location
            updated_at
            scope_list {
                scope
                pc_item_id
            }
        }
    }
`;
