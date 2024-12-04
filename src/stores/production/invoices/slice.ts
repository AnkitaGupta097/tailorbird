import { updateObject } from "../../../utils/store-helpers";
import initialState from "./invoices-init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, isNil } from "lodash";
import { IInvoicesState } from "./interfaces";

const initState: any = cloneDeep(initialState);

function fetchFinalInvoicesStart(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: isNil(action.payload.loading) ? true : action.payload.loading,
    });
}

function fetchDraftInvoicesStart(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: isNil(action.payload.loading) ? true : action.payload.loading,
    });
}

function fetchInvoicesSuccess(state: IInvoicesState, action: PayloadAction<any>) {
    const updatedObject: any = { loading: false };
    if (action.payload.finalInvoices) {
        updatedObject.finalInvoices = action.payload.finalInvoices;
    } else {
        updatedObject.draftInvoices = action.payload.draftInvoices;
    }

    return updateObject(state, updatedObject);
}

function fetchInvoicesMetaDataSuccess(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        invoiceMetadata: action.payload.metadata,
    });
}

function fetchInvoicesFailure(state: IInvoicesState, action: PayloadAction<any>) {
    const dataType = action.payload.dataType;
    const updatedObject: any = { loading: false };

    if (dataType) {
        updatedObject[dataType] = undefined;
    }

    return updateObject(state, updatedObject);
}

/* eslint-disable no-unused-vars */
function fetchInvoiceMetaDataStart(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchInvoiceDetailStart(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function fetchInvoiceDetailSuccess(state: IInvoicesState, action: PayloadAction<any>) {
    const invoiceId = action.payload.invoiceId;
    const invoiceDetail = action.payload.invoiceDetail;

    const invoices = state.finalInvoices?.map((invoice) => {
        if (invoice.id === invoiceId) {
            return { ...invoice, ...invoiceDetail };
        }
        return invoice;
    });

    return updateObject(state, {
        loading: false,
        finalInvoices: invoices,
    });
}

function generateInvoiceStart(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
    });
}

function generateInvoiceSuccess(state: IInvoicesState, action: PayloadAction<any>) {
    const newInvoice = action.payload.newInvoice;
    const contractorId = action.payload.contractorId;

    const updatedFinalInvoices = [...state.finalInvoices, { ...newInvoice }];
    const updatedDraftInvoices = state.draftInvoices?.filter(
        (draft) => draft?.contractor_id !== contractorId,
    );

    return updateObject(state, {
        loading: false,
        finalInvoices: updatedFinalInvoices,
        draftInvoices: updatedDraftInvoices,
    });
}

function generateInvoiceFailure(state: IInvoicesState, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
    });
}

function resetState() {
    return initState;
}

const slice = createSlice({
    name: "Invoices",
    initialState: initState,
    reducers: {
        fetchFinalInvoicesStart,
        fetchInvoicesSuccess,
        fetchInvoicesFailure,
        fetchDraftInvoicesStart,
        fetchInvoiceMetaDataStart,
        fetchInvoiceDetailStart,
        fetchInvoicesMetaDataSuccess,
        fetchInvoiceDetailSuccess,
        generateInvoiceStart,
        generateInvoiceSuccess,
        generateInvoiceFailure,
        resetState,
    },
});

export const actions = slice.actions;

export default slice.reducer;
