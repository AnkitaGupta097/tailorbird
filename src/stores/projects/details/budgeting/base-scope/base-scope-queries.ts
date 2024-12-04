import { gql } from "@apollo/client";

export const GET_ALL_BASE_SCOPE_DETAILS = gql`
    query getBaseScopeDetails($project_id: String, $scope_id: String) {
        baseScopeDetails: selectedScopes(project_id: $project_id, scope_id: $scope_id) {
            name
            items {
                name
                excluded
                component
                scopes {
                    name
                    isBase: is_base
                }
            }
        }
    }
`;

export const GET_INVENTORY_DETAILS = gql`
    query InventoryDetails($inventoryDetailsId: String) {
        baseScopeDetails: inventoryDetails(id: $inventoryDetailsId) {
            id
            name
            summary
            baseScopeId: base_scope_id
            items {
                name
                excluded
                component
                scopes {
                    name
                    isBase: is_base
                }
            }
        }
    }
`;

export const GET_ALL_INVENTORIES = gql`
    query Inventories($projectId: String) {
        inventories(project_id: $projectId) {
            id
            projectId: project_id
            name
            description
            baseScopeId: base_scope_id
        }
    }
`;

export const GET_RENOVATION_ITEMS = gql`
    query getRenovations($project_id: String) {
        renovations: renovations(project_id: $project_id) {
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
            projectCodexIdDerivedFrom: project_codex_id_derived_from
        }
    }
`;

export const GET_DATA_SOURCE_NEW_ITEMS = gql`
    query Query($projectId: String) {
        getDataSourceNewItems(project_id: $projectId) {
            id
            item_name
            project_id
            datasource_file_id
            created_at
            created_by
            item_id
            scopes
            work_package
            category
            uom
        }
    }
`;

export const CREATE_NEW_ITEM = gql`
    mutation CreateNewItem($input: NewItemInput) {
        createNewItem(input: $input) {
            cu_cc
            id
            date_updated
            category
            work_type
            tb_cc
            codex
            subcategory
            notes
            date_created
            is_active
            updated_by
            item
            scope_item
            version
            location
        }
    }
`;

export const CREATE_SKU_MATERIAL = gql`
    mutation Mutation($input: UpdatePackageInput) {
        updatePackage(input: $input) {
            package_id
        }
    }
`;

export const GET_BASE_SCOPE_ITEMS = gql`
    query getBaseScope($project_id: String) {
        renovations: baseScope(project_id: $project_id) {
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
            l1_name
            l2_name
            l3_name
        }
    }
`;

export const GET_ALL_FLOORPLAN_COSTS = gql`
    query floorplanCost($renovationId: String) {
        floorplanCosts: floorplanCost(renovation_id: $renovationId) {
            id
            name
            type
            uom
            quantity
            price
        }
    }
`;
// TODO: Use This new Query
export const GET_ALL_MATERIAL_OPTIONS = gql`
    query Materials($input: PackageSearchFilterInput) {
        getMaterials(input: $input) {
            materialId: id
            category
            subcategory
            manufacturer
            modelNo: model_id
            is_adhoc
            description
            high_price
            unitCost: ref_price
            low_price
            uom
            ccCode: cost_code
            style
            grade
            finish
            url
            primary_thumbnail
            created_by
            dateCreated: created_at
            updated_by
            updated_at
            suppliers {
                supplier_id: id
                supplier_name: supplier
                sku_id
                is_adhoc
                ref_price
                uom
                url
                primary_thumbnail
                created_by
                created_at
                updated_by
                updated_at
            }
        }
    }
`;

export const GET_ALL_LABOR_OPTIONS = gql`
    query getLabors($input: PackageSearchFilterInput) {
        materialOptions: getLabors(input: $input) {
            unitCost: ref_price
            laborId: id
            location
            category
            subcategory
            uom
            description
            dateCreated: created_at
            dateUpdated: updated_at
        }
    }
`;

export const GET_ALL_MATERIALS_FOR_SEARCH = gql`
    query materialsForSearch($search_text: String) {
        materialsForSearch: materialsForSearch(search_text: $search_text) {
            id
            imageUrl: image_url
            name
            price
        }
    }
`;
// uom
export const GET_EDIT_BASE_SCOPE_DETAILS = gql`
    query baseScopeDetails($inventoryDetailsId: String) {
        baseScopeDetails: inventoryDetails(id: $inventoryDetailsId) {
            id
            name
            summary
            baseScopeId: base_scope_id
            data {
                name
                items {
                    name
                    excluded
                    scopes {
                        name
                        isBase: is_base
                    }
                    component
                }
            }
        }
    }
`;
