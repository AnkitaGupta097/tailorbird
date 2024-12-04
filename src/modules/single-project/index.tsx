import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import "./index.css";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import OverviewCard from "./overview-card";
import BreadCrumbs from "./breadcrumbs";
import KeyPeople from "./key-people";
import ProjectDetailsTabs from "./project-details-tabs";
import { ReactComponent as CircleUP } from "assets/icons/chevron_Circle_Up.svg";
import Button from "components/button";
import appTheme from "styles/theme";
import actions from "stores/actions";
import { isEmpty } from "lodash";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

const ProjectsDetail: React.FC = () => {
    const { role, userID, projectId } = useParams();
    const userId = localStorage.getItem("user_id");
    const [isSticky, setIsSticky] = useState(false);
    const [isRenoTab, setRenoTab] = useState(false);
    const [showProjectData, setProjectData] = useState(true);
    const [keyPeopleUpdated, setKeyPeopleUpdated]: any = useState([]);
    const dispatch = useAppDispatch();

    const { keyPeople, projectDetails, allUsers, organizations, currentInventory } = useAppSelector(
        (state) => ({
            keyPeople: state.singleProject.keyPeople,
            loading: state.singleProject.loading,
            projectDetails: state.singleProject.projectDetails,
            currentInventory: state.singleProject.renovationWizard.currentInventory,
            allUsers: state.tpsm.all_User?.users || [],
            organizations: state.tpsm.organization,
        }),
    );
    useEffect(() => {
        dispatch(
            actions.singleProject.getDesignDocumentsStart({
                project_id: projectId,
            }),
        );

        dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));
        dispatch(
            actions.singleProject.fetchProjectDataStart({
                project_id: projectId,
            }),
        );
        dispatch(
            actions.scraperService.fetchDataForSearchFiltersStart({ input: { version: "2.0" } }),
        );
        dispatch(
            actions.singleProject.getLeveledBidDocumentsStart({
                project_id: projectId,
                file_type: "LEVELED_BID_DOCUMENTS",
            }),
        );
        dispatch(
            actions.singleProject.getLeveledBidDocumentsStart({
                project_id: projectId,
                file_type: "CONTRACTS",
            }),
        );
        dispatch(actions.singleProject.fetchInventoryListStart(projectId));

        if (isEmpty(organizations)) {
            dispatch(
                actions.tpsm.fetchOrganizationStart({
                    organizationType: null,
                }),
            );
        }
        if (isEmpty(allUsers)) {
            dispatch(actions.tpsm.fetchAllUserStart(""));
        }

        return () => {
            dispatch(actions.singleProject.updateRenoIsInitial(true));
            dispatch(actions.singleProject.resetRenowizardStore({}));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // Empty dependency array means this effect runs once on mount and cleanup on unmount
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        //MIXPANEL : Event tracking for visiting project detail page
        mixpanel.track("PROJECT DETAIL :Visited Project Detail Page ", {
            eventId: "project_detail_page_visited",
            ...getUserDetails(),
            ...getUserOrgDetails(),
            project_name: projectDetails?.name,
            project_id: projectId,
        });
        dispatch(
            actions.singleProject.getRfpBidStatusDeatilsStart({
                projectId: projectId,
                rfpProjectVersion: projectDetails.system_remarks?.rfp_project_version,
                isDemandSide: false,
            }),
        );
        dispatch(
            actions.singleProject.fetchKeyPeopleStart({
                projectId: projectId,
                rfpProjectVersion: projectDetails.system_remarks?.rfp_project_version,
                isDemandSide: true,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectDetails, projectId]);

    useEffect(() => {
        if (!isEmpty(projectDetails.organization) && projectDetails.organization?.id) {
            dispatch(
                actions.singleProject.fetchPackagesStart({
                    project_id: projectId,
                    ownership_group_id: projectDetails.organization.id,
                    is_curated: true,
                }),
            );
            dispatch(
                actions.singleProject.fetchQuestionsAndAnswersStart({
                    organizationId: projectDetails.organization.id,
                    userId: userId,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectDetails.organization]);

    //fetch question resposes whenever currentInventory updated
    useEffect(() => {
        if (currentInventory?.id) {
            dispatch(
                actions.singleProject.fetchQuestionResponssesStart({
                    project_id: projectId,
                    inventory_id: currentInventory?.id,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentInventory]);
    useEffect(() => {
        const updatedData = keyPeople?.map((keyPplItem: any) => {
            let userDetails = allUsers?.find((item: any) => item.id === keyPplItem.contractor_id);
            let companyDetails = organizations?.find(
                (item: any) => item.id === keyPplItem.organization_id,
            );

            return {
                ...keyPplItem,
                name: userDetails?.name || "Unable to find User",
                companyName: companyDetails?.name || "Unable to find company",
            };
        });
        setKeyPeopleUpdated(updatedData ?? []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allUsers, organizations]);

    useLayoutEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsSticky(false);
                return;
            }

            // dont change the div, if there is small scrollbar
            if (
                document.documentElement.scrollHeight - document.documentElement.clientHeight >
                100
            ) {
                showProjectData && setIsSticky(window.scrollY > 0);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box padding={"2rem"} sx={{ background: "#FFF" }} marginBottom={isSticky ? "2%" : "0"}>
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                mt="2.5rem"
            >
                {BreadCrumbs(role, userID, projectDetails.name)}
            </Stack>
            <Stack>
                <OverviewCard
                    isSticky={isSticky}
                    projectDetails={projectDetails}
                    showProjectData={showProjectData}
                />

                <Divider>
                    <Button
                        variant="outlined"
                        startIcon={
                            <CircleUP
                                style={{
                                    transform: `rotate(${showProjectData ? "0" : "180deg"})`,
                                }}
                            />
                        }
                        style={{ borderColor: appTheme.text.medium }}
                        onClick={() => setProjectData(!showProjectData)}
                        label={""}
                    >
                        <Typography variant="text_16_medium" color={appTheme.text.medium}>
                            {showProjectData ? "Hide above" : "Show above"}
                        </Typography>
                    </Button>
                </Divider>
            </Stack>
            <Stack
                display={"grid"}
                gridAutoFlow={"column"}
                gridTemplateColumns={isRenoTab ? "4% 96%" : "21% 78%"}
                justifyContent={"space-between"}
            >
                {isRenoTab ? (
                    <PersonSearchIcon style={{ marginTop: "10px", marginLeft: "10px" }} />
                ) : (
                    <KeyPeople keyPeople={keyPeopleUpdated || []} />
                )}
                <ProjectDetailsTabs setRenoTab={setRenoTab} />
            </Stack>
        </Box>
    );
};
export default React.memo(ProjectsDetail);
