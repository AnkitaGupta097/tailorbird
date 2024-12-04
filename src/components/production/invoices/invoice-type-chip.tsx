import React from "react";

import BaseChip from "components/chip";
import { INVOICE_TYPE_COLOR_MAP } from "../constants";
import { invoiceType } from "./invoice-card";

interface IInvoiceTypeChip {
    type: invoiceType;
}

const InvoiceTypeChip = ({ type }: IInvoiceTypeChip) => {
    const chipProps = { ...INVOICE_TYPE_COLOR_MAP[type] };

    return <BaseChip sx={{ borderRadius: "4px" }} variant="filled" {...chipProps} />;
};

export default InvoiceTypeChip;
