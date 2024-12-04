import { Add, ArrowBack, ZoomIn } from "@mui/icons-material";
import {
    Autocomplete,
    Avatar,
    Badge,
    BadgeProps,
    Button,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FEATURE_FLAGS,
    productionTabUrl,
    UNIT_STATUS_COLOR_MAP,
    UNIT_SCOPE_STATUSES,
    PENDING_ADDITION,
    SCOPE_COMPLETION,
    IN_REVIEW,
    NOT_APPLICABLE,
} from "../constants";
import UnitScopeFilters from "./unit-scope-filter";
import BaseAccordion from "components/base-accordion";
import ScopeItemCard from "./scope-item-card";
import { stringAvatar } from "../../../modules/rfp-manager/helper";
import ZeroStateComponent from "components/zero-state";
import BaseLoader from "components/base-loading";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import styled from "@emotion/styled";
import ConfirmationModal from "components/confirmation-modal";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import UnitScopeSideTray from "./unit-scope-side-tray";
import PriceDisplayElement from "../common/price-display-element";
import FileUploadModal from "./modal/file-upload-modal";
import ScopeStatusChip from "../common/scope-status-chip";
import UnitKPI from "./unit-kpi";
import TrackerUtil from "utils/tracker";
import BaseChip from "components/chip";
import AvatarGroup from "components/avatar-group";
import SearchFilters from "../common/search-filters";
import { isEqual, last } from "lodash";
import BulkActions from "./bulk-actions";
import { shallowEqual } from "react-redux";
import BaseTabs from "components/base-tabs";
import theme from "styles/theme";
import { useProductionContext } from "context/production-context";
import AddNewScopeItemModal from "./add-new-scope-Item-modal";

type IProgressBar = React.ComponentPropsWithRef<"div"> & {
    progress: number;
};

const StyledBadge = styled(Badge)<BadgeProps>({
    "& .MuiBadge-badge": {
        fontWeight: "bold",
    },
});

const ProgressBar = ({ progress }: IProgressBar) => {
    return (
        <Grid container gap={4}>
            <Grid flex={1}>
                <div
                    style={{
                        width: "100%",
                        height: "24px",
                        background: "#BABEC3",
                        borderRadius: "2px",
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "#00B779",
                            borderRadius: "2px",
                        }}
                    ></div>
                </div>
            </Grid>
            <Grid marginLeft={"auto"}>
                <Typography>{progress}% Done</Typography>
            </Grid>
        </Grid>
    );
};

