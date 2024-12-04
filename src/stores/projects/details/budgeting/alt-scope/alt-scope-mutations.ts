import { gql } from "@apollo/client";

export const CREATE_ALT_SCOPE = gql`
    mutation CreateAltScope($createAltScopePayload: CreateAltScopePayload) {
        renovations: createAltScope(createAltScopePayload: $createAltScopePayload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            workType: work_type
            uom
            location
            qualifier
            manufacturer
            modelNo: model_no
            supplier
            itemNo: item_no
            unitCost: unit_cost
            workId: work_id
            subGroupId: sub_group_id
            inventoryId: inventory_id
        }
    }
`;

export const DELETE_ALT_SCOPE = gql`
    mutation deleteAltScope($project_id: String) {
        deleteAltScope(project_id: $project_id)
    }
`;

export const EDIT_ALT_SCOPE_DEFINITION = gql`
    mutation updateAltScope($updateAltScopePayload: UpdateAltScopePayload) {
        renovations: updateAltScope(updateAltScopePayload: $updateAltScopePayload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            finish
            workType: work_type
            uom
            location
            qualifier
            manufacturer
            modelNo: model_no
            supplier
            itemNo: item_no
            unitCost: unit_cost
            workId: work_id
            inventoryId: inventory_id
            subGroupId: sub_group_id
            renovation_item_project_takeoffs_id
            take_offs {
                fp_id
                take_off_value
            }
        }
    }
`;

export const ADD_ALT_PACKAGE = gql`
    mutation assignAltPackage(
        $packageId: String
        $projectId: String
        $ownershipGroupId: String
        $createdBy: String
    ) {
        altPackages: assignAltPackage(
            package_id: $packageId
            project_id: $projectId
            ownership_group_id: $ownershipGroupId
            created_by: $createdBy
        ) {
            id
            name
            ownership
            location
        }
    }
`;

export const DELETE_ALT_PACKAGE = gql`
    mutation removeAltPackage($projectId: String, $createdBy: String) {
        removeAltPackage(project_id: $projectId, created_by: $createdBy)
    }
`;

export const EDIT_ALT_PACKAGE = gql`
    mutation editAltPackage($projectId: String, $packageId: String) {
        altPackages: editAltPackage(projectId: $projectId, packageId: $packageId) {
            id
            name
            ownership
        }
    }
`;

export const UPDATE_RENOVATIONS = gql`
    mutation UpdateRenoItem($payload: UpdateRenoItemPayload) {
        updateRenoItem(payload: $payload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            workType: work_type
            uom
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
