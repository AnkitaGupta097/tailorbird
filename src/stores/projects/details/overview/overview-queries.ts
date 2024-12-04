import { gql } from "@apollo/client";

export const GET_DATASORCE_LIST = gql`
    query getDatasourceListByProjectID($project_id: String) {
        getProjectDataSource(project_id: $project_id) {
            floorPlanName: floor_plan_name
            remoteFileReference: remote_file_reference
            version: version
            id: id
            uploadPhase: upload_phase
            createdAt: created_at
            userRemark: user_remarks
            uploadBy: uploaded_by
            name: name
            status: timings
            versions {
                id
                version
                user_remarks
                system_remarks {
                    error
                }
                created_at
                uploaded_by
                system_remarks {
                    error
                }
            }
            system_remarks {
                error
            }
        }
    }
`;

export const GET_DATASORCE_UPLOAD_STATUS = gql`
    query getDataSourceStatus($project_id: String) {
        getDataSourceStatus(project_id: $project_id) {
            status
        }
    }
`;

export const GET_DATASORCE_DOWNLOAD_LINK = gql`
    query GetDataSourceDownloadableLink($fileIds: [Int]) {
        getDataSourceDownloadableLink(file_id: $fileIds) {
            datasource_file_id
            URL
        }
    }
`;

export const VALIDATE_FILE_NAME = gql`
    query ValidateDataSourceFile($fileNames: [String], $project_id: String) {
        validateDataSourceFileName(file_names: $fileNames, project_id: $project_id) {
            error
            file_name
        }
    }
`;

export const CREATE_S3_UPLOAD = gql`
    mutation createS3upload($fileContent: [String], $filePath: String) {
        createS3upload(fileContent: $fileContent, filePath: $filePath) {
            success
            data {
                signedRequest
                url
            }
        }
    }
`;

export const UPLOAD_RENT_ROLL = gql`
    mutation UploadRentRoll($input: RentRollInput) {
        uploadRentRoll(input: $input) {
            columns: columns
            createdBy: created_by
            id: id
            projectId: project_id
            remoteFileReference: remote_file_reference
            systemIdentifiedData: system_identified_data {
                unitColumn: unit_column
                floorPlanNameColumn: floor_plan_name_column
                floorPlanTypeColumn: floor_plan_type_column
                sqftColumn: sqft_column
                inventoryColumn: inventory_column
            }
            error: error
            status: status
        }
    }
`;

export const UPDATE_RENT_ROLL_COLUMN = gql`
    mutation UpdateRentRoll(
        $project_id: String
        $unit_column: String
        $floor_plan_name_column: String
        $floor_plan_type_column: String
        $sqft_column: String
        $inventory_column: String
        $commercial_name_column: String
        $unit_type_column: String
    ) {
        updateRentRoll(
            project_id: $project_id
            unit_column: $unit_column
            floor_plan_name_column: $floor_plan_name_column
            floor_plan_type_column: $floor_plan_type_column
            sqft_column: $sqft_column
            inventory_column: $inventory_column
            commercial_name_column: $commercial_name_column
            unit_type_column: $unit_type_column
        ) {
            id
            error
        }
    }
`;

export const SET_VERSION_ON_DATASOURCE = gql`
    mutation setDataSourceFileVersion($datasource_file_id: Int) {
        setDataSourceFileVersion(datasource_file_id: $datasource_file_id) {
            id
            project_id
            is_active
            version
            status
            user_remarks
            uploaded_by
            created_at
        }
    }
`;

export const DELETE_RENT_ROLL = gql`
    mutation DeleteRentRoll($projectId: String) {
        deleteRentRoll(project_id: $projectId)
    }
`;

export const DOWNLOAD_UNIT_MIX = gql`
    query Query($projectId: String) {
        downloadUnitMixes(project_id: $projectId) {
            s3_signed_url
        }
    }
`;

export const DOWNLOAD_UNIT_MIX_LOGS_FILE = gql`
    query Query($projectId: String) {
        downloadUnitMixesLogs(project_id: $projectId) {
            s3_signed_url
        }
    }
`;

export const CREATE_DATASOURCE_FILE = gql`
    mutation createDataSourceFile($input: DataSourceFileCreationInput) {
        createDataSourceFiles(input: $input) {
            id
            status
            remote_file_reference
        }
    }
`;
