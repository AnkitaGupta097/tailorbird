import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
    query getProjects {
        getProjects {
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
            status
            property_id
            system_remarks
        }
    }
`;

export const GET_PROJECTS_WITH_FILTERS = gql`
    query GetProjectsWithFilters($projectFilters: [ProjectFiltersInput]) {
        getProjectsWithFilters(ProjectFilters: $projectFilters) {
            projects {
                id
                name
                city
                state
                ownershipGroupId: ownership_group_id
                streetAddress: street_address
                ownership_group_name
                projectType: project_type
                status
            }
        }
    }
`;
