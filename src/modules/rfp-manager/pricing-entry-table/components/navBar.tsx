import { Grid, Stack, Box, Typography, Link } from "@mui/material";
import { BIDS_STATUSES, ROUTES } from "modules/rfp-manager/common/constants";
import React, { useEffect, useMemo, useState, version, useContext } from "react";
import mixpanel from "../../../../mixpanel/mixpanel.config";
import { useDispatch, ReactReduxContext } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import ExportToExcelButton from "../export-to-excel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { includes, isEmpty } from "lodash";
import { useAppSelector } from "stores/hooks";
import { useSnackbar } from "notistack";
import { transformDataToHierarchy, convertCombinedBidItemsToTreeData } from "../constants";
import BaseSnackbar from "components/base-snackbar";
import { saveAs } from "file-saver";
import { getUserDetails } from "mixpanel/mixpanelHelper";
import { groupedBidItemMapper } from "modules/rfp-manager/common/groupedBidItemMapper";

interface INavBar {
    showNavigation?: boolean;
    showExportToExcel?: boolean;
    groupedBidItems: any;
    index: any;
    isEditable?: boolean;
    isAgreement: boolean;
    isAdminAccess: boolean;
    orgId?: string;
    isLatest: boolean;
    projectDetails: any;
    selectedRows: any;
    category: any;
    wrapWithAccordion: boolean;
    orgContainerId: null;
    selectedVersion: any;
}

