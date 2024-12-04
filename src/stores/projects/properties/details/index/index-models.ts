import { IBaseState } from "../../../../common/models/base-state";

export interface IPropertyDetails extends IBaseState {
    data: any;
    importingRentRoll?: boolean;
    mappingFloorplan?: boolean;
    mappingUnits?: boolean;
    loadingEntrataData?: boolean;
}
