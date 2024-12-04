import { gql } from "@apollo/client";

export const UPSERT_SCOPE_LIBRARY = gql`
    mutation UpsertScopeLibrary($payload: UpsertScopeLibraryPayload) {
        scopeLibrary: upsertScopeLibrary(payload: $payload) {
            id
            name
            description
            createdBy: created_by
            scopeType: scope_type
            ownership
            ownershipGroupId: ownership_group_id
            projectsReferred: projects_referred
            projectType: project_type
            containerVersion: container_version
        }
    }
`;

export const COPY_SCOPE_LIBRARY = gql`
    mutation CopyScopeLibrary($payload: CopyScopeLibraryPayload) {
        scopeLibrary: copyScopeLibrary(payload: $payload) {
            id
            name
            description
            createdBy: created_by
            scopeType: scope_type
            ownership
            ownershipGroupId: ownership_group_id
            projectsReferred: projects_referred
            projectType: project_type
            containerVersion: container_version
        }
    }
`;

export const DELETE_SCOPE_LIBRARY = gql`
    mutation DeleteScopeLibrary($deleteScopeLibraryId: String) {
        deleteScopeLibrary(id: $deleteScopeLibraryId)
    }
`;

export const UPSERT_SCOPE_MERGE = gql`
    mutation upsertMergeRenoItem($payload: UpsertMergeRenoItemPayload) {
        upsertMergeRenoItem(payload: $payload) {
            id
            organization_id
            name
            created_by
            data {
                category_name
                scope_name
                scope_cc_component
                category_cc_component
                merge_type
            }
        }
    }
`;
export const UPSERT_PROJECT_MERGE_RENO_ITEM = gql`
    mutation UpsertMergeRenoItems($payload: UpsertProjectMergeRenoItemPayload) {
        upsertProjectMergeRenoItem(payload: $payload) {
            project_id
            name
            id
            data {
                scope_name
                scope_cc_component
                category_cc_component
                category_name
                project_merge_reno_item_id
                merge_type
            }
            created_by
        }
    }
`;

export const CREATE_NEW_SCOPE_FOR_AN_SUBCAT_ITEM = gql`
    mutation createContainerItemV2($input: CreateItemV2) {
        createContainerItemV2(input: $input) {
            containerItemId: id

            category
            component
            item_name
            subcategory
            scope
        }
    }
`;
