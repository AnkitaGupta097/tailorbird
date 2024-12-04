import { Divider, Grid } from "@mui/material";
import {
    DataGridProProps,
    GRID_TREE_DATA_GROUPING_FIELD,
    GridColDef,
    GridColumnGroupingModel,
    GridColumnVisibilityModel,
    GridPinnedRowsProp,
    GridRowParams,
    useGridApiRef,
    GridToolbar,
} from "@mui/x-data-grid-pro";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import BaseTabs from "components/base-tabs";
import BaseCheckbox from "components/checkbox";
import BaseDataGridPro from "components/data-grid-pro";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getColumns } from "./bid-levelling-columns";
import ScopeSelectorButton from "./components/ScopeSelectorButton";
import {
    ColumnFiltersWithStates,
    initialColumnFilters,
} from "./components/column-filter/column-filters-with-state";
import ExportBidLevelingButton from "./components/ExportBidLevelingButton";
import RowFilters from "./components/row-filter";
import {
    BL_TABS,
    BL_TABS_INTERIOR,
    FILTER_CHIP_BG_COLOR,
    FLOORING_STATE_TYPE,
    TREE_DATA_CELL_FONT_COLOR,
    getRowFilters,
} from "./constants";
import { useAppSelector } from "stores/hooks";
import {
    addSubTotalRow,
    getBidLevelingData,
    getSelectedBidItems,
    getSubtotal,
    getTotals,
    groupedFpReducer,
    rowReducer,
    updateCategorytotal,
    updatePercentRowsValue,
    updateScopeSelector,
    updateSequence,
} from "./helper";
import ExpandRows from "./components/ExpandRows";

const TotalRow = {
    hierarchy: ["Total"],
    id: "Total",
};
const pinnedRows: GridPinnedRowsProp = {
    bottom: [TotalRow],
};

