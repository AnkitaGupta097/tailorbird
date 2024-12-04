import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { updateObject } from "../../../utils/store-helpers";
import initAjaxState from "../../initAjaxState.json";
import { BIDS_STATUSES } from "modules/rfp-manager/common/constants";

const initState = cloneDeep(initAjaxState) as any;

initState.loading = false;
initState.loadingProject = false;
initState.projectDetails = [];

initState.bidRequest = [];

initState.bidResponse = [];

initState.initialBidRequest = {};

export interface IRfpProjectState {
    loading: boolean;
    loadingProject: boolean;
    bidRequest: typeof initState.bidRequest;
    bidResponse: typeof initState.bidResponse;
    projectDetails: Array<{
        project_name: string;
        project_id: string;
        folder_url: string;
        bid_status: string;
        bidbook_url: string;
        [x: string]: any;
        available_bidding_slots: number | undefined;
        is_restricted_max_bidders: boolean | undefined;
        max_bidders: number;
    }>;
    initialBidRequest: typeof initState.initialBidRequest;
}

const initialState: IRfpProjectState = initState;

// eslint-disable-next-line no-unused-vars
function fetchProjectDetailsStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingProject: true,
    });
}

// eslint-disable-next-line no-unused-vars
function fetchProjectDetailsSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingProject: false,
        projectDetails: action.payload.response?.filter(
            (project: { bid_status: string; [x: string]: any }) =>
                project.bid_status !== BIDS_STATUSES.DECLINED,
        ),
    });
}

// eslint-disable-next-line no-unused-vars
function fetchProjectDetailsFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingProject: false,
    });
}

// eslint-disable-next-line no-unused-vars
function getBidRequestByProjectStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function getBidRequestByProjectSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        bidRequest: action?.payload?.response,
    });
}

// eslint-disable-next-line no-unused-vars
function getBidRequestByProjectFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function getBidRequestByIdStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        //loading: true,
    });
}

function getBidRequestByIdSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        //loading: false,
        initialBidRequest: action?.payload?.response,
        //bidRequest: [action?.payload?.response],
    });
}

// eslint-disable-next-line no-unused-vars
function getBidRequestByIdFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function getBidResponseStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function getBidResponseSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        bidResponse: action?.payload?.response,
    });
}

// eslint-disable-next-line no-unused-vars
function getBidResponseFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function acceptBidRequestByIdStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function acceptBidRequestByIdSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        bidRequest: action?.payload?.bidRequest,
        bidResponse: action?.payload?.bidResponse,
    });
}

// eslint-disable-next-line no-unused-vars
function acceptBidRequestByIdFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

// eslint-disable-next-line no-unused-vars
function createBidResponseStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function createBidResponseSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    let bidResponse = cloneDeep(state?.bidResponse);
    return updateObject(state, {
        loading: false,
        bidResponse: [...bidResponse, action?.payload?.response],
    });
}

// eslint-disable-next-line no-unused-vars
function createBidResponseFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

// eslint-disable-next-line no-unused-vars
function acceptOrDeclineBidStart(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

// eslint-disable-next-line no-unused-vars
function acceptOrDeclineBidSuccess(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

// eslint-disable-next-line no-unused-vars
function acceptOrDeclineBidFailure(state: IRfpProjectState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: true,
    });
}

const slice = createSlice({
    name: "Rfp Project",
    initialState: initialState,
    reducers: {
        fetchProjectDetailsStart,
        fetchProjectDetailsSuccess,
        fetchProjectDetailsFailure,
        getBidRequestByProjectStart,
        getBidRequestByProjectSuccess,
        getBidRequestByProjectFailure,
        getBidRequestByIdStart,
        getBidRequestByIdSuccess,
        getBidRequestByIdFailure,
        acceptBidRequestByIdStart,
        acceptBidRequestByIdSuccess,
        acceptBidRequestByIdFailure,
        createBidResponseStart,
        createBidResponseSuccess,
        createBidResponseFailure,
        getBidResponseStart,
        getBidResponseSuccess,
        getBidResponseFailure,
        acceptOrDeclineBidStart,
        acceptOrDeclineBidSuccess,
        acceptOrDeclineBidFailure,
    },
});

export const actions = slice.actions;

export const reducer = slice.reducer;
