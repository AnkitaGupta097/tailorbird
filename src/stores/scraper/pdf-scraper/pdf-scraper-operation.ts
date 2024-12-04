import { PayloadAction } from "@reduxjs/toolkit";
import { put, all } from "@redux-saga/core/effects";
import {
    getExtractedSKUS,
    getExtractedText,
    startScraping,
    updateSelectedSKUs,
} from "./pdf-scraper-queries";
import actions from "../../actions";
import { client } from "../../gql-client";

export function* fetchPdfScrapeData(action: PayloadAction<any>) {
    try {
        let skusResponse = null;

        //@ts-ignore
        skusResponse = yield client.query("getExtractedSKUS", getExtractedSKUS, {
            job_id: `${action.payload.job_id}`,
        });

        yield put(
            actions.scraperService.fetchPdfScraperSuccess({
                job_id: action.payload.job_id,
                skus: skusResponse?.skus,
                spec_file: { ...action.payload.spec_file },
                fileContent: action.payload.fileContent,
            }),
        );
    } catch (error) {
        yield put(actions.scraperService.fetchPdfScraperFailure(error));
    }
}

export function* fetchPDFScrapeJobStatus(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const scrapingRes = yield client.query("getExtractedText", getExtractedText, {
            job_id: `${action.payload.job_id}`,
        });

        yield put(
            actions.scraperService.fetchPdfScraperSuccess({ spec_file: scrapingRes?.spec_file }),
        );
    } catch (error) {
        yield put(actions.scraperService.fetchPdfScraperFailure(error));
    }
}

export function* updateSelectedSkus(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        //eslint-disable-next-line
        const scrapingRes = yield client.mutate("updateSelectedSKUs", updateSelectedSKUs, {
            job_id: action.payload.job_id,
            skus: action.payload.skus,
        });
        //@ts-ignore
        //eslint-disable-next-line no-unused-vars
        const startScrapeResponse = yield client.mutate("startScraping", startScraping, {
            job_id: action.payload.job_id,
        });
        yield all([
            put(actions.scraperService.updateSelectedSkusSuccess({})),
            put(
                actions.common.openSnack({
                    variant: "success",
                    message: "Successfully updated skus.",
                }),
            ),
        ]);
    } catch (error) {
        yield all([
            put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Error occured while updating skus.",
                }),
            ),
            actions.scraperService.updateSelectedSkusFailed({}),
        ]);
    }
}

// export function* getFoundSKUsData(action: PayloadAction<any>) {
//   try {
//     const scrapingRes = yield client.mutate("getFoundSKUsData", getFoundSKUsData, {
//       job_id: `${action.payload.job_id}`,
//       skus: `${action.payload.skus}`
//     });
//     yield all([put(actions.scraperService.updateSelectedSkusSuccess({})),
//     put(actions.common.openSnack({ variant: "success", message: "Successfully updated skus." }))]);
//   } catch (error) {
//     yield put(actions.common.openSnack({ variant: "error", message: "Error occured while updating skus." }));
//   }
// };
