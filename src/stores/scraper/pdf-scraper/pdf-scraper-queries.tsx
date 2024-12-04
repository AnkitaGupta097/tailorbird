import { gql } from "@apollo/client";

export const getExtractedText = gql`
    query getExtractedText($job_id: String) {
        getExtractedText(job_id: $job_id) {
            spec_file {
                created_at
                file_name
                id
                job_id
                parsed_file_reference
                updated_at
            }
        }
    }
`;

export const getExtractedSKUS = gql`
    query getExtractedSKUS($job_id: String) {
        getExtractedSKUS(job_id: $job_id) {
            skus {
                created_at
                id
                is_valid
                sku
                spec_file_id
                system_identified
                updated_at
                url
                url_text
            }
        }
    }
`;

export const updateSelectedSKUs = gql`
    mutation updateSelectedSKUs($job_id: String, $skus: [String]) {
        updateSelectedSKUs(job_id: $job_id, skus: $skus) {
            status
        }
    }
`;

export const startScraping = gql`
    mutation startScraping($job_id: String) {
        startScraping(job_id: $job_id) {
            status
        }
    }
`;

export const getFoundSKUsData = gql`
    mutation getFoundSKUsData($job_id: String) {
        getFoundSKUsData(job_id: $job_id) {
            status
        }
    }
`;
