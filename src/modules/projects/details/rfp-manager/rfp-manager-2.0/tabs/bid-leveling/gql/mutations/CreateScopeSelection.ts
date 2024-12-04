import { gql } from "@apollo/client";

export const CREATE_SCOPE_SELECTION = gql`
    mutation CreateScopeSelection(
        $projectId: String!
        $userId: String!
        $itemsSelection: [ItemsSelection]
    ) {
        createScopeSelection(
            project_id: $projectId
            user_id: $userId
            items_selection: $itemsSelection
        ) {
            project_id
            updated_at
            updated_by
            items_selection {
                id
                is_selected
            }
        }
    }
`;
