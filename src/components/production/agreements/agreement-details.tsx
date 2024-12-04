import { Divider, Grid, Link, Stack, Typography } from "@mui/material";
import PriceSummaryTable from "modules/rfp-manager/pricing-summary-table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { productionTabUrl } from "../constants";
import { shallowEqual } from "react-redux";
import { useProductionContext } from "context/production-context";

const AgreementDetails = () => {
    const dispatch = useAppDispatch();
    const { isRFPProject } = useProductionContext();

    const { projectId, contractorId, contractorName } = useParams();
    let userID = localStorage.getItem("user_id") ?? undefined;
    const [contractorProjectDetails, setContractorProjectDetails] = useState<
        (typeof projects)[0] | null
    >();
    const { projectDetails, projects, isEditable } = useAppSelector((state) => {
        return {
            projectDetails: state.singleProject.projectDetails,
            projects: state.rfpService.project.projectDetails,
            isEditable: state.biddingPortal.isEditable,
        };
    }, shallowEqual);
    const handleSelectedVersion = () => {
        dispatch(actions.biddingPortal.setSelectedVersion("Version 1"));
    };

    useEffect(() => {
        if (projects?.length === 0) {
            dispatch(
                actions.rfpService.fetchProjectDetailsStart({
                    organization_id: contractorId,
                }),
            );
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (projects?.length > 0) {
            setContractorProjectDetails(
                projects.find(
                    (project: { project_id: string | undefined }) =>
                        project.project_id == projectId,
                ),
            );
        }
        //eslint-disable-next-line
    }, [projects]);

    useEffect(() => {
        if (
            isEditable === undefined &&
            contractorProjectDetails &&
            contractorProjectDetails?.bid_status !== "submitted"
        ) {
            dispatch(
                actions.biddingPortal.lockProjectForEditingStart({
                    projectId: projectId,
                    userId: userID,
                    organization_id: contractorId,
                }),
            );
        }
        //eslint-disable-next-line
    }, [contractorProjectDetails]);
    return (
        <>
            <Grid
                container
                direction={"column"}
                sx={{
                    alignItems: "flex-start",
                    p: "1rem 7.5rem",
                    // gap: "1.25rem",
                }}
            >
                <Grid item>
                    <Stack direction={"row"}>
                        <Stack direction="column" gap={"16px"}>
                            <Stack direction={"row"}>
                                <Link
                                    href={`${productionTabUrl(projectId, isRFPProject)}`}
                                    underline="always"
                                    sx={{
                                        alignItems: "center",
                                        color: "#004D71",
                                        fontFamily: "Roboto",
                                        marginLeft: "0",
                                    }}
                                >
                                    <Typography variant="text_16_regular">
                                        {`${projectDetails?.name} /`}
                                    </Typography>
                                </Link>
                                <Link
                                    href={`${productionTabUrl(projectId, isRFPProject)}/agreements`}
                                    underline="always"
                                    sx={{
                                        alignItems: "center",
                                        color: "#004D71",
                                        fontFamily: "Roboto",
                                        marginLeft: "0",
                                    }}
                                >
                                    <Typography variant="text_16_regular">
                                        {"Agreements"}
                                    </Typography>
                                </Link>
                            </Stack>
                            <Typography variant="text_24_medium">{contractorName}</Typography>
                            <Divider
                                sx={{
                                    width: "1392px",
                                    height: "1px",
                                    flexShrink: 0,
                                    fill: "#C9CCCF",
                                }}
                            />
                        </Stack>
                    </Stack>
                </Grid>
                {/* <Grid item>
                    <Divider sx={{ display: "flex", alignSelf: "stretch" }} />
                </Grid> */}
            </Grid>
            <PriceSummaryTable
                captureEditMode={true}
                bidResponseItem={[]}
                organization_id={contractorId}
                handleSelectedVersion={handleSelectedVersion}
                project_id={projectId}
                isAgreement={true}
                projectType={projectDetails?.projectType}
            />
        </>
    );
};

export default AgreementDetails;
