import { gql } from "@apollo/client";

export const GET_FINAL_INVOICES = gql`
    query GetInvoices($projectId: String) {
        getInvoices(project_id: $projectId) {
            contractor {
                name
            }
            contractor_id
            created_at
            id
            type
            invoice_amount
            net_amount
            project_id
            user_set_invoice_id
        }
    }
`;

export const GET_INVOICE_DETAILS = gql`
    query GetInvoiceDetail($invoiceId: Int) {
        getInvoiceDetail(invoice_id: $invoiceId) {
            contractor_id
            contractor {
                id
                name
            }
            invoice_amount
            net_amount
            units {
                invoice_amount
                reno_unit_id
                reno_unit_status
                scopes {
                    invoice_amount
                    items {
                        unit_scope
                        contractor_id
                        scope_item_id
                        unit_scope_id
                        reno_unit_id
                        category
                        item
                        work_type
                        scope
                        manufacturer
                        model_number
                        takeoff_value
                        uom
                        pricing_group_id
                        start_price
                        price
                        unit_name
                        total_price
                        groups {
                            unit_scope
                            contractor_id
                            scope_item_id
                            unit_scope_id
                            reno_unit_id
                            category
                            item
                            work_type
                            scope
                            manufacturer
                            model_number
                            takeoff_value
                            uom
                            pricing_group_id
                            start_price
                            price
                            unit_name
                            total_price
                        }
                    }
                    unit_scope_status
                    scope_name
                    unit_scope_id
                }
                unit_name
            }
        }
    }
`;

export const GET_INVOICE_METADATA = gql`
    query GetInvoiceMetadata($projectId: String) {
        getInvoiceMetadata(project_id: $projectId) {
            auto_invoicing
            generated_invoice
            next_generation_amount
            next_generation_date
            outstanding_amount
        }
    }
`;

export const GET_DRAFT_INVOICES = gql`
    query GetDraftInvoices($projectId: String) {
        getDraftInvoices(project_id: $projectId) {
            invoice_amount
            net_amount
            contractor_id
            contractor {
                id
                name
            }
            units {
                unit_name
                reno_unit_id
                invoice_amount
                scopes {
                    scope_name
                    invoice_amount
                    items {
                        unit_scope
                        contractor_id
                        scope_item_id
                        unit_scope_id
                        reno_unit_id
                        category
                        item
                        work_type
                        scope
                        manufacturer
                        model_number
                        takeoff_value
                        uom
                        pricing_group_id
                        start_price
                        price
                        unit_name
                        total_price
                        groups {
                            unit_scope
                            contractor_id
                            scope_item_id
                            unit_scope_id
                            reno_unit_id
                            category
                            item
                            work_type
                            scope
                            manufacturer
                            model_number
                            takeoff_value
                            uom
                            pricing_group_id
                            start_price
                            price
                            unit_name
                            total_price
                        }
                    }
                    unit_scope_status
                }
                reno_unit_status
            }
        }
    }
`;

export const CREATE_INVOICE = gql`
    mutation CreateInvoice($projectId: String, $contractorId: String) {
        createInvoice(project_id: $projectId, contractor_id: $contractorId) {
            id
            contractor_id
            created_at
            project_id
            invoice_amount
            net_amount
            contractor {
                id
                name
            }
        }
    }
`;
