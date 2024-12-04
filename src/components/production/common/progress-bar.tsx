import { Grid, LinearProgress, Typography } from "@mui/material";
import React from "react";
import AppTheme from "styles/theme";

interface IProgressBarProps {
    value: number;
}

const ProgressBar = ({ value }: IProgressBarProps) => {
    return (
        <Grid container alignItems="center" columnSpacing={4}>
            <Grid item xs>
                <LinearProgress variant="determinate" value={value} />
            </Grid>
            <Grid item textAlign="right">
                <Typography variant="text_14_regular" color={AppTheme.text.medium}>{`${Math.round(
                    value,
                )}% Done`}</Typography>
            </Grid>
        </Grid>
    );
};

export default ProgressBar;
