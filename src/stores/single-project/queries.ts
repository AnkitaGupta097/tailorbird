import { gql } from "@apollo/client";

export const GET_SINGLE_PROJECT = gql`
    query GetProjectById($projectId: String) {
        getProjectById(project_id: $projectId) {
            id
            name
            projectType: project_type
            streetAddress: street_address
            city
            state
            zipcode
            property_id
            ownershipGroupId: ownership_group_id
            propertyType: property_type
            propertyId: property_id
            organization {
                id
                name
            }
            approximateUnitCount: total_units
            createdAt: created_at
            per_unit_target_budget
            projectStatus: status
            production_details {
                completed_units
                start_date
                end_date
                status
                renovation_units
            }
            system_remarks
            organisation_container_id
        }
    }
`;

export const GET_PROJECT_BUDGET = gql`
    query GetProjectBudgetStat($projectId: String) {
        getProjectBudgetStat(project_id: $projectId) {
            project_id
            start_date
            end_date
            in_progress
            completed_units
            renovation_units
            status
            budget
            spend
        }
    }
`;

export const GET_RENO_TIME_BY_UNIT = gql`
    query GetRenovationTime($projectId: String, $columns: [String]) {
        getRenovationTime(project_id: $projectId, columns: $columns) {
            unit_name
            unit_type
            type
            name
            avg_renovation_time
        }
    }
`;

export const GET_PRODUCTION_PROJECT = gql`
    query GetProjectById($projectId: String) {
        getProjectById(project_id: $projectId) {
            id
            name
            projectType: project_type
            streetAddress: street_address
            city
            state
            ownershipGroupId: ownership_group_id
            propertyType: property_type
            propertyId: property_id
            organization {
                id
                name
            }
            approximateUnitCount: total_units
            createdAt: created_at
            per_unit_target_budget
            projectStatus: status
            knock_flow_settings {
                id
                project_id
                user_id
                org_id
                flow_key
                meta_data {
                    push
                    email
                    in_app_feed
                }
                subscribed
            }
            production_details {
                completed_units
                start_date
                end_date
                status
                renovation_units
            }
            production_config {
                job_id
                region
                project_lead
                project_start_date
                project_end_date
                auto_invoicing
                auto_release
                auto_approval
                first_invoice_date
                invoice_generate_condition
                invoice_frequency
                unit_email_notification_preference
                approval_email_notification_preference
                invoice_email_preference
                retainage_enabled
                retainage_percentage
                mobilized_amount
                demobilization_percentage
                projected_unit_renovation_duration
            }
            system_remarks
        }

        getProjectBudgetStat(project_id: $projectId) {
            project_id
            start_date
            end_date
            in_progress
            completed_units
            renovation_units
            total_units
            status
            budget
            spend
            mobilized_amount
        }

        latestRenovationVersion(project_id: $projectId) {
            created_at
            renovation_version
        }
    }
`;

export const GET_APPROVAL_CHANGE_ORDERS = gql`
    query GetApprovalChangeOrders($projectId: String) {
        getApprovalChangeOrders(project_id: $projectId) {
            type
            reviewed_at
            requestee {
                id
                name
            }
            requestor {
                id
                name
            }
            amount
            change_data
            current_data
        }
    }
`;

export const GET_MONTHLY_SPEND_ANALYSIS = gql`
    query GetSpendAnalysis($projectId: String, $groupColumn: String) {
        getSpendAnalysis(project_id: $projectId, group_column: $groupColumn) {
            yyyy_mm
            total_spend
            category
        }
    }
`;

export const GET_MONTHLY_UNIT_TURNED = gql`
    query GetUnitsByMonth($projectId: String) {
        getUnitsByMonth(project_id: $projectId) {
            month
            count
            unit_type
        }
    }
`;

export const GET_RENOVATION_PROGRESS = gql`
    query GetRenovationProgress($projectId: String) {
        getRenovationProgress(project_id: $projectId) {
            floor_plan_type
            unit_type
            status
            count
            inventory_details {
                inventory_name
                floor_plan_type
                unit_type
                count
            }
        }
    }
`;

export const GET_UNIT_STATUS_MAP = gql`
    query GetProjectAnalytics($projectId: String) {
        getProjectAnalytics(project_id: $projectId) {
            total_units
            reno_units
            status_map
        }
    }
`;

