import { gql } from "@apollo/client";

export const DELETE_VARIATION = gql`
    mutation deleteVariation($id: String) {
        deleteVariation(id: $id)
    }
`;

export const UPDATE_VARIATION_DETAILS = gql`
    mutation updateVariation(
        $id: String
        $floorplans: [FloorplanDetailsForVariation]
        $updated_by: String
    ) {
        variations: updateVariation(id: $id, floorplans: $floorplans, updated_by: $updated_by) {
            id
            name
            variationCount: variation_count
            takeOffsInSync: take_offs_in_sync
        }
    }
`;

export const CREATE_VARIATION_DETAILS = gql`
    mutation createVariation(
        $category: String
        $item: String
        $project_id: String
        $project_codex_id: String
        $floorplans: [FloorplanDetailsForVariation]
        $created_by: String
    ) {
        variations: createVariation(
            category: $category
            item: $item
            project_id: $project_id
            project_codex_id: $project_codex_id
            floorplans: $floorplans
            created_by: $created_by
        ) {
            id
            name
            variationCount: variation_count
            takeOffsInSync: take_offs_in_sync
        }
    }
`;
