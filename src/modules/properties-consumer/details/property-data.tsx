/* eslint-disable react-hooks/exhaustive-deps */
import React, { Grid, Box } from "@mui/material";
import propertyAsset from "../../../assets/icons/property-asset.png";

import { useAppSelector } from "../../../stores/hooks";

import BaseButton from "components/base-button";
import StatsCard from "./stats-card";
import { isEmpty, map, sumBy } from "lodash";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

export interface IPropertyData {
    showPropertyData?: boolean;
    buttonAction: any;
    cover_picture: any;
}

const PropertyData = ({ showPropertyData, buttonAction, cover_picture }: IPropertyData) => {
    const { propertyStats } = useAppSelector((state) => ({
        propertyStats: state.propertiesConsumer.propertyStats.data,
    }));

    const isKeyStatsEnabled = useFeature(FeatureFlagConstants.KEY_STATS_ENABLED).on;

    const keyStatsEnabledMap: { [id: string]: boolean } = {
        FLOORPLAN: useFeature(FeatureFlagConstants.INTERIOR_KEY_STATS_ENABLED).on,
        BUILDING: useFeature(FeatureFlagConstants.EXTERIOR_KEY_STATS_ENABLED).on,
        COMMON_AREA: useFeature(FeatureFlagConstants.COMMON_AREA_KEY_STATS_ENABLED).on,
        SITE: useFeature(FeatureFlagConstants.SITE_KEY_STATS_ENABLED).on,
    };

    return (
        <Grid
            container
            px={1}
            style={{
                maxHeight: showPropertyData ? "350px" : "0px",
                overflow: showPropertyData ? "visible" : "hidden",
                transition: "max-height 0.5s ease",
            }}
        >
            <Grid item md={12} display="flex" mb={2}>
                <Box mr={11}>
                    <img
                        src={cover_picture || propertyAsset}
                        alt="property-asset"
                        width="164px"
                        height="169px"
                    />
                </Box>
                {isKeyStatsEnabled && (
                    <Box display="flex">
                        {map(propertyStats, (stats: any[], key: string) => {
                            if (!keyStatsEnabledMap[key]) return null;
                            if (sumBy(stats, "count") === 0 || isEmpty(stats)) {
                                return null;
                            }
                            return <StatsCard statsKey={key} statsDetails={stats} />;
                        })}
                    </Box>
                )}
            </Grid>
            <Grid item md={6} mb={5}>
                <BaseButton
                    label="Start New Project "
                    sx={{ width: "164px", margin: "0px" }}
                    width="164px"
                    type="active"
                    onClick={buttonAction}
                />
            </Grid>
        </Grid>
    );
};

export default PropertyData;
