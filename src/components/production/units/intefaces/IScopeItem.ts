export interface IGroup {
    [key: string]: any;
    unit_scope: string | null;
    contractor_id: string | null;
    scope_item_id: number | null;
    unit_scope_id: number | null;
    reno_unit_id: string | null;
    category: string | null;
    item: string | null;
    work_type: string | null;
    scope: string | null;
    manufacturer: string | null;
    model_number: string | null;
    takeoff_value: number | null;
    uom: string | null;
    pricing_group_id: number;
    start_price: number | null;
    price: number | null;
    unit_name: string | null;
    total_price: number | null;
}

export interface IItem {
    [key: string]: any;
    unit_scope: string | null;
    contractor_id: string | null;
    scope_item_id: number | null;
    unit_scope_id: number | null;
    reno_unit_id: string | null;
    category: string | null;
    item: string | null;
    work_type: string | null;
    scope: string | null;
    manufacturer: string | null;
    model_number: string | null;
    takeoff_value: number | null;
    uom: string | null;
    pricing_group_id: number;
    start_price: number | null;
    price: number | null;
    unit_name: string | null;
    total_price: number | null;
    groups: IGroup[];
}
