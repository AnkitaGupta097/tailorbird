import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import BaseButton from "components/button";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import BaseChip from "components/chip";
import {
    getBgColor2,
    getCustomErrorText,
    getText2,
    getTextColor2,
} from "modules/rfp-manager/helper";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddContractors from "./add-contractors";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useNavigate, useParams } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ManageUser from "./manage-user";
import IconResend from "../../../../../assets/icons/icon_resend.js";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SendForRevision from "./send-for-revision";
import CommonDialog from "modules/admin-portal/common/dialog";
import BaseTabs from "components/base-tabs";
import { RFP_TABS_2 } from "modules/projects/constant";
import ContractorList from "./tabs/contractor-list";
import BidSetup from "./tabs/bid-setup";
import UnawardDialog from "./unaward-dialog";
import RevokeDialog from "./revoke-dialog";
import BillingDialog from "./push-to-billing-dialog";
import Documents from "./tabs/documents";
import BidLeveling from "./tabs/bid-leveling";
import { IFileDetails, IUploadFileDetails } from "stores/projects/file-utility/file-utility-models";
import { isEmpty } from "lodash";
import { BillingOpportunity } from "modules/rfp-manager/constant";
import SitewalkInviteModal from "components/invite-to-sitewalk/invite-modal";
import SelectAsFinalist from "components/invite-to-sitewalk";
import SitewalkInviteStatus from "components/invite-to-sitewalk/sitewalk-invite-status";
import moment from "moment";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ActionMenu from "modules/rfp-manager/project-details/action-menu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UnLockBidBookDialog from "./unlock-bid-book-dialog";
import { graphQLClient } from "utils/gql-client";
import { GET_LATEST_RENOVATION_VERSION } from "../../budgeting/bidbook-v2/actions/mutation-contsants";
import TrackerUtil from "utils/tracker";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { GET_PROJECT_FILES } from "stores/projects/file-utility/file-utility-queries";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CreateNewBidbookDialog from "./create-new-bidbook-dialog";
import { BIDS_STATUSES } from "modules/rfp-manager/common/constants";

