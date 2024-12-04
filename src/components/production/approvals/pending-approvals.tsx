import { Button, Divider, Grid, Link, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import React, { useState } from "react";
import { compact } from "lodash";
import AppTheme from "styles/theme";
import BaseCheckbox from "components/checkbox";
import { convertToDisplayUnit } from "../converter-util";
import KeyValueRow from "../common/key-value-row";
import BaseChip from "components/chip";
import { APPROVAL_STATUS_COLOR_MAP } from "../constants";
import { convertApprovalToDisplay } from "./utils";
import { ReactComponent as GreenCheckIcon } from "../../../assets/icons/check.svg";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HumanReadableData from "components/human-readable-date";
import NotesAttachmentElement from "../units/notes-attachment-element";
import { useAppSelector } from "stores/hooks";
import { shallowEqual } from "react-redux";

interface IPendingApprovalProps {
    approvals: any;
    onSelect: any;
    onApproveIndividual?: any;
    onRejectIndividual?: any;
    onCancelIndividual?: any;
    selected?: any;
    canReviewRequest?: boolean;
    canCancelRequest?: boolean;
    unitName?: any;
}

const ScopeCard = (props: any) => {
    const { constants, projectName } = useAppSelector((state) => {
        return {
            constants: state.productionProject.constants,
            projectName: state.singleProject.projectDetails?.name,
        };
    }, shallowEqual);

    const [viewAttachment, setViewAttachment] = useState({
        requestor: false,
        requestee: false,
    });

    const {
        scopeApproval,
        isSelected,
        handleToggle,
        onApproveIndividual,
        onRejectIndividual,
        onCancelIndividual,
        canReviewRequest,
        canCancelRequest,
        unitName,
    } = props;

    const status = scopeApproval && scopeApproval.status;
    const statusChipProps = status
        ? { ...APPROVAL_STATUS_COLOR_MAP[status] }
        : {
              variant: "outlined",
              textColor: "#6A6464",
          };

    const renderRows = (dataRows: any) => {
        return (
            <>
                {compact(dataRows).map((dataRow: any) => (
                    <>
                        <KeyValueRow {...dataRow} />
                        {!dataRow.disableDivider && <Divider />}
                    </>
                ))}
            </>
        );
    };

    // eslint-disable-next-line no-unused-vars
    const renderDecidedBy = (userName: any, date: any) => {
        return (
            <Grid container flexDirection="column" alignItems="center" rowSpacing={1}>
                <Grid item>
                    <Typography variant="valueText">{userName ?? "-"}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="text_14_regular" color={AppTheme.text.medium}>
                        <HumanReadableData dateString={date} />
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    const getScopePath = () => {
        return !["scope_completion", "unit_sign_off"].includes(scopeApproval.request_type) &&
            scopeApproval.item_category &&
            scopeApproval.item_name
            ? {
                  field: "Scope Path",
                  value: `${scopeApproval.item_category ?? "-"}/${scopeApproval.item_name ?? "-"}`,
              }
            : undefined;
    };

    const getScopeName = () => {
        switch (scopeApproval.request_type) {
            case "unit_sign_off":
                return unitName;
            case "scope_completion":
                return scopeApproval?.unit_scope_name;
            case "change_order":
            case "line_item_change":
                return scopeApproval.item_name
                    ? `${scopeApproval.item_name}${
                          scopeApproval.scope ? ` - ${scopeApproval.scope}` : ""
                      }`
                    : scopeApproval?.unit_scope_name;
            default:
                return scopeApproval?.unit_scope_name;
        }
    };

    const getViewHideElement = (key: "requestor" | "requestee") => {
        return (
            <Typography variant="text_14_semibold">
                <Link
                    component="button"
                    onClick={() =>
                        setViewAttachment((prevVal) => ({ ...prevVal, [key]: !prevVal[key] }))
                    }
                >
                    {viewAttachment ? "Hide" : "View"}
                </Link>
            </Typography>
        );
    };

    return (
        <Grid
            container
            rowGap={4}
            sx={{
                borderRadius: "4px",
                border: `1px solid ${AppTheme.border.textarea}`,
                padding: "16px",
                marginTop: "16px",
                background: scopeApproval.request_type === "scope_completion" ? "#F1F8F5" : "none",
            }}
        >
            <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="flext-start">
                    <Grid item>
                        <Grid container alignItems="center" columnSpacing={2}>
                            <Grid item sx={{ height: "24px" }}>
                                {scopeApproval.status === "approved" ? (
                                    <GreenCheckIcon />
                                ) : scopeApproval.status === "rejected" ||
                                  scopeApproval.status === "cancelled" ? (
                                    <DoNotDisturbIcon
                                        sx={{ height: "24px", width: "24px" }}
                                        color="secondary"
                                    />
                                ) : (
                                    (canReviewRequest || canCancelRequest) && (
                                        <BaseCheckbox
                                            size="small"
                                            sx={{ marginRight: "8px" }}
                                            checked={isSelected}
                                            onClick={handleToggle}
                                        />
                                    )
                                )}
                            </Grid>
                            <Grid item>
                                <Typography variant="text_16_regular">
                                    {convertToDisplayUnit(
                                        scopeApproval.request_type,
                                        constants?.ScopeApprovalType,
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <BaseChip
                            label={convertToDisplayUnit(
                                scopeApproval.status,
                                constants?.ScopeApprovalStatus,
                            )}
                            sx={{ borderRadius: "4px" }}
                            {...statusChipProps}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {renderRows([
                    {
                        field: "Scope Name",
                        value: getScopeName() ?? "-",
                    },
                    getScopePath(),
                    ...convertApprovalToDisplay(scopeApproval),
                    {
                        field: "Submitted by",
                        value: renderDecidedBy(
                            scopeApproval?.requestor_user?.name,
                            scopeApproval.created_at,
                        ),
                    },
                    {
                        field: "Decided by",
                        value: renderDecidedBy(
                            scopeApproval?.requestee_user?.name,
                            scopeApproval.updated_at,
                        ),
                        disableDivider: true,
                    },
                ])}
                {(scopeApproval?.requestor_attachments?.length > 0 ||
                    !!scopeApproval?.requestor_remark) && (
                    <>
                        <Divider />
                        <KeyValueRow
                            field="Requestor's Notes / Attachments"
                            value={getViewHideElement("requestor")}
                        />
                    </>
                )}
                {(scopeApproval?.requestor_attachments?.length > 0 ||
                    !!scopeApproval?.requestor_remark) && (
                    <NotesAttachmentElement
                        show={viewAttachment.requestor}
                        remark={scopeApproval?.requestor_remark}
                        fileIds={scopeApproval?.requestor_attachments}
                        projectName={projectName}
                    />
                )}
                {(scopeApproval?.requestee_attachments?.length > 0 ||
                    !!scopeApproval?.requestee_remark) && (
                    <>
                        <Divider />
                        <KeyValueRow
                            field="Reviewer's Notes / Attachments"
                            value={getViewHideElement("requestee")}
                        />
                    </>
                )}
                {(scopeApproval?.requestee_attachments?.length > 0 ||
                    !!scopeApproval?.requestee_remark) && (
                    <NotesAttachmentElement
                        show={viewAttachment.requestee}
                        remark={scopeApproval?.requestee_remark}
                        fileIds={scopeApproval?.requestee_attachments}
                        projectName={projectName}
                    />
                )}
            </Grid>
            {!isSelected && scopeApproval.status === "in_review" && (
                <Grid container spacing={4} sx={{ marginTop: "16px" }}>
                    {canReviewRequest && (
                        <>
                            <Grid item xs={6}>
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ width: "100%" }}
                                    onClick={() =>
                                        onRejectIndividual && onRejectIndividual(scopeApproval.id)
                                    }
                                >
                                    <CloseIcon />
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    sx={{ width: "100%" }}
                                    onClick={() =>
                                        onApproveIndividual && onApproveIndividual(scopeApproval.id)
                                    }
                                >
                                    <CheckIcon />
                                </Button>
                            </Grid>
                        </>
                    )}
                    {canCancelRequest && (
                        <Grid xs={12}>
                            <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                onClick={() =>
                                    onCancelIndividual && onCancelIndividual(scopeApproval.id)
                                }
                            >
                                <Typography variant="text_16_medium">Cancel</Typography>
                            </Button>
                        </Grid>
                    )}
                </Grid>
            )}
        </Grid>
    );
};

const PendingApproval = ({
    approvals,
    selected,
    onSelect,
    onApproveIndividual,
    onRejectIndividual,
    onCancelIndividual,
    canCancelRequest,
    canReviewRequest,
    unitName,
}: IPendingApprovalProps) => {
    const handleToggle = (id: string) => {
        const currentIndex = selected.indexOf(id);
        const newSelectedValues = [...selected];

        if (currentIndex === -1) {
            newSelectedValues.push(id);
        } else {
            newSelectedValues.splice(currentIndex, 1);
        }

        onSelect(newSelectedValues);
    };

    const onSelectAll = () => {
        if (isAllSelected()) {
            onSelect([]);
        } else {
            const pendingApprovals = approvals?.filter(
                (approval: any) => approval?.status === "in_review",
            );
            onSelect(pendingApprovals?.map((approval: any) => approval.id));
        }
    };

    const isAllSelected = () => {
        const pendingApprovals = approvals?.filter(
            (approval: any) => approval?.status === "in_review",
        );
        return pendingApprovals?.length === selected.length && approvals?.length != 0;
    };

    // when more than 1 item is selected but not all
    const isIndeterminate = () => {
        return selected?.length > 0 && approvals?.length !== selected?.length;
    };

    const getPendingApprovalLength = () => {
        return (approvals?.filter((ap: any) => ap?.status === "in_review") || []).length;
    };

    return !approvals?.length ? (
        <Typography variant="text_14_regular">No Approval Requests</Typography>
    ) : (
        <Grid container justifyContent="space-between">
            {(canCancelRequest || canReviewRequest) && getPendingApprovalLength() != 0 && (
                <>
                    <Grid item>
                        <Typography variant="text_14_semibold">Pending Approvals</Typography>
                    </Grid>
                    <Grid item>
                        <BaseCheckbox
                            size="small"
                            sx={{ marginRight: "4px" }}
                            checked={isAllSelected()}
                            onClick={onSelectAll}
                            indeterminate={isIndeterminate()}
                        />
                        <Typography variant="text_14_semibold">{`${
                            selected.length
                        }/${getPendingApprovalLength()} selected`}</Typography>
                    </Grid>
                </>
            )}
            <Grid item xs={12}>
                {approvals?.map((approval: any) => {
                    return (
                        <ScopeCard
                            key={approval.id}
                            scopeApproval={approval}
                            isSelected={selected.indexOf(approval.id) !== -1}
                            handleToggle={() => handleToggle(approval.id)}
                            onApproveIndividual={onApproveIndividual}
                            onRejectIndividual={onRejectIndividual}
                            onCancelIndividual={onCancelIndividual}
                            canCancelRequest={canCancelRequest}
                            canReviewRequest={canReviewRequest}
                            unitName={unitName}
                        />
                    );
                })}
            </Grid>
        </Grid>
    );
};

export default PendingApproval;
