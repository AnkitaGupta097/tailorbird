import { gql } from "@apollo/client";

export const GET_ALL_VARIATION_DETAILS = gql`
    query variation($id: String) {
        variationDetails: floorPlansWithTakeOffsForVariation(variation_id: $id) {
            item
            floorplans {
                fpName: fp_name
                fpId: fp_id
                fpType: fp_type
                fpTotalQty: fp_take_off
                locations {
                    name
                    takeOff: take_off
                }
            }
        }
    }
`;

export const GET_ALL_VARIATIONS = gql`
    query variations($projectId: String) {
        variations: variations(project_id: $projectId) {
            id
            name
            variationCount: variation_count
            takeOffsInSync: take_offs_in_sync
        }
    }
`;

export const GET_VARIATION_INIT_ITEMS = gql`
    query projectContainerItemsWithCategory($id: String) {
        initItems: projectContainerItemsWithCategory(project_id: $id) {
            item
            category
            projectCodexId: project_codex_id
        }
    }
`;

export const GET_ALL_FLOOR_PLANS = gql`
    query floorPlansWithTakeOffsForAnItem($projectCodexId: String) {
        floorplans: floorPlansWithTakeOffsForAnItem(project_codex_id: $projectCodexId) {
            fpId: fp_id
            fpName: fp_name
            fpType: fp_type
            fpTotalQty: fp_take_off
        }
    }
`;
