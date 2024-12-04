import { gql } from "@apollo/client";

export const GET_B2BProjectsByOrgId = gql`
    query GetB2BProjectsByOrganizationId($orgId: String) {
        getProjectsByOrganizationId(orgId: $orgId) {
            DATA {
                _id
                is_deleted
                org_id
                org_name
                template_version
                metadata {
                    start_date
                    end_date
                    photo
                    project_owner
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
                cost_summary {
                    _id
                    name
                    # final_cost
                    # profit_margin
                }
                current_state {
                    state
                }
                project_main_image {
                    url
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
                    photo_images
                }
            }
        }
    }
`;

export const GET_ScopesByOrgId = gql`
    query GetScopesByOrgid($orgId: String) {
        getScopesByOrganizationId(orgId: $orgId) {
            id
            name
            org_id
            user_id
            scope_v1_data
            version
            scope_post_version_v1_data
            scope_category {
                key
            }
            userData {
                name
            }
            style_name
            metadata {
                description
                summary
                estimated_cost
            }
            userData {
                id
                name
            }
            projects_in_use
            design_style {
                name
                mainImage {
                    url
                }
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
            package_ids
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
                scope_id
                name
            }
        }
    }
`;

// export const GET_B2BPROJECT_BY_ID = gql`
//   query GetB2BProjectById($project_id: String) {
//     getB2BProjectById(project_id: $project_id) {
//       _id
//       is_deleted
//       org_id
//       org_name
//       user_id
//       template_version
//       metadata {
//         start_date
//         end_date
//         photo
//         budget
//         property_url
//         project_owner
//       }
//       offering_memo {
//         photo_bucket_path
//         photo_folder_path
//         photo_file_name
//         description
//       }
//       rent_rolls {
//         photo_bucket_path
//         photo_folder_path
//         photo_file_name
//         description
//       }
//       name
//       project_type
//       zip_code
//       location
//       city
//       state
//       userData {
//         name
//         id
//       }
//       current_state{
//         state
//       }
//       project_state_log{
//         state
//       }
//       cost_summary_id
//       cost_summary {
//         _id
//         name
//         # final_cost
//         # profit_margin
//         floor_plans{
//           floor_plan_id
//           estimated_cost
//         }
//       }
//       teamByrole{
//         role
//         users
//       }
//       project_floor_plans {
//         uuid
//         name
//         units_count
//         total_units_count
//         scope_id
//         bathrooms_per_unit
//         bedrooms_per_unit
//         area_per_unit
//         measuring_units
//         take_off {
//           floor_plan_id
//           input
//           codex
//           unit
//         }
//         bid_data {
//           id
//           cost_summary
//         }
//         scope_data {
//           id
//           name
//           org_id
//           metadata {
//             description
//             estimated_cost
//           }
//           scope_collection_items{
//             _id
//             scope_type
//             is_selected
//             scope_items{
//                 _id
//                 name
//                 is_selected
//                 scope_type
//                 sub_items{
//                     _id
//                     key
//                     value
//                 }
//             }
//           }
//           design_style {
//             name
//             selected_kitchen{
//               name
//               images{
//                   url
//               }
//               mainImage {
//                 url
//               }
//             }
//             selected_bathroom {
//                 name
//                 images {
//                     url
//                 }
//                 mainImage {
//                   url
//                 }
//             }
//           }
//         }
//         photo_images
//       }
//       project_images {
//         uuid
//         photo_tag
//         photo_bucket_path
//         photo_folder_path
//         photo_file_name
//         description
//         is_archived
//     }
//     }
//   }
// `;
export const GET_PROJECT_FLOORPLANS = gql`
    query GetProjectFloorPlans($project_id: String) {
        getProjectFloorPlans(project_id: $project_id) {
            uuid
            name
            units_count
            total_units_count
            scope_id
            bathrooms_per_unit
            bedrooms_per_unit
            area_per_unit
            measuring_units
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
                design_style {
                    name
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
            photo_images
        }
    }
`;

export const GET_ALL_B2B_PROJECTS = gql`
    query GetAllB2BProjects {
        getAllB2BProjects {
            _id
            is_deleted
            org_id
            org_name
            metadata {
                start_date
                end_date
                photo
                project_owner
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
            cost_summary {
                _id
                name
                # final_cost
                # profit_margin
            }
            current_state {
                state
            }
            project_main_image {
                url
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
                bid_data {
                    id
                    cost_summary
                }
                scope_data {
                    id
                    name
                    metadata {
                        description
                        estimated_cost
                    }
                    org_id
                    design_style {
                        name
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
                photo_images
            }
        }
    }
`;

