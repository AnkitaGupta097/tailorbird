import { takeEvery } from "@redux-saga/core/effects";
import {
    fetchFinalInvoices,
    fetchDraftInvoices,
    fetchInvoiceMetaData,
    fetchInvoiceDetail,
    generateInvoice,
} from "./operation";

import { actions } from "./slice";

export const InvoicesSaga = [
    takeEvery(actions.fetchFinalInvoicesStart.type, fetchFinalInvoices),
    takeEvery(actions.fetchDraftInvoicesStart.type, fetchDraftInvoices),
    takeEvery(actions.fetchInvoiceMetaDataStart.type, fetchInvoiceMetaData),
    takeEvery(actions.fetchInvoiceDetailStart.type, fetchInvoiceDetail),
    takeEvery(actions.generateInvoiceStart.type, generateInvoice),
];