export const UPDATE_SINGLE_PROJECT = gql`
    mutation updateProjectById($project_id: String, $input: ProjectCreationInput) {
        updateProject(project_id: $project_id, input: $input) {
            system_remarks
            knock_flow_settings {
                id
                project_id
                user_id
                org_id
                flow_key
                meta_data {
                    push
                    email
                    in_app_feed
                }
                subscribed
            }
            production_config {
                job_id
                region
                project_lead
                project_start_date
                project_end_date
                auto_invoicing
                auto_release
                auto_approval
                first_invoice_date
                invoice_generate_condition
                invoice_frequency
                unit_email_notification_preference
                approval_email_notification_preference
                invoice_email_preference
                retainage_enabled
                retainage_percentage
                mobilized_amount
                demobilization_percentage
                projected_unit_renovation_duration
            }
        }
    }
`;

export const CREATE_PROJECT_FILES = gql`
    mutation createProjectFiles($input: ProjectFileCreateInput) {
        createProjectFiles(input: $input) {
            id
            project_id
            file_name
            bucket_name
            s3_file_path
            s3_version_id
            is_uploaded
            is_active
            file_type
            created_at
            uploaded_at
            updated_at
            created_by
            deleted_by
            signed_url
            download_link
            cdn_path
            tags
            system_remarks
        }
    }
`;

export const MARK_FILE_UPLOADED = gql`
    mutation markFileUploaded($file_id: Int) {
        markFileUploaded(file_id: $file_id)
    }
`;

export const GET_PROJECT_FILES = gql`
    query getProjectFiles($project_id: String, $file_type: String) {
        getProjectFiles(project_id: $project_id, file_type: $file_type) {
            id
            file_name
            created_by
            created_at
            tags
            is_active
            file_type
            created_by
            download_link
            cdn_path
            bucket_name
            s3_file_path
            signed_url
            gdoc_sso_url
        }
    }
`;
export const GET_CDN_PROJECT_FILES = gql`
    query getProjectFiles($project_id: String, $file_type: String) {
        getProjectFiles(project_id: $project_id, file_type: $file_type) {
            id
            file_name
            is_active
            file_type
            cdn_path
        }
    }
`;

export const DELETE_PROJECT_FILES = gql`
    mutation deleteProjectFile($input: DeleteProjectFileInput) {
        deleteProjectFile(input: $input)
    }
`;

export const UPDATE_PROJECT_FILES = gql`
    mutation updateProjectFiles($file_id: Int) {
        updateProjectFiles(file_id: $file_id)
    }
`;
export const GET_KEY_PEOPLE = gql`
    query GetContractorListForProject(
        $projectId: String
        $rfpProjectVersion: String
        $isDemandSide: Boolean
    ) {
        getContractorListForProject(
            project_id: $projectId
            rfp_project_version: $rfpProjectVersion
            is_demand_side: $isDemandSide
        ) {
            user_list {
                project_id
                contractor_id
                organization_id
                invited_on
            }
        }
    }
`;
export const GET_FILE_DOWNLOAD_LINK = gql`
    query GetProjectFile($fileId: Int) {
        getProjectFile(file_id: $fileId) {
            download_link
            file_name
        }
    }
`;

export const GET_PACKAGES = gql`
    query GetPackages($input: PackagesListInput) {
        getPackages(input: $input) {
            name
            id
            description
            created_by
            created_at
            curated
        }
    }
`;

export const GET_RFP_BID_STATUSES = gql`
    query GetContractorListForProject(
        $projectId: String
        $rfpProjectVersion: String
        $isDemandSide: Boolean
    ) {
        getContractorListForProject(
            project_id: $projectId
            rfp_project_version: $rfpProjectVersion
            is_demand_side: $isDemandSide
        ) {
            organization_details {
                organization_id
                bid_status
                invited_on
                bid_versions {
                    exh_c_copy_url
                    date_created
                    baseline_bidbook_url
                    baseline_version
                }
                bid_requests {
                    created_at
                    id
                    reno_item_version
                }
                bid_responses {
                    created_at
                    id
                    reno_item_version
                    version
                    bid_request_id
                    project_id
                    contractor_org_id
                    is_submitted
                    submitted_by
                }
            }
        }
    }
`;

