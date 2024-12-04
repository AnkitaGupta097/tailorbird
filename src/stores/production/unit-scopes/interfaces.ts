export interface IUnitScope {
    id: number;
    is_active: boolean;
    reno_unit_id: string;
    system_remarks: any;
    started_at: string;
    ended_at: string;
    last_price: number;
    updated_at: string;
    project_id: string;
    created_at: string;
    scope: string;
    status: string;
    start_price: number;
    price: number;
    scope_approval_id: number;
    items: any[];
    renovation_start_date: string;
    renovation_end_date: string;
    material_price: number;
    labor_price: number;
    material_and_labor_price: number;
    subs: any[];
}

export interface IUnitScopes {
    [key: string]: IUnitScope[];
}

export interface IUnitScopeState {
    unitScopes: IUnitScopes;
    loading: boolean;
}
