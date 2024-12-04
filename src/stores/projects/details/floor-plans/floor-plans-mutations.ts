import { gql } from "@apollo/client";

export const CREATE_FLOORING_SPLIT = gql`
    mutation createFlooringSplit($id: String) {
        createFlooringSplit(project_id: $id)
    }
`;

export const UPDATE_FLOORING_SPLIT_TABLE_COUNT = gql`
    mutation updateFlooringSplitTable($input: UpdateFlooringSplitCountInput) {
        floorSplits: updateFlooringSplitCounts(update_flooring_split_counts_input: $input) {
            error
            response {
                subGroupId: sub_group_id
                unitsCount: units_count
                floorPlanId: floor_plan_id
            }
        }
    }
`;

export const UPDATE_INVENTORY_MIX = gql`
    mutation updateInventoryMix($input: UpdateInventoryMixInput) {
        updateInventoryMix(update_inventory_mix: $input) {
            error
        }
    }
`;

export const UPDATE_UNIT_MIX = gql`
    mutation UpdateUnitMix($input: UnitMixInput) {
        updateUnitMix(input: $input) {
            error
            success
        }
    }
`;

export const CREATE_FLOOR_PLAN = gql`
    mutation CreateFloorPlan($input: FloorPlanCreateInput) {
        createFloorPlan(input: $input) {
            id
            projectId: project_id
            name
            type
            commercial_name
            unit_type
            renoUnits: reno_units
            bathsPerUnit: baths_per_unit
            bedsPerUnit: beds_per_unit
            totalUnits: total_units
            area
            takeOffType: take_off_type
            areas_json
            areaUom: area_uom
            createdAt: created_at
            updatedAt: updated_at
            remarks {
                dsType: ds_type
                dsFileId: ds_file_id
            }
            autodesk_url
            isHavingMissingInfo: is_missing_info
        }
    }
`;

export const UPDATE_FLOOR_PLAN = gql`
    mutation UpdateFloorPlan($input: FloorPlanUpdateInput) {
        updateFloorPlan(input: $input) {
            id
            projectId: project_id
            name
            type
            commercial_name
            unit_type
            renoUnits: reno_units
            bathsPerUnit: baths_per_unit
            bedsPerUnit: beds_per_unit
            totalUnits: total_units
            area
            takeOffType: take_off_type
            areas_json
            areaUom: area_uom
            createdAt: created_at
            updatedAt: updated_at
            remarks {
                dsType: ds_type
                dsFileId: ds_file_id
            }
            autodesk_url
            isHavingMissingInfo: is_missing_info
        }
    }
`;

export const DELETE_FLOOR_PLAN = gql`
    mutation DeleteFloorPlan($input: FloorPlanDeleteInput) {
        deleteFloorPlan(input: $input)
    }
`;
