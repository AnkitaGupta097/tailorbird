import { IBaseState } from "../common/models/base-state";
export interface IprojectViews {
    loading: any;
    data: any;
}

export interface IPropertiesConsumer extends IBaseState {
    propertyDetailStats: any;
    properties: any;
    filters: any;
    propertyDetails: any;
    unitMixes: any;
    propertyImages: any;
    propertyStats: IprojectViews;
    rentRoll: any;
    propertyFloorplan: any;
    projectViews: IprojectViews;
    propertyDetailStatsForAllUnits: any;
}
