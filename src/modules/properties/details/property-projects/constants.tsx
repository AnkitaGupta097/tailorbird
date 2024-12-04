import { gql } from "@apollo/client";

const PROPERTY_PROJECT_QUERY = gql`
    query GetProjects($propertyId: String, $version: String) {
        getProjects(property_id: $propertyId, version: $version) {
            id
            name
            project_type
            created_at
            version
        }
    }
`;

const CREATE_PROPERTY_PROJECT = gql`
    mutation createProject($input: ProjectCreationInput) {
        createProject(input: $input) {
            id
        }
    }
`;

export { PROPERTY_PROJECT_QUERY, CREATE_PROPERTY_PROJECT };
