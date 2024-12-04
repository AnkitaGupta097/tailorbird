import React, { useEffect, useRef, useState } from "react";
import ApprovalButtonGroup from "./approval-button-group";
import UnitDetailCard from "../common/unit-detail-card";
import PendingApproval from "./pending-approvals";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { productionTabUrl } from "../constants";
import { CircularProgress, Grid } from "@mui/material";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import TrackerUtil from "utils/tracker";
import AvatarGroup from "components/avatar-group";
import { getAppropriateDateFormat } from "../helper";
import BaseLoader from "components/base-loading";
import { shallowEqual } from "react-redux";
import { useProductionContext } from "context/production-context";
import FileUploadModal from "../units/modal/file-upload-modal";

interface IApprovalSidetrayProps {
    unit: any;
    onClose: () => void;
    canReviewRequest?: boolean;
    activeTab?: "pending" | "resolved";
    filters?: any;
}

const ApprovalSidetray = ({
    unit,
    onClose,
    canReviewRequest,
    activeTab,
    filters,
}: IApprovalSidetrayProps) => {
    const dispatch = useAppDispatch();
    const [fileUploadModalData, setFileUploadModalData] = useState<any>();

    const shouldRefetch = useRef(false);

    const [selectedApprovals, setSelectedApprovals] = useState([]);
    const { isRFPProject } = useProductionContext();

    const { allApprovals, snackbarState, reviewing, projectDetails } = useAppSelector((state) => {
        return {
            allApprovals: state.approvalState.allApprovals,
            reviewing: state.approvalState.reviewing,
            snackbarState: state.common.snackbar,
            projectDetails: state.singleProject.projectDetails,
        };
    }, shallowEqual);

    const pendingApprovals =
        allApprovals && allApprovals[unit.id]?.filter((aprvl: any) => aprvl.status === "in_review");
    const resolvedApprovals =
        allApprovals && allApprovals[unit.id]?.filter((aprvl: any) => aprvl.status !== "in_review");

    const approvals = activeTab === "pending" ? pendingApprovals : resolvedApprovals;

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { projectId } = useParams();

    const getApprovals = () => {
        dispatch(
            actions.production.approval.fetchApprovalsStart({
                renoUnitId: unit.id,
            }),
        );
    };

    useEffect(() => {
        if (reviewing) {
            shouldRefetch.current = true;
        }

        if (!reviewing && shouldRefetch.current) {
            setFileUploadModalData(null);
            // fetch filtered approval units if any
            dispatch(
                actions.production.unitApproval.fetchUnitApprovalsStart({
                    projectId,
                    isReviewed: false,
                    approvalType: filters.approvalType,
                    unitStatus: filters.unitStatuses,
                }),
            );
            dispatch(
                actions.production.unitApproval.fetchUnitApprovalsStart({
                    projectId,
                    isReviewed: true,
                    approvalType: filters.approvalType,
                    unitStatus: filters.unitStatuses,
                }),
            );
            shouldRefetch.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewing]);

    useEffect(() => {
        if (approvals && approvals.length === 0) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approvals]);

    useEffect(() => {
        if (unit && (!approvals || approvals.length === 0)) {
            getApprovals();
        }
        //eslint-disable-next-line
    }, [unit]);

    useEffect(() => {
        const { open, variant, message } = snackbarState;
        open &&
            enqueueSnackbar("", {
                variant: variant,
                action: <BaseSnackbar variant={variant} title={message?.toString() ?? ""} />,
                onClose: () => {
                    dispatch(actions.common.closeSnack());
                },
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState.open]);

    const makeApiRequest = async (
        reviewStatus: "approved" | "rejected",
        scopeApprovalIds: any,
        type: string,
        attachments: any = [],
        remark: string = "",
    ) => {
        dispatch(
            actions.production.approval.reviewApprovalStart({
                scopeApprovalIds,
                reviewStatus,
                renoUnitId: unit.id,
                projectId,
                projectName: projectDetails?.name,
                type,
                attachments,
                remark,
            }),
        );
        setSelectedApprovals([]);
    };

    const onAttachFilesAndNote = (fileIds: Array<string> = [], note = "") => {
        const { scopeApprovalIds, reviewStatus, type } = fileUploadModalData;

        makeApiRequest(reviewStatus, scopeApprovalIds, type, fileIds, note);
    };

    const onReject = () => {
        TrackerUtil.event("CLICKED_REJECT_BULK_APPROVALS", {
            renoUnitId: unit?.id,
            scopeApprovalIds: selectedApprovals,
            projectName: projectDetails?.name,
        });
        setFileUploadModalData({
            scopeApprovalIds: selectedApprovals,
            reviewStatus: "rejected",
            type: "bulk",
        });
    };

    const onApprove = () => {
        TrackerUtil.event("CLICKED_APPROVE_BULK_APPROVALS", {
            renoUnitId: unit?.id,
            scopeApprovalIds: selectedApprovals,
            projectName: projectDetails?.name,
        });
        setFileUploadModalData({
            scopeApprovalIds: selectedApprovals,
            reviewStatus: "approved",
            type: "bulk",
        });
    };

    const onApproveIndividual = (approvalId: any) => {
        TrackerUtil.event("CLICKED_APPROVE_REQUEST", {
            renoUnitId: unit?.id,
            scopeApprovalId: approvalId,
            projectName: projectDetails?.name,
        });

        setFileUploadModalData({
            scopeApprovalIds: [approvalId],
            reviewStatus: "approved",
            type: "individual",
        });
    };

    const onRejectIndividual = (approvalId: any) => {
        TrackerUtil.event("CLICKED_REJECT_REQUEST", {
            renoUnitId: unit?.id,
            scopeApprovalId: approvalId,
            projectName: projectDetails?.name,
        });

        setFileUploadModalData({
            scopeApprovalIds: [approvalId],
            reviewStatus: "rejected",
            type: "individual",
        });
    };

    const subsNames = (): string[] => {
        return unit?.subs?.map((sub: any) => sub.name) || [];
    };

    return (
        <>
            {reviewing && <BaseLoader />}
            {!approvals ? (
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="400px"
                >
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>
            ) : (
                <UnitDetailCard
                    unit={unit}
                    onClose={onClose}
                    actionItemComponent={
                        <PendingApproval
                            canReviewRequest={canReviewRequest}
                            approvals={approvals}
                            onSelect={setSelectedApprovals}
                            selected={selectedApprovals}
                            onApproveIndividual={onApproveIndividual}
                            onRejectIndividual={onRejectIndividual}
                            unitName={unit?.unit_name}
                        />
                    }
                    actionButtons={
                        <ApprovalButtonGroup
                            onReject={onReject}
                            onApprove={onApprove}
                            onClickViewDetail={() => {
                                projectId &&
                                    navigate(
                                        `${productionTabUrl(projectId, isRFPProject)}/units/${
                                            unit.id
                                        }`,
                                        {
                                            state: { from: "approvals" },
                                        },
                                    );
                            }}
                            canReviewRequest={canReviewRequest}
                        />
                    }
                    rows={[
                        {
                            key: "General Contractor",
                            value: unit.general_contractor,
                        },
                        {
                            key: "Subcontractors",
                            value:
                                subsNames()?.length > 0 ? (
                                    <AvatarGroup names={subsNames()} size={32} />
                                ) : (
                                    "-"
                                ),
                        },
                        {
                            key: "Start Date",
                            value: getAppropriateDateFormat(unit?.renovation_start_date) || "-",
                        },
                        {
                            key: "Make-ready Date",
                            value: getAppropriateDateFormat(unit?.make_ready_date) || "-",
                        },
                    ]}
                />
            )}
            <FileUploadModal
                projectName={projectDetails.name}
                isModal={!!fileUploadModalData}
                handleClose={() => setFileUploadModalData(null)}
                onAttachFilesAndNote={onAttachFilesAndNote}
                projectId={projectId as string}
            />
        </>
    );
};

export default ApprovalSidetray;
