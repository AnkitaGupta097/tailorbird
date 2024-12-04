import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import initAjaxState from "../../initAjaxState.json";
import { updateObject } from "../../../utils/store-helpers";

const initState = cloneDeep(initAjaxState) as any;
initState.loading = false;
initState.data = [];
initState.scrapingStatus = "";
initState.s3UploadLink = { id: "", s3Link: "" };
initState.jobDetails = {
    "0": {
        data: [
            {
                created_at: "",
                id: 0,
                job_id: "",
                properties: {
                    sheet_name: "",
                },
                result: {
                    description: "",
                    finish: "",
                    grade: "",
                    item_number: "",
                    manufacturer_name: "",
                    model_number: "",
                    price: "",
                    product_thumbnail_url: "",
                    style: "",
                    subcategory: "",
                    supplier: "",
                    vendor_thumbnail_url: "",
                    vendor_subcategory: "",
                    category: "",
                },
                status: "",
                url: "",
                vendor: "",
            },
        ],
        job: {
            job_id: "",
            status: "",
            file_name: "",
            created_at: "",
            properties: {
                sheet_names: [""],
            },
        },
        deletedList: [],
    },
};
initState.uploading = { url: "", status: "idle", error: false, errMsg: "" };
initState.dataFromLink = {
    url: "",
    job_id: "",
    status: "idle",
    response: null,
    error: false,
    errMsg: "",
};

initState.skusWithCount = {
    "0": {
        skus: [
            {
                sku: "",
                count: 0,
            },
        ],
    },
    loading: false,
};

initState.categories = {
    category: [],
    finish: [],
    grade: [],
    package: [],
    style: [],
    subcategory: [],
    supplier: [],
};

export interface Iscrapersstate {
    loading: boolean;
    error: boolean;
    data: typeof initState.data;
    uploading: typeof initState.uploading;
    jobDetails: any;
    scrapingStatus: string;
    dataFromLink: typeof initState.dataFromLink;
    s3UploadLink: typeof initState.s3UploadLink;
    skusWithCount: typeof initState.skusWithCount;
    categories: typeof initState.categories;
}
const initialState: Iscrapersstate = initState;

function fetchScraperStart(state: Iscrapersstate) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchScraperSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: action.payload,
    });
}

function fetchScraperFailure(state: Iscrapersstate) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchScrapeDataFromLinkStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        dataFromLink: {
            url: action.payload,
            status: "fetching",
            response: null,
            error: false,
            errMsg: "",
        },
    });
}
function fetchScrapeDataFromLinkSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        dataFromLink: {
            ...state.dataFromLink,
            job_id: action.payload.job_id,
            status: "submitted",
            response: null,
            error: false,
            errMsg: "",
        },
    });
}
function fetchScrapeDataFromLinkFailure(state: Iscrapersstate, action: PayloadAction<any>) {
    const err = action.payload?.error ?? false;
    const errMsg = action.payload?.errorMsg ?? "";
    return updateObject(state, {
        dataFromLink: { url: "", status: "idle", response: null, error: err, errMsg: errMsg },
    });
}

// eslint-disable-next-line no-unused-vars
function getLinkScrapeDataStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {});
}
function getLinkScrapeDataSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        dataFromLink: {
            ...state.dataFromLink,
            status: "success",
            response: action.payload,
            error: false,
            errMsg: "",
        },
    });
}

// eslint-disable-next-line no-unused-vars
function uploadNewImageFileStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}
// eslint-disable-next-line no-unused-vars
function uploadNewImageFileSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        s3UploadLink: { id: action.payload.id, s3Link: action.payload.config.url },
    });
}

// eslint-disable-next-line no-unused-vars
function uploadNewJobStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function getScrapeJobDetails(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function uploadNewJobSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const currentState = cloneDeep(current(state));
    const stateData = currentState?.data ?? [];
    const data = stateData.concat([action.payload.new_job]);
    return updateObject(state, {
        loading: false,
        data: data,
        uploading: action.payload.uploading,
    });
}

function fetchscrapeJobDetailsSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const details = cloneDeep(state.jobDetails);
    //Get deleted SKU list
    const deletedList = action.payload.deletedList;

    let data = [];

    // If redux store has job details of current job or if there are deleted SKUs stored in Redux
    if (
        details[action.payload.id] &&
        (details[action.payload.id]?.data?.length > 0 || deletedList?.length > 0)
    ) {
        //If all SKUs deleted by user while data streaming
        if (deletedList?.length > 0 && details[action.payload.id]?.data?.length === 0) {
            const newData = action.payload.response?.data?.filter(
                (item: { id: number }) => !deletedList?.includes(item.id),
            );

            data = newData;
        } else {
            //SKUs that have been updated by user
            const existingIds = details[action.payload.id]?.data?.map(
                (detail: { id: number }) => detail.id,
            );

            //SKUs that are not already present in redux store and is fetched from API
            const newData = action.payload.response?.data?.filter(
                (item: { id: number }) =>
                    !(existingIds?.includes(item.id) || deletedList?.includes(item.id)),
            );

            //Append new SKUs fetched from API with existing SKUs in redux
            data = [...details[action.payload.id].data, ...newData];
        }

        const dataObj = {
            data: data,
            job: action.payload.response?.job,
            deletedList: deletedList,
        };

        details[action.payload.id] = dataObj;
    } else {
        //If redux store doesn't have job details of current job (probably first time)
        const dataObj = {
            data: action.payload.response?.data,
            job: action.payload.response?.job,
            deletedList: deletedList,
        };
        details[action.payload.id] = dataObj;
    }

    return updateObject(state, {
        loading: false,
        jobDetails: details,
    });
}

