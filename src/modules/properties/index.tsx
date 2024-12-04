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
import { PropertyListText } from "modules/rfp-manager/constant";

const Properties = () => {
    const locationInfo = useLocation();
    const { pathname } = locationInfo;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { activeProperties, archiveProperties } = useAppSelector((state) => {
        return {
            activeProperties: state.property.properties,
            archiveProperties: state.property.archive_properties.data,
            // organization: state.tpsm.organization,
            // allUsers: state.tpsm.all_User.users,
        };
    });

    console.log(activeProperties, "!!fsd!!");

    const [projectTabs, setProjectTabs] = useState(PROJECTS_TABS);
    const [currentTab, setCurrentTab] = useState<string>(PROJECTS_TABS[0].value);

    useEffect(() => {
        document.title = `Tailorbird | properties`;
        if (isEmpty(activeProperties)) {
            console.log("here?!");
            dispatch(actions.property.fetchAllPropertyStart(""));
        }
        // if (isEmpty(organization)) {
        //     dispatch(actions.tpsm.fetchOrganizationStart(""));
        // }
        // if (isEmpty(allUsers)) {
        //     dispatch(actions.tpsm.fetchAllUserStart(""));
        // }
        if (isEmpty(archiveProperties)) {
            dispatch(actions.property.fetchArchivePropertyStart(""));
        }
        if (pathname == "/admin-properties/archived") {
            setCurrentTab(PROJECTS_TABS[1].value);
        } else {
            setCurrentTab(PROJECTS_TABS[0].value);
        }
        console.log(activeProperties, "!!useEffect!!");
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (pathname == "/admin-properties") {
            navigate(`/admin-properties/active`);
        }
    }, [locationInfo]);

    useEffect(() => {
        const tabs = cloneDeep(PROJECTS_TABS);
        // if (isEmpty(activeProjects) || isEmpty(archiveProjects)) {
        //     tabs[0].label = tabs[0].label;
        //     tabs[1].label = tabs[1].label;
        // }
        if (!isEmpty(activeProperties)) {
            tabs[0].label = `${tabs[0].label}(${activeProperties.length})`;
        }
        if (!isEmpty(archiveProperties)) {
            tabs[1].label = `${tabs[1].label}(${archiveProperties.length})`;
        }
        setProjectTabs(tabs);
        // eslint-disable-next-line
    }, [activeProperties, archiveProperties]);

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
                        title={PropertyListText.PROPERTIES}
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

export default Properties;
