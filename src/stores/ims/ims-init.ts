import initAjaxState from "../initAjaxState.json";

export default {
    ...initAjaxState,
    users: [],
    usersByOrg: {},
    contractors: [],
    ownerships: [],
    configuration: { loading: false, error: false, saved: false },
    configurations: [],
    loading: false,
    error: false,
};