// eslint-disable-next-line no-unused-vars
function updateJobDetailsSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const details = cloneDeep(state.jobDetails);

    //Update redux job details state when user updates or deletes a SKU
    const dataObj = {
        data: action.payload.latestData?.data,
        job: action.payload.latestData?.job,
        deletedList: action.payload.deleteList,
    };
    details[action.payload.job_id] = dataObj;

    return updateObject(state, {
        loading: false,
        jobDetails: details,
    });
}

function uploadNewJobFailure(state: Iscrapersstate) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function saveJobDetailsStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}
function saveJobDetailsSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const newJobDetailsdata = cloneDeep(state.jobDetails);
    newJobDetailsdata[action.payload.job_id] = action.payload.data;
    return updateObject(state, {
        loading: false,
        jobDetails: newJobDetailsdata,
    });
}
function saveJobDetailsFailure(state: Iscrapersstate) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchSKUsWithCountStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        "0": {
            skusWithCount: {
                skus: [
                    {
                        sku: "",
                        count: 0,
                    },
                ],
            },
        },
        loading: true,
    });
}

function fetchSKUsWithCountSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const details = cloneDeep(state.skusWithCount);

    //If SKU name and count object is already present in the redux store
    const existingIds = details[action.payload.id]?.skus?.map(
        (detail: { sku: string }) => detail?.sku,
    );

    // Fetch SKU name and count object from API if not present in redux store
    const newData = action.payload.response?.skus?.filter(
        (s: { sku: string }) => !existingIds?.includes(s?.sku),
    );

    // If no SKU name and count object i present in redux store "undefined" becomes 0
    const length = existingIds?.length ?? 0;

    //If SKU name and count object is already present in the redux store then append data fetched from API to existing list
    // else consider only SKU details fetched from API
    if (length > 0 && details[action.payload.id]) {
        details[action.payload.id] = { skus: [...details[action.payload.id].skus, ...newData] };
    } else {
        details[action.payload.id] = action.payload.response;
    }

    details.loading = action.payload.loading;

    return updateObject(state, {
        skusWithCount: details,
    });
}

function updateSKUsWithCountSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const details = cloneDeep(state.skusWithCount);
    details[action.payload.job_id] = { skus: action.payload.latestData };

    // If SKU is deleted by user update the count in redux store
    return updateObject(state, {
        skusWithCount: details,
    });
}

function fetchSkusWithCountFailed(state: Iscrapersstate) {
    return updateObject(state, {
        skusWithCount: {
            skus: [
                {
                    sku: "",
                    count: 0,
                },
            ],
            loading: false,
        },
    });
}

// eslint-disable-next-line no-unused-vars
function fetchDataForSearchFiltersStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        categories: initState.categories,
    });
}

function fetchDataForSearchFiltersSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        categories: {
            finish: action.payload.finish,
            grade: action.payload.grade,
            style: action.payload.style,
            category: action.payload.category,
            package: action.payload.package,
            subcategory: action.payload.subcategory,
            supplier: action.payload.supplier,
            subcategory_pair: action.payload.subcategory_pair,
            manufacturers: action.payload.manufacturers,
        },
    });
}

// eslint-disable-next-line no-unused-vars
function updateDataForSearchFiltersStart(state: Iscrapersstate, action: PayloadAction<any>) {
    return state;
}

function updateDataForSearchFiltersSuccess(state: Iscrapersstate, action: PayloadAction<any>) {
    const categories = cloneDeep(state.categories);
    categories[action.payload.payload.update].push(action.payload.payload.value);

    return updateObject(state, {
        categories: categories,
    });
}

const slice = createSlice({
    name: "Scraper",
    initialState: initialState,
    reducers: {
        fetchScraperStart,
        fetchScraperSuccess,
        fetchScraperFailure,
        uploadNewImageFileStart,
        uploadNewImageFileSuccess,
        uploadNewJobStart,
        uploadNewJobSuccess,
        uploadNewJobFailure,
        getScrapeJobDetails,
        fetchscrapeJobDetailsSuccess,
        updateJobDetailsSuccess,
        saveJobDetailsSuccess,
        saveJobDetailsFailure,
        saveJobDetailsStart,
        fetchScrapeDataFromLinkStart,
        fetchScrapeDataFromLinkSuccess,
        fetchScrapeDataFromLinkFailure,
        getLinkScrapeDataStart,
        getLinkScrapeDataSuccess,
        fetchSKUsWithCountStart,
        fetchSKUsWithCountSuccess,
        fetchSkusWithCountFailed,
        updateSKUsWithCountSuccess,
        fetchDataForSearchFiltersStart,
        fetchDataForSearchFiltersSuccess,
        updateDataForSearchFiltersStart,
        updateDataForSearchFiltersSuccess,
    },
});

export const actions = slice.actions;

export default slice.reducer;
