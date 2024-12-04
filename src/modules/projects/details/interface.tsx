export interface IItemDetails {
    scopes: string[];
    category: string;
    uom: string;
    work_package: string;
    item_name: string;
}
export interface IMaterialDetails {
    style: string;
    finish: string;
    grade: string;
    manufacturer: string;
    model_id: string;
    supplier: string;
    sku_id: string;
    subcategory: string;
    description: string;
    created_by: string;
    category: string;
    is_kit: boolean;
    user_id: string;
    version: string;
    isExist?: boolean;
}
export interface IErrorText {
    scopes: boolean;
    category: boolean;
    uom: boolean;
    work_package: boolean;
    item_name: string;
    description_material: boolean;
    description_kit: boolean;
}

export interface ICreateItem {
    isModal?: boolean;
    newItem?: any;
    modalHandler?: any;
    itemIndex?: any;
}
