import { IState } from "../../state-interface";

export interface IMaterial {
    description: string;
    manufacturer: string;
    model_number: string;
    uom: string;
    notes: string;
    url: string;
    ref_price: number;
    cc_code: string;
    style: string;
    finish: string;
    material_id: string;
    package_id: string;
    is_kit: boolean;
    date_created: string;
    date_updated: string;
    primary_thumbnail: string;
    additional_thumbnails: string;
    record_status: string;
    category: string;
    subcategory: string;
    location: string;
}

export interface IMaterials extends IState {
    data: IMaterial[];
    newSkuRows: any[];
}
