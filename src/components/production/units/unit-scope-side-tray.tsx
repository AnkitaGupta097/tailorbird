import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import theme from "styles/theme";
import BaseTextField from "components/text-field";
import { Avatar, Badge, BadgeProps, Button, Grid, InputAdornment, Typography } from "@mui/material";
import ScopeSideTrayHeader from "./scope-side-tray-header";
import KeyValue from "../common/key-value";
import PriceDisplayElement from "../common/price-display-element";
import DatePicker from "components/date-picker";
import { Controller, useForm } from "react-hook-form";
import { getAppropriateDateFormat, isValidNumber } from "../helper";
import BaseAutoComplete from "components/base-auto-complete";
import { stringAvatar } from "../../../modules/rfp-manager/helper";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import BaseAccordion from "components/base-accordion";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import FileUpload from "components/upload-files";
import PendingApproval from "../approvals/pending-approvals";
import Loader from "modules/admin-portal/common/loader";
import { FEATURE_FLAGS } from "../constants";
import styled from "@emotion/styled";
import { getRoundedOff } from "../helper";
import TrackerUtil from "utils/tracker";
import { shallowEqual } from "react-redux";
import BaseLoader from "components/base-loading";
import { areNumbersEqual } from "utils/number-comparator";
import dayjs from "dayjs";

interface IUnitScopeSideTrayProps {
    data: any;
    onClose: () => void;
    approvals: Array<any>;
    // eslint-disable-next-line no-unused-vars
    onChangeUnitScope: (arg1: any, showFileUploadModal?: boolean) => void;
    // eslint-disable-next-line no-unused-vars
    onCancelScopeChangeRequest: (scopeApprovalId: string) => void;
    // eslint-disable-next-line no-unused-vars
    onScopeApprovalChange: (arg1: string, arg2: Array<string>, arg3: string) => void;
    onStartScope: () => void;

    // eslint-disable-next-line no-unused-vars
    hasFeature: (arg1: string) => boolean;
    renoUnitId?: string;
    projectName?: string;
}

const StyledBadge = styled(Badge)<BadgeProps>({
    "& .MuiBadge-badge": {
        fontWeight: "bold",
    },
});

