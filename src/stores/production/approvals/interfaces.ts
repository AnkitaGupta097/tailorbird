export interface IApproval {
    id: number;
    reno_unit_id: string;
    unit_scope_item_id: number;
    unit_scope_id: number;
    created_at: string;
    updated_at: string;
    status: string;
    requestor_id: string;
    requestee_id: string;
    requestor_remark: string;
    requestee_remark: string;
    is_active: Boolean;
    request_type: string;
    requestor_org_id: string;
    requestee_org_id: string;
    requestee_attachments: [number];
    requestor_attachments: [number];
    change_data: JSON;
    current_data: JSON;
    pricing_group_id: number;
    requestor_org: any;
    requestee_org: any;
    requestor_user: any;
    requestee_user: any;
    unit_scope_name: string;
    unit_scope_status: string;
    item_category: string;
    item_name: string;
}

export interface IApprovals {
    [key: string]: IApproval[];
}

export interface IApprovalState {
    allApprovals: IApprovals;
    loading: boolean;
    reviewing: boolean;
}
