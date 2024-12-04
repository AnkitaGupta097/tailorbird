import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import AppTheme from "../../styles/theme";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-icon.svg";
import { ReactComponent as SuccessIcon } from "../../assets/icons/success-icon.svg";
import { ReactComponent as WarningIcon } from "../../assets/icons/warning-icon.svg";
import { ReactComponent as ErrorIcon } from "../../assets/icons/error-icon.svg";
import { SNACKBAR_VARIANT } from "../../styles/common-constant";

interface IBaseSnackbar {
    title?: string;
    description?: string;
    variant: string;
}

const BaseSnackbar = ({ title, description, variant }: IBaseSnackbar) => {
    const getIcon = () => {
        switch (variant) {
            case SNACKBAR_VARIANT.ERROR:
                return <ErrorIcon />;
            case SNACKBAR_VARIANT.INFO:
                return <InfoIcon />;
            case SNACKBAR_VARIANT.SUCCESS:
                return <SuccessIcon />;
            case SNACKBAR_VARIANT.WARNING:
                return <WarningIcon />;

            default:
                true;
        }
    };
    const getColor = () => {
        switch (variant) {
            case SNACKBAR_VARIANT.ERROR:
                return AppTheme.text.error;
            case SNACKBAR_VARIANT.INFO:
                return AppTheme.text.info;
            case SNACKBAR_VARIANT.SUCCESS:
                return AppTheme.text.success;
            case SNACKBAR_VARIANT.WARNING:
                return AppTheme.text.warning;

            default:
                true;
        }
    };

    return (
        <Box
            sx={{
                width: "20rem",
                padding: "16px 0px",
                borderRadius: "5px",
                margin: "0px",
            }}
        >
            <Grid container alignItems={"center"}>
                <Grid item md={1} mt={-0.3} marginRight={"10px"}>
                    {getIcon()}
                </Grid>
                <Grid item md={9}>
                    {/* the variant cannot be used as the MUI component overrides the variant style */}
                    <Typography fontSize={16} fontWeight={600} color={getColor()}>
                        {title}
                    </Typography>
                    <Box>
                        {/* the variant cannot be used as the MUI component overrides the variant style */}
                        <Typography color={getColor()} fontSize={14} fontWeight={400}>
                            {description}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BaseSnackbar;
