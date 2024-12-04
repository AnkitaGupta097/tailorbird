import { PayloadAction } from "@reduxjs/toolkit";
import { put, all } from "@redux-saga/core/effects";

import { createPackage as createPkg, getPackages, updatePackageMetadata } from "./queries";

import actions from "../../actions";
import { getUserData } from "../../../utils/store-helpers";
import { client as graphQLClient } from "../../gql-client";

export function* fetchPackages(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        let payload = {
            is_alt: action.payload.is_alt,
            is_base: action.payload.is_base,
            is_standard: action.payload.is_standard,
            is_scraper: action.payload.is_scraper,
            search_name: action.payload?.search_name ?? "",
        };
        //@ts-ignore
        const response = yield graphQLClient.query("getPackages", getPackages, {
            input: payload,
        });

        yield put(actions.packageManager.fetchPackagesSuccess(response));
    } catch (error) {
        yield put(actions.packageManager.fetchPackagesFailure(error));
    }
}

export function* createPackage(action: PayloadAction<any>) {
    let payloadInput = action.payload.input;
    try {
        let input = {
            name: payloadInput.name,
            description: payloadInput.description,
            is_alt: payloadInput.is_alternate,
            item_ids: payloadInput.item_ids ?? [],
            labor_ids: payloadInput.labor_ids ?? [],
            msa: payloadInput.msa,
            project_id: payloadInput.project_id ?? null,
            ownership_group_id: payloadInput.ownership?.id ?? payloadInput.ownership_group_id,
            ownership_group_name: payloadInput.ownership?.name ?? payloadInput.ownership_group_name,
            is_standard: Boolean(payloadInput.is_standard),
            created_by: getUsername(),
            user_id: localStorage.getItem("user_id"),
            version: payloadInput?.version,
        };
        //@ts-ignore
        const response = yield graphQLClient.mutate("createPackage", createPkg, {
            input: input,
        });

        yield all([
            put(actions.packageManager.createPackageSuccess({ response })),
            put(
                actions.common.openSnack({
                    variant: "success",
                    open: true,
                    message: "Package Created Successfully",
                }),
            ),
        ]);
        if (payloadInput?.is_standard) {
            let filters = {
                is_alt: action.payload.is_alt,
                is_standard: action.payload.is_standard,
                is_scraper: action.payload.is_scraper,
                is_base: action.payload.is_base,
            };
            yield put(actions.packageManager.fetchPackagesStart({ ...filters }));
        }
    } catch (exception: any) {
        let showMessage =
            exception?.graphQLErrors?.[0]?.extensions?.response?.body?.error?.description?.includes(
                "HTTPConnectionPool",
            );
        if (!showMessage) {
            yield all([
                put(actions.packageManager.createPackageSuccess({ error: true })),
                put(
                    actions.common.openSnack({
                        variant: "failure",
                        open: true,
                        message: "Package Creation Failed",
                    }),
                ),
            ]);
        } else {
            yield all([
                // since its failed due to timeout response we wont have package id to update
                put(actions.packageManager.createPackageSuccess({})),
                put(
                    actions.common.openSnack({
                        variant: "success",
                        open: true,
                        message: "Package Created Successfully",
                    }),
                ),
            ]);
            if (payloadInput?.is_standard) {
                let filters = {
                    is_alt: action.payload.is_alt,
                    is_standard: action.payload.is_standard,
                    is_scraper: action.payload.is_scraper,
                    is_base: action.payload.is_base,
                };
                yield put(actions.packageManager.fetchPackagesStart({ ...filters }));
            }
        }
    }
}

export function* updatePKGErrorState(action: PayloadAction<any>) {
    yield put(actions.packageManager.updatePackageErrorState(action.payload));
}

export function* updatePackageMetaData(action: PayloadAction<any>) {
    try {
        let input = {
            name: action.payload.input.name,
            package_id: action.payload.input.package_id,
            description: action.payload.input.description ?? "",
        };
        let filters = {
            is_alt: action.payload.is_alt,
            is_standard: action.payload.is_standard,
            is_scraper: action.payload.is_scraper,
            is_base: action.payload.is_base,
        };
        yield graphQLClient.mutate("updatePackageMetadata", updatePackageMetadata, {
            input: input,
        });
        // Open Snackbar and refetch packages.
        yield all([
            put(actions.packageManager.updatePackageMetaDataComplete({})),
            put(
                actions.common.openSnack({
                    variant: "success",
                    message: "Updated Package Successfully",
                    open: true,
                }),
            ),
            put(
                actions.packageManager.fetchPackagesStart({
                    ...filters,
                }),
            ),
        ]);
    } catch (error) {
        yield all([
            put(actions.packageManager.updatePackageMetaDataComplete({ error: true })),
            put(
                actions.common.openSnack({
                    variant: "failed",
                    message: "Package Update Failed",
                    open: true,
                }),
            ),
        ]);
    }
}

function getUsername() {
    let userData = getUserData();
    let email = localStorage.getItem("email");
    let gname;

    if (userData && userData.name) {
        gname = "";
    } else if (email) {
        gname = email.split(`@`)[0];
    }
    return gname;
}
