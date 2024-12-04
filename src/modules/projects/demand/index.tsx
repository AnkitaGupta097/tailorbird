/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import ProjectsHeader from "./project-header";
import { StyledGrid } from "./style";
import ProjectFilter from "./project-filter";
import ProjectList from "./project-list";
import BaseLoader from "components/base-loading";
import { isEmpty } from "lodash";
import AddNewProjectModal from "modules/properties-consumer/modal/add-new-property-or-project-modal";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import CallScheduleConfirmation from "modules/properties-consumer/modal/call-schedule-confirmation";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

const ProjectsDemand = () => {
    const dispatch = useAppDispatch();

    const { loading, organization, projects_state_map } = useAppSelector((state) => ({
        loading: state.projectsDemand.loading,
        organization: state.tpsm.organization,
        projects_state_map: state.projectsDemand.projects_state_map,
    }));

    const [openModal, setModal] = useState<any>(false);
    const [openCallScheduleConfirmation, setOpenCallScheduleConfirmation] = useState<any>(false);
    useEffect(() => {
        if (isEmpty(projects_state_map)) {
            dispatch(actions.projectDemand.fetchAllProjectsStart({ filters: [] }));
        }
        if (isEmpty(organization)) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        //MIXPANEL : Event tracking for visiting project page
        mixpanel.track("PROJECT DASHBOARD :Visited Project Dashboard ", {
            eventId: "project_dashboard_visited",
            ...getUserDetails(),
            ...getUserOrgDetails(),
        });
        // eslint-disable-next-line
    }, []);

    // if (isEmpty(projects_state_map) && isEmpty(filters) && loading) {
    //     return <BaseLoader />;
    // }
    const confirmSchedule = () => {
        dispatch(actions.tpsm.addPropertyOrProjectRequest({ request_type: "project" }));
        //MIXPANEL : Event tracking for add new property requests
        mixpanel.track("PROJECT DASHBOARD : Requested Add New Project Creation", {
            eventId: "requested_add_new_project",
            ...getUserDetails(),
            ...getUserOrgDetails(),
        });
        setModal(false);
        setOpenCallScheduleConfirmation(true);
    };
    return (
        <Box
            sx={{
                backgroundColor: "#FFF",
            }}
        >
            {loading && <BaseLoader />}
            <StyledGrid container className="container projectApp">
                <ProjectsHeader buttonAction={() => setModal(true)} />
            </StyledGrid>
            <Box display="flex" width={1}>
                <ProjectFilter />
                <ProjectList />
            </Box>
            {openModal && (
                <AddNewProjectModal
                    openModal={openModal}
                    modalHandler={setModal}
                    confirmSchedule={confirmSchedule}
                    title={"Add New Project"}
                />
            )}
            <CallScheduleConfirmation
                openCallScheduleConfirmation={openCallScheduleConfirmation}
                setOpenCallScheduleConfirmation={setOpenCallScheduleConfirmation}
                title={"Start New Property"}
            />
        </Box>
    );
};

export default ProjectsDemand;
