import { IBaseState } from "../../../../common/models/base-state";

export interface IScope {
    name: string;
    isBase: boolean;
}

export interface IItem {
    name: string;
    excluded: boolean;
    scopes: [IScope];
}

export interface ICategory {
    name: string;
    items: [IItem];
}

export interface IInventory {
    id: string;
    projectId: string;
    name: string;
    description: string;
    baseScopeId: string;
}

export interface IRenovation {
    id: string;
    category: string;
    item: string;
    scope: string;
    subcategory: string;
    imageUrl: string;
    description: string;
    finish: string;
    workType: string;
    uom: string;
    quantity: number;
    location: string;
    qualifier: string;
    manufacturer: string;
    modelNo: string;
    supplier: string;
    itemNo: string;
    unitCost: number;
    workId: string;
    inventoryId: string;
    pc_item_id: string;
    is_active: boolean;
    is_demand_user_created: boolean;
    is_hidden: boolean;
    notes: string;
}

export interface IFloorplanCost {
    id: string;
    name: string;
    type: string;
    uom: string;
    quantity: number;
    price: number;
}

export interface IMaterialOption {
    description: string;
    manufacturer: string;
    model_id: string;
    uom: string;
    url: string;
    unitCost: string;
    ccCode: string;
    style: string;
    finish: string;
    materialId: string;
    packageId: string;
    dateCreated: string;
    dateUpdated: string;
    primaryThumbnail: string;
    category: string;
    subcategory: string;
    location: string;
    supplier: string;
    supplierSkuNumber: string;
    manufacturer_or_supplier: string;
    model_number_or_item_number: string;
    is_anchor?: boolean;
}

export interface IInventories extends IBaseState {
    data: [IInventory] | [];
}

export interface ICategories extends IBaseState {
    data: [ICategory] | [];
}

export interface IRenovations extends IBaseState {
    data: [IRenovation] | IRenovation[] | [];
}

export interface IFloorplanCosts extends IBaseState {
    data: [IFloorplanCost] | [];
}

export interface IMaterialOptions extends IBaseState {
    data: [IMaterialOption] | [];
}

export interface IMaterialsForSearch extends IBaseState {
    data: IMaterialOption[] | [];
}

export interface IBaseScopes {
    categories: ICategories;
    inventories: IInventories;
    renovations: IRenovations;
    floorplanCosts: IFloorplanCosts;
    materialOptions: IMaterialOptions;
    materialsForSearch: IMaterialsForSearch;
}
