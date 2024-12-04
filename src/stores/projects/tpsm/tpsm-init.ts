import initAjaxState from "../../common/models/initAjaxState.json";

export default {
    ...initAjaxState,
    projects: null,
    archive_projects: { ...initAjaxState, data: null, loading: false },
    organization: null,
    all_User: { ...initAjaxState, users: null },
    user_organization: { ...initAjaxState, users: null },
    created_project: { ...initAjaxState, projectDetails: null, loading: false },
};
