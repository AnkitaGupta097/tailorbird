/* eslint-disable react-hooks/exhaustive-deps */
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PROJECTS_TABS } from "./constant";
import actions from "../../stores/actions";
import { useAppSelector, useAppDispatch } from "../../stores/hooks";
import "./projects.css";
import { isEmpty, cloneDeep } from "lodash";
import AppContainer from "components/app-container";
import { ProjectListText } from "modules/rfp-manager/constant";

const Projects = () => {
    const locationInfo = useLocation();
    const { pathname } = locationInfo;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { activeProjects, archiveProjects, organization, allUsers } = useAppSelector((state) => {
        return {
            activeProjects: state.tpsm.projects,
            archiveProjects: state.tpsm.archive_projects.data,
            organization: state.tpsm.organization,
            allUsers: state.tpsm.all_User.users,
        };
    });

    const [projectTabs, setProjectTabs] = useState(PROJECTS_TABS);
    const [currentTab, setCurrentTab] = useState<string>(PROJECTS_TABS[0].value);

    useEffect(() => {
        document.title = `Tailorbird | Projects`;
        if (isEmpty(activeProjects)) {
            dispatch(actions.tpsm.fetchAllProjectStart(""));
        }
        if (isEmpty(organization)) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        if (isEmpty(allUsers)) {
            dispatch(actions.tpsm.fetchAllUserStart(""));
        }
        if (isEmpty(archiveProjects)) {
            dispatch(actions.tpsm.fetchArchiveProjectStart(""));
        }
        if (pathname == "/admin-projects/archived") {
            setCurrentTab(PROJECTS_TABS[1].value);
        } else {
            setCurrentTab(PROJECTS_TABS[0].value);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (pathname == "/admin-projects") {
            navigate(`/admin-projects/active`);
        }
    }, [locationInfo]);

    useEffect(() => {
        const tabs = cloneDeep(PROJECTS_TABS);
        // if (isEmpty(activeProjects) || isEmpty(archiveProjects)) {
        //     tabs[0].label = tabs[0].label;
        //     tabs[1].label = tabs[1].label;
        // }
        if (!isEmpty(activeProjects)) {
            tabs[0].label = `${tabs[0].label}(${activeProjects.length})`;
        }
        if (!isEmpty(archiveProjects)) {
            tabs[1].label = `${tabs[1].label}(${archiveProjects.length})`;
        }
        setProjectTabs(tabs);
        // eslint-disable-next-line
    }, [activeProjects, archiveProjects]);

    const tabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
        if (pathname.split("/").length === 2) {
            navigate(pathname.substring(0, pathname.length) + newValue);
        } else {
            navigate(pathname.substring(0, pathname.lastIndexOf("/")) + newValue);
        }
    };
    return (
        <React.Fragment>
            <Grid container>
                <Grid item md={12}>
                    <AppContainer
                        title={ProjectListText.PROJECTS}
                        tabList={projectTabs}
                        currentTab={currentTab}
                        tabChanged={tabChanged}
                    />
                </Grid>
            </Grid>
            <Outlet />
        </React.Fragment>
    );
};

export default Projects;
