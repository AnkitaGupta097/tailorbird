import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import MergeIcon from "@mui/icons-material/Merge";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import SyncProblemIcon from "@mui/icons-material/SyncProblem";
import {
    Box,
    Button,
    ButtonProps,
    Chip,
    Dialog,
    Grid,
    IconButton,
    Link,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    DataGridProProps,
    GRID_CHECKBOX_SELECTION_COL_DEF,
    GridActionsCellItem,
    GridActionsColDef,
    GridColDef,
    GridColumnVisibilityModel,
    GridRenderCellParams,
    GridRowHeightParams,
    GridRowParams,
    useGridApiContext,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import BaseCheckbox from "components/checkbox";
import BaseDataGridPro from "components/data-grid-pro";
import BaseSvgIcon from "components/svg-icon";
import { useCallbackPrompt } from "hooks/use-callback-prompt";
import { isEmpty } from "lodash";
import { KebabMenuIcon } from "modules/package-manager/landing-page/packages-table";
import AlternateDialog from "modules/rfp-manager/common/alternate-dialog";
import ChangeUOMDialog from "modules/rfp-manager/common/change-uom-dialog";
import {
    BIDDING_PORTAL,
    getFormattedNumber,
    getSnackbarMessage,
} from "modules/rfp-manager/common/constants";
import DeleteAlternateDialog from "modules/rfp-manager/common/delete-alternate-dialog";
import RfpDialog from "modules/rfp-manager/common/dialog";
import { getTypeOfChangeText } from "modules/rfp-manager/helper";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState, version } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import actions from "stores/actions";
import {
    calculateFilteredProjectCost,
    getAllFloorPlanItem,
    getPriceFromItem,
} from "stores/bidding-portal/bidding-portal-helper";
import {
    IFloorplanPrice,
    IItem,
    IRfpResponseItems,
} from "stores/bidding-portal/bidding-portal-models";
import { updateBidItems } from "stores/bidding-portal/bidding-portal-queries";
import { ISnackbar } from "stores/common/snackbar";
import { useAppSelector } from "stores/hooks";
import { graphQLClient } from "utils/gql-client";
import TrackerUtil from "utils/tracker";
import BlinkLoader from "../../../../assets/icons/blink-loader.gif";
import { ReactComponent as HistoricalPricingIcon } from "../../../../assets/icons/historic-pricing.svg";
import { ReactComponent as HistoricalPricingFilledIcon } from "../../../../assets/icons/historical-pricing-filled.svg";
import CombineDialog from "../combine-dialog";
import CombinePrompt from "../combine-prompt";
import {
    IPriceDataGrid,
    convertCombinedBidItemsToTreeData,
    getDisplayUOM,
    getLumpsumSubscript,
    onCombineLineItems2,
    onUncombineLineItems,
    renameCombination,
    transformDataToHierarchy,
} from "../constants";
import { SubDetailsLine, getTotalPrice } from "../helper-components";
import HistoricalPricingMenu from "./historical-princing-menu";
import LocationColumnRender from "./locationColumnRender";
import QuantityColumnRender from "./quantityColumnRender";
import SpecsColumnRender from "./specsColumnRender";
import Subscript from "./subscript";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { Parser } from "expr-eval";

