import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useProductionContext } from "context/production-context";
import React from "react";
import AppTheme from "styles/theme";
import { productionProjectsUrl } from "./constants";

const ProductionBreadCrumbs = () => {
    const { isRFPProject } = useProductionContext();

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator={
                <Typography variant="text_16_regular" color={AppTheme.text.medium}>
                    /
                </Typography>
            }
        >
            <Link
                underline="always"
                href={productionProjectsUrl(isRFPProject)}
                color={AppTheme.text.link}
            >
                <Typography variant="text_16_regular">Go to Previous</Typography>
            </Link>
            <Typography variant="text_16_regular" color={AppTheme.text.medium}>
                Project Name
            </Typography>
            <Typography variant="text_16_regular" color={AppTheme.text.medium}>
                Production
            </Typography>
        </Breadcrumbs>
    );
};

export default ProductionBreadCrumbs;
