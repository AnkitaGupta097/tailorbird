import { gql } from "@apollo/client";

export const UPDATE_RENOVATION_ITEMS = gql`
    mutation UpdateSkuForRenovation($input: [UpdateSkuForRenovationPayload]) {
        updateSkuForRenovation(updateSkuForRenovationPayload: $input)
    }
`;

export const DEFINE_INVENTORY = gql`
    mutation DefineInventory($payload: DefineInventoryPayload) {
        renovations: defineInventory(payload: $payload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
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
        }
    }
`;

export const UPDATE_INVENTORY = gql`
    mutation updateInventory($payload: UpdateInventoryPayload) {
        renovations: updateInventory(payload: $payload) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
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
        }
    }
`;

export const UNDEFINED_INVENTORY = gql`
    mutation UndefineInventory($inventoryId: String) {
        undefineInventory(inventory_id: $inventoryId) {
            id
        }
    }
`;

export const UPDATE_SCOPE_OF_EXISTING_ITEM = gql`
    mutation createNewItem($input: NewItemInput) {
        createNewItem(input: $input) {
            codex
            location
            item
            scope_item
            version
        }
    }
`;
