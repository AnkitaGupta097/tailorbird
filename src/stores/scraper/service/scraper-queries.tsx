import { gql } from "@apollo/client";

export const getListofScrapingJobs = gql`
    query getListofScrapingJobs {
        getListofScrapingJobs {
            name
            description
            ownership_name
            job_id
            status
            file_name
            created_at
            created_by
        }
    }
`;

export const getJobStatus = gql`
    query getJobStatus($job_id: String) {
        getJobStatus(job_id: $job_id) {
            status
            completed
            total
            failed
        }
    }
`;
export const exportFile = gql`
    query exportFile($job_id: String) {
        exportFile(job_id: $job_id) {
            file
        }
    }
`;

export const postNewScrapeJob = gql`
    mutation postNewScrapeJob(
        $name: String
        $ownership_name: String
        $ownership_group_id: String
        $description: String
        $created_by: String
        $file_name: String
    ) {
        postNewScrapJob(
            name: $name
            ownership_name: $ownership_name
            ownership_group_id: $ownership_group_id
            description: $description
            created_by: $created_by
            file_name: $file_name
        ) {
            job_id
        }
    }
`;

export const scrapeFromLink = gql`
    mutation scrapeFromLink($url: String) {
        scrapeFromLink(url: $url) {
            error
            errorMsg
            job_id
        }
    }
`;

export const getLinkScrapedData = gql`
    mutation getLinkScrapedData($job_id: String) {
        getLinkScrapedData(job_id: $job_id) {
            description
            finish
            grade
            item_number
            manufacturer_name
            model_number
            price
            product_thumbnail_url
            style
            subcategory
            supplier
            vendor_subcategory
            vendor_thumbnail_url
            category
        }
    }
`;

export const getJobDetails = gql`
    query getJobDetails($job_id: String) {
        getJobDetails(job_id: $job_id) {
            data {
                created_at
                id
                job_id
                properties
                result {
                    description
                    finish
                    grade
                    item_number
                    manufacturer_name
                    model_number
                    price
                    product_thumbnail_url
                    style
                    subcategory
                    supplier
                    vendor_thumbnail_url
                    vendor_subcategory
                    category
                }
                status
                url
                vendor
            }
            job {
                job_id
                status
                file_name
                created_at
                properties {
                    sheet_names
                }
            }
        }
    }
`;

export const saveJobDetails = gql`
    mutation saveJobDetails($job_id: String, $data: ScrapeJobUpdateData) {
        saveJobDetails(job_id: $job_id, data: $data) {
            job_id
        }
    }
`;

export const getSkusWithCount = gql`
    query getSkusWithCount($job_id: String) {
        getSkusWithCount(job_id: $job_id) {
            skus {
                sku
                count
            }
        }
    }
`;

export const getPackageCreateSearchFilters = gql`
    query getPackageCreateSearchFilters($input: PackageSearchFilterInput) {
        getPackageCreateSearchFilters(input: $input) {
            category
            subcategory
            finish
            style
            grade
            supplier
            manufacturers
            subcategory_pair {
                category
                subcategory
            }
            package {
                id
                name
            }
            subcategory_pair {
                category
                subcategory
            }
        }
    }
`;

export const createNewPackageFromScraper = gql`
    mutation createPackageFromScrape($input: ScrapeToPackageInput) {
        createPackageFromScrape(input: $input) {
            package_id
        }
    }
`;
