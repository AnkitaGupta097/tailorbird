import { Forward } from "@mui/icons-material";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import { FORWARD_INVOICE_TO_PMS, GET_INVOICE } from "../constants";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { ApolloError } from "@apollo/client";

type IForwardInvoiceButtonProps = React.ComponentPropsWithRef<"div"> & {
    invoiceId: number;
};

const ForwardInvoiceButton = ({ invoiceId }: IForwardInvoiceButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isForwarding, setIsForwarded] = useState(false);
    const [isForwardedToPms, setIsForwardedToPMS] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    useEffect(() => {
        getInvoiceStatus();
        // eslint-disable-next-line
    }, [invoiceId]);

    async function getInvoiceStatus() {
        try {
            setIsLoading(true);
            const {
                getInvoice: { isForwardedToPms: forwardedToPMS },
            } = await graphQLClient.query("", GET_INVOICE, {
                invoiceId: invoiceId,
            });
            setIsForwardedToPMS(forwardedToPMS);
        } finally {
            setIsLoading(false);
        }
    }

    async function forwardInvoiceToPms() {
        try {
            setIsForwarded(true);
            await graphQLClient.mutate("", FORWARD_INVOICE_TO_PMS, { invoiceId });
            showSnackBar("success", "Invoice is forwarded to the PMS");
            await getInvoiceStatus();
        } catch (err) {
            const { message } = err as ApolloError;
            showSnackBar("error", message);
        } finally {
            setIsForwarded(false);
        }
    }
    return (
        <Tooltip
            title={
                isForwardedToPms
                    ? "Invoice is forwarded to PMS already"
                    : "Forward the Invoice to a PMS"
            }
        >
            <Button
                onClick={forwardInvoiceToPms}
                startIcon={
                    isForwardedToPms ? null : isForwarding || isLoading ? (
                        <CircularProgress size={8} />
                    ) : (
                        <Forward />
                    )
                }
                disabled={isLoading || isForwardedToPms || isForwarding}
            >
                {isForwardedToPms
                    ? "Forwarded To PMS"
                    : isForwarding
                    ? "Forwarding"
                    : isLoading
                    ? ""
                    : "Forward"}
            </Button>
        </Tooltip>
    );
};

export default ForwardInvoiceButton;
