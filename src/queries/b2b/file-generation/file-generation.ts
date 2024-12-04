import { gql } from "@apollo/client";

export const GET_FILE = gql`
    query GetFileData($id: String) {
        getFile(id: $id) {
            _id
            project_id
            metadata {
                scope_details {
                    scope_name
                    style_name
                    kitchen {
                        name
                        images {
                            url
                        }
                        mainImage {
                            url
                        }
                    }
                    bathroom {
                        name
                        images {
                            url
                        }
                        mainImage {
                            url
                        }
                    }
                }
                renovation_overview_data {
                    KITCHEN
                    BATHROOM
                    FLOORING
                    PAINT_AND_LIVING_FIXTURES
                    APPLIANCES
                    REPAIR_WINDOWS
                    # description
                }
                projectDetails {
                    project_name
                    address
                    address_display
                    asset_type
                    project_owner
                    renovation_cost
                    rental_units
                    project_mainImage {
                        url
                    }
                    project_images {
                        uuid
                        photo_tag
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_archived
                        selected
                    }
                    measured_images {
                        uuid
                        photo_tag
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_archived
                        selected
                    }
                    floorplan_images {
                        uuid
                        photo_tag
                        photo_bucket_path
                        photo_folder_path
                        photo_file_name
                        description
                        is_archived
                        selected
                        name
                    }
                    project_image_urls {
                        photos {
                            url
                        }
                        measured {
                            url
                        }
                        floorplan_images {
                            name
                            url
                        }
                        # floorplan_measured_images{
                        #   name
                        #   url
                        # }
                    }
                }
                floorplan_overview {
                    name
                    columnNames
                    data {
                        name
                        type
                        kitchens_per_unit
                        bed_bath
                        area_per_unit
                    }
                }
                floorplan_cost_overview {
                    name
                    columnNames
                    data {
                        name
                        type
                        units_count
                        base_cost
                        total_base_cost
                        base_scope
                    }
                }
                floor_plans {
                    name
                    base_cost
                    bedrooms_per_unit
                    bathrooms_per_unit
                    units_count
                    scope_data {
                        name
                    }
                    kitchens_per_unit
                    area_per_unit
                    uuid
                }
                scopeCollection {
                    name
                    columnNames
                    data {
                        query
                    }
                }
            }
            doc_type
            file_url
            doc_description
        }
    }
`;
