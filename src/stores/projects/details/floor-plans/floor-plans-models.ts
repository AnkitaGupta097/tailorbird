import { IBaseState } from "../../../common/models/base-state";

export interface IProjectFloorplan {
    id: string;
    projectId: string;
    commercialFloorplanName: string;
    unitType: string;
    takeOffType: string;
    name: string;
    type: string;
    renoUnits: number;
    bathsPerUnit: number;
    bedsPerUnit: number;
    totalUnits: number;
    area: number;
    areaUom: string;
    createdAt: string;
    updatedAt: string;
    remarks: {
        dsType: string;
        dsFileId: number;
    };
    cdn_paths: string[];
    autodesk_url?: any;
}

export interface ISplitSubGroup {
    id: string;
    floorPlanGroupId: string;
    isDefault: boolean;
    name: string;
}

export interface ISplitSubGroupMapper {
    id: string;
    floorPlanId: string;
    subGroupId: string;
    unitsCount: number;
}

export interface IInventory {
    id: string;
    name: string;
    isDefault: boolean;
    projectId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
}

export interface IInventoryMix {
    id: string;
    count: number;
    inventoryId: string;
    floorplanId: string;
    projectId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
}
export interface IProjectFloorplans extends IBaseState {
    data: IProjectFloorplan[];
}

export interface IPropertyFloorplan extends IBaseState {
    data: IProjectFloorplan | {};
}

export interface IProjectFloorplanSplits extends IBaseState {
    subGroups: ISplitSubGroup[];
    subGroupMappers: ISplitSubGroupMapper[];
}

export interface IInventories extends IBaseState {
    data: [IInventory] | [];
}

export interface IInventoryMixes extends IBaseState {
    data: [IInventoryMix] | [];
}
export interface IunitMix extends IBaseState {
    projectFloorPlan: any[];
    inventory: any[];
    inventoryMix: any[];
    unitMixes: any[];
    propertyUnits: any[];
}

export interface IFloorplans extends IBaseState {
    floorplan: IPropertyFloorplan;
    floorplans: IProjectFloorplans;
    floorplanSplits: IProjectFloorplanSplits;
    inventories: IInventories;
    inventoryMixes: IInventoryMixes;
    unitMix: IunitMix;
    commentLogs: any;
    missingFileUploading: any;
    deleteInProgress: any;
}
