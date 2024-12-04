import React, { ReactNode } from "react";

import { Grid, Typography } from "@mui/material";

interface IKeyValueProps {
    label: string;
    value: string | ReactNode;
}

const KeyValue = ({ label, value }: IKeyValueProps) => {
    return (
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid>
                <Typography variant="keyText">{label}</Typography>
            </Grid>
            <Grid>
                <Typography variant="valueText">{value}</Typography>
            </Grid>
            <Grid container item>
                <hr style={{ flex: 1, border: "1px solid #C9CCCF" }} />
            </Grid>
        </Grid>
    );
};

export default KeyValue;
