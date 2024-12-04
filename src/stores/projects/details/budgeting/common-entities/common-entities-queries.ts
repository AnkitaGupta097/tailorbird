import { gql } from "@apollo/client";

export const GET_ALL_COMMON_ENTITIES = gql`
    query getCommonEntities($ownershipId: String, $projectType: String, $containerVersion: String) {
        packages: basePackages(
            ownership_group_id: $ownershipId
            container_version: $containerVersion
        ) {
            id
            name
            ownership
            location
        }
        scopeLibraries(
            ownership_group_id: $ownershipId
            project_type: $projectType
            container_version: $containerVersion
        ) {
            id
            name
            ownership
            description
            containerVersion: container_version
            ownershipGroupId: ownership_group_id
        }
    }
`;

export const GET_BUDGETING_META_DATA = gql`
    query getBudgetingMetaData($projectId: String) {
        meta: budgetMetadata(project_id: $projectId) {
            isAltScopeDefined: is_alt_scope_defined
            isFlooringScopeDefined: is_flooring_scope_defined
            isFloorSplit: is_floor_split
        }
    }
`;
