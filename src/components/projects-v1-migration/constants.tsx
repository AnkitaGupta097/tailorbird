import { gql } from "@apollo/client";

const TAG_PROPERTY = gql`
    mutation TagProperty(
        $propertyId: String
        $projectIds: [String]
        $ownershipId: String
        $propertyName: String
        $propertyType: String
    ) {
        tagProperty(
            property_id: $propertyId
            project_ids: $projectIds
            ownership_id: $ownershipId
            property_name: $propertyName
            property_type: $propertyType
        )
    }
`;

const GET_PROJECTS = gql`
    query getProjects($version: String) {
        getProjects(version: $version) {
            id
            name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city
            projectType: project_type
            state
            zipcode
            userId: user_id
            createdAt: created_at
            isDeleted: is_deleted
            opportunityId: opportunity_id
            version
            organization {
                name
            }
            property_id
            system_remarks
        }
    }
`;

const MIGRATE_PROJECTS = gql`
    mutation MigrateProjects(
        $propertyId: String
        $interiorProjectId: String
        $commonAreaProjectId: String
        $exteriorProjectId: String
    ) {
        migrateProjects(
            property_id: $propertyId
            interior_project_id: $interiorProjectId
            common_area_project_id: $commonAreaProjectId
            exterior_project_id: $exteriorProjectId
        ) {
            errors
        }
    }
`;

export { GET_PROJECTS, TAG_PROPERTY, MIGRATE_PROJECTS };
