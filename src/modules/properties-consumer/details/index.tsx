/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { StyledGrid } from "../style";
import PropertyDetailHeader from "./property-detail-header";
import PropertyData from "./property-data";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../stores/hooks";
import { Divider, Button, Typography, Box, Grid } from "@mui/material";
import { ReactComponent as CircleUP } from "../../../assets/icons/chevron_Circle_Up.svg";
import appTheme from "styles/theme";
import actions from "../../../stores/actions";
import PropertyTab from "./property-tab";
import BaseLoader from "components/base-loading";
import { isEmpty } from "lodash";
import CallScheduleConfirmation from "../modal/call-schedule-confirmation";
import AddNewPropertyModal from "../modal/add-new-property-or-project-modal";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";
import { getColor } from "../helper";
import { FORGE_DETAIL_TYPES, PROPERTY_TYPE } from "../constants";
import { InfoCard } from "./missing-info-modals/info-card";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import MissingInfoModal from "./missing-info-modals";

const PropertyViewPage = () => {
    const dispatch = useAppDispatch();
    const { propertyId } = useParams();
    const defaultFilter = {
        values: [propertyId],
        name: "property_id",
    };
    const [showPropertyData, setPropertyData] = useState(true);
    const [openModal, setModal] = useState<any>(false);
    const [openCallScheduleConfirmation, setOpenCallScheduleConfirmation] = useState<any>(false);
    const [showingAllMissingInfo, setShowingAllMissingInfo] = useState(false);
    const [showMissingInfo, setShowMissingInfo] = useState(false);
    const [missingInfoModalDataKey, setMissingInfoModalDataKey]: any = useState(null);
    const [forgeMissingDetailTypesObj, setForgeMissingDetailTypesObj] = useState({});
    const [previewMediaFile, setPreviewMediaFile] = useState<any>(null);
    const isPropertyDataUploadOn = useFeature(FeatureFlagConstants.PROPERTY_MISSING_DATA_UPLOAD).on;

    const { loading, organization, projects_state_map, propertyDetails, floorplans } =
        useAppSelector((state) => ({
            loading: state.propertiesConsumer.propertyDetails.loading,
            organization: state.tpsm.organization,
            projects_state_map: state.projectsDemand.projects_state_map,
            propertyDetails: state.propertiesConsumer.propertyDetails,
            floorplans: state.projectFloorplans.floorplans,
        }));
    const openMissingInfoModal = ({ dataKey, title }: any) => {
        setMissingInfoModalDataKey({ dataKey: dataKey, title: title });
        setShowMissingInfo(true);
    };

    const enableAllMissingInfo = (enable: any) => {
        if (enable) {
            setShowingAllMissingInfo(true);
            setShowMissingInfo(true);
        } else {
            setShowingAllMissingInfo(false);
        }
    };
    const updateForgeMissingDetails = () => {
        const updatedForgeMissingDetails: any = {};
        FORGE_DETAIL_TYPES.forEach((detail: any) => {
            if (detail.dataKey === "SITE") {
                updatedForgeMissingDetails[detail.title] = propertyDetails.isHavingMissingInfo
                    ? 1
                    : 0;
            } else {
                const count = floorplans.data.reduce((acc: any, floorplan: any) => {
                    if (floorplan.takeOffType === detail.dataKey && floorplan.isHavingMissingInfo) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);
                updatedForgeMissingDetails[detail.title] = count;
            }
        });
        setForgeMissingDetailTypesObj(updatedForgeMissingDetails);
    };

    useEffect(() => {
        updateForgeMissingDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floorplans.data, propertyDetails]);

    // Call updateForgeMissingDetails whenever floorplans.data or propertyDetails changes
    useEffect(() => {
        if (isEmpty(organization)) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        if (isEmpty(projects_state_map)) {
            dispatch(
                actions.projectDemand.fetchAllProjectsStart({
                    filters: [defaultFilter],
                }),
            );
        }
        dispatch(actions.propertiesConsumer.fetchPropertyDetailStart(propertyId));
        dispatch(actions.propertiesConsumer.fetchPropertyStatsStart(propertyId));
        // dispatch(actions.propertiesConsumer.fetchFloorPlanStart(propertyId));
        // dispatch(
        //     actions.propertiesConsumer.fetchPropertyFilesStart({
        //         fileType: "RENT_ROLL_COSTUMER_UPLOAD",
        //         propertyId,
        //     }),
        // );
        // dispatch(
        //     actions.propertiesConsumer.fetchPropertyFilesStart({
        //         fileType: "PROJECT_IMAGE",
        //         propertyId,
        //     }),
        // );
        // dispatch(actions.propertiesConsumer.fetchUnitMixesStart(propertyId));
        dispatch(
            actions.propertiesConsumer.fetchForgeViewerDetailsStart({
                propertyId: propertyId,
            }),
        );
        dispatch(
            actions.propertiesConsumer.fetchPropertyDetailedStatsStart({
                propertyId: propertyId,
            }),
        );
        dispatch(
            actions.propertiesConsumer.fetchPropertyDetailedStatsStart({
                propertyId: propertyId,
                isAllUnits: true,
            }),
        );
        if (isEmpty(floorplans?.data)) {
            dispatch(
                actions.projectFloorplans.fetchFloorplanDataStart({
                    id: propertyId,
                }),
            );
        }
        //MIXPANEL : Event tracking for visiting property detail page
        mixpanel.track("PROPERTY DETAIL :Visited Property Detail Page ", {
            eventId: "property_detail_page_visited",
            ...getUserDetails(),
            ...getUserOrgDetails(),
            property_name: propertyDetails?.name,
            property_id: propertyId,
        });
        return () => {
            dispatch(actions.propertiesConsumer.resetPropertyDetails({})); // Call resetPropertyStats on unmount
            dispatch(actions.projectFloorplans.resetProjectFloorplans({}));
        };
        // eslint-disable-next-line
    }, []);
    const confirmSchedule = () => {
        dispatch(
            actions.tpsm.addPropertyOrProjectRequest({
                request_type: "project_in_property",
                property_id: propertyId,
            }),
        );
        //MIXPANEL : Event tracking for add new property requests
        mixpanel.track("PROPERTY DETAIL : Requested Add New Project Creation", {
            eventId: "requested_add_new_project",
            ...getUserDetails(),
            ...getUserOrgDetails(),
        });
        setModal(false);
        setOpenCallScheduleConfirmation(true);
    };

    if (loading) {
        return <BaseLoader />;
    }
    const { name, address, city, state, zipcode, type, ownership_group_id, cover_picture } =
        propertyDetails;
    const organizationMap =
        organization && new Map(organization.map((org: any) => [org.id, org.name]));

    const PropertyInfo = () => {
        return (
            <Grid item md={12} display="flex" mb={6}>
                <Box pr={6}>
                    <Typography variant="text_34_regular">{name}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                {address && (
                    <Box px={6}>
                        <Typography variant="text_14_regular">{address}</Typography>
                        <br />
                        <Typography variant="text_10_regular" color={appTheme.border.medium}>
                            {(city || state) && `${city}, ${state} ${zipcode}`}
                        </Typography>
                    </Box>
                )}
                {address && <Divider orientation="vertical" flexItem />}
                <Box px={6}>
                    <Typography variant="text_10_regular" color={appTheme.border.medium}>
                        Owner
                    </Typography>
                    <br />
                    <Typography variant="text_14_regular">
                        {organizationMap?.get(ownership_group_id)}
                    </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box pl={6}>
                    <Button
                        variant="outlined"
                        style={{ marginTop: "8px", borderColor: getColor(type) }}
                        disabled
                    >
                        <Typography variant="text_10_regular" color={getColor(type)}>
                            {PROPERTY_TYPE[type]}
                        </Typography>
                    </Button>
                </Box>
            </Grid>
        );
    };

    return (
        <Box px={"2rem"}>
            <StyledGrid container className="container propertyApp">
                <PropertyDetailHeader />
            </StyledGrid>
            <Grid gap={10} display={"grid"} gridAutoFlow={"column"} mb={5}>
                {PropertyInfo()}
                {Object.values(forgeMissingDetailTypesObj).some((value: any) => value > 0) &&
                    isPropertyDataUploadOn && (
                        <InfoCard
                            showPropertyData={showPropertyData}
                            isCombined={true}
                            type={"Missing Information"}
                            forgeMissingDetailTypesObj={forgeMissingDetailTypesObj}
                            dataKey={null}
                            openMissingInfoModal={openMissingInfoModal}
                            enableAllMissingInfo={enableAllMissingInfo}
                        />
                    )}
            </Grid>
            <PropertyData
                showPropertyData={showPropertyData}
                buttonAction={() => setModal(true)}
                cover_picture={cover_picture}
            />
            <Divider>
                <Button
                    variant="outlined"
                    startIcon={
                        <CircleUP
                            style={{ transform: `rotate(${showPropertyData ? "0" : "180deg"})` }}
                        />
                    }
                    style={{ borderColor: appTheme.text.medium }}
                    onClick={() => setPropertyData(!showPropertyData)}
                >
                    <Typography variant="text_16_medium" color={appTheme.text.medium}>
                        {showPropertyData ? "Hide above" : "Show above"}
                    </Typography>
                </Button>
            </Divider>
            <PropertyTab
                defaultFilter={defaultFilter}
                propertyId={propertyId}
                forgeMissingDetailTypesObj={forgeMissingDetailTypesObj}
                openMissingInfoModal={openMissingInfoModal}
                setShowingAllMissingInfo={setShowingAllMissingInfo}
            />
            <AddNewPropertyModal
                openModal={openModal}
                modalHandler={setModal}
                confirmSchedule={confirmSchedule}
                title={"Add New Project"}
            />
            <CallScheduleConfirmation
                openCallScheduleConfirmation={openCallScheduleConfirmation}
                setOpenCallScheduleConfirmation={setOpenCallScheduleConfirmation}
                title={"Start New Project"}
            />
            <MissingInfoModal
                previewMediaFile={previewMediaFile}
                modalHandler={setShowMissingInfo}
                openModal={showMissingInfo}
                showingAllMissingInfo={showingAllMissingInfo}
                setPreviewMediaFile={setPreviewMediaFile}
                missingInfoModalDataKey={missingInfoModalDataKey}
                propertyTitle={propertyDetails?.name}
                onSave={undefined}
                forgeMissingDetailTypesObj={forgeMissingDetailTypesObj}
            />
        </Box>
    );
};

export default PropertyViewPage;
