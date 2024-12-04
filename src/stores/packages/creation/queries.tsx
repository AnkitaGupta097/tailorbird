import { gql } from "@apollo/client";
// import { gql } from '../services';
export const getPackages = gql`
    query getPackage($input: PackagesListInput) {
        getPackages(input: $input) {
            package_id: id
            name
            description
            ownership_group_id
            ownership_group_name
            user_id
            created_by
            date_created: created_at
            scraper_job_id
            is_standard
            updated_by
            date_updated: updated_at
            last_used
        }
    }
`;

export const getAllSubCategories = gql`
    query getAllSubCategories {
        getAllSubCategories
    }
`;

export const createNewPackage = gql`
    mutation createNewPackage($input: PackageInputDTO) {
        createNewPackage(input: $input) {
            error {
                description
                data {
                    skus {
                        row_id
                        description
                        category
                        subcategory
                        errors {
                            old
                            new
                            column
                            err_type
                        }
                    }
                    distinctStyles
                    distinctFinish
                    distinctGrades
                }
            }
        }
    }
`;

export const GET_PACKAGE_BY_ID = gql`
    query getPackage($input: String) {
        getPackage(input: $input) {
            package_id
            description
            msa
            package_type
            work_type
            material_items
            labor_items
        }
    }
`;

export const AddOrganisation = gql`
    mutation addOrganisation($payload: OrganisationInput) {
        addOrganisation(payload: $payload) {
            id
        }
    }
`;

export const updatePackageMetadata = gql`
    mutation UpdatePackageMetadata($input: UpdatePackageInput) {
        updatePackageMetadata(input: $input) {
            package_id
        }
    }
`;

export const createPackage = gql`
    mutation createPackage($input: PackageInput) {
        createPackage(input: $input) {
            package_id
        }
    }
`;

export const GetMaterials = gql`
    query Materials($input: PackageSearchFilterInput) {
        getMaterials(input: $input) {
            material_id: id
            category
            subcategory
            manufacturer
            model_id
            is_adhoc
            description
            high_price
            ref_price
            low_price
            uom
            cost_code
            style
            grade
            finish
            url
            primary_thumbnail
            created_by
            created_at
            updated_by
            updated_at
            suppliers {
                supplier_id: id
                supplier_name: supplier
                sku_id
                is_adhoc
                ref_price
                uom
                url
                primary_thumbnail
                created_by
                created_at
                updated_by
                updated_at
            }
        }
    }
`;

export const GetLabors = gql`
    query getLabors($input: PackageSearchFilterInput) {
        getLabors(input: $input) {
            labor_id: id
            location
            category
            subcategory
            uom
            ref_price
            cost_code
            description
            created_by
            date_created: created_at
            updated_by
            date_updated: updated_at
        }
    }
`;

export const getPackageById = gql`
    query GetPackage($input: String) {
        getPackage(input: $input) {
            material_id: id
            name
            description
            ownership_group_id
            ownership_group_name
            user_id
            created_by
            created_at
            scraper_job_id
            is_standard
            updated_by
            updated_at
            last_used
            version
            materials {
                material_id: id
                category
                subcategory
                manufacturer
                model_id
                is_adhoc
                description
                high_price
                ref_price
                low_price
                uom
                cost_code
                style
                grade
                finish
                url
                primary_thumbnail
                created_by
                created_at
                updated_by
                updated_at
                suppliers {
                    supplier_id: id
                    supplier_name: supplier
                    sku_id
                    is_adhoc
                    ref_price
                    uom
                    url
                    primary_thumbnail
                    created_by
                    created_at
                    updated_by
                    updated_at
                }
            }
            labor {
                labor_id: id
                location
                category
                subcategory
                uom
                ref_price
                cost_code
                msa
                description
                created_by
                created_at
                updated_by
                updated_at
            }
        }
    }
`;

export const GET_DATA_FOR_SEARCH_FILTERS = gql`
    query GetPackageCreateSearchFilters($input: PackageSearchFilterInput) {
        getPackageCreateSearchFilters(input: $input) {
            category
            subcategory
            ownership
            supplier
            style
            finish
            grade
            subcategory_pair {
                category
                subcategory
            }
            package {
                name
                id
            }
            subcategory_pair {
                category
                subcategory
            }
        }
    }
`;
