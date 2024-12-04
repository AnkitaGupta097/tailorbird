/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography, Breadcrumbs, Link, Grid } from "@mui/material";
import appTheme from "styles/theme";
import { useAppSelector } from "../../../stores/hooks";

const PropertyDetailHeader = () => {
    const { propertyDetails } = useAppSelector((state) => ({
        propertyDetails: state.propertiesConsumer.propertyDetails,
    }));
    const goToPrevious = () => {
        window.history.back();
    };

    return (
        <Grid container pt={6} pb={3} display="flex" alignItems="center">
            <Grid item md={6}>
                <Link underline="hover" onClick={goToPrevious}>
                    <Typography variant="text_16_regular" color={appTheme.scopeHeader.label}>
                        Go to Previous
                    </Typography>
                </Link>
                /
                <Link
                    color="text.primary"
                    style={{
                        textDecoration: "none",
                    }}
                >
                    <Typography variant="text_16_regular">{propertyDetails?.name}</Typography>
                </Link>
            </Grid>
        </Grid>
    );
};

export default PropertyDetailHeader;
