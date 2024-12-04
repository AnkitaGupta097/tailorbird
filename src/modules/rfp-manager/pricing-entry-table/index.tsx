import { Grid } from "@mui/material";
import { isEmpty } from "lodash";
import CommonDialog from "modules/admin-portal/common/dialog";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppSelector } from "stores/hooks";
import { ROUTES } from "../common/constants";
import StatusIndicator from "../common/status-indicator";
import { transformDataToHierarchy, convertCombinedBidItemsToTreeData } from "./constants";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { IPriceEntryTableItems } from "stores/projects/details/budgeting/base-scope/constants";
import HeaderComponent from "./components/header-component";
import NavBar from "./components/navBar";
import PriceDataGrid from "./components/price-data-grid";
import useIsAgreement from "./hooks/useIsAgreement";

const PriceEntryTable: FC<IPriceEntryTableItems> = ({
    categoryName,
    fpIndex,
    propBidRequestItem,
    propBidResponseItem,
    showStatusBar,
    showNavigation,
    showExportToExcel,
    disableSnackbar,
    costsColumnWidth,
}) => {
    const navState = useLocation().state as any;
    const navigate = useNavigate();
    const [syncTimeout, setSyncTimeout] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const userRole = localStorage.getItem("role");
    const orgId =
        (location.state as any)?.org_id ?? userRole == "admin"
            ? localStorage.getItem("contractor_org_id") ?? undefined
            : localStorage.getItem("organization_id") ?? undefined;
    const version =
        (location.state as any)?.version ?? userRole == "admin"
            ? localStorage.getItem("version") ?? undefined
            : undefined;
    let isLatest: any =
        (location.state as any)?.isLatest ?? userRole == "admin"
            ? localStorage.getItem("isLatest") ?? undefined
            : undefined;
    isLatest =
        isLatest !== undefined
            ? isLatest?.trim()?.toLowerCase() === "true"
                ? true
                : false
            : undefined;
    const enableCombineLineItems = useFeature(FeatureFlagConstants.COMBINE_LINE_ITEMS).on;
    let { projectId, role, userID } = useParams();
    userID = navState?.isAdminAccess ? userID : localStorage.getItem("user_id") ?? undefined;
    const isAdminAccess = role !== localStorage.getItem("role");
    const {
        groupedBidItems,
        bidItemsUpdated,
        bidRequest,
        isEditable,
        isOffline,
        isIdle,
        loading,
        loadingSession,
        projects,
        loadingOperation,
        loadingMessage,
        contractorList,
        project,
        selectedVersion,
        floorplans,
    } = useAppSelector((state) => ({
        groupedBidItems: state.biddingPortal.groupedBidItems,
        bidItemsUpdated: state.biddingPortal.bidItemsUpdated,
        bidRequest: state.rfpService.project.bidRequest,
        isEditable: state.biddingPortal.isEditable,
        isIdle: state.biddingPortal.isIdle,
        isOffline: state.biddingPortal.isOffline,
        loading: state.biddingPortal.loading,
        loadingSession: state.biddingPortal.loadingSession,
        projects: state.rfpService.project.projectDetails,
        loadingOperation: state.biddingPortal.loadingOperation,
        loadingMessage: state.biddingPortal.loadingMessage,
        selectedVersion: state.biddingPortal.selectedVersion,
        contractorList: projectId
            ? state?.rfpProjectManager?.details[projectId]?.collaboratorsList
            : [],
        project: state?.projectDetails?.data,
        floorplans: state?.projectFloorplans?.floorplans?.data,
    }));

    const isAgreement = useIsAgreement(navState?.isAgreement, bidRequest);
    role = isAgreement ? localStorage.getItem("role") ?? undefined : role;

    if (!groupedBidItems) {
        navigate(-1);
    }

    const [projectDetails, setProjectDetails] = useState<(typeof projects)[0] | null>();
    const [comboPromptState, setComboPromptState] = useState<{
        open: boolean;
        selectedItemId?: string;
        params?: any;
    }>({
        open: false,
    });

    useEffect(() => {
        if (floorplans?.length === 0) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        }
        if (projects.length === 0) {
            dispatch(
                actions.rfpService.fetchProjectDetailsStart({
                    user_id: userID,
                }),
            );
        }
        //apiRef.current.setRowChildrenExpansion("", true);
        //eslint-disable-next-line
    }, []);

    const index = fpIndex ?? navState?.index;

    //This is customer defined category if any otherwise TB category
    const category = categoryName ?? navState?.category;
    const bidResponseItem = propBidResponseItem ?? navState?.bidResponseItem;
    const [bidRequestItem, setBidRequestItem] = useState<any[]>(
        propBidRequestItem ?? navState?.bidRequestItem,
    );

    const [items, setItems] = useState<any>([]);

    let catIndex = groupedBidItems?.[index]?.categories?.findIndex(
        (list: any) => list?.category === category,
    );
    const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
    const [selectedRowsData, setSelectedRowsData] = useState<any[]>([]);
    const [currentRenoversion, setCurrentRenoversion] = React.useState();
    const [orgContainerId, setOrgContainerId] = React.useState(null);

    useEffect(() => {
        if (project?.organisation_container_id) {
            setOrgContainerId(project?.organisation_container_id);
        }
    }, [project]);

    useEffect(() => {
        if (bidRequest && bidRequest?.length > 0) {
            setBidRequestItem(bidRequest);
            let bidVersion: string | undefined = selectedVersion;
            // Url contains org_id and version when tb admin accesses the contractor bidbook
            if (orgId && isEmpty(bidVersion)) {
                bidVersion = `Version ${version}`;
            }
            if (!groupedBidItems || groupedBidItems?.length === 0) {
                //Get latest bid items from last acceptef bid request reno version
                let acceptedRequest = bidRequest?.filter(
                    (request: { is_accepted: boolean }) => request?.is_accepted === true,
                );
                let agreementRequest = bidRequest?.filter(
                    (request: { type: string }) => request?.type === "agreement",
                );
                let renoVersion = isAgreement
                    ? agreementRequest?.[agreementRequest?.length - 1]?.reno_item_version
                    : acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version;

                dispatch(
                    actions.biddingPortal.fetchBidItemsStart({
                        projectId: projectId,
                        contractorOrgId: orgId,
                        renovationVersion: renoVersion,
                    }),
                );
                if (version && version != "1") {
                    dispatch(
                        actions.biddingPortal.fetchDiffFromRenovationVersionStart({
                            projectId: projectId,
                            renovationVersion: renoVersion,
                            contractor_org_id: orgId,
                            bidResponse: bidRequest?.find(
                                (val: any) =>
                                    val.revision_version ===
                                    parseInt((parseInt(version, 10) - 1).toFixed(0), 10),
                            ),
                        }),
                    );
                }
            }
        }
        // eslint-disable-next-line
    }, [bidRequest]);

    useEffect(() => {
        dispatch(actions.biddingPortal.updateSyncTimerStatesStart({}));
        if (projects.length === 0) {
            isAgreement
                ? dispatch(
                      actions.rfpService.fetchProjectDetailsStart({
                          organization_id: orgId,
                      }),
                  )
                : dispatch(
                      actions.rfpService.fetchProjectDetailsStart({
                          user_id: userID,
                      }),
                  );
        }
        if (catIndex !== -1) {
            //TO-DO : merge transformDataToHierarchy and convertCombinedBidItemsToTreeData function

            let items = orgContainerId
                ? transformDataToHierarchy(groupedBidItems?.[index]?.categories?.[catIndex]?.items)
                : convertCombinedBidItemsToTreeData(
                      groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                  );
            setItems(items);
        }
        //@ts-ignore
        if (groupedBidItems?.length > 0) {
            //Get latest bid items from last acceptef bid request reno version
            let acceptedRequest = bidRequestItem?.filter(
                (request: { is_accepted: boolean }) => request?.is_accepted === true,
            );
            let renoVersion = acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version;
            setCurrentRenoversion(renoVersion);
            actions.biddingPortal.fetchBidItemsStart({
                projectId: projectId,
                contractorOrgId: orgId,
                renovationVersion: renoVersion,
            });
        }

        if (bidRequestItem?.length === 0)
            dispatch(
                actions.rfpService.getBidRequestByProjectStart({
                    projectId: projectId,
                    contractorOrgId: orgId,
                }),
            );

        if (!project) {
            dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));
        }
        if (contractorList?.length === 0) {
            dispatch(
                actions.rfpProjectManager.fetchAssignedContractorListForOrganizationStart({
                    project_id: projectId,
                    organization_id: orgId,
                }),
            );
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (projects?.length > 0) {
            setProjectDetails(projects.find((project) => project.project_id == projectId));
        }
        //eslint-disable-next-line
    }, [projects]);

    useEffect(() => {
        if (index !== 0 && !index && isAgreement) {
            isAgreement ? navigate(-1) : navigate(ROUTES.SUMMARY_TABLE(role!, userID!, projectId!));
        }
        //eslint-disable-next-line
    }, [isAgreement]);

    if (loading || loadingSession || !groupedBidItems || !items || loadingOperation) {
        return (
            <CommonDialog
                open={(loading || loadingSession || loadingOperation) ?? false}
                onClose={() => {}}
                loading={loading || loadingSession || loadingOperation}
                loaderText={
                    loadingOperation
                        ? loadingMessage
                        : "Please wait. We are loading the bid details..."
                }
                width="40rem"
                minHeight="26rem"
            />
        );
    }

    return (
        <>
            {showStatusBar && (
                <StatusIndicator
                    bidStatus={projectDetails?.bid_status}
                    bidResponseItem={bidResponseItem}
                    organization_id={orgId}
                />
            )}
            <Grid container direction="column" p="2.75rem 7.5rem" gap="1.25rem">
                <NavBar
                    showNavigation={showNavigation}
                    showExportToExcel={showExportToExcel}
                    groupedBidItems={groupedBidItems}
                    index={index}
                    isEditable={isEditable}
                    isAgreement={isAgreement}
                    isAdminAccess={isAdminAccess}
                    orgId={orgId}
                    isLatest={isLatest}
                    projectDetails={projectDetails}
                    selectedRows={selectedRows}
                    category={category}
                    wrapWithAccordion={false}
                    orgContainerId={orgContainerId}
                    selectedVersion={selectedVersion}
                />

                <HeaderComponent
                    wrapWithAccordion={false}
                    showNavigation={showNavigation}
                    groupedBidItems={groupedBidItems}
                    index={index}
                    catIndex={catIndex}
                    category={category}
                    orgContainerId={orgContainerId}
                    setItems={setItems}
                    selectedRows={selectedRows}
                    selectedRowsData={selectedRowsData}
                    costsColumnWidth={costsColumnWidth}
                    projectDetails={projectDetails}
                    setSelectedRows={setSelectedRows}
                    isIdle={isIdle}
                    isOffline={isOffline}
                    enableCombineLineItems={enableCombineLineItems}
                    setComboPromptState={setComboPromptState}
                />
                {/* <Grid item display={wrapWithAccordion ? "inline" : "none"}>
                    <Divider sx={{ height: "2px" }} />
                    
                </Grid> */}
                <PriceDataGrid
                    items={items}
                    bidItemsUpdated={bidItemsUpdated}
                    syncTimeout={syncTimeout}
                    projectDetails={projectDetails}
                    isEditable={isEditable}
                    isIdle={isIdle}
                    isOffline={isOffline}
                    isAgreement={isAgreement}
                    index={index}
                    category={category}
                    setComboPromptState={setComboPromptState}
                    currentRenoversion={currentRenoversion}
                    orgId={orgId}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    comboPromptState={comboPromptState}
                    isAdminAccess={isAdminAccess}
                    isLatest={isLatest}
                    selectedRowsData={selectedRowsData}
                    setSelectedRowsData={setSelectedRowsData}
                    setItems={setItems}
                    orgContainerId={orgContainerId}
                    setSyncTimeout={setSyncTimeout}
                    disableSnackbar={disableSnackbar}
                />
            </Grid>
        </>
    );
};

PriceEntryTable.defaultProps = {
    showNavigation: true,
    showStatusBar: true,
    showExportToExcel: true,
    wrapWithAccordion: false,
    displayPricingTable: true,
    costsColumnWidth: "auto",
};

export default PriceEntryTable;
