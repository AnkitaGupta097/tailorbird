export interface Iscraper {
    id: number;
    ownership_name: String;
    description: String;
    created_by: String;
    job_id: String;
    status: string;
    name: String;
    file_name: String;
    created_at: String;
    properties: {};
}

export interface ISKURow {
    row_id: any;
    category: any;
    subcategory: any;
    location: any;
    grade: any;
    style: any;
    manufacturer: any;
    model_number: any;
    description: any;
    finish: any;
    errors: ISKURowERR[];
}

export interface ISKURowERR {
    column: any;
    err_type: any;
    old: any;
    new: any;
}
