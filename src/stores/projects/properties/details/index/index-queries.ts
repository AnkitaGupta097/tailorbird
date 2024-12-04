import { gql } from "@apollo/client";

export const GET_PROJECT_DETAILS = gql`
    query getProjectById($projectId: String) {
        getProjectById: getProjectById(project_id: $projectId) {
            id: id
            ownershipGroupId: ownership_group_id
            name: name
            streetAddress: street_address
            city: city
            state: state
            zipcode: zipcode
            msa: msa
            propertyUrl: property_url
            propertyType: property_type
            propertyId: property_id
            perUnitTargetBudget: per_unit_target_budget
            userId: user_id
            projectType: project_type
            isDeleted: is_deleted
            system_remarks
            opportunityId: opportunity_id
            organisation_container_id
        }
        getRentRoll(project_id: $projectId) {
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

export const GET_PROPERTY_DETAILS = gql`
    query GetProperty($propertyId: String) {
        getProperty(property_id: $propertyId) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            address: address
            type: type
            city: city
            state: state
            zipcode: zipcode
            operatorId: operator_id
            msa: msa
            propertyUrl: property_url
            externalPropertyId: external_property_id
            createdAt: created_at
            isActive: is_active
            projects {
                type
                id
                name
            }
            property_id_mappings
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
        }
    }
`;

export const GET_UNITS = gql`
    query GetPropertyUnits($projectId: String) {
        getPropertyUnits(project_id: $projectId) {
            id
            unit_name
            entrata_unit_id
        }
    }
`;

export const GET_ENTRATA_UNITS = gql`
    query GetEntrataPropertyUnits($projectId: String) {
        getEntrataPropertyUnits(project_id: $projectId) {
            project_id
            unit_name
            id
        }
    }
`;

export const GET_FLOORPLANS = gql`
    query GetProjectFloorPlans($projectId: String) {
        getProjectFloorPlans(project_id: $projectId) {
            id
            name
            commercial_name
            entrata_ref_id
            unit_type
            type
            project_id
            system_identified
            created_at
            updated_at
            total_units
            reno_units
            baths_per_unit
            beds_per_unit
            area
            area_uom
            derived_from
            derived_type
            take_off_type
            is_missing_info
            whatsapp_phone_number
        }
    }
`;

export const GET_ENTRATA_FLOORPLANS = gql`
    query GetEntrataFloorplans($projectId: String) {
        getEntrataFloorplans(project_id: $projectId) {
            id
            name
            no_of_bed_rooms
            no_of_baths
            unit_count
            units_available
            area
        }
    }
`;

export const UPDATE_PROPERTY = gql`
    mutation UpdateProperty(
        $propertyId: String
        $name: String
        $address: String
        $city: String
        $state: String
        $zipcode: String
        $external_property_id: String
        $property_url: String
        $type: String
        $ownership_group_id: String
        $age: Int
        $websiteUrl: String
        $googleMapUrl: String
        $isActive: Boolean
        $mappingPropertyId: String
        $mappingType: String
        $mappingName: String
        $operator_id: String
        $autodeskUrl: String
        $is_missing_info: Boolean
        $whatsapp_phone_number: String
    ) {
        updateProperty(
            property_id: $propertyId
            name: $name
            city: $city
            state: $state
            zipcode: $zipcode
            property_url: $property_url
            external_property_id: $external_property_id
            address: $address
            type: $type
            age: $age
            website_url: $websiteUrl
            google_map_url: $googleMapUrl
            is_active: $isActive
            ownership_group_id: $ownership_group_id
            mapping_property_id: $mappingPropertyId
            mapping_type: $mappingType
            mapping_name: $mappingName
            operator_id: $operator_id
            autodesk_url: $autodeskUrl
            is_missing_info: $is_missing_info
            whatsapp_phone_number: $whatsapp_phone_number
        ) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            operatorId: operator_id
            address: address
            type: type
            city: city
            state: state
            zipcode: zipcode
            msa: msa
            propertyUrl: property_url
            externalPropertyId: external_property_id
            createdAt: created_at
            isActive: is_active
            property_id_mappings
            autodesk_url
            is_missing_info
            whatsapp_phone_number
        }
    }
`;

export const IMPORT_RENT_ROLL_FROM_ENTRATA = gql`
    mutation ImportRentRollFromEntrata($projectId: String) {
        importRentRollFromEntrata(project_id: $projectId)
    }
`;

export const MAP_FLOORPLAN_WITH_ENTRATA = gql`
    mutation MapEntrataFloorPlans($input: EntrataTailorbirdMap) {
        mapEntrataFloorPlans(input: $input)
    }
`;

export const MAP_UNIT_WITH_ENTRATA = gql`
    mutation MapEntrataUnits($input: EntrataTailorbirdMap) {
        mapEntrataUnits(input: $input)
    }
`;

// mutation UpdateProperty($propertyId: String, $name: String, $address: String, $type: String, $age: Int, $websiteUrl: String, $googleMapUrl: String, $isActive: Boolean) {
//   updateProperty(property_id: $propertyId, name: $name, address: $address, type: $type, age: $age, website_url: $websiteUrl, google_map_url: $googleMapUrl, is_active: $isActive) {
//     id
//     name
//     ownership_group_id
//     address
//     type
//     created_at
//     is_active
//   }
// }

export const SEND_WHATSAPP_MESSAGE = gql`
    mutation SendWhatsappMessage($input: SendWhatsappMessageInput) {
        sendWhatsappMessage(input: $input) {
            property_id
            property_name
            area_name
            recipient
            created_by
            floorplan_id
            request_wa_id
        }
    }
`;
