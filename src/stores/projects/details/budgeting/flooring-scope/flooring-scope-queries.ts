import { gql } from "@apollo/client";

export const GET_RENOVATION_ITEMS = gql`
    query flooringRenovationItems($projectId: String) {
        renovations: group(project_id: $projectId) {
            id
            category
            item
            scope
            subcategory
            imageUrl: image_url
            description
            comments
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
            renovation_item_project_takeoffs_id
            take_offs {
                fp_id
                take_off_value
            }
            price_floor_plan {
                floor_plan_id
                price
            }
        }
    }
`;

export const GET_FLOORING_TAKEOFFS = gql`
    query Query($projectId: String) {
        flooringTakeOffs(project_id: $projectId) {
            flooringItems: flooring_items
            data {
                roomType: room_type
                subGroups: sub_groups {
                    subGroupId: sub_group_id
                    isDefault: is_default
                    selectedItem: selected_item
                }
            }
            createdBy: created_by
        }

        subGroups: getFloorPlanSubGroup(project_id: $projectId) {
            name
            id
            floorPlanGroupId: floor_plan_group_id
            isDefault: is_default
            projectId: project_id
        }
    }
`;
