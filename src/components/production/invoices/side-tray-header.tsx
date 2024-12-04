import { Clear } from "@mui/icons-material";
import { Avatar, Grid, IconButton, Typography } from "@mui/material";

import React from "react";
import InvoiceTypeChip from "./invoice-type-chip";
import { invoiceType } from "./invoice-card";
import { stringAvatar } from "../../../modules/rfp-manager/helper";
import theme from "../../../styles/theme";

interface ISideTrayHeaderProps {
    contractorName?: string;
    type: invoiceType;
    onClose: () => void;
}

const SideTrayHeader = ({ contractorName, type, onClose }: ISideTrayHeaderProps) => {
    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                {contractorName ? (
                    <Avatar {...stringAvatar(contractorName, theme.icon.successDefault)} />
                ) : (
                    <Avatar />
                )}
            </Grid>
            <Grid item>
                <Typography variant="text_18_medium" paddingLeft={2}>
                    {contractorName}
                </Typography>
            </Grid>
            <Grid item marginLeft="auto">
                <InvoiceTypeChip type={type} />
                <IconButton onClick={onClose} sx={{ paddingRight: 0 }}>
                    <Clear />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default SideTrayHeader;
