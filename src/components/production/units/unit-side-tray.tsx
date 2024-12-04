import React, { ReactNode, useEffect, useRef, useState } from "react";
import theme from "styles/theme";
import { Alert, Button, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import DatePicker from "components/date-picker";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import Loader from "modules/admin-portal/common/loader";
import { FEATURE_FLAGS, UNIT_STATUS_COLOR_MAP, productionTabUrl } from "../constants";
import BaseChip from "components/chip";
import { Clear, EditCalendar } from "@mui/icons-material";
import { useProductionContext } from "context/production-context";
import { useNavigate, useParams } from "react-router-dom";
import { OverridableStringUnion } from "@mui/types";
import { getAppropriateDateFormat, getAppropriateDateFormat2 } from "../helper";
import UnitDetailCard from "../common/unit-detail-card";
import AvatarGroup from "components/avatar-group";
import TrackerUtil from "utils/tracker";
import ScopeCategoryRow from "./scope-category-row";
import { shallowEqual } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";

interface IUnitSideTrayProps {
    data: any;
    onClose: () => void;
    // eslint-disable-next-line no-unused-vars
    onChangeUnit: (arg1: any, arg2: string) => void;
    // eslint-disable-next-line no-unused-vars
    onSignOffUnit?: () => void;
    unscheduleUnit: () => void;
    isLoading: boolean;
    onReleaseUnit: () => void;
    // eslint-disable-next-line no-unused-vars
    onScheduleUnit: (scheduledDate: string) => void;
}

const UnitSideTray = ({
    data,
    onClose,
    onChangeUnit,
    onSignOffUnit,
    unscheduleUnit,
    onReleaseUnit,
    isLoading,
    onScheduleUnit,
}: IUnitSideTrayProps) => {
    const { constants, hasFeature, isRFPProject } = useProductionContext();

    const canEditUnitInfo = hasFeature(FEATURE_FLAGS.EDIT_UNIT_RELEASE_INFO);
    const canReview = hasFeature(FEATURE_FLAGS.REVIEW_CHANGE_ORDER);
    const [scopeCategoriesMap, setScopeCategoriesMap] = useState<any>();

    const { unitScopes, projectName } = useAppSelector((state) => {
        return {
            unitScopes: state.renoUnitScopesData.unitScopes[data?.id as string],
            projectName: state.singleProject.projectDetails?.name,
        };
    }, shallowEqual);

    const navigate = useNavigate();
    const { projectId } = useParams();
    const dispatch = useAppDispatch();

    const elementRef = useRef<HTMLDivElement>(null);
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    const setCategoryMap = (unitScopes: Array<any>) => {
        const newCategoryMap = new Map();

        const assignedCategories: Array<any> = [];
        const unAssignedCategories: Array<any> = [];

        unitScopes.forEach((scope) => {
            if (scope.subs?.length > 0) {
                assignedCategories.push({ ...scope });
            } else {
                unAssignedCategories.push({ ...scope });
            }
        });

        newCategoryMap.set("assigned", [...assignedCategories]);
        newCategoryMap.set("unassigned", [...unAssignedCategories]);
        setScopeCategoriesMap(newCategoryMap);
    };

    const getUnitScopes = () => {
        if (!unitScopes) {
            dispatch(
                actions.production.unitScopes.fetchRenoUnitScopesStart({
                    renoUnitId: data?.id,
                }),
            );
        } else {
            setCategoryMap(unitScopes);
        }
    };

    useEffect(() => {
        getUnitScopes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unitScopes]);

    const {
        handleSubmit,
        formState: { isValid, isDirty },
    } = useForm({
        defaultValues: {
            renovation_start_date: getAppropriateDateFormat(data?.renovation_start_date),
            renovation_end_date: getAppropriateDateFormat(data?.renovation_end_date),
            move_out_date: getAppropriateDateFormat(data?.move_out_date),
            make_ready_date: getAppropriateDateFormat(data?.make_ready_date),
            move_in_date: getAppropriateDateFormat(data?.move_in_date),
        },
        mode: "onChange",
    });

    const { contractors } = useAppSelector((state) => {
        return {
            contractors: state.ims.ims.contractors,
        };
    }, shallowEqual);

    useEffect(() => {
        if (!contractors || !contractors?.length) {
            dispatch(actions.imsActions.fetchContractorStart({}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractors]);

    const [renovation_start_date, set_renovation_start_date] = useState("");
    const [renovation_end_date, set_renovation_end_date] = useState("");
    const [move_in_date, set_move_in_date] = useState("");
    const [move_out_date, set_move_out_date] = useState("");
    const [make_ready_date, set_make_ready_date] = useState("");

    useEffect(() => {
        set_renovation_start_date(getAppropriateDateFormat(data?.renovation_start_date));
        set_renovation_end_date(getAppropriateDateFormat(data?.renovation_end_date));
        set_move_out_date(
            data?.move_out_date ? getAppropriateDateFormat(data?.move_out_date) : (null as any),
        );
        set_move_in_date(
            data?.move_in_date ? getAppropriateDateFormat(data?.move_in_date) : (null as any),
        );
        set_make_ready_date(
            data?.make_ready_date ? getAppropriateDateFormat(data?.make_ready_date) : (null as any),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const possibleUnitStatuses = constants.RenovationUnitStatus ?? [];

    const keysEditable = [
        "renovation_start_date",
        "renovation_end_date",
        "move_out_date",
        "make_ready_date",
        "move_in_date",
    ];

    const getContractor = () => {
        return contractors?.find((c) => c.id === data?.general_contractor)?.name;
    };

    const trackEvent = (event: string, payload: any) => {
        TrackerUtil.event(event, payload);
    };

    const onSave = (changedData: any, type: string) => {
        let isChanged = false;
        if (isDirty || type === "NonRenoUnit") {
            const editedData = keysEditable.reduce((updatedData: any, key) => {
                const originalData = getAppropriateDateFormat2(data[key]);
                const newData = getAppropriateDateFormat2(changedData[key]);

                if (originalData != newData) {
                    isChanged = true;
                    updatedData[key] = newData;
                } else {
                    updatedData[key] = originalData;
                }

                return updatedData;
            }, {});

            if (isChanged) {
                if (type == "scheduleUnit") {
                    trackEvent("CLICKED_SCHEDULE_UNIT", {
                        renoUnitId: data?.id,
                        projectName,
                    });
                } else {
                    trackEvent("UPDATE_UNIT", {
                        renoUnitId: data?.id,
                        projectName,
                    });
                }
                onChangeUnit(editedData, type);
            } else if (type === "NonRenoUnit") {
                onChangeUnit({ ...editedData, status: changedData.status }, type);
            }
        }
    };

    const getViewDetailButton = () => {
        return (
            <Button
                variant={"contained"}
                color="secondary"
                onClick={() => {
                    navigate(`${productionTabUrl(projectId, isRFPProject)}/units/${data?.id}`, {
                        state: { from: "units" },
                    });
                }}
                style={{ height: "36px", width: "100%" }}
            >
                <Typography variant="text_16_medium">View Details</Typography>
            </Button>
        );
    };

    const getScheduleUnitButton = () => {
        const title = data.release_date ? "Reschedule Unit" : "Schedule Unit";
        const tooltip = "Select a future date to schedule the unit release";
        return (
            <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MuiDatePicker
                        onClose={() => {
                            setDatePickerOpen(false);
                        }}
                        open={isDatePickerOpen}
                        value={data?.release_date}
                        onChange={(arg) => {
                            const scheduledDate = (arg as any)?.toDate?.();
                            const offset = scheduledDate.getTimezoneOffset() * 60 * 1000;
                            const adjustedDate = new Date(scheduledDate.getTime() - offset);
                            const formattedDate = adjustedDate.toISOString().split("T")[0];
                            onScheduleUnit(formattedDate);
                        }}
                        renderInput={(props) => (
                            <>
                                {/* The textfield is required to open the date-selection-modal in the same position as the button */}
                                <TextField
                                    {...props}
                                    style={{
                                        visibility: "hidden",
                                        height: "0px",
                                        position: "absolute",
                                    }}
                                />
                                <Tooltip title={tooltip}>
                                    <Button
                                        startIcon={<EditCalendar />}
                                        fullWidth
                                        variant={"contained"}
                                        color="primary"
                                        onClick={() => {
                                            setDatePickerOpen(true);
                                        }}
                                        style={{
                                            height: "36px",
                                            width: "100%",
                                        }}
                                    >
                                        <Typography variant="text_16_medium">{title}</Typography>
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                    />
                </LocalizationProvider>
            </>
        );
    };

    const getSaveChangesButton = (
        variant: OverridableStringUnion<"outlined" | "text" | "contained"> = "outlined",
        style?: any,
    ) => {
        return (
            <Button
                variant={variant}
                color="primary"
                onClick={handleSubmit((data) => onSave(data, "updateUnit"))}
                disabled={!isValid || !isDirty}
                style={style || { height: "36px", width: "100%" }}
            >
                <Typography variant="text_16_medium">Save Changes</Typography>
            </Button>
        );
    };

    const moveToFromNonRenoButton = (is_not_renovating: Boolean) => {
        return (
            <Button
                variant={"outlined"}
                color="primary"
                onClick={() =>
                    onSave(
                        { ...data, status: is_not_renovating ? "not_renovating" : "not_started" },
                        "NonRenoUnit",
                    )
                }
                // disabled={!isValid || !isDirty}
                style={{ height: "36px", width: "100%" }}
            >
                <Typography variant="text_16_medium">
                    {is_not_renovating ? "Move Unit To Non-Renovation" : "Move Unit To Renovation"}
                </Typography>
            </Button>
        );
    };
    const getPendingApprovalButtonAction = (): ReactNode => {
        if (canReview) {
            return (
                <>
                    {getViewDetailButton()}
                    <div style={{ display: "flex", gap: "12px" }}>
                        {getSaveChangesButton("outlined", { height: "36px", width: "50%" })}
                        {moveToFromNonRenoButton(true)}
                        <Button
                            variant={"contained"}
                            color="success"
                            onClick={() => onSignOffUnit && onSignOffUnit()}
                            style={{ height: "36px", width: "100%" }}
                        >
                            <Typography variant="text_16_medium">Sign Off Unit</Typography>
                        </Button>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    {getViewDetailButton()}
                    {getSaveChangesButton()}
                    {moveToFromNonRenoButton(true)}
                </>
            );
        }
    };

    const getEndDateNote = (): ReactNode => {
        return (
            <Alert severity="info">
                The Renovation Start Date is initially calculated as release date. The Renovation
                End Date is initially calculated as release date + projected unit renovation
                duration days. The Renovation Start and End dates can be adjusted later once the
                unit becomes available for renovation.
            </Alert>
        );
    };

    const getReleaseUnitButton = (): ReactNode => {
        return (
            <Tooltip title="Release Unit Immediately for Renovation">
                <Button
                    fullWidth
                    variant={"contained"}
                    color="primary"
                    onClick={onReleaseUnit}
                    style={{ height: "36px", width: "100%" }}
                >
                    <Typography variant="text_16_medium">Release Unit</Typography>
                </Button>
            </Tooltip>
        );
    };

    const getButtonAction = (): ReactNode => {
        switch (data?.status) {
            case "unscheduled":
                return (
                    <>
                        {getViewDetailButton()}
                        {moveToFromNonRenoButton(true)}
                        <Grid container gap={4}>
                            <Grid item flex={1}>
                                {getReleaseUnitButton()}
                            </Grid>
                            <Grid item flex={1}>
                                {getScheduleUnitButton()}
                            </Grid>
                        </Grid>
                        {getEndDateNote()}
                    </>
                );

            case "scheduled":
                return (
                    <>
                        {getViewDetailButton()}
                        {getSaveChangesButton()}
                        {moveToFromNonRenoButton(true)}
                        <Grid container gap={1} flexDirection={"row"}>
                            <Grid item flex={3}>
                                <Tooltip title="Remove Scheduled Release Date for Unit">
                                    <Button
                                        fullWidth
                                        variant={"outlined"}
                                        color="primary"
                                        onClick={() => unscheduleUnit()}
                                        style={{ height: "36px" }}
                                    >
                                        <Typography variant="text_16_medium">
                                            Unschedule Unit
                                        </Typography>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item flex={3}>
                                {getReleaseUnitButton()}
                            </Grid>
                            <Grid item flex={4}>
                                {getScheduleUnitButton()}
                            </Grid>
                        </Grid>
                        {getEndDateNote()}
                    </>
                );

            case "not_started":
                return <>{moveToFromNonRenoButton(true)}</>;
            case "in_progress":
                return <>{moveToFromNonRenoButton(true)}</>;
            case "completed":
                return (
                    <>
                        {getViewDetailButton()}
                        {getSaveChangesButton()}
                    </>
                );
            case "pending_approval":
                return getPendingApprovalButtonAction();
            case "not_renovating":
                return <>{moveToFromNonRenoButton(false)}</>;
        }
    };

    const getScopeCategoriesElement = () => {
        if (!scopeCategoriesMap) {
            return <></>;
        }
        const assigned = scopeCategoriesMap?.get("assigned") || [];
        const unassigned = scopeCategoriesMap?.get("unassigned") || [];

        return (
            <Grid container gap={3} display="flex" flexDirection="column">
                {data?.status == "scheduled" && (
                    <Grid item>
                        <Typography variant="text_14_semibold">
                            <Grid item>
                                <Typography variant="text_14_semibold">
                                    Scheduled Date Of Release -{" "}
                                    {getAppropriateDateFormat(data?.renovation_start_date)}
                                </Typography>
                            </Grid>{" "}
                        </Typography>
                    </Grid>
                )}
                <Grid item>
                    <Typography variant="text_14_semibold">
                        Unassigned Scope Categories ({unassigned?.length})
                    </Typography>
                </Grid>
                {unassigned?.map((scopeCategory: any) => (
                    <Grid item key={scopeCategory?.id}>
                        <ScopeCategoryRow scopeData={scopeCategory} />
                    </Grid>
                ))}
                <Grid item>
                    <Typography variant="text_14_semibold">
                        Assigned Scope Categories ({assigned?.length})
                    </Typography>
                </Grid>
                {assigned?.map((scopeCategory: any) => (
                    <Grid item key={scopeCategory?.id}>
                        <ScopeCategoryRow scopeData={scopeCategory} />
                    </Grid>
                ))}
            </Grid>
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
                {getButtonAction()}
            </Grid>
        );
    };

    const getTrayHeader = () => {
        const unitStatus = possibleUnitStatuses?.find((status: any) => {
            return status.value === data?.status;
        });

        const props = UNIT_STATUS_COLOR_MAP[data?.status];

        const allProps = {
            ...props,
            label: unitStatus?.display,
        };

        return (
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="text_18_medium">{data?.unit_name}</Typography>
                </Grid>
                <Grid item marginLeft="auto">
                    <BaseChip {...allProps} sx={{ borderRadius: "4px" }} />
                    <IconButton onClick={onClose} sx={{ paddingRight: 0 }}>
                        <Clear />
                    </IconButton>
                </Grid>
            </Grid>
        );
    };

    const subsNames = (): string[] => {
        return data?.subs?.map((sub: any) => sub.name) || [];
    };

    const getInfoHeader = () => {
        return (
            <Grid container justifyContent={"space-between"} flexDirection={"row"}>
                <Grid flexDirection={"row"}>
                    <Grid container gap={2}>
                        <Grid>
                            <Typography>Unit Type</Typography>
                        </Grid>
                        <Grid>
                            <Typography fontWeight={"bold"}>{data?.unit_type}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid flexDirection={"row"}>
                    <Grid container gap={2}>
                        <Grid>
                            <Typography>Floor Plan</Typography>
                        </Grid>
                        <Grid>
                            <Typography fontWeight={"bold"}>{data?.floor_plan_name}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid flexDirection={"row"}>
                    <Grid container gap={2}>
                        <Grid>
                            <Typography>Sq FT</Typography>
                        </Grid>
                        <Grid>
                            <Typography fontWeight={"bold"}>{data?.area}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    return canEditUnitInfo ? (
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
                    <Grid item>{getTrayHeader()}</Grid>
                    <Grid container item flexDirection="column" gap={6}>
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <Grid item>{getInfoHeader()}</Grid>
                                {[
                                    "in_progress",
                                    "completed",
                                    "not_started",
                                    "pending_approval",
                                ].includes(data.status) && (
                                    <>
                                        <Grid item>
                                            <DatePicker
                                                value={renovation_start_date}
                                                label="Start Date"
                                                onChange={(newDate: any) => {
                                                    const renovation_start_date =
                                                        newDate?.format("YYYY-MM-DD");
                                                    set_renovation_start_date(
                                                        renovation_start_date,
                                                    );
                                                    if (renovation_start_date) {
                                                        dispatch(
                                                            actions.production.unit.updateRenovationUnitDatesStart(
                                                                {
                                                                    renoUnitId: data?.id,
                                                                    renovation_start_date,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <DatePicker
                                                value={renovation_end_date}
                                                label="End Date"
                                                onChange={(newDate: any) => {
                                                    const renovation_end_date =
                                                        newDate?.format("YYYY-MM-DD");
                                                    set_renovation_end_date(renovation_end_date);
                                                    if (renovation_end_date) {
                                                        dispatch(
                                                            actions.production.unit.updateRenovationUnitDatesStart(
                                                                {
                                                                    renoUnitId: data?.id,
                                                                    renovation_end_date,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <DatePicker
                                                value={move_in_date}
                                                label="Move In "
                                                onChange={(newDate: any) => {
                                                    const move_in_date =
                                                        newDate?.format("YYYY-MM-DD");
                                                    set_move_in_date(move_in_date);
                                                    if (move_in_date) {
                                                        dispatch(
                                                            actions.production.unit.updateRenovationUnitDatesStart(
                                                                {
                                                                    renoUnitId: data?.id,
                                                                    move_in_date,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <DatePicker
                                                value={move_out_date}
                                                label="Move Out "
                                                onChange={(newDate: any) => {
                                                    const move_out_date =
                                                        newDate?.format("YYYY-MM-DD");
                                                    set_move_out_date(move_out_date);
                                                    if (move_out_date) {
                                                        dispatch(
                                                            actions.production.unit.updateRenovationUnitDatesStart(
                                                                {
                                                                    renoUnitId: data?.id,
                                                                    move_out_date,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <DatePicker
                                                value={make_ready_date}
                                                label="Make Ready "
                                                onChange={(newDate: any) => {
                                                    const make_ready_date =
                                                        newDate?.format("YYYY-MM-DD");
                                                    set_make_ready_date(make_ready_date);
                                                    if (make_ready_date) {
                                                        dispatch(
                                                            actions.production.unit.updateRenovationUnitDatesStart(
                                                                {
                                                                    renoUnitId: data?.id,
                                                                    make_ready_date,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </>
                                )}

                                {getScopeCategoriesElement()}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            {!isLoading && getSideTrayActionButtons()}
        </Grid>
    ) : (
        <UnitDetailCard
            unit={data}
            height={"54vh"}
            onClose={onClose}
            rows={[
                {
                    key: "General Contractor",
                    value: getContractor() || "-",
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
                    value: getAppropriateDateFormat(data?.renovation_start_date),
                },
                {
                    key: "End Date",
                    value: getAppropriateDateFormat(data?.renovation_end_date),
                },
                {
                    key: "Make-ready Date",
                    value: getAppropriateDateFormat(data?.make_ready_date),
                },
                {
                    key: "Move-out Date",
                    value: getAppropriateDateFormat(data?.move_out_date),
                },
                {
                    key: "Move-in Date",
                    value: getAppropriateDateFormat(data?.move_in_date),
                },
            ]}
            actionItemComponent={getScopeCategoriesElement()}
            actionButtons={getViewDetailButton()}
        />
    );
};

export default UnitSideTray;
