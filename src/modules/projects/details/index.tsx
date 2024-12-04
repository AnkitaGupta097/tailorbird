/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, ChangeEvent, useMemo } from "react";
import { Grid, Switch, SwitchProps, styled } from "@mui/material";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { PROJECT_DETAILS_PAGES } from "./budgeting/constants";
import { PROJECT_TYPE } from "../constant";
import actions from "stores/actions";
import { find, isEmpty } from "lodash";
import BaseLoader from "../../../components/base-loading";
import { GetDocTitle } from "utils/get-doc-title";
import AppContainer from "components/app-container";
import { GrowthBook, GrowthBookProvider, useFeature } from "@growthbook/growthbook-react";
import { IUser } from "App";
import { FeatureFlagConstants } from "utils/constants";

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

const Projects = () => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const {
        organization,
        projectDetails,
        isLoading,
        allUsers,
        rfpManagerSupported,
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
            projectDetails: state.projectDetails.data,
            isLoading: state.projectDetails.loading,
            allUsers: state.tpsm.all_User,
            rfpManagerSupported: state.budgeting.bidbook.data.rfpManagerSupported,
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
    const isSowFeatureEnabled = useFeature(FeatureFlagConstants.SOW_EXH_A).on;

    const getProjectDetailsPages = () => {
        let projectDetailsPages = PROJECT_DETAILS_PAGES;
        if (!isSowFeatureEnabled) {
            projectDetailsPages = projectDetailsPages.filter((page) => page.value !== "sow_ex_a");
        }
        return projectDetailsPages;
    };
    const [tab, setTab] = useState(getProjectDetailsPages());
    const [showWavgToggle, setShowWavgToggle] = useState(false);
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    useEffect(() => {
        growthbook.setFeatures(featureFlags);
        growthbook.setAttributes({
            project_id: projectId,
            email: email,
        });
    }, [projectId, featureFlags, email]);
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

    useEffect(() => {
        if (isEmpty(floorplans?.data)) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        }
        dispatch(
            actions.rfpProjectManager.fetchAssignedUsersListStart({
                project_id: projectId,
                rfp_project_version: "2.0",
                is_demand_side: true,
            }),
        );
        dispatch(actions.budgeting.fetchBaseScopeRenosStart({ projectId }));
        dispatch(actions.budgeting.fetchDataSourceNewItemsStart({ projectId }));
        dispatch(actions.budgeting.fetchAltScopeStart({ projectId }));
        dispatch(
            actions.scraperService.fetchDataForSearchFiltersStart({ input: { version: "2.0" } }),
        );

        dispatch(
            actions.budgeting.fetchFlooringRenoItemsStart({
                projectId,
            }),
        );
        dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));
        dispatch(actions.projectOverview.fetchDataSourceUploadStatusStart(projectId));
        if (rfp_project_version !== "2.0")
            dispatch(actions.budgeting.fetchExportDetailsStart({ projectId }));
        dispatch(
            actions.projectFloorplans.fetchUserRemarkStart({
                projectId,
                location: "unit_mix_edit",
            }),
        );
        if (!organization) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        if (!allUsers.users) {
            dispatch(actions.tpsm.fetchAllUserStart(""));
        }
        return () => {
            dispatch(actions.projectDetails.projectDetailsInit(""));
            dispatch(actions.projectOverview.overviewStateInIt(""));
            dispatch(actions.projectFloorplans.projectFloorplansStateInit(""));
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (projectDetails?.ownershipGroupId)
            dispatch(
                actions.budgeting.fetchCommonEntitiesStart({
                    ownershipId: projectDetails.ownershipGroupId,
                    projectType: projectDetails.projectType,
                    // Parse the container version to a float, fix to 1 decimal place, and convert back to string
                    // If parsing fails, default to "1.0"
                    containerVersion:
                        parseFloat((projectDetails as any)?.system_remarks?.container_version)
                            .toFixed(1)
                            .toString() ?? "1.0",
                }),
            );
        // eslint-disable-next-line
    }, [projectDetails?.ownershipGroupId]);

    // Memoize the rfp_project_version for performance optimization
    const rfp_project_version = useMemo(() => {
        // Parse the rfp_project_version to a float, fix to 1 decimal place, and convert back to string
        // If parsing fails, default to "1.0"
        const version = parseFloat(
            (projectDetails as any)?.system_remarks?.rfp_project_version,
        ).toFixed(1);
        return version.toString() || "1.0";
    }, [projectDetails]);

    // This effect runs when projectDetails, rfp_project_version, or rfpManagerSupported changes
    useEffect(() => {
        // Create a copy of PROJECT_DETAILS_PAGES
        let projectModules = [...getProjectDetailsPages()];

        // If projectDetails exists
        projectDetails &&
            // Dispatch an action to fetch MDM container tree
            dispatch(
                actions.scopes.fetchMDMContainerTreeStart({
                    projectType: projectDetails.projectType,
                    containerVersion: projectDetails?.system_remarks?.container_version || "2.0",
                }),
            );

        // Map over projectModules to create a new array
        projectModules = projectModules.map((item) => {
            // Create a copy of the current item
            let newItem = { ...item };

            // If the current item's value is "floorplans"
            if (item.value === "floorplans") {
                // Update the label based on the project type and loading status
                newItem.label =
                    !isLoading &&
                    (projectDetails?.projectType === PROJECT_TYPE[1].value ||
                        projectDetails?.projectType === PROJECT_TYPE[2].value)
                        ? "Building/Area"
                        : "Floorplans";
            }

            // If the current item's value is "bidbook"
            if (item.value === "bidbook") {
                // Enable the item only if rfp_project_version is "2.0"
                newItem.enable = rfp_project_version === "2.0";
            }

            // If the current item's value is "rfp_manager"
            if (item.value === "rfp_manager") {
                // Enable the item if rfpManagerSupported is true
                newItem.enable = rfpManagerSupported;
            }

            // Return the updated item
            return newItem;
        });

        // Update the state of tab
        setTab(projectModules);

        // If the project is deleted and the project id matches the current project id
        if (projectDetails?.isDeleted && projectDetails.id === projectId) {
            // Navigate to the archived projects page
            navigate(`/admin-projects/archived`);
        }
        // eslint-disable-next-line
    }, [projectDetails, rfp_project_version, rfpManagerSupported]);
    const getCurrentTab = () => {
        if (pathname.includes("/floorplans")) {
            return "floorplans";
        } else if (pathname.includes("/budgeting")) {
            return "budgeting";
        } else if (pathname.includes("/bidbook")) {
            return "bidbook";
        } else if (pathname.includes("/rfp_manager")) {
            return "rfp_manager";
        } else if (pathname.includes("/demand_users")) {
            return "demand_users";
        } else if (pathname.includes("/sow_ex_a")) {
            return "sow_ex_a";
        } else if (pathname.includes("/resource_access")) {
            return "resource_access";
        }
        return "overview";
    };

    const [currentTab, setCurrentTab] = useState<string>("overview");

    const tabChanged = (event: ChangeEvent<{}>, newValue: string) => {
        const path = `/${newValue}`;
        setCurrentTab(newValue);
        if (pathname.split("/").length === 3) {
            navigate(pathname.substring(0, pathname.length) + path);
        } else {
            navigate(pathname.substring(0, pathname.lastIndexOf("/")) + path);
        }
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
                                        id: projectDetails?.ownershipGroupId,
                                    })
                                        ? `${
                                              find(organization, {
                                                  id: projectDetails?.ownershipGroupId,
                                              })?.name
                                          } - `
                                        : ""
                                }${projectDetails?.name || ""}`}
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
                                tabList={tab}
                            />
                            <Outlet />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        </GrowthBookProvider>
    );
};

export default Projects;