export const GET_TIMELINE_DATA = gql`
    query GetTimeLineData($projectId: String) {
        getTimeline(project_id: $projectId) {
            project_state_log {
                modification_note {
                    modified_on
                    modified_by
                    modification_note
                }
                _id
                state
                bid_package {
                    modification_note {
                        modified_on
                        modified_by
                        modification_note
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

export const GET_ALL_SCOPES = gql`
    query GetAllScopes {
        getAllScopes {
            id
            name
            org_id
            user_id
            scope_v1_data
            version
            scope_post_version_v1_data
            scope_category {
                key
            }
            userData {
                name
            }
            style_name
            metadata {
                description
                summary
                estimated_cost
            }
            userData {
                id
                name
            }
            projects_in_use
            design_style {
                name
                mainImage {
                    url
                }
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
        }
    }
`;

export const GET_ALL_OWNERSHIPS = gql`
    query GetAllOrganizations {
        getAllOrganizations(organization_type: Ownership) {
            id
            name
            street_name
            city
            state
            zip_code
            google_workspace_email
            created_by
            contact_number
            primary_tb_contact
            organization_type
        }
    }
`;

export const GET_RFP_PACKAGE = gql`
    query GetRfpDetails {
        getRfpDetails {
            RfpPackage {
                doc_desc
                upload
            }
            rfpsList {
                rfpId
                projectImageUrl
                propertyName
                propertyAddress
                contactPersonName
                refDueDate
                responseState
                refStatus
                refStartDate
                units
                budgetTargetPerUnit
                name
                email
                contactNumber
            }
        }
    }
`;

export const GET_RFP_CONTRACT_BY_ID = gql`
    query GetRFPContractById($rfp_contract_id: String) {
        getRfpContractById(rfp_contract_id: $rfp_contract_id) {
            _id
            is_deleted
            status
            project_id
            rfp_id
            rfp_due_date
            rfp_response_status
            contractor_user_id
            modification_note {
                modification_note
                modified_by
                modified_on
            }
            rfp_response {
                package_id
                modification_note {
                    modification_note
                    modified_by
                    modified_on
                }
                file_revision {
                    file_name
                    file_url
                    version
                    created_on
                }
                description
            }
        }
    }
`;
export const ARCHIVE_RFP_RESPONSE = gql`
    query ArchiveRfpResponse($rfp_contract_id: String) {
        archiveRfpResponse(rfp_contract_id: $rfp_contract_id) {
            _id
            is_deleted
            status
            project_id
            rfp_id
            rfp_due_date
            rfp_response_status
            contractor_user_id
            modification_note {
                modification_note
                modified_by
                modified_on
            }
            rfp_response {
                package_id
                modification_note {
                    modification_note
                    modified_by
                    modified_on
                }
                file_revision {
                    file_name
                    file_url
                    version
                    created_on
                }
                description
            }
        }
    }
`;

export const UPLOAD_RFP_RESPONSE = gql`
    mutation UploadRfpResponse($rfp_id: String, $input: InputRFPResponse) {
        rfpResponseUpload(rfp_id: $rfp_id, input: $input) {
            _id
            is_deleted
            status
            project_id
            rfp_id
            rfp_due_date
            rfp_response_status
            contractor_user_id
            modification_note {
                modification_note
                modified_by
                modified_on
            }
            rfp_response {
                package_id
                description
                modification_note {
                    modification_note
                    modified_by
                    modified_on
                }
                file_revision {
                    file_name
                    file_url
                    version
                    created_on
                }
                current_version
            }
        }
    }
`;

export const GET_RFP_BY_ID = gql`
    query GetRFPById($rfp_id: String) {
        getRfpById(rfp_id: $rfp_id) {
            _id
            name
            project_id
            due_date
            target_budget
            rfp_contractors {
                _id
                contractor_data {
                    name
                    email
                    status
                }
                rfp_contractor_id
            }
            package {
                _id
                description
                file_revision {
                    file_name
                    file_url
                    created_on
                }
                is_scheduled
                scheduled_date
            }
        }
    }
`;

export const GET_RFP_DETAILS = gql`
    query getRfpContracts($user_id: String) {
        getRfpContracts(user_id: $user_id) {
            _id
            project_id
            rfp_id
            rfp_due_date
            status
            rfp_response_status
            contractor_user_id
            projectDetails {
                _id
                total_units
                org_id
                total_units
                name
                location
                metadata {
                    start_date
                    end_date
                    photo
                    budget
                    property_url
                }
            }
            userDetails {
                id
                email
                name
                contactNumber
            }
        }
    }
`;

export const GET_PROJECT_IMAGES = gql`
    query GetB2BProjectById($project_id: String) {
        getB2BProjectById(project_id: $project_id) {
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

export const UPLOAD_MAIN_IMAGE = gql`
    mutation UploadMainImage($project_id: String, $image_url: String) {
        uploadMainProjectImage(project_id: $project_id, image_url: $image_url) {
            _id
        }
    }
`;

export const GET_USERS_BY_ORG_ID = gql`
    query GetUsersByOrgId($orgId: String) {
        getAllUsersByOrgId(orgId: $orgId) {
            id
            email
            name
            auth0Id
            roles
            status
            organizationId
            isFirstTimeLogin
            contactNumber
            metadata {
                area_of_operation
            }
        }
    }
`;
