import { gql } from "@apollo/client";
export const GetProjectScopeCmsData = gql`
    query getProjectScopeCmsData {
        getProjectScopeCmsData {
            scope_options {
                id
                Title
                type
                isSubScopeOPtion
                hasSubScopeOption
                items {
                    id
                    dipaly_name
                    subOptionsMainTitle
                    inputType
                    type
                    isSelectable
                    priority
                    has_subitem
                    options {
                        label
                        value
                    }
                    mapper_type_options
                    mapper_type
                    isRightAligned
                    isTitleSmallCase
                }
            }
            DesignStyles {
                name
                description
                mainImage {
                    url
                }
                photos {
                    url
                }
                subOptions {
                    name
                    images {
                        url
                    }
                    description
                    type
                    mainImage {
                        url
                    }
                }
            }
        }
    }
`;
export const GetProjectScopeData = gql`
    query getProjectScopeData($id: ID) {
        getProjectScopeData(id: $id) {
            DATA {
                _id
                name
                style_name
                org_id
                user_id
                scope_v1_data
                version
                scope_post_version_v1_data
                scope_category {
                    key
                    section {
                        key
                        selected_activity
                        activity {
                            key
                            labor
                            ui_tag_values
                            material {
                                subcategory
                                tag_group
                                tags {
                                    key
                                    value
                                }
                            }
                        }
                    }
                }
                scope_collection_items {
                    _id
                    scope_type
                    is_selected
                    scope_items {
                        _id
                        name
                        is_selected
                        scope_type
                        sub_items {
                            _id
                            key
                            value
                        }
                    }
                }
                metadata {
                    estimated_cost
                    value_increase
                    timeline
                    description
                    summary
                    notes
                }
                design_style {
                    name
                    notes
                    selected_kitchen {
                        name
                        images {
                            url
                        }
                    }
                    selected_bathroom {
                        name
                        images {
                            url
                        }
                    }
                }
            }
        }
    }
`;

export const CreateProjectScope = gql`
    mutation createProjectScope($input: ProjectScopeCollectionInput) {
        createProjectScope(input: $input) {
            STATUS
            MESSAGE
            DATA {
                _id
            }
        }
    }
`;

export const GET_FLOORPLAN_BY_ID = gql`
    query getProjectFloorPlanById($floor_plan_id: String) {
        getProjectFloorPlanById(floor_plan_id: $floor_plan_id) {
            uuid
            name
            units_count
            total_units_count
            scope_id
            bathrooms_per_unit
            bedrooms_per_unit
            area_per_unit
            measuring_units
            bid_id
            photo_images
        }
    }
`;

export const UpdateProjectScope = gql`
    mutation updateProjectScope($input: ProjectScopeCollectionInput) {
        updateProjectScope(input: $input) {
            STATUS
            MESSAGE
            DATA {
                _id
            }
        }
    }
`;
export const AddB2BProject = gql`
    mutation addB2BProject($input: B2BProjectDataInput) {
        addB2BProject(input: $input) {
            _id
        }
    }
`;

export const CreatePackage = gql`
    mutation createPackage($input: PackageInput) {
        createPackage(input: $input) {
            package_id
        }
    }
`;

export const DeletePackage = gql`
    mutation deletePackage($input: String) {
        deletePackage(input: $input) {
            message
            logs {
                info
                warnings
            }
        }
    }
`;
export const UpdatePackage = gql`
    mutation UpdatePackage($input: UpdatePackageInput) {
        updatePackage(input: $input) {
            package_id
        }
    }
`;

export const GetAllPackages = gql`
    query getPackages {
        getPackages {
            package_id: id
            name
            description
            ownership_group_id
            ownership_group_name
            user_id
            created_by
            date_created: created_at
            scraper_job_id
            is_standard
            updated_by
            date_updated: updated_at
            last_used
        }
    }
`;

export const GetPackageByID = gql`
    query getPackage($input: String) {
        getPackage(input: $input) {
            package_id
            description
            msa
            package_type
            work_type
            material_items
            labor_items
        }
    }
`;

