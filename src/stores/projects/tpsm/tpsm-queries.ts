import { gql } from "@apollo/client";

export const GET_ALL_PROJECTS = gql`
    query getProjects($version: String) {
        getProjects(version: $version) {
            id
            name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city
            projectType: project_type
            state
            zipcode
            userId: user_id
            createdAt: created_at
            isDeleted: is_deleted
            opportunityId: opportunity_id
            version
        }
    }
`;

export const GET_ARCHIVE_PROJECTS = gql`
    query getArchivedProjects($version: String) {
        getArchivedProjects(version: $version) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city: city
            projectType: project_type
            state: state
            zipcode: zipcode
            userId: user_id
            createdAt: created_at
            opportunityId: opportunity_id
            version
        }
    }
`;

export const GET_ALL_ORGANIZATIONS = gql`
    query GetAllOrganizations($organizationType: OrganizationType) {
        getAllOrganizations(organization_type: $organizationType) {
            id
            name
            street_name
            city
            state
            ownership_url
            zip_code
            google_workspace_email
            created_by
            contact_number
            organization_type
            primary_tb_contact
        }
    }
`;

export const GET_USERS_BY_ORG_ID = gql`
    query GetUsersByOrgId($orgId: String) {
        getAllUsersByOrgId(orgId: $orgId) {
            id: id
            email: email
            name: name
            auth0Id: auth0Id
            roles: roles
            status: status
            organizationId: organizationId
            isFirstTimeLogin: isFirstTimeLogin
            contactNumber: contactNumber
            metadata {
                area_of_operation
            }
        }
    }
`;

export const GET_ALL_USER = gql`
    query getAllUsers {
        getAllUsers {
            id: id
            name: name
            organization {
                id
                name
            }
            email: email
        }
    }
`;

export const CREATE_PROJECT = gql`
    mutation createProject($input: ProjectCreationInput) {
        createProject(input: $input) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city: city
            projectType: project_type
            state: state
            zipcode: zipcode
            userId: user_id
            createdAt: created_at
            isDeleted: is_deleted
        }
    }
`;

export const ADD_PROPERTY_OR_PROJECT_REQUEST = gql`
    mutation propertyOrProjectRequest($input: PropertyOrProjectRequestInput) {
        propertyOrProjectRequest(input: $input)
    }
`;

export const DELETE_PROJECT = gql`
    mutation archiveProject($projectId: String) {
        archiveProject(project_id: $projectId) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city: city
            projectType: project_type
            state: state
            zipcode: zipcode
            userId: user_id
            createdAt: created_at
            isDeleted: is_deleted
            opportunityId: opportunity_id
        }
    }
`;

export const RESTORE_PROJECT = gql`
    mutation undoArchiveProject($projectId: String) {
        undoArchiveProject(project_id: $projectId) {
            id: id
            name: name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city: city
            projectType: project_type
            state: state
            zipcode: zipcode
            userId: user_id
            createdAt: created_at
            isDeleted: is_deleted
            opportunityId: opportunity_id
        }
    }
`;

export const CREATE_PROJECT_FILES = gql`
    mutation CreateProjectFiles($input: ProjectFileCreateInput) {
        createProjectFiles(input: $input) {
            id
            project_id
            file_name
            bucket_name
            s3_file_path
            s3_version_id
            is_uploaded
            is_active
            file_type
            created_at
            uploaded_at
            updated_at
            created_by
            deleted_by
            signed_url
            download_link
            cdn_path
            tags
            system_remarks
        }
    }
`;

export const MARK_FILE_UPLOADED = gql`
    mutation MarkFileUploaded($fileId: Int) {
        markFileUploaded(file_id: $fileId)
    }
`;

export const GET_PROJECT_FILE = gql`
    query GetProjectFile($fileId: Int) {
        getProjectFile(file_id: $fileId) {
            id
            project_id
            file_name
            bucket_name
            s3_file_path
            s3_version_id
            is_uploaded
            is_active
            file_type
            created_at
            uploaded_at
            updated_at
            created_by
            deleted_by
            signed_url
            download_link
            cdn_path
            tags
            system_remarks
        }
    }
`;

export const TRANSLATE_REVIT_FILE = gql`
    mutation TranslateRevitFile($input: TranslateRevitFileInput) {
        translateRevitFile(input: $input)
    }
`;

export const UPDATE_INVOICE_BY_ID = gql`
    mutation UpdateInvoiceById($invoiceId: Int!, $invoiceName: String, $fileIds: [Int!]) {
        updateInvoiceById(invoiceId: $invoiceId, invoiceName: $invoiceName, fileIds: $fileIds) {
            supportingDocIds
        }
    }
`;

export const GET_INVOICE_SUPPORTED_DOCUMENTS = gql`
    query GetInvoiceSupportedDocuments($invoiceId: Int!) {
        getInvoiceSupportedDocuments(invoiceId: $invoiceId) {
            fileName
            fileId
        }
    }
`;

export const DELETE_INVOICE_SUPPORTING_DOCS = gql`
    mutation DeleteInvoiceSupportingDocs($invoiceId: Int!, $fileId: Int!) {
        deleteInvoiceSupportingDocs(invoiceId: $invoiceId, fileId: $fileId) {
            supportingDocIds
        }
    }
`;
