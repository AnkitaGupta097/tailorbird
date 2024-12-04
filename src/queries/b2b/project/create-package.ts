import { gql } from "@apollo/client";

export const GET_DATA_FOR_SEARCH_FILTERS = gql`
    query getPackageCreateSearchFilters($input: PackageSearchFilterInput) {
        getPackageCreateSearchFilters(input: $input) {
            category
            subcategory
            finish
            style
            grade
            supplier
            package {
                name
                id
            }
            subcategory_pair {
                category
                subcategory
            }
        }
    }
`;
