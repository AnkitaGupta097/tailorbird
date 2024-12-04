import { takeEvery } from "@redux-saga/core/effects";
import {
    fetchScraper,
    uploadNewFileforScraping,
    fetchScrapeJobDetails,
    saveCurrentJobDetails,
    fetchLinkJobId,
    fetchLinkScrapedData,
    uploadImageFileToS3,
    fetchSKUsWithCount,
    fetchDataForSearchFilters,
    updateDataForSearchFilters,
} from "../service/scraper-operation";

import { actions } from "../service/scraper-slice";

export const saga = [
    takeEvery(actions.fetchScraperStart.type, fetchScraper),
    takeEvery(actions.uploadNewImageFileStart.type, uploadImageFileToS3),
    takeEvery(actions.uploadNewJobStart.type, uploadNewFileforScraping),
    takeEvery(actions.getScrapeJobDetails.type, fetchScrapeJobDetails),
    takeEvery(actions.saveJobDetailsStart.type, saveCurrentJobDetails),
    takeEvery(actions.fetchScrapeDataFromLinkStart.type, fetchLinkJobId),
    takeEvery(actions.getLinkScrapeDataStart.type, fetchLinkScrapedData),
    takeEvery(actions.fetchSKUsWithCountStart.type, fetchSKUsWithCount),
    takeEvery(actions.fetchDataForSearchFiltersStart.type, fetchDataForSearchFilters),
    takeEvery(actions.updateDataForSearchFiltersStart.type, updateDataForSearchFilters),
];
