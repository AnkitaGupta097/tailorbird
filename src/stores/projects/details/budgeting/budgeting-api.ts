import { CREATE_RENOVATION_VERSION, GET_BID_BOOK } from "./budgeting-queries";
import { CREATE_BID_BOOK } from "./budgeting-mutations";
import actions from "../../../actions";
import { graphQLClient } from "../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { put, all } from "@redux-saga/core/effects";
import { addItem, addItemFailure, fetchItemFailure } from "./snack-messages";

interface IResponse {
    bidbook: any;
}

export function* fetchBidBook(action: PayloadAction<any>) {
    try {
        const response: IResponse = yield graphQLClient.query("", GET_BID_BOOK, {
            projectId: action.payload.projectId,
        });
        yield all([
            put(actions.budgeting.fetchExportDetailsSuccess(response)),
            response.bidbook.generateBidbookStatus === "FAILED" && !action.payload.onBudgetingLoad
                ? put(
                      actions.common.openSnack({
                          message: "Create bid-book failed. get in touch with the team",
                          variant: "error",
                      }),
                  )
                : null,
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchExportDetailsFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("export bid book"))),
        ]);
    }
}

export function* createBidBook(action: PayloadAction<any>) {
    try {
        const response: IResponse = yield graphQLClient.mutate("bidbook", CREATE_BID_BOOK, {
            input: {
                project_id: action.payload.projectId,
                project_name: action.payload.projectName,
                created_by: action.payload.createdBy,
            },
        });
        yield all([
            put(
                actions.budgeting.createBidBookSuccess({
                    bidbook: response,
                }),
            ),
            put(actions.common.openSnack(addItem("create bid book"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.createBidBookFailure(error)),
            put(
                actions.common.openSnack(
                    addItemFailure("Create bid-book failed. get in touch with the team"),
                ),
            ),
        ]);
    }
}

export function* saveBidBook(action: PayloadAction<any>) {
    try {
        let renoVersion: {} = {};
        renoVersion = yield graphQLClient.mutate(
            "createRenovationVersion",
            CREATE_RENOVATION_VERSION,
            {
                createRenovationVersionPayload: {
                    project_id: action.payload.projectId,
                    created_by: action.payload.createdBy,
                },
            },
        );
        yield all([
            put(
                actions.budgeting.saveBidBookSuccess({
                    renoVersion: renoVersion,
                }),
            ),
            put(actions.common.openSnack(addItem("save bid book"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.saveBidBookFailure(error)),
            put(
                actions.common.openSnack(
                    addItemFailure("Save bid-book failed. get in touch with the team"),
                ),
            ),
        ]);
    }
}
