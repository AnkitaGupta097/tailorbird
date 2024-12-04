import { IBaseState } from "../../common/models/base-state";

export interface IProjectDemand extends IBaseState {
    projects_state_map: any;
    filters: any;
}
