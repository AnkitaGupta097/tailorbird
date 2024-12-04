import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { isEmpty, isNil, sumBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import ApprovalFilters from "./approval-filters";
import { useProductionContext } from "context/production-context";
import UnitCard from "../units/unit-card";
import ZeroStateComponent from "components/zero-state-component";
import { FEATURE_FLAGS, SUBSCRIBE_ORG_UPDATE } from "../constants";
import ApprovalSidetray from "./approval-sidetray";
import actions from "stores/actions";
import { ReactComponent as PendingApprovalIcon } from "../../../assets/icons/pending-approval.svg";
import { ReactComponent as ResolvedApprovalIcon } from "../../../assets/icons/resolved-approval.svg";
import TrackerUtil from "utils/tracker";
import SearchFilters from "../common/search-filters";
import { wsclient } from "stores/gql-client";
import { shallowEqual } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

type ObjectType = {
    [key: string]: any;
};

export type approvalUnitType = "pending" | "resolved";

const Approvals = () => {
    const { hasFeature, projectId } = useProductionContext();
    const dispatch = useAppDispatch();
    const isInitialRender = useRef(true);
    const location = useLocation() as any;
    const navigate = useNavigate();

    const [filters, setFilters] = useState<any>({
        unitStatuses: [],
        approvalType: [],
    });

    const { filteredUnits, allUnits, loading, constants, projectDetails } = useAppSelector(
        (state) => {
            return {
                filteredUnits: state.unitApprovalState.filteredUnits,
                allUnits: state.unitApprovalState.allUnits,
                projectDetails: state.singleProject.projectDetails,
                loading: state.unitApprovalState.loading,
                constants: state.productionProject.constants ?? {},
            };
        },
        shallowEqual,
    );

    const { pendingUnitApprovals: pendingRenoUnits, resolvedUnitApprovals: resolvedRenoUnits } =
        isEmpty(filters.unitStatuses) && isEmpty(filters.approvalType) ? allUnits : filteredUnits;

    const [totalPending, setTotalPending] = useState<number>(0);
    const [totalResolved, setTotalResolved] = useState<number>(0);

    useEffect(() => {
        const pendingCount = sumBy(pendingRenoUnits, "count");
        setTotalPending(pendingCount);
    }, [pendingRenoUnits]);

    useEffect(() => {
        const resolvedCount = sumBy(resolvedRenoUnits, "count");
        setTotalResolved(resolvedCount);
    }, [resolvedRenoUnits]);

    const [filteredPendingRenoUnits, setFilteredPendingRenoUnits] = useState<any>(null);
    const [filteredResolvedRenoUnits, setFilteredResolvedRenoUnits] = useState<any>(null);

    const [sideBarUnit, setSideBarUnit] = useState<ObjectType | undefined>();
    const [currentTab, setCurrentTab] = useState<approvalUnitType>("pending");
    const [searchFilters, setSearchFilters] = useState<any>({
        unitId: undefined,
        contractor: undefined,
    });

    const renovationUnits = currentTab === "pending" ? pendingRenoUnits : resolvedRenoUnits;

    const filteredRenovationUnits =
        currentTab === "pending" ? filteredPendingRenoUnits || [] : filteredResolvedRenoUnits || [];

    useEffect(() => {
        TrackerUtil.event("PRODUCTION_APPROVALS_SCREEN", {
            projectId,
            projectName: projectDetails?.name,
        });
        getRenovationUnits();
        return () => {
            dispatch(actions.production.unitApproval.resetFilteredState());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        getRenovationUnits(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // This effect is for creating a subscription to fetch approvals with filters
    useEffect(
        () => {
            const unsubscribe = wsclient.subscribe(
                {
                    ...SUBSCRIBE_ORG_UPDATE,
                    variables: {
                        organizationId: localStorage.getItem("organization_id"),
                    },
                },
                {
                    next: ({ data }: any) => {
                        const updates = data.SubscribeToOrgUpdates;
                        updates.forEach((event: any) => {
                            if (event.project_id == projectId) {
                                switch (event.event_name) {
                                    case "review_unit_scope_changes":
                                    case "review_scope_item":
                                    case "update_unit_scope":
                                    case "review_pricing_group":
                                        if (
                                            !isEmpty(filters.unitStatuses) ||
                                            !isEmpty(filters.approvalType)
                                        ) {
                                            dispatch(
                                                actions.production.unitApproval.fetchUnitApprovalsStart(
                                                    {
                                                        projectId,
                                                        isReviewed: false,
                                                        approvalType: filters.approvalType,
                                                        unitStatus: filters.unitStatuses,
                                                    },
                                                ),
                                            );
                                            dispatch(
                                                actions.production.unitApproval.fetchUnitApprovalsStart(
                                                    {
                                                        projectId,
                                                        isReviewed: true,
                                                        approvalType: filters.approvalType,
                                                        unitStatus: filters.unitStatuses,
                                                    },
                                                ),
                                            );
                                        }
                                        break;
                                }
                            }
                        });
                    },
                    error: (error: any) => {
                        // Called when an error occurs
                        console.error(error);
                    },
                    complete: () => {
                        // Called when the server signals that there will be no more events
                        console.log("Org Update Subscription is completed");
                    },
                },
            );

            return () => {
                unsubscribe();
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filters],
    );

    const getZeroStateTrackingPayload = () => {
        const payload = {
            pageName: "approval-list",
            filters,
            projectId,
            tabName: currentTab,
            projectName: projectDetails?.name,
        };
        return payload;
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

    const getContractorList = () => {
        const uniqContractorId = new Set();
        const contractorList: Array<any> = [];

        renovationUnits?.forEach((unit: any) => {
            unit?.subs.forEach((sub: any) => {
                if (!uniqContractorId.has(sub?.id)) {
                    contractorList.push({ ...sub });
                    uniqContractorId.add(sub.id);
                }
            });
        });
        return contractorList;
    };

    useEffect(() => {
        const isSearchApplied = isSearchFilterApplied();
        if (currentTab === "pending") {
            const filteredList =
                isSearchApplied && pendingRenoUnits
                    ? getFilteredResult(pendingRenoUnits)
                    : pendingRenoUnits;
            setFilteredPendingRenoUnits(filteredList);
        } else {
            const filteredList =
                isSearchApplied && resolvedRenoUnits
                    ? getFilteredResult(resolvedRenoUnits)
                    : resolvedRenoUnits;
            setFilteredResolvedRenoUnits(filteredList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renovationUnits, searchFilters]);

    useEffect(() => {
        if (currentTab == "pending" && filteredPendingRenoUnits) {
            if (filteredPendingRenoUnits?.length === 0) {
                TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
            } else {
                TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                    pageName: "pending-approval-unit-list",
                    dataLength: filteredPendingRenoUnits.length,
                    pendingApprovalCount: sumBy(filteredPendingRenoUnits, "count"),
                    projectName: projectDetails?.name,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredPendingRenoUnits?.length, currentTab]);

    useEffect(() => {
        if (currentTab == "resolved" && filteredResolvedRenoUnits) {
            if (resolvedRenoUnits?.length === 0) {
                TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
            } else {
                TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                    pageName: "resolved-approval-unit-list",
                    dataLength: filteredResolvedRenoUnits.length,
                    resolvedApprovalCount: sumBy(filteredResolvedRenoUnits, "count"),
                    projectName: projectDetails?.name,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredResolvedRenoUnits?.length, currentTab]);

    useEffect(() => {
        // on notification click action
        if (location?.state?.unitId) {
            let approvalUnit = undefined;
            let tabApprovalUnitBelongs = undefined;
            const unitId = location?.state?.unitId;
            if (
                !(
                    isEmpty(filters.unitStatuses) &&
                    isEmpty(filters.approvalType) &&
                    isEmpty(searchFilters.unitId) &&
                    isEmpty(searchFilters.contractor)
                )
            ) {
                setFilters({
                    unitStatuses: [],
                    approvalType: [],
                });
                setSearchFilters({
                    unitId: undefined,
                    contractor: undefined,
                });
                return;
            }

            if (!location?.state?.isReviewed && !approvalUnit) {
                const unit = pendingRenoUnits?.find((u: any) => u.id === unitId);
                approvalUnit =
                    unit?.approval_ids?.find(
                        (scopeApprovalId: any) =>
                            scopeApprovalId === location?.state?.scopeApprovalId,
                    ) && unit;
                tabApprovalUnitBelongs = "pending";
            }

            if (!approvalUnit) {
                const unit = resolvedRenoUnits?.find((u: any) => u.id === unitId);
                approvalUnit =
                    unit?.approval_ids?.find(
                        (scopeApprovalId: any) =>
                            scopeApprovalId === location?.state?.scopeApprovalId,
                    ) && unit;
                tabApprovalUnitBelongs = "resolved";
            }

            if (approvalUnit) {
                navigate(location.pathname, {});
                setCurrentTab(tabApprovalUnitBelongs as approvalUnitType);
                setSideBarUnit(approvalUnit);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, filteredPendingRenoUnits, filteredResolvedRenoUnits]);

    async function getRenovationUnits(isFilterChange = false) {
        (!pendingRenoUnits || isFilterChange) &&
            dispatch(
                actions.production.unitApproval.fetchUnitApprovalsStart({
                    projectId: projectId,
                    isReviewed: false,
                    approvalType: filters.approvalType,
                    unitStatus: filters.unitStatuses,
                    shouldShowSpinner: true,
                }),
            );

        (!resolvedRenoUnits || isFilterChange) &&
            dispatch(
                actions.production.unitApproval.fetchUnitApprovalsStart({
                    projectId: projectId,
                    isReviewed: true,
                    approvalType: filters.approvalType,
                    unitStatus: filters.unitStatuses,
                    shouldShowSpinner: true,
                }),
            );
    }

    const Header = () => {
        return (
            <>
                <Grid container rowGap={4} flexDirection={"column"}>
                    <Grid item>
                        <Grid container columnSpacing={4} alignItems="flex-start">
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant={currentTab === "pending" ? "contained" : "outlined"}
                                    startIcon={<PendingApprovalIcon style={{ color: "white" }} />}
                                    onClick={() => {
                                        setSideBarUnit(undefined);
                                        setCurrentTab("pending");
                                    }}
                                >
                                    <Typography variant="text_16_medium">{`Pending (${totalPending})`}</Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    startIcon={<ResolvedApprovalIcon />}
                                    variant={currentTab === "resolved" ? "contained" : "outlined"}
                                    onClick={() => {
                                        setSideBarUnit(undefined);
                                        setCurrentTab("resolved");
                                    }}
                                >
                                    <Typography variant="text_16_medium">{`Resolved (${totalResolved})`}</Typography>
                                </Button>
                            </Grid>
                            {/* {currentTab === "pending" && (
                        <Grid item xs container justifyContent="flex-end">
                            <BaseToggle
                                // checked={true}
                                // onChange={() => {}}
                                value="Auto approve all-requests"
                            />
                        </Grid>
                    )} */}
                        </Grid>
                    </Grid>
                    {/* <Grid item>
                        <UnitFilters />
                    </Grid> */}
                </Grid>
            </>
        );
    };

    const onSearchFilterClick = (type: string, value: string) => {
        setSearchFilters((prev: any) => ({ ...prev, [type]: value }));
    };

    const renderApprovalCards = () => {
        return (
            <Grid container flexDirection="row" columnSpacing={4}>
                <Grid item xs>
                    <Grid
                        container
                        flexDirection="column"
                        rowSpacing={2}
                        justifyContent="flex-start"
                    >
                        {filteredRenovationUnits.map((s: any) => (
                            <Grid item key={s.id}>
                                <UnitCard
                                    subs={s.subs}
                                    unit={s}
                                    shrink={!!sideBarUnit}
                                    pendingApprovalCount={
                                        currentTab === "pending" ? s.approval_ids?.length ?? 0 : 0
                                    }
                                    unitStats={s.unit_stats}
                                    unitName={s.unit_name}
                                    status={s.status}
                                    onZoomInClick={() => {
                                        setSideBarUnit(s);
                                    }}
                                    disableCheckbox
                                    possibleUnitStatuses={constants.RenovationUnitStatus ?? []}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                {sideBarUnit && (
                    <Grid item xs={4}>
                        <ApprovalSidetray
                            canReviewRequest={
                                currentTab === "pending" &&
                                hasFeature(FEATURE_FLAGS.REVIEW_CHANGE_ORDER)
                            }
                            activeTab={currentTab}
                            unit={sideBarUnit}
                            onClose={() => {
                                setSideBarUnit(undefined);
                            }}
                            filters={filters}
                        />
                    </Grid>
                )}
            </Grid>
        );
    };

    return (
        <Grid container sx={{ marginTop: "32px", height: "100%" }} columnSpacing={4}>
            <Grid item xs={2}>
                <ApprovalFilters
                    unitStatuses={constants.RenovationUnitStatus ?? []}
                    approvalTypes={constants.ScopeApprovalType ?? []}
                    setFilters={setFilters}
                />
            </Grid>
            <Grid container item xs={10}>
                {loading ? (
                    <div
                        style={{
                            height: "80vh",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </div>
                ) : (
                    <Grid container flexDirection={"column"} gap={4}>
                        <Grid item>
                            <Header />
                        </Grid>
                        <Grid item>
                            <SearchFilters
                                disabled={!renovationUnits?.length}
                                dataList={renovationUnits || []}
                                onSearchFilterClick={onSearchFilterClick}
                                filters={[
                                    { type: "unitId", placeholder: "Unit" },
                                    {
                                        type: "contractor",
                                        placeholder: "Contractor",
                                        hide: hasFeature(FEATURE_FLAGS.RAISE_CHANGE_ORDER),
                                    },
                                ]}
                                contractorList={getContractorList()}
                            />
                        </Grid>
                        {filteredRenovationUnits.length > 0 ? (
                            <Grid item>{renderApprovalCards()}</Grid>
                        ) : (
                            <Grid item style={{ height: "80vh", margin: "auto" }}>
                                <ZeroStateComponent
                                    label={`No ${
                                        currentTab === "pending" ? "Pending" : "Resolved"
                                    } Approvals found`}
                                />
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default Approvals;
