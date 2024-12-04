import { IBaseState } from "../../../../common/models/base-state";

export interface IAltPackage {
    id: string;
    name: string;
    ownership: string;
    location: string;
}

export interface IScope {
    name: string;
    isBase: boolean;
}

export interface IItem {
    name: string;
    excluded: boolean;
    scopes: [IScope];
}

export interface IScopeTree {
    name: string;
    items: [IItem];
}

export interface IInventory {
    id: string;
    name: string;
    pending: boolean;
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
    skuId: string;
    imageUrl: string;
    description: string;
    manufacturer: string;
    modelNo: string;
    supplier: string;
    itemNo: string;
    unitCost: number;
}

export interface IMaterialForSearch {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
}

export interface IScopeTrees extends IBaseState {
    data: [IScopeTree] | [];
}

export interface IRenovations extends IBaseState {
    data: [IRenovation] | [];
}

export interface IFloorplanCosts extends IBaseState {
    data: [IFloorplanCost] | [];
}

export interface IMaterialOptions extends IBaseState {
    data: [IMaterialOption] | [];
}

export interface IMaterialsForSearch extends IBaseState {
    data: [IMaterialForSearch] | [];
}

export interface IPackages extends IBaseState {
    data: [IAltPackage] | [];
}

export interface IAltPackages extends IBaseState {
    data: [IAltPackage] | [];
}
export interface IbaseDataForDiff {
    categoryTree: any;
    totalWavg: {
        allRenoWavg: any;
        oneOfEachWavg: any;
    };
}

export interface IAltScope {
    packages: IPackages;
    altPackages: IAltPackages;
    renovations?: IRenovations;
    floorplanCosts: IFloorplanCosts;
    materialOptions: IMaterialOptions;
    materialsForSearch: IMaterialsForSearch;
    scopeTrees: IScopeTrees;
    baseDataForDiff: IbaseDataForDiff;
}