const PriceDataGrid = ({
    items,
    setItems,
    bidItemsUpdated,
    syncTimeout,
    projectDetails,
    isEditable,
    isIdle,
    isOffline,
    isAgreement,
    index,
    category,
    setComboPromptState,
    currentRenoversion,
    orgId,
    setSelectedRows,
    selectedRows,
    comboPromptState,
    isAdminAccess,
    isLatest,
    selectedRowsData,
    setSelectedRowsData,
    orgContainerId,
    setSyncTimeout,
    disableSnackbar,
}: IPriceDataGrid) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { projectId, role, userID, floorplanName } = useParams();
    const {
        filteredProjectCostWithExludedCategory,
        groupedBidItems,
        snackbar,
        responseError,
        bidItems,
        inventories,
        historicalPricingData,
    } = useAppSelector((state) => ({
        filteredProjectCostWithExludedCategory: state?.biddingPortal?.filteredProjectCost,
        groupedBidItems: state.biddingPortal.groupedBidItems,
        snackbar: state.common.snackbar as ISnackbar,
        responseError: state.biddingPortal.responseError,
        bidItems: state.biddingPortal.bidItems,
        inventories: state?.biddingPortal.inventories,
        historicalPricingData: state.biddingPortal.historicalPricingData,
    }));
    const [anchor, setAnchor] = useState<null | {
        element: HTMLElement;
        pc_item_id: string;
        params: { row: IItem; field: string };
    }>(null);

    const apiRef = useGridApiRef();
    const [filteredProjectCost, setFilteredProjectCost] = useState(
        filteredProjectCostWithExludedCategory,
    );
    const displayPreciseValues = useFeature(FeatureFlagConstants.PRECISE_VALUES_IN_RFP2).on;
    const navState = useLocation().state as any;
    const [open, setOpen] = useState<boolean>(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [enterPrice, setEnterPrice] = useState<{ id: string | null; open: boolean }>({
        id: null,
        open: false,
    });
    const [unitPriceValue, setUnitPriceValue] = useState<number>(0);
    const [lumpSumValue, setLumpSumValue] = useState<number>(0);
    const [disableField, setDisableField] = useState(2);
    const [updatedFps, setUpdatedFps] = useState<IFloorplanPrice[] | undefined>([]);
    const [currentFp, setCurrentFp] = useState<any>({});
    const [sourceOfChange, setSourceOfChange] = useState<{
        source: string;
        is_historical_price?: boolean;
    }>({ source: "" });
    const [newDefaultPrice, setNewDefaultPrice] = useState<{
        unit_price: number;
        lump_sum: number;
    }>({
        unit_price: 0,
        lump_sum: 0,
    });
    const [showPrompt, confirmNavigation] = useCallbackPrompt(bidItemsUpdated?.length > 0);
    const [prevUnitPrice, setPrevUnitPrice] = React.useState<number>(0);
    const [prevLumpSumPrice, setPrevLumpSumPrice] = React.useState<number>(0);
    const [allFloorPlan, setAllFloorPlan] = useState<IItem>();
    const [viewAlternate, setViewAlternate] = useState<boolean>(false);
    const [showAlternatesDialog, setShowAlternatesDialog] = useState<boolean>(false);
    const [selectedItemForAlternates, setSelectedItemForAlternates] = useState<any | null>(null);
    const [editAlternateItem, setEditAlternateItem] = useState<boolean>(false);
    const [showDeleteAlternateDialog, setShowDeleteAlternateDialog] = useState<boolean>(false);
    const [columnVisibilityModel, setColumnVisibilityModel] =
        React.useState<GridColumnVisibilityModel>({
            Group: false,
        });
    const [itemsToRemove, setItemsToRemove] = useState<Record<string, any>>({});
    const [openCombineDialog, setOpenCombineDialog] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [updateStoreWithHistoricalPrice, setUpdateStoreWithHistoricalPrice] =
        useState<boolean>(false);
    const [showChangeUOMDialog, setShowChangeUOMDialog] = useState<boolean>(false);
    const [selectedItemForChangeUOM, setSelectedItemForChangeUOM] = useState<undefined | IItem>();
    const [unitPriceExpError, setUnitPriceExpError] = useState<boolean>(false);
    const [lumpsumPriceExpError, setLumpsumPriceExpError] = useState<boolean>(false);

    const [expression, setExpression] = useState<string | null>();
    const columns: Array<GridColDef | GridActionsColDef> = [
        // This will render a custom checkbox cell
        {
            ...(GRID_CHECKBOX_SELECTION_COL_DEF as any),
            width: 10,
            align: "center",
            headerAlign: "center",
            renderCell(params: { row: IItem }) {
                if (params?.row?.parent_bid_item_id && !params?.row?.is_alternate) {
                    // Render empty cell if this is a child element
                    return <></>;
                }
                if (params?.row?.type === "COMBINED") {
                    return (
                        <Stack direction="column" height="60%" justifyContent="center">
                            {GRID_CHECKBOX_SELECTION_COL_DEF?.renderCell?.(params as any)}
                        </Stack>
                    );
                }

                return GRID_CHECKBOX_SELECTION_COL_DEF?.renderCell?.(params as any);
            },
        },
        {
            field: "scope",
            headerName: "Scope Detail",
            headerAlign: "left",
            align: "left",
            flex: 2,
            renderCell: CustomGridTreeDataGroupingCell,
        },
        {
            field: "specs",
            headerName: "Specs",
            headerAlign: "left",
            align: "left",
            flex: 1.3,
            renderCell(params: { row: IItem }) {
                return params?.row?.isParentCategory ? "" : <SpecsColumnRender params={params} />;
            },
        },
        {
            field: "comments",
            headerName: "Comments",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
            renderCell(params: { row: IItem }) {
                return (
                    <Typography
                        variant="text_14_regular"
                        color="#757575"
                        sx={{
                            width: "100%",
                            alignItems: "center",
                            display: "block",
                            whiteSpace: "normal",
                            lineHeight: "1rem",
                            textDecorationLine:
                                params?.row?.type_of_change === "deleted" ? "line-through" : "none",
                        }}
                    >
                        {params?.row?.comments}
                    </Typography>
                );
            },
        },
        {
            field: "location",
            headerName: "Location",
            headerAlign: "left",
            align: "left",
            flex: 0.7,
            renderCell(params: { row: IItem }) {
                return params?.row?.isParentCategory ? (
                    ""
                ) : (
                    <LocationColumnRender
                        params={params}
                        projectType={projectDetails?.property_type?.toLowerCase()}
                    />
                );
            },
        },
        {
            field: "quantity",
            headerName: "Quantity",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
            renderCell(params: { row: IItem }) {
                return params?.row?.isParentCategory ? (
                    ""
                ) : (
                    <QuantityColumnRender params={params} />
                );
            },
        },
        {
            field: "pricing",
            headerName: "Pricing",
            headerAlign: "left",
            align: "left",
            flex: 1.75,
            renderCell: (params: { row: IItem; field: string }) => {
                const isPercentageUoM =
                    params?.row?.specific_uom?.toLowerCase() === "percentage" ||
                    params?.row?.uom?.toLowerCase() === "percentage";
                const isAllFp = params?.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS;
                if (
                    (params?.row?.parent_bid_item_id && !params?.row?.is_alternate) ||
                    params?.row?.isParentCategory
                )
                    return null;
                if (enterPrice?.id === params?.row?.reno_item_id) {
                    return (
                        enterPrice?.open && (
                            <Stack direction="row" alignItems="center" height="100%">
                                <TextField
                                    // upgraded to data grid pro
                                    onBlur={() => {
                                        setTimeout(() => {
                                            handlePriceChange(params);
                                            triggerMixpanelEvent(params);
                                            setUnitPriceExpError(false);
                                            setLumpsumPriceExpError(false);
                                        }, 20);
                                    }}
                                    onFocus={(e) => {
                                        e.target.addEventListener(
                                            "wheel",
                                            (e) => e.preventDefault(),
                                            { passive: false },
                                        );
                                    }}
                                    InputProps={{
                                        style: {
                                            height: 32,
                                            width: 100,
                                            padding: 0,
                                            margin: 0,
                                            color: unitPriceExpError ? "red" : "black",
                                        },
                                        readOnly: disableField === 1,
                                        startAdornment: (
                                            <CalculateIcon color="disabled" fontSize="medium" />
                                        ),
                                    }}
                                    disabled={!isAllFp && isPercentageUoM}
                                    type="text"
                                    placeholder={isPercentageUoM ? "%" : "Unit price"}
                                    sx={{
                                        "input::-webkit-outer-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                        "input::-webkit-inner-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                        "input[type=number]": {
                                            "-moz-appearance": "textfield",
                                        },
                                    }}
                                    defaultValue={
                                        expression && (!lumpSumValue || lumpSumValue == 0)
                                            ? expression
                                            : unitPriceValue > 0
                                            ? unitPriceValue.toLocaleString("en-US")
                                            : ""
                                    }
                                    onChange={(e) => handleUnitPriceChange(e)}
                                    onClick={() => {
                                        setDisableField(2);
                                    }}
                                />
                                <TextField
                                    InputProps={{
                                        style: {
                                            height: 32,
                                            width: 110,
                                            padding: 0,
                                            margin: 0,
                                            color: lumpsumPriceExpError ? "red" : "black",
                                        },
                                        readOnly: disableField === 2,
                                        startAdornment: (
                                            <CalculateIcon color="disabled" fontSize="medium" />
                                        ),
                                    }}
                                    type="text"
                                    placeholder="Lump sum"
                                    sx={{
                                        "input::-webkit-outer-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                        "input::-webkit-inner-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                        "input[type=number]": {
                                            "-moz-appearance": "textfield",
                                        },
                                        visibility: isPercentageUoM ? "hidden" : "visible",
                                        marginLeft: "10px",
                                    }}
                                    // defaultValue={lumpSumValue === 0 ? "" : lumpSumValue}
                                    defaultValue={
                                        expression && (!unitPriceValue || unitPriceValue == 0)
                                            ? expression
                                            : lumpSumValue > 0
                                            ? lumpSumValue.toLocaleString("en-US")
                                            : ""
                                    }
                                    onBlur={() => {
                                        setTimeout(() => {
                                            handlePriceChange(params);
                                            triggerMixpanelEvent(params);
                                            setUnitPriceExpError(false);
                                            setLumpsumPriceExpError(false);
                                        }, 20);
                                    }}
                                    onFocus={(e) =>
                                        e.target.addEventListener(
                                            "wheel",
                                            (e) => e.preventDefault(),
                                            { passive: false },
                                        )
                                    }
                                    onChange={(e) => handleLumpSumChange(e)}
                                    onClick={() => setDisableField(1)}
                                />
                            </Stack>
                        )
                    );
                }
                if (params.row.is_historical_price && getPriceFromItem(params.row) > 0) {
                    return (
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            width="95%"
                            height="100%"
                        >
                            <Stack direction="column" mt=".25rem">
                                <Chip
                                    label={
                                        <Typography variant="text_14_regular">{`${getUnitPrice(
                                            params,
                                        )} `}</Typography>
                                    }
                                    sx={{
                                        borderRadius: "5px",
                                        backgroundColor: "#DDCBFB",
                                    }}
                                    onDelete={
                                        isEditable
                                            ? () => {
                                                  setUnitPriceValue(0);
                                                  setDisableField(2);
                                                  handlePriceChange(params, false, true);
                                              }
                                            : undefined
                                    }
                                />
                                <Subscript showInventory={inventories.length > 1} params={params} />
                            </Stack>
                            <Tooltip title="Historical unit pricing applied" arrow>
                                <IconButton
                                    sx={{
                                        "&:hover": {
                                            cursor:
                                                isEditable && !isOffline && !isIdle
                                                    ? "pointer"
                                                    : "default",
                                        },
                                    }}
                                    onClick={
                                        isEditable && !isOffline && !isIdle
                                            ? (event) => {
                                                  event.stopPropagation();
                                                  setAnchor({
                                                      element: event.currentTarget,
                                                      pc_item_id: params.row.pc_item_id,
                                                      params: params,
                                                  });
                                              }
                                            : undefined
                                    }
                                >
                                    <BaseSvgIcon svgPath={<HistoricalPricingFilledIcon />} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }

                return (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="95%"
                        height="100%"
                    >
                        {params?.row?.unique_price === 0 &&
                        params?.row?.default_price === 0 &&
                        params?.row?.total_price === 0 ? (
                            <Link
                                sx={{
                                    "&:hover": {
                                        cursor:
                                            isEditable && !isIdle && !isOffline
                                                ? !isAllFp && isPercentageUoM
                                                    ? "not-allowed"
                                                    : "pointer"
                                                : "default",
                                    },
                                    textDecorationLine:
                                        params?.row?.type_of_change === "deleted" ||
                                        (params?.row?.type_of_change === "updated" &&
                                            !params?.row?.is_revised_price)
                                            ? `${
                                                  params?.row?.type_of_change === "updated" &&
                                                  getPriceFromItem(params.row) > 0
                                                      ? "line-through"
                                                      : ""
                                              } ${
                                                  params?.row?.type_of_change === "updated"
                                                      ? "underline"
                                                      : ""
                                              }`
                                            : "none",
                                    marginLeft: 0,
                                    ...(!isAllFp &&
                                        isPercentageUoM && {
                                            textDecoration: "none",
                                            color: "grey",
                                        }),
                                }}
                            >
                                <Typography>
                                    {isPercentageUoM
                                        ? "Input Percentage"
                                        : "Add unit price / lump sum"}
                                </Typography>
                            </Link>
                        ) : (
                            <Stack
                                direction="row"
                                gap={4}
                                justifyContent="space-between"
                                display={"contents"}
                            >
                                <Stack direction="column" width="48%">
                                    <Typography
                                        variant="text_14_regular"
                                        sx={{
                                            textDecorationLine:
                                                params?.row?.type_of_change === "deleted" ||
                                                (params?.row?.type_of_change === "updated" &&
                                                    !params?.row?.is_revised_price)
                                                    ? `line-through ${
                                                          params?.row?.type_of_change === "updated"
                                                              ? "underline"
                                                              : ""
                                                      }`
                                                    : "none",
                                            "&:hover": {
                                                cursor:
                                                    !isAllFp && isPercentageUoM
                                                        ? "not-allowed"
                                                        : "default",
                                            },
                                            ...(!isAllFp &&
                                                isPercentageUoM && {
                                                    textDecoration: "none",
                                                    color: "grey",
                                                }),
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                        }}
                                        color={params?.row?.total_price > 0 ? "#969696" : "#232323"}
                                    >
                                        {getUnitPrice(params)}
                                    </Typography>
                                    <Subscript
                                        params={params}
                                        preciseValues={displayPreciseValues}
                                    />
                                </Stack>
                                <Stack direction="column" width="48%" marginLeft={"0.2rem"}>
                                    <Typography
                                        sx={{
                                            textDecorationLine:
                                                params?.row?.type_of_change === "deleted"
                                                    ? "line-through"
                                                    : "none",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                        }}
                                        variant="text_14_regular"
                                        color="#232323"
                                    >
                                        {params?.row?.total_price === 0 ? (
                                            <span style={{ paddingLeft: "1rem" }}>&mdash;</span>
                                        ) : (
                                            `$${getFormattedNumber(
                                                params?.row?.total_price,
                                                displayPreciseValues,
                                            )}`
                                        )}
                                    </Typography>
                                    {(params?.row?.unique_price === 0 ||
                                        params?.row?.default_price === 0) &&
                                        params?.row?.total_price > 0 && (
                                            <Typography variant="text_10_semibold" color="#969696">
                                                {getLumpsumSubscript(params?.row)}
                                            </Typography>
                                        )}
                                </Stack>
                            </Stack>
                        )}
                        {historicalPricingData?.[params.row.pc_item_id] &&
                        params?.row?.type_of_change !== "deleted" &&
                        isEditable &&
                        !isIdle &&
                        !isOffline ? (
                            <Tooltip
                                title={
                                    params?.row?.is_historical_price
                                        ? "Historical unit pricing applied"
                                        : "Historical unit pricing available"
                                }
                                arrow
                            >
                                <IconButton
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setAnchor({
                                            element: event.currentTarget,
                                            pc_item_id: params.row.pc_item_id,
                                            params: params,
                                        });
                                    }}
                                >
                                    <BaseSvgIcon
                                        svgPath={
                                            params?.row?.is_historical_price ? (
                                                <HistoricalPricingFilledIcon />
                                            ) : (
                                                <HistoricalPricingIcon />
                                            )
                                        }
                                    />
                                </IconButton>
                            </Tooltip>
                        ) : null}
                    </Stack>
                );
            },
        },
        {
            field: "total",
            headerName: "Total",
            headerAlign: "left",
            align: "left",
            flex: 0.75,
            renderCell(params: GridRowParams<IItem>) {
                if (params?.row?.parent_bid_item_id && !params?.row?.is_alternate) {
                    return null;
                }
                let data = navState?.data || groupedBidItems?.[index] || {};
                return (
                    <Typography
                        variant="text_14_regular"
                        color="#757575"
                        sx={{
                            textDecorationLine:
                                params?.row?.type_of_change === "deleted" ? "line-through" : "none",
                            display: "flex",
                        }}
                        alignItems="center"
                        height="100%"
                    >
                        {getTotalPrice(params, data, filteredProjectCost, displayPreciseValues)}
                    </Typography>
                );
            },
        },
        {
            field: "action",
            headerName: "Action",
            headerAlign: "center",
            type: "actions",
            align: "center",
            flex: 0.5,
            getActions: (params: GridRowParams<IItem>) => {
                let disableAll =
                    !isEditable || isIdle || isOffline || params?.row?.type_of_change === "deleted";
                if (
                    (params?.row?.parent_bid_item_id && !params?.row?.is_alternate) ||
                    params?.row?.isParentCategory
                )
                    return [];
                return [
                    <GridActionsCellItem
                        key="set unique price as new default"
                        label={`Set ${getUnitPrice(params)} as New Default`}
                        showInMenu
                        onClick={() => SetNewDefault(params)}
                        disabled={
                            !(
                                params?.row?.is_unique_price &&
                                params?.row?.fp_name !== BIDDING_PORTAL.ALL_FLOOR_PLANS &&
                                params?.row?.type_of_change !== "deleted"
                            )
                        }
                    />,

                    <GridActionsCellItem
                        key="change uom"
                        label="Change Unit of Measure"
                        showInMenu
                        onClick={() => changeUOMHandler(params?.row)}
                        disabled={
                            params?.row?.type?.toLowerCase() === "combined" ||
                            params?.row?.type_of_change === "deleted" ||
                            (params?.row?.uom?.toLowerCase() === "count" &&
                                !["general conditions", "tax", "profit & overhead"].includes(
                                    params?.row?.category?.toLowerCase(),
                                )) ||
                            disableAll ||
                            params?.row?.category?.toLowerCase() === "alternates"
                        }
                    />,
                    <GridActionsCellItem
                        key="reset default price"
                        label={`Reset Price to Default`}
                        showInMenu
                        onClick={() => resetToDefault(params)}
                        disabled={
                            !(
                                params?.row?.is_unique_price &&
                                params?.row?.fp_name !== BIDDING_PORTAL.ALL_FLOOR_PLANS &&
                                params?.row?.type_of_change !== "deleted"
                            )
                        }
                    />,
                    <GridActionsCellItem
                        key="add to alternates"
                        label="Add to Alternates"
                        showInMenu
                        onClick={() => {
                            setShowAlternatesDialog(true);
                            setSelectedItemForAlternates(params?.row);
                        }}
                        disabled={
                            isAgreement ||
                            params?.row?.is_alternate ||
                            !!params?.row?.alternate_item_ref ||
                            disableAll ||
                            (params?.row?.children?.length ?? 0) > 0
                        }
                    />,
                    <GridActionsCellItem
                        key="edit_alternate"
                        label="Edit Alternate"
                        showInMenu
                        onClick={() => {
                            setSelectedItemForAlternates(params?.row);
                            setEditAlternateItem(true);
                            setShowAlternatesDialog(true);
                        }}
                        disabled={
                            isAgreement ||
                            !params?.row?.is_alternate ||
                            params?.row?.is_ownership_alt ||
                            disableAll
                        }
                    />,
                    <GridActionsCellItem
                        key="remove_alternates"
                        label="Remove Alternate"
                        showInMenu
                        onClick={() => {
                            setSelectedItemForAlternates(params?.row);
                            setShowDeleteAlternateDialog(true);
                        }}
                        disabled={
                            isAgreement ||
                            !params?.row?.is_alternate ||
                            params?.row?.is_ownership_alt ||
                            disableAll
                        }
                    />,
                    <GridActionsCellItem
                        key="uncombine_items"
                        label="Uncombine Items"
                        showInMenu
                        onClick={() => {
                            onUncombineLineItems(groupedBidItems, dispatch, params, category);
                        }}
                        disabled={
                            disableAll ||
                            !params.row?.children ||
                            params.row?.children?.length === 0
                        }
                    />,
                    <GridActionsCellItem
                        key="rename_combination"
                        label="Rename"
                        showInMenu
                        onClick={() => {
                            setComboPromptState({
                                open: true,
                                selectedItemId: params.row?.id,
                                params: params,
                            });
                        }}
                        disabled={
                            disableAll ||
                            !params.row?.children ||
                            params.row?.children?.length === 0
                        }
                    />,
                ];
            },
        },
    ];

    // Helper Functions

    const SyncUpdatedItemsWithApi = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                if (bidItemsUpdated?.length > 0) {
                    dispatch(
                        actions?.biddingPortal?.syncStoreWithApiStart({
                            input: bidItemsUpdated,
                        }),
                    );
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    const itemInventoryMapping = useMemo(() => {
        let subCategoryInventoryMapping: Record<string, Set<string>> = {};
        items.forEach((item: IItem) => {
            if (!subCategoryInventoryMapping[`${item.subcategory}//-${item.scope}`]) {
                subCategoryInventoryMapping[`${item.subcategory}//-${item.scope}`] =
                    new Set<string>();
            }
            subCategoryInventoryMapping[`${item.subcategory}//-${item.scope}`].add(
                item.inventory_name,
            );
        });
        let finalMapping: Record<string, Array<string>> = {};
        for (let key in subCategoryInventoryMapping) {
            finalMapping[key] = Array.from(subCategoryInventoryMapping[key]);
        }
        return finalMapping;
    }, [items]);

    let dynamicColumns = items?.some((item: any) => item?.type === "COMBINED")
        ? columns?.filter((column) => column.field !== "scope")
        : columns;

    dynamicColumns = items?.some((item: IItem) => item?.comments)
        ? dynamicColumns
        : dynamicColumns?.filter((column) => column.field !== "comments");

    function CustomGridTreeDataGroupingCell(props: GridRenderCellParams<IItem>) {
        const { id, field, rowNode, row } = props;
        const apiRef = useGridApiContext();
        const handleClick: ButtonProps["onClick"] = (event) => {
            if (rowNode.type !== "group") {
                return;
            }

            apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded);
            apiRef.current.setCellFocus(id, field);
            event.stopPropagation();
        };

        let found;
        found = bidItemsUpdated?.find((item: { id: any }) => item.id === row.id);
        let scopeDetail = `${
            row?.scope === row?.subcategory
                ? row?.scope
                : row?.subcategory?.includes(row?.scope)
                ? row?.subcategory
                : `${row?.scope} - ${row?.subcategory}`
        }${row?.sub_group_name ? `-${row?.sub_group_name}` : ""}`;
        let inventory = `${
            row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                ? row?.inventory_name &&
                  inventories?.length > 1 &&
                  itemInventoryMapping[`${row?.subcategory}//-${row?.scope}`]?.length > 1
                    ? `${row?.inventory_name?.split?.("#")?.join(",")}`
                    : ""
                : ""
        }`;
        return (
            <Button
                onClick={row?.type === "COMBINED" ? handleClick : undefined}
                tabIndex={-1}
                size="large"
                fullWidth
                sx={{
                    "&:hover": {
                        cursor: row?.type === "COMBINED" ? "pointer" : "default",
                    },
                    alignItems: "left",
                }}
            >
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack
                        direction="column"
                        height="100%"
                        width="100%"
                        justifyContent="left"
                        alignItems="center"
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            width="100%"
                            marginLeft={row?.parent_bid_item_id ? "4.5rem" : "0rem"}
                            height={
                                row?.children ? `${100 / (row?.children?.length + 1)}%` : "100%"
                            }
                        >
                            <Stack direction="column" justifyContent="space-between">
                                <Typography
                                    variant="text_14_semibold"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        whiteSpace: "normal",
                                        textAlign: "left",
                                        lineHeight: "1rem",
                                        textDecorationLine:
                                            row?.type_of_change === "deleted"
                                                ? "line-through"
                                                : "none",
                                    }}
                                    color={
                                        row?.isParentCategory
                                            ? "#000000"
                                            : row?.parent_bid_item_id && row?.type !== "COMBINED"
                                            ? "#969696"
                                            : row?.type_of_change === "deleted"
                                            ? "#D72C0D"
                                            : (row?.unique_price !== 0 ||
                                                  row?.total_price !== 0 ||
                                                  row?.default_price !== 0) &&
                                              row?.type_of_change !== "deleted"
                                            ? row.type_of_change === "updated" &&
                                              !row.is_revised_price
                                                ? "#004D71"
                                                : syncTimeout && found
                                                ? "#B98900"
                                                : "#00B779"
                                            : "#004D71"
                                    }
                                >
                                    {row?.type === "COMBINED" ? (
                                        <Stack direction="row" alignItems="center">
                                            <ExpandCircleDownIcon
                                                htmlColor="#8C9196"
                                                sx={{
                                                    transform: (rowNode as any).childrenExpanded
                                                        ? "rotate(180deg)"
                                                        : "rotate(-90deg)",
                                                }}
                                            />
                                            <MergeIcon
                                                sx={{
                                                    margin: "0 .5rem",
                                                }}
                                            />
                                            <Typography
                                                whiteSpace="normal"
                                                sx={{
                                                    wordWrap: "break-word",
                                                }}
                                                variant="text_14_semibold"
                                            >
                                                {row?.combo_name}
                                            </Typography>
                                        </Stack>
                                    ) : row?.parent_bid_item_id ? (
                                        <Stack direction="row" gap={2}>
                                            <SubdirectoryArrowRightIcon />{" "}
                                            {
                                                <Stack direction="column">
                                                    <Typography variant="text_14_semibold">
                                                        {scopeDetail}
                                                    </Typography>
                                                    {inventory ? (
                                                        <Typography
                                                            variant="text_12_regular"
                                                            color="#00344D"
                                                        >
                                                            Inventory name: {inventory}
                                                        </Typography>
                                                    ) : null}
                                                </Stack>
                                            }
                                        </Stack>
                                    ) : (
                                        <Stack direction="column">
                                            <Typography variant="text_14_semibold">
                                                {scopeDetail}
                                            </Typography>
                                            {inventory ? (
                                                <Typography
                                                    variant="text_12_regular"
                                                    color="#00344D"
                                                >
                                                    Inventory name: {inventory}
                                                </Typography>
                                            ) : null}
                                        </Stack>
                                    )}
                                </Typography>
                                <SubDetailsLine
                                    item={row}
                                    onAlternatesClick={() => {
                                        setShowAlternatesDialog(true);
                                        setViewAlternate(true);
                                        setSelectedItemForAlternates(row?.alternate_item_ref);
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <Box ml="auto" mr="0">
                        {(row?.unique_price !== 0 ||
                            row?.total_price !== 0 ||
                            row?.default_price !== 0) &&
                            row?.type_of_change !== "deleted" &&
                            !row?.parent_bid_item_id &&
                            !row?.isParentCategory &&
                            (row?.type_of_change !== "updated" || row?.is_revised_price) &&
                            (syncTimeout && found ? (
                                <SyncProblemIcon htmlColor="#B98900" />
                            ) : (
                                <CheckCircleSharpIcon htmlColor="#00B779" />
                            ))}

                        {row?.type_of_change !== null ? (
                            row?.type_of_change === "created" ? (
                                row?.default_price > 0 ||
                                row?.unique_price > 0 ||
                                row?.total_price > 0 ? null : (
                                    <Tooltip title={getTypeOfChangeText(row?.type_of_change)}>
                                        <ErrorIcon htmlColor="#D72C0D" />
                                    </Tooltip>
                                )
                            ) : row?.type_of_change === "updated" ? (
                                (row?.default_price > 0 ||
                                    row?.unique_price > 0 ||
                                    row?.total_price > 0) &&
                                row?.is_revised_price ? null : (
                                    <Tooltip title={getTypeOfChangeText(row?.type_of_change)}>
                                        <ErrorIcon htmlColor="#D72C0D" />
                                    </Tooltip>
                                )
                            ) : row?.type_of_change === "deleted" ? (
                                <Tooltip title={getTypeOfChangeText(row?.type_of_change)}>
                                    <ErrorIcon htmlColor="#D72C0D" />
                                </Tooltip>
                            ) : null
                        ) : null}
                    </Box>
                </Stack>
            </Button>
        );
    }

    const handleUnitPriceChange = (event: any) => {
        //check if input expression follow the rules
        let value = event.target.value.replace(/^=/g, "");
        const regExp = new RegExp("^[0-9\\+\\-\\*\\/]+$");
        value == "" ? setUnitPriceExpError(false) : setUnitPriceExpError(!regExp.test(value));

        const rexExpForNumb = new RegExp("^[\\d]*$");
        let isExpression = !rexExpForNumb.test(value);
        if (value != "" && isExpression) {
            try {
                const parser = new Parser();
                let evaluation = parser.parse(value).evaluate();
                if (evaluation == "Infinity" || evaluation <= 0) throw "error";
                setUnitPriceValue(evaluation);
                setUnitPriceExpError(false);
                setExpression(
                    groupedBidItems?.[index]?.fp_name == "All Floor Plans"
                        ? `All_fp:${value}`
                        : value,
                );
            } catch (error) {
                setUnitPriceValue(0);
                setUnitPriceExpError(true);
                setExpression(null);
            }
        } else {
            setUnitPriceValue(parseFloat(event.target.value));
            setExpression(null);
        }
        setDisableField(2);
    };

    const handleLumpSumChange = (event: any) => {
        //check if input expression follow the rules
        const value = event.target.value.replace(/^=/g, "");
        const regExp = new RegExp("^[0-9\\+\\-\\*\\/]+$");
        value == "" ? setLumpsumPriceExpError(false) : setLumpsumPriceExpError(!regExp.test(value));

        const rexExpForNumb = new RegExp("^[\\d]*$");
        let isExpression = !rexExpForNumb.test(value);
        if (value != "" && isExpression) {
            try {
                const parser = new Parser();
                let evaluation = parser.parse(value).evaluate();
                if (evaluation == "Infinity" || evaluation <= 0) throw "error";
                setLumpSumValue(evaluation);
                setLumpsumPriceExpError(false);
                setExpression(
                    groupedBidItems?.[index]?.fp_name == "All Floor Plans"
                        ? `All_fp:${value}`
                        : value,
                );
            } catch (error) {
                setLumpSumValue(0);
                setLumpsumPriceExpError(true);
                setExpression(null);
            }
        } else {
            setLumpSumValue(parseFloat(event.target.value));
            setExpression(null);
        }
        setDisableField(1);
    };
    const resetToDefault = (params: any) => {
        let allFloorPlanItem: IItem = getAllFloorPlanItem(
            groupedBidItems,
            category,
            params?.row?.reno_item_id,
        );
        let default_price = allFloorPlanItem?.default_price;
        dispatch(
            actions?.biddingPortal?.updatePriceInStore({
                quantity: params?.row?.quantity ?? params?.row?.specific_quantity,
                fp_name: groupedBidItems?.[index]?.fp_name,
                total_units: groupedBidItems?.[index]?.total_units,
                category: category,
                id: params?.row?.id,
                reno_item_id: params?.row?.reno_item_id,
                default_price: default_price,
                unique_price: 0,
                is_unique_price: false,
                total_price:
                    disableField === 2
                        ? 0
                        : (default_price ?? 0) *
                          (params?.row?.specific_quantity ?? params?.row?.quantity),
            }),
        );
    };

    const SetNewDefault = (params: { row: IItem }) => {
        //All floor plans in groupedResponseItem contains details of floorplan with unique price
        let allFloorPlanItem: IItem = getAllFloorPlanItem(
            groupedBidItems,
            category,
            params?.row?.reno_item_id,
        );
        //Get floorplans except current one
        let otherFloorPlans: IFloorplanPrice[] | undefined = allFloorPlanItem?.floorplans?.filter(
            (fp: { fp_name: any }) => fp.fp_name !== params?.row?.fp_name,
        );

        // Get current floorplan
        let currentFloorPlan: any = allFloorPlanItem?.floorplans?.filter(
            (fp: { fp_name: any }) => fp.fp_name === params?.row?.fp_name,
        );

        setCurrentFp(currentFloorPlan?.[0] ?? {});

        // Condition 1 : No other FloorPlans with unique value
        // set the current floorplan unique price as default price for all
        if (otherFloorPlans?.length === 0) {
            dispatch(
                actions?.biddingPortal?.updatePriceInStore({
                    quantity: params?.row?.specific_quantity ?? params?.row?.quantity,
                    fp_name: params?.row?.fp_name,
                    total_units: params?.row?.total_units,
                    category: category,
                    id: params?.row?.id,
                    reno_item_id: params?.row?.reno_item_id,
                    default_price: params?.row?.unique_price,
                    unique_price: 0,
                    is_unique_price: false,
                    total_price: params?.row?.total_price,
                    is_historical_pricing: params?.row?.is_historical_price,
                }),
            );
        }
        // Condition 2 : Render popup if atleast one floorplan with unique price other than the current fp exists
        else {
            setOpen(true);
            setUpdatedFps(otherFloorPlans);
            setNewDefaultPrice({
                unit_price: params?.row?.unique_price,
                lump_sum: params?.row?.total_price,
            });
            setSourceOfChange({
                source: "one_fp",
                is_historical_price: params.row.is_historical_price,
            });
            setAllFloorPlan(allFloorPlanItem);
        }
    };

    const getUnitPrice = (params: any) => {
        const isUoMPercentage =
            params?.row?.specific_uom?.toLowerCase() === "percentage" ||
            params?.row?.uom?.toLowerCase() === "percentage";

        const price =
            params?.row?.unique_price === 0 || params?.row?.default_price === 0
                ? params?.row?.total_price > 0
                    ? `${isUoMPercentage ? "" : "$"}${getFormattedNumber(
                          params?.row?.total_price /
                              (isUoMPercentage
                                  ? 1
                                  : params?.row?.specific_quantity ?? params?.row?.quantity),
                          displayPreciseValues,
                      )} ${
                          isUoMPercentage
                              ? "%"
                              : `/ ${getDisplayUOM(params?.row?.specific_uom ?? params?.row?.uom)}`
                      }`
                    : `${isUoMPercentage ? "" : "$"}${getFormattedNumber(
                          params?.row?.unique_price > 0
                              ? params?.row?.unique_price
                              : params?.row?.default_price,
                          displayPreciseValues,
                      )} ${
                          isUoMPercentage
                              ? "%"
                              : `/ ${getDisplayUOM(params?.row?.specific_uom ?? params?.row?.uom)}`
                      }`
                : `${isUoMPercentage ? "" : "$"}${getFormattedNumber(
                      params?.row?.unique_price > 0
                          ? params?.row?.unique_price
                          : params?.row?.default_price,
                      displayPreciseValues,
                  )} ${
                      isUoMPercentage
                          ? "%"
                          : `/ ${getDisplayUOM(params?.row?.specific_uom ?? params?.row?.uom)}`
                  }`;
        return price;
    };
    const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row) => row.hierarchy;
    const groupingColDef: DataGridProProps["groupingColDef"] = {
        headerName: "Scope Detail",
        flex: 1.5,
        renderCell: CustomGridTreeDataGroupingCell,
    };

    const handlePriceChange = (
        params: { row: IItem; field: string },
        is_historical_price?: boolean,
        clearItems?: boolean,
    ) => {
        dispatch(actions.biddingPortal.updateSyncTimerOnFocusOut({}));
        if (params?.field !== "pricing") return;

        if (
            !(
                ((unitPriceValue === params?.row?.unique_price ||
                    unitPriceValue === params?.row?.default_price) &&
                    disableField !== 1) ||
                (lumpSumValue === params?.row?.total_price && disableField !== 2)
            ) ||
            clearItems
        ) {
            // If entered price is same as previous price - do nothing
            let price = getPrice();
            //if all floorplan default price is changed
            if (params?.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS) {
                let isUniqueFloorPlan = isUniqueFloorPlanExists(params?.row);
                if (isUniqueFloorPlan) {
                    setOpen(true);
                    handleSetDefaultPrice(
                        params,
                        disableField === 1 ? 0 : price?.unit_price,
                        disableField === 2 ? 0 : price?.lump_sum,
                        is_historical_price,
                    );
                } else {
                    SetPriceInStore(params, is_historical_price);
                }
            } else {
                SetPriceInStore(params, is_historical_price);
            }
        }
        setUnitPriceValue(0);
        setLumpSumValue(0);
        setExpression(null);
        setDisableField(2);
        setEnterPrice({ id: null, open: false });
    };

    const triggerMixpanelEvent = (params: any) => {
        let eventName = "";
        let eventId = "";
        let isUniqueFloorPlan;
        if (
            params?.row?.total_price === 0 &&
            params?.row?.unique_price === 0 &&
            params?.row?.default_price === 0
        ) {
            eventName = "RFP : Bidbook : Pricing : Price Added";
            eventId = "rfp_bidbook_pricing_price_added";
        } else {
            if (
                (prevUnitPrice > 0 && unitPriceValue > 0) ||
                (prevLumpSumPrice > 0 && lumpSumValue > 0)
            ) {
                eventName = "RFP : Bidbook : Pricing : Price Updated";
                eventId = "rfp_bidbook_pricing_price_updated";
            }
            if (
                (!isNaN(prevUnitPrice) && isNaN(unitPriceValue)) ||
                (!isNaN(prevLumpSumPrice) && isNaN(lumpSumValue))
            ) {
                eventName = "RFP : Bidbook : Pricing : Price Removed";
                eventId = "rfp_bidbook_pricing_price_removed";
            }
        }
        if (floorplanName && floorplanName === "All Floor Plans") {
            isUniqueFloorPlan = false;
        } else if (floorplanName && floorplanName !== "All Floor Plans") {
            isUniqueFloorPlan = true;
        } else {
            isUniqueFloorPlan = false;
        }
        TrackerUtil.event(eventName, {
            eventId,
            projectId: projectDetails?.project_id,
            projectName: projectDetails?.project_name,
            bidStatus: projectDetails?.bid_status,
            previousUnitPrice: prevUnitPrice,
            previousTotalPrice: prevLumpSumPrice,
            unitPrice: unitPriceValue,
            totalPrice: lumpSumValue,
            renoItemId: params?.row?.reno_item_id,
            isUniqueFloorPlan,
        });
        setPrevUnitPrice(unitPriceValue);
        setPrevLumpSumPrice(lumpSumValue);
    };
    const isUniqueFloorPlanExists = (fp_info: IItem) => {
        if (fp_info?.floorplans?.length === 0) return false;
        return true;
    };

    const handleSetDefaultPrice = (
        params: any,
        unit_price: number,
        lump_sum: number,
        is_historical_price?: boolean,
    ) => {
        setUpdatedFps(params?.row?.floorplans);
        setNewDefaultPrice({
            unit_price: unit_price,
            lump_sum: lump_sum,
        });
        setSourceOfChange({ source: "all_fp", is_historical_price });
        setAllFloorPlan(params?.row);
    };

    const getPrice = () => {
        //Find which one (unitprice / lumpsum) is entered by user and update only that in redux
        let unit_price = unitPriceValue;
        if (isEmpty(unitPriceValue) && unitPriceValue > 0) {
            unit_price = unitPriceValue;
        } else if (isEmpty(unitPriceValue) && !(unitPriceValue > 0)) {
            unit_price = 0;
        }

        let lump_sum = lumpSumValue;
        if (isEmpty(lumpSumValue) && lumpSumValue > 0) {
            lump_sum = lumpSumValue;
        } else if (isEmpty(lumpSumValue) && !(lumpSumValue > 0)) {
            lump_sum = 0;
        }
        let price_expression = expression ?? null;
        return {
            unit_price: unit_price,
            lump_sum: lump_sum,
            price_expression,
        };
    };

    const SetPriceInStore = (params: { row: IItem }, is_historical_price?: boolean) => {
        let price = getPrice();
        dispatch(
            actions?.biddingPortal?.updatePriceInStore({
                quantity: params?.row?.specific_quantity ?? params?.row?.quantity,
                fp_name: groupedBidItems?.[index]?.fp_name,
                category: category,
                total_units: groupedBidItems?.[index]?.total_units,
                id: params?.row?.id,
                reno_item_id: params?.row?.reno_item_id,
                default_price:
                    params?.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                        ? disableField === 1
                            ? 0
                            : price?.unit_price
                        : 0,
                unique_price:
                    params?.row?.fp_name !== BIDDING_PORTAL.ALL_FLOOR_PLANS
                        ? disableField === 1
                            ? 0
                            : price?.unit_price
                        : 0,
                is_unique_price:
                    groupedBidItems?.[index]?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS
                        ? false
                        : true,
                total_price: disableField === 2 ? 0 : price?.lump_sum,
                inventory: params?.row?.inventory_name,
                uom: params?.row?.uom,
                is_historical_price,
                sub_group_name: params?.row?.sub_group_name,
                type_of_change: params?.row?.type_of_change,
                price_expression: price?.price_expression,
            }),
        );
    };

    const changeUOMHandler = (row: IItem): void => {
        setShowChangeUOMDialog(true);
        setSelectedItemForChangeUOM(row);
    };
    const updateTimers = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                dispatch(actions?.biddingPortal?.updateSyncTimerOnTimeout({}));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };

    // UseEffects

    // This useEffect is used to set historical price in redux store
    useEffect(() => {
        if (updateStoreWithHistoricalPrice && unitPriceValue && anchor) {
            handlePriceChange(anchor.params, true);
            setAnchor(null);
        }
        //eslint-disable-next-line
    }, [unitPriceValue]);

    useEffect(() => {
        if (!isEmpty(groupedBidItems))
            setFilteredProjectCost(calculateFilteredProjectCost(groupedBidItems));
    }, [groupedBidItems]);

    useEffect(() => {
        if (showPrompt) {
            dispatch(actions.biddingPortal.updateSyncTimerStatesStart({}));
            SyncUpdatedItemsWithApi()
                .then(() => {
                    (confirmNavigation as any)();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        //eslint-disable-next-line
    }, [showPrompt]);

    useEffect(() => {
        if (groupedBidItems?.length > 0 || groupedBidItems === undefined) {
            let catIndex = groupedBidItems?.[index]?.categories?.findIndex(
                (list: any) => list?.category === category,
            );
            if (catIndex !== -1) {
                let items = orgContainerId
                    ? transformDataToHierarchy(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                      )
                    : convertCombinedBidItemsToTreeData(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                      );
                setItems(items);
            }
        }

        // After every 5 secs compare rfpResponseItem and rfpResponseItemUpdated state
        // Find the difference and send the updated ones to call api
        let intervalReference = setInterval(async () => {
            if (bidItemsUpdated && bidItemsUpdated.length > 0) {
                try {
                    const response: IRfpResponseItems[] = await graphQLClient.mutate(
                        "updateBidItems",
                        updateBidItems,
                        {
                            input: bidItemsUpdated,
                        },
                    );
                    if (response.length > 0) {
                        dispatch(
                            actions?.biddingPortal?.syncStoreWithApiSuccess({
                                response: response,
                            }),
                        );
                        clearInterval(intervalReference);
                    }
                } catch (error) {
                    dispatch(actions?.biddingPortal?.syncStoreWithApiFailed({ error: error }));
                }
            }
        }, 10000);

        //eslint-disable-next-line
    }, [groupedBidItems, bidItems, orgContainerId]);

    useEffect(() => {
        if (responseError) {
            const checkResponse = async () => {
                setTimeout(() => {
                    setSyncTimeout(true);
                    updateTimers();
                }, 120000);
            };
            checkResponse();
        }
        //eslint-disable-next-line
    }, [responseError]);

    useEffect(() => {
        if (isEditable && !isIdle && !isOffline) {
            bidItems?.length > 0 &&
                snackbar?.open &&
                !disableSnackbar &&
                enqueueSnackbar(getSnackbarMessage(snackbar?.message ?? "", snackbar?.variant), {
                    variant: snackbar?.variant,
                    action: (snackbarId: string | number) => {
                        return (
                            <IconButton
                                onClick={() => {
                                    closeSnackbar(snackbarId);
                                }}
                                sx={{
                                    left: "-5px",
                                }}
                            >
                                <CloseIcon htmlColor="black" />
                            </IconButton>
                        );
                    },
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                    },
                    style: {
                        padding: ".25rem",
                    },
                });
        }

        //eslint-disable-next-line
    }, [bidItems, snackbar]);
    return (
        <>
            <HistoricalPricingMenu
                anchor={anchor}
                setAnchor={setAnchor}
                handleItemClick={(unit_price: number) => {
                    setUpdateStoreWithHistoricalPrice(true);
                    setUnitPriceValue(unit_price);
                }}
            />
            <RfpDialog
                open={open}
                updatedFps={updatedFps}
                setUpdatedFps={setUpdatedFps}
                setOpen={setOpen}
                newDefaultPrice={newDefaultPrice}
                allFloorPlan={allFloorPlan}
                category={category}
                currentFp={currentFp}
                sourceOfChange={sourceOfChange.source}
                is_historical_price={sourceOfChange.is_historical_price}
                showInventories={inventories.length > 1}
            />
            <ChangeUOMDialog
                open={showChangeUOMDialog}
                item={selectedItemForChangeUOM}
                onCancel={() => {
                    setSelectedItemForChangeUOM(undefined);
                    setShowChangeUOMDialog(false);
                }}
                onSave={(selectedUOM) => {
                    dispatch(
                        actions.biddingPortal.updateUnitOfMeasureStart({
                            id: selectedItemForChangeUOM?.id,
                            specific_uom: selectedUOM,
                            projectId,
                            contractorOrgId: orgId,
                            renovationVersion: currentRenoversion,
                        }),
                    );
                    setSelectedItemForChangeUOM(undefined);
                    setShowChangeUOMDialog(false);
                }}
            />
            <AlternateDialog
                open={showAlternatesDialog}
                onClose={() => {
                    setShowAlternatesDialog(false);
                    setSelectedItemForAlternates(null);
                    setEditAlternateItem(false);
                    setViewAlternate(false);
                }}
                isView={viewAlternate}
                isEdit={editAlternateItem}
                item={selectedItemForAlternates}
            />
            <Dialog open={loader}>
                <img src={BlinkLoader} alt="loader" />
            </Dialog>
            <CombinePrompt
                open={comboPromptState?.open}
                selectedComboId={comboPromptState?.selectedItemId}
                items={selectedRowsData}
                fpName={groupedBidItems?.[index]?.fp_name}
                onClose={() => {
                    setSelectedRows([]);
                    setComboPromptState({ open: false });
                }}
                onCombine={(
                    comboName: string,
                    checkedItems: string[],
                    uom: string,
                    percentageValue: string,
                ) => {
                    onCombineLineItems2(
                        setLoader,
                        groupedBidItems,
                        category,
                        selectedRows,
                        setItemsToRemove,
                        setOpenCombineDialog,
                        dispatch,
                        projectId,
                        setSelectedRows,
                        comboName,
                        groupedBidItems?.[index]?.fp_name,
                        checkedItems,
                        uom,
                        percentageValue,
                    );
                    setComboPromptState({ open: false });
                }}
                onRename={(comboName: string) => {
                    renameCombination(
                        groupedBidItems,
                        dispatch,
                        comboPromptState?.params,
                        category,
                        comboName,
                    );
                    setComboPromptState({ open: false });
                }}
            />
            <CombineDialog
                open={openCombineDialog}
                items={itemsToRemove}
                onClose={() => {
                    setOpenCombineDialog(false);
                    setSelectedRows([]);
                    setLoader(false);
                    setItemsToRemove({});
                }}
                onSubmit={() => {
                    let allInventories: Record<string, Array<IItem>> = itemsToRemove.allInventories;
                    let missing_items: Record<string, IItem> = itemsToRemove?.missing_items;
                    if (allInventories && missing_items) {
                        Object.values(missing_items).forEach((item) => {
                            for (let key in allInventories) {
                                let items = allInventories[key];
                                if (items && items?.includes(item)) {
                                    allInventories[key] = items.filter((it) => it.id !== item.id);
                                }
                            }
                        });
                        dispatch(
                            actions.biddingPortal.combineLineItemsStart({
                                projectId: projectId,
                                category,
                                allInventories,
                                comboName: itemsToRemove.comboName,
                            }),
                        );
                        setLoader(false);
                        setSelectedRows([]);
                        setOpenCombineDialog(false);
                        setItemsToRemove({});
                    }
                }}
            />
            <DeleteAlternateDialog
                open={showDeleteAlternateDialog}
                onClose={() => {
                    setShowDeleteAlternateDialog(false);
                    setSelectedItemForAlternates(null);
                }}
                onRemove={() => {
                    dispatch(
                        actions.biddingPortal.deleteAlternateItemStart({
                            bid_item_id: selectedItemForAlternates?.id,
                            userID: userID,
                            role: role,
                            project_id: projectId,
                            contractor_org_id: orgId,
                            reno_item_id: selectedItemForAlternates?.reno_item_id,
                            navigate,
                            isAdminAccess,
                            version: version,
                            isLatest: isLatest,
                        }),
                    );
                    setShowDeleteAlternateDialog(false);
                    setSelectedItemForAlternates(null);
                }}
            />
            <Grid item xs>
                <BaseDataGridPro
                    treeData={items?.some(
                        (item: any) =>
                            item?.type === "COMBINED" || (item?.l2_name !== null && item?.l2_name),
                    )}
                    checkboxSelection
                    getTreeDataPath={getTreeDataPath}
                    isRowSelectable={(params: any) => {
                        return !params?.row?.parent_bid_item_id || !params?.row?.isParentCategory;
                    }}
                    hideToolbar
                    disableRowSelectionOnClick
                    columns={dynamicColumns}
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel: any) =>
                        setColumnVisibilityModel(newModel)
                    }
                    rows={items ?? []}
                    rowsPerPageOptions={[]}
                    hideFooter={true}
                    sx={{
                        "& .MuiDataGrid-row:hover": {
                            background: "#E4F7FA",
                        },
                        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                            outline: "none",
                        },
                        " .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
                            {
                                marginLeft: "0.25rem",
                            },
                        ".super-app-theme--combined": {
                            ".MuiDataGrid-cellCheckbox.MuiDataGrid-cell--withRenderer": {
                                display: "flex",
                                alignItems: "flex-start",
                                paddingTop: "2rem",
                            },
                        },
                        ".super-app-theme--parent": {
                            ".MuiDataGrid-cellCheckbox.MuiDataGrid-cell--withRenderer": {
                                visibility: "hidden",
                            },
                        },
                    }}
                    getRowClassName={(params: { row: IItem }) => {
                        if (params?.row?.type === "COMBINED") {
                            return `super-app-theme--combined`;
                        }
                        if (params?.row?.isParentCategory) {
                            return `super-app-theme--parent`;
                        }
                        return `super-app-theme--${params.row.type_of_change}`;
                    }}
                    getRowHeight={({ densityFactor, model }: GridRowHeightParams) => {
                        return model?.isParentCategory
                            ? 38
                            : model?.children
                            ? (model?.children?.length * 10 + 90) * densityFactor
                            : 90 * densityFactor;
                    }}
                    getRowId={(row: any) => row?.id}
                    onCellClick={
                        isEditable && !isIdle && !isOffline && !syncTimeout
                            ? (params: { field: string; row: IItem }) => {
                                  const isAllFp =
                                      params?.row?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS;
                                  const isPercentageUoM =
                                      params?.row?.uom?.toLowerCase() === "percentage" ||
                                      params?.row?.specific_uom?.toLowerCase() === "percentage";

                                  if (!isAllFp && isPercentageUoM) return;

                                  if (enterPrice?.id === params?.row?.reno_item_id) return;

                                  if (
                                      params?.field === "pricing" &&
                                      params?.row?.type_of_change === "deleted" &&
                                      params?.row?.unique_price === 0 &&
                                      params?.row?.default_price === 0 &&
                                      params?.row?.total_price === 0
                                  ) {
                                      return;
                                  } else if (
                                      params?.field === "pricing" &&
                                      !params.row.is_historical_price
                                  ) {
                                      new Promise((res) => setTimeout(res, 25)).then(() => {
                                          let price = 0;
                                          if (
                                              params?.row?.fp_name ===
                                              BIDDING_PORTAL.ALL_FLOOR_PLANS
                                          ) {
                                              if (params?.row?.unique_price) {
                                                  price = params?.row?.unique_price;
                                              } else {
                                                  price = params?.row?.default_price;
                                              }
                                          } else {
                                              if (params?.row?.default_price > 0)
                                                  price = params?.row?.default_price;
                                              else price = params?.row?.unique_price;
                                          }
                                          setEnterPrice({
                                              id: params.row.reno_item_id,
                                              open: true,
                                          });
                                          let unitPrice = params?.row?.total_price ? 0 : price;
                                          setUnitPriceValue(unitPrice);
                                          setLumpSumValue(params?.row?.total_price);
                                          if (
                                              params?.row?.price_expression &&
                                              params?.row?.price_expression?.includes("All_fp") &&
                                              params?.row?.fp_name ===
                                                  BIDDING_PORTAL.ALL_FLOOR_PLANS
                                          ) {
                                              setExpression(
                                                  params?.row?.price_expression.split(":")[1],
                                              );
                                          } else if (
                                              params?.row?.price_expression &&
                                              !params?.row?.price_expression?.includes("All_fp") &&
                                              params?.row?.fp_name !==
                                                  BIDDING_PORTAL.ALL_FLOOR_PLANS
                                          ) {
                                              setExpression(params?.row?.price_expression);
                                          } else {
                                              setExpression(null);
                                          }
                                      });
                                  }
                              }
                            : null
                    }
                    onCellKeyDown={(params: any, event: any) => {
                        if (event?.key === "Enter" || event?.key === "Tab") {
                            handlePriceChange(params);
                            triggerMixpanelEvent(params);
                            if (unitPriceValue === params?.row?.unique_price) {
                                setDisableField(2);
                            } else if (lumpSumValue === params?.row?.total_price) {
                                setDisableField(1);
                            }
                            setUnitPriceExpError(false);
                            setLumpsumPriceExpError(false);
                        }
                    }}
                    subComponents={{
                        moreActionsIcon: KebabMenuIcon,
                        baseCheckbox: (props: any) => <BaseCheckbox {...props} />,
                    }}
                    onRowSelectionModelChange={(selectionModel: any) => {
                        setSelectedRows(selectionModel);
                        setSelectedRowsData(
                            items.filter((row: any) => selectionModel.includes(row.id.toString())),
                        );
                    }}
                    selectionModel={selectedRows}
                    apiRef={apiRef}
                    groupingColDef={groupingColDef}
                    isGroupExpandedByDefault={() => {
                        return true;
                    }}
                />
            </Grid>
        </>
    );
};

export default PriceDataGrid;
