/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import BaseTabs from "components/base-tabs";
import { PROPERTY_TABS } from "../constants";
// import { Typography } from "@mui/material";
import PropertyDetail from "./property-detail";
import ProjectFilter from "modules/projects/demand/project-filter";
import ProjectList from "modules/projects/demand/project-list";
import { Box } from "@mui/system";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
interface Prop {
    defaultFilter: {
        values: (string | undefined)[];
        name: string;
    };
    propertyId?: any;
    forgeMissingDetailTypesObj: any;
    openMissingInfoModal: any;
    setShowingAllMissingInfo: any;
}
const PropertyTab = ({
    defaultFilter,
    propertyId,
    forgeMissingDetailTypesObj,
    openMissingInfoModal,
    setShowingAllMissingInfo,
}: Prop) => {
    const [currentTab, setCurrentTab] = useState<string>(PROPERTY_TABS[0].value);
    const tabChanged = (_event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
    };
    const renderTabData = () => {
        switch (currentTab) {
            case PROPERTY_TABS[0].value:
                return (
                    <PropertyDetail
                        forgeMissingDetailTypesObj={forgeMissingDetailTypesObj}
                        openMissingInfoModal={openMissingInfoModal}
                        setShowingAllMissingInfo={setShowingAllMissingInfo}
                    />
                );
            case PROPERTY_TABS[1].value:
                //MIXPANEL : Event tracking for Project List Viewed From Property Detail
                mixpanel.track(
                    "PROPERTY DETAIL >> PROJETCS LIST VIEW  : Project List Viewed From Property Detail",
                    {
                        eventId: "project_list_viewed_from_property_detail",
                        ...getUserDetails(),
                        ...getUserOrgDetails(),
                        property_id: propertyId,
                    },
                );
                return (
                    <Box
                        sx={{
                            backgroundColor: "#FFF",
                        }}
                    >
                        <Box display="flex">
                            <ProjectFilter pl="None" defaultFilter={defaultFilter} />
                            <ProjectList />
                        </Box>
                    </Box>
                );
        }
    };
    return (
        <React.Fragment>
            <BaseTabs currentTab={currentTab} onTabChanged={tabChanged} tabList={PROPERTY_TABS} />
            {renderTabData()}
        </React.Fragment>
    );
};

export default PropertyTab;
