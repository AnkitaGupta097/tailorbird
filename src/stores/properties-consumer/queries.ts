import { gql } from "@apollo/client";

export const GET_PROPERTIES_WITH_FILTER = gql`
    query Properties($filters: [FiltersInput]) {
        getPropertiesWithFilter(filters: $filters) {
            properties {
                website_url
                updated_at
                type
                system_remarks
                ownership_group_id
                name
                is_active
                id
                cover_picture
                google_map_url
                created_at
                age
                address
                city
                state
                zipcode
                acquisition_history
                unit_count
                active_project_count
            }
            filters {
                name
                order
                parent
                filter_values {
                    value
                    count
                }
            }
        }
    }
`;

export const GET_UNIT_MIXES = gql`
    query GetUnitMixes($property_id: String) {
        getUnitMixes(property_id: $property_id) {
            unit_type
            property_unit_name
            is_renovated
            inventory_name
            floor
            id
            created_at
            property_unit_floor_plan_id
            floorplan_name
        }
    }
`;

export const PROPERTY_DETAILED_STATS = gql`
    query propertyDetailedStats($property_id: String) {
        propertyDetailedStats(property_id: $property_id) {
            floorplan_id
            units
            detailed_stats {
                category
                count
                uom
                items {
                    item
                    count
                    uom
                }
            }
        }
    }
`;

export const GET_PROPERTY_FILES = gql`
    query GetProjectFiles($propertyId: String, $fileType: String) {
        getProjectFiles(property_id: $propertyId, file_type: $fileType) {
            uploaded_at
            updated_at
            tags
            system_remarks
            signed_url
            s3_version_id
            s3_file_path
            project_id
            is_uploaded
            is_active
            id
            file_type
            file_name
            download_link
            deleted_by
            created_by
            created_at
            cdn_path
            bucket_name
        }
    }
`;

export const GET_PROPERTY_DETAILS = gql`
    query GetProperty($propertyId: String) {
        getProperty(property_id: $propertyId) {
            zipcode
            website_url
            type
            system_remarks
            state
            msa
            property_url
            cover_picture
            ownership_group_id
            name
            is_active
            id
            google_map_url
            external_property_id
            created_at
            city
            age
            address
            unit_count
            autodesk_url
            isHavingMissingInfo: is_missing_info
            missingInfo: missing_media {
                id
                project_id
                floor_plan_id
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
            whatsapp_phone_number
        }
    }
`;

export const GET_FLOORPLAN = gql`
    query GetProjectFloorPlans($projectId: String) {
        getProjectFloorPlans(project_id: $projectId) {
            type
            unit_type
            total_units
            take_off_type
            reno_units
            property_units {
                updated_at
                unit_name
                is_active
                floor
                area
            }
            name
            area
            id
        }
    }
`;

export const GET_FORGE_VIEWER_DETAILS = gql`
    query Query($property_id: String) {
        getForgeViewerDetails(property_id: $property_id)
    }
`;

export const GET_PROPERTY_STATS = gql`
    query PropertyStats($propertyId: String) {
        propertyStats(property_id: $propertyId) {
            FLOORPLAN {
                name
                count
                icon
            }
            BUILDING {
                name
                count
                icon
            }
            COMMON_AREA {
                name
                count
                icon
            }
            SITE {
                name
                count
                icon
            }
        }
    }
`;
export const CREATE_PROJECT_FILES_MISSING_INFO = gql`
    mutation CreateProjectFiles($input: ProjectFileCreateInput) {
        createProjectFiles(input: $input) {
            id
            project_id
            floor_plan_id
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
export const PROPERTY_DETAILED_STATS_WITH_ALL_UNITS = gql`
    query PropertyDetailedStats($propertyId: String, $isAllFloorplansToAllUnits: Boolean) {
        propertyDetailedStats(
            property_id: $propertyId
            is_all_floorplans_to_all_units: $isAllFloorplansToAllUnits
        ) {
            floorplan_id
            floor_plan_name
            commercial_name
            units
            detailed_stats {
                category
                count
                uom
                items {
                    item
                    count
                    uom
                }
            }
        }
    }
`;