export const GET_QUESTIONS_AND_ANSWERS = gql`
    query RenoQuestionsAndAnswers($organizationId: String, $userId: String) {
        renoQuestionsAndAnswers(organization_id: $organizationId, user_id: $userId) {
            order
            name
            category_id
            organization_id
            questions {
                id
                order
                item_id
                item_name
                category_id
                room_name
                question_description
                is_multi_select
                meta_data {
                    is_alt
                    is_valid
                    is_some_units
                    is_hidden
                    is_dependant
                    is_damaged
                }
                answers {
                    id
                    order
                    question_id
                    answer_description
                    room_name
                    container_item_id
                    next_question_id
                }
            }
        }
    }
`;

export const CREATE_QUESTION_RESPONSE = gql`
    mutation AssignQuestionResponse($questionResponseInput: QuestionResponseInput) {
        assignQuestionResponse(question_response_input: $questionResponseInput) {
            id
            item_id
            category_id
            question_id
            answer_id
            room
            meta_data
            package_id
            project_id
            is_active
            inventory_id
            reno_items {
                id
                category
                item
                org_container_item_id
                scope
                subcategory
                component
                work_type
                inventory_name
                inventory_id
                sub_group_id
                sku_id
                image_url
                description
                model_no
                supplier
                item_no
                unit_cost
                manufacturer
                only_in_some_unit
                done_as_needed
                all_units
                spec_selection {
                    id
                    manufacturers
                    organisation_container_id
                    low_price
                    high_price
                    finish
                }
                budget_version
            }
        }
    }
`;

export const GET_QUESTION_RESPONSES = gql`
    query QuestionResponses($questionResponseFilter: QuestionResponseFilter) {
        questionResponses(question_response_filter: $questionResponseFilter) {
            id
            item_id
            category_id
            question_id
            answer_id
            room
            meta_data
            package_id
            project_id
            is_active
            inventory_id
            reno_items {
                id
                project_id
                property_layout_id
                org_container_item_id
                derived_from
                sku_id
                inventory_id
                is_active
            }
        }
    }
`;

export const CREATE_INVENTORY_DETAILS = gql`
    mutation CreateInventoryDetails($payload: CreateInventoryDetailsPayload) {
        createInventoryDetails(payload: $payload) {
            name
            id
            description
        }
    }
`;

export const GET_SPECS_AVAILABLE = gql`
    query GetMaterials($input: PackageSearchFilterInput) {
        getMaterials(input: $input) {
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
    }
`;
export const GET_INVENTORY_LIST = gql`
    query GetInventoriesList($projectId: String) {
        getInventoriesList(project_id: $projectId) {
            project_id
            package_id
            name
            id
            description
            created_at
            base_scope_id
            scope_status
        }
    }
`;

export const CLONE_INVENTORY = gql`
    mutation CloneInventory($payload: CloneInventoryPayload) {
        cloneInventory(payload: $payload)
    }
`;
export const GET_RENO_PARAMETERS = gql`
    query GetRenoParametersList($organisationContainerId: String) {
        getRenoParametersList(organisation_container_id: $organisationContainerId) {
            id
            manufacturers
            organisation_container_id
            low_price
            high_price
            finish
        }
    }
`;

export const UPDATE_RENO_ITEM = gql`
    mutation UpdateRenoItemV2($payload: UpdateRenoItemV2Payload) {
        updateRenoItemV2(payload: $payload) {
            sku_id
            property_layout_id
            project_id
            org_container_item_id
            is_active
            inventory_id
            id
        }
    }
`;

export const GET_RENO_ITEMS = gql`
    query GetRenoItems($renoFilters: RenoFilters) {
        getRenoItems(renoFilters: $renoFilters) {
            room
            scope_type
            work_type
            unit_cost
            supplier
            subcategory
            sub_group_id
            sku_id
            org_container_item_id
            scope
            only_in_some_unit
            model_no
            manufacturer
            item_no
            item
            inventory_name
            inventory_id
            image_url
            id
            done_as_needed
            description
            component
            category
            all_units
            spec_selection {
                organisation_container_id
                manufacturers
                low_price
                id
                high_price
                finish
            }
            budget_version
        }
    }
`;

export const UPDATE_SINGLE_PROJECT_STATUS = gql`
    mutation UpdateProjectStatus($input: ProjectStatusRequest) {
        updateProjectStatus(input: $input) {
            created_at
            created_by
            project_id
            status
        }
    }
`;
