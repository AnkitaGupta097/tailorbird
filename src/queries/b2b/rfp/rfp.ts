import { gql } from "@apollo/client";

export const GET_RFP_BY_PROJECTID = gql`
    query GetRFPByProjectId($project_id: String) {
        getRFPByProjectId(project_id: $project_id) {
            _id
            is_deleted
            name
            project_id
            due_date
            rfp_contractors {
                rfp_contractor_id
                contractor_data {
                    id
                    name
                    email
                    contactNumber
                    status
                    organization_id
                    organization {
                        name
                    }
                    metadata {
                        area_of_operation
                    }
                }
                is_recommended
                company_name
            }
            target_budget
            package {
                _id
                description
                current_version
                is_scheduled
                scheduled_date
                file_revision {
                    description
                    version
                    file_url
                    file_name
                    created_on
                }
            }
            rfp_package_logs {
                description
                package_name
                created_on
                file {
                    description
                    version
                    file_url
                    file_name
                }
            }
        }
    }
`;

export const GET_ALL_CONTRACTORS_FOR_PROJECT = gql`
    query GetAllContractors($project_id: String) {
        getAllContractors(project_id: $project_id) {
            _id
            is_deleted
            name
            project_id
            due_date
            rfp_contractors {
                rfp_contractor_id
                contractor_data {
                    id
                    name
                    email
                    contactNumber
                    status
                    organization_id
                    organization {
                        name
                    }
                    metadata {
                        area_of_operation
                    }
                }
                is_recommended
            }
            target_budget
        }
    }
`;

export const GET_ALL_RECOMMENDED_CONTRACTORS = gql`
    query GetAllRecommendedContractors {
        getAllRecommendedContractors {
            name
            email
            contactNumber
            organization {
                name
            }
            metadata {
                area_of_operation
            }
        }
    }
`;

export const GET_RFP_CONTRACTS_BY_RFP_ID = gql`
    query GetRfpContractsAndResponseByRfpId($rfp_id: String) {
        getRfpContractsAndResponseByRfpId(rfp_id: $rfp_id) {
            _id
            status
            project_id
            rfp_id
            rfp_due_date
            rfp_response_status
            is_deleted
            contractor_user_id
            rfp_response {
                package_id
                modification_note {
                    modified_on
                    modification_note
                    modified_by
                }
                current_version
                file_revision {
                    file_name
                    file_url
                    version
                    created_on
                }
                description
            }
            modification_note {
                modified_on
                modification_note
                modified_by
            }
            userDetails {
                name
                id
                email
                contactNumber
                organization {
                    name
                }
                metadata {
                    area_of_operation
                }
            }
        }
    }
`;

export const UPLOAD_COST_COMPARISON_DOC = gql`
    mutation UploadCostComparisonDoc($cost_summary_id: String, $input: InputCostComparisionFiles) {
        uploadRfpResponseDocument(cost_summary_id: $cost_summary_id, input: $input) {
            cost_comparison_doc {
                file_revision {
                    file_name
                    file_url
                    version
                    created_on
                }
            }
        }
    }
`;
