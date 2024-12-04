import { PayloadAction } from "@reduxjs/toolkit";
import { put, all } from "@redux-saga/core/effects";
import {
    getListofScrapingJobs,
    postNewScrapeJob,
    getJobDetails,
    saveJobDetails,
    scrapeFromLink,
    getSkusWithCount,
    getPackageCreateSearchFilters,
} from "../service/scraper-queries";

import actions from "../../actions";
import { client } from "../../gql-client";
import { CREATE_S3_SIGNED_URL } from "../../common/queries";
import { uploadToS3 } from "../../projects/details/overview/overview-queries-api";

let scrapingRes: {
    error: boolean;
    errorMsg: string;
    job_id: string;
};

type packageList = {
    id: string;
    name: string;
};

export function* fetchScraper() {
    try {
        const response: {
            name: string;
            description: string;
            ownership_name: string;
            job_id: string;
            status: string;
            file_name: string;
            created_at: string;
            created_by: string;
        } = yield client.query("getListofScrapingJobs", getListofScrapingJobs);

        yield put(actions.scraperService.fetchScraperSuccess(response));
    } catch (error) {
        yield put(actions.scraperService.fetchScraperFailure());
    }
}

export function* fetchScrapeJobDetails(action: PayloadAction<any>) {
    try {
        const response: {
            data: {
                created_at: string;
                id: number;
                job_id: String;
                properties: JSON;
                result: {
                    description: string;
                    finish: string;
                    grade: string;
                    item_number: string;
                    manufacturer_name: string;
                    model_number: string;
                    price: string;
                    product_thumbnail_url: string;
                    style: string;
                    subcategory: string;
                    supplier: string;
                    vendor_thumbnail_url: string;
                    vendor_subcategory: string;
                    category: string;
                };
                status: string;
                url: string;
                vendor: string;
            };
            job: {
                name: string;
                description: string;
                ownership_name: string;
                created_by: string;
                job_id: string;
                status: string;
                file_name: string;
                created_at: string;
                properties: {
                    sheet_names: [string];
                };
            };
            deletedList: [];
        } = yield client.query("getJobDetails", getJobDetails, {
            job_id: action.payload.job_id,
        });
        const data = {
            loading: false,
            id: action.payload.job_id,
            response: response,
            deletedList: action.payload.deletedList === undefined ? [] : action.payload.deletedList,
        };

        yield put(actions.scraperService.fetchscrapeJobDetailsSuccess(data));
    } catch (error) {
        yield put(actions.scraperService.fetchScraperFailure());
    }
}

export function* fetchLinkJobId(action: PayloadAction<any>) {
    try {
        const response: {
            error: boolean;
            errorMsg: string;
            job_id: string;
        } = yield client.mutate("scrapeFromLink", scrapeFromLink, { url: action.payload });

        if (!response.job_id) {
            yield all([
                put(actions.scraperService.fetchScrapeDataFromLinkFailure(response)),
                put(
                    actions.common.openSnack({
                        message: "Failed to scrape data",
                        variant: "error",
                        open: true,
                    }),
                ),
            ]);
        } else {
            yield put(actions.scraperService.fetchScrapeDataFromLinkSuccess(response));
        }
    } catch (error) {
        yield put(actions.scraperService.fetchScrapeDataFromLinkFailure(error));
    }
}

export function* fetchLinkScrapedData(action: PayloadAction<any>) {
    try {
        const response: {
            data: {
                created_at: string;
                id: number;
                job_id: String;
                properties: JSON;
                result: {
                    description: string;
                    finish: string;
                    grade: string;
                    item_number: string;
                    manufacturer_name: string;
                    model_number: string;
                    price: string;
                    product_thumbnail_url: string;
                    style: string;
                    subcategory: string;
                    supplier: string;
                    vendor_thumbnail_url: string;
                    vendor_subcategory: string;
                    category: string;
                };
                status: string;
                url: string;
                vendor: string;
            };
            job: {
                name: string;
                description: string;
                ownership_name: string;
                created_by: string;
                job_id: string;
                status: string;
                file_name: string;
                created_at: string;
                properties: {
                    sheet_names: [string];
                };
            };
        } = yield client.query("getJobDetails", getJobDetails, {
            job_id: action.payload.job_id,
        });

        if (!response) {
            yield all([
                put(actions.scraperService.fetchScrapeDataFromLinkFailure(true)),
                put(
                    actions.common.openSnack({
                        message: "Failed to scrape data",
                        variant: "error",
                        open: true,
                    }),
                ),
            ]);
        }

        yield put(actions.scraperService.getLinkScrapeDataSuccess(response));
    } catch (error) {
        yield put(actions.scraperService.fetchScrapeDataFromLinkFailure(error));
    }
}

