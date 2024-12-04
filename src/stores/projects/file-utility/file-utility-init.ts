import initAjaxState from "../../common/models/initAjaxState.json";
export default {
    ...initAjaxState,
    uploadDetails: [
        {
            file_name: "",
            loading: false,
            error: "",
            data: {},
        },
    ],
    fileDetails: [
        {
            id: 0,
            file_name: "",
            created_by: "",
            created_at: "",
            tags: {
                file_size: 0,
                is_archive: false,
            },
            is_active: false,
            file_type: "",
        },
    ],
    finalistFiles: [
        {
            id: 0,
            file_name: "",
            created_by: "",
            created_at: "",
            tags: {
                file_size: 0,
                is_archive: false,
            },
            is_active: false,
            file_type: "",
        },
    ],
    archivedFiles: [
        {
            id: 0,
            file_name: "",
            created_by: "",
            created_at: "",
            tags: {
                file_size: 0,
                is_archive: false,
            },
            is_active: false,
            file_type: "",
        },
    ],
    imageFiles: undefined,
    downloadingFiles: false,
    downloadingError: false,
};
