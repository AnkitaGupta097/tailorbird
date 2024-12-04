import initAjaxState from "../common/models/initAjaxState.json";

export default {
    ...initAjaxState,
    scopeLibraries: [],
    scopeLibrary: [],
    containerTree: [],
    scopeContainerTree: [],
    showScopeEditor: false,
    scopeMerge: null,
    projectMerge: null,
    loadingRollup: false,
    loadingAddNewScope: false,
    dependantScopeItems: [],
    newlyAddedScopesContIds: [],
    createNewItemScopesReqData: [],
};
