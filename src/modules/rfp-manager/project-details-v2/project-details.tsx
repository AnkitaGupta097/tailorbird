import PeopleIcon from "@mui/icons-material/People";
import { Box, Chip, CircularProgress, Grid, Link, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { ReactComponent as Thunder } from "../../../assets/icons/thunder.svg";
import BaseButton from "../../../components/button";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import BaseChip from "../../../components/chip";
import {
    BIDS_STATUSES,
    PROJECT_TYPE_BG_COLOR,
    borderColors,
    getChipBackgroundColor,
    getChipLabelColor,
    getFormattedNumber,
} from "../common/constants";
import RequestRevision from "../pricing-summary-table/request-revision";
import DialogBox from "../common/warning-dialog";
import moment from "moment";
import CommonDialog from "modules/admin-portal/common/dialog";
import { graphQLClient } from "utils/gql-client";
import { ACCEPT_OR_DECLINE_BID, GET_BID_REQUEST_BY_ID } from "stores/rfp/projects/project-queries";
import UploadInfoPopup from "./uploadInfoPopup";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ConfirmationModal from "components/confirmation-modal";
interface IDetailsItem {
    projectName: string;
    bidDueDate: string;
    expectedStartDate?: string;
    propertyImgPath: string;
    propertyAddress: string;
    bidPercentage?: number;
    propertyUrl?: string;
    owner: string;
    management: string;
    tb_userEmail: string;
    tb_accountManager: string;
    tb_phoneno: string;
    projectType: string;
    isVeAccepted: boolean;
    totalUnits: number;
    turnRate: number;
    budget: number;
    bidStatus: string;
    bidResponseItem: any[];
    bidRequestItem: any[];
    revisionRequest: any[];
    acceptedRequest: any[];
    initialBidRequest: any[];
    createBidItemsFailed: boolean;
    setCreateBidItemsFailed: React.Dispatch<React.SetStateAction<boolean>>;
    organization_id: string;
    setIsDetailsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    submittedOn?: string;
}

const STD_DATE_FORMAT = "MM/DD/YYYY";

const roundBudgetNumber = (num: number): string =>
    num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const getFormattedDate = (date: string, format?: string): string =>
    moment(date).format(format ?? STD_DATE_FORMAT);

const ProjectsDetail: React.FC<IDetailsItem> = ({
    expectedStartDate,
    projectName,
    projectType,
    bidDueDate,
    bidStatus,
    tb_userEmail,
    tb_accountManager,
    owner,
    management,
    tb_phoneno,
    isVeAccepted,
    propertyAddress,
    propertyUrl,
    propertyImgPath,
    budget,
    totalUnits,
    turnRate,
    bidResponseItem,
    bidRequestItem,
    revisionRequest,
    acceptedRequest,
    initialBidRequest,
    createBidItemsFailed,
    setCreateBidItemsFailed,
    organization_id,
    setIsDetailsCollapsed,
    submittedOn,
}) => {
    const { role, userID, projectId } = useParams();
    //const organization_id = localStorage.getItem("organization_id") ?? "";
    const [submitDialog, setSubmitDialog] = useState<boolean>(false);
    const [displayDeclineModal, setDisplayDeclineModal] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [totalWAVG, setTotalWAVG] = useState<number | string>("To be Computed");
    const [totalProjectCost, setTotalProjectCost] = useState<number | string>("To be Computed");
    const [loadingBidItems, setLoadingBidItems] = useState<boolean>(false);
    const [BidItemsFailed, setBidItemsFailed] = useState<boolean>(false);
    const [IsSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [maxBidders, setMaxBidders] = useState<number>();
    const [availableBiddingSlots, setAvailableBiddingSlots] = useState<number | undefined>(0);
    const [isRestrictedMaxBidders, setIsRestrictedMaxBidders] = useState<boolean | undefined>(
        false,
    );
    const [errorText, setErrorText] = useState<string>();
    const [confirmationOpen, setConfirmationOpen] = useState<boolean>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    //const organization_id = localStorage.getItem("organization_id");
    const {
        projectFiles,
        downloadingFiles,
        categories,
        renoUnits,
        groupedBidItems,
        considerAlternates,
        disableSubmit,
        isEditable,
        isOffline,
        isIdle,
        selectedVersion,
        IsFileLoading,
        projects,
    } = useAppSelector((state) => ({
        projectFiles: state.fileUtility.fileDetails,
        downloadingFiles: state.fileUtility.downloadingFiles,
        categories: state.biddingPortal.categories,
        renoUnits: state.biddingPortal.renoUnits,
        groupedBidItems: state.biddingPortal.groupedBidItems,
        considerAlternates: state.biddingPortal.considerAlternates,
        disableSubmit: state.biddingPortal.disableSubmit,
        isEditable: state.biddingPortal.isEditable,
        isOffline: state.biddingPortal.isOffline,
        isIdle: state.biddingPortal.isIdle,
        selectedVersion: state.biddingPortal.selectedVersion,
        IsFileLoading: state?.fileUtility?.loading,
        projects: state.rfpService.project.projectDetails,
    }));
    useEffect(() => {
        const project = projects.find((eachProject: any) => eachProject?.project_id === projectId);
        setIsSubmitted(project?.bid_status === "submitted" ? true : false);
        setMaxBidders(project?.max_bidders);
        setAvailableBiddingSlots(project?.available_bidding_slots);
        setIsRestrictedMaxBidders(project?.is_restricted_max_bidders);
    }, [projects, projectId]);
    useEffect(() => {
        // Calculations for Project Total Sum & WAVG
        let row = groupedBidItems?.[0];
        let index = renoUnits?.findIndex((item) => item?.fp_name === row?.fp_name);
        let total_fp_units = index > -1 ? renoUnits?.[index]?.total_fp_units : row?.total_units;
        let totalSum = 0;

        if (considerAlternates) {
            row?.categories.every((category) => {
                if (category.totalSum === 0) {
                    totalSum = 0;
                    return false;
                } else {
                    totalSum += category.totalSum;
                    return true;
                }
            });
        } else {
            row?.categories.every((category) => {
                if (category.category === "Alternates") {
                    return true;
                } else if (category.totalSum === 0) {
                    totalSum = 0;
                    return false;
                } else {
                    totalSum += category.totalSum;
                    return true;
                }
            });
        }

        projectType?.toLocaleLowerCase() === "interior" &&
            setTotalWAVG(
                totalSum > 0
                    ? `$${getFormattedNumber(totalSum / total_fp_units)}`
                    : "Not completed",
            );
        setTotalProjectCost(totalSum > 0 ? `$${getFormattedNumber(totalSum)}` : "Not completed");
        //eslint-disable-next-line
    }, [categories, renoUnits, considerAlternates, groupedBidItems, projectType]);

    useEffect(() => {
        if (projectFiles?.length > 0) {
            const latestDate = projectFiles
                .map(({ created_at }: { created_at: string }) => created_at)
                .reduce((latestDate, currentLatestDate) =>
                    new Date(latestDate) > new Date(currentLatestDate)
                        ? latestDate
                        : currentLatestDate,
                );
            setLastUpdated(() => getFormattedDate(latestDate, STD_DATE_FORMAT));
        }
    }, [projectFiles]);

    const handleSubmitBid = (): void => {
        // We will always submit bid on the latest version
        // Latest version comes from last bid request
        let bidRequestId = bidRequestItem?.[bidRequestItem?.length - 1]?.id;
        dispatch(
            actions.rfpService.createBidResponseStart({
                input: {
                    bid_request_id: bidRequestId,
                    submitted_by: userID,
                    is_submitted: true,
                },
                user_id: userID,
                organization_id: organization_id,
                projectId,
            }),
        );
        setSubmitDialog(false);
    };

    const handleAcceptBid = async (isAccepted: boolean) => {
        try {
            setLoadingBidItems(true);
            const response = await graphQLClient.mutate(
                "acceptOrDeclineBid",
                ACCEPT_OR_DECLINE_BID,
                {
                    input: {
                        project_id: projectId,
                        contractor_org_id: organization_id,
                        responded_by: userID,
                        is_accepted: isAccepted,
                    },
                },
            );

            if (response?.status == "failed") {
                setLoadingBidItems(false);
                setErrorText(
                    `All ${maxBidders} bid opportunities have been taken and ${projectName} is no longer accepting additional bids`,
                );
                setBidItemsFailed(true);
                return false;
            }

            let statusInterval = setInterval(async () => {
                let response = await graphQLClient.query(
                    "getBidRequestById",
                    GET_BID_REQUEST_BY_ID,
                    {
                        id: initialBidRequest?.[0]?.id,
                    },
                );
                let status = response?.getBidRequestById?.bid_items_status;
                let reno_version = response?.getBidRequestById?.reno_item_version;
                if (status === "in_progress" || status === "pending") {
                    response = await graphQLClient.query(
                        "getBidRequestById",
                        GET_BID_REQUEST_BY_ID,
                        {
                            id: initialBidRequest?.[0]?.id,
                        },
                    );
                } else if (status === "completed") {
                    dispatch(
                        actions.rfpService.fetchProjectDetailsStart({
                            user_id: userID,
                            organization_id: organization_id,
                        }),
                    );
                    dispatch(
                        actions.biddingPortal.fetchBidItemsStart({
                            projectId: projectId,
                            contractorOrgId: organization_id,
                            renovationVersion: reno_version,
                        }),
                    );
                    dispatch(
                        actions.biddingPortal.fetchHistoricalPricingDataStart({
                            projectId: projectId,
                            contractorOrgId: organization_id,
                            renovationVersion: reno_version,
                        }),
                    );
                    dispatch(
                        actions.biddingPortal.lockProjectForEditingStart({
                            userId: userID,
                            projectId,
                            organization_id: organization_id,
                        }),
                    );
                    dispatch(
                        actions.rfpService.getBidRequestByProjectStart({
                            projectId: projectId,
                            contractorOrgId: organization_id,
                        }),
                    );
                    setLoadingBidItems(false);
                    dispatch(actions.biddingPortal.setSelectedVersion("Version 1"));
                    setCreateBidItemsFailed(false);
                    clearInterval(statusInterval);
                    setIsDetailsCollapsed(true);
                } else if (status === "failed") {
                    clearInterval(statusInterval);
                    setLoadingBidItems(false);
                    setBidItemsFailed(true);
                    setCreateBidItemsFailed(true);
                }
            }, 2000);
        } catch (error) {
            setLoadingBidItems(false);
            setBidItemsFailed(true);
            setErrorText("Create bid items failed");
            console.log(error);
        }
    };

    const handleDeclineBid = () => {
        handleAcceptBid(false);
        navigate(`/rfp/${role}/${userID}/projects/v2`);
        setDisplayDeclineModal(false);
    };
    if (confirmationOpen) {
        return (
            <ConfirmationModal
                open={confirmationOpen}
                text={`By accepting this bid, you are committing to submit the bid by due date ${getFormattedDate(
                    bidDueDate,
                    STD_DATE_FORMAT,
                )}`}
                onProceed={() => {
                    setConfirmationOpen(false);
                    handleAcceptBid(true);
                }}
                onCancel={() => {
                    setConfirmationOpen(false);
                }}
                cancelText="Cancel"
                actionText="Accept & Bid"
                stackWidth="30rem"
            />
        );
    }
    return (
        <>
            <CommonDialog
                open={loadingBidItems || BidItemsFailed}
                onClose={() => {
                    setLoadingBidItems(false);
                    setBidItemsFailed(false);
                }}
                loading={loadingBidItems}
                loaderText={"Please wait. Creating bid items..."}
                width="40rem"
                minHeight="26rem"
                error={BidItemsFailed}
                errorText={errorText}
            />
            <DialogBox
                variant="Submit"
                showDialog={submitDialog}
                setShowDialog={setSubmitDialog}
                handleSave={handleSubmitBid}
            />
            <DialogBox
                variant="Decline"
                showDialog={displayDeclineModal}
                setShowDialog={setDisplayDeclineModal}
                handleSave={handleDeclineBid}
            />
            <Stack sx={{ marginLeft: "7.5rem", marginRight: "7.5rem" }}>
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    mt="4rem"
                >
                    <Grid container>
                        <Grid item justifyContent="space-between">
                            <Stack direction="row" alignItems="center">
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Link
                                        href={`/rfp/${role}/${userID}/projects/v2`}
                                        underline="always"
                                        sx={{
                                            alignItems: "center",
                                            color: "#004D71",
                                            fontFamily: "Roboto",
                                            marginLeft: "0",
                                        }}
                                        onClick={() => {
                                            localStorage.removeItem("version");
                                            localStorage.removeItem("isLatest");
                                        }}
                                    >
                                        <Typography variant="text_16_regular">
                                            Project Dashboard
                                        </Typography>
                                    </Link>
                                </Box>
                                /
                                <Link
                                    href="#"
                                    underline="hover"
                                    sx={{
                                        color: "#757575",
                                        alignItems: "center",
                                        fontFamily: "Roboto",
                                    }}
                                >
                                    {projectName}
                                </Link>
                                <Link
                                    href="#"
                                    underline="hover"
                                    sx={{
                                        color: "#757575",
                                        alignItems: "center",
                                        fontFamily: "Roboto",
                                    }}
                                ></Link>
                                {[
                                    BIDS_STATUSES.SENT,
                                    BIDS_STATUSES.PENDING_INVITE,
                                    BIDS_STATUSES.REQUESTED_REVISED_PRICING,
                                    BIDS_STATUSES.SUBMITTED,
                                    BIDS_STATUSES.ACCEPTED,
                                    BIDS_STATUSES.PENDING_SUBMISSION,
                                ].indexOf(bidStatus) > -1 ? (
                                    <BaseChip
                                        variant="filled"
                                        label={
                                            <Stack direction="row" gap={3} alignItems="center">
                                                {bidStatus === BIDS_STATUSES.SENT ? (
                                                    <Thunder
                                                        width="1rem"
                                                        height="1rem"
                                                        fill={
                                                            getChipLabelColor(
                                                                bidStatus,
                                                                bidDueDate,
                                                            ) ?? "#909090"
                                                        }
                                                    />
                                                ) : null}
                                                <Typography variant="text_14_medium">
                                                    {`Bid ${
                                                        bidStatus === BIDS_STATUSES.SUBMITTED
                                                            ? "Submitted"
                                                            : "Due"
                                                    } ${
                                                        //eslint-disable-next-line
                                                        bidStatus === BIDS_STATUSES.SUBMITTED
                                                            ? submittedOn
                                                                ? getFormattedDate(
                                                                      submittedOn,
                                                                      STD_DATE_FORMAT,
                                                                  )
                                                                : ""
                                                            : bidDueDate
                                                            ? getFormattedDate(
                                                                  bidDueDate,
                                                                  STD_DATE_FORMAT,
                                                              )
                                                            : ""
                                                    }`}
                                                </Typography>
                                            </Stack>
                                        }
                                        bgcolor={
                                            getChipBackgroundColor(
                                                bidStatus,
                                                availableBiddingSlots,
                                                isRestrictedMaxBidders,
                                                bidDueDate,
                                            ) ?? "#909090"
                                            // Fallback to grey if no bid status match
                                        }
                                        textColor={
                                            getChipLabelColor(bidStatus, bidDueDate) ?? "#909090"
                                        }
                                        sx={{
                                            ml: "4rem",
                                        }}
                                    />
                                ) : null}
                                {expectedStartDate && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            borderRadius: "4px",
                                            ml: "16px",
                                            borderColor: "#6A6464",
                                        }}
                                    >
                                        {
                                            <Typography
                                                variant="text_16_regular"
                                                sx={{
                                                    fontSize: "14px",
                                                    lineHeight: "20px",
                                                    color: "#6A6464",
                                                    alignItems: "center",
                                                    fontFamily: "Roboto",
                                                    marginLeft: "16px",
                                                    marginRight: "16px",
                                                }}
                                            >
                                                {`Expected Start Date ${getFormattedDate(
                                                    expectedStartDate,
                                                    STD_DATE_FORMAT,
                                                )}`}
                                            </Typography>
                                        }
                                    </Box>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs>
                            <Stack
                                direction="row"
                                spacing={4}
                                justifyContent="flex-end"
                                alignItems="center"
                            >
                                {bidStatus === BIDS_STATUSES.SENT ||
                                (createBidItemsFailed &&
                                    revisionRequest?.length == 0 &&
                                    acceptedRequest?.length == 0) ? (
                                    <>
                                        <BaseButton
                                            variant="text_16_semibold"
                                            onClick={() => setDisplayDeclineModal(true)}
                                            label="Decline Bid"
                                            classes="decline default"
                                            sx={{
                                                height: "3rem",
                                                mr: "1rem",
                                                fontFamily: "Roboto",
                                            }}
                                        />
                                        <BaseButton
                                            variant="text_16_semibold"
                                            classes="primary default"
                                            onClick={() => {
                                                availableBiddingSlots == 0 && isRestrictedMaxBidders
                                                    ? handleAcceptBid(true)
                                                    : setConfirmationOpen(true);
                                            }}
                                            label={"Accept & Bid"}
                                            sx={{
                                                height: "3rem",
                                                fontFamily: "Roboto",
                                            }}
                                        />
                                    </>
                                ) : null}
                                {(bidStatus === BIDS_STATUSES.REQUESTED_REVISED_PRICING ||
                                    bidStatus === BIDS_STATUSES.PENDING_SUBMISSION ||
                                    bidStatus === BIDS_STATUSES.ACCEPTED) &&
                                !createBidItemsFailed ? (
                                    <>
                                        <BaseButton
                                            acceptOrDeclineBidStart
                                            variant="text_16_semibold"
                                            onClick={() => {
                                                window.location.href = `/rfp/${role}/${userID}/projects/${projectId}/collaborators`;
                                            }}
                                            label="Collaborators"
                                            classes="grey default"
                                            sx={{
                                                height: "3rem",
                                                fontFamily: "Roboto",
                                                mr: "1rem",
                                            }}
                                        >
                                            <PeopleIcon
                                                sx={{
                                                    mr: ".25rem",
                                                }}
                                            />
                                        </BaseButton>
                                        <BaseButton
                                            variant="text_16_semibold"
                                            classes={`special ${
                                                disableSubmit ||
                                                revisionRequest.length > 0 ||
                                                !isEditable ||
                                                isOffline ||
                                                isIdle
                                                    ? "disabled"
                                                    : "default"
                                            }`}
                                            onClick={() => {
                                                setSubmitDialog(true);
                                            }}
                                            label="Submit Bid"
                                            sx={{
                                                height: "3rem",
                                                fontFamily: "Roboto",
                                            }}
                                            disabled={
                                                disableSubmit ||
                                                revisionRequest.length > 0 ||
                                                !isEditable ||
                                                isOffline ||
                                                isIdle
                                            }
                                        />
                                    </>
                                ) : null}
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    sx={{
                        marginTop: "1rem",
                    }}
                >
                    <Box
                        sx={{
                            borderLeft: `1rem solid  ${
                                borderColors[(bidStatus ?? "closed") as keyof typeof borderColors]
                            }`,
                            borderRadius: "8px",
                            height: "160px",
                            width: "160px",
                        }}
                    >
                        <Stack position="relative" direction="row" spacing={2} alignItems="center">
                            <Box
                                component="img"
                                src={propertyImgPath}
                                sx={{
                                    width: "10rem",
                                    height: "10rem",
                                    borderRadius: "0px 8px 8px 0px",
                                    marginLeft: "10px",
                                }}
                            />
                            <Chip
                                label={projectType}
                                style={{
                                    position: "absolute",
                                    right: "3px",
                                    bottom: "5px",
                                }}
                                sx={{
                                    border: "1px solid white",
                                    borderRadius: "4px",
                                    background:
                                        PROJECT_TYPE_BG_COLOR[
                                            projectType as keyof typeof PROJECT_TYPE_BG_COLOR
                                        ] ?? "black",
                                    color: "white",
                                }}
                            />
                        </Stack>
                    </Box>
                    <Grid container>
                        <Grid item xs>
                            <Stack sx={{ marginLeft: "2rem" }}>
                                <Typography variant="text_34_light" color="#232323">
                                    {projectName}
                                </Typography>
                                <Stack sx={{ marginTop: "1.5rem" }}>
                                    {propertyAddress && propertyAddress?.trim() !== "" ? (
                                        <Typography variant="text_14_regular" color="#232323">
                                            {propertyAddress ?? "-"}
                                        </Typography>
                                    ) : null}
                                    {propertyUrl && propertyUrl?.trim() !== "" ? (
                                        <Typography variant="text_14_regular" color="#232323">
                                            {propertyUrl ?? "-"}
                                        </Typography>
                                    ) : null}
                                </Stack>

                                <Stack direction="row" sx={{ marginTop: "1rem" }} spacing={6}>
                                    <Stack direction="column">
                                        {owner && owner?.trim() !== "" ? (
                                            <>
                                                <Chip
                                                    label={owner}
                                                    sx={{
                                                        borderRadius: "4px",
                                                        background: "white",
                                                        color: "#00344D",
                                                        border: "1px solid #00344D",
                                                    }}
                                                />
                                            </>
                                        ) : null}

                                        {management && management?.trim() !== "" ? (
                                            <>
                                                <Typography
                                                    variant="text_12_regular"
                                                    color="#757575"
                                                    margin="11px 0px 0px 0px"
                                                >
                                                    Management
                                                </Typography>
                                                <Typography
                                                    variant="text_14_regular"
                                                    color="#232323"
                                                >
                                                    {management?.length ? management : "-"}
                                                </Typography>
                                            </>
                                        ) : null}
                                    </Stack>

                                    <Stack spacing={2} direction="column">
                                        <Typography variant="text_12_regular" color="#757575">
                                            Tailorbird contact
                                        </Typography>
                                        <Typography variant="text_14_regular" color="#232323">
                                            {tb_accountManager}
                                        </Typography>
                                        {tb_userEmail && tb_userEmail?.trim() === "" ? (
                                            <Typography variant="text_14_regular" color="#232323">
                                                {tb_userEmail}
                                            </Typography>
                                        ) : null}
                                        {tb_phoneno && tb_phoneno?.trim() !== "" ? (
                                            <Typography variant="text_14_regular" color="#232323">
                                                {tb_phoneno?.length ? tb_phoneno : "-"}
                                            </Typography>
                                        ) : null}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs>
                            {isRestrictedMaxBidders && bidStatus === "sent" ? (
                                <Stack
                                    justifyContent={"end"}
                                    direction={"row"}
                                    sx={{ marginTop: "1rem" }}
                                >
                                    <ElectricBoltIcon fontSize="small" sx={{ color: "#00B779" }} />
                                    <Typography variant="text_14_medium" color={"#00B779"}>
                                        {`Accepting ${maxBidders ?? "-"} contractors for bid`}
                                    </Typography>
                                </Stack>
                            ) : (
                                false
                            )}
                            <Stack
                                direction="row"
                                spacing={6}
                                justifyContent="flex-end"
                                alignItems="flex-start"
                                sx={{ marginTop: "2rem" }}
                            >
                                <Stack>
                                    <Typography variant="text_12_regular" color="#916A00">
                                        {"VE accepted?"}
                                    </Typography>
                                    <Typography variant="text_14_regular" color="#232323">
                                        {isVeAccepted ? "Yes" : "No"}
                                    </Typography>
                                </Stack>
                                {projectType?.toLowerCase() === "interior" ? (
                                    <Stack>
                                        <Typography variant="text_12_regular" color="#757575">
                                            {"Total units (expected)"}
                                        </Typography>
                                        <Typography variant="text_14_regular" color="#232323">
                                            {totalUnits}
                                        </Typography>
                                    </Stack>
                                ) : null}
                                {turnRate && projectType?.toLocaleLowerCase() === "interior" ? (
                                    <Stack>
                                        <Typography variant="text_12_regular" color="#757575">
                                            {"Turn rate (expected)"}
                                        </Typography>
                                        <Typography variant="text_14_regular" color="#232323">
                                            {turnRate ? turnRate : "-"}
                                        </Typography>
                                    </Stack>
                                ) : null}
                            </Stack>
                            <Stack
                                justifyContent="flex-start"
                                alignItems="flex-end"
                                sx={{ marginTop: "24px" }}
                            >
                                {bidStatus === BIDS_STATUSES.SENT ? (
                                    <Stack>
                                        <Typography variant="text_12_regular" color="#757575">
                                            {"Budget"}
                                        </Typography>
                                        <Typography variant="text_26_medium">
                                            {budget ? `$${roundBudgetNumber(budget)}` : "-"}
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <Stack direction={"row"} spacing={6}>
                                        <Stack>
                                            <Typography variant="text_12_regular" color="#757575">
                                                {"Total Project Cost"}
                                            </Typography>
                                            <Typography variant="text_26_medium">
                                                {totalProjectCost}
                                            </Typography>
                                        </Stack>
                                        {projectType?.toLocaleLowerCase() === "interior" ? (
                                            <Stack>
                                                <Typography
                                                    variant="text_12_regular"
                                                    color="#757575"
                                                >
                                                    {"Total WAVG"}
                                                </Typography>
                                                <Typography variant="text_26_medium">
                                                    {totalWAVG}
                                                </Typography>
                                            </Stack>
                                        ) : null}
                                    </Stack>
                                )}
                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                spacing={6}
                                sx={{
                                    marginTop: "24px",
                                }}
                            >
                                {lastUpdated && (
                                    <Typography variant="text_14_regular" color="#D72C0D">
                                        {`Updated on ${lastUpdated}`}
                                    </Typography>
                                )}
                                <UploadInfoPopup {...{ IsFileLoading, IsSubmitted }} />
                                <BaseButton
                                    label={
                                        downloadingFiles ? "Downloading" : "Download Project Files"
                                    }
                                    onClick={() => {
                                        const ids = projectFiles.map(
                                            (projectFile: any) => projectFile.id,
                                        );
                                        dispatch(
                                            actions.fileUtility.downloadFilesAndZipStart({
                                                ids,
                                                projectName,
                                            }),
                                        );
                                    }}
                                    sx={{
                                        backgroundColor: downloadingFiles ? "#AFE9D2" : "#909090",
                                        color: "#FFF",
                                        "&:hover": {
                                            backgroundColor: downloadingFiles
                                                ? "#AFE9D2"
                                                : "#909090",
                                            color: "#FFF",
                                        },
                                        width: "15rem",
                                        height: "2.5rem",
                                        display: projectFiles?.length === 0 && "none",
                                    }}
                                >
                                    {downloadingFiles ? (
                                        <CircularProgress
                                            sx={{
                                                mr: ".5rem",
                                            }}
                                            size="1rem"
                                        />
                                    ) : (
                                        <DownloadForOfflineIcon
                                            sx={{
                                                mr: ".5rem",
                                            }}
                                        />
                                    )}
                                </BaseButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
                <Stack gap={4} marginTop="48px">
                    {revisionRequest?.length > 0 && (
                        <>
                            <Grid container direction={"column"} sx={{ marginTop: "54px" }}>
                                <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    {revisionRequest?.length > 1 && (
                                        <Typography
                                            variant="text_16_regular"
                                            sx={{ color: "#916A00" }}
                                        >{`+${
                                            revisionRequest?.length - 1
                                        } Revision Requests`}</Typography>
                                    )}
                                </Grid>
                                <Grid item>
                                    <RequestRevision
                                        selectedVersion={selectedVersion}
                                        bidResponseItem={bidResponseItem}
                                        bidRequestItem={bidRequestItem}
                                        requestRevisions={revisionRequest?.[0]}
                                        projectId={projectId}
                                        organization_id={organization_id}
                                        setLoadingBidItems={setLoadingBidItems}
                                        setBidItemsFailed={setBidItemsFailed}
                                        setCreateBidItemsFailed={setCreateBidItemsFailed}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                    {acceptedRequest?.length > 0 && (
                        <>
                            {acceptedRequest?.map((item, index) => {
                                return (
                                    <RequestRevision
                                        key={index}
                                        selectedVersion={selectedVersion}
                                        bidResponseItem={bidResponseItem}
                                        bidRequestItem={bidRequestItem}
                                        requestRevisions={item}
                                        projectId={projectId}
                                        organization_id={organization_id}
                                        setLoadingBidItems={setLoadingBidItems}
                                        setBidItemsFailed={setBidItemsFailed}
                                        setCreateBidItemsFailed={setCreateBidItemsFailed}
                                    />
                                );
                            })}
                        </>
                    )}
                </Stack>
            </Stack>
        </>
    );
};
export default React.memo(ProjectsDetail);
