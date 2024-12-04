import { gql } from "@apollo/client";

export const GET_PROJECTS_WITH_FILTER = gql`
    query getProjectsWithFilters($filters: [ProjectFiltersInput]) {
        getProjectsWithFilters(ProjectFilters: $filters) {
            projects {
                id
                name
                city
                state
                street_address
                ownership_group_id
                ownership_group_name
                project_type
                status
            }
            filters {
                name
                parent
                order
                filter_values {
                    value
                    count
                }
            }
        }
    }
`;
