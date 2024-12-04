import { gql } from "@apollo/client";
export const GetAllProjectsUserId = gql`
    query getAllProjectsUserId($id: ID) {
        getAllProjectsUserId(id: $id) {
            DATA {
                _id
                name
                location
                type
                startDate
                user_id
                project_id
                zip_code
                city
                state
                contact_number
                type
                renovations
                funnel_items {
                    question
                    answer
                }
                project_metadata {
                    estimated_cost
                    value_increase
                    timeline
                    room_type
                }
            }
        }
    }
`;
export const GetProjectImagesByID = gql`
    query getProjectImagesByID($id: ID) {
        getProjectByID(id: $id) {
            DATA {
                _id
                name
                type
                user_id
                project_id
                project_images {
                    uploaded {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_selected
                    }
                    measured {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_selected
                    }
                    scraped {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_selected
                    }
                }
            }
        }
    }
`;

export const UpdateProjectImage = gql`
    mutation updateProjectImage($project_images: imageDataInput) {
        updateProjectImage(project_images: $project_images) {
            STATUS
        }
    }
`;

export const GET_PROJECT_BY_ID = gql`
    query GetProjectById($id: ID) {
        getProjectByID(id: $id) {
            DATA {
                _id
                name
                location
                type
                startDate
                user_id
                project_id
                zip_code
                city
                state
                contact_number
                renovations
                funnel_items {
                    question
                    answer
                }
                proposal {
                    design {
                        value
                        currency
                    }
                    material {
                        value
                        currency
                    }
                    project_management {
                        value
                        currency
                    }
                    construction {
                        value
                        currency
                    }
                    proposal_image {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                    }
                    lightening_bid {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                    }
                    catalog_items {
                        item_room_type
                        item_name
                        item_varieties {
                            varierty_type
                            description
                            imageUrl
                        }
                    }
                }
                project_images {
                    uploaded {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_selected
                    }
                    measured {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_selected
                    }
                    scraped {
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_selected
                    }
                }
                project_metadata {
                    estimated_cost
                    value_increase
                    timeline
                    room_type
                }
                current_state {
                    state
                    substate
                }
            }
        }
    }
`;
export const GetAllProjects = gql`
    query getAllProjects {
        getAllProjects {
            DATA {
                _id
                name
                location
                type
                startDate
                user_id
                project_id
                zip_code
                city
                state
                contact_number
                type
                renovations
                funnel_items {
                    question
                    answer
                }
                project_metadata {
                    estimated_cost
                    value_increase
                    timeline
                    room_type
                }
                current_state {
                    state
                    substate
                }
            }
        }
    }
`;
export const GetMytrackerData = gql`
    query getMytrackerData {
        getMytrackerData {
            id
            project_state
            display_name
            state_order
            timeline
            state_icon {
                id
                url
            }
            substate {
                project_substate
                display_name
                substate_order
            }
        }
    }
`;

export const GetProjectStateLogs = gql`
    query getProjectStateLogs($projectId: String) {
        getProjectStateLogs(projectId: $projectId) {
            id
            project_state
            state_order
            substate {
                project_substate
                substate_order
                updated_on
            }
        }
    }
`;
