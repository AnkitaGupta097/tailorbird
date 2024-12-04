import { gql } from "@apollo/client";

export const addNewMaterialItem = gql`
    mutation addNewMaterialItem($input: AddMaterial) {
        addNewMaterialItem(input: $input) {
            material_id: id
            location
            category
            subcategory
            manufacturer_or_supplier
            model_number_or_item_number
            is_adhoc
            description
            high_price
            ref_price
            low_price
            uom
            cost_code
            style
            grade
            finish
            url
            primary_thumbnail
            created_by
            created_at
            updated_by
            updated_at
        }
    }
`;

export const updateMaterial = gql`
    mutation updateMaterial($input: updateMaterial) {
        updateMaterial(input: $input) {
            id
            description
            style
            grade
            finish
            updated_by
        }
    }
`;
