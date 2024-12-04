import { gql } from "@apollo/client";

export const GET_OWNERSHIP_LIST = gql`
    query getOwnershipList {
        ownershipList {
            id
            name
        }
    }
`;

export const GET_MDM_CONTAINER_TREE = gql`
    query ContainerTree($containerType: String, $containerVersion: String) {
        containerTree(container_type: $containerType, container_version: $containerVersion) {
            name
            items {
                name
                component
                scopes {
                    name
                    containerItemIds: container_item_ids
                    isSelected: is_selected
                }
                uom
            }
        }
    }
`;
//   updatedOn: updated_on to be added after api update
export const GET_SCOPE_LIBRARIERS_LIST = gql`
    query ScopeLibraries {
        scopeLibraries {
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
            updatedOn: updated_on
            type: scope_type
        }
    }
`;

export const GET_SCOPE_LIBRARY = gql`
    query ScopeLibrary($id: String) {
        scopeLibrary(id: $id) {
            name
            items {
                name
                component
                scopes {
                    name
                    containerItemIds: container_item_ids
                    isSelected: is_selected
                }
                uom
            }
        }
    }
`;
export const GET_SCOPE_MERGE_RENO_ITEMS_BY_OWNERSHIP = gql`
    query scopeMergeRenoItem($organizationId: String) {
        scopeMergeRenoItem(organization_id: $organizationId) {
            id
            organization_id
            name
            created_by
            data {
                merge_reno_item_id
                category_cc_component
                scope_cc_component
                category_name
                scope_name
                merge_type
            }
        }
    }
`;

export const GET_PROJECT_MERGE_RENO_ITEMS = gql`
    query ProjectMergeRenoItem($projectId: String) {
        projectMergeRenoItem(project_id: $projectId) {
            id
            project_id
            name
            created_by
            project_merge_reno_item_id
            data {
                project_merge_reno_item_id
                category_cc_component
                scope_cc_component
                category_name
                scope_name
                merge_type
            }
        }
    }
`;

export const GET_DEPENDANT_SCOPE_ITEMES = gql`
    query GetDependentScopes {
        getDependentScopes {
            category
            item_name
            scope
            dependent_scopes {
                category
                item_name
                scope
            }
        }
    }
`;
