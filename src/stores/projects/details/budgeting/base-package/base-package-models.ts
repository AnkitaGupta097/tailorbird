import { IBaseState } from "../../../../common/models/base-state";

export interface IBasePackages extends IBaseState {
    data: [IBasePackage] | [];
}

export interface IBasePackage {
    id: string;
    name: string;
    ownership: string;
    location: string;
}