export const GetMaterialsByPackageNames = gql`
    query getMaterialsByPackageNames($names: [String]) {
        getMaterialsByPackageNames(names: $names) {
            material_id
            category
            subcategory
            location
            package_name
            rfp_item
            description
            manufacture
            model_number
            ref_price
            uom
        }
    }
`;

export const GetMaterials = gql`
    query Materials($input: PackageSearchFilterInput) {
        getMaterials(input: $input) {
            material_id: id
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

export const GetLabors = gql`
    query getLabors($input: PackageSearchFilterInput) {
        getLabors(input: $input) {
            labor_id: id
            location
            category
            subcategory
            uom
            ref_price
            cost_code
            description
            created_by
            date_created: created_at
            updated_by
            date_updated: updated_at
        }
    }
`;

export const EditB2BProject = gql`
    mutation editB2BProject($input: B2BProjectDataInput) {
        editB2BProject(input: $input) {
            _id
        }
    }
`;
export const GenerateBid = gql`
    mutation generateBid($input: generateBidInput) {
        generateBid(input: $input) {
            message
            AWS_Path
            logs {
                warnings
                info
                errors
            }
        }
    }
`;
export const generateC2 = gql`
    mutation generateC2($input: generateBidInput) {
        generateC2(input: $input) {
            message
            AWS_Path
            logs {
                warnings
                info
                errors
            }
        }
    }
`;

export const GetBidGenerationUrls = gql`
    query getBidGenerationUrls($id: String) {
        getBidGenerationUrls(id: $id) {
            urls
        }
    }
`;

export const DeleteB2BProject = gql`
    mutation deleteB2BProject($project_id: ID) {
        deleteB2BProject(project_id: $project_id) {
            DATA {
                deletedCount
            }
        }
    }
`;

export const RevertProjectState = gql`
    mutation revertProjectState($project_id: String) {
        revertProjectState(project_id: $project_id) {
            _id
            userData {
                name
                id
            }
            org_id
            cost_summary_id
            cost_summary {
                _id
                name
                project_id
                floor_plans {
                    floor_plan_id
                    floor_plan {
                        name
                    }
                    estimated_cost
                }
            }
            project_floor_plans {
                uuid
                name
                units_count
                total_units_count
                scope_id
                bathrooms_per_unit
                bedrooms_per_unit
                area_per_unit
                measuring_units
                bid_id
                bid_data {
                    id
                    cost_summary
                }
                photo_images
            }
            zip_code
            name
            project_type
            location
            city
            state
            offering_memo {
                photo_bucket_path
                photo_folder_path
                photo_file_name
                description
            }
            rent_rolls {
                photo_bucket_path
                photo_folder_path
                photo_file_name
                description
            }
            metadata {
                start_date
                end_date
                photo
                budget
                property_url
                project_owner
            }
            current_state {
                state
            }
            project_state_log {
                modification_note {
                    modified_on
                    modification_note
                    modified_by
                }
                state
                bid_package {
                    modification_note {
                        modified_on
                        modification_note
                        modified_by
                    }
                    _id
                    files {
                        _id
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                    }
                    description
                }
            }
        }
    }
`;
export const getScopes = gql`
    query getScopes {
        getScopes {
            id
            container_items
            date_updated
            description
            name
            notes
            updated_by
            version
        }
    }
`;

export const GetContainerItemsJson = gql`
    query getContainerItemsJson($version: String) {
        getContainerItemsJson(version: $version)
    }
`;

export const get_packages = gql`
    query getPackages($input: PackageSearchInput) {
        getPackages(input: $input) {
            package_id
            description
            msa
            package_type
            category
            type
            style
            finish
            customer
            customer_id
            date_created
            date_updated
            date_last_used
            classification
            manufacturer
            supplier
            value_engineered_from
            record_status
            name
            work_type
            created_by
            upload_template_url
        }
    }
