import { IBaseState } from "../../../../common/models/base-state";

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

export interface ITakeOffSubGroup {
    subGroupId: string;
    isDefault: boolean;
    selectedItem: boolean;
}

export interface IFlooringTakeOffData {
    roomType: string;
    subGroups: [ITakeOffSubGroup];
}

export interface IFlooringTakeOff extends IBaseState {
    flooringItems: [string] | [];
    data: [IFlooringTakeOffData] | [];
    createdBy: string;
}

export interface ISubGroup extends IBaseState {
    name: string;
    id: string;
    floorPlanGroupId: string;
    isDefault: boolean;
    projectId: string;
}

export interface IRenovations extends IBaseState {
    data: [IRenovation] | [];
}

export interface ISubGroups extends IBaseState {
    data: [ISubGroup] | [];
}

export interface ICategories extends IBaseState {
    data: [ICategory] | [];
}

export interface IFlooringScope {
    renovations?: IRenovations;
    flooringTakeOffs: IFlooringTakeOff;
    subGroups: ISubGroups;
    categories: ICategories;
}
