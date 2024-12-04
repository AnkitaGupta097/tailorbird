import { gql } from "@apollo/client";

export const ACTIVATE_PROPERTY_UNIT = gql`
    mutation ActivatePropertyUnit($unitId: String) {
        activatePropertyUnit(unit_id: $unitId) {
            success
        }
    }
`;

export const DEACTIVATE_PROPERTY_UNIT = gql`
    mutation DeactivatePropertyUnit($unitId: String) {
        deactivatePropertyUnit(unit_id: $unitId) {
            success
        }
    }
`;

export const CREATE_PROPERTY_UNIT = gql`
    mutation CreatePropertyUnit(
        $projectId: String
        $unitName: String
        $floorPlanId: String
        $rentRollId: String
        $renoScope: String
        $area: Float
        $floor: Floor
    ) {
        createPropertyUnit(
            project_id: $projectId
            unit_name: $unitName
            floor_plan_id: $floorPlanId
            rent_roll_id: $rentRollId
            reno_scope: $renoScope
            area: $area
            floor: $floor
        ) {
            id
        }
    }
`;
