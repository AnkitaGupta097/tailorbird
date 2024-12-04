import { useFeature } from "@growthbook/growthbook-react";
import { Grid, Typography } from "@mui/material";
import ProjectDetailsCard from "components/cards/details-card";
import CommonDialog from "modules/admin-portal/common/dialog";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
//@ts-ignore
import propertyPlaceHolderImg from "../../../assets/icons/property-placeholder.jpg";
import { PROJECT_TYPE_BG_COLOR } from "../common/constants";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { EmptyTexts, PROJECT_TYPE, ProjectStatus } from "../constant";
import EmptyState from "../empty-state";
import { rfpProductionTabsUrl } from "../helper";
import { compact } from "lodash";

const ProductionProjectsDashboard = () => {
    const { role, userID } = useParams();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const productionSoftwareEnabled = useFeature("production_2").on;

    const { projects, imageFiles, loading, snackbar } = useAppSelector((state) => {
        return {
            projects: state.rfpService.productionProject.projects,
            imageFiles: state?.fileUtility?.imageFiles,
            loading: state.rfpService.productionProject.loading,
            snackbar: state.common.snackbar,
        };
    });

    const [projectCoverPhotos, setProjectCoverPhotos] = useState<any[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!projects || projects?.length === 0) dispatch(actions.rfpService.fetchProjectsStart());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (projects?.length > 0) {
            projects?.forEach((project: any) => {
                dispatch(
                    actions.fileUtility.getProjectFilesStart({
                        project_id: project?.id,
                    }),
                );
            });
        }
        //eslint-disable-next-line
    }, [projects]);

    useEffect(() => {
        const coverImg = imageFiles?.find((image) => image?.tags?.is_cover_image);

        if (coverImg) {
            const projectId = coverImg?.tags?.projectId;
            setProjectCoverPhotos({
                ...projectCoverPhotos,
                [projectId]: coverImg?.cdn_path?.find((path: string) =>
                    path?.toLowerCase()?.includes("autox300"),
                ),
            });
        }
        //eslint-disable-next-line
    }, [imageFiles]);

    useEffect(() => {
        snackbar.open &&
            enqueueSnackbar("", {
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="Error"
                        description="Failed to fetch Projects"
                    />
                ),
            });
        //eslint-disable-next-line
    }, [snackbar.open]);

    if (loading) {
        return (
            <CommonDialog
                open={loading}
                onClose={() => {}}
                loading={loading}
                loaderText={"Please wait. Loading Projects ..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }

    const getAddress = (project: any) => {
        const addressArray = [project.streetAddress, project.city, project.state, project.zipcode];
        const finalAddressArray = compact(addressArray);
        return finalAddressArray.length > 0 ? finalAddressArray.join(", ") : "";
    };

    return (
        <Grid
            container
            p="5rem 10rem 0rem 10rem"
            gap={5}
            flexDirection={"column"}
            height={"91vh"}
            flexWrap={"nowrap"}
        >
            <Grid item>
                <Typography>
                    Tailorbird&nbsp;
                    <span
                        style={{
                            fontWeight: "700",
                        }}
                    >
                        projects
                    </span>
                </Typography>
            </Grid>
            <Grid item height="100%">
                <Grid container gap={4} flexDirection="column" height={"100%"} flexWrap={"nowrap"}>
                    {!loading && !projects?.length ? (
                        <EmptyState label={EmptyTexts.NO_PROJECT} />
                    ) : (
                        projects.map((project: any) => {
                            return (
                                <Grid item key={project.id}>
                                    <ProjectDetailsCard
                                        key={project.id}
                                        greyScaleImg={false}
                                        leftBorderColor="#004D71"
                                        imgSrc={
                                            projectCoverPhotos[project?.id] ??
                                            propertyPlaceHolderImg
                                        }
                                        cardProps={{
                                            sx: {
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    backgroundColor: "#E4F7FA",
                                                },
                                            },
                                            onClick: () => {
                                                if (
                                                    productionSoftwareEnabled &&
                                                    project.status === "Production Started"
                                                ) {
                                                    navigate(
                                                        rfpProductionTabsUrl(
                                                            role || "",
                                                            userID || "",
                                                            project.id,
                                                        ),
                                                    );
                                                }
                                            },
                                        }}
                                        projectType={project.projectType}
                                        projectTypeBgColor={
                                            PROJECT_TYPE_BG_COLOR[
                                                PROJECT_TYPE[project.projectType]
                                                    ?.label as keyof typeof PROJECT_TYPE_BG_COLOR
                                            ] ?? "black"
                                        }
                                        propertyName={project.name}
                                        propertyAddress={getAddress(project)}
                                        organization={project?.organization?.name}
                                        chipLabel={project.status}
                                        chipBgColor={ProjectStatus[project.status]?.backgroundColor}
                                        chipLabelColor={ProjectStatus[project.status]?.color}
                                    />
                                </Grid>
                            );
                        })
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProductionProjectsDashboard;
