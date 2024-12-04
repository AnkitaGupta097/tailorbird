import { IBaseState } from "../common/models/base-state";

export interface IScopes extends IBaseState {
    scopeLibraries: any;
    scopeLibrary: any;
    containerTree: any;
    scopeContainerTree: any;
    showScopeEditor: boolean;
    scopeMerge: any;
    projectMerge: any;
    loadingRollup: any;
    dependantScopeItems: any;
    loadingAddNewScope: any;
    newlyAddedScopesContIds: any;
    createNewItemScopesReqData: any;
}