`;

export const getInventories = gql`
    query getInventories($project_id: String) {
        getInventories(project_id: $project_id) {
            id
            name
            description
            project_id
            floorplans {
                floor_plan_id
                units
            }
            package_id
        }
    }
`;

export const updateRenovationItems = gql`
    mutation updateRenovationItems($input: [UpdateRenovationItemInput]) {
        updateRenovationItems(input: $input) {
            id
            container_item_id
            project_id
            is_selected
            is_mdm
            is_material
            item_id
            item_price
            item_ref_price
            inventory_id
        }
    }
`;

export const getRenovationItems = gql`
    query getRenovationItems($inventory_id: String) {
        getRenovationItems(inventory_id: $inventory_id) {
            id
            container_item_id
            project_id
            is_selected
            is_mdm
            is_material
            item_id
            item_price
            item_ref_price
            inventory_id
        }
    }
`;

export const CreateBaseInventory = gql`
    mutation createBaseInventory($input: CreateBaseInventoryInput) {
        createBaseInventory(input: $input) {
            id
            project_id
            package_id
            name
            description
            floorplans {
                floor_plan_id
                units
            }
        }
    }
`;
export const GetContainerItems = gql`
    query getContainerItems($version: String) {
        getContainerItems(version: $version) {
            cu_cc
            id
            is_active
            updated_by
            updated_on
            notes
            category
            subcategory
            work_type
            tb_cc
            codex
            location
            item
            scope_item
            version
        }
    }
`;

export const AddInventory = gql`
    mutation createInventory($input: CreateInventoryInput) {
        createInventory(input: $input) {
            id
            project_id
            package_id
            name
            description
            floorplans {
                floor_plan_id
                units
            }
        }
    }
`;

export const updateBaseInventory = gql`
    mutation updateBaseInventory(
        $inventory_id: String
        $new_package_id: [String]
        $container_item_id: [String]
    ) {
        updateBaseInventory(
            inventory_id: $inventory_id
            new_package_id: $new_package_id
            container_item_id: $container_item_id
        ) {
            id
            project_id
            package_id
            name
            description
            floorplans {
                floor_plan_id
                units
            }
        }
    }
`;

export const updateInventory = gql`
    mutation updateInventory(
        $name: String
        $inventory_id: String
        $new_package_id: [String]
        $container_item_id: [String]
        $floorplans: [InventoryFloorPlanInput]
    ) {
        updateInventory(
            name: $name
            inventory_id: $inventory_id
            new_package_id: $new_package_id
            container_item_id: $container_item_id
            floorplans: $floorplans
        ) {
            id
            project_id
            package_id
            name
            description
            floorplans {
                floor_plan_id
                units
            }
        }
    }
`;

export const deleteInventory = gql`
    mutation deleteInventory($inventory_id: String) {
        deleteInventory(inventory_id: $inventory_id) {
            id
            project_id
            package_id
            name
            description
            floorplans {
                floor_plan_id
                units
            }
        }
    }
`;

export const getPackageById = gql`
    query GetPackage {
        getPackage {
            id
            name
            description
            ownership_group_id
            ownership_group_name
            user_id
            created_by
            created_at
            scraper_job_id
            is_standard
            updated_by
            updated_at
            last_used
            version
            materials {
                id
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
                    id
                    supplier
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
            labor {
                id
                location
                category
                subcategory
                uom
                ref_price
                cost_code
                msa
                description
                created_by
                created_at
                updated_by
                updated_at
            }
        }
    }
`;

export const getJobStatus = gql`
    query getJobStatus($job_id: String) {
        getJobStatus(job_id: $job_id) {
            status
        }
    }
`;

export const addNewMaterialItem = gql`
    mutation addNewMaterialItem($input: [AddMaterial]) {
        addNewMaterialItem(input: $input) {
            material_id: id
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
                id
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
export const updateMaterial = gql`
    mutation updateMaterial($input: updateMaterial) {
        updateMaterial(input: $input) {
            id
            description
            uom
            style
            grade
            finish
        }
    }
`;
