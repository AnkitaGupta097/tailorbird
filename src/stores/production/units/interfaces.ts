type RenovationStat = {
    reno_unit_id: string;
    completed_work: number;
    total_work: number;
};

export interface IRenovationUnit {
    is_active: boolean;
    id: string;
    unit_id: string;
    release_date: string;
    move_in_date: string;
    move_out_date: string;
    make_ready_date: string;
    renovation_start_date: string;
    renovation_end_date: string;
    general_contractor: string;
    project_id: string;
    created_at: string;
    updated_at: string;
    scheduled_date: string;
    status: string;
    unit_name: string;
    unit_type: string;
    floor_plan_id: string;
    floor_plan_name: string;
    area: number;
    unit_stats: RenovationStat;
    approval_count: number;
    scope_approval_id: number;
    subs: any;
}

export interface IRenovationUnits {
    renoUnits: IRenovationUnit[];
    loading?: boolean;
    isUpdating?: boolean;
    unitsBudget: {
        [key: string]: any;
    };
}
