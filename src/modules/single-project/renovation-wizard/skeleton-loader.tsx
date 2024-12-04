/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";

const SkeletonLoader = () => {
    return (
        <Grid
            gridAutoFlow={"column"}
            columnGap={"12px"}
            rowGap={"15px"}
            display={"grid"}
            gridTemplateColumns={"repeat(auto-fill, minmax(210px, 1fr))"}
        >
            <Box
                padding={"16px"}
                sx={{
                    border: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                borderRadius={"4px"}
            >
                <Skeleton variant="rectangular" width={210} height={170} />
                <Skeleton variant="text" width={210} height={20} />
                <Skeleton variant="text" width={210} height={10} />
                <Skeleton variant="text" width={210} height={6} />
            </Box>
            <Box
                padding={"16px"}
                sx={{
                    border: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                borderRadius={"4px"}
            >
                <Skeleton variant="rectangular" width={210} height={170} />
                <Skeleton variant="text" width={210} height={20} />
                <Skeleton variant="text" width={210} height={10} />
                <Skeleton variant="text" width={210} height={6} />
            </Box>
            <Box
                padding={"16px"}
                borderRadius={"4px"}
                sx={{
                    border: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
            >
                <Skeleton variant="rectangular" width={210} height={170} />
                <Skeleton variant="text" width={210} height={20} />
                <Skeleton variant="text" width={210} height={10} />
                <Skeleton variant="text" width={210} height={6} />
            </Box>
            <Box
                padding={"16px"}
                borderRadius={"4px"}
                sx={{
                    border: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
            >
                <Skeleton variant="rectangular" width={210} height={170} />
                <Skeleton variant="text" width={210} height={20} />
                <Skeleton variant="text" width={210} height={10} />
                <Skeleton variant="text" width={210} height={6} />
            </Box>
        </Grid>
    );
};

export default SkeletonLoader;
