type InvoiceUnit = {
    invoice_amount: number;
    reno_unit_id: string;
    reno_unit_status: string;
    scopes: any[];
    unit_name: string;
};

export interface InvoiceMetadata {
    auto_invoicing: boolean;
    generated_invoice: number;
    next_generation_amount: number;
    next_generation_date: string;
    outstanding_amount: number;
}

export interface IDraftInvoice {
    contractor: any;
    contractor_id: string;
    invoice_amount: number;
    net_amount: number;
    units: InvoiceUnit[];
}

export interface IInvoice {
    contractor: any;
    contractor_id: string;
    created_at: string;
    id: number;
    type: string | null;
    invoice_amount: number;
    net_amount: number;
    project_id: string;
    units: InvoiceUnit;
    user_set_invoice_id: string;
}

export interface IInvoicesState {
    finalInvoices: IInvoice[];
    draftInvoices: IDraftInvoice[];
    invoiceMetadata: InvoiceMetadata;
    loading: boolean;
}
