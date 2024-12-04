import ErrorIcon from "@mui/icons-material/Error";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    Autocomplete,
    Divider,
    Grid,
    IconButton,
    Link,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { GridCellParams, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import clsx from "clsx";
import BaseSnackbar from "components/base-snackbar";
import BaseTabs from "components/base-tabs";
import BaseDataGridPro from "components/data-grid-pro";
import AgreementSummary from "components/production/agreements/agreement-summary";
import BaseToggle from "components/toggle";
import { saveAs } from "file-saver";
import { isEmpty } from "lodash";
import CommonDialog from "modules/admin-portal/common/dialog";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import actions from "stores/actions";
import { IGroupedRfpResponseItems } from "stores/bidding-portal/bidding-portal-models";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import TrackerUtil from "utils/tracker";
import { checkIfItemIsModified, checkIfItemIsModifiedForCategory } from "../helper";
import AddPrice from "./add-price";
import ArrowTooltip from "./arrowTooltip";
import { aggregateColumn, wtdAvgColumn } from "./columns";
import { sortGroupedBidItems } from "../common/sortGroupedBidItems";
import { groupedBidItemMapper } from "../common/groupedBidItemMapper";

const tabs = [
    {
        label: "Wtd Average",
        value: "wtd_avg",
    },
    {
        label: "Aggregate",
        value: "aggregate",
    },
];

const NotInScope = () => (
    <Typography variant="text_14_regular" color="#969696" padding="0 0.6rem">
        Not in scope
    </Typography>
);

const PriceSummaryTable: React.FC<{
    captureEditMode?: boolean;
    bidResponseItem?: any[];
    organization_id?: string;
    project_id?: string;
    isAgreement?: boolean;
    projectType?: string;
    //eslint-disable-next-line
    handleSelectedVersion?: (newValue: any) => void;
}> = ({
    captureEditMode,
    bidResponseItem,
    organization_id,
    project_id,
    isAgreement,
    projectType,
    handleSelectedVersion,
}: {
    captureEditMode?: boolean;
    bidResponseItem?: any[];
    organization_id?: string;
    project_id?: string;
    isAgreement?: boolean;
    projectType?: string;
    //eslint-disable-next-line
    handleSelectedVersion?: (newValue: any) => void;
}) => {
    const navigate = useNavigate();
    const excelWorker: Worker = React.useMemo(
        () => new Worker(new URL("./excel-worker.ts", import.meta.url)),
        [],
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const search = location.search;
    const userRole = localStorage.getItem("role");
    // Url contains org_id and version when tb admin accesses the contractor bidbook
    let org_id: string | null | undefined = new URLSearchParams(search).get("org_id");
    org_id = isAgreement
        ? organization_id
        : org_id
        ? org_id
        : userRole == "admin"
        ? localStorage.getItem("contractor_org_id")
        : localStorage.getItem("organization_id");
    let version = new URLSearchParams(search).get("version");
    version = version
        ? version
        : userRole == "admin"
        ? localStorage.getItem("version")
        : "undefined";
    localStorage.setItem("version", version ?? "undefined");
    let isLatest: any = new URLSearchParams(search).get("isLatest");
    isLatest = isLatest ? isLatest : userRole == "admin" ? localStorage.getItem("isLatest") : null;
    localStorage.setItem("isLatest", isLatest);
    isLatest =
        isLatest !== undefined
            ? isLatest?.trim()?.toLowerCase() === "true"
                ? true
                : false
            : undefined;
    const [rows, setRows] = useState<IGroupedRfpResponseItems[]>([]);
    const { projectId } = useParams();
    const projectID = project_id ? project_id : projectId;
    let { role, userID } = useParams();
    role = isAgreement ? localStorage.getItem("role") ?? undefined : role;
    userID = org_id && !isAgreement ? userID : localStorage.getItem("user_id") ?? undefined;
    const [excelFileName, setExcelFileName] = useState("");
    const dispatch: any = useAppDispatch();
    const {
        renoUnits,
        groupedBidItems,
        categories,
        isEditable,
        loading,
        loadingSession,
        considerAlternates,
        contractorList,
        project,
        selectedVersion,
        bidRequest,
        data,
        disableSubmit,
        snackbar,
        inventories,
    } = useAppSelector((state) => ({
        floorplans: state.biddingPortal.floorplans,
        renoUnits: state.biddingPortal.renoUnits,
        groupedBidItems: state.biddingPortal.groupedBidItems,
        categories: state.biddingPortal.categories,
        selectedVersion: state.biddingPortal.selectedVersion,
        isEditable: state.biddingPortal.isEditable,
        loading: state.biddingPortal.loading,
        loadingSession: state.biddingPortal.loadingSession,
        disableSubmit: state.biddingPortal.disableSubmit,
        considerAlternates: state.biddingPortal.considerAlternates,
        contractorList: projectID
            ? state?.rfpProjectManager?.details[projectID]?.collaboratorsList
            : "",
        project: state?.projectDetails?.data,
        bidRequest: state.rfpService.project.bidRequest,
        data: state?.projectDetails.data,
        snackbar: state?.common.snackbar,
        inventories: state?.biddingPortal?.inventories,
    }));

    const [GCName, setGCName] = React.useState("");
    useEffect(() => {
        if (contractorList?.length > 0) {
            setGCName(contractorList[0].organization?.name);
        }
    }, [contractorList]);

    const getTab = () => {
        let tab = searchParams.get("tab");
        let isValid = tabs.find((t) => t.value === tab);
        if (isValid) return isValid.value;
        else return projectType?.toLowerCase() === "interior" ? tabs[0].value : tabs[1].value;
    };
    const [currentTab, setCurrentTab] = React.useState<string>(getTab());
    const [showError, setErrorModal] = React.useState<boolean>(false);

    const onTabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
    };

    const [projectName, setProjectName] = React.useState("");
    const [propertyAddress, setPropertyAddress] = React.useState("");
    useEffect(() => {
        if (project?.name) {
            setProjectName(project.name);
        }
        if (project?.streetAddress) {
            setPropertyAddress(project.streetAddress);
        }
    }, [project]);

    useEffect(() => {
        if (bidRequest?.length > 0 && bidRequest[0].project_id === projectID) {
            //Get latest bid items from last bid request reno version
            let acceptedRequest = bidRequest?.filter(
                (request: { is_accepted: boolean; type: string }) =>
                    request?.is_accepted === true || request?.type === "bid_request",
            );
            let latestVersion =
                acceptedRequest?.length > 0
                    ? acceptedRequest?.[acceptedRequest?.length - 1]?.revision_version
                    : 1;
            if (
                groupedBidItems === undefined &&
                (selectedVersion === `Version ${latestVersion}` ||
                    isEmpty(selectedVersion) ||
                    (version && version !== "undefined"))
            ) {
                let agreementRequest = bidRequest?.filter(
                    (request: { type: string }) => request?.type === "agreement",
                );
                dispatch(actions.biddingPortal.setSelectedVersion(`Version ${latestVersion}`));
                let renoVersion = isAgreement
                    ? agreementRequest?.[agreementRequest?.length - 1]?.reno_item_version
                    : acceptedRequest?.[acceptedRequest?.length - 1]?.reno_item_version;
                dispatch(
                    actions.biddingPortal.fetchBidItemsStart({
                        projectId: projectId,
                        contractorOrgId: organization_id,
                        renovationVersion: renoVersion,
                    }),
                );
                dispatch(
                    actions.biddingPortal.fetchHistoricalPricingDataStart({
                        projectId: projectId,
                        contractorOrgId: organization_id,
                        renovationVersion: renoVersion,
                    }),
                );
                if (latestVersion && latestVersion != "1") {
                    dispatch(
                        actions.biddingPortal.fetchDiffFromRenovationVersionStart({
                            projectId: projectId,
                            renovationVersion: renoVersion,
                            bidResponse: bidRequest?.find(
                                (val: any) =>
                                    val.revision_version ===
                                    parseInt((latestVersion - 1).toFixed(0), 10),
                            ),
                            contractor_org_id: organization_id,
                        }),
                    );
                }
                let editable = isEditable;
                // Url contains org_id and version when tb admin accesses the contractor bidbook
                if (org_id && (isEditable === undefined || isEditable === null)) {
                    editable = selectedVersion !== `Version ${latestVersion}` ? true : false;
                }
                if (
                    (editable == null || editable == undefined) &&
                    captureEditMode &&
                    bidRequest?.length === 0
                ) {
                    dispatch(
                        actions.biddingPortal.lockProjectForEditingStart({
                            userId: userID,
                            projectId,
                            organization_id: organization_id,
                        }),
                    );
                }
            }
        }
        //eslint-disable-next-line
    }, [bidRequest, isEditable]);

    useEffect(() => {
        if ((version === undefined && role === "admin") || isAgreement) {
            dispatch(
                actions.rfpService.getBidRequestByProjectStart({
                    projectId: projectID,
                    contractorOrgId: org_id,
                }),
            );
        }
        //eslint-disable-next-line
    }, [version]);

    useEffect(() => {
        if (!project) {
            dispatch(actions.projectDetails.fetchProjectDetailsStart(projectID));
        }

        if (!contractorList)
            dispatch(
                actions.rfpProjectManager.fetchAssignedContractorListForOrganizationStart({
                    project_id: projectID,
                    organization_id: organization_id,
                    rfp_project_version: "2.0",
                }),
            );
        const workerEvent = async (event: MessageEvent) => {
            if (event.data?.status === "failed") {
                setErrorModal(true);
            }
            const buffer = event.data.payload.buffer;
            setExcelFileName(event.data.payload.wb_name);
            saveAs(new Blob([buffer]), `${event.data.payload.wb_name}`);
        };
        excelWorker.addEventListener("message", workerEvent);
        return () => {
            dispatch(actions.common.closeSnack());
            window.removeEventListener("message", workerEvent);
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (groupedBidItems?.length > 0) {
            const [allFp, ...mappedItems] = groupedBidItems.map(groupedBidItemMapper);

            if (allFp && mappedItems?.length > 0) {
                setRows([allFp, ...mappedItems.sort(sortGroupedBidItems)]);
            } else if (allFp) {
                setRows([allFp]);
            }
        }
        //eslint-disable-next-line
    }, [groupedBidItems]);

    useEffect(() => {
        const onBeforeUnloadAction =
            isEditable && captureEditMode
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
                                  projectId: projectID,
                                  contractorOrgId: organization_id,
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

    useEffect(() => {
        if (currentTab === "wtd_avg") {
            // Url contains org_id and version when tb admin accesses the contractor bidbook
            if (org_id && userRole === "admin") {
                setSearchParams({
                    org_id: org_id,
                    version: version ?? "undefined",
                    isLatest: isLatest ?? false,
                    tab: "wtd_avg",
                });
                localStorage.setItem("contractor_org_id", org_id);
                localStorage.setItem("version", version ?? "");
                localStorage.setItem("isLatest", isLatest ?? false);
            } else setSearchParams({ tab: "wtd_avg" });
        } else {
            // Url contains org_id and version when tb admin accesses the contractor bidbook
            if (org_id && userRole === "admin") {
                setSearchParams({
                    org_id: org_id,
                    version: version ?? "undefined",
                    isLatest: isLatest ?? false,
                    tab: "aggregate",
                });
                localStorage.setItem("contractor_org_id", org_id);
                localStorage.setItem("version", version ?? "");
                localStorage.setItem("isLatest", isLatest ?? false);
            } else setSearchParams({ tab: "aggregate" });
        }
        //eslint-disable-next-line
    }, [currentTab]);

    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (showError) {
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
    }, [showError, snackbar.open]);

    useEffect(() => {
        if (excelFileName) {
            TrackerUtil.event("RFP : Bidbook : Download : Complete Bidbook", {
                eventId: "rfp_bidbook_download_complete_bidbook",
                projectId,
                projectName,
                bidStatus: data?.rfp_bid_details?.status,
                fileName: excelFileName,
            });
        }
        //eslint-disable-next-line
    }, [excelFileName]);

    const commonColumns: Array<GridColDef> = [
        {
            field: "fp_name",
            headerName: projectType?.toLowerCase() === "interior" ? "Floor Plan" : "Area",
            cellClassName: (params: GridCellParams<any, any>) => {
                /* criteria for isModified cell in summary table if all the below condition fulfills
                1. if type of change is not null 
                2. if type of change is created or update but no price filled 
                3. if type of change is deleted but price is filled
                */
                let isModified = checkIfItemIsModified(params?.row?.categories);
                return clsx("modified-common", {
                    negative: !isModified,
                    positive: isModified,
                });
            },
            width: 250,
            resizable: false,
            renderCell(params) {
                let isModified = checkIfItemIsModified(params?.row?.categories);
                return (
                    <Stack direction={"row"}>
                        <Link
                            sx={{
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                            onClick={() => {
                                navigate(params.row?.fp_name, {
                                    state: {
                                        fpIndex: params?.row?.index,
                                        categories: params?.row?.categories,
                                        selectedVersion,
                                        bidResponseItem,
                                        organization_id,
                                        data: params?.row,
                                        index: params?.row?.index,
                                        version,
                                        bidRequestItem: bidRequest,
                                        isLatest: isLatest,
                                    },
                                });
                            }}
                        >
                            <Typography
                                variant="text_14_semibold"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 0.6rem",
                                    whiteSpace: "normal",
                                }}
                                color="#004D71"
                            >
                                {`${
                                    projectType?.toLowerCase() !== "interior" &&
                                    params.row?.fp_name?.toLowerCase() === "all floor plans"
                                        ? "All Areas"
                                        : params.row?.fp_commercial_name ?? params.row?.fp_name
                                }${
                                    params.row?.inventory_name?.length > 0 && inventories.length > 1
                                        ? `: ${params.row?.inventory_name}`
                                        : ""
                                }${
                                    params?.row?.sub_group_name?.length > 0
                                        ? `: ${params.row.sub_group_name}`
                                        : ""
                                } - ${params.row?.total_units ?? 0} units`}
                            </Typography>
                        </Link>

                        {isModified && (
                            <Tooltip title={"Please make revision"}>
                                <ErrorIcon
                                    htmlColor="#D72C0D"
                                    sx={{ marginRight: "10px", padding: "1rem 0.6rem" }}
                                />
                            </Tooltip>
                        )}
                    </Stack>
                );
            },
        },
    ];

    const categoryColumns: Array<GridColDef> = React.useMemo(
        () =>
            categories?.map((category) => {
                return {
                    field: category,
                    width: 200,
                    headerName: category,
                    renderCell(params: GridRenderCellParams) {
                        let catIndex = params.row?.categories?.findIndex(
                            (list: any) => list.category === category,
                        );
                        let isModified = checkIfItemIsModifiedForCategory(
                            catIndex,
                            params.row?.categories,
                        );

                        return (
                            <>
                                {(catIndex !== -1 && params.row?.categories[catIndex]?.category) ===
                                    category &&
                                params.row?.categories[catIndex]?.items?.length > 0 ? (
                                    AddPrice(
                                        params,
                                        navigate,
                                        role!,
                                        userID!,
                                        groupedBidItems,
                                        projectID!,
                                        selectedVersion!,
                                        bidResponseItem!,
                                        bidRequest!,
                                        isModified!,
                                        organization_id!,
                                        // Url contains org_id and version when tb admin accesses the contractor bidbook
                                        org_id ? true : false!,
                                        selectedVersion?.split(" ")?.[1] ?? version,
                                        isLatest,
                                        searchParams.get("tab")!,
                                        isAgreement ?? false,
                                    )
                                ) : (
                                    <NotInScope />
                                )}
                            </>
                        );
                    },
                };
            }),
        //eslint-disable-next-line
        [categories, groupedBidItems, searchParams],
    );
    if (loading || loadingSession || !groupedBidItems || !rows) {
        return (
            <CommonDialog
                open={(loading || loadingSession) ?? false}
                onClose={() => {}}
                loading={loading || loadingSession}
                loaderText={"Please wait. We are loading the bid details..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }

    return (
        <>
            <Grid container direction="column" p="1rem 7.5rem" gap="1.25rem">
                <Grid item>
                    <Stack
                        direction="row"
                        justifyContent={bidResponseItem !== undefined ? "space-between" : "end"}
                    >
                        {bidRequest !== undefined
                            ? bidRequest?.length > 0 && (
                                  <>
                                      <Stack direction={"row"} gap={2}>
                                          <Typography variant="text_26_light">Bid</Typography>
                                          <Autocomplete
                                              sx={{ width: "154px" }}
                                              renderInput={(params) => (
                                                  <TextField {...params} size="small" />
                                              )}
                                              disableClearable
                                              defaultValue={selectedVersion}
                                              //@ts-ignore
                                              options={bidRequest
                                                  ?.filter(
                                                      (item: any) =>
                                                          item.bid_items_status === "completed",
                                                  )
                                                  ?.map((item: any) => {
                                                      return `Version ${item.revision_version}`;
                                                  })}
                                              onChange={(event: any, newValue: any) => {
                                                  //@ts-ignore
                                                  handleSelectedVersion?.(newValue);
                                                  if (localStorage.getItem("role") === "admin") {
                                                      //@ts-ignore
                                                      setSearchParams({
                                                          org_id:
                                                              localStorage.getItem(
                                                                  "contractor_org_id",
                                                              ) ?? undefined,
                                                          version: `${
                                                              newValue.split(" ")[1] ?? undefined
                                                          }`,
                                                          isLatest: `${
                                                              bidRequest[0].revision_version.split(
                                                                  " ",
                                                              )[1] === newValue.split(" ")[1]
                                                          }`,
                                                          tab: searchParams.get("tab") ?? undefined,
                                                      });
                                                  }
                                              }}
                                          />
                                      </Stack>
                                  </>
                              )
                            : null}
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            width="100%"
                        >
                            {!isAgreement && (
                                <BaseToggle
                                    label="Consider all alternates?"
                                    toggleValue={considerAlternates}
                                    onChange={(value) => {
                                        dispatch(
                                            actions.biddingPortal.toggleConsiderAlternates({
                                                value,
                                            }),
                                        );
                                    }}
                                    value={considerAlternates ? "Yes" : "No"}
                                />
                            )}
                            {isAgreement && <AgreementSummary disableSubmit={disableSubmit} />}
                            <ArrowTooltip title="Export Bidbook to Excel" arrow>
                                <IconButton
                                    sx={{
                                        width: "48px",
                                        height: "48px",
                                        top: ".25rem",
                                        bgcolor: "#EEEEEE",
                                        borderRadius: "5px",
                                        marginLeft: "16px",
                                        "&:hover": {
                                            bgcolor: "#909090",
                                        },
                                    }}
                                    onClick={() => {
                                        excelWorker.postMessage({
                                            action: "generate_excel",
                                            payload: {
                                                groupedBidItems: rows.map(groupedBidItemMapper),
                                                GCName,
                                                projectName,
                                                propertyAddress,
                                                projectType,
                                                exportType: "full",
                                                categories,
                                            },
                                        });
                                    }}
                                >
                                    {<FileDownloadIcon htmlColor="black" />}
                                </IconButton>
                            </ArrowTooltip>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item>
                    <BaseTabs
                        currentTab={
                            projectType?.toLowerCase() === "interior" ? currentTab : "aggregate"
                        }
                        onTabChanged={onTabChanged}
                        //@ts-ignore
                        tabList={projectType?.toLowerCase() === "interior" ? tabs : [tabs[1]]}
                        tabColor="#000000"
                        otherStyles={{
                            ".MuiTab-root.MuiButtonBase-root": {
                                padding: 0,
                                margin: 0,
                            },
                            ".MuiTabs-flexContainer": {
                                gap: 4,
                            },
                        }}
                    />
                    <Divider sx={{ margin: 0, padding: 0 }}></Divider>
                </Grid>
                <Grid item xs width="100%">
                    {
                        <BaseDataGridPro
                            hideToolbar
                            columns={[
                                ...commonColumns,
                                ...(currentTab === tabs[0].value
                                    ? wtdAvgColumn(renoUnits, considerAlternates)
                                    : aggregateColumn(considerAlternates)),
                                ...(categoryColumns?.length > 0 ? categoryColumns : []),
                            ]}
                            rows={rows ?? []}
                            initialState={{
                                pinnedColumns: { left: ["fp_name", "wtdAvg", "aggregate"] },
                            }}
                            rowsPerPageOptions={[]}
                            hideFooter={true}
                            getRowId={(row: any) =>
                                `${row?.fp_name}-${row?.inventory_name}-${row?.sub_group_name}`
                            }
                            sx={{
                                "& .MuiDataGrid-columnHeader": {
                                    backgroundColor: "#F0F0F0",
                                },
                                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                    outline: "none",
                                },
                                "&.MuiDataGrid-root .MuiDataGrid-cell": {
                                    padding: "0px",
                                },
                                "& .modified-common.negative": {
                                    backgroundColor: "#F0F0F0",
                                },
                                "& .modified-common.positive": {
                                    backgroundColor: "#FFF5EA",
                                },
                            }}
                        />
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default PriceSummaryTable;
