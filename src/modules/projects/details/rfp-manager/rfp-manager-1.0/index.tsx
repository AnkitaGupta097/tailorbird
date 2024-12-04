import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import BaseButton from "components/button";
import React, { useEffect, useState } from "react";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import BaseChip from "components/chip";
import {
    downloadAsTextFile,
    getBgColor,
    getCustomErrorText,
    getText,
    getTextColor,
} from "modules/rfp-manager/helper";
import ActionMenu from "modules/rfp-manager/project-details/action-menu";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EmailMetaData from "./email-metadata";
import AddContractors from "./add-contractors";
import TopicIcon from "@mui/icons-material/Topic";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import { BidBookActionMenuText, BillingOpportunity } from "modules/rfp-manager/constant";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RfpProjectDialog from "./dialog";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ManageUser from "./manage-user";
import BidBookDialog from "./bid-book-dialog";
import CopyAppendixDialog from "./copy-appendix";
import IconResend from "../../../../../assets/icons/icon_resend.js";
import SendForRevision from "./send-for-revision";
import CommonDialog from "modules/admin-portal/common/dialog";
import { formatDate } from "utils/date-time-convertor";
import BaseTabs from "components/base-tabs";
import { RFP_TABS_1 } from "modules/projects/constant";
import ContractorList from "./tabs/contractor-list";
import UnawardDialog from "./unaward-dialog";
import RevokeDialog from "./revoke-dialog";
import BillingDialog from "./push-to-billing-dialog";
import OpenInNewTabIcon from "../../../../../assets/icons/icon-open-in-new-tab.svg";
import SelectAsFinalist from "components/invite-to-sitewalk";
import SitewalkInviteModal from "components/invite-to-sitewalk/invite-modal";
import SitewalkInviteStatus from "components/invite-to-sitewalk/sitewalk-invite-status";
import { isEmpty } from "lodash";
import LeveledBidSheetsUpload from "../rfp-manager-2.0/tabs/leveled-bisheet-upload";
import ContractUpload from "../rfp-manager-2.0/tabs/contract-upload";

