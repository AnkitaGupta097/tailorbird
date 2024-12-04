import { Grid, Typography } from "@mui/material";
import React from "react";
import AppTheme from "styles/theme";

interface IKeyValueRowProps {
    field: any;
    value: any;
    fieldTypographyProps?: any;
    valueTypographyProps?: any;
    spacing?: number;
    sx?: any;
}

const KeyValueRow = ({
    field,
    value,
    spacing,
    fieldTypographyProps = {},
    valueTypographyProps = {},
    sx,
}: IKeyValueRowProps) => {
    const renderLabel = (label: string) => {
        return (
            <Typography
                variant="text_14_regular"
                color={AppTheme.text.medium}
                {...fieldTypographyProps}
            >
                {label}
            </Typography>
        );
    };

    const renderTextValue = (label: string) => {
        return (
            <Typography variant="text_14_semibold" {...valueTypographyProps}>
                {label}
            </Typography>
        );
    };

    const isString = (value: any) => {
        return typeof value === "string" || typeof value === "number";
    };

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            columnGap={spacing}
            sx={{ padding: "6px 0", ...sx }}
        >
            <Grid item>{isString(field) ? renderLabel(field) : field}</Grid>
            <Grid item>{isString(value) ? renderTextValue(value) : value}</Grid>
        </Grid>
    );
};

export default KeyValueRow;
