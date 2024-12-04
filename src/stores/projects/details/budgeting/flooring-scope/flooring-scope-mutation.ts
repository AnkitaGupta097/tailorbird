import { gql } from "@apollo/client";

export const SETUP_GROUP = gql`
    mutation SetupGroup($projectId: String, $createdBy: String) {
        setupGroup(project_id: $projectId, created_by: $createdBy)
    }
`;

export const UPSERT_GROUP = gql`
    mutation UpsertGroup(
        $projectId: String
        $data: [RoomTypesWithSubGroupsReq]
        $createdBy: String
    ) {
        flooringScopeRenovations: upsertGroup(
            project_id: $projectId
            data: $data
            created_by: $createdBy
        ) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            finish
            workType: work_type
            uom
            location
            qualifier
            manufacturer
            modelNo: model_no
            supplier
            itemNo: item_no
            unitCost: unit_cost
            workId: work_id
            inventoryId: inventory_id
            subGroupId: sub_group_id
        }
    }
`;

export const DELETE_GROUP = gql`
    mutation DeleteGroup($projectId: String, $updatedBy: String) {
        deleteGroup(project_id: $projectId, updated_by: $updatedBy)
    }
`;
