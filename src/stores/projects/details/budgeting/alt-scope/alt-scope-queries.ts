import { gql } from "@apollo/client";

export const GET_ALT_PACKAGE = gql`
    query getAltPackage($project_id: String) {
        altPackages: altPackage(project_id: $project_id) {
            id
            name
            ownership
            location
        }
    }
`;

export const GET_ALT_PACKAGES = gql`
    query AltPackages($ownershipGroupId: String, $containerVersion: String) {
        packages: altPackages(
            ownership_group_id: $ownershipGroupId
            container_version: $containerVersion
        ) {
            id
            name
            ownership
            location
        }
    }
`;

export const GET_SCOPE_TREE_FOR_ALT_SCOPE = gql`
    query ScopeTree($project_id: String) {
        scopeTree: scopeTree(project_id: $project_id) {
            name
            items {
                name
                excluded
                scopes {
                    name
                    baseInventory: base_inventory
                }
            }
        }
    }
`;

export const GET_ALT_SCOPE_EDIT_TREE = gql`
    query scopeTree($project_id: String) {
        scopeTree: altScopeTreeForEdit(project_id: $project_id) {
            name
            items {
                name
                excluded
                scopes {
                    name
                    baseInventory: base_inventory
                    isSelected: is_selected
                    isAltSku: is_alt_sku
                }
            }
        }
    }
`;

export const GET_ALT_SCOPE = gql`
    query AltScope($projectId: String) {
        renovations: altScope(project_id: $projectId) {
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
