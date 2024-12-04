import { gql } from "@apollo/client";

export const GET_LIVE_AGREEMENTS = gql`
    query GetLiveAgreementData($projectId: String) {
        getLiveAgreementData(project_id: $projectId) {
            scope_names
            floor_plans {
                fp_name
                scopes {
                    scope_name
                    price
                }
                units {
                    unit_name
                    scopes {
                        scope_name
                        price
                    }
                }
            }
        }
    }
`;
