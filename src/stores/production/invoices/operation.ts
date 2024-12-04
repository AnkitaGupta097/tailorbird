import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "@redux-saga/core/effects";

import {
    GET_DRAFT_INVOICES,
    GET_FINAL_INVOICES,
    GET_INVOICE_DETAILS,
    GET_INVOICE_METADATA,
    CREATE_INVOICE,
} from "./queries";
import actions from "../../actions";
import { client as graphQLClient } from "../../gql-client";
import TrackerUtil from "utils/tracker";

export function* fetchFinalInvoices(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getInvoices } = yield graphQLClient.query(
            "getInvoices",
            GET_FINAL_INVOICES,
            {
                projectId: action.payload.projectId,
            },
        );
        yield put(
            actions.production.invoices.fetchInvoicesSuccess({
                finalInvoices: response || [],
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.invoices.fetchInvoicesFailure({
                dataType: "finalInvoices",
            }),
        );
    }
}

export function* fetchDraftInvoices(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getDraftInvoices } = yield graphQLClient.query(
            "getDraftInvoices",
            GET_DRAFT_INVOICES,
            {
                projectId: action.payload.projectId,
            },
        );

        yield put(
            actions.production.invoices.fetchInvoicesSuccess({
                draftInvoices: response || [],
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.invoices.fetchInvoicesFailure({
                dataType: "draftInvoices",
            }),
        );
    }
}

export function* fetchInvoiceMetaData(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response: { getInvoiceMetadata } = yield graphQLClient.query(
            "getInvoiceMetadata",
            GET_INVOICE_METADATA,
            {
                projectId: action.payload.projectId,
            },
        );

        yield put(
            actions.production.invoices.fetchInvoicesMetaDataSuccess({
                metadata: response || {},
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.invoices.fetchInvoicesFailure({
                dataType: "metadata",
            }),
        );
    }
}

export function* fetchInvoiceDetail(action: PayloadAction<any>) {
    try {
        // @ts-ignore
        const response = yield graphQLClient.query("getInvoiceDetail", GET_INVOICE_DETAILS, {
            invoiceId: action.payload.invoiceId,
        });

        yield put(
            actions.production.invoices.fetchInvoiceDetailSuccess({
                invoiceId: action.payload.invoiceId,
                invoiceDetail: response[0],
            }),
        );
    } catch (exception) {
        yield put(actions.production.invoices.fetchInvoicesFailure({}));
    }
}

export function* generateInvoice(action: PayloadAction<any>) {
    const projectId = action.payload.projectId;
    const contractorId = action.payload.contractorId;
    const projectName = action.payload.projectName;

    try {
        //@ts-ignore
        const response = yield graphQLClient.mutate("createInvoice", CREATE_INVOICE, {
            projectId,
            contractorId,
        });

        yield put(
            actions.production.invoices.generateInvoiceSuccess({
                newInvoice: response,
                contractorId,
            }),
        );
        yield put(
            actions.common.openSnack({
                message: `Created invoice with id ${response?.id}`,
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(actions.production.invoices.generateInvoiceFailure({}));
        TrackerUtil.error(
            exception,
            {
                projectName,
                projectId,
                contractorId,
            },
            "FAILED_GENERATING_ON_DEMAND_INVOICE",
        );

        yield put(
            actions.common.openSnack({
                message: "Invoice generation failed. Please retry or contact Tailorbird support.",
                variant: "error",
                open: true,
            }),
        );
    }
}
