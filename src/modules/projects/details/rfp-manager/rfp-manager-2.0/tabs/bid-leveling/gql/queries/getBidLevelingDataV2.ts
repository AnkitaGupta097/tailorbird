import { gql } from "@apollo/client";

export const GET_BID_LEVELING_DATA_V2 = gql`
    query GetBidLevelingDataV2($projectId: String!, $scopeSelection: String, $workType: String) {
        getBidLevelingDataV2(
            project_id: $projectId
            scope_selection: $scopeSelection
            work_type: $workType
        ) {
            categories {
                name
                items {
                    id
                    hierarchy
                    name
                    scope
                    work_type
                    is_parent
                    is_subcategory
                    is_selected
                    description
                    contractors {
                        name
                        agg_price
                        wtd_avg_price
                        is_percentage
                        percentage
                        floorplans {
                            name
                            commercial_name
                            agg_price
                            wtd_avg_price
                            is_percentage
                            percentage
                            inventories {
                                name
                                agg_price
                                wtd_avg_price
                                is_percentage
                                percentage
                            }
                        }
                        inventories_without_fp {
                            name
                            agg_price
                            wtd_avg_price
                            is_percentage
                            percentage
                        }
                    }
                }
                total_prices {
                    id
                    hierarchy
                    name
                    scope
                    work_type
                    is_parent
                    is_selected
                    description
                    contractors {
                        name
                        agg_price
                        wtd_avg_price
                        floorplans {
                            name
                            agg_price
                            wtd_avg_price
                            inventories {
                                name
                                agg_price
                                wtd_avg_price
                            }
                        }
                        inventories_without_fp {
                            name
                            agg_price
                            wtd_avg_price
                        }
                    }
                }
            }
            metadata {
                floorplans
                grouped_floorplans {
                    floorplan_unit_type
                    floorplans
                }
                contractors
                inventories
                subgroups
                work_types
                selected_ids
                is_flooring_split
            }
            scope_selector {
                project_id
                updated_at
                updated_by
                items_selection {
                    id
                    is_selected
                }
            }
        }
    }
`;
