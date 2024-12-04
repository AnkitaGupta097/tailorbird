import { gql } from "@apollo/client";

export const GET_ALL_PROPERTIES = gql`
    query GetProperties {
        getProperties(is_active: true) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            address: address
            type: type
            createdAt: created_at
            isActive: is_active
            projects {
                type
                id
                name
            }
        }
    }
`;

export const GET_ARCHIVE_PROPERTIES = gql`
    query GetProperties {
        getProperties(is_active: false) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            address: address
            type: type
            createdAt: created_at
            isActive: is_active
            projects {
                type
                id
                name
            }
        }
    }
`;

// export const GET_ALL_ORGANIZATIONS = gql`
//     query GetAllOrganizations {
//         getAllOrganizations(organization_type: Ownership) {
//             id: id
//             name: name
//             createdBy: created_by
//             contactNumber: contact_number
//         }
//     }
// `;

// export const GET_USERS_BY_ORG_ID = gql`
//     query GetUsersByOrgId($orgId: String) {
//         getAllUsersByOrgId(orgId: $orgId) {
//             id: id
//             email: email
//             name: name
//             auth0Id: auth0Id
//             roles: roles
//             status: status
//             organizationId: organizationId
//             isFirstTimeLogin: isFirstTimeLogin
//             contactNumber: contactNumber
//             metadata {
//                 area_of_operation
//             }
//         }
//     }
// `;

// export const GET_ALL_USER = gql`
//     query getAllUsers {
//         getAllUsers {
//             id: id
//             name: name
//             organization {
//                 id
//                 name
//             }
//             email: email
//         }
//     }
// `;

export const CREATE_PROPERTY = gql`
    mutation CreateProperty(
        $name: String
        $ownership_group_id: String
        $operator_id: String
        $type: String
        $address: String
        $zipcode: String
    ) {
        createProperty(
            name: $name
            ownership_group_id: $ownership_group_id
            operator_id: $operator_id
            type: $type
            address: $address
            zipcode: $zipcode
        ) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            operatorId: operator_id
            address: address
            type: type
            createdAt: created_at
            isActive: is_active
        }
    }
`;

// export const DELETE_USER = gql`
// mutation deleteUser($deleteUserId: String) {
//     deleteUser(id: $deleteUserId) {
//         updated
//     }
// }
// `;

// export const CREATE_PROJECT_MERGE_FROM_OWNERSHIP = gql`
//     mutation CreateProjectFromOrganizationMerge($payload: CreateProjectFromOrganizationMerge) {
//         createProjectFromOrganizationMerge(payload: $payload) {
//             id
//             project_id
//             name
//             created_by
//             project_merge_reno_item_id
//             data {
//                 project_merge_reno_item_id
//                 category_cc_component
//                 scope_cc_component
//                 category_name
//                 scope_name
//                 merge_type
//             }
//         }
//     }
// `;

export const DELETE_PROPERTY = gql`
    mutation DeleteProperty($propertyId: String) {
        deleteProperty(property_id: $propertyId) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            address: address
            type: type
            createdAt: created_at
            isActive: is_active
        }
    }
`;

export const RESTORE_PROPERTY = gql`
    mutation UpdateProperty($propertyId: String, $isActive: Boolean) {
        updateProperty(property_id: $propertyId, is_active: $isActive) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            address: address
            type: type
            createdAt: created_at
            isActive: is_active
        }
    }
`;

// export const CREATE_PROJECT_FILES = gql`
//     mutation CreateProjectFiles($input: ProjectFileCreateInput) {
//         createProjectFiles(input: $input) {
//             id
//             signed_url
//         }
//     }
// `;

// export const MARK_FILE_UPLOADED = gql`
//     mutation MarkFileUploaded($fileId: Int) {
//         markFileUploaded(file_id: $fileId)
//     }
// `;

// export const GET_PROJECT_FILE = gql`
//     query GetProjectFile($fileId: Int) {
//         getProjectFile(file_id: $fileId) {
//             id
//             project_id
//             file_name
//             bucket_name
//             s3_file_path
//             s3_version_id
//             is_uploaded
//             is_active
//             file_type
//             created_at
//             uploaded_at
//             updated_at
//             created_by
//             deleted_by
//             signed_url
//             download_link
//             cdn_path
//             tags
//             system_remarks
//         }
//     }
// `;

// export const TRANSLATE_REVIT_FILE = gql`
//     mutation TranslateRevitFile($input: TranslateRevitFileInput) {
//         translateRevitFile(input: $input)
//     }
// `;
