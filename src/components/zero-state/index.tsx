import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AppTheme from "styles/theme";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

interface IZeroStateProps {
    label?: string;
    icon?: React.ReactNode;
}
const ZeroStateComponent = ({ label, icon }: IZeroStateProps) => {
    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ height: "100%" }}
            spacing={4}
        >
            <Grid item>
                <Typography variant="text_18_medium" align="center" color={AppTheme.text.medium}>
                    {label ?? "No data available"}
                </Typography>
            </Grid>
            <Grid item>
                {icon ?? (
                    <DoNotDisturbIcon sx={{ height: "50px", width: "50px" }} color="secondary" />
                )}
            </Grid>
        </Grid>
    );
};

export default ZeroStateComponent;
