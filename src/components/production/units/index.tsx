import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import EventIcon from "@mui/icons-material/Event";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import BaseSnackbar from "components/base-snackbar";
import VirtualizedList from "components/virtualized-list";
import ZeroStateComponent from "components/zero-state";
import { useProductionContext } from "context/production-context";
import { isEmpty, isNil } from "lodash";
import { useSnackbar } from "notistack";
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import TrackerUtil from "utils/tracker";
import { ReactComponent as TableRowsIcon } from "../../../assets/icons/table-rows.svg";
import { ReactComponent as ViewTimelineIcon } from "../../../assets/icons/view-timeline.svg";
import SearchFilters from "../common/search-filters";
import { FEATURE_FLAGS, productionTabUrl } from "../constants";
import UnitRenovationFilters from "./renovation-unit-filter";
import UnitCard from "./unit-card";
import UnitGantt from "./unit-gantt";
import UnitSideTray from "./unit-side-tray";
import UnitsBlukUpdater from "./units-bulk-updater";

export type unitType = "released" | "scheduled" | "unscheduled" | "nonReno";

const getFilterButtons = (
    selected: string,
    countInfo: any,
    // eslint-disable-next-line no-unused-vars
    onChangeUnitType: (arg: unitType) => void,
): ReactNode => {
    return (
        <Grid container gap={5} alignItems="center">
            <Grid item>
                <Button
                    variant={selected == "released" ? "contained" : "outlined"}
                    startIcon={<TimelineIcon />}
                    color="primary"
                    onClick={() => onChangeUnitType("released")}
                >
                    <Typography variant="text_14_medium">
                        Released ({countInfo.released})
                    </Typography>
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant={selected == "scheduled" ? "contained" : "outlined"}
                    startIcon={<EventIcon />}
                    color="primary"
                    onClick={() => onChangeUnitType("scheduled")}
                >
                    <Typography variant="text_14_medium">
                        Scheduled ({countInfo.scheduled})
                    </Typography>
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant={selected == "unscheduled" ? "contained" : "outlined"}
                    startIcon={<EventIcon />}
                    color="primary"
                    onClick={() => onChangeUnitType("unscheduled")}
                >
                    <Typography variant="text_14_medium">
                        Not Scheduled ({countInfo.unscheduled})
                    </Typography>
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant={selected == "nonReno" ? "contained" : "outlined"}
                    startIcon={<DoNotDisturbAltIcon />}
                    color="primary"
                    onClick={() => onChangeUnitType("nonReno")}
                >
                    <Typography variant="text_14_medium">Non-reno ({countInfo.nonReno})</Typography>
                </Button>
            </Grid>
        </Grid>
    );
};
const Units = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const { isRFPProject } = useProductionContext();
    const navigate = useNavigate();

    const location = useLocation() as any;

    const [allReleasedRenovationUnits, setAllReleasedRenovationUnits] = useState<any>(null);
    const [allScheduledRenovationUnits, setAllScheduledRenovationUnits] = useState<any>(null);
    const [allUnscheduledRenovationUnits, setAllUnscheduledRenovationUnits] = useState<any>(null);
    const [allNonRenovationUnits, setAllNonRenovationUnits] = useState<any>(null);

    const [releasedRenovationUnits, setReleasedRenovationUnits] = useState<any>(null);
    const [scheduledRenovationUnits, setScheduledRenovationUnits] = useState<any>(null);
    const [unscheduledRenovationUnits, setUnscheduledRenovationUnits] = useState<any>(null);
    const [nonRenovationUnits, setNonRenovationUnits] = useState<any>(null);
    const { renoUnits, loading, floorplans, sidebarLoading, snackbarState, projectDetails } =
        useAppSelector((state) => {
            return {
                renoUnits: state.renoUnitsData.renoUnits,
                loading: state.renoUnitsData.loading,
                floorplans: state.projectFloorplans.floorplans,
                sidebarLoading: state.renoUnitsData.isUpdating || state.approvalState.reviewing,
                snackbarState: state.common.snackbar,
                projectDetails: state.singleProject.projectDetails,
            };
        }, shallowEqual);

    const [sideBarUnit, setSideBarUnit] = useState(null as any);
    const [selectedType, setSelectedType] = useState<unitType>("released");
    const [showGanttView, setShowGanttView] = useState<boolean>(false);
    const [filters, setFilters] = useState<any>({ unitStatus: [], unitType: [], floorPlan: [] });

    const [searchFilters, setSearchFilters] = useState<any>({
        unitId: undefined,
        contractor: undefined,
    });

    const [checkedUnitMap, setCheckedUnitMap] = useState<{ [k: string]: boolean }>({});
    const handleCheckBoxClick = (id: string) => {
        setCheckedUnitMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
    };

    const setCheckAll = (isChecked: boolean) => {
        let map: any = {};
        if (!isChecked) {
            mapUnitsData().map((unit: any) => {
                map[unit.id] = true;
            });
        }
        setCheckedUnitMap(map);
    };

    const checkedUnits = useMemo(
        () => Object.keys(checkedUnitMap).filter((id: string) => !!checkedUnitMap[id]),
        [checkedUnitMap],
    );

    useEffect(() => {
        TrackerUtil.event("PRODUCTION_UNITS_SCREEN", {
            projectId,
            projectName: projectDetails?.name,
        });
        if (!renoUnits) {
            getRenovationUnits(projectId as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // on notification click action
        if (location?.state?.unitId && renoUnits?.length) {
            if (
                isSearchFilterApplied() ||
                filters?.unitStatus?.length > 0 ||
                filters?.unitType?.length > 0 ||
                filters?.floorPlan?.length > 0
            ) {
                setFilters({ unitStatus: [], unitType: [], floorPlan: [] });
                setSearchFilters({
                    unitId: undefined,
                    contractor: undefined,
                });
            } else {
                const renoUnitData: any = renoUnits?.find(
                    (unit: any) => unit.id === location?.state?.unitId,
                );
                if (renoUnitData) {
                    navigate(location.pathname, {});
                    if (renoUnitData?.status === "unscheduled") {
                        setSelectedType("unscheduled");
                    } else if (renoUnitData?.status === "scheduled") {
                        setSelectedType("scheduled");
                    } else {
                        setSelectedType("released");
                    }
                    setSideBarUnit(renoUnitData);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, releasedRenovationUnits, scheduledRenovationUnits, unscheduledRenovationUnits]);

    useEffect(() => {
        if (sideBarUnit?.id) {
            const updatedUnitData: any = renoUnits?.find(
                (unit: any) => unit.id === sideBarUnit?.id,
            );

            switch (updatedUnitData?.status) {
                case "scheduled":
                    setSelectedType("scheduled");
                    break;
                case "unscheduled":
                    setSelectedType("unscheduled");
                    break;
                case "not_renovating":
                    setSelectedType("nonReno");
                    break;
                default:
                    setSelectedType("released");
            }
            setSideBarUnit(updatedUnitData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renoUnits]);

    useEffect(() => {
        if (renoUnits && renoUnits?.length > 0) {
            const scheduledUnits = [];
            const unscheduledUnits = [];
            const releasedUnits = [];
            const nonRenoUnits = [];

            renoUnits?.forEach((unit: any) => {
                if (unit?.status === "unscheduled") {
                    unscheduledUnits.push(unit);
                } else if (unit?.status === "scheduled") {
                    scheduledUnits.push(unit);
                } else if (unit?.status === "not_renovating") {
                    nonRenoUnits.push(unit);
                } else {
                    releasedUnits.push(unit);
                }
            });

            TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                pageName: "released-unit-list",
                dataLength: releasedUnits?.length,
                projectName: projectDetails?.name,
            });
            TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                pageName: "non-released-unit-list",
                dataLength: scheduledUnits?.length + unscheduledUnits?.length,
                projectName: projectDetails?.name,
            });
            TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                pageName: "non-reno-unit-list",
                dataLength: nonRenoUnits?.length,
                projectName: projectDetails?.name,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renoUnits?.length]);

    useEffect(() => {
        if (isEmpty(floorplans?.data)) {
            dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { hasFeature } = useProductionContext();

    const { enqueueSnackbar } = useSnackbar();

    const showSnackBar = (variant: any, message: string = "") => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
            onClose: () => {
                dispatch(actions.common.closeSnack());
            },
        });
    };

    useEffect(() => {
        if (snackbarState.open) {
            showSnackBar(snackbarState.variant, snackbarState.message as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState]);

    const setRenovationUnits = (allUnits: Array<any>) => {
        const releasedUnits: Array<any> = [];
        const scheduledUnits: Array<any> = [];
        const unscheduledUnits: Array<any> = [];
        const nonRenoUnits: Array<any> = [];

        allUnits?.forEach((unit: any) => {
            if (unit?.status === "scheduled") {
                scheduledUnits.push(unit);
            } else if (unit?.status === "not_renovating") {
                nonRenoUnits.push(unit);
            } else if (unit?.status === "unscheduled") {
                unscheduledUnits.push(unit);
            } else {
                releasedUnits.push(unit);
            }
        });

        setAllReleasedRenovationUnits(releasedUnits);
        setAllScheduledRenovationUnits(scheduledUnits);
        setAllUnscheduledRenovationUnits(unscheduledUnits);
        setAllNonRenovationUnits(nonRenoUnits);
    };

    const isSearchFilterApplied = () => {
        return !(isNil(searchFilters?.unitId) && isNil(searchFilters?.contractor));
    };

    const containsContractor = (cList: Array<any>, cId: string) => {
        return cList?.find((contractor) => contractor?.id === cId);
    };

    const getFilteredResult = (units: Array<any>) => {
        const filteredList = units?.filter((unit: any) => {
            let isMatched = true;
            if (searchFilters?.unitId) {
                isMatched = isMatched && unit?.id === searchFilters?.unitId;
            }
            if (searchFilters?.contractor) {
                isMatched = isMatched && containsContractor(unit?.subs, searchFilters?.contractor);
            }
            return isMatched;
        });

        return filteredList || [];
    };

    useEffect(() => {
        const isSearchApplied = isSearchFilterApplied();

        const releasedFilteredList = isSearchApplied
            ? getFilteredResult(allReleasedRenovationUnits)
            : allReleasedRenovationUnits;
        setReleasedRenovationUnits(releasedFilteredList);

        const scheduledFilteredList = isSearchApplied
            ? getFilteredResult(allScheduledRenovationUnits)
            : allScheduledRenovationUnits;
        setScheduledRenovationUnits(scheduledFilteredList);

        const unscheduledFilteredList = isSearchApplied
            ? getFilteredResult(allUnscheduledRenovationUnits)
            : allUnscheduledRenovationUnits;
        setUnscheduledRenovationUnits(unscheduledFilteredList);

        const nonRenoFilteredList = isSearchApplied
            ? getFilteredResult(allNonRenovationUnits)
            : allNonRenovationUnits;
        setNonRenovationUnits(nonRenoFilteredList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        allReleasedRenovationUnits,
        allScheduledRenovationUnits,
        allUnscheduledRenovationUnits,
        allNonRenovationUnits,
        searchFilters,
    ]);

    function getRenovationUnits(projectId: string) {
        dispatch(
            actions.production.unit.fetchRenovationUnitsStart({
                project_id: projectId,
            }),
        );
    }

    const getUnitTypeCountInfo = () => {
        return {
            released: allReleasedRenovationUnits?.length || 0,
            scheduled: allScheduledRenovationUnits?.length || 0,
            unscheduled: allUnscheduledRenovationUnits?.length || 0,
            nonReno: allNonRenovationUnits?.length || 0,
        };
    };

    const onChangeUnitType = (type: unitType) => {
        setSideBarUnit(undefined);
        setSelectedType(type);
    };

    const mapUnitsData = useCallback(() => {
        if (selectedType === "released") {
            return releasedRenovationUnits || [];
        } else if (selectedType === "scheduled") {
            return scheduledRenovationUnits || [];
        } else if (selectedType === "unscheduled") {
            return unscheduledRenovationUnits || [];
        } else {
            return nonRenovationUnits || [];
        }
    }, [
        selectedType,
        releasedRenovationUnits,
        scheduledRenovationUnits,
        unscheduledRenovationUnits,
        nonRenovationUnits,
    ]);

    const onFilterClick = (type: string, values: string[]) => {
        setFilters((prev: any) => ({ ...prev, [type]: values || [] }));
    };

    useEffect(() => {
        resetUnitMap();
    }, [selectedType]);

    useEffect(() => {
        if (releasedRenovationUnits?.length == 0 && selectedType === "released") {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [releasedRenovationUnits?.length, selectedType]);

    useEffect(() => {
        if (scheduledRenovationUnits?.length == 0 && selectedType === "scheduled") {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduledRenovationUnits?.length, selectedType]);

    useEffect(() => {
        if (unscheduledRenovationUnits?.length == 0 && selectedType === "unscheduled") {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unscheduledRenovationUnits?.length, selectedType]);

    useEffect(() => {
        if (nonRenovationUnits?.length == 0 && selectedType === "nonReno") {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nonRenovationUnits?.length, selectedType]);

    useEffect(() => {
        let filteredList = [];
        if (
            filters?.unitStatus?.length > 0 ||
            filters?.unitType?.length > 0 ||
            filters?.floorPlan?.length > 0
        ) {
            filteredList =
                renoUnits?.filter((renoUnit: any) => {
                    let isMatched = true;
                    if (filters?.unitStatus?.length > 0) {
                        isMatched = isMatched && filters?.unitStatus.includes(renoUnit.status);
                    }
                    if (filters?.unitType?.length > 0) {
                        isMatched = isMatched && filters?.unitType.includes(renoUnit.unit_type);
                    }
                    if (filters?.floorPlan?.length > 0) {
                        isMatched =
                            isMatched && filters?.floorPlan?.includes(renoUnit.floor_plan_id);
                    }
                    return isMatched;
                }) || [];
            setRenovationUnits(filteredList);
        } else {
            setRenovationUnits(renoUnits || []);
        }
    }, [filters, renoUnits]);

    const onChangeUnitData = (editedData: any, type: string) => {
        dispatch(
            actions.production.unit.updateSingleRenovationUnitStart({
                editedData,
                projectName: projectDetails?.name,
                type,
                renoUnitId: sideBarUnit?.id,
            }),
        );
    };

    const onUnscheduledUnit = () => {
        TrackerUtil.event("CLICKED_UNSCHEDULE_UNIT", {
            renoUnitId: sideBarUnit?.id,
            projectName: projectDetails?.name,
        });

        dispatch(
            actions.production.unit.unscheduleRenovationUnitStart({
                renoUnitId: sideBarUnit?.id,
                projectName: projectDetails?.name,
            }),
        );
    };

    const onReleaseUnit = () => {
        TrackerUtil.event("CLICKED_RELEASE_UNIT", {
            renoUnitId: sideBarUnit?.id,
            projectName: projectDetails?.name,
        });

        dispatch(
            actions.production.unit.releaseRenovationUnitStart({
                renoUnitId: sideBarUnit?.id,
                projectName: projectDetails?.name,
            }),
        );
    };

    const onScheduleUnit = (scheduledDate: string) => {
        TrackerUtil.event("CLICKED_SCHEDULE_UNIT", {
            renoUnitId: sideBarUnit?.id,
            projectName: projectDetails?.name,
            scheduledDate: scheduledDate,
        });

        dispatch(
            actions.production.unit.scheduleRenovationUnitStart({
                renoUnitId: sideBarUnit?.id,
                projectName: projectDetails?.name,
                scheduled_date: scheduledDate,
            }),
        );
    };

    const onSignOffUnit = () => {
        const scopeApprovalId = sideBarUnit?.scope_approval_id;

        TrackerUtil.event("CLICKED_SIGNOFF_UNIT", {
            renoUnitId: sideBarUnit?.id,
            projectName: projectDetails?.name,
        });

        dispatch(
            actions.production.approval.reviewApprovalStart({
                scopeApprovalIds: [scopeApprovalId],
                reviewStatus: "approved",
                renoUnitId: sideBarUnit?.id,
                projectId,
                projectName: projectDetails?.name,
                type: "signoff",
                updatedRenoUnit: {
                    renovation_start_date: sideBarUnit?.renovation_start_date,
                    renovation_end_date: sideBarUnit?.renovation_end_date,
                    move_out_date: sideBarUnit?.move_out_date,
                    make_ready_date: sideBarUnit?.make_ready_date,
                    move_in_date: sideBarUnit?.move_in_date,
                    status: "completed",
                },
            }),
        );
    };

    const getZeroStateTrackingPayload = () => {
        return {
            projectName: projectDetails?.name,
            pageName: "unit-list",
            filters,
            searchFilters,
            projectId,
            tabName: selectedType,
        };
    };

    const onSearchFilterClick = (type: string, value: string) => {
        setSearchFilters((prev: any) => ({ ...prev, [type]: value }));
    };

    const getContractorList = () => {
        const uniqContractorId = new Set();
        const contractorList: Array<any> = [];

        renoUnits?.forEach((unit: any) => {
            unit?.subs.forEach((sub: any) => {
                if (!uniqContractorId.has(sub?.id)) {
                    contractorList.push({ ...sub });
                    uniqContractorId.add(sub.id);
                }
            });
        });
        return contractorList;
    };

    const resetUnitMap = () => {
        setCheckedUnitMap({});
    };

    return (
        <Grid style={{ marginTop: "32px" }} container flexDirection={"row"} gap={4}>
            {loading ? (
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>
            ) : (
                <>
                    <Grid item flex={1}>
                        <UnitRenovationFilters
                            floorPlans={floorplans?.data || []}
                            renovationUnits={renoUnits || []}
                            onFilterClick={onFilterClick}
                        />
                    </Grid>
                    <Grid item flex={5} maxHeight={"70vh"} overflow={"auto"}>
                        <Grid container flexDirection={"column"} gap={4}>
                            <Grid item xs={12} id="unit-tabs-bar">
                                {getFilterButtons(
                                    selectedType,
                                    getUnitTypeCountInfo(),
                                    onChangeUnitType,
                                )}
                            </Grid>
                            {checkedUnits.length ? (
                                <UnitsBlukUpdater
                                    state={selectedType}
                                    checkedUnits={checkedUnits}
                                    projectId={projectId}
                                    resetUnitMap={resetUnitMap}
                                    setSelectedType={setSelectedType}
                                    setCheckAll={setCheckAll}
                                />
                            ) : (
                                <>
                                    <Grid item xs={12} id="unit-search-filters">
                                        <Grid container columnSpacing={2}>
                                            <Grid item flex={1}>
                                                <SearchFilters
                                                    dataList={mapUnitsData() || []}
                                                    onSearchFilterClick={onSearchFilterClick}
                                                    disabled={!getUnitTypeCountInfo()[selectedType]}
                                                    filters={[
                                                        { type: "unitId", placeholder: "Unit" },
                                                        {
                                                            type: "contractor",
                                                            placeholder: "Contractor",
                                                            hide: hasFeature(
                                                                FEATURE_FLAGS.RAISE_CHANGE_ORDER,
                                                            ),
                                                        },
                                                    ]}
                                                    contractorList={getContractorList()}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    onClick={() => setShowGanttView(false)}
                                                    sx={{ opacity: showGanttView ? 0.5 : 1 }}
                                                >
                                                    <TableRowsIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item>
                                                <IconButton
                                                    onClick={() => setShowGanttView(true)}
                                                    sx={{ opacity: showGanttView ? 1 : 0.5 }}
                                                >
                                                    <ViewTimelineIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )}

                            {showGanttView ? (
                                <Grid item style={{ width: "98%", overflowX: "auto" }}>
                                    <UnitGantt units={mapUnitsData()} />
                                </Grid>
                            ) : mapUnitsData()?.length == 0 ? (
                                <Grid item xs={12}>
                                    <ZeroStateComponent label="No Units found" />
                                </Grid>
                            ) : (
                                <Grid item xs={12} container flexDirection="column">
                                    <VirtualizedList
                                        gap={4}
                                        fixedContainerHeight={
                                            window.innerHeight * 0.6 -
                                            Number(
                                                document.getElementById("unit-tabs-bar")
                                                    ?.clientHeight || 50,
                                            ) -
                                            Number(
                                                document.getElementById("unit-search-filters")
                                                    ?.clientHeight || 50,
                                            ) -
                                            Number(
                                                document.getElementById("unit-bulk-updater")
                                                    ?.clientHeight || 50,
                                            ) -
                                            32
                                        }
                                        components={mapUnitsData()?.map((s: any) => (
                                            <UnitCard
                                                key={s.id}
                                                subs={s.subs}
                                                unit={s}
                                                unitStats={s.unit_stats}
                                                unitName={s.unit_name}
                                                checkedUnitMap={checkedUnitMap}
                                                handleCheckBoxClick={handleCheckBoxClick}
                                                makeReady="MM/DD/YYYY"
                                                status={s.status}
                                                onZoomInClick={() => {
                                                    if (checkedUnits.length) {
                                                        handleCheckBoxClick(s.id);
                                                        return;
                                                    }
                                                    setSideBarUnit(s);
                                                }}
                                                shrink={sideBarUnit}
                                                onClick={() => {
                                                    if (checkedUnits.length) {
                                                        handleCheckBoxClick(s.id);
                                                        return;
                                                    }
                                                    if (s.status !== "not_renovating") {
                                                        navigate(
                                                            `${productionTabUrl(
                                                                projectId,
                                                                isRFPProject,
                                                            )}/units/${s?.id}`,
                                                            {
                                                                state: { from: "units" },
                                                            },
                                                        );
                                                    }
                                                }}
                                            />
                                        ))}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    {sideBarUnit && (
                        <Grid flex={2}>
                            <UnitSideTray
                                data={sideBarUnit}
                                onClose={() => setSideBarUnit(null)}
                                onChangeUnit={(data, type) => onChangeUnitData(data, type)}
                                unscheduleUnit={() => onUnscheduledUnit()}
                                isLoading={sidebarLoading || false}
                                onReleaseUnit={() => onReleaseUnit()}
                                onScheduleUnit={(scheduleDate) => onScheduleUnit(scheduleDate)}
                                onSignOffUnit={() => onSignOffUnit()}
                            />
                        </Grid>
                    )}
                </>
            )}
        </Grid>
    );
};

export default Units;
