import { IBaseScopes } from "./base-scope-models";
import initAjaxState from "../../../../common/models/initAjaxState.json";
import { actions as queryActions } from "./base-scope-queries-slice";
import { actions as mutationActions } from "./base-scope-mutations-slice";
export type { IRenovation, IBaseScopes, IMaterialOption } from "./base-scope-models";

const baseScope: IBaseScopes = {
    categories: {
        ...initAjaxState,
        data: [],
    },
    inventories: {
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
};

const actions = {
    ...queryActions,
    ...mutationActions,
};

export { baseScope, actions };
