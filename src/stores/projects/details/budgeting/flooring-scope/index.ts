import { IFlooringScope } from "./flooring-scope-models";
import initAjaxState from "../../../../common/models/initAjaxState.json";
import { actions as queryActions } from "./flooring-scope-queries-slice";
import { actions as mutationActions } from "./flooring-scope-mutations-slice";
export type { IRenovation, IFlooringScope } from "./flooring-scope-models";

const flooringScope: IFlooringScope = {
    renovations: {
        ...initAjaxState,
        data: [],
    },
    flooringTakeOffs: {
        ...initAjaxState,
        flooringItems: [],
        data: [],
        createdBy: "",
    },
    subGroups: {
        ...initAjaxState,
        data: [],
    },
    categories: {
        ...initAjaxState,
        data: [],
    },
};

const actions = {
    ...queryActions,
    ...mutationActions,
};

export { flooringScope, actions };
