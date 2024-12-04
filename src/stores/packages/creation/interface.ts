import { IState } from "../../state-interface";

export interface IPackage extends IState {
    id: String;
    name: String;
    category: String;
    description: String;
    type?: String;
    finish?: String;
    customer?: String;
    customer_id?: String;
    created_by: String;
    date_created: String;
    date_updated?: String;
    date_last_used?: String;
    style?: String;
    manufacturer?: String;
    supplier?: String;
    value_engineered: Boolean;
    SKUs: String;
    upload_template_url: String;
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
