import React, { useState } from "react";
import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import SideTrayHeader from "./side-tray-header";
import { invoiceType } from "./invoice-card";
import KeyValue from "../common/key-value";
import InvoiceUnitCard from "./invoice-unit-card";
import { getRoundedOffAndFormattedAmount } from "../helper";
import Loader from "modules/admin-portal/common/loader";
import HumanReadableData from "components/human-readable-date";
import { isNil } from "lodash";
import { useProductionContext } from "context/production-context";
import { FEATURE_FLAGS } from "../constants";
import { Edit } from "@mui/icons-material";
import { graphQLClient } from "utils/gql-client";
import { UPDATE_INVOICE_BY_ID } from "stores/projects/tpsm/tpsm-queries";

interface IInvoiceSideTrayProps {
    data: any;
    type: invoiceType;
    onClose: () => void;
    autoGenerationDate: string;
    onInvoiceIdChange: any;
}

const InvoiceSideTray = ({
    data,
    type,
    onClose,
    autoGenerationDate,
    onInvoiceIdChange,
}: IInvoiceSideTrayProps) => {
    const contractorOrgDetail = data?.contractor;
    const { hasFeature } = useProductionContext();
    const canEditInvoiceTitle = hasFeature(FEATURE_FLAGS.EDIT_INVOICE_TITLE);
    const [loading, setLoading] = useState(false);

    return (
        <Grid container flexDirection="column" padding={5} gap={6}>
            <Grid item>
                <SideTrayHeader
                    type={type}
                    contractorName={contractorOrgDetail?.name}
                    onClose={onClose}
                />
            </Grid>
            {!data?.units && !["retainage", "mobilization"].includes(data.type) ? (
                <Loader />
            ) : (
                <>
                    <Grid container item flexDirection="column" gap={2}>
                        {type !== "draft" && (
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid>
                                        <Typography variant="keyText">Invoice #</Typography>
                                    </Grid>
                                    <Grid marginLeft={"auto"}>
                                        <Typography variant="valueText">
                                            {data?.user_set_invoice_id || data?.id}
                                        </Typography>
                                    </Grid>
                                    {canEditInvoiceTitle && (
                                        <Grid>
                                            <IconButton
                                                onClick={async () => {
                                                    try {
                                                        setLoading(true);
                                                        const newInvoiceName = window.prompt(
                                                            "Provide the new Invoice ID",
                                                        );
                                                        if (newInvoiceName?.trim()) {
                                                            await graphQLClient.mutate(
                                                                "updateInvoiceById",
                                                                UPDATE_INVOICE_BY_ID,
                                                                {
                                                                    invoiceId: data?.id,
                                                                    invoiceName:
                                                                        newInvoiceName.trim(),
                                                                },
                                                            );
                                                            onInvoiceIdChange({
                                                                ...data,
                                                                user_set_invoice_id: newInvoiceName,
                                                            });
                                                        }
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <CircularProgress size={12} />
                                                ) : (
                                                    <Edit />
                                                )}
                                            </IconButton>
                                        </Grid>
                                    )}
                                    <Grid container item>
                                        <hr style={{ flex: 1, border: "1px solid #C9CCCF" }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        <Grid item>
                            <KeyValue
                                label="Total Amount"
                                value={
                                    !isNil(data?.net_amount)
                                        ? `$${getRoundedOffAndFormattedAmount(data?.net_amount)}`
                                        : "-"
                                }
                            />
                        </Grid>
                        {["retainage", "mobilization"].includes(data.type) && (
                            <Grid item>
                                <KeyValue
                                    label={"Type"}
                                    value={
                                        String(data.type[0]).toUpperCase() +
                                        data.type.slice(1, data.type.length)
                                    }
                                />
                            </Grid>
                        )}

                        <Grid item>
                            <KeyValue
                                label={type === "draft" ? "Auto-generation date" : "Generated on"}
                                value={<HumanReadableData dateString={autoGenerationDate} />}
                            />
                        </Grid>
                    </Grid>

                    {data?.units &&
                        data?.units.map((unit: any) => (
                            <Grid item key={unit.reno_unit_id}>
                                <InvoiceUnitCard unit={unit} />
                            </Grid>
                        ))}
                </>
            )}
        </Grid>
    );
};

export default InvoiceSideTray;
