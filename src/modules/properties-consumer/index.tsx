/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import actions from "../../stores/actions";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import PropertiesHeader from "./properties-header";
import { StyledGrid } from "./style";
import PropertyFilter from "./property-filter";
import PropertyList from "./property-list";
import AddNewPropertyModal from "./modal/add-new-property-or-project-modal";
import BaseLoader from "components/base-loading";
import { isEmpty } from "lodash";
import CallScheduleConfirmation from "./modal/call-schedule-confirmation";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

const PropertiesConsumer = () => {
    const dispatch = useAppDispatch();

    const { loading, organization, properties, filters } = useAppSelector((state) => ({
        loading: state.propertiesConsumer.loading,
        organization: state.tpsm.organization,
        properties: state.propertiesConsumer.properties,
        filters: state.propertiesConsumer.filters,
    }));

    const [openModal, setModal] = useState<any>(false);
    const [openCallScheduleConfirmation, setOpenCallScheduleConfirmation] = useState<any>(false);

    useEffect(() => {
        if (isEmpty(properties)) {
            dispatch(actions.propertiesConsumer.fetchAllPropertiesStart({ filters: [] }));
        }
        if (isEmpty(organization)) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        //MIXPANEL : Event tracking for visiting property page
        mixpanel.track("PROPERTY DASHBOARD :Visited Property Dashboard ", {
            eventId: "property_dashboard_visited",
            ...getUserDetails(),
            ...getUserOrgDetails(),
        });
        // eslint-disable-next-line
    }, []);

    const confirmSchedule = () => {
        dispatch(actions.tpsm.addPropertyOrProjectRequest({ request_type: "property" }));
        setModal(false);
        //MIXPANEL : Event tracking for add new property requests
        mixpanel.track("PROPERTY DASHBOARD : Requested Add New Property Creation", {
            eventId: "requested_add_new_property",
            ...getUserDetails(),
            ...getUserOrgDetails(),
        });
        setOpenCallScheduleConfirmation(true);
    };
    if (isEmpty(properties) && isEmpty(filters) && loading) {
        return <BaseLoader />;
    }
    return (
        <Box
            sx={{
                backgroundColor: "#FFF",
            }}
        >
            <StyledGrid container className="container propertyApp">
                <PropertiesHeader buttonAction={() => setModal(true)} />
            </StyledGrid>
            <Box display="flex">
                <PropertyFilter />
                <PropertyList />
            </Box>
            <AddNewPropertyModal
                openModal={openModal}
                modalHandler={setModal}
                confirmSchedule={confirmSchedule}
            />
            <CallScheduleConfirmation
                openCallScheduleConfirmation={openCallScheduleConfirmation}
                setOpenCallScheduleConfirmation={setOpenCallScheduleConfirmation}
                title={"Start New Property"}
            />
        </Box>
    );
};

export default PropertiesConsumer;
