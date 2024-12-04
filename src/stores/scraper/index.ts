import { combineReducers, Reducer } from "redux";
import { all } from "@redux-saga/core/effects";

import scraperReducer, { scraperServiceSaga, actions as scraperActions } from "./service/index";
import { Iscrapersstate } from "./service/scraper-slice";
import pdfScraperReducer, { pdfscraperSaga, actions as pdfScraperActions } from "./pdf-scraper";
import { IPdfscrapersstate } from "./pdf-scraper/pdf-scraper-slice";

// State interface
export interface IscraperServiceState {
    scraper: Iscrapersstate;
    pdfscraper: IPdfscrapersstate;
}

// State reducer
export const scraperServiceReducer: Reducer<IscraperServiceState> =
    combineReducers<IscraperServiceState>({
        pdfscraper: pdfScraperReducer,
        scraper: scraperReducer,
    });

// Actions
export const scraperServiceActions = {
    ...scraperActions,
    ...pdfScraperActions,
};

// Saga worker
export function* scrapersSaga() {
    yield all([...scraperServiceSaga, ...pdfscraperSaga]);
}
