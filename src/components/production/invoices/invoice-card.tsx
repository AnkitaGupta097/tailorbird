import { Avatar, Card, Divider, Grid, IconButton, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
// import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import ZoomIn from "@mui/icons-material/ZoomIn";
import theme from "../../../styles/theme";
import { stringAvatar } from "../../../modules/rfp-manager/helper";
import InvoiceTypeChip from "./invoice-type-chip";
import { getRoundedOffAndFormattedAmount } from "../helper";
import HumanReadableData from "components/human-readable-date";
import { isNil } from "lodash";

export type invoiceType = "final" | "draft";

interface IInvoiceCard {
    type: invoiceType;
    data: any;
    onClickSideTrayIcon: () => void;
    autoGenerationDate: string;
}

const getIcon = (type: invoiceType) => {
    if (type == "final") {
        return <ReceiptIcon htmlColor={theme.icon.successDark} />;
    }
    // else if (type == "downloaded") {
    //     return <DownloadDoneIcon htmlColor={theme.icon.successDark} />;
    // }
    else {
        return <ReceiptIcon htmlColor={theme.icon.alert} />;
    }
};

const getKeyValueElement = (
    key: string,
    value: string | ReactNode,
    showDivider: boolean = false,
) => {
    return (
        <>
            <Grid container flexDirection="column" alignItems="center">
                <Grid>
                    <Typography variant="keyText">{key}</Typography>
                </Grid>
                <Grid>
                    <Typography variant="text_14_semibold">{value}</Typography>
                </Grid>
            </Grid>
            {showDivider && <Divider orientation="vertical" style={{ paddingLeft: "20px" }} />}
        </>
    );
};

const InvoiceCard: React.FC<IInvoiceCard> = ({
    type,
    data,
    onClickSideTrayIcon,
    autoGenerationDate,
}) => {
    const contractorOrgDetail = data?.contractor;

    return (
        <Card style={{ padding: "12px 20px" }}>
            <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDirection="row"
            >
                <Grid item>
                    <Grid container flexDirection="row" gap={4} alignItems="center">
                        <Grid item>{getIcon(type)}</Grid>
                        {data?.id && (
                            <Grid item>
                                {getKeyValueElement(
                                    "Invoice #",
                                    data?.user_set_invoice_id || data?.id,
                                )}
                            </Grid>
                        )}
                        <Grid item>
                            {contractorOrgDetail ? (
                                <Avatar
                                    {...stringAvatar(
                                        contractorOrgDetail?.name,
                                        theme.icon.successDefault,
                                    )}
                                />
                            ) : (
                                <Avatar />
                            )}
                        </Grid>
                        <Grid item>
                            <Typography variant="text_18_medium" paddingLeft={2}>
                                {contractorOrgDetail?.name}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container flexDirection="row" gap={6} alignItems="center">
                        <Grid item>
                            <Typography variant="text_18_medium">
                                {!isNil(data?.net_amount)
                                    ? `$${getRoundedOffAndFormattedAmount(data?.net_amount)}`
                                    : "-"}
                            </Typography>
                        </Grid>
                        <Grid item>{<InvoiceTypeChip type={type} />}</Grid>
                        <Grid item>
                            {getKeyValueElement(
                                type === "draft" ? "Auto-generation date" : "Generated on",
                                <HumanReadableData dateString={autoGenerationDate} />,
                            )}
                        </Grid>
                        <Grid>
                            <IconButton onClick={onClickSideTrayIcon}>
                                <ZoomIn color="primary" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

export default InvoiceCard;
