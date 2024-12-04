import { gql } from "@apollo/client";

export const GET_PRODUCTION_FEATURES = gql`
    query Query($projectId: String) {
        getProductionFeatureAccess(project_id: $projectId)
    }
`;

export const GET_CONSTANTS = gql`
    query Query($projectId: String) {
        getConstants(project_id: $projectId)
    }
`;

export const MAP_USER_TO_PROJECT = gql`
    mutation MapUserToProject($input: UserResourceInput!) {
        mapUserToProject(input: $input) {
            message
            id
        }
    }
`;

export const REMOVE_USER_FROM_PROJECT = gql`
    mutation RemoveUserFromProject($input: RemoveUserInput!) {
        removeUserFromProject(input: $input) {
            message
        }
    }
`;

export const GET_RESOURCE_ACCESS = gql`
    query getResourceAccess($projectId: String) {
        getResourceAccess(project_id: $projectId) {
            id
            permission
            resource_id
            user_id
        }
    }
`;
