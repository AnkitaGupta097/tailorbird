import { takeEvery } from "@redux-saga/core/effects";

import { actions } from "./pdf-scraper-slice";
import {
    fetchPdfScrapeData,
    fetchPDFScrapeJobStatus,
    updateSelectedSkus,
} from "./pdf-scraper-operation";

export const saga = [
    takeEvery(actions.fetchPdfScraperStart.type, fetchPdfScrapeData),
    takeEvery(actions.getPdfScrapeJobStatusStart.type, fetchPDFScrapeJobStatus),
    takeEvery(actions.updateSelectedSkusStart.type, updateSelectedSkus),
];
