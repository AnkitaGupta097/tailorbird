import { IBaseState } from "../common/models/base-state";

export interface IPackage {
    id: string;
    name: string;
    ownership: string;
    location: string;
}

export interface IScopeLibrary {
    id: string;
    name: string;
    ownership: string;
    containerVersion?: any;
}

export interface ICommonEntities extends IBaseState {
    packages: IPackage[];
    scopeLibraries: IScopeLibrary[];
}
