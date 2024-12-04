import { combineReducers, Reducer } from "redux";

import snackbarReducer, { ISnackbar, actions as snackbarActions } from "./snackbar";
import featureFlagReducer, { actions as featureFlagActions, IFeatureFlag } from "./featureflag";

// State interface
export interface ICommonState {
    snackbar: ISnackbar;
    featureFlags: IFeatureFlag;
}

// State reducer
export const commonReducer: Reducer<ICommonState> = combineReducers<ICommonState>({
    snackbar: snackbarReducer,
    featureFlags: featureFlagReducer,
});

// Actions
export const commonActions = {
    ...snackbarActions,
    ...featureFlagActions,
};
