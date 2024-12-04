import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import RenoavtionProgress from "./renovation-progress";
import RenoavtionTime from "./renovation-time";
import SpendAnalysis from "./spend-analysis";
import { useFeature } from "@growthbook/growthbook-react";

const ProjectAnalytics = ({ project }: any) => {
    const productionSoftwareEnabled = useFeature("production_2").on;
    const isProductionProject = ["Production Started", "Production Finished"].includes(
        project?.status,
    );

    return (
        <Box sx={Styles.rectangleCard} key={"projectAnalyticsHeader"}>
            <Stack direction={"row"} alignItems={"center"} gap={2} sx={{ marginBottom: "2rem" }}>
                <BarChartIcon />
                <Typography variant="text_16_regular" color="#202223">
                    Project Analytics
                </Typography>
            </Stack>
            {productionSoftwareEnabled && isProductionProject ? (
                <>
                    <RenoavtionProgress />
                    <Divider />
                    <RenoavtionTime />
                    <Divider />
                    <SpendAnalysis />
                </>
            ) : (
                <div
                    style={{
                        height: "160px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="text_16_medium">
                        You do not have access to see any project details
                    </Typography>
                </div>
            )}
        </Box>
    );
};
export default ProjectAnalytics;
const Styles = {
    rectangleCard: {
        padding: "16px 20px",
        gap: "10px",
        borderRadius: "4px",
        border: "1px solid #C9CCCF",
        background: "#FFF",
        marginBottom: "20px",
    },
};