const RfpManager2 = () => {
    // Redux
    const { projectId } = useParams();
    const user_id = localStorage.getItem("user_id");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        contractorWithUsers,
        allContractors,
        loading,
        error,
        errorText,
        loaderState,
        uploadedFiles,
        finalistFiles,
        archivedFiles,
        imageFiles,
        isS3Upload,
        files,
        sentForBilling,
        projectDetails,
    } = useAppSelector((state) => {
        return {
            contractorWithUsers: projectId
                ? state.rfpProjectManager.details?.[projectId]?.assignedContractorList
                : [],
            allContractors: projectId
                ? state.rfpProjectManager.details?.[projectId]?.ContractorList
                : [],
            allTbAdmins: projectId ? state.rfpProjectManager.details?.[projectId]?.AdminList : [],
            loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
            error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
            errorText: projectId ? state.rfpProjectManager.details?.[projectId]?.errorText : "",
            loaderState: state.rfpProjectManager?.loaderState,
            sentForBilling: projectId ? !!state.rfpProjectManager?.billing_opportunity_id : false,
            projectDetails: state.projectDetails.data,
            uploadedFiles: state.fileUtility?.uploadDetails,
            isS3Upload: state.fileUtility?.loading,
            files: state.fileUtility?.fileDetails,
            finalistFiles: state.fileUtility?.finalistFiles,
            archivedFiles: state.fileUtility?.archivedFiles,
            imageFiles: state?.fileUtility?.imageFiles,
        };
    });
    const bidLevelingFeatureFlag = useFeature(FeatureFlagConstants.BID_LEVELING).on;
    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";

    const getLatestRenovationVersion = async () => {
        const res = await graphQLClient.query(
            "LatestRenovationVersion",
            GET_LATEST_RENOVATION_VERSION,
            {
                projectId: projectId,
            },
        );
        const renovation_version = res?.latestRenovationVersion?.renovation_version ?? null;
        const created_at = res?.latestRenovationVersion?.created_at;
        setLatestRenovationVersion(renovation_version);
        setVersionSavedOn(created_at);
    };

    const [isBidSetup, setIsBidSetup] = useState<boolean>(false);
    const [latestRenovationVersion, setLatestRenovationVersion] = useState<number>();
    const [versionSavedOn, setVersionSavedOn] = useState<any>();
    const [currentTab, setCurrentTab] = useState<string>(
        RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)?.[0].value,
    );
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openRevisionModal, setOpenRevisionModal] = useState<boolean>(false);
    const [contractors, setContractors] = useState<any[]>([]);
    const [contractorsList, setContractorsList] = useState<any[]>([]);
    const [allUserList, setAllUserList] = useState<any[]>([]);
    const [openRevokeDialog, setOpenRevokeDialog] = useState<boolean>(false);
    const [openBillingDialog, setOpenBillingDialog] = useState<boolean>(false);
    const [openUnawardDialog, setOpenUnawardDialog] = useState<{
        contractorName: string;
        open: boolean;
        contractor_id: string;
    }>({
        contractorName: "",
        open: false,
        contractor_id: "",
    });
    const [manageUserModal, setManagerUserModal] = useState<{
        open: boolean;
        data: any;
        checkedIds: string[];
    }>({
        open: false,
        data: [],
        checkedIds: [],
    });
    const [disableActions, setDisableActions] = useState<boolean>(false);
    let [loader, setLoader] = React.useState<{
        open: boolean;
        loaderText: string;
        errorText: string;
        saveText: string;
    }>({ open: false, loaderText: "", errorText: "", saveText: "" });
    let [unlockBidbook, setUnlockBidbook] = useState<{
        open: boolean;
        contractor_id: string;
        name: string;
    }>({
        open: false,
        contractor_id: "",
        name: "",
    });
    const [filesUploaded, setFilesUploaded] = useState<IUploadFileDetails[]>([]);
    const [rfpFiles, setRfpFiles] = useState<IFileDetails[]>([]);
    const [finalistRfpFiles, setFinalistRfpFiles] = useState<IFileDetails[]>([]);
    const [archivedRfpFiles, setArchivedRfpFiles] = useState<IFileDetails[]>([]);
    const [sitewalkInviteConfig, setSitewalkInviteConfig] = useState(null as any);

    const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
    const [anchorBidEl, setAnchorBidEl] = React.useState<HTMLButtonElement | null>(null);
    const onTabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
    };
    const [allProjectFiles, setAllProjectFiles] = useState<any>();
    const [errorDescription, setErrorDescription] = useState<string>();
    const [snackbarVarient, setSnackbarVarient] = useState<string>("success");
    const [snackbarTitle, setSnackbarTitle] = useState<string>();
    const [maxBidders, setMaxBidders] = useState<number>();
    const [isRestrictedMaxBidders, setIsRestrictedMaxBidders] = useState<boolean>();
    const [CreateNewBidbookDialogState, setCreateNewBidBookDialogState] = useState<{
        open: boolean;
        contractor: any;
    }>({
        open: false,
        contractor: null,
    });

    const createBillingOpportunity = () => {
        setLoader({
            open: true,
            loaderText: BillingOpportunity.BILLING_OPPORTUNITY_LOADER,
            errorText: BillingOpportunity.BILLING_OPPORTUNITY_FAILED,
            saveText: BillingOpportunity.BILLING_OPPORTUNITY_SUCCESS,
        });
        dispatch(
            actions.rfpProjectManager.createBillingOpportunityStart({
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
    };

    // Filter contractors eligible for revised price
    const contractorsForRevisedPrice = () => {
        return (
            contractors?.filter(
                (item) =>
                    item.bid_status !== "declined" &&
                    item.bid_status !== "pending_invite" &&
                    item.bid_status !== "lost_bid" &&
                    item.bid_status !== "Not Invited" &&
                    item.bid_requests?.find(
                        (request: { reno_item_version: number }) =>
                            request?.reno_item_version === latestRenovationVersion,
                    ) === undefined,
            ) ?? []
        );
    };

    useEffect(() => {
        getLatestRenovationVersion();
        dispatch(
            actions.rfpProjectManager.fetchAssignedContractorListStart({
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
        dispatch(
            actions.rfpProjectManager.fetchBillingOpportunityIDStart({
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
        dispatch(
            actions.rfpProjectManager.fetchAllOrganizationsStart({
                project_id: projectId,
            }),
        );
        dispatch(
            actions.rfpProjectManager.fetchAllContractorsStart({
                project_id: projectId,
            }),
        );
        dispatch(
            actions.rfpProjectManager.fetchAllAdminStart({
                project_id: projectId,
            }),
        );
        dispatch(
            actions.rfpProjectManager.fetchEmailMetaDataStart({
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
        dispatch(
            actions.rfpProjectManager.fetchBaselineBidBookStart({
                project_id: projectId,
            }),
        );
        dispatch(
            actions.fileUtility.getProjectFilesStart({
                project_id: projectId,
            }),
        );
        return () => {
            dispatch(actions.rfpProjectManager.clearBillingOpportunityId({}));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setRfpFiles(files);
        setFinalistRfpFiles(finalistFiles);
        setArchivedRfpFiles(archivedFiles);

        if (
            imageFiles?.length &&
            imageFiles?.length > 0 &&
            !isEmpty(projectDetails?.rfp_bid_details?.bid_due_date) &&
            !isEmpty(projectDetails?.rfp_bid_details?.tailorbird_contact_user_id)
        ) {
            setIsBidSetup(true);
        }
    }, [files, finalistFiles, archivedFiles, imageFiles, projectDetails, currentTab]);

    useEffect(() => {
        setFilesUploaded(uploadedFiles);
    }, [uploadedFiles]);

    useEffect(() => {
        setContractors(contractorWithUsers);
        //Set contractor list for adding existing contractors

        //If contractor already mapped to this project don't add it to list
        // else add it to list
        let list: any = [];
        let allUserList: any[] = [];
        allContractors?.map(
            (contractor: {
                roles: string;
                organization: { id: string; name: any };
                id: any;
                name: any;
                email: any;
                status: string;
            }) => {
                //check if organization of contractor already mapped to project
                if (!contractor?.organization?.id) return;
                let index = contractorWithUsers?.findIndex(
                    (item: { organization_id: string }) =>
                        item.organization_id === contractor?.organization?.id,
                );

                let isAdmin = contractor.roles === "CONTRACTOR_ADMIN";

                let lIndex = list?.findIndex(
                    (item: any) => item.organization_id === contractor?.organization?.id,
                );

                let uIndex = allUserList?.findIndex(
                    (item: any) => item.organization_id === contractor?.organization?.id,
                );

                if (
                    index === -1 &&
                    lIndex !== -1 &&
                    contractor?.status?.toLowerCase() !== "deactivated"
                ) {
                    if (isAdmin) {
                        let cAdminList =
                            list[lIndex]?.CONTRACTOR_ADMIN?.length > 0
                                ? list[lIndex]?.CONTRACTOR_ADMIN
                                : [];
                        list[lIndex].CONTRACTOR_ADMIN = [
                            ...cAdminList,
                            {
                                name: contractor.name,
                                id: contractor.id,
                                email: contractor.email,
                            },
                        ];
                    } else {
                        let cEstimatorList =
                            list[lIndex]?.ESTIMATOR?.length > 0 ? list[lIndex]?.ESTIMATOR : [];

                        list[lIndex].ESTIMATOR = [
                            ...cEstimatorList,
                            {
                                name: contractor.name,
                                id: contractor.id,
                                email: contractor.email,
                            },
                        ];
                    }
                }

                if (
                    index === -1 &&
                    lIndex === -1 &&
                    contractor?.status?.toLowerCase() !== "deactivated"
                ) {
                    list = [
                        ...list,
                        {
                            organization_id: contractor?.organization?.id,
                            name: contractor?.organization?.name,
                            bid_status: "",
                            date_updated: "",
                            ...(isAdmin
                                ? {
                                      CONTRACTOR_ADMIN: [
                                          {
                                              name: contractor.name,
                                              id: contractor.id,
                                              email: contractor.email,
                                          },
                                      ],
                                  }
                                : { CONTRACTOR_ADMIN: [] }),
                            ...(!isAdmin
                                ? {
                                      ESTIMATOR: [
                                          {
                                              name: contractor.name,
                                              id: contractor.id,
                                              email: contractor.email,
                                          },
                                      ],
                                  }
                                : { ESTIMATOR: [] }),
                        },
                    ];
                }

                //contractor assigned to project
                if (index !== -1) {
                    if (uIndex === -1) {
                        allUserList = [
                            ...allUserList,
                            {
                                organization_id: contractor?.organization?.id,
                                name: contractor?.organization?.name,
                                bid_status: "",
                                date_updated: "",
                                ...(isAdmin
                                    ? {
                                          CONTRACTOR_ADMIN: [
                                              {
                                                  name: contractor.name,
                                                  id: contractor.id,
                                                  email: contractor.email,
                                              },
                                          ],
                                      }
                                    : { CONTRACTOR_ADMIN: [] }),
                                ...(!isAdmin
                                    ? {
                                          ESTIMATOR: [
                                              {
                                                  name: contractor.name,
                                                  id: contractor.id,
                                                  email: contractor.email,
                                              },
                                          ],
                                      }
                                    : { ESTIMATOR: [] }),
                            },
                        ];
                    } else {
                        if (isAdmin) {
                            let cAdminList =
                                allUserList[uIndex]?.CONTRACTOR_ADMIN?.length > 0
                                    ? allUserList[uIndex]?.CONTRACTOR_ADMIN
                                    : [];
                            allUserList[uIndex].CONTRACTOR_ADMIN = [
                                ...cAdminList,
                                {
                                    name: contractor.name,
                                    id: contractor.id,
                                    email: contractor.email,
                                },
                            ];
                        } else {
                            let cEstimatorList =
                                allUserList[uIndex]?.ESTIMATOR?.length > 0
                                    ? allUserList[uIndex]?.ESTIMATOR
                                    : [];

                            allUserList[uIndex].ESTIMATOR = [
                                ...cEstimatorList,
                                {
                                    name: contractor.name,
                                    id: contractor.id,
                                    email: contractor.email,
                                },
                            ];
                        }
                    }
                }
            },
        );

        allUserList = [...list, ...allUserList];

        setAllUserList(allUserList);
        setContractorsList(list);
        let isAwarded = !!contractors?.find(
            (contractor: any) => contractor.bid_status === "awarded",
        );
        setDisableActions(isAwarded || sentForBilling);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractorWithUsers]);

    const checkIfRenoVersionExist = () => {
        if (!(latestRenovationVersion && latestRenovationVersion >= 0)) return false;
        return true;
    };

    useEffect(() => {
        graphQLClient
            .query("getProjectFiles", GET_PROJECT_FILES, {
                project_id: projectId,
            })
            .then((data: any) => {
                setAllProjectFiles(data?.getProjectFiles);
            })
            .catch((error: any) => {
                console.error(error);
                setAllProjectFiles(undefined);
            });
    }, [projectId]);
    const downloadContractorInfo = (org_id: string) => {
        if (org_id && allProjectFiles) {
            const ids = allProjectFiles?.reduce((ids: any[], file: any) => {
                if (file?.file_type == "CONTRACTOR_COMPANY_DOCS" && file?.tags?.org_id == org_id) {
                    ids.push(file?.id);
                }
                return ids;
            }, []);
            if (ids?.length > 0) {
                dispatch(
                    actions.fileUtility.downloadFilesAndZipStart({
                        ids,
                        projectName: projectDetails?.name,
                    }),
                );
            } else if (ids?.length == 0) {
                setErrorDescription("Company info is not available");
                setSnackbarVarient("warning");
                setSnackbarTitle("info");
            }
        } else {
            setErrorDescription("Server is unable to fetch files.");
            setSnackbarVarient("error");
            setSnackbarTitle("error");
        }
    };
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (errorDescription) {
            enqueueSnackbar("", {
                action: (
                    <BaseSnackbar
                        variant={snackbarVarient}
                        title={snackbarTitle}
                        description={errorDescription}
                    />
                ),
            });
            setTimeout(() => {
                setErrorDescription(undefined);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [errorDescription]);

    const columns = [
        {
            field: "name",
            headerName: "Contractors",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {params.row.name?.length !== 0 ? params.row.name : "-"}
                </Typography>
            ),
        },
        {
            field: "CONTRACTOR_ADMIN",
            headerName: "Contractor Admins",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip
                    title={params.row.CONTRACTOR_ADMIN?.map(
                        (item: { [x: string]: any }) => item["name"],
                    ).join()}
                >
                    <Typography variant="text_14_regular">
                        {params.row.CONTRACTOR_ADMIN?.length === 0
                            ? "-"
                            : params.row.CONTRACTOR_ADMIN?.length > 1
                            ? `${params.row.CONTRACTOR_ADMIN?.[0]?.name},+${
                                  params.row.CONTRACTOR_ADMIN?.length - 1
                              }`
                            : params.row.CONTRACTOR_ADMIN?.[0]?.name}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "ESTIMATOR",
            headerName: "Estimators",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip
                    title={params.row.ESTIMATOR?.map(
                        (item: { [x: string]: any }) => item["name"],
                    ).join()}
                >
                    <Typography variant="text_14_regular">
                        {params.row.ESTIMATOR?.length === 0
                            ? "-"
                            : params.row.ESTIMATOR?.length > 1
                            ? `${params.row.ESTIMATOR[0]?.name},+${
                                  params.row.ESTIMATOR?.length - 1
                              }`
                            : params.row.ESTIMATOR?.[0]?.name}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "bid_status",
            headerName: "Bid Status",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Grid container direction="column">
                    <Grid item xs>
                        <BaseChip
                            variant="filled"
                            label={getText2(params.row.bid_status)}
                            bgcolor={getBgColor2(params.row.bid_status)}
                            textColor={getTextColor2(params.row.bid_status)}
                            sx={{ marginTop: "1rem", marginBottom: "1rem" }}
                        />
                    </Grid>
                    <Grid item xs>
                        <SitewalkInviteStatus
                            projectId={projectId as string}
                            contractorId={params?.row?.organization_id}
                        />
                    </Grid>
                </Grid>
            ),
        },
        {
            field: "sent_version",
            headerName: "Sent Version",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                let versionArr = [...(params?.row?.bid_requests ?? [])];
                versionArr?.sort(
                    (r1: any, r2: any) =>
                        new Date(r1?.created_at)?.getTime() - new Date(r2?.created_at)?.getTime(),
                );

                {
                    return params?.row?.bid_requests?.length > 0 ? (
                        <Stack gap={2} sx={{ padding: "14px" }}>
                            {versionArr.map(
                                (
                                    request: {
                                        created_at: string;
                                        revision_version?: string;
                                        version?: string;
                                    },
                                    index: number,
                                ) => (
                                    <Typography key={index} variant="text_14_regular">
                                        {`Version ${
                                            request?.revision_version ?? request?.version
                                        } (${moment(request?.created_at).format("MM/DD/YYYY")})`}
                                    </Typography>
                                ),
                            )}
                        </Stack>
                    ) : (
                        "-"
                    );
                }
            },
        },
        {
            field: "contractor_info",
            headerName: "Contractor Info",
            headerAlign: "left",
            align: "left",
            flex: 0.7,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Link
                        underline="always"
                        onClick={() => {
                            downloadContractorInfo(params?.row?.organization_id);
                        }}
                        sx={{
                            "&:hover": {
                                cursor: "pointer",
                            },
                        }}
                    >
                        <Typography variant="text_14_regular">{"View"}</Typography>
                    </Link>
                );
            },
        },
        {
            field: "bids",
            headerName: "Bids",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                let responses: Array<any> = params?.row?.bid_requests;
                responses = [...(responses ?? [])];
                responses = responses?.sort(
                    (r1, r2) =>
                        new Date(r1?.created_at)?.getTime() - new Date(r2?.created_at)?.getTime(),
                );
                const contractor_admin = params?.row?.CONTRACTOR_ADMIN?.[0]?.id;
                {
                    return responses?.length > 0 ? (
                        <Grid container rowSpacing={2} direction="column" padding={"1rem 0rem"}>
                            {responses?.map(
                                (
                                    response: {
                                        created_at: string;
                                        version: string;
                                        revision_version: string;
                                    },
                                    index: number,
                                ) => (
                                    <Grid item key={index}>
                                        <Link
                                            onClick={() => {
                                                localStorage.setItem(
                                                    "contractor_org_id",
                                                    params?.row?.organization_id,
                                                );
                                                localStorage.setItem(
                                                    "version",
                                                    index === responses?.length - 1
                                                        ? response?.revision_version ??
                                                              response?.version
                                                        : response?.version ??
                                                              response?.revision_version,
                                                );
                                                localStorage.setItem(
                                                    "isLatest",
                                                    index === responses?.length - 1
                                                        ? "true"
                                                        : "false",
                                                );
                                                window.open(
                                                    `/rfp/contractor_admin/${contractor_admin}/projects/${projectId}/v2?org_id=${
                                                        params?.row?.organization_id
                                                    }&version=${
                                                        index === responses?.length - 1
                                                            ? `${
                                                                  response?.revision_version ??
                                                                  response?.version
                                                              }&isLatest=true`
                                                            : `${
                                                                  response?.version ??
                                                                  response?.revision_version
                                                              }&isLatest=false`
                                                    } `,
                                                    "_blank",
                                                );
                                            }}
                                            sx={{
                                                "&:hover": {
                                                    cursor: "pointer",
                                                },
                                            }}
                                        >
                                            {index === responses?.length - 1 ? (
                                                <Typography
                                                    variant="text_14_regular"
                                                    color="#410099"
                                                >
                                                    {"Current"}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="text_14_regular"
                                                    color="#004D71"
                                                >
                                                    {" "}
                                                    {moment(response?.created_at).format(
                                                        "MM/DD/YYYY",
                                                    )}
                                                </Typography>
                                            )}
                                        </Link>
                                    </Grid>
                                ),
                            )}
                        </Grid>
                    ) : (
                        <Typography variant="text_14_regular">{"-"}</Typography>
                    );
                }
            },
        },
        {
            field: "action",
            headerName: "Action",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
            type: "actions",
            getActions: (rowParams: {
                id: string;
                row: {
                    organization_id: string;
                    bid_status: string;
                    CONTRACTOR_ADMIN: any[];
                    ESTIMATOR: any[];
                    name: string;
                };
            }) => {
                return disableActions
                    ? rowParams.row.bid_status === "awarded" && !sentForBilling
                        ? [
                              <GridActionsCellItem
                                  onPointerEnterCapture={() => {}}
                                  onPointerLeaveCapture={() => {}}
                                  placeholder=""
                                  key="Unaward"
                                  label={"Remove Award"}
                                  hidden={!disableActions}
                                  disabled={!disableActions}
                                  showInMenu
                                  icon={<RemoveCircleOutlineIcon htmlColor="#57B6B2" />}
                                  onClick={() => {
                                      setOpenUnawardDialog({
                                          open: true,
                                          contractor_id: rowParams?.row?.organization_id,
                                          contractorName: rowParams?.row?.name,
                                      });
                                  }}
                              />,
                              <GridActionsCellItem
                                  onPointerEnterCapture={() => {}}
                                  onPointerLeaveCapture={() => {}}
                                  placeholder=""
                                  key="Delete"
                                  label={"Delete"}
                                  icon={<DeleteOutlineOutlinedIcon htmlColor="#57B6B2" />}
                                  showInMenu
                                  onClick={() => {
                                      setOpenUnawardDialog({
                                          open: false,
                                          contractor_id: rowParams?.row?.organization_id,
                                          contractorName: rowParams?.row?.name,
                                      });
                                      setOpenRevokeDialog(true);
                                  }}
                              />,
                          ]
                        : []
                    : [
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              key="resend"
                              label={"Manage Users"}
                              icon={<PeopleAltOutlinedIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  let row = allUserList?.filter(
                                      (user) =>
                                          user?.organization_id === rowParams?.row?.organization_id,
                                  );
                                  let checkedIds: any[] = [];
                                  let addedContractorAdmins = rowParams?.row?.CONTRACTOR_ADMIN;
                                  let addedEstimators = rowParams?.row?.ESTIMATOR;

                                  if (addedContractorAdmins?.length > 0) {
                                      addedContractorAdmins?.forEach((admin) => {
                                          const index = row?.[0]?.CONTRACTOR_ADMIN?.findIndex(
                                              (item: any) => item?.id === admin?.id,
                                          );
                                          if (index !== -1)
                                              row[0].CONTRACTOR_ADMIN[index].selected = true;
                                          checkedIds.push(admin?.id);
                                      });
                                  }

                                  if (addedEstimators?.length > 0) {
                                      addedEstimators?.forEach((admin) => {
                                          const index = row?.[0]?.ESTIMATOR?.findIndex(
                                              (item: any) => item?.id === admin?.id,
                                          );
                                          if (index !== -1) {
                                              row[0].ESTIMATOR[index].selected = true;
                                              checkedIds.push(admin?.id);
                                          }
                                      });
                                  }

                                  setManagerUserModal({
                                      open: true,
                                      data: row,
                                      checkedIds: checkedIds,
                                  });
                              }}
                          />,
                          <SelectAsFinalist
                              key={"Select As Finalist"}
                              showInMenu={true}
                              projectId={projectId as string}
                              contractorId={rowParams?.row?.organization_id}
                              contractorName={rowParams?.row?.name}
                              onSiteWalkInvite={(config: any) => {
                                  setSitewalkInviteConfig(config);
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              disabled={
                                  [
                                      BIDS_STATUSES.ACCEPTED,
                                      BIDS_STATUSES.SUBMITTED,
                                      BIDS_STATUSES.PENDING_SUBMISSION,
                                  ].indexOf(rowParams?.row?.bid_status) == -1 ||
                                  !isBidSetup ||
                                  !checkIfRenoVersionExist() ||
                                  rowParams.row?.bid_status === "declined"
                              }
                              key="generate-new-bidbook"
                              label={`New Bidbook Copy`}
                              icon={<FileCopyIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  setCreateNewBidBookDialogState({
                                      open: true,
                                      contractor: rowParams.row,
                                  });
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              disabled={
                                  (rowParams?.row?.bid_status !== "pending_invite" &&
                                      rowParams?.row?.bid_status !== "Not Invited") ||
                                  !isBidSetup ||
                                  !checkIfRenoVersionExist()
                              }
                              key="invite"
                              label={"Invite to Bid"}
                              icon={<AssignmentIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  //MIXPANEL : project published
                                  TrackerUtil.event("PROJECT : Project Published", {
                                      eventId: "project_project_published",
                                      projectId: projectDetails?.project_id,
                                      projectName: projectDetails?.project_name,
                                      bidStatus: projectDetails?.bid_status,
                                      isProjectPublished: true,
                                  });
                                  let org_id = [];
                                  org_id?.push(rowParams?.row?.organization_id);
                                  handleInviteToBid(org_id);
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              disabled={
                                  rowParams?.row?.bid_status === "declined" ||
                                  rowParams?.row?.bid_status === "awarded"
                              }
                              key="edit"
                              label={"Declined by contractors"}
                              icon={<CloseOutlinedIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  setLoader({
                                      open: true,
                                      loaderText: "Contractor is being declined",
                                      errorText: "changes not successful",
                                      saveText: "contractor declined",
                                  });
                                  dispatch(
                                      actions.rfpProjectManager.updateBidStatusStart({
                                          organization_id: rowParams?.row?.organization_id,
                                          project_id: projectId,
                                          status: "declined",
                                          rfp_project_version: rfp_project_version,
                                      }),
                                  );
                                  return () => {
                                      dispatch(
                                          actions.rfpProjectManager.fetchAssignedContractorListStart(
                                              {
                                                  project_id: projectId,
                                                  rfp_project_version: rfp_project_version,
                                              },
                                          ),
                                      );
                                  };
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              disabled={rowParams?.row?.bid_status !== "submitted" || !isBidSetup}
                              key="lost bid"
                              label={"Lost Bid"}
                              icon={<ThumbDownIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  setLoader({
                                      open: true,
                                      loaderText: "Contractor is being marked as lost bid.",
                                      errorText: "changes not successful",
                                      saveText: "contractor marked to lost bid successfully. ",
                                  });
                                  dispatch(
                                      actions.rfpProjectManager.updateBidStatusStart({
                                          organization_id: rowParams?.row?.organization_id,
                                          project_id: projectId,
                                          status: "lost_bid",
                                          rfp_project_version: rfp_project_version,
                                      }),
                                  );
                                  return () => {
                                      dispatch(
                                          actions.rfpProjectManager.fetchAssignedContractorListStart(
                                              {
                                                  project_id: projectId,
                                                  rfp_project_version: rfp_project_version,
                                              },
                                          ),
                                      );
                                  };
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              disabled={rowParams?.row?.bid_status !== "submitted" || !isBidSetup}
                              key="unlock bidbook"
                              label={"Unlock Bidbook"}
                              icon={<LockOpenIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  setUnlockBidbook({
                                      open: true,
                                      contractor_id: rowParams?.row?.organization_id,
                                      name: rowParams?.row?.name,
                                  });
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              disabled={rowParams?.row?.bid_status !== "submitted"}
                              key="Award"
                              label={"Award Project"}
                              icon={<WorkspacePremiumOutlinedIcon htmlColor="#57B6B2" />}
                              //label={menuOptions.DELETE}
                              showInMenu
                              onClick={() => {
                                  dispatch(
                                      actions.rfpProjectManager.updateBidStatusStart({
                                          organization_id: rowParams?.row?.organization_id,
                                          project_id: projectId,
                                          status: "awarded",
                                          rfp_project_version: rfp_project_version,
                                      }),
                                  );
                                  setLoader({
                                      open: true,
                                      loaderText: "Contractor is being awarded",
                                      errorText: "Changes not successful",
                                      saveText: "Contractor awarded",
                                  });
                              }}
                          />,
                          <GridActionsCellItem
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                              placeholder=""
                              key="Delete"
                              label={"Delete"}
                              icon={<DeleteOutlineOutlinedIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  dispatch(
                                      actions.rfpProjectManager.removeOrganizationFromProjectStart({
                                          organization_id: rowParams?.row?.organization_id,
                                          project_id: projectId,
                                          rfp_project_version: rfp_project_version,
                                      }),
                                  );
                                  setLoader({
                                      open: true,
                                      loaderText: "Contractor is being removed",
                                      errorText: "Changes not successful",
                                      saveText: "Contractor removed",
                                  });
                              }}
                          />,
                      ];
            },
        },
    ];
    useEffect(() => {
        if ((!loading || error) && !errorText?.length) {
            setTimeout(() => {
                setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                setTimeout(() => {
                    dispatch(
                        actions.rfpProjectManager.resetState({
                            project_id: projectId,
                        }),
                    );
                }, 200);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error, errorText]);

    useEffect(() => {
        if (loaderState.open) {
            if (!loading) {
                if (loaderState.errorText) {
                    setLoader({
                        open: true,
                        loaderText: "",
                        errorText: loaderState.errorText,
                        saveText: "",
                    });
                }
                setTimeout(() => {
                    setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                    setTimeout(() => {
                        dispatch(
                            actions.rfpProjectManager.resetState({
                                project_id: projectId,
                            }),
                        );
                    }, 200);
                }, 2000);
            }
        }
        //eslint-disable-next-line
    }, [loaderState, loading]);

    const resetStoreState = () => {
        if (!loading) {
            setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
            dispatch(
                actions.rfpProjectManager.resetState({
                    project_id: projectId,
                }),
            );
        }
    };

    const handleInviteToBid = (org_id: string[] = []) => {
        let filteredContractors: any[] = [];
        if (org_id?.length === 0) {
            //Remove contractor from selected contractors before inviting if status is anything other than not invited
            selectedContractors?.map((selected) => {
                let found = contractors?.find(
                    (contractor) => contractor?.organization_id === selected,
                );
                if (found?.bid_status === "Not Invited" || found?.bid_status === "pending_invite") {
                    filteredContractors?.push(selected);
                }
            });
        }
        dispatch(
            actions.rfpProjectManager.createBidRequestStart({
                input: {
                    project_id: projectId,
                    contractor_org_ids: org_id?.length > 0 ? org_id : filteredContractors,
                    created_by: user_id,
                    reno_item_version: latestRenovationVersion ?? 1,
                    description: "",
                    type: "bid_request",
                },
                project_id: projectId,
                rfpProjectVersion: "2.0",
            }),
        );
    };

    // const handleBidAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorBidEl(event.currentTarget);
    // };

    return (
        <Box sx={{ background: "#fff" }}>
            <CommonDialog
                open={loader.open}
                onClose={resetStoreState}
                loading={loading}
                //@ts-ignore
                error={error}
                loaderText={loader.loaderText}
                errorText={errorText?.length ? getCustomErrorText(errorText) : loader.errorText}
                saved={!loading && !error}
                savedText={loader.saveText}
                width="40rem"
                minHeight="26rem"
                errorName={errorText?.length ? "Baseline bidbook error:" : false}
            />
            {sentForBilling && (
                <Typography
                    variant="text_16_regular"
                    color="#916A00"
                    display="block"
                    textAlign="center"
                    bgcolor="#FFD79D"
                    padding=".5rem 0rem"
                >
                    This project has been sent for billing. All edit actions have been disabled.
                </Typography>
            )}
            <Grid container sx={{ paddingRight: "2.4rem" }} flexDirection="column">
                <Grid item md={12} sm={12}>
                    <Stack
                        direction={"row"}
                        justifyContent="flex-end"
                        spacing={3}
                        paddingTop={"1rem"}
                    >
                        {!checkIfRenoVersionExist() && (
                            <Stack direction={"row"} alignItems="center" spacing={2}>
                                <ErrorOutlineOutlined htmlColor="#410099" />
                                <Typography sx={{ color: "#410099" }}>
                                    {
                                        "Bidbook Actions will be enabled after the Baseline Bidbook is created."
                                    }
                                </Typography>
                            </Stack>
                        )}

                        <BaseButton
                            onClick={() => {
                                setOpenModal(true);
                            }}
                            label={"Contractors"}
                            disabled={disableActions || sentForBilling}
                            style={{ padding: "1rem" }}
                            variant="text_16_semibold"
                            classes={`primary default ${
                                disableActions || sentForBilling ? "disabled" : ""
                            }`}
                            startIcon={<AddIcon style={{ marginLeft: 5 }} />}
                        />
                        {/* <BaseButton
                            onClick={() => {
                                navigate(
                                    `/admin-projects/${projectId}/rfp_manager?tab=bid_leveling`,
                                );
                            }}
                            classes={`special default  ${
                                disableActions ||
                                !contractors?.some((cs) => cs?.bid_status === "submitted")
                                    ? "disabled"
                                    : ""
                            }`}
                            variant="text_16_semibold"
                            label="View Leveling Sheet"
                            style={{ padding: "1rem" }}
                            disabled={!contractors?.some((cs) => cs?.bid_status === "submitted")}
                            startIcon={<VisibilityIcon htmlColor="#FFF" />}
                        /> */}
                        {/* {selectedContractors?.length > 0 && (
                            <BaseButton
                                onClick={handleBidAction}
                                label={"Bidbook Actions"}
                                variant="text_16_semibold"
                                disabled={disableActions || sentForBilling}
                                classes={
                                    !checkIfRenoVersionExist()
                                        ? `special disabled ${
                                              disableActions || sentForBilling ? "disabled" : ""
                                          }`
                                        : `special default ${
                                              disableActions || sentForBilling ? "disabled" : ""
                                          }`
                                }
                                endIcon={
                                    <IconButton
                                        onClick={() => {}}
                                        disabled={!checkIfRenoVersionExist() ? true : false}
                                    >
                                        <KeyboardArrowDownIcon htmlColor="#FFF" />
                                    </IconButton>
                                }
                            />
                        )} */}
                        <ActionMenu
                            anchorEl={anchorBidEl}
                            setAnchorEl={setAnchorBidEl}
                            content={
                                <>
                                    <IconButton
                                        sx={{ padding: 0, justifyContent: "left" }}
                                        onClick={() => {
                                            handleInviteToBid();
                                            setAnchorBidEl(null);
                                        }}
                                    >
                                        <AssignmentIcon htmlColor="#5C5F62" />
                                        <Typography
                                            variant="text_16_regular"
                                            sx={{
                                                color: "#000000",
                                                marginLeft: "13px",
                                            }}
                                        >
                                            {"Invite to Bid"}
                                        </Typography>
                                    </IconButton>
                                    <IconButton
                                        sx={{
                                            padding: 0,
                                            justifyContent: "left",
                                            display: "none",
                                        }}
                                        onClick={() => {
                                            navigate(
                                                `/admin-projects/${projectId}/rfp_manager/bid_leveling`,
                                            );
                                        }}
                                    >
                                        <VisibilityIcon htmlColor="#5C5F62" />
                                        <Typography
                                            variant="text_16_regular"
                                            sx={{
                                                color: "#000000",
                                                marginLeft: "13px",
                                            }}
                                        >
                                            {"View Levelling Sheet"}
                                        </Typography>
                                    </IconButton>
                                </>
                            }
                        />
                        {checkIfRenoVersionExist() && (
                            <BaseButton
                                onClick={() => {
                                    setOpenRevisionModal(true);
                                }}
                                disabled={
                                    disableActions ||
                                    sentForBilling ||
                                    contractorsForRevisedPrice()?.length === 0
                                }
                                style={{ padding: "1rem" }}
                                label={"Send for Revision"}
                                variant="text_16_semibold"
                                classes={`special default ${
                                    sentForBilling ||
                                    disableActions ||
                                    contractorsForRevisedPrice()?.length === 0
                                        ? "disabled"
                                        : ""
                                }`}
                                startIcon={<IconResend fill="#fff" />}
                            />
                        )}
                        {contractors?.length > 0 &&
                        contractors?.some((cs) => cs.bid_status == "awarded") ? (
                            <BaseButton
                                onClick={() => setOpenBillingDialog(true)}
                                disabled={sentForBilling}
                                label={BillingOpportunity.SEND_FOR_BILLING}
                                style={{ padding: "1rem" }}
                                variant="text_16_semibold"
                                classes={`special default ${sentForBilling ? "disabled" : ""}`}
                                startIcon={
                                    <MonetizationOnOutlinedIcon
                                        htmlColor="#fff"
                                        fontSize="inherit"
                                    />
                                }
                            />
                        ) : null}
                    </Stack>
                </Grid>
                <Grid item md={12} sm={12}>
                    <BaseTabs
                        otherStyles={{ marginLeft: "2rem" }}
                        currentTab={currentTab}
                        onTabChanged={onTabChanged}
                        //@ts-ignore
                        tabList={RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)}
                        tabColor="#004D71"
                    />
                    <Divider sx={{ marginLeft: "1.6rem", padding: 0 }}></Divider>
                </Grid>
                {!isBidSetup &&
                    currentTab === RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)?.[0].value && (
                        <Grid item md={12} sm={12}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                p="6px 12px 6px 12px"
                                sx={{
                                    backgroundColor: "#A4E8F2",
                                    marginLeft: "40px",
                                    marginTop: "16px",
                                }}
                                gap={2}
                            >
                                <ErrorIcon htmlColor="#1F7A76" />
                                <Typography variant="text_14_medium" sx={{ color: "#1F7A76" }}>
                                    {
                                        "Please complete the Bid Setup to invite contractors for bidding."
                                    }
                                </Typography>
                            </Stack>
                        </Grid>
                    )}
                <Grid item md={12} sm={12} sx={{ marginLeft: "40px", marginTop: "16px" }}>
                    {currentTab === RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)?.[0].value && (
                        <ContractorList
                            columns={columns}
                            contractors={contractors}
                            setOpenModal={setOpenModal}
                            setSelectedContractors={setSelectedContractors}
                            isBidSetup={isBidSetup}
                            projectDetails={projectDetails}
                            latestRenovationVersion={latestRenovationVersion ?? 0}
                            versionSavedOn={versionSavedOn}
                            getMaxBidders={setMaxBidders}
                            getIsRestrictedMaxBidders={setIsRestrictedMaxBidders}
                        />
                    )}
                    {currentTab === RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)?.[1].value && (
                        <BidSetup setIsBidSetup={setIsBidSetup} />
                    )}
                    {currentTab === RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)?.[2].value && (
                        <Documents
                            contractors={contractors}
                            uploadedFiles={filesUploaded}
                            isS3Upload={isS3Upload}
                            rfpFiles={rfpFiles}
                            finalistFiles={finalistRfpFiles}
                            archivedFiles={archivedRfpFiles}
                        />
                    )}
                    {bidLevelingFeatureFlag &&
                        currentTab ===
                            RFP_TABS_2(isBidSetup, bidLevelingFeatureFlag)?.[3].value && (
                            <BidLeveling />
                        )}
                </Grid>
                <AddContractors
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setContractors={setContractors}
                    contractorsList={contractorsList}
                    project_id={projectId}
                    contractors={contractors}
                    maxBidders={maxBidders}
                    isRestrictedMaxBidders={isRestrictedMaxBidders}
                />
                <SendForRevision
                    contractors={contractorsForRevisedPrice()}
                    openRevisionModal={openRevisionModal}
                    columns={columns?.filter((column) => column.field !== "action")}
                    setOpenRevisionModal={setOpenRevisionModal}
                    project_id={projectId}
                    latestRenovationVersion={latestRenovationVersion ?? 0}
                    rfpProjectVersion={rfp_project_version}
                />
                <ManageUser
                    existingContractors={contractors}
                    open={manageUserModal}
                    setOpen={setManagerUserModal}
                    projectId={projectId}
                />
                <CreateNewBidbookDialog
                    open={CreateNewBidbookDialogState.open}
                    contractor={CreateNewBidbookDialogState.contractor}
                    onClose={() => {
                        setCreateNewBidBookDialogState({ open: false, contractor: null });
                    }}
                />
                <UnawardDialog
                    contractorName={openUnawardDialog.contractorName}
                    open={openUnawardDialog.open}
                    projectId={projectId!}
                    setOpen={(close: boolean) => {
                        setOpenUnawardDialog({
                            open: close,
                            contractorName: "",
                            contractor_id: "",
                        });
                    }}
                    onProceed={() => {
                        if (openUnawardDialog.contractor_id !== "")
                            dispatch(
                                actions.rfpProjectManager.updateBidStatusStart({
                                    organization_id: openUnawardDialog.contractor_id,
                                    project_id: projectId,
                                    status: "submitted",
                                    rfp_project_version: rfp_project_version,
                                }),
                            );
                    }}
                />
                <RevokeDialog
                    open={openRevokeDialog}
                    onClose={() => {
                        setOpenRevokeDialog(false);
                        setOpenUnawardDialog({
                            open: false,
                            contractor_id: "",
                            contractorName: "",
                        });
                    }}
                    onRevoke={() => {
                        setOpenRevokeDialog(false);
                        setOpenUnawardDialog((prev) => ({ ...prev, open: true }));
                    }}
                />
                <BillingDialog
                    open={openBillingDialog}
                    setOpen={() => {
                        setOpenBillingDialog(false);
                    }}
                    contractorName={
                        contractors?.find((contractor) => contractor.bid_status === "awarded")?.name
                    }
                    onProceed={createBillingOpportunity}
                />
                {sitewalkInviteConfig && (
                    <SitewalkInviteModal
                        {...sitewalkInviteConfig}
                        onInvite={() => {
                            setSitewalkInviteConfig(null);
                        }}
                        onClose={() => {
                            setSitewalkInviteConfig(null);
                        }}
                    />
                )}
                <UnLockBidBookDialog
                    open={unlockBidbook?.open}
                    setOpen={setUnlockBidbook}
                    projectId={projectId}
                    organization_id={unlockBidbook.contractor_id}
                    contractor_name={unlockBidbook.name}
                />
            </Grid>
        </Box>
    );
};

export default RfpManager2;
