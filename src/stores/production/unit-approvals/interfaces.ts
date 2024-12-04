type RenovationStat = {
    reno_unit_id: string;
    completed_work: number;
    total_work: number;
};

export interface IUnitApproval {
    id: string;
    unit_name: string;
    count: number;
    approval_ids: number[];
    status: string;
    renovation_start_date: string;
    general_contractor: string;
    subs: any[];
    unit_stats: RenovationStat;
}

export interface IUnitApprovalState {
    filteredUnits: {
        pendingUnitApprovals: IUnitApproval[];
        resolvedUnitApprovals: IUnitApproval[];
    };
    allUnits: {
        pendingUnitApprovals: IUnitApproval[];
        resolvedUnitApprovals: IUnitApproval[];
    };
    loading: boolean;
}
