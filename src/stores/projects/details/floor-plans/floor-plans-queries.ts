import { gql } from "@apollo/client";

const subGroupsQuery = `
    subGroups: getFloorPlanSubGroup(project_id: $id) {
        id
        floorPlanGroupId: floor_plan_group_id
        isDefault: is_default
        name
    }
    subGroupMappers: getFloorPlanSubGroupMapper(project_id: $id) {
        id
        floorPlanId: floor_plan_id
        subGroupId: sub_group_id
        unitsCount: units_count
    }
`;

const inventoryMixQuery = `
    inventories: getInventory(project_id: $id) {
        id
        name
        isDefault: is_default
        projectId: project_id
        createdAt: created_at
        createdBy: created_by
        updatedAt: updated_at
        updatedBy: updated_by
        deletedAt: deleted_at
        deletedBy: deleted_by
    }
    inventoryMixes: getInventoryMix(project_id: $id) {
        id
        count
        inventoryId: inventory_id
        floorplanId: floor_plan_id
        projectId: project_id
        createdAt: created_at
        createdBy: created_by
        updatedAt: updated_at
        updatedBy: updated_by
        deletedAt: deleted_at
        deletedBy: deleted_by
    }
`;

export const GET_ALL_FLOOR_SPLIT_DATA = gql`
    query getFloorSplitData($id: String){
        ${subGroupsQuery}
    }
`;

export const GET_ALL_INVENTORY_MIX_DATA = gql`
    query getInventoryMixData($id: String) {
        ${inventoryMixQuery}
    }
`;

export const GET_USER_REMARK = gql`
    query Query($projectId: String, $location: String) {
        getProjectUserRemarks(project_id: $projectId, remark_type: $location) {
            id
            remark
            user_id
            created_at
        }
    }
`;

export const GET_ALL_FLOOR_PLAN_DATA = gql`
    query getFloorplanData($id: String) {
        floorplans: getProjectFloorPlans(project_id: $id) {
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
            cdn_paths
            autodesk_url
            isHavingMissingInfo:is_missing_info
            missingInfo:missing_media {
                id
                file_name
                is_active
                file_type
                created_at
                uploaded_at
                updated_at
                created_by
                deleted_by
                signed_url
                cdn_path
              }
              whatsapp_phone_number
            
        } 
        ${subGroupsQuery}
        ${inventoryMixQuery}
    }
`;

export const GET_UNIT_MIX_DATA = gql`
    query Query($projectId: String) {
        getProjectFloorPlans(project_id: $projectId) {
            id
            projectId: project_id
            name
            type
            commercial_name
            unit_type
            renoUnits: reno_units
            totalUnits: total_units
            area
            areaUom: area_uom
            revitMetadata {
                id
                name
                is_active
                is_translated
                floor_plan_id
                system_remarks
            }
        }
        getInventory(project_id: $projectId) {
            id
            isDefault: is_default
            name
        }
        getInventoryMix(project_id: $projectId) {
            count
            floor_plan_id
            inventory_id
        }
        getUnitMixes(project_id: $projectId) {
            created_at
            id
            inventory_id
            project_id
            property_unit_id
            updated_at
            is_renovated
            floor
        }
        getPropertyUnits(project_id: $projectId) {
            created_at
            details_json
            floor_plan_id
            id
            is_active
            project_id
            rent_roll_id
            unit_name
            updated_at
            floor
            area
        }
    }
`;

export const GET_UNIT_MIXES = gql`
    query GetUnitMixes($projectId: String, $propertyId: String) {
        getUnitMixes(project_id: $projectId, property_id: $propertyId) {
            updated_at
            unit_type
            property_unit_name
            property_unit_id
            project_id
            is_renovated
            inventory_name
            inventory_id
            floor
            id
            created_at
            property_unit_floor_plan_id
            floorplan_name
        }
        getFloorPlanSubGroup(project_id: $projectId) {
            name
            id
            floor_plan_group_id
            is_default
            project_id
        }
    }
`;
