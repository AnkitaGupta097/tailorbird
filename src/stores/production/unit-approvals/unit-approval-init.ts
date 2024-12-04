import initAjaxState from "../../initAjaxState.json";

export default {
    ...initAjaxState,
    filteredUnits: {
        pendingUnitApprovals: undefined,
        resolvedUnitApprovals: undefined,
    },
    allUnits: {
        pendingUnitApprovals: undefined,
        resolvedUnitApprovals: undefined,
    },
    loading: false,
};