const UnitPage = () => {
    const { unitId: renoUnitId, projectId } = useParams();
    const { state } = useLocation() as any;
    const { isRFPProject } = useProductionContext();

    const {
        organization,
        unitScopes,
        renoUnits,
        unitScopeApprovals,
        snackbarState,
        loading,
        permissions,
        allConstants,
        projectDetails,
    } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            unitScopes: state.renoUnitScopesData.unitScopes[renoUnitId as string],
            loading: state.renoUnitScopesData.loading,
            renoUnits: state.renoUnitsData.renoUnits,
            unitScopeApprovals: state.approvalState.allApprovals[renoUnitId as string],
            snackbarState: state.common.snackbar,
            allConstants: state.productionProject.constants,
            permissions: state.productionProject.featureAccess,
            projectDetails: state.singleProject.projectDetails,
        };
    }, shallowEqual);

    const [currentUnitScopes, setCurrentUnitScopes] = useState<any>(null);

    const [allUnitScopes, setAllUnitScopes] = useState<any>({
        [UNIT_SCOPE_STATUSES.not_started]: null,
        [UNIT_SCOPE_STATUSES.in_progress]: null,
        [UNIT_SCOPE_STATUSES.completed]: null,
    });
    const [currRenoUnit, setCurrRenoUnit] = useState<any>();
    const [scopeApprovalsMap, setScopeApprovalsMap] = useState<Map<number, Array<any>>>();
    const [cancelRequestData, setCancelRequestData] = useState<any>();
    const [sideTrayData, setSideTrayData] = useState<any>();
    const [selectedType, setSelectedType] = useState<string>(UNIT_SCOPE_STATUSES.not_started);
    const [fileUploadModalData, setFileUploadModalData] = useState<any>();
    const [filters, setFilters] = useState<any>({ assignment: [], status: [] });
    const [searchFilters, setSearchFilters] = useState<any>({
        scopeId: undefined,
        contractor: undefined,
    });
    const [startScopes, setStartScopes] = useState<string[]>([]);
    const [markCompleteScopes, setMarkCompleteScopes] = useState<string[]>([]);
    const [newItemCategory, setNewItemCategory] = useState<any>();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const getZeroStateTrackingPayload = () => {
        const payload = {
            pageName: "unit-scope-list",
            filters,
            searchFilters,
            renoUnitId,
            projectId,
            tabName: selectedType,
            projectName: projectDetails?.name,
        };
        return payload;
    };

    useEffect(() => {
        getAllUnitScopeStatuses();
        getUnits();
        getUnitScopes();
        getUnitScopeApprovals();
        if (!organization) {
            dispatch(actions.tpsm.fetchOrganizationStart(""));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (snackbarState.open) {
            showSnackBar(snackbarState.variant, snackbarState.message as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState]);

    useEffect(() => {
        if (renoUnits?.length > 0) {
            const renoUnit = renoUnits.find((unit) => unit.id === renoUnitId);
            if (renoUnit) {
                if (!isEqual(renoUnit, currRenoUnit)) {
                    setCurrRenoUnit(renoUnit);
                }
            } else {
                navigate("/404");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renoUnits]);

    useEffect(() => {
        if (unitScopeApprovals && unitScopeApprovals?.length >= 0) {
            const approvalsMap = new Map();
            unitScopeApprovals?.forEach((scopeApprovalData: any) => {
                if (approvalsMap.has(scopeApprovalData.unit_scope_id)) {
                    const dataList = approvalsMap?.get(scopeApprovalData.unit_scope_id);
                    approvalsMap.set(scopeApprovalData.unit_scope_id, [
                        ...dataList,
                        scopeApprovalData,
                    ]);
                } else {
                    approvalsMap.set(scopeApprovalData.unit_scope_id, [scopeApprovalData]);
                }
            });
            setScopeApprovalsMap(approvalsMap);
        }
    }, [unitScopeApprovals]);

    useEffect(() => {
        if (unitScopes && unitScopes?.length > 0) {
            TrackerUtil.event("PAGE_DATA_LENGTH_STAT", {
                pageName: `unit-scope-list`,
                dataLength: unitScopes?.length,
                projectName: projectDetails?.name,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unitScopes?.length]);

    useEffect(() => {
        if (currentUnitScopes?.length === 0) {
            TrackerUtil.event("EMPTY_PAGE_RENDERED", getZeroStateTrackingPayload());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUnitScopes?.length]);

    useEffect(() => {
        if (sideTrayData) {
            const updatedScope: any = unitScopes?.find(
                (scope: any) => scope.id === sideTrayData.id,
            );
            if (updatedScope.status === "completed" && selectedType !== "completed") {
                setSelectedType(updatedScope.status);
            }
            setSideTrayData(updatedScope);
        }
        if (cancelRequestData) {
            setCancelRequestData(null);
        }
        if (fileUploadModalData) {
            setFileUploadModalData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unitScopes]);

    const containsContractor = (cList: Array<any>, cId: string) => {
        return cList?.find((contractor) => contractor?.id === cId);
    };

    const setUnitScopes = (scopes: any[]) => {
        const allScopes: {
            [key: string]: any[];
        } = {
            [UNIT_SCOPE_STATUSES.not_started]: [],
            [UNIT_SCOPE_STATUSES.in_progress]: [],
            [UNIT_SCOPE_STATUSES.completed]: [],
        };

        scopes?.forEach((unitScope: any) => {
            const scopeApprovals = scopeApprovalsMap?.get(unitScope.id) || [];

            const status =
                unitScope?.status === UNIT_SCOPE_STATUSES.pending_approval
                    ? last(scopeApprovals)?.unit_scope_status
                    : undefined;

            if (
                unitScope?.status === UNIT_SCOPE_STATUSES.not_started ||
                unitScope?.status === UNIT_SCOPE_STATUSES.not_applicable ||
                status === UNIT_SCOPE_STATUSES.not_started
            ) {
                allScopes[UNIT_SCOPE_STATUSES.not_started].push(unitScope);
            } else if (
                unitScope?.status === UNIT_SCOPE_STATUSES.in_progress ||
                status === UNIT_SCOPE_STATUSES.in_progress
            ) {
                allScopes[UNIT_SCOPE_STATUSES.in_progress].push(unitScope);
            } else if (unitScope?.status === UNIT_SCOPE_STATUSES.completed) {
                allScopes[UNIT_SCOPE_STATUSES.completed].push(unitScope);
            }
        });
        setStartScopes([]);
        setMarkCompleteScopes([]);

        setAllUnitScopes(allScopes);
    };

    const resetBulkSelectedScopes = () => {
        if (selectedType === UNIT_SCOPE_STATUSES.not_started) {
            setStartScopes([]);
        } else if (selectedType === UNIT_SCOPE_STATUSES.in_progress) {
            setMarkCompleteScopes([]);
        }
    };

    useEffect(() => {
        let updatedCurrentScopes = [];
        if (searchFilters?.scopeId || searchFilters?.contractor) {
            updatedCurrentScopes = getSearchFilteredResult(allUnitScopes[selectedType]);
        } else {
            updatedCurrentScopes = allUnitScopes[selectedType];
        }
        if (updatedCurrentScopes?.length != currentUnitScopes?.length) {
            resetBulkSelectedScopes();
        }
        setCurrentUnitScopes(updatedCurrentScopes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allUnitScopes, searchFilters]);

    useEffect(() => {
        if (searchFilters?.scopeId || searchFilters?.contractor) {
            setSearchFilters({ scopeId: undefined, contractor: undefined });
        }
        setCurrentUnitScopes(allUnitScopes[selectedType]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType]);

    useEffect(() => {
        let filteredList = [];
        if (filters?.assignment?.length > 0 || filters?.status?.length > 0) {
            filteredList = unitScopes.filter((scope) => {
                let isMatched = true;

                if (filters?.assignment?.length > 0) {
                    let matched = false;
                    if (filters?.assignment.includes("assigned")) {
                        matched = matched || scope.subs?.length > 0;
                    }
                    if (filters?.assignment.includes("unassigned")) {
                        matched = matched || !scope.subs?.length;
                    }
                    isMatched = isMatched && matched;
                }
                if (filters?.status?.length > 0) {
                    isMatched = isMatched && filters?.status.includes(scope.status);
                }
                return isMatched;
            });
            setUnitScopes(filteredList);
        } else {
            setUnitScopes(unitScopes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, unitScopes, scopeApprovalsMap]);

    const getSearchFilteredResult = (scopes: any[]) => {
        const filteredList = scopes?.filter((unitScope: any) => {
            let isMatched = true;
            if (searchFilters?.scopeId) {
                isMatched = isMatched && unitScope?.id === searchFilters?.scopeId;
            }
            if (searchFilters?.contractor) {
                isMatched =
                    isMatched && containsContractor(unitScope?.subs, searchFilters?.contractor);
            }
            return isMatched;
        });

        return filteredList || [];
    };

    const { enqueueSnackbar } = useSnackbar();

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
            onClose: () => {
                dispatch(actions.common.closeSnack());
            },
        });
    };

    const getUnits = () => {
        if (!renoUnits) {
            dispatch(
                actions.production.unit.fetchRenovationUnitsStart({
                    project_id: projectId,
                }),
            );
        }
    };

    const getUnitScopeApprovals = () => {
        if (!unitScopeApprovals) {
            dispatch(
                actions.production.approval.fetchApprovalsStart({
                    renoUnitId,
                }),
            );
        }
    };

    function getUnitScopes() {
        if (!unitScopes) {
            dispatch(
                actions.production.unitScopes.fetchRenoUnitScopesStart({
                    renoUnitId,
                }),
            );
        }
    }

    function getAllUnitScopeStatuses() {
        if (!permissions) {
            dispatch(
                actions.production.project.setProductionProjectStateStart({
                    projectId,
                    hasProductionConstants: !!allConstants,
                }),
            );
        }
    }

    const changeItemRequest = (scopeId: any, item: any, data: any, successMessage: any = "") => {
        const isPricingGroup = !!item?.groups;

        if (!isPricingGroup) {
            dispatch(
                actions.production.unitScopes.updateUnitScopeItemStart({
                    updatePayload: {
                        scopeItemId: item.id,
                        ...data,
                    },
                    renoUnitId,
                    scopeId,
                    projectName: projectDetails?.name,
                    successMessage,
                }),
            );
        } else {
            dispatch(
                actions.production.unitScopes.updateItemPricingGroupStart({
                    updatePayload: {
                        pricingGroupId: item?.pricing_group_id,
                        price: item?.price,
                        ...data,
                    },
                    renoUnitId,
                    scopeId,
                    projectName: projectDetails?.name,
                    successMessage,
                }),
            );
        }
    };

    const onChangeDates = (scopeId: number, changedData: any) => {
        onChangeUnitScope(
            scopeId,
            {
                ...changedData,
                remark: "",
                attachments: [],
            },
            {
                successMsg: "Updated Successfully!!",
                errorEvent: "SAVE_UNIT_SCOPE_DETAILS_FAILED",
            },
        );
    };

    const onAttachFilesAndNote = (fileIds: Array<string> = [], note = "") => {
        const { scopeId, item, changedData, scopeIds, type } = fileUploadModalData;

        if (fileUploadModalData.actionType === "review_approval") {
            const { scopeApprovalIds, approvalStatus, approvalType, scopeId } = fileUploadModalData;
            onScopeApprovalChange(
                scopeId,
                approvalStatus,
                scopeApprovalIds,
                approvalType,
                fileIds,
                note,
            );
            return;
        }
        if (type === "add") {
            dispatch(
                actions.production.unitScopes.addRenovationUnitScopeItemStart({
                    newItemData: { ...changedData, projectId, remark: note, attachments: fileIds },
                    renoUnitId,
                    projectName: projectDetails?.name,
                }),
            );
            return;
        }

        if (item) {
            changeItemRequest(scopeId, item, {
                ...changedData,
                remark: note,
                attachments: fileIds,
            });
        } else if (scopeIds) {
            dispatch(
                actions.production.unitScopes.updateMultipleUnitScopesStart({
                    scopeIds: [...markCompleteScopes],
                    renoUnitId,
                    remark: note,
                    attachments: fileIds,
                    type: "complete-scope",
                }),
            );
        } else {
            onChangeUnitScope(
                scopeId,
                {
                    ...changedData,
                    remark: note,
                    attachments: fileIds,
                },
                {
                    successMsg: "Change Request Sent!",
                    errorEvent: changedData?.status
                        ? "MARK_AS_COMPLETE_FAILED"
                        : "RAISING_CHANGE_ORDER_FAILED",
                },
            );
        }
    };

    const onStartScope = (scopeId: number) => {
        TrackerUtil.event("CLICK_START_SCOPE", {
            renoUnitId,
            scopeId,
            projectName: projectDetails?.name,
        });
        onChangeUnitScope(
            scopeId,
            {
                status: "in_progress",
                remark: "",
                attachments: [],
            },
            {
                successMsg: "Started successfully!",
                errorEvent: "START_SCOPE_FAILED",
            },
        );
    };

    const onCancelItemChangeRequest = (scopeApprovalId: string) => {
        TrackerUtil.event("CLICKED_CANCEL_APPROVAL", {
            renoUnitId,
            scopeApprovalId,
            projectName: projectDetails?.name,
        });

        onScopeApprovalChange(
            cancelRequestData?.scopeId,
            "cancelled",
            [scopeApprovalId],
            "individual",
        );
    };

    const onScopeApprovalChange = (
        scopeId: number,
        status: string,
        scopeApprovalIds: Array<string>,
        type: string,
        attachments: any = [],
        remark: string = "",
    ) => {
        dispatch(
            actions.production.approval.reviewApprovalStart({
                projectId,
                projectName: projectDetails?.name,
                renoUnitId,
                scopeApprovalIds,
                reviewStatus: status,
                type,
                attachments,
                remark,
            }),
        );
    };

    const onConfirmCancelRequest = () => {
        const { scopeApprovalId } = cancelRequestData;
        onCancelItemChangeRequest(scopeApprovalId);
        setCancelRequestData((prev: any) => ({ ...prev, openDialog: false }));
    };

    const getAddNewScopeButton = (category: any) => (
        <Grid container flexDirection="column">
            <Grid item alignSelf="center">
                <Button startIcon={<Add />} onClick={() => setNewItemCategory(category)}>
                    Add New Scope Item
                </Button>
            </Grid>
            <Grid item>
                <hr style={{ width: "100%", color: "#d2d5d8", opacity: 0.5 }} />
            </Grid>
        </Grid>
    );

    const viewableFields = {
        work_type_icon: true,
        item_name: true,
        uom: true,
        price: true,
        contractor: true,
        spec: true,
    };

    const canRaiseChangeOrders = permissions?.includes(FEATURE_FLAGS.RAISE_CHANGE_ORDER);
    const canAddNewScopeItem = permissions?.includes(FEATURE_FLAGS.ADD_NEW_LINE_ITEM);
    const canCancelChangeOrders = permissions?.includes(FEATURE_FLAGS.CANCEL_CHANGE_ORDER);
    const canReview = permissions?.includes(FEATURE_FLAGS.REVIEW_CHANGE_ORDER);
    const canStartScope = permissions?.includes(FEATURE_FLAGS.START_RENOVATION);
    const canEditItemQty = permissions?.includes(FEATURE_FLAGS.EDIT_UNIT_SCOPE_ITEM_QTY);

    const getCategoryItems = (category: any) => {
        const scopeId = category?.id;
        const scopeItemCards = category?.items?.map((item: any) => (
            <ScopeItemCard
                disabled={item.status === PENDING_ADDITION || item.status === NOT_APPLICABLE}
                isFunctional
                projectName={projectDetails?.name}
                renoUnitId={renoUnitId as string}
                scopeId={scopeId}
                key={item.id}
                item={item}
                orgs={category.subs}
                allStatuses={allConstants?.UnitScopeStatus || []}
                allUOMs={allConstants?.UnitOfMeasurements || []}
                editableFields={
                    // If the status of the item is not-completed and the user can edit the quantity
                    // Then allow edit of "takeoff_value"
                    item?.status !== "completed" && canEditItemQty
                        ? [
                              {
                                  label: "TAKEOFF_VALUE",
                                  display: "Takeoff Value",
                                  value: "takeoff_value",
                              },
                              {
                                  label: "UOM",
                                  display: "Uom",
                                  value: "uom",
                              },
                          ]
                        : item?.status === "completed" || !canRaiseChangeOrders
                        ? []
                        : allConstants?.ProductionScopeItemEditableFields || []
                }
                updateScopeItem={(data) => {
                    canEditItemQty
                        ? changeItemRequest(
                              scopeId,
                              item,
                              {
                                  ...data,
                                  remark: "",
                                  attachments: [],
                              },
                              "Item quantity edited successfully",
                          )
                        : setFileUploadModalData({
                              changedData: data,
                              scopeId,
                              item,
                          });
                }}
                onCancelRequestIconClick={() =>
                    setCancelRequestData({
                        scopeId,
                        scopeApprovalId: item?.scope_approval_id,
                        itemName: item.item,
                        openDialog: true,
                    })
                }
                cancelRequestLoader={
                    item.scope_approval_id &&
                    cancelRequestData?.scopeApprovalId === item.scope_approval_id
                }
                viewableFields={viewableFields}
                canUserCancelRequest={canCancelChangeOrders}
                currentRenoUnit={currRenoUnit}
            />
        ));

        const scopeApprovals = scopeApprovalsMap?.get(scopeId) || [];
        const isScopeUnderCompletionRequest = scopeApprovals.find(
            (scopeApprovals: any) =>
                scopeApprovals.request_type === SCOPE_COMPLETION &&
                scopeApprovals.status === IN_REVIEW,
        );

        if (
            category?.status !== "completed" &&
            canAddNewScopeItem &&
            !isScopeUnderCompletionRequest
        ) {
            scopeItemCards.unshift(getAddNewScopeButton(category));
        }
        return scopeItemCards;
    };

    const getContractorsAvatar = (contractors: Array<any>) => {
        if (contractors?.length > 0) {
            return <AvatarGroup names={contractors?.map((sub) => sub?.name)} size={32} />;
        }

        return <Avatar sx={{ width: 32, height: 32 }} />;
    };

    const onFilterClick = (type: string, values: string[]) => {
        setFilters((prev: any) => ({ ...prev, [type]: values || [] }));
    };

    const getCategoryData = (category: any): ReactNode => {
        // const uniqueContractors = getUniqueContractorOrgs(category?.items);

        return (
            <Grid container gap={4} padding={2} alignItems="center" flexDirection="row">
                <Grid item>
                    <Typography fontSize={"10px"}>Total Category Cost</Typography>
                    <Typography>
                        <PriceDisplayElement
                            startPrice={category.start_price}
                            currentPrice={
                                (category?.labor_price || 0) +
                                (category?.material_price || 0) +
                                (category?.material_and_labor_price || 0)
                            }
                            variant="text_18_bold"
                        />
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container gap={4} alignItems="center">
                        <Grid>
                            <ScopeStatusChip status={category?.status} />
                        </Grid>
                        <Grid>{getContractorsAvatar(category?.subs)}</Grid>
                        <Grid>
                            <IconButton
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSideTrayData(category);
                                }}
                            >
                                <ZoomIn />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const getTotalPendingApprovals = () => {
        let totalPendingApprovals = 0;
        scopeApprovalsMap?.forEach((value) => {
            const pendingApp =
                value?.filter((approval: any) => approval?.status === "in_review")?.length || 0;
            totalPendingApprovals = totalPendingApprovals + pendingApp;
        });
        return totalPendingApprovals;
    };

    const getUnitStatusChip = () => {
        const unitStatus = allConstants?.RenovationUnitStatus?.find((status: any) => {
            return status.value === currRenoUnit?.status;
        });

        const props = UNIT_STATUS_COLOR_MAP[currRenoUnit?.status];

        const allProps = {
            ...props,
            label: unitStatus?.display,
        };

        return <BaseChip {...allProps} sx={{ borderRadius: "4px" }} />;
    };

    const getRenoUnitGenContractor = (): ReactNode => {
        const genContractor = organization?.find(
            (org: any) => org.id === currRenoUnit?.general_contractor,
        );

        return genContractor ? (
            <Avatar {...stringAvatar(genContractor?.name, "#410099")} />
        ) : (
            <Avatar />
        );
    };

    const onChangeUnitScope = (scopeId: number, data: any, msgObject: any) => {
        dispatch(
            actions.production.unitScopes.updateUnitScopeStart({
                updatePayload: { scopeId, ...data },
                renoUnitId,
                projectName: projectDetails?.name,
                successMsg: msgObject?.successMsg,
                errorEvent: msgObject?.errorEvent,
            }),
        );
    };

    const getHeaderBadge = (): ReactNode => {
        const noOfApproval = getTotalPendingApprovals();

        return permissions?.includes(FEATURE_FLAGS.REVIEW_CHANGE_ORDER) && !!noOfApproval ? (
            <div style={{ marginLeft: "8px", marginRight: "8px" }}>
                <StyledBadge badgeContent={noOfApproval} color="error" />
            </div>
        ) : (
            <></>
        );
    };

    const Header = () => {
        return (
            <Grid container gap={4} alignItems="center">
                <Grid>
                    <IconButton
                        onClick={() => {
                            state?.from === "approvals"
                                ? navigate(`${productionTabUrl(projectId, isRFPProject)}/approvals`)
                                : navigate(`${productionTabUrl(projectId, isRFPProject)}/units`);
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                </Grid>
                <Grid>
                    <Typography fontSize={24} fontWeight={"bold"} color={"#004D71"}>
                        {currRenoUnit?.unit_name}
                    </Typography>
                </Grid>
                <Grid>{getUnitStatusChip()}</Grid>
                <Grid>{getHeaderBadge()} </Grid>
                <Grid>{getRenoUnitGenContractor()}</Grid>
                <Grid marginLeft={"auto"}>
                    <Autocomplete
                        disableClearable
                        clearOnEscape
                        freeSolo
                        options={renoUnits?.map((unit) => ({
                            label: unit.unit_name,
                            id: unit.id,
                        }))}
                        size="small"
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} placeholder="Go to Unit" />}
                        onChange={(_e, value: any) => {
                            navigate(
                                `${productionTabUrl(projectId, isRFPProject)}/units/${value?.id}`,
                            );
                            navigate(0);
                        }}
                    />
                </Grid>
            </Grid>
        );
    };

    const UnitHeader = () => {
        const stats = currRenoUnit?.unit_stats;
        const progress =
            stats?.completed_work && stats?.total_work
                ? Math.round((stats?.completed_work / stats?.total_work) * 100)
                : 0;

        return (
            <Grid container gap={4} flexDirection={"column"}>
                <Header />
                <ProgressBar progress={progress} />
            </Grid>
        );
    };

    const onSearchFilterClick = (type: string, value: string) => {
        setSearchFilters((prev: any) => ({ ...prev, [type]: value }));
    };

    const getContractorList = () => {
        const uniqContractorId = new Set();
        const contractorList: Array<any> = [];

        unitScopes?.forEach((unitScope) => {
            unitScope?.subs.forEach((sub: any) => {
                if (!uniqContractorId.has(sub?.id)) {
                    contractorList.push({ ...sub });
                    uniqContractorId.add(sub.id);
                }
            });
        });
        return contractorList;
    };

    const getTabs = (
        selected: string,
        countInfo: any,
        // eslint-disable-next-line no-unused-vars
        onChangeUnitScopeType: (event: React.SyntheticEvent, newValue: string) => void,
    ): ReactNode => {
        const tabs = [
            UNIT_SCOPE_STATUSES.not_started,
            UNIT_SCOPE_STATUSES.in_progress,
            UNIT_SCOPE_STATUSES.completed,
        ];
        return (
            <Grid container gap={5} alignItems="center">
                <BaseTabs
                    currentTab={selected}
                    onTabChanged={onChangeUnitScopeType}
                    tabList={
                        allConstants?.UnitScopeStatus?.filter((scopeStatus: any) =>
                            tabs?.includes(scopeStatus.value),
                        )?.map((scopeStatus: any) => ({
                            label: `${scopeStatus.display} (${countInfo[scopeStatus.value] ?? 0})`,
                            value: scopeStatus.value,
                        })) || []
                    }
                    tabColor={theme.palette.primary}
                />
            </Grid>
        );
    };

    const unitScopeTypeCountInfo = useMemo(() => {
        const countInfo: any = {};
        allConstants?.UnitScopeStatus?.forEach((scopeStatus: any) => {
            countInfo[scopeStatus.value] = allUnitScopes[scopeStatus.value]?.length || 0;
        });
        return countInfo;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allUnitScopes]);

    const onChangeUnitScopeType = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSideTrayData(null);
        setSelectedType(newValue);
    };

    const showBulkActions = useMemo(() => {
        if (
            selectedType === UNIT_SCOPE_STATUSES.not_started &&
            canStartScope &&
            allUnitScopes[UNIT_SCOPE_STATUSES.not_started]?.filter(
                (us: any) => us.status === UNIT_SCOPE_STATUSES.not_started,
            )?.length
        ) {
            return true;
        } else if (
            selectedType === UNIT_SCOPE_STATUSES.in_progress &&
            canRaiseChangeOrders &&
            allUnitScopes[UNIT_SCOPE_STATUSES.in_progress]?.filter(
                (us: any) => us.status === UNIT_SCOPE_STATUSES.in_progress,
            )?.length
        ) {
            return true;
        }
        return false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedType, unitScopeTypeCountInfo]);

    const onToggleSingleScopeSelection = (scopeId: string) => {
        const selectedScopeList =
            selectedType === UNIT_SCOPE_STATUSES.not_started ? startScopes : markCompleteScopes;
        const currentIndex = selectedScopeList.indexOf(scopeId);
        const newSelectedValues = [...selectedScopeList];

        if (currentIndex === -1) {
            newSelectedValues.push(scopeId);
        } else {
            newSelectedValues.splice(currentIndex, 1);
        }
        selectedType === UNIT_SCOPE_STATUSES.not_started
            ? setStartScopes(newSelectedValues)
            : setMarkCompleteScopes(newSelectedValues);
    };

    const onToggleScopesSelection = () => {
        const selectedScopeList =
            selectedType === UNIT_SCOPE_STATUSES.not_started ? startScopes : markCompleteScopes;
        let newSelectedList = [];
        if (!selectedScopeList?.length) {
            newSelectedList = currentUnitScopes
                ?.filter((cs: any) => cs.status === selectedType)
                .map((scope: any) => scope?.id);
        }
        selectedType === UNIT_SCOPE_STATUSES.not_started
            ? setStartScopes(newSelectedList)
            : setMarkCompleteScopes(newSelectedList);
    };

    const onBulkAction = () => {
        if (selectedType === UNIT_SCOPE_STATUSES.not_started) {
            TrackerUtil.event("CLICKED_START_SCOPES_BULK_ACTION", {
                renoUnitId,
                scopeIds: [...startScopes],
                projectName: projectDetails?.name,
            });
            dispatch(
                actions.production.unitScopes.updateMultipleUnitScopesStart({
                    scopeIds: [...startScopes],
                    renoUnitId,
                    type: "start-scope",
                    projectName: projectDetails?.name,
                }),
            );
        } else {
            TrackerUtil.event("CLICKED_MARK_AS_COMPLETE_SCOPES_BULK_ACTION", {
                renoUnitId,
                scopeIds: [...markCompleteScopes],
                projectName: projectDetails?.name,
            });

            setFileUploadModalData({
                scopeIds: [...markCompleteScopes],
            });
        }
    };

    return (
        <Grid container padding={4} gap={8} marginTop={4}>
            {loading && <BaseLoader />}
            <>
                <Grid item xs={12}>
                    <UnitHeader />
                </Grid>
                <Grid item xs={12}>
                    {currRenoUnit && <UnitKPI unit={{ ...currRenoUnit }} />}
                </Grid>
                <Grid item xs={12}>
                    <Grid container flexDirection={"row"} gap={4}>
                        <Grid item flex={1}>
                            <UnitScopeFilters
                                unitScopes={unitScopes}
                                unitScopeStatuses={allConstants?.UnitScopeStatus || []}
                                onFilterClick={onFilterClick}
                            />
                        </Grid>
                        <Grid item flex={5}>
                            <Grid container flexDirection="column" gap={5} height={"100%"}>
                                <Grid item>
                                    {getTabs(
                                        selectedType,
                                        unitScopeTypeCountInfo,
                                        onChangeUnitScopeType,
                                    )}
                                </Grid>
                                <Grid item>
                                    <Grid container alignItems="center" gap={3}>
                                        {showBulkActions && (
                                            <Grid item>
                                                <BulkActions
                                                    selectedLength={
                                                        selectedType ===
                                                        UNIT_SCOPE_STATUSES.not_started
                                                            ? startScopes?.length
                                                            : markCompleteScopes?.length
                                                    }
                                                    totalScopes={
                                                        currentUnitScopes?.filter(
                                                            (cs: any) => cs.status === selectedType,
                                                        )?.length
                                                    }
                                                    buttonType={
                                                        selectedType ===
                                                        UNIT_SCOPE_STATUSES.not_started
                                                            ? "start-scope"
                                                            : "complete-scope"
                                                    }
                                                    onToggle={() => onToggleScopesSelection()}
                                                    onButtonClick={() => onBulkAction()}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item xs>
                                            <SearchFilters
                                                dataList={allUnitScopes[selectedType] || []}
                                                onSearchFilterClick={onSearchFilterClick}
                                                disabled={!unitScopeTypeCountInfo[selectedType]}
                                                filters={[
                                                    { type: "scopeId", placeholder: "Scope" },
                                                    {
                                                        type: "contractor",
                                                        placeholder: "Contractor",
                                                        hide: canRaiseChangeOrders,
                                                    },
                                                ]}
                                                contractorList={getContractorList()}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {currentUnitScopes?.length === 0 ? (
                                    <Grid item flex={1}>
                                        <ZeroStateComponent label="No Unit Scopes Found" />
                                    </Grid>
                                ) : (
                                    <Grid item maxHeight={"70vh"} overflow={"auto"}>
                                        <Grid container flexDirection={"column"} gap={4}>
                                            {currentUnitScopes?.map((category: any) => (
                                                <BaseAccordion
                                                    {...(showBulkActions &&
                                                    category.status === selectedType
                                                        ? {
                                                              checkbox: {
                                                                  isSelected:
                                                                      selectedType ===
                                                                      UNIT_SCOPE_STATUSES.not_started
                                                                          ? startScopes?.includes(
                                                                                category.id,
                                                                            )
                                                                          : markCompleteScopes?.includes(
                                                                                category.id,
                                                                            ),
                                                                  onClick: () =>
                                                                      onToggleSingleScopeSelection(
                                                                          category.id,
                                                                      ),
                                                              },
                                                          }
                                                        : {})}
                                                    title={category.scope}
                                                    components={getCategoryItems(category)}
                                                    key={category.scope}
                                                    summaryDetail={getCategoryData(category)}
                                                    defaultExpanded={false}
                                                    enableVirtualizedList
                                                />
                                            ))}
                                        </Grid>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        {sideTrayData && (
                            <Grid item flex={2}>
                                <UnitScopeSideTray
                                    renoUnitId={renoUnitId as string}
                                    hasFeature={(key) => permissions?.includes(key)}
                                    data={sideTrayData}
                                    approvals={scopeApprovalsMap?.get(sideTrayData?.id) || []}
                                    onClose={() => setSideTrayData(null)}
                                    onChangeUnitScope={(data, showFileUploadModal = true) => {
                                        canReview
                                            ? onChangeDates(sideTrayData?.id, data)
                                            : showFileUploadModal
                                            ? setFileUploadModalData({
                                                  changedData: data,
                                                  scopeId: sideTrayData?.id,
                                                  item: null,
                                              })
                                            : onChangeDates(sideTrayData?.id, data);
                                    }}
                                    onCancelScopeChangeRequest={(scopeApprovalId) => {
                                        setCancelRequestData({
                                            scopeId: sideTrayData?.id,
                                            scopeApprovalId,
                                            itemName: sideTrayData?.scope,
                                            openDialog: true,
                                            isScopeChange: true,
                                        });
                                    }}
                                    onScopeApprovalChange={(status, ids, type) =>
                                        status === "cancelled"
                                            ? onScopeApprovalChange(
                                                  sideTrayData?.id,
                                                  status,
                                                  ids,
                                                  type,
                                              )
                                            : setFileUploadModalData({
                                                  scopeApprovalIds: ids,
                                                  approvalStatus: status,
                                                  approvalType: type,
                                                  actionType: "review_approval",
                                                  scopeId: sideTrayData?.id,
                                              })
                                    }
                                    onStartScope={() => onStartScope(sideTrayData?.id)}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </>
            <ConfirmationModal
                text={`Are you sure, you want to cancel the approval request on this ${
                    cancelRequestData?.itemName || "pricing group"
                }`}
                onCancel={() => setCancelRequestData(null)}
                onProceed={() => onConfirmCancelRequest()}
                open={!!cancelRequestData?.openDialog}
                cancelText="No"
                actionText="Yes"
            />
            {!!newItemCategory && (
                <AddNewScopeItemModal
                    onClose={() => setNewItemCategory(null)}
                    onSubmitNewItem={(data: any) => {
                        setNewItemCategory(null);
                        setFileUploadModalData({
                            changedData: data,
                            type: "add",
                        });
                    }}
                    open={!!newItemCategory}
                    currentUnit={{
                        name: currRenoUnit?.unit_name,
                        id: currRenoUnit?.id,
                        subs: currRenoUnit?.subs?.map((sub: any) => sub?.name) || [],
                    }}
                    category={newItemCategory}
                />
            )}
            <FileUploadModal
                projectName={projectDetails.name}
                isModal={!!fileUploadModalData}
                handleClose={() => setFileUploadModalData(null)}
                onAttachFilesAndNote={onAttachFilesAndNote}
                projectId={projectId as string}
                renoUnitId={renoUnitId as string}
                scopeId={fileUploadModalData?.scopeId}
                itemOrPricingGroupId={
                    fileUploadModalData?.item?.pricing_group_id || fileUploadModalData?.item?.id
                }
            />
        </Grid>
    );
};

export default UnitPage;
