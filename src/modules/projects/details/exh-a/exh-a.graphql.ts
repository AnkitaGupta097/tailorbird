import { gql } from "@apollo/client";

export const GET_EXH_A_CONFIG_QUERY = gql`
    query GetExhAConfig($projectId: String) {
        getExhAConfig(project_id: $projectId) {
            trades {
                trade_name
                trade_id
                trade_options {
                    name
                    is_selected
                    id
                }
            }
            updated_by
            short_description_included
            project_id
            owner_to_gc
            material_supply
            long_description_included
            gc_to_subs
        }
    }
`;

export const UPDATE_EXH_A_CONFIG_MUTATION = gql`
    mutation UpdateExhAConfig($projectId: String, $updateExhAInput: UpdateExhAConfigInput) {
        updateExhAConfig(project_id: $projectId, update_exh_a_input: $updateExhAInput) {
            message
        }
    }
`;
export const GET_EXH_A_DOCUMENTS = gql`
    query GetExhADocument($projectId: String) {
        getExhADocument(project_id: $projectId) {
            id
            file_name
            project_id
            s3_file_path
            download_link
            created_by
            created_at
        }
    }
`;

export const GET_EXH_A_MISSING_FILES = gql`
    query GetExhAMissingItemsFile($projectId: String) {
        getExhAMissingItemsFile(project_id: $projectId) {
            s3_file_path
            project_id
            id
            file_name
            download_link
            created_by
            created_at
        }
    }
`;
