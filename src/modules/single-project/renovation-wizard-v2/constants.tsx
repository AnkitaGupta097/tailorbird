import { gql } from "@apollo/client";

export const GET_PROJECT_BASE_PACKAGE = gql`
    query GetBasePackage($input: BasePackageSearchInput) {
        getBasePackage(input: $input) {
            project_id
            package_id
            ownership_group_id
            ownership_group_name
            derived_from
        }
    }
`;

export const GET_PACKAGE_BY_ID = gql`
    query GetPackage($input: String) {
        getPackage(input: $input) {
            material_id: id
            name
            description
            user_id
            materials {
                material_id: id
                category
                subcategory
                manufacturer
                model_id
                description
                uom
                style
                grade
                finish
                url
                primary_thumbnail
                suppliers {
                    supplier_id: id
                    supplier_name: supplier
                    sku_id
                    uom
                    url
                }
            }
            labor {
                labor_id: id
                location
                category
                subcategory
                uom
                ref_price
                cost_code
                description
            }
        }
    }
`;
export const EXCLUDED_RENO_ITEMS_CATEGORIES = ["Tax", "General Conditions", "Profit & Overhead"];
