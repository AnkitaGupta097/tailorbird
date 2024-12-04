import reducer from "./slice";
import { all } from "@redux-saga/core/effects";
import { InvoicesSaga } from "./saga";

export { actions } from "./slice";
export { reducer as invoicesReducer };

export function* invoicesSaga() {
    yield all([...InvoicesSaga]);
}

export type { IInvoicesState } from "./interfaces";
