import React, { useEffect, useState } from "react";
import {
    Avatar,
    Badge,
    Card,
    Checkbox,
    CircularProgress,
    Grid,
    IconButton,
    Popover,
    Tooltip,
    Typography,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { FEATURE_FLAGS, UNIT_STATUS_COLOR_MAP } from "../constants";
import BaseChip from "components/chip";
import { convertToDisplayUnit } from "../converter-util";
import ProgressBar from "../common/progress-bar";
import AppTheme from "styles/theme";
import AvatarGroup from "components/avatar-group";
import { kebabToSentenceCase } from "../approvals/utils";
import { ReactComponent as ZoomIn } from "../../../assets/icons/zoom-in.svg";
import { UnitKPIDetailCard } from "./unit-kpi";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { shallowEqual } from "react-redux";
import { getAppropriateDateFormat } from "../helper";
import { useProductionContext } from "context/production-context";

type IUnitCard = React.ComponentPropsWithRef<"div"> & {
    unitName: string;
    status: string;
    makeReady?: string;
    onZoomInClick: any;
    disableCheckbox?: boolean;
    pendingApprovalCount?: number;
    possibleUnitStatuses?: any;
    unitStats?: any;
    subs?: Array<any>;
    unit?: any;
    shrink?: boolean;
    onClick?: () => void;
    checkedUnitMap?: any;
    handleCheckBoxClick?: any;
};

const UnitCard = ({
    subs,
    unitName,
    pendingApprovalCount,
    status,
    onZoomInClick,
    disableCheckbox,
    possibleUnitStatuses,
    unitStats,
    unit,
    shrink,
    onClick,
    checkedUnitMap,
    handleCheckBoxClick,
}: IUnitCard) => {
    const [infoAnchorEl, setInfoAnchorEl] = useState(null);
    const isOpenInfoPopover = Boolean(infoAnchorEl);
    const { budgetStats } = useAppSelector((state) => {
        return {
            budgetStats:
                state.renoUnitsData.unitsBudget && state.renoUnitsData.unitsBudget[unit.id],
        };
    }, shallowEqual);

    const dispatch = useAppDispatch();

    const chipProps = status
        ? { ...UNIT_STATUS_COLOR_MAP[`${status}`] }
        : {
              variant: "outlined",
              textColor: "#6A6464",
          };

    const calculateProgress = () => {
        if (!unitStats) return 0;
        const { total_work, completed_work } = unitStats;
        return total_work && completed_work ? Math.round((completed_work / total_work) * 100) : 0;
    };

    const subsNames = (): string[] => {
        return subs?.map((sub: any) => sub.name) || [];
    };

    const handleInfoButtonClick = (event: any) => {
        setInfoAnchorEl(event.currentTarget);
    };

    const handleInfoPopoverClose = (event: any) => {
        event.stopPropagation();
        setInfoAnchorEl(null);
    };

    const getUnitStat = () => {
        if (!budgetStats) {
            dispatch(
                actions.production.unit.fetchRenovationUnitBudgetStatStart({
                    renoUnitId: unit.id,
                }),
            );
        }
    };

    useEffect(() => {
        if (isOpenInfoPopover) {
            getUnitStat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenInfoPopover]);

    const setCheck = (e: any) => {
        e?.stopPropagation();
        handleCheckBoxClick(unit?.id);
    };
    const { hasFeature } = useProductionContext();
    const showAdminView = hasFeature(FEATURE_FLAGS.ADMIN_VIEW);

    return (
        <Card
            sx={{
                padding: "12px 20px",
                cursor: onClick ? "pointer" : "auto",
                ":hover": {
                    backgroundColor: onClick && "#E4F7FA",
                },
            }}
            onClick={() => onClick?.()}
        >
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={4}>
                    <Grid container columnSpacing={5} alignItems="center">
                        {!disableCheckbox && showAdminView && (
                            <Grid item>
                                <Checkbox
                                    style={{ color: "grey" }}
                                    onClick={setCheck}
                                    checked={checkedUnitMap[unit?.id]}
                                />
                            </Grid>
                        )}
                        <Grid item>
                            <Typography color="primary" variant="text_24_medium">
                                {unitName ?? ""}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                sx={{ padding: 0, zIndex: 10 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleInfoButtonClick(e);
                                }}
                            >
                                <InfoOutlined htmlColor="#CACACA" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={4}>
                            <BaseChip
                                label={
                                    possibleUnitStatuses
                                        ? convertToDisplayUnit(status, possibleUnitStatuses)
                                        : kebabToSentenceCase(status)
                                }
                                {...chipProps}
                                sx={{ borderRadius: "4px" }}
                            />
                        </Grid>
                        {!!pendingApprovalCount && pendingApprovalCount > 0 && (
                            <Grid item>
                                <Badge
                                    badgeContent={
                                        <Typography
                                            variant="text_14_medium"
                                            color={AppTheme.text.white}
                                        >
                                            {pendingApprovalCount}
                                        </Typography>
                                    }
                                    color="error"
                                    invisible={false}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Grid item xs={5}>
                    <Grid
                        container
                        columnSpacing={10}
                        alignItems="center"
                        justifyContent="flex-start"
                    >
                        <Grid item xs={6}>
                            {!["scheduled", "unscheduled"].includes(status) && (
                                <ProgressBar value={calculateProgress()} />
                            )}
                        </Grid>
                        {["scheduled"].includes(status) && (
                            <Tooltip
                                title={`The unit will be automatically released by software on ${getAppropriateDateFormat(
                                    unit.release_date,
                                )}`}
                            >
                                <Grid item>
                                    <Grid container columnSpacing={8}>
                                        <Grid item>
                                            <Grid>
                                                <Typography variant="keyText">
                                                    Scheduled Date Of Release
                                                </Typography>
                                            </Grid>
                                            <Grid>
                                                <Typography variant="valueText">
                                                    {getAppropriateDateFormat(
                                                        unit.renovation_start_date,
                                                    )}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Tooltip>
                        )}
                        {!shrink && !["scheduled", "unscheduled"].includes(status) && (
                            <Grid item>
                                <Grid container columnSpacing={8}>
                                    <Grid item>
                                        <Grid>
                                            <Typography variant="keyText">Start Date</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="valueText">
                                                {getAppropriateDateFormat(
                                                    unit.renovation_start_date,
                                                )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Grid>
                                            <Typography variant="keyText">End Date</Typography>
                                        </Grid>
                                        <Grid>
                                            <Typography variant="valueText">
                                                {getAppropriateDateFormat(unit.renovation_end_date)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Grid item xs={3}>
                    <Grid
                        container
                        columnSpacing={4}
                        alignItems="center"
                        justifyContent={"flex-end"}
                    >
                        {/* <Grid item>
                            <Avatar />
                        </Grid>
                        {false && (
                            <>
                                <Grid item>
                                    <ArrowForwardIosIcon
                                        htmlColor={AppTheme.icon.subdued}
                                        sx={{
                                            height: "12px",
                                            width: "12px",
                                            // marginRight: "50px",
                                        }}
                                    />
                                </Grid> */}
                        <Grid item>
                            {subsNames()?.length > 0 ? (
                                <AvatarGroup names={subsNames()} size={32} />
                            ) : (
                                <Avatar sx={{ width: 32, height: 32 }} />
                            )}
                        </Grid>
                        {/* </>
                        )} */}
                        <Grid item>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onZoomInClick();
                                }}
                            >
                                <ZoomIn />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Popover
                id={isOpenInfoPopover ? "kpi-card-popover" : undefined}
                open={isOpenInfoPopover}
                anchorEl={infoAnchorEl}
                onClose={handleInfoPopoverClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                {!budgetStats ? (
                    <div
                        style={{
                            width: "900px",
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </div>
                ) : (
                    <UnitKPIDetailCard
                        unit={{ ...unit, renoBudgetStat: budgetStats }}
                        style={{ padding: "16px", width: "900px" }}
                    />
                )}
            </Popover>
        </Card>
    );
};

export default UnitCard;
