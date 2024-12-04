import initAjaxState from "../../../common/models/initAjaxState.json";

export default {
    ...initAjaxState,
    loading: false,
    uploadFileDetails: {
        ...initAjaxState,
        uploadDetails: [],
    },
    rentRoll: { ...initAjaxState, s3Path: "", loading: false },
    rentRollDb: {
        ...initAjaxState,
        data: null,
        loading: false,
        status: "",
        isDeleteStatus: "",
    },
    downloadLink: { ...initAjaxState, data: [] },
    dataSource: { ...initAjaxState, isCreated: null, loading: false },
    dataSourceList: { ...initAjaxState, data: null },
    dataSourceUploadStatus: null,
    rentRollDownloadLink: { ...initAjaxState, link: "", loading: false },
};
