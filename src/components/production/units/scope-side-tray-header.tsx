import { Clear } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";

import React from "react";

import ScopeStatusChip from "../common/scope-status-chip";

interface ISideTrayHeaderProps {
    name: string;
    status: string;
    onClose: () => void;
}

const ScopeSideTrayHeader = ({ name, onClose, status }: ISideTrayHeaderProps) => {
    return (
        <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
                <Typography variant="text_18_medium">{name}</Typography>
            </Grid>
            <Grid item marginLeft="auto">
                <ScopeStatusChip status={status} />
                <IconButton onClick={onClose} sx={{ paddingRight: 0 }}>
                    <Clear />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default ScopeSideTrayHeader;
