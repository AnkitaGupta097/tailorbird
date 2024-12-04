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

export interface ISingleProduct {
    created_at: string;
    id: number;
    job_id: string;
    properties: string;
    result: {
        description: string;
        finish: string;
        grade: string;
        item_number: string;
        manufacturer_name: string;
        model_number: string;
        price: string;
        product_thumbnail_url: string;
        style: string;
        subcategory: string;
        supplier: string;
        vendor_thumbnail_url: string;
        vendor_subcategory: string;
        category: string;
    };
    isSelected?: boolean;
    status: string;
    url: string;
    vendor: string;
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
