import { IVariations } from "./variation-models";
import { actions as queriesActions } from "./variation-queries-slice";
import { actions as mutationActions } from "./variation-mutations-slice";
import initAjaxState from "../../../../common/models/initAjaxState.json";
export type { IVariations } from "./variation-models";

const variations: IVariations = {
    baseFloorplans: {
        ...initAjaxState,
        data: [],
    },
    initItems: {
        ...initAjaxState,
        data: [],
    },
    details: {
        ...initAjaxState,
        data: {
            id: undefined,
            item: undefined,
            floorplans: [],
        },
    },
    items: {
        ...initAjaxState,
        data: [],
    },
};

const actions = {
    ...queriesActions,
    ...mutationActions,
};

export { actions, variations };