const UnitScopeSideTray = ({
    data,
    onClose,
    approvals,
    onChangeUnitScope,
    onScopeApprovalChange,
    onCancelScopeChangeRequest,
    onStartScope,
    hasFeature,
    projectName,
    renoUnitId,
}: IUnitScopeSideTrayProps) => {
    const dispatch = useAppDispatch();

    // eslint-disable-next-line no-unused-vars
    const [contractorsOptions, setContractorsOptions] = useState<Array<any>>([]);
    const [selectedApprovals, setSelectedApprovals] = useState([]);
    const [loading, setLoading] = useState(false);

    const elementRef = useRef<HTMLDivElement>(null);

    const SCOPE_COMPLETION = "scope_completion";

    const {
        handleSubmit,
        control,
        setValue,
        formState: { isDirty },
        watch,
    } = useForm({
        defaultValues: {
            renovation_start_date: getAppropriateDateFormat(data?.renovation_start_date),
            renovation_end_date: getAppropriateDateFormat(data?.renovation_end_date),
            material_price: getRoundedOff(data?.material_price),
            labor_price: getRoundedOff(data?.labor_price),
            material_and_labor_price: getRoundedOff(data?.material_and_labor_price),
            // contractor: data?.contractor,
        },
        mode: "onChange",
    });

    const { contractors, reviewing } = useAppSelector((state) => {
        return {
            contractors: state.ims.ims.contractors,
            reviewing: state.approvalState.reviewing,
        };
    }, shallowEqual);

    useEffect(() => {
        if (!contractors || !contractors?.length) {
            dispatch(actions.imsActions.fetchContractorStart({}));
        } else {
            const options = contractors?.map((contractor) => ({
                label: contractor?.name,
                value: contractor?.id,
            }));
            setContractorsOptions(options);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractors]);

    useEffect(() => {
        setValue("renovation_start_date", getAppropriateDateFormat(data?.renovation_start_date));
        setValue("renovation_end_date", getAppropriateDateFormat(data?.renovation_end_date));
        setValue("material_price", getRoundedOff(data?.material_price));
        setValue("labor_price", getRoundedOff(data?.labor_price));
        setValue("material_and_labor_price", getRoundedOff(data?.material_and_labor_price));
        setLoading(false);
        setSelectedApprovals([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const onApproveIndividual = (approvalId: any) => {
        TrackerUtil.event("CLICKED_APPROVE_REQUEST", {
            renoUnitId,
            scopeApprovalId: approvalId,
            projectName,
        });
        onScopeApprovalChange("approved", [approvalId], "individual");
    };

    const onRejectIndividual = (approvalId: any) => {
        TrackerUtil.event("CLICKED_REJECT_REQUEST", {
            renoUnitId,
            scopeApprovalId: approvalId,
            projectName,
        });

        onScopeApprovalChange("rejected", [approvalId], "individual");
    };

    const onCancelIndividual = (approvalId: any) => {
        TrackerUtil.event("CLICKED_CANCEL_APPROVAL", {
            renoUnitId,
            scopeApprovalId: approvalId,
            projectName,
        });
        onScopeApprovalChange("cancelled", [approvalId], "individual");
    };

    const trackBulkEvent = (status: string, scopeApprovalIds: Array<string>) => {
        if (status === "cancelled") {
            TrackerUtil.event("CLICKED_CANCEL_BULK_APPROVALS", {
                renoUnitId,
                scopeApprovalIds: scopeApprovalIds,
                projectName,
            });
        } else if (status === "rejected") {
            TrackerUtil.event("CLICKED_REJECT_BULK_APPROVALS", {
                renoUnitId,
                scopeApprovalIds: scopeApprovalIds,
                projectName,
            });
        } else {
            TrackerUtil.event("CLICKED_APPROVE_BULK_APPROVALS", {
                renoUnitId,
                scopeApprovalIds: scopeApprovalIds,
                projectName,
            });
        }
    };

    const onHandleAllSelectedApprovals = (status: string, ids: Array<string>) => {
        trackBulkEvent(status, ids);
        onScopeApprovalChange(status, [...ids], "bulk");
    };

    const canCancelRequest = hasFeature(FEATURE_FLAGS.CANCEL_CHANGE_ORDER);
    const canReview = hasFeature(FEATURE_FLAGS.REVIEW_CHANGE_ORDER);
    const canRaiseRequest = hasFeature(FEATURE_FLAGS.RAISE_CHANGE_ORDER);
    // const canStartRenovation = hasFeature(FEATURE_FLAGS.START_RENOVATION);

    const onAction = () => {
        switch (data?.status) {
            case "not_started": {
                onStartScope();
                return;
            }
            case "in_progress":
                return onChangeUnitScope({ status: "completed" });
        }
    };

    const getScopePendingApprovalCount = (): ReactNode => {
        const noOfPendingApproval =
            approvals?.filter((approval: any) => approval?.status === "in_review")?.length || 0;
        return noOfPendingApproval ? (
            <div style={{ marginLeft: "8px" }}>
                <StyledBadge badgeContent={noOfPendingApproval} color="error" />
            </div>
        ) : (
            <></>
        );
    };

    const keysEditable = [
        "renovation_start_date",
        "renovation_end_date",
        "material_price",
        "labor_price",
        "material_and_labor_price",
    ];

    const trackEvent = (event: string, payload: any) => {
        TrackerUtil.event(event, payload);
    };

    const onSave = (changedData: any, eventType: string, isPricesChanged?: boolean) => {
        let isChanged = false;
        let areOnlyDateFieldsChanged = true;
        if (isDirty && isPricesChanged) {
            const editedData = keysEditable.reduce((updatedData: any, key) => {
                if (key === "renovation_start_date" || key === "renovation_end_date") {
                    return updatedData;
                } else if (!areNumbersEqual(changedData[key], data[key])) {
                    updatedData[key] = parseFloat(changedData[key]);
                    isChanged = true;
                    areOnlyDateFieldsChanged = false;
                } else {
                    updatedData[key] = parseFloat(data[key]);
                }
                return updatedData;
            }, {});
            if (isChanged) {
                trackEvent(eventType, {
                    renoUnitId,
                    scopeId: data?.id,
                });
                const showFileUploadModal = !areOnlyDateFieldsChanged;
                onChangeUnitScope(editedData, showFileUploadModal);
            }
        }

        if (!isPricesChanged) {
            onAction();
        }
    };

    let form_labor_price = watch("labor_price");
    let form_material_price = watch("material_price");
    let form_material_and_labor_price = watch("material_and_labor_price");

    const isPricesChanged = useMemo(() => {
        return (
            form_labor_price != getRoundedOff(data?.labor_price) ||
            form_material_price != getRoundedOff(data?.material_price) ||
            form_material_and_labor_price != getRoundedOff(data?.material_and_labor_price)
        );
    }, [form_labor_price, form_material_price, form_material_and_labor_price, data]);

    const isScopeCompletionRequest = (): boolean => {
        const scopeCompletionRequest = approvals?.find(
            (scopeApproval) => scopeApproval?.request_type === SCOPE_COMPLETION,
        );
        return scopeCompletionRequest?.status === "in_review";
    };

    const isUnitScopeComplete = data.status == "completed";

    const getPendingApprovalButtonAction = (): ReactNode => {
        if (canCancelRequest) {
            return (
                <Button
                    variant={"outlined"}
                    color="primary"
                    onClick={() => {
                        onCancelScopeChangeRequest(data?.scope_approval_id);
                    }}
                    style={{ height: "36px", width: "100%" }}
                >
                    <Typography variant="text_16_medium">Cancel Request</Typography>
                </Button>
            );
        }
        if (canReview && isScopeCompletionRequest()) {
            return (
                <>
                    <Button
                        variant={"outlined"}
                        color="primary"
                        onClick={() => onRejectIndividual(data?.scope_approval_id)}
                        style={{ height: "36px", width: "100%" }}
                    >
                        <Typography variant="text_16_medium">Reject Request</Typography>
                    </Button>
                    <Button
                        variant={"contained"}
                        color="primary"
                        onClick={() => onApproveIndividual(data?.scope_approval_id)}
                        style={{ height: "36px", width: "100%" }}
                    >
                        <Typography variant="text_16_medium">Mark as Complete</Typography>
                    </Button>
                </>
            );
        }
    };

    const getNonPendingButtonAction = (): ReactNode => {
        return (
            <>
                {canRaiseRequest && data?.status != "completed" && (
                    <Button
                        variant={"contained"}
                        color="primary"
                        onClick={handleSubmit((data) => {
                            onSave(data, "RAISE_CHANGE_ORDER", isPricesChanged);
                        })}
                        style={{ height: "36px", width: "100%" }}
                    >
                        <Typography variant="text_16_medium">
                            {isPricesChanged
                                ? "Raise a Change Request"
                                : data?.status == "in_progress"
                                ? "Mark As Completed"
                                : "Start"}
                        </Typography>
                    </Button>
                )}
            </>
        );
    };

    const getSideTrayActionButtons = () => {
        return (
            <Grid
                ref={elementRef}
                item
                container
                flexDirection="column"
                padding={5}
                gap={5}
                style={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: theme.common.white,
                    borderTop: `1px solid ${theme.border.textarea}`,
                }}
            >
                {selectedApprovals?.length > 0 ? (
                    canReview ? (
                        <>
                            <Button
                                variant={"outlined"}
                                color="primary"
                                onClick={() => {
                                    onHandleAllSelectedApprovals("rejected", [
                                        ...selectedApprovals,
                                    ]);
                                }}
                                style={{ height: "36px", width: "100%" }}
                            >
                                <Typography variant="text_16_medium">Reject Selected</Typography>
                            </Button>
                            <Button
                                variant={"contained"}
                                color="primary"
                                onClick={() => {
                                    onHandleAllSelectedApprovals("approved", [
                                        ...selectedApprovals,
                                    ]);
                                }}
                                style={{ height: "36px", width: "100%" }}
                            >
                                <Typography variant="text_16_medium">Approve Selected</Typography>
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant={"contained"}
                            color="primary"
                            onClick={() => {
                                onHandleAllSelectedApprovals("cancelled", [...selectedApprovals]);
                            }}
                            style={{ height: "36px", width: "100%" }}
                        >
                            <Typography variant="text_16_medium">Cancel Selected</Typography>
                        </Button>
                    )
                ) : data?.status === "pending_approval" ? (
                    getPendingApprovalButtonAction()
                ) : (
                    getNonPendingButtonAction()
                )}
            </Grid>
        );
    };

    const getEditableField = (fieldDetail: any): ReactNode => {
        switch (fieldDetail?.type) {
            case "input":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={control}
                        rules={{
                            required: "required",
                            validate: (value) => isValidNumber(value) || "Invalid amount",
                        }}
                        render={({ field, fieldState }) => (
                            <BaseTextField
                                {...field}
                                key={fieldDetail?.key}
                                label={
                                    <Typography variant="text_14_medium">
                                        {fieldDetail.label}
                                    </Typography>
                                }
                                fullWidth
                                error={!!fieldState?.error}
                                helper={fieldState.error?.message}
                                InputProps={{
                                    readOnly: !canRaiseRequest || isUnitScopeComplete,
                                    disabled: !canRaiseRequest || isUnitScopeComplete,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography
                                                variant="text_14_regular"
                                                color={theme.background.black}
                                            >
                                                $
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                );

            case "date":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={control}
                        rules={{
                            required: false,
                        }}
                        render={
                            ({ field, fieldState }) => (
                                // canRaiseRequest ? (
                                <DatePicker
                                    {...field}
                                    label={fieldDetail.label}
                                    error={!!fieldState?.error}
                                    errorText={fieldState.error?.message}
                                    disabled={isUnitScopeComplete}
                                    onChange={(newDate: any) => {
                                        let date = newDate?.format("YYYY-MM-DD");
                                        field.onChange(date);
                                        let changeData: any = {};
                                        if (date != dayjs(data[field.name])?.format("YYYY-MM-DD")) {
                                            changeData[field.name] = date;
                                            onChangeUnitScope(changeData, false);
                                        }
                                    }}
                                />
                            )
                            // ) : (
                            //     <BaseTextField
                            //         label={
                            //             <Typography variant="text_14_medium">
                            //                 {fieldDetail.label}
                            //             </Typography>
                            //         }
                            //         fullWidth
                            //         InputProps={{
                            //             disabled: !canRaiseRequest,
                            //         }}
                            //         value={field?.value}
                            //         placeholder={"MM/DD/YYYY"}
                            //     />
                            // )
                        }
                    />
                );

            case "select":
                return (
                    <Controller
                        name={fieldDetail?.key}
                        control={control}
                        render={({ field, fieldState }) => (
                            <BaseAutoComplete
                                {...field}
                                readOnlyTextField
                                variant={"outlined"}
                                labelComponent={
                                    <div style={{ marginBottom: "4px" }}>
                                        <Typography
                                            variant="text_14_medium"
                                            color={theme.background.black}
                                        >
                                            {fieldDetail?.label}
                                        </Typography>
                                    </div>
                                }
                                options={fieldDetail?.options ?? []}
                                renderOption={(props: any, option: any) => {
                                    return (
                                        <li {...props} key={option.value}>
                                            <div style={{ display: "flex" }}>
                                                {option.label ? (
                                                    <Avatar
                                                        {...stringAvatar(
                                                            option.label,
                                                            theme.icon.successDefault,
                                                        )}
                                                    />
                                                ) : (
                                                    <Avatar />
                                                )}
                                                <Typography
                                                    variant="text_14_regular"
                                                    marginLeft={2}
                                                >
                                                    {option.label}
                                                </Typography>
                                            </div>
                                        </li>
                                    );
                                }}
                                getOptionLabel={(option: any) => option?.label || "Unassigned"}
                                error={fieldState.error}
                                errorText={fieldState.error?.message}
                                onChange={(
                                    event: React.SyntheticEvent,
                                    selected: { value: string; label: string },
                                ) => field.onChange(selected?.value)}
                            />
                        )}
                    />
                );
            default:
                return <></>;
        }
    };

    // const getNotesData = () => {
    //     return [
    //         <Grid container key={data?.id} flexDirection="column" gap={3}>
    //             <Grid>
    //                 <Typography variant="text_14_medium" color={theme.text.dark}>
    //                     Upload Files or Photos
    //                 </Typography>
    //             </Grid>
    //             <Grid>
    //                 <Typography variant="text_14_regular" color={theme.text.medium}>
    //                     Add photos or files to track your progress over time and share it with other
    //                     stakeholders
    //                 </Typography>
    //             </Grid>
    //             <Grid>
    //                 <FileUpload
    //                     acceptedFileTypes={[".jpg", ".png", ".csv", ".pdf", ".jpeg", ".xlsx"]}
    //                     onFileChange={(file: any) => {
    //                         console.log(file);
    //                     }}
    //                     isMultiple
    //                     helperText="Accepts .csv, .xlsx, .jpg .jpeg .png and .pdf only"
    //                     containerWidth="auto"
    //                 />
    //             </Grid>
    //         </Grid>,
    //     ];
    // };

    const getApprovalsData = () => {
        return [
            <PendingApproval
                key={`${data?.id}approvals`}
                approvals={approvals}
                selected={selectedApprovals}
                onSelect={setSelectedApprovals}
                onApproveIndividual={onApproveIndividual}
                onRejectIndividual={onRejectIndividual}
                onCancelIndividual={onCancelIndividual}
                canReviewRequest={canReview}
                canCancelRequest={canCancelRequest}
            />,
        ];
    };

    return (
        <>
            {reviewing && <BaseLoader />}
            <Grid container flexDirection="column" height={"100%"}>
                <Grid
                    item
                    style={{
                        height: `calc(70vh - ${elementRef?.current?.clientHeight || 133}px)`,
                        background: theme.common.white,
                    }}
                    overflow="auto"
                >
                    <Grid container flexDirection="column" padding={5} gap={5}>
                        <Grid item>
                            <ScopeSideTrayHeader
                                name={data?.scope}
                                status={data?.status}
                                onClose={onClose}
                            />
                        </Grid>
                        <Grid container item flexDirection="column" gap={6}>
                            {loading ? (
                                <Loader />
                            ) : (
                                <>
                                    <Grid item>
                                        <KeyValue
                                            label="Total Scope Cost"
                                            value={
                                                <PriceDisplayElement
                                                    startPrice={data?.start_price}
                                                    currentPrice={
                                                        (data?.labor_price || 0) +
                                                        (data?.material_price || 0) +
                                                        (data?.material_and_labor_price || 0)
                                                    }
                                                    variant="text_14_semibold"
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item>
                                        {getEditableField({
                                            key: "renovation_start_date",
                                            type: "date",
                                            label: "Start Date",
                                        })}
                                    </Grid>
                                    <Grid item>
                                        {getEditableField({
                                            key: "renovation_end_date",
                                            type: "date",
                                            label: "End Date",
                                        })}
                                    </Grid>
                                    {/* <Grid item>
                                    {getEditableField({
                                        key: "contractor",
                                        type: "select",
                                        label: "Subcontractor / General Contractor",
                                        options: contractorsOptions,
                                    })}
                                </Grid> */}
                                    <Grid item>
                                        {getEditableField({
                                            key: "material_price",
                                            type: "input",
                                            label: "Material Cost",
                                        })}
                                    </Grid>
                                    <Grid item>
                                        {getEditableField({
                                            key: "labor_price",
                                            type: "input",
                                            label: "Labor Cost",
                                        })}
                                    </Grid>
                                    <Grid item>
                                        {getEditableField({
                                            key: "material_and_labor_price",
                                            type: "input",
                                            label: "Material And Labor Cost",
                                        })}
                                    </Grid>
                                    {/* <Grid item>
                                    <BaseAccordion
                                        title={"Notes / Attachments"}
                                        summaryVariant="text_16_semibold"
                                        summaryIcon={
                                            <DragIndicatorIcon htmlColor={theme.icon.subdued} />
                                        }
                                        components={getNotesData()}
                                        accordionSummarySx={{ padding: "0 20px" }}
                                        defaultExpanded={false}
                                    />
                                </Grid> */}
                                    <Grid item>
                                        <BaseAccordion
                                            title={"Approvals"}
                                            summaryVariant="text_16_semibold"
                                            summaryIcon={
                                                <DragIndicatorIcon htmlColor={theme.icon.subdued} />
                                            }
                                            components={getApprovalsData()}
                                            accordionSummarySx={{ padding: "0 20px" }}
                                            defaultExpanded={false}
                                            summaryAddition={
                                                canReview && getScopePendingApprovalCount()
                                            }
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                {getSideTrayActionButtons()}
            </Grid>
        </>
    );
};

export default UnitScopeSideTray;
