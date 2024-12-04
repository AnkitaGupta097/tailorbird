import { IBaseState } from "../../../common/models/base-state";
import { ICommonEntities } from "./common-entities";
// import { IItemForVariation } from "./items-for-create-variation/items-for-create-variation-models";
import { IVariations } from "./variation";
import { IBaseScopes } from "./base-scope";
import { IFlooringScope } from "./flooring-scope";
import { IBasePackages } from "./base-package";
import { IAltScope } from "./alt-scope/";

export interface IBudgetingDetails extends IBaseState {
    basePackage: IBasePackages;
    altScope: IAltScope;
    variations: IVariations;
    baseScope: IBaseScopes;
    flooringScope: IFlooringScope;
    newItemList: any;
    newItem: any;
    newItemStatus: any;
    packageList: any;
}

export interface IBid {
    bidbookUrl: string | undefined;
    folderUrl: string | undefined;
    disableExportButton: string | undefined;
    generateBidbookStatus: string | undefined;
    rfpManagerSupported: boolean;
    renoVersion: {
        renovation_version: number;
        created_at: string;
    };
}

export interface IBidBook extends IBaseState {
    data: IBid;
}

export interface IBudgeting {
    commonEntities: ICommonEntities;
    details: IBudgetingDetails;
    bidbook: IBidBook;
}
