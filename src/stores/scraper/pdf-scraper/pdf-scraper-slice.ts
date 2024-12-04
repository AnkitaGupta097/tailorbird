import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { updateObject } from "../../../utils/store-helpers";
import initAjaxState from "../../initAjaxState.json";

const initState = cloneDeep(initAjaxState) as any;
initState.loading = false;
initState.saving = false;
initState.data = {
    0: {
        skus: [],
        spec_file: {
            created_at: "",
            file_name: "",
            id: "",
            job_id: "",
            parsed_file_reference: null,
            updated_at: "",
        },
        fileContent: "",
    },
};

export interface IPdfscrapersstate {
    loading: boolean;
    saving: boolean;
    error: boolean;
    data: typeof initState.data;
}
const initialState: IPdfscrapersstate = initState;
//eslint-disable-next-line no-unused-vars
function fetchPdfScraperStart(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function fetchPdfScraperSuccess(state: IPdfscrapersstate, action: PayloadAction<any>) {
    const obj = {
        [action.payload.job_id]: {
            skus: action.payload.skus,
            spec_file: action.payload.spec_file,
            fileContent: action.payload.fileContent,
        },
    };

    return updateObject(state, {
        loading: false,
        data: { ...state.data, ...obj },
    });
}
//eslint-disable-next-line no-unused-vars
function fetchPdfScraperFailure(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}
//eslint-disable-next-line no-unused-vars
function getPdfScrapeJobStatusStart(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function getPdfScrapeJobStatusSuccess(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        data: { ...state.data, ...action.payload },
    });
}
//eslint-disable-next-line no-unused-vars
function updateSelectedSkusStart(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        saving: true,
    });
}

function updateSelectedSkusSuccess(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        saving: false,
        data: { ...state.data, ...action.payload },
    });
}
//eslint-disable-next-line no-unused-vars
function updateSelectedSkusFailed(state: IPdfscrapersstate, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        saving: false,
    });
}

const slice = createSlice({
    name: "Scraper",
    initialState: initialState,
    reducers: {
        fetchPdfScraperStart,
        fetchPdfScraperSuccess,
        fetchPdfScraperFailure,
        getPdfScrapeJobStatusStart,
        getPdfScrapeJobStatusSuccess,
        updateSelectedSkusStart,
        updateSelectedSkusSuccess,
        updateSelectedSkusFailed,
    },
});

export const actions = slice.actions;

export default slice.reducer;
