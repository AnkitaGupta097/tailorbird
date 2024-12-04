import { gql } from "@apollo/client";

export const ADD_BASE_PACKAGE = gql`
    mutation assignBasePackage(
        $packageId: String
        $projectId: String
        $ownershipGroupId: String
        $createdBy: String
    ) {
        basePackage: assignBasePackage(
            package_id: $packageId
            project_id: $projectId
            ownership_group_id: $ownershipGroupId
            created_by: $createdBy
        ) {
            id
            name
            ownership
            location
        }
    }
`;

export const DELETE_BASE_PACKAGE = gql`
    mutation RemoveBasePackage($projectId: String, $createdBy: String) {
        removeBasePackage(project_id: $projectId, created_by: $createdBy)
    }
`;
