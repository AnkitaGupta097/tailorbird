import { gql } from "@apollo/client";

export const GET_PROJECT_FLOORPLANS_ONEXPAND = gql`
    query GetB2BProjectById($project_id: String) {
        getB2BProjectById(project_id: $project_id) {
            _id
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
                take_off {
                    floor_plan_id
                    input
                    codex
                    unit
                }
                bid_data {
                    id
                    cost_summary
                }

                scope_data {
                    id
                    name
                    metadata {
                        description
                    }

                    design_style {
                        name
                    }
                }
                photo_images
            }

            project_images {
                uuid
                photo_tag
                photo_bucket_path
                photo_folder_path
                photo_file_name
                description
                is_archived
            }
        }
    }
`;

export const GET_B2BPROJECT_BY_ID = gql`
    query GetB2BProjectById($project_id: String) {
        getB2BProjectById(project_id: $project_id) {
            _id
            is_deleted
            org_id
            org_name
            user_id
            template_version
            metadata {
                start_date
                end_date
                photo
                budget
                property_url
                project_owner
            }
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
            name
            project_type
            zip_code
            location
            city
            state
            userData {
                name
                id
            }
            current_state {
                state
            }
            project_state_log {
                state
            }
            cost_summary_id
            cost_summary {
                _id
                name
                # final_cost
                # profit_margin
                floor_plans {
                    floor_plan_id
                    estimated_cost
                }
            }
            teamByrole {
                role
                users
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
                take_off {
                    floor_plan_id
                    input
                    codex
                    unit
                }
                bid_data {
                    id
                    cost_summary
                }
                scope_data {
                    id
                    name
                    org_id
                    metadata {
                        description
                        estimated_cost
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
                    design_style {
                        name
                        selected_kitchen {
                            name
                            images {
                                url
                            }
                            mainImage {
                                url
                            }
                        }
                        selected_bathroom {
                            name
                            images {
                                url
                            }
                            mainImage {
                                url
                            }
                        }
                    }
                }
                photo_images
            }
            project_images {
                uuid
                photo_tag
                photo_bucket_path
                photo_folder_path
                photo_file_name
                description
                is_archived
            }
        }
    }
`;

export const GET_ScopesByOrgId_OnExpand = gql`
    query GetScopesByOrgid($orgId: String) {
        getScopesByOrganizationId(orgId: $orgId) {
            id
            name

            style_name

            design_style {
                name
                mainImage {
                    url
                }
            }
        }
    }
`;

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

export const GET_COST_SUMMARY_BY_ID = gql`
    query GetCostSummaryById($costSummaryId: String) {
        getCostSummaryById(cost_summary_id: $costSummaryId) {
            _id
            name
            project_id
            floor_plans {
                floor_plan_id
                estimated_cost
            }
            contractors_bid {
                contractor_user_id
                name
                kitchen
                bathroom
                flooring
                other
                total
            }
            cost_comparison_doc {
                id
                current_version
                description
                file_revision {
                    file_name
                    file_url
                    version
                    created_on
                }
            }
        }
    }
`;

export const GET_ALL_SCOPES = gql`
    query GetAllScopes {
        getAllScopes {
            id
            name
            org_id
            user_id

            userData {
                name
            }
            style_name
            metadata {
                description
                summary
                estimated_cost
            }

            projects_in_use
            design_style {
                name
                mainImage {
                    url
                }
            }
        }
    }
`;
