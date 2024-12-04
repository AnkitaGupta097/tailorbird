export interface IMaterialDetails {
    name: string;
    style: string;
    finish: string;
    grade: string;
    manufacturer: string;
    model_id: string;
    supplier: string;
    sku_id: string;
}

export interface IParameterDetails {
    manufacturers: string[];
    organisation_container_id: string;
    low_price: number;
    high_price: number;
    finish: string;
    user_id: string;
}
