import React, { useEffect, useState, ChangeEvent } from "react";
import { Grid, Switch, SwitchProps, styled } from "@mui/material";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
// import { PROJECT_DETAILS_PAGES } from "../../projects/details/budgeting/constants";
import { PROPERTY_TABS } from "../../projects/details/budgeting/constants";
// import { PROJECT_TYPE } from "../constant";
import actions from "stores/actions";
import { find, isEmpty } from "lodash";
import BaseLoader from "../../../components/base-loading";
import { GetDocTitle } from "utils/get-doc-title";
import AppContainer from "components/app-container";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { IUser } from "App";

const StyledSwitch = styled(Switch)<SwitchProps>(() => ({
    "& .MuiSwitch-track": {
        background: "#DAF3FF",
        border: "1px solid #57B6B2",
    },
    "& .MuiSwitch-thumb": {
        background: "#57B6B2",
        border: "1px solid #57B6B2",
    },
}));

const growthbook = new GrowthBook({
    enableDevMode: true,
    trackingCallback: (experiment, result) => {
        console.log("Experiment Viewed", {
            experimentId: experiment.key,
            variationId: result.variationId,
        });
    },
});

const Properties = () => {
    const dispatch = useAppDispatch();
    const { propertyId } = useParams();
    const {
        organization,
        propertyDetails,
        isLoading,
        allUsers,
        // rfpManagerSupported,
        featureFlags,
        floorplans,
        //eslint-disable-next-line no-unused-vars
        baseScope,
        //eslint-disable-next-line no-unused-vars
        altScope,
        //eslint-disable-next-line no-unused-vars
        flooringScope,
    } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            propertyDetails: state.propertyDetails.data,
            isLoading: state.propertyDetails.loading,
            allUsers: state.tpsm.all_User,
            // rfpManagerSupported: state.budgeting.bidbook.data.rfpManagerSupported,
            featureFlags: state.common.featureFlags.data,
            floorplans: state.projectFloorplans.floorplans,
            baseScope: state.budgeting?.details?.baseScope?.renovations,
            altScope: state.budgeting?.details?.altScope?.renovations,
            flooringScope: state.budgeting?.details?.flooringScope?.renovations,
        };
    });
    const location = useLocation();
    const { pathname } = location;
    const navigate = useNavigate();
    // const [tab, setTab] = useState(PROPERTY_TABS);
    const [showWavgToggle, setShowWavgToggle] = useState(false);
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    useEffect(() => {
        growthbook.setFeatures(featureFlags);
        growthbook.setAttributes({
            property_id: propertyId,
            email: email,
        });
    }, [propertyId, featureFlags, email]);
    useEffect(() => {
        setCurrentTab(getCurrentTab());
        document.title = GetDocTitle(`tb_projects_${getCurrentTab()}`);
        if (pathname?.includes("budgeting")) {
            setShowWavgToggle(true);
        } else {
            setShowWavgToggle(false);
        }
        //eslint-disable-next-line
    }, [location]);

    // useEffect(() => {
    // const projectModules = [...PROPERTY_TABS];
    // projectModules[3].enable = rfpManagerSupported;
    // setTab(PROPERTY_TABS);
    // }, [rfpManagerSupported]);

    useEffect(() => {
        if (isEmpty(floorplans?.data)) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: propertyId }));
        }
        // dispatch(actions.budgeting.fetchBaseScopeRenosStart({ projectId }));
        // dispatch(actions.budgeting.fetchDataSourceNewItemsStart({ projectId }));
        // dispatch(actions.budgeting.fetchAltScopeStart({ projectId }));
        // dispatch(
        //     actions.scraperService.fetchDataForSearchFiltersStart({ input: { version: "2.0" } }),
        // );

        // dispatch(
        //     actions.budgeting.fetchFlooringRenoItemsStart({
        //         projectId,
        //     }),
        // );
        console.log(propertyId, "id !!@!@!@!");
        dispatch(actions.propertyDetails.fetchPropertyDetailsStart(propertyId));
        // dispatch(actions.projectOverview.fetchDataSourceUploadStatusStart(projectId));
        // dispatch(actions.budgeting.fetchExportDetailsStart({ projectId }));
        // dispatch(
        //     actions.projectFloorplans.fetchUserRemarkStart({
        //         projectId,
        //         location: "unit_mix_edit",
        //     }),
        // );
        if (!organization) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        if (!allUsers.users) {
            dispatch(actions.tpsm.fetchAllUserStart(""));
        }
        return () => {
            dispatch(actions.propertyDetails.propertyDetailsInit(""));
            dispatch(actions.projectOverview.overviewStateInIt(""));
            dispatch(actions.projectFloorplans.projectFloorplansStateInit(""));
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (propertyDetails?.ownershipGroupId)
            dispatch(
                actions.budgeting.fetchCommonEntitiesStart({
                    ownershipId: propertyDetails.ownershipGroupId,
                    projectType: propertyDetails.projectType,
                    containerVersion:
                        parseFloat((propertyDetails as any)?.system_remarks?.container_version)
                            .toFixed(1)
                            .toString() ?? "1.0",
                }),
            );
        // eslint-disable-next-line
    }, [propertyDetails?.ownershipGroupId]);
    useEffect(() => {
        // propertyDetails &&
        // dispatch(
        //     actions.scopes.fetchMDMContainerTreeStart({
        //         projectType: propertyDetails.projectType,
        //         containerVersion: "2.0",
        //     }),
        // );
        // if (
        //     !isLoading &&
        //     (propertyDetails.projectType == PROJECT_TYPE[1].value ||
        //         propertyDetails.projectType == PROJECT_TYPE[2].value)
        // ) {
        //     const projectModules = [...PROPERTY_TABS];
        //     // abc.splice(1, 1);
        //     projectModules[1].label = "Building/Area";
        //     setTab(projectModules);
        // } else {
        //     const projectModules = [...PROPERTY_TABS];
        //     projectModules[1].label = "Floorplans";
        //     setTab(PROPERTY_TABS);
        // }
        console.log(propertyDetails, propertyDetails?.rentRoll, "before");
        if (propertyDetails && !propertyDetails?.rentRoll) {
            console.log("in here", propertyDetails, propertyDetails?.rentRoll);
            dispatch(
                actions.projectDetails.fetchRentRollStart({
                    projectId: propertyDetails.projects.find((elm: any) => elm.type === "DEFAULT")
                        .id,
                }),
            );
        }
        console.log(propertyDetails, "propertyDetails, updated");
        if (propertyDetails?.isDeleted && propertyDetails.id == propertyId) {
            navigate(`/admin-properties/archived`);
        }
        // eslint-disable-next-line
    }, [propertyDetails]);

    const getCurrentTab = () => {
        if (pathname.includes("/floorplans")) {
            return "floorplans";
        } else if (pathname.includes("/budgeting")) {
            return "budgeting";
        } else if (pathname.includes("/projects")) {
            return "projects";
        }
        return "overview";
    };

    const [currentTab, setCurrentTab] = useState<string>("overview");

    const tabChanged = (event: ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
        navigate(`/admin-properties/${propertyId}/${newValue}`);
    };

    const OnWavgToggleChange = (checked: any) => {
        dispatch(actions.budgeting.updateOneOfEach({ isOneOfEach: !checked }));
    };
    return (
        <GrowthBookProvider growthbook={growthbook}>
            <React.Fragment>
                {isLoading ? (
                    <BaseLoader />
                ) : (
                    <Grid container>
                        <Grid item md={12}>
                            <AppContainer
                                title={`${
                                    find(organization, {
                                        id: propertyDetails?.ownershipGroupId,
                                    })
                                        ? `${
                                              find(organization, {
                                                  id: propertyDetails?.ownershipGroupId,
                                              })?.name
                                          } - `
                                        : ""
                                }${propertyDetails?.name || ""}`}
                                otherContent={
                                    showWavgToggle && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "10px",
                                                marginTop: "5px",
                                            }}
                                        >
                                            <span>One of each</span>
                                            <StyledSwitch
                                                defaultChecked={true}
                                                onChange={(event: any) => {
                                                    OnWavgToggleChange(event.target.checked);
                                                }}
                                                inputProps={{ "aria-label": "controlled" }}
                                            />
                                            <span> Reno Items</span>
                                        </div>
                                    )
                                }
                                currentTab={currentTab}
                                tabChanged={tabChanged}
                                tabList={PROPERTY_TABS}
                            />
                            <Outlet />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        </GrowthBookProvider>
    );
};

export default Properties;
