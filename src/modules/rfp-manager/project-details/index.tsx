import { Grid } from "@mui/material";
import AppContainer from "components/app-container";
import React, { useEffect, useState } from "react";
import { StyledGrid } from "../project-list/style";
import BackNavigationBar from "./backNavigationBar";
import CollaboratorsList from "./collaborators";
import Details from "./details";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import CommonDialog from "modules/admin-portal/common/dialog";

const ProjectDetails = () => {
    const navState = useLocation().state as any;
    const { role } = useParams();
    const [project, setProject] = useState({
        address: "",
        bid_due_date: "",
        bid_status: "",
        bidbook_url: "",
        folder_url: "",
        ownership_group_name: "",
        project_id: "",
        project_name: "",
        property_type: "",
        organization_id: "",
    });
    const { userID, projectId } = useParams();
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector((state) => {
        return {
            projects: state.rfpService.project.projectDetails,
            loading: state.rfpService.project.loading,
        };
    });
    useEffect(() => {
        if (!navState?.projectDetails) {
            dispatch(
                actions.rfpService.fetchProjectDetailsStart({
                    user_id: userID,
                    organization_id: "",
                }),
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        let currProject = project;
        if (navState?.projectDetails) {
            currProject = navState?.projectDetails;
        } else if (Array.isArray(projects)) {
            currProject = projects?.find((obj) => obj.project_id === projectId) as any;
        }
        setProject(currProject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects, navState?.projectDetails]);

    if ((loading && !navState?.projectDetails) || project?.organization_id.trim().length == 0) {
        return (
            <CommonDialog
                open={loading}
                onClose={() => {}}
                loading={loading}
                loaderText={"Please wait. Projects loading ..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }
    return (
        <Grid container>
            <Grid item md={12}>
                <AppContainer title={role === "admin" ? "Admin" : "Projects"} />
            </Grid>
            <StyledGrid item md={12} className={"container"}>
                <Grid container sx={{ marginTop: "1.8rem", display: "flex", direction: "row" }}>
                    <Grid item md={12}>
                        <BackNavigationBar projectName={project.project_name} />
                    </Grid>
                    <Grid item md={12} marginTop="1.7rem">
                        <Details details={project} />
                    </Grid>
                    <Grid item md={12} marginTop="1rem">
                        <CollaboratorsList organizationId={project.organization_id} />
                    </Grid>
                </Grid>
            </StyledGrid>
        </Grid>
    );
};

export default ProjectDetails;
