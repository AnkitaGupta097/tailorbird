/* eslint-disable no-unused-vars */
import React, { RefObject } from "react";
import { CorporateFare } from "@mui/icons-material";
import { Stack, Typography, Box, Grid, Link } from "@mui/material";
import BaseChip from "components/chip";
import image from "./image.png";
import AppTheme from "styles/theme";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IProject } from "stores/single-project/interfaces";
import { makeStyles } from "@mui/styles";
import ProjectBudgetKPI from "components/production/common/project-budget-kpi";
import { useFeature } from "@growthbook/growthbook-react";

const useStyles = makeStyles(() => ({
    floatingDiv: {
        backgroundColor: AppTheme.palette.background.default,
        transition: "top 0.25s ease-in-out",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        transitionDelay: "250ms",
    },
    sticky: {
        padding: "1rem 2rem",
        left: 0,
    },
    image: {
        width: 60,
        height: 60,
    },
    oneRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
}));
interface Props {
    projectDetails: IProject;
    isSticky: any;
    showProjectData?: any;
    shouldShowBudgetKpi?: boolean;
}

const OverviewCard = ({
    projectDetails,
    isSticky,
    showProjectData,
    shouldShowBudgetKpi,
}: Props) => {
    const classes = useStyles();
    projectDetails?.streetAddress;
    const { streetAddress, state, city, zipcode } = projectDetails;
    const productionSoftwareEnabled = useFeature("production_2").on;
    return (
        <Grid
            container
            justifyContent="space-between"
            alignItems="flex-end"
            columnGap={16}
            style={{
                maxHeight: showProjectData ? "350px" : "0px",
                overflow: showProjectData ? "visible" : "hidden",
                transition: "max-height 0.5s ease",
                padding: "8px 0",
            }}
            className={
                showProjectData && isSticky ? `${classes.floatingDiv} ${classes.sticky}` : ""
            }
        >
            <Grid item xs={isSticky ? 6 : undefined}>
                <Stack direction="column" gap={"24px"}>
                    <Typography
                        variant={isSticky ? "text_20_regular" : "text_34_regular"}
                        color="#232323"
                        paddingLeft="10px"
                    >
                        {projectDetails.name}
                    </Typography>
                    <Stack
                        sx={pageStyles.overviewContent}
                        className={isSticky ? classes.oneRow : ""}
                    >
                        <Box
                            component="img"
                            src={image}
                            sx={{
                                borderRadius: "0px 8px 8px 0px",
                                marginLeft: "10px",
                                height: "180px",
                                width: "180px",
                            }}
                            className={isSticky ? classes.image : ""}
                        />

                        <Stack direction={"row"} gap={"60px"}>
                            <Stack
                                sx={pageStyles.detailsBody}
                                className={isSticky ? classes.oneRow : ""}
                            >
                                {(streetAddress || state || city) && (
                                    <Typography
                                        variant="text_14_regular"
                                        color="#232323"
                                        textTransform="capitalize"
                                    >
                                        {`${streetAddress || ""} `}
                                        {projectDetails.property_id && (
                                            <Link
                                                href={`/properties-consumer/${projectDetails.property_id}`}
                                                underline="always"
                                                sx={{
                                                    alignItems: "center",
                                                    color: "#004D71",
                                                    fontFamily: "Roboto",
                                                    marginLeft: "0",
                                                }}
                                            >
                                                <ArrowForwardIcon
                                                    style={{
                                                        marginLeft: "2px",
                                                        border: "2px solid",
                                                        borderRadius: "50%",
                                                        fontSize: "12px",
                                                    }}
                                                />
                                            </Link>
                                        )}
                                        <br />
                                        {`${city || ""}, ${state || ""} ${zipcode || ""}`}
                                    </Typography>
                                )}
                                <Stack sx={pageStyles.detailBlock}>
                                    <Typography variant="text_12_regular" color="#757575">
                                        {"Owner"}
                                    </Typography>
                                    <BaseChip
                                        label={projectDetails.owner}
                                        bgcolor={"#FFF"}
                                        textColor={"#0088C7"}
                                        sx={{
                                            width: "fit-content",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            fontFamily: "Roboto",
                                            lineHeight: "20px",
                                            borderRadius: "4px",
                                            border: "1px solid  #0088C7",
                                        }}
                                    />
                                </Stack>
                                <Stack sx={pageStyles.detailBlock}>
                                    <Typography variant="text_12_regular" color="#757575">
                                        {"Property Type"}
                                    </Typography>
                                    <BaseChip
                                        icon={<CorporateFare />}
                                        label={projectDetails.propertyType}
                                        bgcolor={"#FFF"}
                                        textColor={"#8C9196"}
                                        sx={{
                                            width: "fit-content",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            fontFamily: "Roboto",
                                            lineHeight: "20px",
                                            borderRadius: "4px",
                                            border: "1px solid  #8C9196",
                                        }}
                                    />
                                </Stack>
                            </Stack>

                            <Stack
                                sx={pageStyles.detailsBody}
                                className={isSticky ? classes.oneRow : ""}
                            >
                                <Stack sx={pageStyles.detailBlock}>
                                    <Typography variant="text_12_regular" color="#757575">
                                        {"Project Status"}
                                    </Typography>
                                    <BaseChip
                                        label={projectDetails.projectStatus}
                                        bgcolor={"#FFD79D"}
                                        textColor={"#B86800"}
                                        sx={{
                                            width: "fit-content",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            fontFamily: "Roboto",
                                            lineHeight: "20px",
                                            borderRadius: "4px",
                                            border: "1px solid  #FFD79D",
                                        }}
                                    />
                                </Stack>
                                {(shouldShowBudgetKpi ? !isSticky : true) &&
                                    productionSoftwareEnabled && (
                                        <Stack direction={"row"} gap={"1rem"}>
                                            {/* <Stack sx={pageStyles.detailBlock}>
                                                <Typography
                                                    variant="text_12_regular"
                                                    color="#757575"
                                                >
                                                    {"(Projected) Start Date"}
                                                </Typography>
                                                <Typography
                                                    variant="text_14_regular"
                                                    color="#232323"
                                                    sx={{ lineHeight: "20px" }}
                                                >
                                                    <HumanReadableData
                                                        dateString={
                                                            projectDetails?.production_details
                                                                ?.start_date
                                                        }
                                                    />
                                                </Typography>
                                            </Stack>

                                            <Stack sx={pageStyles.detailBlock}>
                                                <Typography
                                                    variant="text_12_regular"
                                                    color="#757575"
                                                >
                                                    {"(Projected) End Date"}
                                                </Typography>
                                                <Typography
                                                    variant="text_14_regular"
                                                    color="#232323"
                                                    sx={{ lineHeight: "20px" }}
                                                >
                                                    <HumanReadableData
                                                        dateString={
                                                            projectDetails?.production_details
                                                                ?.end_date
                                                        }
                                                    />{" "}
                                                </Typography>
                                            </Stack> */}
                                        </Stack>
                                    )}
                                <Stack direction={"row"} gap={"1rem"}>
                                    <Stack sx={pageStyles.detailBlock}>
                                        <Typography variant="text_12_regular" color="#757575">
                                            {"Project Type"}
                                        </Typography>
                                        <BaseChip
                                            label={projectDetails.projectType}
                                            bgcolor={"#BCDFEF"}
                                            textColor={"#00344D"}
                                            sx={{
                                                width: "fit-content",
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                fontFamily: "Roboto",
                                                lineHeight: "20px",
                                                borderRadius: "4px",
                                                border: "1px solid  BCDFEF",
                                            }}
                                        />
                                    </Stack>
                                    {/* <Stack direction={"row"} gap={"1rem"}>
                                        <Stack direction={"column"} gap={"0.4rem"} display={"grid"}>
                                            <Typography variant="text_12_regular" color="#757575">
                                                {"Approximate unit Count"}
                                            </Typography>
                                            <Typography
                                                variant="text_14_regular"
                                                color="#232323"
                                                sx={{ lineHeight: "20px" }}
                                            >
                                                {projectDetails.approximateUnitCount}
                                            </Typography>
                                        </Stack>
                                    </Stack> */}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
            {shouldShowBudgetKpi && (
                <Grid item xs marginRight={isSticky && "10px"}>
                    <ProjectBudgetKPI
                        isSticky={isSticky}
                        projectBudget={projectDetails?.budgetStats}
                    />
                </Grid>
            )}
        </Grid>
    );
};
export default OverviewCard;
const pageStyles = {
    detailsBody: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
        justifyContent: "space-between",
    },
    overviewContent: {
        display: "flex",
        alignItems: "flex-start",
        gap: "20px",
        flexDirection: "row",
    },
    detailBlock: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.2rem",
        justifyContent: "space-between",
    },
};
