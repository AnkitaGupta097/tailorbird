import { useFeature } from "@growthbook/growthbook-react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LockIcon from "@mui/icons-material/Lock";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { Grid, Stack, Typography } from "@mui/material";
import BaseButton from "components/button";
import BiddingStatusCard from "components/cards/bid-status-card";
import ProjectDetailsCard from "components/cards/details-card";
import CommonDialog from "modules/admin-portal/common/dialog";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { FeatureFlagConstants } from "utils/constants";
//@ts-ignore
import propertyPlaceHolderImg from "../../../assets/icons/property-placeholder.jpg";
import {
    BIDS_STATUSES,
    PROJECT_TYPE_BG_COLOR,
    borderColors,
    getChipBackgroundColor,
    getChipLabel,
    getChipLabelColor,
} from "../common/constants";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import EmptyState from "../empty-state";
import { EmptyTexts } from "../constant";

const commonCardStyle = {
    maxWidth: "20rem",
    maxHeight: "6.5rem",
    width: "100%",
    padding: "0.75rem 0.75rem",
};

const ALL_BID_STATUSES = [
    {
        status: "sent",
        title: "New bid opportunities",
        icon: <ElectricBoltIcon fontSize="large" />,
        cardStyles: {
            backgroundColor: "orange",
            ...commonCardStyle,
        },
    },
    {
        status: "pending_submission",
        title: "Open bids",
        icon: <NoteAltIcon fontSize="large" />,
        cardStyles: {
            color: "white",
            backgroundColor: "#004D71",
            ...commonCardStyle,
        },
    },
    {
        status: "submitted",
        title: "Submitted bids",
        icon: <CheckCircleIcon htmlColor="#000" fontSize="large" />,
        cardStyles: {
            backgroundColor: "#36D6CF",
            color: "black",
            ...commonCardStyle,
        },
    },
    {
        status: "closed",
        title: "Won/Closed bids",
        icon: <LockIcon htmlColor="#FFF" fontSize="large" />,
        cardStyles: {
            backgroundColor: "#410099",
            color: "white",
            ...commonCardStyle,
        },
    },
];

