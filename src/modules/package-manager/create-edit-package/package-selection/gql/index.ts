import { gql } from "@apollo/client";

export const UPDATE_MATERIAL_THUMBNAIL = gql`
    mutation UpdateMaterialThumbnail($input: UpdateThumbnail) {
        updateMaterialThumbnail(input: $input) {
            id
            category
            subcategory
            name
            manufacturer
            model_id
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

export const softDeleteMaterial = gql`
    mutation softDeleteMaterial($input: String) {
        softDeleteMaterial(input: $input) {
            material_id
        }
    }
`;
