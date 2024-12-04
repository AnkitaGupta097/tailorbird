import { gql } from "@apollo/client";

export const UPDATE_PROJECT_STATUS = gql`
    mutation UpdateProjectStatus($input: ProjectStatusRequest) {
        updateProjectStatus(input: $input) {
            created_at
            created_by
            project_id
            status
        }
    }
`;

export const SEND_RENO_WIZARD_ADDITIONAL_SUPPORT_EMAIL = gql`
    mutation SendRenoWizardAdditionalSupportEmail($project_id: String) {
        sendRenoWizardAdditionalSupportEmail(project_id: $project_id)
    }
`;

export const GET_PROJECTS_WITH_FILTER = gql`
    query getProjectsWithFilters($filters: [ProjectFiltersInput]) {
        getProjectsWithFilters(ProjectFilters: $filters) {
            projects {
                id
                name
                city
                state
                street_address
                ownership_group_id
                ownership_group_name
                project_type
                status
                created_at
            }
            filters {
                name
                parent
                order
                filter_values {
                    value
                    count
                }
            }
        }
    }
`;

export const GET_RENOVATION_ITEMS = gql`
    query getBaseScope($project_id: String, $is_active: Boolean) {
        renovations: baseScope(project_id: $project_id, is_active: $is_active) {
            id
            category
            item
            scope
            subcategory
            image_url
            description
            work_type
            uom
            pc_item_id
            location
            qualifier
            manufacturer
            model_no
            supplier
            item_no
            sub_group_id
            unit_cost
            work_id
            inventory_id
            project_codex_id_derived_from
            is_demand_user_created
            is_active
            is_hidden
            notes
            mark_only_as_needed
        }
    }
`;

export const GET_PROJECT_CONTAINER = gql`
    query GetProjectContainer($input: GetProjectContainer) {
        getProjectContainer(input: $input) {
            item
            category
            work_type
            container_item_id
            id
            project_id
            scope
            subcategory
            location
            project_codex_id
        }
    }
`;

export const GET_PROJECT_CODICES = gql`
    query GetProjectCodices($input: GetProjectCodices) {
        getProjectCodices(input: $input) {
            uom
            location
            project_id
            is_default
            updated_at
            is_active
            codex
            id
            qualifier
            system_computed
            created_at
            selected_at
            derived_from
            quantity
        }
    }
`;

export const GET_PROJECT_BASE_PACKAGE = gql`
    query GetBasePackage($input: BasePackageSearchInput) {
        getBasePackage(input: $input) {
            project_id
            package_id
            ownership_group_id
            ownership_group_name
            derived_from
        }
    }
`;

export const GET_PACKAGE_BY_ID = gql`
    query GetPackage($input: String) {
        getPackage(input: $input) {
            material_id: id
            name
            description
            user_id
            materials {
                name
                material_id: id
                category
                subcategory
                manufacturer
                model_id
                description
                uom
                style
                grade
                finish
                url
                primary_thumbnail
                suppliers {
                    supplier_id: id
                    supplier_name: supplier
                    sku_id
                    uom
                    url
                }
            }
            labor {
                labor_id: id
                location
                category
                subcategory
                uom
                ref_price
                cost_code
                description
            }
        }
    }
`;

export const CREATE_RENO_ITEMS_FROM_EXISTING_PROJECT = gql`
    mutation createRenovationSetupForExistingUser(
        $payload: createRenovationSetupForExistingUserPayload
    ) {
        createRenovationSetupForExistingUser(payload: $payload) {
            project_id
            package_id
            updated_at
            ownership_group_id
            ownership_group_name
            user_id
            created_by
            created_at
            derived_from
        }
    }
`;

export const UPDATE_MULTIPLE_RENO_ITEMS = gql`
    mutation UpdateMultipleRenoItems($payload: [UpdateRenoItemPayload]) {
        updateRenoItem(payload: $payload) {
            id
            category
            item
            scope
            subcategory
            image_url
            description
            work_type
            uom
            pc_item_id
            location
            qualifier
            manufacturer
            model_no
            supplier
            itemNo: item_no
            sub_group_id
            unit_cost
            work_id
            inventory_id
            project_codex_id_derived_from
            is_demand_user_created
            is_active
            is_hidden
            notes
            mark_only_as_needed
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
            image_url
            description
            work_type
            uom
            pc_item_id
            location
            qualifier
            manufacturer
            model_no
            supplier
            item_no
            sub_group_id
            unit_cost
            workId: work_id
            inventory_id
            project_codex_id_derived_from
            is_demand_user_created
            is_active
            is_hidden
            notes
            mark_only_as_needed
        }
    }
`;

export const ADD_NEW_MATERIAL_ITEM = gql`
    mutation addNewMaterialItem($input: [AddMaterial]) {
        addNewMaterialItem(input: $input) {
            material_id: id
            name
            category
            subcategory
            manufacturer
            model_id
            is_adhoc
            description
            high_price
            ref_price
            low_price
            uom
            cost_code
            style
            grade
            finish
            url
            primary_thumbnail
            created_by
            created_at
            updated_by
            updated_at
            suppliers {
                supplier_id: id
                supplier_name: supplier
                sku_id
                uom
                url
            }
        }
    }
`;