const ProjectsDashboard = () => {
    const { role, userID } = useParams();
    const organization_id = localStorage.getItem("organization_id");
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { projects, imageFiles, loading, isEditable, currentEditingUser, snackbar } =
        useAppSelector((state) => {
            return {
                projects: state.rfpService.project.projectDetails,
                imageFiles: state?.fileUtility?.imageFiles,
                loading: state.rfpService.project.loadingProject,
                isEditable: state.biddingPortal.isEditable,
                currentEditingUser: state.biddingPortal.currentEditingUser,
                snackbar: state.common.snackbar,
            };
        });
    const [selectedStatus, setSelectedStatus] = useState<Array<String>>([]);
    const [projectsToShow, setProjectsToShow] = useState<Array<any>>([]);
    const [projectCoverPhotos, setProjectCoverPhotos] = useState<any[]>([]);

    const navigate = useNavigate();
    const is_rfp_bidding_portal = useFeature(FeatureFlagConstants.RFP_2_BIDDING_PORTAL).on;
    //TODO: Remove this once we've moved this to main page
    if (!is_rfp_bidding_portal) {
        navigate("/");
    }

    const projectCounts = React.useMemo(() => {
        let invitedCount = 0,
            acceptedCount = 0,
            submittedCount = 0,
            wonClosedCount = 0;
        projects?.forEach(
            ({
                bid_status,
                available_bidding_slots,
                is_restricted_max_bidders,
            }: {
                bid_status: string;
                available_bidding_slots: number | undefined;
                is_restricted_max_bidders: boolean | undefined;
                rfp_bid_details?: any;
            }) => {
                if (
                    [
                        BIDS_STATUSES.WON,
                        BIDS_STATUSES.CLOSED,
                        BIDS_STATUSES.AWARDED,
                        BIDS_STATUSES.LOST_BID,
                    ].includes(bid_status) ||
                    (bid_status === BIDS_STATUSES.SENT &&
                        is_restricted_max_bidders &&
                        available_bidding_slots == 0)
                ) {
                    wonClosedCount++;
                } else if (bid_status === BIDS_STATUSES.SENT) {
                    invitedCount++;
                } else if (bid_status === BIDS_STATUSES.SUBMITTED) {
                    submittedCount++;
                } else if (bid_status !== BIDS_STATUSES.NO_RESPONSE) {
                    acceptedCount++;
                }
            },
        );
        return {
            sent: invitedCount,
            pending_submission: acceptedCount,
            submitted: submittedCount,
            closed: wonClosedCount,
        };
    }, [projects]);

    useEffect(() => {
        dispatch(actions.biddingPortal.resetBidItems({}));
        if (!projects || projects?.length === 0)
            dispatch(
                actions.rfpService.fetchProjectDetailsStart({
                    user_id: userID,
                    organization_id: "",
                }),
            );
        if (isEditable && currentEditingUser) {
            dispatch(
                actions.biddingPortal.unlockProjectForEditingStart({
                    projectId: currentEditingUser?.projectId,
                    organization_id: organization_id,
                }),
            );
        }
        dispatch(actions.biddingPortal.setSelectedVersion(""));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setSelectedStatus([]);
        setProjectsToShow(projects);
    }, [projects]);

    useEffect(() => {
        if (projectsToShow?.length > 0) {
            projectsToShow?.forEach((project: any) => {
                dispatch(
                    actions.fileUtility.getProjectFilesStart({
                        project_id: project?.project_id,
                    }),
                );
            });
        }
        //eslint-disable-next-line
    }, [projectsToShow]);

    useEffect(() => {
        const coverImg = imageFiles?.find((image) => image?.tags?.is_cover_image);

        if (coverImg) {
            const projectId = coverImg?.tags?.projectId;
            setProjectCoverPhotos({
                ...projectCoverPhotos,
                [projectId]: coverImg?.cdn_path?.find((path: string) =>
                    path?.toLowerCase()?.includes("autox300"),
                ),
            });
        }
        //eslint-disable-next-line
    }, [imageFiles]);

    useEffect(() => {
        snackbar.open &&
            enqueueSnackbar("", {
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="Error"
                        description="Failed to fetch Projects"
                    />
                ),
            });
        //eslint-disable-next-line
    }, [snackbar.open]);

    useEffect(() => {
        if (selectedStatus.length >= 4) {
            // If all are selected clear selected array and show all projects
            setSelectedStatus([]);
            setProjectsToShow(() => projects);
        } else {
            // Creating an array to store all statuses on which projects must be filtered
            let allStatuses = [...selectedStatus];
            if (selectedStatus.indexOf(BIDS_STATUSES.PENDING_SUBMISSION) >= 0) {
                allStatuses.push(BIDS_STATUSES.REQUESTED_REVISED_PRICING);
                allStatuses.push(BIDS_STATUSES.ACCEPTED);
            }
            if (selectedStatus.indexOf("closed") >= 0) {
                allStatuses.push(BIDS_STATUSES.WON);
                allStatuses.push(BIDS_STATUSES.AWARDED);
                allStatuses.push(BIDS_STATUSES.LOST_BID);
            }
            if (allStatuses.length === 0) {
                setProjectsToShow(() => projects);
            } else {
                // Creating an Object {status: true .. } mapping with all statuses which are present in allStatuses Array
                let all: any = {};
                for (let s of allStatuses) {
                    all[s as string] = true;
                }

                setProjectsToShow(() => {
                    return projects.filter(
                        // filtering statuses based on selected statuses
                        (project: any) =>
                            all[
                                project?.bid_status?.toLowerCase() === "sent" &&
                                project?.available_bidding_slots == 0 &&
                                project?.is_restricted_max_bidders
                                    ? "lost_bid"
                                    : project.bid_status
                            ] || all[project.project_status],
                    );
                });
            }
        }
        //eslint-disable-next-line
    }, [selectedStatus]);
    if (loading) {
        return (
            <CommonDialog
                open={loading}
                onClose={() => {}}
                loading={loading}
                loaderText={"Please wait. Loading Projects ..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }

    return (
        <Grid container direction="column" p="5rem 10rem">
            <Grid item>
                <Typography variant="text_18_light">
                    Tailorbird in
                    <span
                        style={{
                            fontWeight: "700",
                        }}
                    >
                        &nbsp;numbers
                    </span>
                </Typography>
            </Grid>
            <Grid item mt="1.5rem" mb="3rem">
                <Stack direction="row" spacing="1rem" justifyContent="space-between">
                    {ALL_BID_STATUSES.map(({ icon, status, title, cardStyles }) => {
                        let selected =
                            selectedStatus.length === 0 || selectedStatus.indexOf(status) >= 0;

                        return (
                            <BiddingStatusCard
                                key={status}
                                selected={selected}
                                iconPath={icon}
                                subtitle={title}
                                count={projectCounts[status as keyof typeof projectCounts]}
                                onClick={() => {
                                    if (selectedStatus.indexOf(status) >= 0) {
                                        setSelectedStatus((prev) => {
                                            return prev.filter((s) => s !== status);
                                        });
                                    } else {
                                        setSelectedStatus((prev) => {
                                            return [...prev, status];
                                        });
                                    }
                                }}
                                cardProps={{
                                    sx: {
                                        ...cardStyles,
                                        "&:hover": {
                                            cursor: "pointer",
                                            opacity: selected ? "1" : ".5",
                                        },
                                    },
                                }}
                            />
                        );
                    })}
                </Stack>
            </Grid>
            <Grid item>
                <Stack direction="row" justifyContent="space-between" mb="1rem">
                    <Typography>
                        Bid&nbsp;
                        <span
                            style={{
                                fontWeight: "700",
                            }}
                        >
                            opportunities
                        </span>
                    </Typography>
                    <Stack direction="row">
                        {selectedStatus.length > 0 ? (
                            <BaseButton
                                onClick={() => {
                                    setSelectedStatus([]);
                                }}
                                variant="text"
                                label="Clear selected view"
                                labelStyles={{
                                    color: "#757575",
                                }}
                            >
                                <CloseIcon htmlColor="#757575" />
                            </BaseButton>
                        ) : null}
                        {/* TODO: Add this autocomplete once we have all options in the design */
                        /* <BaseAutoComplete
                            readOnlyTextField
                            autocompleteSx={{
                                width: "15rem",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "0",
                                    padding: "0",
                                },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                                marginLeft: ".5rem",
                                display: "none",
                            }}
                            options={["Show all open Projects"]}
                            value={"Show all open Projects"}
                            variant="outlined"
                        /> */}
                    </Stack>
                </Stack>
            </Grid>
            <Grid item>
                <Stack direction="column" gap={4} height="100%">
                    {!loading && !projects?.length ? (
                        <EmptyState label={EmptyTexts.NO_BID} />
                    ) : (
                        projectsToShow
                            .filter(
                                (project: any) =>
                                    project?.bid_status?.toLowerCase() !==
                                    BIDS_STATUSES.NO_RESPONSE,
                            )
                            .map((project: any) => {
                                return (
                                    <ProjectDetailsCard
                                        key={project.project_id}
                                        greyScaleImg={
                                            [
                                                BIDS_STATUSES.CLOSED,
                                                BIDS_STATUSES.DECLINED,
                                                BIDS_STATUSES.LOST_BID,
                                            ].indexOf(project?.bid_status) > 0
                                        }
                                        leftBorderColor={
                                            borderColors[
                                                //TODO: This needs to be confirmed about project status
                                                (project?.rfp_bid_details?.status !== "closed"
                                                    ? project.bid_status
                                                    : "closed") as keyof typeof borderColors
                                            ]
                                        }
                                        imgSrc={
                                            projectCoverPhotos[project?.project_id] ??
                                            propertyPlaceHolderImg
                                        }
                                        cardProps={{
                                            sx: {
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    backgroundColor: "#E4F7FA",
                                                },
                                            },
                                            onClick: () => {
                                                if (
                                                    [
                                                        BIDS_STATUSES.DECLINED,
                                                        BIDS_STATUSES.NO_RESPONSE,
                                                    ].includes(project?.bid_status)
                                                )
                                                    return;

                                                dispatch(
                                                    actions.projectDetails.fetchProjectDetailsStart(
                                                        project.project_id,
                                                    ),
                                                );

                                                const projectDetailsPageBaseUrl = `/rfp/${role}/${userID}/projects/${project.project_id}`;

                                                navigate(
                                                    project.rfp_project_version === "1.0"
                                                        ? projectDetailsPageBaseUrl
                                                        : `${projectDetailsPageBaseUrl}/v2`,
                                                    {
                                                        state: {
                                                            projectDetails: project,
                                                        },
                                                    },
                                                );
                                            },
                                        }}
                                        projectType={project.property_type}
                                        projectTypeBgColor={
                                            PROJECT_TYPE_BG_COLOR[
                                                project.property_type as keyof typeof PROJECT_TYPE_BG_COLOR
                                            ] ?? "black"
                                        }
                                        rfpVersion={project.rfp_project_version}
                                        propertyName={project.project_name}
                                        propertyAddress={project.address}
                                        organization={project.ownership_group_name}
                                        chipLabel={
                                            project?.rfp_bid_details?.status !== "closed" ||
                                            project.bid_status === "won" ||
                                            project.bid_status === "awarded"
                                                ? getChipLabel(
                                                      project.bid_status,
                                                      project?.available_bidding_slots,
                                                      project?.is_restricted_max_bidders,
                                                      project?.rfp_project_version === "2.0"
                                                          ? project?.rfp_bid_details?.bid_due_date
                                                          : project?.bid_due_date,
                                                  )
                                                : "Closed"
                                        }
                                        chipBgColor={
                                            project?.rfp_bid_details?.status !== "closed" ||
                                            project.bid_status === BIDS_STATUSES.AWARDED ||
                                            project.bid_status === BIDS_STATUSES.WON
                                                ? getChipBackgroundColor(
                                                      project.bid_status,
                                                      project?.available_bidding_slots,
                                                      project?.is_restricted_max_bidders,
                                                      project?.rfp_project_version === "2.0"
                                                          ? project?.rfp_bid_details?.bid_due_date
                                                          : project?.bid_due_date,
                                                  ) ?? "#909090"
                                                : "#909090"
                                        }
                                        chipLabelColor={
                                            project?.rfp_bid_details?.status !== "closed" ||
                                            project.bid_status === BIDS_STATUSES.AWARDED ||
                                            project.bid_status === BIDS_STATUSES.WON
                                                ? getChipLabelColor(
                                                      project.bid_status,
                                                      project?.rfp_project_version === "2.0"
                                                          ? project?.rfp_bid_details?.bid_due_date
                                                          : project?.bid_due_date,
                                                  ) ?? "#232323"
                                                : "#232323"
                                        }
                                        showProgress={
                                            project?.rfp_bid_details?.status !== "closed" &&
                                            (project?.bid_status === BIDS_STATUSES.SUBMITTED ||
                                                project?.bid_status ===
                                                    BIDS_STATUSES.PENDING_SUBMISSION ||
                                                project?.bid_status ===
                                                    BIDS_STATUSES.REQUESTED_REVISED_PRICING ||
                                                project?.bid_status === BIDS_STATUSES.ACCEPTED)
                                        }
                                        progress={
                                            project?.bid_status === BIDS_STATUSES.SUBMITTED
                                                ? 100
                                                : parseInt(project.bid_percentage, 10)
                                        }
                                        progressText={
                                            project?.bid_status === BIDS_STATUSES.SUBMITTED
                                                ? "Bid Submitted"
                                                : `Bid ${parseInt(
                                                      project.bid_percentage,
                                                      10,
                                                  )}% complete`
                                        }
                                        showText={
                                            project?.bid_status === BIDS_STATUSES.SENT &&
                                            project?.rfp_bid_details?.status !== "closed" &&
                                            (!project?.is_restricted_max_bidders ||
                                                project?.available_bidding_slots > 0)
                                        }
                                        text="Review and Accept to Bid"
                                        maxBiddersText={
                                            project?.is_restricted_max_bidders
                                                ? `(${project?.available_bidding_slots}/${project?.max_bidders} spots left)`
                                                : undefined
                                        }
                                    />
                                );
                            })
                    )}
                </Stack>
            </Grid>
        </Grid>
    );
};

export default ProjectsDashboard;
