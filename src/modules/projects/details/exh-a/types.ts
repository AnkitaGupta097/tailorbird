export type OrdersOfExhibitA = {
    [key: string]: string;
};

export const ordersOfExhibitA: OrdersOfExhibitA = {
    gc_to_subs: "Contractor to Sub",
    owner_to_gc: "Owner to Contractor",
};
export const ORDERS_OF_EXH_A_OPTIONS = [
    {
        label: "Contractor to Sub",
        value: "gc_to_subs",
    },
    {
        label: "Owner to Contractor",
        value: "owner_to_gc",
    },
];
export type ExhATradeOption = {
    id: string;
    name: string;
    is_selected: boolean;
};
export interface IExhATrade {
    trade_name: string;
    trade_id: string;
    trade_options: ExhATradeOption[];
}
export interface IExhAConfig {
    id: string;
    project_id: string;
    long_description_included: boolean;
    short_description_included: boolean;
    gc_to_subs: boolean;
    owner_to_gc: boolean;
    material_supply: string;
    version: 1;
    trades: IExhATrade[];
    updated_by: string;
    updated_at: string;
}

export const VERSION_OPTIONS = [
    {
        label: "Long Description",
        value: "long_description_included",
    },
    {
        label: "Short Description",
        value: "short_description_included",
    },
];
export const MATERIAL_SUPPLY_OPTIONS = [
    {
        label: "Labour only",
        value: "Labour only",
    },
    {
        label: "Material and Labor",
        value: "Material and Labor",
    },
    {
        label: "Partial Material",
        value: "Partial Material",
    },
];

export interface ISelectedTradeOptionsMap {
    [trandeId: string]: string[];
}

export interface IDocument {
    id: string;
    file_name: string;
    project_id: string;
    s3_file_path: string;
    download_link: string;
    created_by: string;
    created_at: string;
}
