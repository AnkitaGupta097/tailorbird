import initAjaxState from "../../common/models/initAjaxState.json";

export default {
    ...initAjaxState,
    properties: null,
    archive_properties: { ...initAjaxState, data: null, loading: false },
    created_property: { ...initAjaxState, propertyDetails: null, loading: false },
};
