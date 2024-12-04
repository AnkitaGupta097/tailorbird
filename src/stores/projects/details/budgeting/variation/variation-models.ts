import { IBaseState } from "../../../../common/models/base-state";

export interface IFloorPlan {
    fpId: string | undefined;
    fpName: string | undefined;
    fpType: string | undefined;
    fpTotalQty: number | undefined;
}

export interface ILocation {
    name: string | undefined;
    takeOff: string | undefined;
}

export interface IVariationFloorplans extends IFloorPlan {
    locations: [ILocation];
}

export interface IVariationDetail {
    id: string | undefined;
    item: string | undefined;
    floorplans: [IVariationFloorplans] | [];
}

export interface IInitItem {
    item: string | undefined;
    caregory: string | undefined;
}

export interface IVariation {
    id: string;
    name: string;
    variationCount: number;
    takeOffsInSync: boolean;
}

export interface IBaseFloorplans extends IBaseState {
    data: [IFloorPlan] | [];
}

export interface IVariationDetails extends IBaseState {
    data: IVariationDetail;
}

export interface IInitItems extends IBaseState {
    data: [IInitItem] | [];
}

export interface IVariationItems extends IBaseState {
    data: [IVariation] | [];
}

export interface IVariations {
    baseFloorplans: IBaseFloorplans;
    initItems: IInitItems;
    details: IVariationDetails;
    items: IVariationItems;
}