const BidLeveling: FC = () => {
    const { projectDetails } = useAppSelector((state: any) => ({
        projectDetails: state.projectDetails.data,
    }));
    const userId = localStorage.getItem("user_id");
    const apiRef = useGridApiRef();
    const { projectId } = useParams();
    const { ROW_FILTERS } = getRowFilters(projectDetails.projectType);
    const [isInitalDataLoading, setIsInitialDataLoading] = useState<boolean>(false);
    const [isRowFilterDataLoading, setIsRowFilterDataLoading] = useState<boolean>(true);
    const [blColumns, setBlColumns] = useState<GridColDef[]>([]);
    const [blColumnGroupingModel, setBlColumnGroupingModel] = useState<GridColumnGroupingModel>([]);
    const [currentTab, setCurrentTab] = useState<string>(
        projectDetails?.projectType === "INTERIOR" ? "wtd_avg" : "aggregate",
    );
    const [apiResponse, setApiResponse] = useState<any>({});
    const [selectedItemsResp, setSelectedItemsResp] = useState<any>(null);
    const [allItemsResp, setAllItemsResp] = useState<any>(null);
    const [selectedMaterialItemsResp, setSelectedMaterialItemsResp] = useState<any>(null);
    const [allMaterialBidItems, setAllMaterialBidItems] = useState<any>(null);
    const [selectedLaborItemsResp, setSelectedLaborItemsResp] = useState<any>(null);
    const [allLaborBidItems, setAllLaborBidItems] = useState<any>(null);

    const [rowFilters, setRowFilter] = useState<Record<string, string[]>>(ROW_FILTERS);
    const [hiddenCols, setHiddenCols] = useState<GridColumnVisibilityModel>({});
    const [columnFilters, setColumnFilters] = React.useState<any>({});
    const [isViewMode, setIsViewMode] = useState<boolean>(true);
    const [cancleClick, setCancleClick] = useState<boolean>(false);

    const [metadata, setMetaData] = useState<
        Record<string, Array<string | Array<{ fp_name: string; bed_bath_count: string }>>>
    >({});
    const [BlTotals, setBlTotals] = useState<any>({});
    const [columnMapping, setColumnMapping] = useState<Array<any>>([]);
    const [openFilterAccordions, setOpenFilterAccordions] = useState<{
        rowFilterAccordion: boolean;
        columnFilterAccordion: boolean;
    }>({
        rowFilterAccordion: false,
        columnFilterAccordion: false,
    });
    const [isFlooringSplitUsed, setIsFlooringSplitUsed] = useState(false);
    const [currentFlooringState, setCurrentFlooringState] =
        useState<FLOORING_STATE_TYPE>("default");
    // These are selected BL rows (View Mode)
    const [blRows, setBlRows] = useState<Record<string, Record<FLOORING_STATE_TYPE, any[]>>>({});
    const [internalColumnFiltersState, setinternalColumnFiltersState] =
        useState<typeof initialColumnFilters>(initialColumnFilters);
    const [appliedFilters, setAppliedFilters] = useState<{
        rowFilters: boolean;
        columnFilters: boolean;
    }>({ rowFilters: false, columnFilters: false });
    const [groupingExpansionDepth, setGroupingExpansionDepth] = useState<number>(0);
    const isScopeDetailFiltered = "name" in hiddenCols;

    const onTabChanged = (event: ChangeEvent<{}>, newValue: string): void =>
        setCurrentTab(newValue);

    const getFlooringState = (flooringFilter: string[]): FLOORING_STATE_TYPE => {
        if (projectDetails.projectType !== "INTERIOR") {
            return "default";
        }
        if (flooringFilter.length === 0) return "consolidated";

        if (flooringFilter.length === 1) {
            if (flooringFilter[0]?.toLowerCase() === "ground") return "ground";
            if (flooringFilter[0]?.toLowerCase() === "upper") return "upper";
        }

        return "default";
    };

    const handleScopeSelection = async (): Promise<void> => {
        if (!isViewMode) {
            const selectedRowIds = Array.from(apiRef.current.getSelectedRows().keys());
            setIsInitialDataLoading(true);
            const selectedBidItemsNew = getSelectedBidItems(selectedRowIds, allItemsResp);
            const selectedMaterialItemsNew = getSelectedBidItems(
                selectedRowIds,
                allMaterialBidItems,
            );
            const selectedLaborItemsNew = getSelectedBidItems(selectedRowIds, allLaborBidItems);

            setSelectedItemsResp(selectedBidItemsNew);
            setSelectedMaterialItemsResp(selectedMaterialItemsNew);
            setSelectedLaborItemsResp(selectedLaborItemsNew);
            setAllItemsResp({
                ...allItemsResp,
                metadata: { ...allItemsResp?.metadata, selected_ids: selectedRowIds },
            });
            if (selectedRowIds?.length > 0) {
                await updateScopeSelector({
                    projectId,
                    userId,
                    itemsSelection: selectedRowIds.map((selectedId) => ({
                        id: selectedId,
                        is_selected: true,
                    })),
                });
            }
        }
        setIsViewMode(!isViewMode);
    };

    useEffect(
        () => {
            const getBidLevelingDataFn = (response: any) => {
                if (response) {
                    setApiResponse(response);
                    setIsFlooringSplitUsed(response?.metadata?.is_flooring_split);
                    setCurrentFlooringState(
                        response?.metadata?.is_flooring_split ? "default" : "consolidated",
                    );

                    const md: typeof metadata = {
                        ...response.metadata,
                        grouped_floorplans: response.metadata["grouped_floorplans"].reduce(
                            groupedFpReducer,
                            [],
                        ),
                    };

                    setMetaData(md);

                    const dataMapping: Array<any> = [];

                    md.contractors.forEach((contractor_name) => {
                        const floorplanMapping: Array<any> = [];

                        md.floorplans.forEach((floorplan) => {
                            const inventories: Array<any> = [];

                            md.inventories.forEach((inventory) => {
                                inventories.push({
                                    name: inventory,
                                });
                            });

                            floorplanMapping.push({
                                name: floorplan,
                                inventories: inventories,
                            });
                        });

                        const inventories_without_fp: Array<any> = [];

                        md.inventories.forEach((inventory) => {
                            inventories_without_fp.push({
                                name: inventory,
                            });
                        });

                        const contractor = {
                            name: contractor_name,
                            floorplans: floorplanMapping,
                            inventories_without_fp: inventories_without_fp,
                        };
                        dataMapping.push(contractor);
                    });

                    setColumnMapping(dataMapping);
                    setColumnFilters((prev: any) => ({
                        ...prev,
                        selectedContractors: md.contractors as Array<string>,
                    }));
                    setinternalColumnFiltersState((prev) => ({
                        ...prev,
                        selectedContractors: md.contractors as Array<string>,
                    }));
                    setAppliedFilters((prev) => ({
                        ...prev,
                        columnFilters: true,
                    }));
                    //sequence Below-the_line category
                    response = updateSequence(response);
                    let classifiedAllBlRows = response?.categories?.reduce(
                        (groupedRows: Record<FLOORING_STATE_TYPE, any[]>, category: any) =>
                            rowReducer(groupedRows, category, projectDetails.projectType),
                        {
                            default: [],
                            ground: [],
                            upper: [],
                            consolidated: [],
                        },
                    );

                    const materialRows = selectedMaterialItemsResp?.categories?.reduce(
                        (groupedRows: Record<FLOORING_STATE_TYPE, any[]>, category: any) =>
                            rowReducer(groupedRows, category, projectDetails.projectType),
                        {
                            default: [],
                            ground: [],
                            upper: [],
                            consolidated: [],
                        },
                    );
                    const laborRows = selectedLaborItemsResp?.categories?.reduce(
                        (groupedRows: Record<FLOORING_STATE_TYPE, any[]>, category: any) =>
                            rowReducer(groupedRows, category, projectDetails.projectType),
                        {
                            default: [],
                            ground: [],
                            upper: [],
                            consolidated: [],
                        },
                    );

                    //update Categories total
                    for (let group in classifiedAllBlRows) {
                        classifiedAllBlRows[group] = updateCategorytotal(
                            classifiedAllBlRows[group],
                        );

                        materialRows[group] = updateCategorytotal(materialRows[group]);

                        laborRows[group] = updateCategorytotal(laborRows[group]);
                    }
                    const otherTab = currentTab === "wtd_avg" ? "aggregate" : "wtd_avg";
                    let subtotalAll = {
                        [currentTab]: getSubtotal({
                            AllRows: classifiedAllBlRows,
                            tab: currentTab,
                        }),
                        [otherTab]: getSubtotal({
                            AllRows: classifiedAllBlRows,
                            tab: otherTab,
                        }),
                    };
                    let subtotalMaterial = {
                        [currentTab]: getSubtotal({
                            AllRows: materialRows,
                            tab: currentTab,
                        }),
                        [otherTab]: getSubtotal({
                            AllRows: materialRows,
                            tab: otherTab,
                        }),
                    };

                    let subtotalLabor = {
                        [currentTab]: getSubtotal({
                            AllRows: laborRows,
                            tab: currentTab,
                        }),
                        [otherTab]: getSubtotal({
                            AllRows: laborRows,
                            tab: otherTab,
                        }),
                    };
                    //update below the line categories if %
                    let updatedAllRowsWithPercent = updatePercentRowsValue({
                        rows: classifiedAllBlRows,
                        subtotalAll,
                        subtotalMaterial,
                        subtotalLabor,
                    });
                    const updatedMaterialRowsWithPercent = updatePercentRowsValue({
                        rows: materialRows,
                        subtotalAll,
                        subtotalMaterial,
                        subtotalLabor,
                    });
                    const updatedLaborRowsWithPercent = updatePercentRowsValue({
                        rows: laborRows,
                        subtotalAll,
                        subtotalMaterial,
                        subtotalLabor,
                    });
                    addSubTotalRow(updatedAllRowsWithPercent);
                    addSubTotalRow(updatedMaterialRowsWithPercent);
                    addSubTotalRow(updatedLaborRowsWithPercent);
                    let totals = getTotals({
                        rows: classifiedAllBlRows["default"],
                        tab: currentTab,
                    });
                    setBlTotals({
                        [currentTab]: totals,
                        [otherTab]: getTotals({
                            rows: classifiedAllBlRows["default"],
                            tab: otherTab,
                        }),
                    });
                    const { columns, columnGroupingModel } = getColumns(
                        dataMapping,
                        currentTab,
                        columnFilters,
                        true,
                        totals,
                    );

                    setBlColumns(columns);
                    setBlColumnGroupingModel(columnGroupingModel);
                    // This code is to set the selected rows in edit mode
                    apiRef.current.setRowSelectionModel(
                        isViewMode ? [] : (response?.metadata?.selected_ids as any),
                    );
                    setBlRows(() => ({
                        all: updatedAllRowsWithPercent,
                        Material: updatedMaterialRowsWithPercent,
                        Labor: updatedLaborRowsWithPercent,
                    }));
                    setIsInitialDataLoading(false);
                } else {
                    // Handle empty response data
                    console.error("No data received");
                    setIsInitialDataLoading(false);
                }
            };

            if (projectId) {
                setIsInitialDataLoading(true);
                if (isViewMode && selectedItemsResp) {
                    getBidLevelingDataFn(selectedItemsResp);
                    setCancleClick(!cancleClick);
                } else if (!isViewMode && allItemsResp) {
                    getBidLevelingDataFn(allItemsResp);
                } else {
                    setIsRowFilterDataLoading(true);
                    getBidLevelingData(projectId, "all", "all")
                        .then(async (data: any) => {
                            if (data?.errors) {
                                // Handle GraphQL errors
                                setIsInitialDataLoading(false);
                            } else {
                                const FilteredData: any = await Promise.all([
                                    getBidLevelingData(projectId, "all", "Material"),
                                    getBidLevelingData(projectId, "all", "Labor"),
                                ]);

                                let responseMaterial = FilteredData[0]?.getBidLevelingDataV2;
                                setAllMaterialBidItems(responseMaterial);
                                if (responseMaterial) {
                                    responseMaterial = updateSequence(responseMaterial);
                                    const selectedMaterialIds =
                                        responseMaterial?.metadata?.selected_ids;
                                    if (selectedMaterialIds) {
                                        setSelectedMaterialItemsResp(() =>
                                            getSelectedBidItems(
                                                selectedMaterialIds,
                                                responseMaterial,
                                            ),
                                        );
                                    } else {
                                        setSelectedMaterialItemsResp(responseMaterial);
                                    }
                                }
                                let responseLabor = FilteredData[1]?.getBidLevelingDataV2;
                                setAllLaborBidItems(responseLabor);
                                if (responseLabor) {
                                    responseLabor = updateSequence(responseLabor);
                                    const selectedLaborIds = responseLabor?.metadata?.selected_ids;
                                    if (selectedLaborIds) {
                                        setSelectedLaborItemsResp(() =>
                                            getSelectedBidItems(selectedLaborIds, responseLabor),
                                        );
                                    } else {
                                        setSelectedLaborItemsResp(responseLabor);
                                    }
                                }

                                // Get Data for All Work Types and store in row State
                                let responseAll = data?.getBidLevelingDataV2;
                                if (responseAll) {
                                    setAllItemsResp(responseAll);
                                    const selectedAllIds = responseAll?.metadata?.selected_ids;
                                    if (selectedAllIds) {
                                        setSelectedItemsResp(() =>
                                            getSelectedBidItems(selectedAllIds, responseAll),
                                        );
                                    } else {
                                        setSelectedItemsResp(responseAll);
                                    }
                                }

                                setIsRowFilterDataLoading(false);
                                // });
                            }
                        })
                        .catch((error: any) => {
                            // Handle network or other errors
                            console.error("Apollo error:", error);
                            setIsInitialDataLoading(false);
                        });
                }
            }
        },
        //eslint-disable-next-line
        [projectId, currentTab, isViewMode, selectedItemsResp],
    );

    useEffect(() => {
        const { Content: colsToFilter, Flooring: flooringFilter } = rowFilters;
        setHiddenCols(
            blColumns.reduce((visibilityModel, { headerName, field }) => {
                const shouldBeHidden =
                    headerName &&
                    field &&
                    field !== "__check__" &&
                    !(
                        headerName?.length === 0 ||
                        headerName?.toLowerCase().includes("inventory") ||
                        headerName?.toLowerCase().includes("floor plan") ||
                        headerName?.toLowerCase().includes("contractor") ||
                        colsToFilter.includes(headerName)
                    );

                return {
                    ...visibilityModel,
                    ...(shouldBeHidden && { [field]: false }),
                };
            }, {}),
        );
        const flooringState = getFlooringState(flooringFilter);
        let totals = getTotals({
            rows:
                blRows?.[
                    rowFilters?.["Work Type"]?.length === 1 ? rowFilters?.["Work Type"]?.[0] : "all"
                ]?.[currentFlooringState] ?? [],
            tab: currentTab,
        });
        const otherTab = currentTab === "wtd_avg" ? "aggregate" : "wtd_avg";
        setBlTotals({
            [currentTab]: totals,
            [otherTab]: getTotals({
                rows:
                    blRows?.[
                        rowFilters?.["Work Type"]?.length === 1
                            ? rowFilters?.["Work Type"]?.[0]
                            : "all"
                    ]?.[currentFlooringState] ?? [],
                tab: otherTab,
            }),
        });
        setCurrentFlooringState(flooringState);
        const { columns, columnGroupingModel } = getColumns(
            columnMapping,
            currentTab,
            columnFilters,
            appliedFilters.columnFilters,
            totals,
        );
        setBlColumns(columns);
        setBlColumnGroupingModel(columnGroupingModel);
        //eslint-disable-next-line
    }, [rowFilters]);

    useEffect(() => {
        if (Object.keys(apiResponse).length !== 0) {
            let totals = getTotals({
                rows:
                    blRows?.[
                        rowFilters?.["Work Type"]?.length === 1
                            ? rowFilters?.["Work Type"]?.[0]
                            : "all"
                    ]?.[currentFlooringState] ?? [],
                tab: currentTab,
            });

            const otherTab = currentTab === "wtd_avg" ? "aggregate" : "wtd_avg";
            setBlTotals({
                [currentTab]: totals,
                [otherTab]: getTotals({
                    rows:
                        blRows?.[
                            rowFilters?.["Work Type"]?.length === 1
                                ? rowFilters?.["Work Type"]?.[0]
                                : "all"
                        ]?.[currentFlooringState] ?? [],
                    tab: otherTab,
                }),
            });
            const { columns, columnGroupingModel } = getColumns(
                columnMapping,
                currentTab,
                columnFilters,
                appliedFilters.columnFilters,
                totals,
            );
            setBlColumns(columns);
            setBlColumnGroupingModel(columnGroupingModel);
        } //eslint-disable-next-line
    }, [appliedFilters, currentTab, currentFlooringState]);
    useEffect(() => {
        setGroupingExpansionDepth(isScopeDetailFiltered ? 0 : groupingExpansionDepth);
        //eslint-disable-next-line
    }, [isScopeDetailFiltered]);

    const ExpandRowsProps = {
        isScopeDetailFiltered,
        isInitalDataLoading,
        groupingExpansionDepth,
        setGroupingExpansionDepth,
    };

    const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row: any) => row?.hierarchy;
    const groupingColDef: any = {
        headerName: <ExpandRows {...ExpandRowsProps} />,
        headerAlign: "left",
        align: "left",
    };

    const onCancelClick = () => setIsViewMode(!isViewMode);

    const dataGridProps = {
        slotProps: {
            toolbar: {
                csvOptions: {
                    disableToolbarButton: true,
                },
                printOptions: {
                    disableToolbarButton: true,
                },
                showQuickFilter: true,
            },
        },
        disableColumnFilter: true,
        disableColumnSelector: true,
        disableDensitySelector: true,
        defaultGroupingExpansionDepth: groupingExpansionDepth,
        sx: {
            "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#eee",
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                display: "inherit",
            },
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none",
            },
            "&.MuiDataGrid-root .Mui-selected": {
                backgroundColor: FILTER_CHIP_BG_COLOR,
                "&:hover": {
                    backgroundColor: FILTER_CHIP_BG_COLOR,
                },
            },
            "& .MuiDataGrid-cell": {
                fontSize: "13px",
                lineHeight: 2,
            },
            ".MuiDataGrid-cellCheckbox.MuiDataGrid-cell--withRenderer": {
                display: "flex",
                alignItems: "flex-start",
                paddingTop: "1rem",
            },
            ".parent": {
                ".MuiDataGrid-cellCheckbox.MuiDataGrid-cell--withRenderer": {
                    visibility: "hidden",
                },
                ".MuiDataGrid-treeDataGroupingCell": {
                    color: TREE_DATA_CELL_FONT_COLOR,
                    fontWeight: 500,
                },
            },
            ".total": {
                background: "#EEEEEE",
                fontWeight: "700",
            },
        },
        experimentalFeatures: { columnGrouping: true },
        columns: blColumns,
        rows:
            blRows?.[
                rowFilters?.["Work Type"]?.length === 1 ? rowFilters?.["Work Type"]?.[0] : "all"
            ]?.[currentFlooringState] ?? [],
        rowsPerPageOptions: [],
        columnGroupingModel: blColumnGroupingModel,
        getTreeDataPath,
        initialState: {
            pinnedColumns: {
                left: ["__check__", GRID_TREE_DATA_GROUPING_FIELD, "name", "description"],
            },
        },
        columnVisibilityModel: hiddenCols,
        apiRef,
        disableSelectionOnClick: isViewMode,
        groupingColDef,
        getRowId: (row: GridRowParams) => row?.id,
        loading: isInitalDataLoading,
        pinnedRows: pinnedRows,
        checkboxSelection: !isViewMode,
        isRowSelectable: (params: any) =>
            !params?.row?.is_parent && params.row?.id !== "Total" && params.row?.id !== "Subtotal",
        slots: {
            baseCheckbox: (props: any) => <BaseCheckbox {...props} />,
            toolbar: GridToolbar,
            treeDataCollapseIcon: (props: any) => (
                <KeyboardArrowDownOutlinedIcon
                    {...props}
                    style={{ display: isScopeDetailFiltered ? "none" : "inline" }}
                    htmlColor={TREE_DATA_CELL_FONT_COLOR}
                />
            ),
            treeDataExpandIcon: (props: any) => (
                <KeyboardArrowRightOutlinedIcon
                    {...props}
                    style={{ display: isScopeDetailFiltered ? "none" : "inline" }}
                    htmlColor={TREE_DATA_CELL_FONT_COLOR}
                />
            ),
        },
        getRowClassName: (params: any) => {
            if (
                params?.row?.is_parent ||
                params?.row?.is_subcategory ||
                params?.row?.id === "Subtotal"
            )
                return `parent`;
            if (params?.row?.id === "Total") return "total";
            return "";
        },
        getCellClassName: (params: any) => {
            if (params.field === "__tree_data_group__" && params?.row?.is_subcategory) {
                return "sub-parent";
            }
            if (
                params.field === "__tree_data_group__" &&
                !params?.row?.is_parent &&
                params?.row?.id?.toLowerCase() !== "total" &&
                params?.row?.id?.toLowerCase() !== "subtotal"
            )
                return "non-parent";
        },
    };

    const excelDataProps = {
        blColumns: blColumns?.map((el) => el?.headerName),
        blRows:
            blRows?.[
                rowFilters?.["Work Type"]?.length === 1 ? rowFilters?.["Work Type"]?.[0] : "all"
            ]?.[currentFlooringState] ?? [],
        blColumnGroupingModel,
        contractors: columnFilters?.selectedContractors,
        Content: rowFilters?.Content,
        isDisabled: isInitalDataLoading,
        BlTotals,
    };

    return (
        <Grid container direction="column" gap="0.3rem">
            <Grid item xs m="1rem 0">
                <Grid container gap={2} direction="row" width="95vw">
                    <Grid item xs={12}>
                        <ColumnFiltersWithStates
                            isDisabled={isInitalDataLoading}
                            contractors={(metadata?.contractors as Array<string>) ?? []}
                            columnFilters={columnFilters}
                            appliedFilters={appliedFilters}
                            setAppliedFilters={setAppliedFilters}
                            setColumnFilters={setColumnFilters}
                            floorplans={(metadata?.grouped_floorplans as Array<any>) ?? []}
                            inventories={(metadata?.inventories as Array<string>) ?? []}
                            expanded={openFilterAccordions.columnFilterAccordion}
                            setExpanded={() => {
                                setOpenFilterAccordions((prev) => ({
                                    ...prev,
                                    columnFilterAccordion: !prev.columnFilterAccordion,
                                }));
                            }}
                            internalColumnFiltersState={internalColumnFiltersState}
                            setinternalColumnFiltersState={setinternalColumnFiltersState}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RowFilters
                            isLoading={isInitalDataLoading}
                            isFloorSplitUsed={isFlooringSplitUsed}
                            isWorkTypeDataLoading={isRowFilterDataLoading}
                            intialFilters={rowFilters}
                            setRowFilters={setRowFilter}
                            expanded={openFilterAccordions.rowFilterAccordion}
                            setExpanded={() =>
                                setOpenFilterAccordions((prev) => ({
                                    ...prev,
                                    rowFilterAccordion: !prev.rowFilterAccordion,
                                }))
                            }
                            onCancel={() =>
                                setOpenFilterAccordions((prev) => ({
                                    ...prev,
                                    rowFilterAccordion: false,
                                }))
                            }
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <BaseTabs
                    currentTab={currentTab}
                    onTabChanged={onTabChanged}
                    tabList={projectDetails.projectType === "INTERIOR" ? BL_TABS_INTERIOR : BL_TABS}
                    tabColor="#000000"
                    otherStyles={{
                        ".MuiTab-root.MuiButtonBase-root": {
                            padding: 0,
                            margin: 0,
                        },
                        ".MuiTabs-flexContainer": {
                            gap: 4,
                        },
                    }}
                />
                <Divider sx={{ margin: 0, padding: 0 }}></Divider>
                <Grid container paddingRight="0.3rem" marginBottom="5px">
                    <Grid item xs={11.5}>
                        <ScopeSelectorButton
                            isDisabled={isInitalDataLoading || isScopeDetailFiltered}
                            onClickHandler={handleScopeSelection}
                            onCancelClick={onCancelClick}
                            isViewMode={isViewMode}
                        />
                    </Grid>
                    <Grid item xs={0.5} justifyContent="flex-end">
                        <ExportBidLevelingButton {...excelDataProps} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                width="100%"
                sx={{
                    "& .non-parent": {
                        color: "transparent",
                        userSelect: "none",
                    },
                    "& .sub-parent": {
                        paddingLeft: "1.8rem",
                    },
                }}
            >
                <BaseDataGridPro treeData {...dataGridProps} />
            </Grid>
        </Grid>
    );
};

export default BidLeveling;
