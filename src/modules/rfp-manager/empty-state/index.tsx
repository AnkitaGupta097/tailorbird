import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface IEmptyStateProps {
    label?: string;
}
const EmptyState = ({ label }: IEmptyStateProps) => {
    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ height: "100%" }}
        >
            <Grid item>
                <Typography
                    variant="text_18_medium"
                    align="center"
                    display="block"
                    whiteSpace="break-spaces"
                >
                    {label ?? "No data available"}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default EmptyState;