export function* uploadImageFileToS3(action: PayloadAction<any>) {
    try {
        const response: [
            {
                file_name: string;
                signed_url: string;
            },
        ] = yield client.mutate("createS3SignedURL", CREATE_S3_SIGNED_URL, {
            input: {
                file_names: [action.payload.fileName],
                prefix_path: action.payload.filePath,
            },
        });

        let res;
        if (response.length > 0) {
            // @ts-ignore
            res = yield uploadToS3(response[0], action.payload.file);
            res = { ...res, id: action.payload.id };
            yield put(actions.scraperService.uploadNewImageFileSuccess(res));
        }
    } catch (error) {
        yield all([
            put(
                actions.common.openSnack({
                    message: "Failed to upload to s3",
                    variant: "error",
                    open: true,
                }),
            ),
        ]);
    }
}

export function* uploadNewFileforScraping(action: PayloadAction<any>) {
    try {
        const response: [
            {
                file_name: string;
                signed_url: string;
            },
        ] = yield client.mutate("createS3SignedURL", CREATE_S3_SIGNED_URL, {
            input: {
                file_names: [action.payload.fileName],
                prefix_path: action.payload.filePath,
            },
        });

        let res;
        let uuid;
        if (response.length > 0) {
            uuid = response[0].signed_url.split("/")[4];
            // @ts-ignore
            res = yield uploadToS3(response[0], action.payload.file);
        }

        if (res.config.url) {
            scrapingRes = yield client.mutate("postNewScrapJob", postNewScrapeJob, {
                name: action.payload.name,
                ownership_name: action.payload.ownership_name,
                ownership_group_id: action.payload?.ownership_group_id,
                description: action.payload.description || "",
                created_by: getUsername() ?? "user1test",
                file_name: `${uuid}/${action.payload.fileName}`,
            });
        }

        let data = {
            loading: false,
            uploading: {},
            new_job: {},
        };
        if (scrapingRes.job_id) {
            data.uploading = { url: res.config.url, status: "success", error: false, errMsg: "" };
            data.new_job = {
                job_id: scrapingRes.job_id,
                file_name: action.payload.fileName,
                description: action.payload.description,
                ownership_name: action.payload.ownership_name,
                ownership_group_id: action.payload?.ownership_group_id,
                created_by: getUsername() ?? "",
                name: action.payload.name,
                status: "submitted",
                uploadedBy: getUsername(),
                created_at: new Date().toDateString(),
            };
        }

        yield put(actions.scraperService.uploadNewJobSuccess(data));
    } catch (error) {
        yield all([
            put(
                actions.common.openSnack({
                    message: "Failed to upload package",
                    variant: "error",
                    open: true,
                }),
            ),
            put(actions.scraperService.uploadNewJobFailure()),
        ]);
    }
}

export function* saveCurrentJobDetails(action: PayloadAction<any>) {
    try {
        const payload = {
            subcategories: action.payload?.subcategories,
            data: action.payload.data,
            delete_list: action.payload.deleteList,
        };
        yield client.mutate("saveJobDetails", saveJobDetails, {
            job_id: action.payload.job_id,
            data: payload,
        });
        const data = {
            job_id: action.payload.job_id,
            data: action.payload?.latestData,
        };

        yield all([put(actions.scraperService.saveJobDetailsSuccess(data))]);
    } catch (error) {
        yield all([
            put(
                actions.common.openSnack({
                    message: "Failed to save package details",
                    variant: "error",
                    open: true,
                }),
            ),
            put(actions.scraperService.uploadNewJobFailure()),
        ]);
    }
}

export function* fetchSKUsWithCount(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const response = yield client.query("getSkusWithCount", getSkusWithCount, {
            job_id: action.payload.job_id,
        });
        const data = {
            loading: false,
            id: action.payload.job_id,
            response: response,
        };

        yield put(actions.scraperService.fetchSKUsWithCountSuccess(data));
    } catch (error) {
        yield put(actions.scraperService.fetchSkusWithCountFailed());
    }
}

export function* fetchDataForSearchFilters(action: PayloadAction<any>) {
    //@ts-ignore
    const response: {
        data: {
            getPackageCreateSearchFilters: {
                category: [string];
                finish: [string];
                grade: [string];
                package: [packageList];
                style: [string];
                subcategory: [string];
                supplier: [string];
                manufacturers: [string];
            };
        };
    } = yield client.query("getPackageCreateSearchFilters", getPackageCreateSearchFilters, {
        input: action.payload.input,
    });
    yield put(actions.scraperService.fetchDataForSearchFiltersSuccess(response));
}

export function* updateDataForSearchFilters(action: PayloadAction<any>) {
    yield put(actions.scraperService.updateDataForSearchFiltersSuccess(action));
}

export function getUsername() {
    let email = localStorage.getItem("email");
    let gname;

    if (email) {
        gname = email.split(`@`)[0];
    }
    return gname;
}
