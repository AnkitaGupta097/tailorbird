import { gql } from "@apollo/client";

export const GET_BID_BOOK = gql`
    query GetBidBook($projectId: String) {
        bidbook: getBidBook(project_id: $projectId) {
            bidbookUrl: bidbook_url
            folderUrl: folder_url
            disableExportButton: disable_export_button
            generateBidbookStatus: generate_bidbook_status
            rfpManagerSupported: is_contractor_portal_version
        }
    }
`;

export const CREATE_RENOVATION_VERSION = gql`
    mutation CreateRenovationVersion(
        $createRenovationVersionPayload: createRenovationVersionPayload
    ) {
        createRenovationVersion(createRenovationVersionPayload: $createRenovationVersionPayload) {
            id
            project_id
            renovation_version
            created_by
            created_at
            updated_at
        }
    }
`;