const NavBar = ({
    showNavigation,
    showExportToExcel,
    groupedBidItems,
    index,
    isEditable,
    isAgreement,
    isAdminAccess,
    orgId,
    isLatest,
    projectDetails,
    selectedRows,
    category,
    wrapWithAccordion,
    orgContainerId,
    selectedVersion,
}: INavBar) => {
    let { projectId, role, userID } = useParams();
    userID = isAgreement ? localStorage.getItem("user_id") ?? undefined : userID;
    const { contractorList, project, filteredProjectCostWithExludedCategory, categories } =
        useAppSelector((state) => ({
            contractorList: projectId
                ? state?.rfpProjectManager?.details[projectId]?.collaboratorsList
                : [],
            project: state?.projectDetails?.data,
            filteredProjectCostWithExludedCategory: state?.biddingPortal?.filteredProjectCost,
            categories: state?.biddingPortal?.categories,
        }));
    const dispatch = useDispatch();
    const navState = useLocation().state as any;
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [showError, setErrorModal] = React.useState<boolean>(false);
    const [disableExportRow, setDisableExportRow] = React.useState(true);
    const [projectName, setProjectName] = React.useState("");
    const [GCName, setGCName] = React.useState("");
    const [projectType, setProjectType] = React.useState("");
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const export_open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const { store } = useContext(ReactReduxContext);
    const items = useMemo(() => {
        let bidItems = [];
        if (groupedBidItems && groupedBidItems?.length > 0) {
            let catIndex = groupedBidItems?.[index]?.categories?.findIndex(
                (list: any) => list?.category === category,
            );
            if (catIndex != -1) {
                bidItems = orgContainerId
                    ? transformDataToHierarchy(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                      )
                    : convertCombinedBidItemsToTreeData(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                      );
            }
        }
        return bidItems;
    }, [groupedBidItems, index, category, orgContainerId]);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [
        filteredProjectCost,
        // setFilteredProjectCost
    ] = useState(filteredProjectCostWithExludedCategory);
    const excelWorker: Worker = React.useMemo(
        () => new Worker(new URL("../../pricing-summary-table/excel-worker.ts", import.meta.url)),
        [],
    );
    const [propertyAddress, setPropertyAddress] = React.useState("");
    const [excelFileName, setExcelFileName] = React.useState("");
    const exportRowToExcel = () => {
        if (selectedRows?.length > 0) {
            let { inventory_name, sub_group_name, fp_name, total_units, fp_commercial_name } =
                navState?.data || {};
            let selectedItems = [
                {
                    inventory_name,
                    sub_group_name,
                    fp_name,
                    fp_commercial_name,
                    total_units,
                    categories: [
                        {
                            category,
                            items: items.filter((row: { id: string }) =>
                                includes(selectedRows, row?.id),
                            ),
                        },
                    ],
                },
            ];
            excelWorker.postMessage({
                action: "generate_excel",
                payload: {
                    groupedBidItems: selectedItems.map(groupedBidItemMapper),
                    GCName,
                    projectName,
                    propertyAddress,
                    projectType,
                    exportType: "rows",
                    filteredProjectCost,
                },
            });
        }
    };
    const ExportBidbookToExcel = () => {
        excelWorker.postMessage({
            action: "generate_excel",
            payload: {
                groupedBidItems: groupedBidItems.map(groupedBidItemMapper),
                GCName,
                projectName,
                propertyAddress,
                projectType,
                exportType: "full",
                filteredProjectCost,
                categories,
            },
        });
    };
    const ExportPageToExcel = () => {
        if (items.length > 0) {
            let { inventory_name, sub_group_name, fp_name, total_units, fp_commercial_name } =
                navState?.data || groupedBidItems?.[index] || {};
            let categories = navState?.data
                ? [{ category, items }]
                : groupedBidItems?.[index]
                ? groupedBidItems?.[index]?.categories
                : {};
            let pageBidItems = [
                {
                    inventory_name,
                    sub_group_name,
                    fp_name,
                    fp_commercial_name,
                    total_units,
                    categories,
                },
            ];

            excelWorker.postMessage({
                action: "generate_excel",
                payload: {
                    groupedBidItems: pageBidItems.map(groupedBidItemMapper),
                    GCName,
                    projectName,
                    propertyAddress,
                    projectType,
                    exportType: "page",
                    filteredProjectCost,
                },
            });
        }
    };
    const exportToExcelProps = {
        export_open,
        handleClick,
        anchorEl,
        handleClose,
        exportRowToExcel,
        ExportPageToExcel,
        ExportBidbookToExcel,
        disableExportRow,
        showExportRowOption: !wrapWithAccordion,
        projectName: projectDetails?.project_name,
        bidStatus: projectDetails?.bid_status,
        fileName: excelFileName,
    };

    useEffect(() => {
        dispatch(
            actions.rfpProjectManager.fetchAssignedContractorListForOrganizationStart({
                project_id: projectId,
                organization_id: orgId,
            }),
        );
        const workerEvent = async (event: MessageEvent) => {
            if (event.data?.status === "failed") {
                setErrorModal(true);
            } else {
                // eslint-disable-next-line
                const buffer = event.data.payload.buffer;
                saveAs(new Blob([buffer]), `${event.data.payload.wb_name}`);
                const currentState = store.getState();
                setExcelFileName(event.data.payload.wb_name);

                if (currentState?.biddingPortal?.eventName) {
                    mixpanel.track(currentState?.biddingPortal?.eventName, {
                        eventId: currentState?.biddingPortal?.eventId,
                        ...getUserDetails(),
                        projectId: currentState?.biddingPortal?.projectId,
                        projectName: currentState?.biddingPortal?.projectName,
                        bidStatus: currentState?.biddingPortal?.bidStatus,
                        fileName: event.data.payload.wb_name,
                    });
                }
            }
        };

        excelWorker.addEventListener("message", workerEvent);
        return () => {
            dispatch(actions.common.closeSnack());
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (
            isEditable == undefined &&
            (projectDetails?.bid_status === BIDS_STATUSES.ACCEPTED ||
                projectDetails?.bid_status === BIDS_STATUSES.PENDING_SUBMISSION ||
                projectDetails?.bid_status === BIDS_STATUSES.REQUESTED_REVISED_PRICING) &&
            (selectedVersion === isLatest || isEmpty(selectedVersion))
        ) {
            dispatch(
                actions.biddingPortal.lockProjectForEditingStart({
                    userId: userID,
                    projectId,
                    organization_id: orgId,
                }),
            );
        }
        //eslint-disable-next-line
    }, [projectDetails?.bid_status]);

    useEffect(() => {
        setDisableExportRow(selectedRows?.length === 0);
    }, [selectedRows]);

    useEffect(() => {
        if (project?.projectType) {
            setProjectType(project.projectType);
        }
        if (project?.name) {
            setProjectName(project.name);
        }
        if (project?.streetAddress) {
            setPropertyAddress(project.streetAddress);
        }
    }, [project]);
    useEffect(() => {
        if (contractorList?.length > 0) {
            setGCName(contractorList[0].organization?.name);
        }
    }, [contractorList]);
    useEffect(() => {
        if (showError) {
            index === 0 &&
                enqueueSnackbar("", {
                    action: (
                        <BaseSnackbar
                            variant="error"
                            title="error"
                            description="Export to excel failed"
                        />
                    ),
                });
            setTimeout(() => {
                setErrorModal(false);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [showError]);

    useEffect(() => {
        const onBeforeUnloadAction =
            isEditable &&
            (projectDetails?.bid_status === BIDS_STATUSES.ACCEPTED ||
                projectDetails?.bid_status === BIDS_STATUSES.REQUESTED_REVISED_PRICING ||
                projectDetails?.bid_status === BIDS_STATUSES.PENDING_SUBMISSION)
                ? //eslint-disable-next-line
                  (event: BeforeUnloadEvent) => {
                      fetch(process.env.REACT_APP_APP_APOLLO_SERVER_URL!, {
                          keepalive: true,
                          headers: {
                              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                              operationName: "DeleteCurrentSession",
                              variables: {
                                  projectId: projectId,
                                  contractorOrgId: orgId,
                              },
                              query: "mutation DeleteCurrentSession($projectId: String!, $contractorOrgId: String!) {  deleteCurrentSession(    project_id: $projectId    contractor_org_id: $contractorOrgId  )}",
                          }),
                          method: "POST",
                      });
                  }
                : () => {};
        window.addEventListener("beforeunload", onBeforeUnloadAction);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnloadAction);
        };
        //eslint-disable-next-line
    }, [isEditable]);

    return (
        <Grid item alignItems="center" xs>
            <Stack direction="row" alignItems="center" width="100%" justifyContent="space-between">
                <Box alignItems="center" display="flex">
                    {showNavigation && (
                        <>
                            <Link
                                onClick={() => {
                                    dispatch(actions.biddingPortal.updateSyncTimerStatesStart({}));
                                    if (isEditable) {
                                        dispatch(
                                            actions.biddingPortal.checkIfSubmitShouldBeDisabled(),
                                        );
                                    }
                                    if (isAgreement) {
                                        navigate(-1);
                                    } else {
                                        let url = isAdminAccess
                                            ? ROUTES.SUMMARY_TABLE_ADMIN(
                                                  role!,
                                                  userID!,
                                                  projectId!,
                                                  orgId!,
                                                  version!,
                                                  isLatest ? "&isLatest=true" : "&isLatest=false",
                                              )
                                            : ROUTES.SUMMARY_TABLE(role!, userID!, projectId!);

                                        navigate(url, {
                                            state: {
                                                org_id: orgId,
                                                version: version,
                                                isLatest: isLatest,
                                            },
                                        });
                                    }
                                }}
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                    display: "inline-flex",
                                    flexWrap: "wrap",
                                    gap: 4,
                                }}
                            >
                                <ArrowBackIcon htmlColor="#000" />
                                <Typography display="inline" variant="text_16_regular">
                                    {projectName}
                                </Typography>
                            </Link>
                            <Typography
                                display="inline"
                                bottom="1px"
                                position="relative"
                                variant="text_16_regular"
                            >
                                /{" "}
                                {projectDetails?.property_type?.toLowerCase() !== "interior" &&
                                groupedBidItems?.[index]?.fp_name?.toLowerCase() ===
                                    "all floor plans"
                                    ? "All Areas"
                                    : groupedBidItems?.[index]?.fp_commercial_name ??
                                      groupedBidItems?.[index]?.fp_name}
                            </Typography>
                        </>
                    )}
                </Box>
                {showExportToExcel && <ExportToExcelButton {...exportToExcelProps} />}
            </Stack>
        </Grid>
    );
};

export default NavBar;
