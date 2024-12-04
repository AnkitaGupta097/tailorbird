import { IAltScope } from "./alt-scope-models";
import initAjaxState from "../../../../common/models/initAjaxState.json";
import { actions as queryActions } from "./alt-scope-queries-slice";
import { actions as mutationActions } from "./alt-scope-mutations-slice";
export type { IAltScope } from "./alt-scope-models";

const altScope: IAltScope = {
    packages: {
        ...initAjaxState,
        data: [],
    },
    scopeTrees: {
        ...initAjaxState,
        data: [],
    },
    renovations: {
        ...initAjaxState,
        data: [],
    },
    floorplanCosts: {
        ...initAjaxState,
        data: [],
    },
    materialOptions: {
        ...initAjaxState,
        data: [],
    },
    materialsForSearch: {
        ...initAjaxState,
        data: [],
    },
    altPackages: {
        ...initAjaxState,
        data: [],
    },
    baseDataForDiff: {
        categoryTree: [],
        totalWavg: {
            allRenoWavg: 0,
            oneOfEachWavg: 0,
        },
    },
};

const actions = {
    ...queryActions,
    ...mutationActions,
};

export { altScope, actions };
