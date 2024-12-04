export interface IFloorplan {
    fp_id: string;
    fp_name: string;
    inventory_name: string;
    total_units: number;
    categories: ICategories;
}

export interface ICategories {
    [key: string]: {
        categorySum: number;
        totalSum: number;
        label: string;
        items: Array<ICategoryItem>;
    };
}

export interface ICategoryItem {
    scope_detail: string;
    specs: string;
    location?: string;
    quantity: number;
    pricing: {
        unit_pricing: number;
        lump_sum: number;
    };
}

export interface IFloorPlanUnits {
    fp_name: string;
    total_fp_units: number;
}

export interface IRfpResponseItems {
    id: string;
    floor_plan_id: string;
    reno_item_id: string;
    is_unique_price: boolean;
    rfp_response_id: string;
    unique_price: number;
    total_price: number;
    default_price: number;
    specific_uom: string;
    updated_by_user_id: string;
    quantity: number;
    category: string;
    subcategory: string;
    uom: string;
    scope: string;
    work_type: string;
    location: string;
    fp_name: string;
    inventory_name: string;
    total_units: number;
    is_active: boolean;
    is_deleted: boolean;
    is_default: boolean;
    is_combined: boolean;
    parent_bid_item_id: string;
    sub_group_name: string;
    description: string;
    finish: string;
    model_no?: string;
    manufacturer?: string;
    is_ownership_alt?: boolean;
    display_category?: string;
    fp_area_uom?: string;
    baths_count?: number;
    beds_count?: number;
    fp_area?: number;
    reason?: string;
    alt_bid_id?: string;
    is_alternate?: boolean;
    bid_request_id: string;
    type_of_change: string;
    type: string;
    pc_item_id: string;
    specific_quantity?: number;
    combo_name: string;
    l1_name: string;
    l2_name: string;
    l3_name: string;
    is_historical_price?: boolean;
    is_revised_price?: boolean;
    price_expression?: string;
    subgroup_id: string;
    inventory_id: string;
    fp_commercial_name?: string;
}

export interface IFloorplanPrice {
    fp_name: string;
    unique_price: number;
    isSelected: boolean;
    inventory?: string;
    uom?: string;
    sub_group_name?: string;
}

export interface IItem {
    id: string;
    fp_name: string;
    fp_id: string;
    bid_request_id: string;
    reno_item_id: string;
    is_unique_price: boolean;
    unique_price: number;
    total_price: number;
    total_units: number;
    quantity: number;
    category: string;
    subcategory: string;
    specific_uom: string;
    uom: string;
    scope: string;
    work_type: string;
    location: string;
    floorplans: Array<IFloorplanPrice>;
    unitsToBeFilled: number;
    default_price: number;
    sub_group_name: string;
    prev_default_price: number;
    inventory_name: string;
    alt_bid_id?: string;
    is_alternate?: boolean;
    reason?: string;
    is_ownership_alt?: boolean;
    description: string;
    comments: string;
    finish: string;
    model_no?: string;
    manufacturer?: string;
    type_of_change: string;
    alternate_item_ref?: IItem;
    fp_area_uom: string;
    baths_count: number;
    beds_count: number;
    fp_area: number;
    children?: Array<IItem>;
    parent_bid_item_id?: String;
    total_take_off_value: number;
    pc_item_id: string;
    type?: string;
    specific_quantity?: number;
    isParentCategory?: boolean;
    combo_name?: string;
    allFloorplansFilled?: boolean;
    is_historical_price?: boolean;
    is_revised_price?: boolean;
    price_expression: string;
    subgroup_id: string;
    inventory_id: string;
    fp_commercial_name: string;
}

export interface IGroupedRfpResponseItems {
    fp_id: string;
    total_units: number;
    fp_name: string;
    fp_commercial_name: string;
    inventory_name: string;
    sub_group_name: string;
    categories: ICategory[];
    renoUnits: [
        {
            fp_name: string;
            total_fp_units: number;
        },
    ];
}

export interface IExcelFileDetails {
    floorplanName: string;
    projectId: string;
    projectName: string;
    eventName: string;
    eventId: string;
    bidStatus: string;
}
export interface IBiddingPortal {
    loading?: boolean;
    loadingSession?: boolean;
    saved?: boolean;
    error?: boolean;
    responseSuccess?: boolean;
    responseError?: boolean;
    syncTimeout?: false;
    bidItems: IRfpResponseItems[];
    bidItemsUpdated: IRfpResponseItems[];
    groupedBidItems: IGroupedRfpResponseItems[];
    floorplans: Array<IFloorplan>;
    renoUnits: Array<IFloorPlanUnits>;
    categories: Array<string>;
    isEditable?: boolean;
    currentEditingUser?: {
        name: string;
        id: string;
        organization_id: string;
        projectId: string;
    };
    isIdle?: boolean;
    isOffline?: boolean;
    renoItemCountForInventories: Record<string, number>;
    loadingOperation?: boolean;
    considerAlternates?: boolean;
    loadingMessage?: string;
    disableSubmit: boolean;
    selectedVersion: string;
    excelFileDetails: IExcelFileDetails;
    filteredProjectCost: any;
    inventories: Array<string>;
    itemChangeLog?: Record<string, Record<string, any>>;
    quantityChangeLog?: Record<string, { display: string; quantity: number }>;
    historicalPricingData: Record<
        string,
        {
            pc_item_id: string;
            reno_item_id: string;
            historical_prices: HistoricalPricesType;
        }
    >;
}

export interface ICategory {
    category: string;
    parent_category: string;
    totalSum: number;
    categorySum: number;
    items: IItem[];
    alternateSum: number;
    [x: string]: any;
}

export type HistoricalPricesType = Array<{
    project_id: string;
    unit_price: number;
    uom: string;
    is_finalist: boolean;
    submitted_on: string;
    ownership_group_id: string;
    project_name: string;
    ownership_org_name: string;
    street_address: string;
    city: string;
    state: string;
    zipcode: string;
    project_type: string;
}>;
