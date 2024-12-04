import { gql } from "@apollo/client";

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

export const ARCHIVE_PROJECT_FILES = gql`
    mutation archiveProjectFile($file_id: Int) {
        archiveProjectFile(file_id: $file_id)
    }
`;

export const UNDO_PROJECT_FILES = gql`
    mutation undoArchiveProjectFile($file_id: Int) {
        undoArchiveProjectFile(file_id: $file_id)
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

export const GET_PROJECT_FILE = gql`
    query GetProjectFile($fileId: Int) {
        getProjectFile(file_id: $fileId) {
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