const RfpManager1 = () => {
    // Redux
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const {
        contractorWithUsers,
        allContractors,
        allTbAdmins,
        existingEmailMetadata,
        baselineBidBookUrl,
        loading,
        error,
        errorText,
        loaderState,
        sentForBilling,
        projectDetails,
        loadingBidItemsCompute,
    } = useAppSelector((state) => {
        return {
            contractorWithUsers: projectId
                ? state.rfpProjectManager.details?.[projectId]?.assignedContractorList
                : [],
            allContractors: projectId
                ? state.rfpProjectManager.details?.[projectId]?.ContractorList
                : [],
            allTbAdmins: projectId ? state.rfpProjectManager.details?.[projectId]?.AdminList : [],
            existingEmailMetadata: projectId
                ? state.rfpProjectManager.details?.[projectId]?.emailMetaData
                : {},
            baselineBidBookUrl: projectId
                ? state.rfpProjectManager.details?.[projectId]?.baselineBidBook
                : "",
            loading: projectId ? state.rfpProjectManager.details?.[projectId]?.loading : false,
            error: projectId ? state.rfpProjectManager.details?.[projectId]?.error : false,
            errorText: projectId ? state.rfpProjectManager.details?.[projectId]?.errorText : "",
            loaderState: state.rfpProjectManager?.loaderState,
            sentForBilling: projectId ? !!state.rfpProjectManager?.billing_opportunity_id : false,
            projectDetails: state.projectDetails.data,
            loadingBidItemsCompute: state.rfpProjectManager.loadingComputeBidItems,
        };
    });
    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";
    const [currentTab, setCurrentTab] = useState<string>(RFP_TABS_1?.[0].value);
    const [anchorBidEl, setAnchorBidEl] = React.useState<HTMLButtonElement | null>(null);
    const [emailMetadata, setEmailMetadata] = useState<{
        open: boolean;
        isGenerateCopies: boolean;
    }>({ open: false, isGenerateCopies: false });
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [enableRevision, setEnableRevision] = useState<boolean>(false);

    const [openRevisionModal, setOpenRevisionModal] = useState<boolean>(false);
    const [contractors, setContractors] = useState<any[]>([]);
    const [contractorsList, setContractorsList] = useState<any[]>([]);
    const [allAdmins, setAllAdmins] = useState<{ id: string; name: string; email: string }[]>([]);
    const [addEmailMetadataModal, setAddEmailMetadataModal] = useState<boolean>(false);
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

    const [bidBookWarningModal, setBidBookWarningModal] = useState<boolean>(false);
    const [copyAppendixModal, setCopyAppendixModal] = useState<boolean>(false);
    let [loader, setLoader] = React.useState<{
        open: boolean;
        loaderText: string;
        errorText: string;
        saveText: string;
    }>({ open: false, loaderText: "", errorText: "", saveText: "" });

    const [bidBookActions, setBidBookActions] = useState<string[]>([]);
    const [sitewalkInviteConfig, setSitewalkInviteConfig] = useState(null as any);
    const onTabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleBidAction = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorBidEl(event.currentTarget);
    };

    const checkConditionForBidAction = (contractors: any) => {
        let actions: any = [];
        //Usecase 1: If all pending_invite / not invite
        //This covers folllowing use cases :
        // a. Every contractor is not invited
        // b. Some contractors and not invited and some are declined
        if (
            contractors?.every((contractor: { bid_status: string }) => {
                return (
                    contractor.bid_status === "pending_invite" ||
                    contractor.bid_status === "Not Invited"
                );
            }) ||
            (contractors?.some((contractor: { bid_status: string }) => {
                return (
                    contractor.bid_status === "pending_invite" ||
                    contractor.bid_status === "Not Invited"
                );
            }) &&
                !contractors?.some((contractor: { bid_status: string }) => {
                    return (
                        contractor.bid_status === "sent" ||
                        contractor.bid_status === "pending_submission" ||
                        contractor.bid_status === "Invited" ||
                        contractor.bid_status === "requested_revised_pricing" ||
                        contractor.bid_status === "submitted" ||
                        contractor.bid_status === "awarded"
                    );
                }))
        ) {
            actions = [...actions, "generateBidbook"];
        } else {
            //Usecase 2:
            // 2 a. Generate bidbook copies for New GCs
            // 2 b. Warning to regenerate new copies
            if (
                contractors?.some((contractor: { bid_status: string }) => {
                    return (
                        contractor.bid_status === "pending_invite" ||
                        contractor.bid_status === "Not Invited"
                    );
                })
            ) {
                actions = [...actions, "enableNewGcCopyOption"];
            }

            if (
                contractors?.some((contractor: { bid_status: string }) => {
                    return (
                        contractor.bid_status === "sent" ||
                        contractor.bid_status === "pending_submission" ||
                        contractor.bid_status === "Invited" ||
                        contractor.bid_status === "requested_revised_pricing" ||
                        contractor.bid_status === "submitted" ||
                        contractor.bid_status === "awarded"
                    );
                })
            ) {
                actions = [...actions, "showWarning"];
            }
        }
        setBidBookActions(actions);
    };

    const handleGenerateGcCopies = () => {
        // 1. if everyone not invited – first ask to fill email template and then generate GC copies with status as 'invited'

        // 2. if everyone invited – show warning to type ERASE and then generate GC copies

        //  3. if some invited and some not invited – then two option enabled Generate GC copies or Generate copies (New GCs)

        //  4. copy appendix to GC Folder – show dialog and make API request – atleast one GC invited this is enabled.

        //condition 1

        if (bidBookActions?.includes("generateBidbook")) {
            if (
                existingEmailMetadata?.tailorbird_contact_user_id === undefined ||
                existingEmailMetadata?.tailorbird_contact_user_id === ""
            ) {
                setAddEmailMetadataModal(true);
            } else {
                dispatch(
                    actions.rfpProjectManager.createBidBookStart({
                        project_id: projectId,
                        generate_copies_for_new_gcs: true,
                        regenerate_copies_of_existing_gcs: false,
                    }),
                );
                setLoader({
                    open: true,
                    loaderText: "Generating bidbook copies",
                    errorText: "Generating bidbook copies failed",
                    saveText: "Bidbook copies generated",
                });
            }
        }
        //condition 2 && condition 3
        else if (
            bidBookActions?.includes("showWarning") ||
            bidBookActions?.includes("enableNewGcCopyOption")
        ) {
            setBidBookWarningModal(true);
            setAnchorBidEl(null);
        }
    };

    const handleGenerateNewGcCopies = () => {
        dispatch(
            actions.rfpProjectManager.createBidBookStart({
                project_id: projectId,
                generate_copies_for_new_gcs: true,
                regenerate_copies_of_existing_gcs: false,
            }),
        );
        setLoader({
            open: true,
            loaderText: "Generating bidbook copies for new GCs",
            errorText: "Generating bidbook copies or new GCs failed",
            saveText: "Bidbook copies generated for new GCs",
        });
    };
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

    useEffect(() => {
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

        // getting project files data for leveled bids and contracts if present
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
        return () => {
            dispatch(actions.rfpProjectManager.clearBillingOpportunityId({}));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setAllAdmins(allTbAdmins);
    }, [allTbAdmins]);

    useEffect(() => {
        setContractors(contractorWithUsers);
        checkConditionForBidAction(contractorWithUsers);

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
        let isInvitePending = false;
        let isBidSubmitted = false;
        for (let i = 0; i < contractorWithUsers?.length; i++) {
            if (contractorWithUsers[i].bid_status == "submitted") {
                isBidSubmitted = true;
            }
        }
        setEnableRevision(!isInvitePending && isBidSubmitted);
        let isAwarded = !!contractors?.find(
            (contractor: any) => contractor.bid_status === "awarded",
        );
        setDisableActions(isAwarded || sentForBilling);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractorWithUsers]);

    const checkIfBaselineBidBookExist = () => {
        if (baselineBidBookUrl === undefined || baselineBidBookUrl === "") return false;
        return true;
    };

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
            field: "invited_on",
            headerName: "Invited On",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {params.row.invited_on?.length === 0 || params.row.invited_on === null
                        ? "-"
                        : formatDate(params.row.invited_on)}
                </Typography>
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
                            label={getText(params.row.bid_status)}
                            bgcolor={getBgColor(params.row.bid_status)}
                            textColor={getTextColor(params.row.bid_status)}
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
            field: "bid_version",
            headerName: "Bid Version",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Grid container rowSpacing={2} direction="column" padding={"1rem 0rem"}>
                        {!["Not Invited", "Declined"].includes(params.row.bid_status) && (
                            <Grid item>
                                <Typography variant="text_14_regular">
                                    <Link
                                        href={baselineBidBookUrl}
                                        itemRef="noreferrer"
                                        target="_blank"
                                    >
                                        Current Bidbook
                                        <img
                                            src={OpenInNewTabIcon}
                                            style={{ margin: `0px 0px -2px 8px` }}
                                            alt="open bid version"
                                            title="open bid version"
                                        />
                                    </Link>
                                </Typography>
                            </Grid>
                        )}
                        {params?.row?.bid_versions?.length > 0 &&
                            params?.row?.bid_versions
                                ?.filter(({ exh_c_copy_url }: { exh_c_copy_url: string }) =>
                                    Boolean(exh_c_copy_url),
                                )
                                .map(
                                    (
                                        {
                                            date_created,
                                            exh_c_copy_url,
                                        }: { date_created: string; exh_c_copy_url: string },
                                        index: number,
                                    ) => (
                                        <Grid item key={index}>
                                            <Typography variant="text_14_regular">
                                                <Link
                                                    href={exh_c_copy_url}
                                                    itemRef="noreferrer"
                                                    target="_blank"
                                                >
                                                    {formatDate(date_created)}
                                                    <img
                                                        src={OpenInNewTabIcon}
                                                        style={{ margin: `0px 0px -2px 8px` }}
                                                        alt="open bid version"
                                                        title="open bid version"
                                                    />
                                                </Link>
                                            </Typography>
                                        </Grid>
                                    ),
                                )}
                    </Grid>
                );
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
                                  onPointerEnterCapture={() => {}}
                                  onPointerLeaveCapture={() => {}}
                              />,
                              <GridActionsCellItem
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
                                  onPointerEnterCapture={() => {}}
                                  onPointerLeaveCapture={() => {}}
                              />,
                          ]
                        : []
                    : [
                          <GridActionsCellItem
                              placeholder=""
                              key="resend"
                              label={"Manage Users"}
                              icon={<PeopleAltOutlinedIcon htmlColor="#57B6B2" />}
                              showInMenu
                              onClick={() => {
                                  let row = allUserList.filter(
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
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
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
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                          />,
                          <GridActionsCellItem
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
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                          />,
                          <GridActionsCellItem
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
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
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

    const downloadErrorFile = () => {
        downloadAsTextFile(errorText, `error_${projectId}.txt`);
        setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
        dispatch(
            actions.rfpProjectManager.resetState({
                project_id: projectId,
            }),
        );
    };

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

    return (
        <>
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
                downloadFile={errorText?.length ? downloadErrorFile : null}
            />
            <CommonDialog
                open={loadingBidItemsCompute || false}
                loading={loadingBidItemsCompute}
                loaderText="Creating Billing Opportunity"
                width="40rem"
                minHeight="26rem"
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
                        {!checkIfBaselineBidBookExist() && (
                            <Stack direction={"row"} alignItems="center" spacing={2}>
                                <ErrorOutlineIcon htmlColor="#410099" />
                                <Typography sx={{ color: "#410099" }}>
                                    {
                                        "Bidbook Actions will be enabled after the Baseline Bidbook is created."
                                    }
                                </Typography>
                            </Stack>
                        )}
                        <BaseButton
                            onClick={() => {
                                setEmailMetadata({ open: true, isGenerateCopies: false });
                            }}
                            disabled={disableActions || sentForBilling}
                            label={"Email Template"}
                            style={{ padding: "1rem" }}
                            variant="text_16_semibold"
                            classes={`primary default ${
                                disableActions || sentForBilling ? "disabled" : ""
                            }`}
                            startIcon={<MailOutlineRoundedIcon style={{ marginLeft: 5 }} />}
                        />
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
                        {contractors?.length > 0 && (
                            <>
                                <BaseButton
                                    onClick={handleBidAction}
                                    label={"Bidbook Actions"}
                                    variant="text_16_semibold"
                                    disabled={disableActions || sentForBilling}
                                    classes={
                                        !checkIfBaselineBidBookExist()
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
                                            disabled={!checkIfBaselineBidBookExist() ? true : false}
                                        >
                                            <KeyboardArrowDownIcon htmlColor="#FFF" />
                                        </IconButton>
                                    }
                                />
                                <ActionMenu
                                    anchorEl={anchorBidEl}
                                    setAnchorEl={setAnchorBidEl}
                                    content={
                                        <>
                                            <IconButton
                                                sx={{ padding: 0, justifyContent: "left" }}
                                                onClick={handleGenerateGcCopies}
                                            >
                                                <ContentCopyIcon htmlColor="#57B6B2" />
                                                <Typography
                                                    variant="text_16_semibold"
                                                    sx={{
                                                        color: "#000000",
                                                        marginLeft: "13px",
                                                    }}
                                                >
                                                    {bidBookActions?.includes("showWarning")
                                                        ? BidBookActionMenuText.REGENERATE_COPIES
                                                        : BidBookActionMenuText.GENERATE_COPIES}
                                                </Typography>
                                            </IconButton>
                                            {bidBookActions?.includes("enableNewGcCopyOption") && (
                                                <IconButton
                                                    sx={{ padding: 0, justifyContent: "left" }}
                                                    onClick={handleGenerateNewGcCopies}
                                                >
                                                    <ContentCopyIcon htmlColor="#57B6B2" />
                                                    <Typography
                                                        variant="text_16_semibold"
                                                        sx={{
                                                            color: "#000000",
                                                            marginLeft: "13px",
                                                        }}
                                                    >
                                                        {
                                                            BidBookActionMenuText.GENERATE_COPIES_NEW_GCs
                                                        }
                                                    </Typography>
                                                </IconButton>
                                            )}
                                            {contractors.some(
                                                (contractor) =>
                                                    contractor.bid_status === "sent" ||
                                                    contractor.bid_status ===
                                                        "pending_submission" ||
                                                    contractor.bid_status === "Invited" ||
                                                    contractor.bid_status ===
                                                        "requested_revised_pricing" ||
                                                    contractor.bid_status === "submitted",
                                            ) && (
                                                <IconButton
                                                    sx={{ padding: 0, justifyContent: "left" }}
                                                    onClick={() => {
                                                        setCopyAppendixModal(true);
                                                    }}
                                                >
                                                    <TopicIcon htmlColor="#57B6B2" />
                                                    <Typography
                                                        variant="text_16_semibold"
                                                        sx={{
                                                            color: "#000000",
                                                            marginLeft: "13px",
                                                        }}
                                                    >
                                                        {BidBookActionMenuText.COPY_APPENDIX}
                                                    </Typography>
                                                </IconButton>
                                            )}
                                        </>
                                    }
                                />
                            </>
                        )}
                        {enableRevision && checkIfBaselineBidBookExist() && (
                            <BaseButton
                                onClick={() => {
                                    setOpenRevisionModal(true);
                                }}
                                disabled={disableActions || sentForBilling}
                                style={{ padding: "1rem" }}
                                label={"Send for Revision"}
                                variant="text_16_semibold"
                                classes={`special default ${
                                    sentForBilling || disableActions ? "disabled" : ""
                                }`}
                                startIcon={<IconResend fill="#fff" />}
                            />
                        )}

                        <BaseButton
                            onClick={() => setOpenBillingDialog(true)}
                            disabled={sentForBilling || isEmpty(projectDetails.opportunityId)}
                            label={BillingOpportunity.SEND_FOR_BILLING}
                            style={{ padding: "1rem" }}
                            variant="text_16_semibold"
                            classes={`special default ${
                                sentForBilling || isEmpty(projectDetails.opportunityId)
                                    ? "disabled"
                                    : ""
                            }`}
                            startIcon={
                                <MonetizationOnOutlinedIcon htmlColor="#fff" fontSize="inherit" />
                            }
                        />
                    </Stack>
                </Grid>
                <Grid item md={12} sm={12}>
                    <BaseTabs
                        otherStyles={{ marginLeft: "2rem" }}
                        currentTab={currentTab}
                        onTabChanged={onTabChanged}
                        //@ts-ignore
                        tabList={RFP_TABS_1}
                        tabColor="#004D71"
                    />
                    <Divider sx={{ margin: 0, padding: 0 }}></Divider>
                </Grid>
                <Grid item md={12} sm={12} sx={{ marginLeft: "40px", marginTop: "25px" }}>
                    {currentTab === RFP_TABS_1?.[0].value && (
                        <ContractorList
                            columns={columns}
                            contractors={contractors}
                            setOpenModal={setOpenModal}
                        />
                    )}
                </Grid>
                <Box marginLeft={"2.5rem"}>
                    <LeveledBidSheetsUpload />
                </Box>
                <Box marginLeft={"2.5rem"}>
                    <ContractUpload />
                </Box>
                <EmailMetaData
                    emailMetadata={emailMetadata}
                    setEmailMetadata={setEmailMetadata}
                    allAdmins={allAdmins}
                    existingEmailMetadata={existingEmailMetadata}
                    project_id={projectId}
                    setAddEmailMetadataModal={setAddEmailMetadataModal}
                />
                <AddContractors
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setContractors={setContractors}
                    contractorsList={contractorsList}
                    project_id={projectId}
                />
                <RfpProjectDialog
                    open={addEmailMetadataModal}
                    setOpen={setAddEmailMetadataModal}
                    setEmailMetadata={setEmailMetadata}
                />
                <SendForRevision
                    setLoader={setLoader}
                    contractors={contractors ?? []}
                    openRevisionModal={openRevisionModal}
                    columns={columns.filter((column) => column.field !== "action")}
                    setOpenRevisionModal={setOpenRevisionModal}
                    project_id={projectId}
                    rfp_project_version={rfp_project_version}
                />
                <ManageUser
                    existingContractors={contractors}
                    open={manageUserModal}
                    setOpen={setManagerUserModal}
                    projectId={projectId}
                />
                <BidBookDialog
                    open={bidBookWarningModal}
                    setOpen={setBidBookWarningModal}
                    projectId={projectId}
                    enableNewGcCopyOption={bidBookActions?.includes("enableNewGcCopyOption")}
                />
                <CopyAppendixDialog
                    open={copyAppendixModal}
                    setOpen={setCopyAppendixModal}
                    projectId={projectId}
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
                    opportunityId={projectDetails.opportunityId}
                    onProceed={() => {
                        // dispatch(
                        //     actions.rfpProjectManager.computeBidItemExtendedStart({
                        //         projectId,
                        //         createBillingOpportunity,
                        //     }),
                        // );
                        createBillingOpportunity();
                    }}
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
            </Grid>
        </>
    );
};

export default RfpManager1;
