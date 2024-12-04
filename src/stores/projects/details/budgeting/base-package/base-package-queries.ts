import { gql } from "@apollo/client";

export const GET_PROJECT_BASE_PACKAGE = gql`
    query BasePackage($projectId: String) {
        basePackage(project_id: $projectId) {
            id
            name
            ownership
            location
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
