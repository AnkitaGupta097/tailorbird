import { Box, Divider, Stack, Typography } from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import ProductionBreadCrumbs from "../production-breadcrumbs";
import Button from "components/button";
import OverviewCard from "modules/single-project/overview-card";
import { ReactComponent as CircleUP } from "assets/icons/chevron_Circle_Up.svg";
import AppTheme from "styles/theme";

const ProjectKPI = ({ projectDetails }: any) => {
    const [showProjectData, setProjectData] = useState(true);
    const [isSticky, setIsSticky] = useState(false);

    useLayoutEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsSticky(false);
                return;
            }

            // dont change the div, if there is small scrollbar
            if (
                document.documentElement.scrollHeight - document.documentElement.clientHeight >
                100
            ) {
                showProjectData && setIsSticky(window.scrollY > 0);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            sx={{ background: "#FFF", position: "sticky", top: "85px", zIndex: 10 }}
            marginBottom={isSticky ? "2%" : "0"}
        >
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                mt="2.5rem"
            >
                <ProductionBreadCrumbs />
            </Stack>
            <Stack>
                {projectDetails && (
                    <OverviewCard
                        isSticky={isSticky}
                        projectDetails={projectDetails}
                        showProjectData={showProjectData}
                        shouldShowBudgetKpi
                    />
                )}
                <Divider>
                    <Button
                        variant="outlined"
                        startIcon={
                            <CircleUP
                                style={{
                                    transform: `rotate(${showProjectData ? "0" : "180deg"})`,
                                }}
                            />
                        }
                        style={{ borderColor: AppTheme.text.medium }}
                        onClick={() => setProjectData(!showProjectData)}
                        label={""}
                    >
                        <Typography variant="text_16_medium" color={AppTheme.text.medium}>
                            {showProjectData ? "Hide above" : "Show above"}
                        </Typography>
                    </Button>
                </Divider>
            </Stack>
        </Box>
    );
};

export default ProjectKPI;
