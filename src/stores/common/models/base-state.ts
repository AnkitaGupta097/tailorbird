import { IErrorState } from "./error-state";

export interface IBaseState {
    loading: boolean;
    error: IErrorState;
}
