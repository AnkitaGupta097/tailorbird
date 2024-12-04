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
            management: management
            managementUrl: management_url
            userId: user_id
            projectType: project_type
            isDeleted: is_deleted
            system_remarks
            opportunityId: opportunity_id
            rfp_bid_details
            version
            status
            organisation_container_id
            max_bidders
            is_restricted_max_bidders
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
            downloadLink: download_link
        }
        latestRenovationVersion(project_id: $projectId) {
            created_at
            renovation_version
        }
    }
`;

export const GET_RENT_ROLL = gql`
    query GetRentRoll($projectId: String) {
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
            downloadLink: download_link
        }
    }
`;

export const UPDATE_PROJECT = gql`
    mutation updateProjectById($project_id: String, $input: ProjectCreationInput) {
        updateProject(project_id: $project_id, input: $input) {
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
            perUnitTargetBudget: per_unit_target_budget
            management: management
            managementUrl: management_url
            userId: user_id
            opportunityId: opportunity_id
            rfp_bid_details
            status: status
        }
    }
`;

export const UPDATE_PROJECT_STATUS = gql`
    mutation UpdateProjectStatus($input: ProjectStatusRequest) {
        updateProjectStatus(input: $input) {
            created_at
            created_by
            project_id
            status
        }
    }
`;
