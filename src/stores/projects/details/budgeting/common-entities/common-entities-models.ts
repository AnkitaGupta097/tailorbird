import { IBaseState } from "../../../../common/models/base-state";

export interface IPackage {
    id: string;
    name: string;
    ownership: string;
    location: string;
}

export interface IScope {
    id: string;
    name: string;
    ownership: string;
    description: string;
}

export interface IBudgetMetadata {
    isAltScopeDefined: Boolean;
    isFlooringScopeDefined: Boolean;
    isFloorSplit: Boolean;
}

export interface ICommonEntities extends IBaseState {
    packages: IPackage[] | [];
    scopes: IScope[] | [];
    budgetMetadata: IBudgetMetadata;
    isOneOfEach: any;
    overallWavg: any;
    selectedInv: any;
}
