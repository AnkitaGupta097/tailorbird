/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
import React, { useEffect, useMemo, useState } from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import {
    GridCellParams,
    GridRenderCellParams,
    GridRowModel,
    GridRowOrderChangeParams,
    GridToolbar,
} from "@mui/x-data-grid-pro";
import DataGridPro from "components/data-grid-pro";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import BaseCheckbox from "components/checkbox";
import { graphQLClient } from "utils/gql-client";
import {
    UPDATE_UNIT_MIX_DETAILS,
    CREATE_UNIT_MIX_DETAILS,
} from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import { Add, RestoreFromTrash, Delete } from "@mui/icons-material";
import BaseAutoComplete from "components/base-auto-complete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const MergeUnits: React.FC<any> = ({
    saveChanges,
    setSavedWithChanges,
    setActiveStep,
    setSaveChanges,
    setIsHavingUnsavedChanges,
    viewMode,
    confirmationCheck,
    addRowConfirmationAccepted,
    setAddRowConfirmationAccepted,
    projectId,
}) => {
    const dispatch = useAppDispatch();
    const [rows, setRows]: any[] = useState([]);
    const [updatedItems, setUpdatedItems]: any = useState(null);
    const [newRows, setNewRows]: any[] = useState([]);
    const [newlyAddedItems, setNewlyAddedItems]: any = useState(null);

    const {
        unitMixes,
        projectFP,
        inventoryList,
        propertyUnits,
        loading,
        projectDetails,
        floorplans,
        isCommonAreaProject,
    } = useAppSelector((state) => {
        return {
            projectDetails: state.projectDetails.data,
            projectFP: state.projectFloorplans.unitMix.projectFloorPlan,
            propertyUnits: state.projectFloorplans.unitMix.propertyUnits,
            unitMixes: state.projectFloorplans.unitMix.unitMixes,
            inventoryList: state.projectFloorplans.unitMix.inventory,
            loading: state.projectFloorplans.unitMix.loading,
            floorplans: state.projectFloorplans.floorplans.data,
            isCommonAreaProject:
                state.projectDetails.data?.projectType == "COMMON_AREA" ||
                state.projectDetails.data?.projectType == "EXTERIOR" ||
                false,
        };
    });

    useEffect(() => {
        dispatch(actions.projectFloorplans.fetchUnitMixDataStart(projectId));
        return () => {
            setNewRows([]);
            setNewlyAddedItems(null);
            setUpdatedItems(null);
        };
        // eslint-disable-next-line
    }, []);

    const { enqueueSnackbar } = useSnackbar();
    const nextStep = () => {
        setActiveStep("BASE_BID");
        setSaveChanges(false);
    };
    function getRowsWithChangedFPID() {
        const uniqueFloorPlanIds: any[] = [];

        rows.filter((rItem: any) => !rItem.id.includes("add_row")).forEach((item: any) => {
            if (item.isUpdated && !uniqueFloorPlanIds.includes(item.floorPlanId)) {
                uniqueFloorPlanIds.push(item.floorPlanId);
            }
        });

        return rows.filter((item: any) => uniqueFloorPlanIds.includes(item.floorPlanId));
    }

    async function transformData(data: any[]) {
        const result: any[] = [];

        data.forEach((item) => {
            const floorPlanId = item.floorPlanId;
            const inventoryLevel = item.inventoryLevel;
            const unitNumber = item.unitNumber;
            const floor = item.level;

            const existingItem = result?.find((r) => r.floor_plan_id === floorPlanId);

            if (existingItem) {
                const existingInventory = existingItem.inventories?.find(
                    (inv: any) => inv === inventoryLevel,
                );

                if (!existingInventory) {
                    existingItem.inventories.push(inventoryLevel);
                }

                existingItem.unit_mix.push({
                    floor: floor,
                    inventory_id: existingItem.inventories?.findIndex(
                        (item: any) => item == inventoryLevel,
                    ),
                    is_renovated: item.beingRennovated,
                    unit_id: item.id,
                    unit_name: unitNumber,
                });
            } else {
                result.push({
                    floor_plan_id: floorPlanId,
                    inventories: [inventoryLevel],
                    unit_mix: [
                        {
                            floor: floor,
                            inventory_id: 0,
                            is_renovated: item.beingRennovated,
                            unit_id: item.id,
                            unit_name: unitNumber,
                        },
                    ],
                });
            }
        });

        return result;
    }

    const saveChanges_to_portal = async () => {
        try {
            const user_id = projectDetails.userId;
            const promises = (await transformData(getRowsWithChangedFPID()).then((res: any) =>
                res?.map((item: any) => {
                    return graphQLClient.mutate("UndefineInventory", UPDATE_UNIT_MIX_DETAILS, {
                        input: {
                            remark: "",
                            project_id: projectId,
                            user_id: user_id,
                            ...item,
                        },
                    });
                }),
            )) as Array<Promise<any>>;
            const response = await Promise.allSettled(promises);
            // eslint-disable-next-line no-unused-vars

            // eslint-disable-next-line no-unused-vars
            const promisesAddItems = newlyAddedItems?.map((item: any) => {
                return graphQLClient.mutate("CreateUnitMix", CREATE_UNIT_MIX_DETAILS, {
                    input: {
                        project_id: projectId,
                        inventory_id: inventoryList?.find(
                            (inv: any) => inv.name == item.inventoryLevel,
                        ).id,
                        is_renovated: item.beingRennovated,
                        unit_name: item.unitNumber,
                        floor: item.level,
                        floor_plan_id: item.floorplanType.id,
                        system_remarks: null,
                    },
                });
            }) as Array<Promise<any>>;
            const responseAddNewItems = await Promise.allSettled(promisesAddItems);

            const allSucceeded =
                response.every((item) => item.status === "fulfilled") &&
                responseAddNewItems.every((item) => item.status === "fulfilled");
            if (allSucceeded) {
                enqueueSnackbar("", {
                    variant: "success",
                    action: <BaseSnackbar variant="success" title={"Changes Saved Successfully"} />,
                });

                setSavedWithChanges((prev: any) => [...prev, "MANAGE_UNITS"]);
            } else {
                enqueueSnackbar("", {
                    variant: "error",
                    action: <BaseSnackbar variant="error" title={"Unable to save the changes"} />,
                });
            }
        } catch (error) {
            dispatch(actions.tpsm.deleteProjectError(error));
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={"Unable to Save Changes."} />,
            });
        } finally {
            nextStep();
        }
    };
    //updating changes to a local variable on save
    useEffect(() => {
        if (saveChanges) {
            setUpdatedItems(
                rows.filter(
                    (item: any) =>
                        (item.isUpdated || item.isDeleted) && !item.id.includes("add_row"),
                ),
            );
            setNewlyAddedItems(
                rows.filter(
                    (item: any) => item.isUpdated && !item.isDeleted && item.id.includes("add_row"),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveChanges]);

    // after succesfullupdate of local variable calling API
    useEffect(() => {
        if (updatedItems == null) {
            return;
        }
        if (updatedItems?.length || newlyAddedItems?.length) {
            saveChanges_to_portal();
        } else {
            nextStep();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedItems]);

    const InventoryListMap = useMemo(() => {
        const result: any = {};

        inventoryList?.forEach((item: any) => {
            result[item.id] = item.name;
        });

        return result;
    }, [inventoryList]);

    const projectFPMap = useMemo(() => {
        const result: any = {};

        projectFP?.forEach((item: any) => {
            result[item.id] = item;
        });

        return result;
    }, [projectFP]);
    const propertyUnitMap = useMemo(() => {
        const result: any = {};

        propertyUnits?.forEach((item: any) => {
            result[item.id] = item;
        });

        return result;
    }, [propertyUnits]);

    useEffect(() => {
        const updated = unitMixes
            .map((unitMix) => {
                const { property_unit_id, inventory_id } = unitMix;
                const propertyUnit = propertyUnitMap[property_unit_id];
                if (propertyUnit) {
                    const { unit_name, floor_plan_id, id } = propertyUnit;
                    const projectFP = projectFPMap[floor_plan_id];
                    if (projectFP) {
                        const { name, area, areaUom } = projectFP;

                        return {
                            id: id,
                            unitNumber: unit_name,
                            floorplanType: name,
                            floorplanArea: area,
                            inventoryLevel: InventoryListMap[inventory_id],
                            beingRennovated: unitMix.is_renovated ?? false,
                            level: unitMix.floor ?? null,
                            uom: areaUom,
                            inventoryId: inventory_id,
                            floorPlanId: floor_plan_id,
                            fpType: `${name} - ${area} ${areaUom}`,
                        };
                    } else {
                        // Handle when projectFP is undefined
                        return null;
                    }
                } else {
                    // Handle when propertyUnit is undefined
                    return null;
                }
            })
            .filter((item) => item !== null);

        setRows(updated);
    }, [unitMixes, propertyUnitMap, projectFPMap, InventoryListMap]);

    const hasUpdatedItem = useMemo(
        () =>
            rows.some(
                (item: any) =>
                    item.isUpdated ||
                    (item.id.includes("add_row") && !item.isDeleted) ||
                    (!item.id.includes("add_row") && item.isDeleted),
            ),
        [rows],
    );

    useEffect(() => {
        if (hasUpdatedItem) {
            setIsHavingUnsavedChanges(true);
        } else {
            setIsHavingUnsavedChanges(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasUpdatedItem]);

    const handleCellEditCommit = (params: any) => {
        setRows((currentRows: any) => {
            return currentRows.map((item: any) => {
                return item.id === params.id
                    ? { ...item, [params.field]: params.value, isUpdated: true }
                    : { ...item };
            });
        });
    };
    // Add new row logic
    const CustomToolbar = ({ onClickCustomButton }: any) => {
        return (
            <div>
                <Button variant="text" startIcon={<Add />} onClick={onClickCustomButton}>
                    Add Row
                </Button>
            </div>
        );
    };

    const appendNewRowsData = () => {
        const addNewRowData = {
            id: "add_row",
            unitNumber: "",
            floorplanType: "",
            floorplanArea: "",
            inventoryLevel: "",
            beingRennovated: false,
            level: null,
            uom: "",
            inventoryId: null,
            floorPlanId: null,
            fpType: "",
        };
        setNewRows((currentState: any) => [addNewRowData, ...currentState]);
        setAddRowConfirmationAccepted(false);
        setRows((currentState: any) => [addNewRowData, ...currentState]);
    };
    const handleCustomButtonClick = () => {
        if (newRows?.length > 0) {
            confirmationCheck();
        } else {
            appendNewRowsData();
        }
    };

    useEffect(() => {
        if (addRowConfirmationAccepted) {
            appendNewRowsData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addRowConfirmationAccepted]);
    //ends
    const handleRowRemove = (updatedRow: any) => {
        setRows((currentRows: any) => {
            return currentRows.map((item: any) => {
                return item.id === updatedRow.id
                    ? { ...item, isDeleted: !item.isDeleted }
                    : { ...item };
            });
        });
    };

    //Columns
    const ManageUnitsColumns = useMemo(
        () => [
            {
                field: "unitNumber",
                headerName: "Unit Number",
                flex: 1,
                headerAlign: "center",
                align: "center",
                editable: false,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.unitNumber}</Typography>
                ),
            },
            {
                field: "floorplanType",
                headerName: isCommonAreaProject ? "Total Area" : "Floorplan Type",
                flex: 1,
                headerAlign: "center",
                align: "left",
                editable: false,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <BaseAutoComplete
                            options={floorplans}
                            variant={"outlined"}
                            value={params.row.fpType}
                            autocompleteSx={{
                                ".MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                            }}
                            getOptionLabel={(option: any) => {
                                return typeof option === "object" && option !== null
                                    ? `${option.name} - ${option.area} ${option.areaUom}` ?? option
                                    : option;
                            }}
                            id={params.row.id}
                            onChangeHandler={(value: any) => {
                                handleCellEditCommit({
                                    id: params.row.id,
                                    field: params.field,
                                    value: value,
                                });
                            }}
                            readOnlyTextField={viewMode}
                            placeholder={"floorplanType"}
                            popupIcon={<ArrowDropDownIcon />}
                            defaultValue={params.row.fpType}
                            disabled
                        />
                    );
                },
            },

            {
                field: "inventoryLevel",
                headerName: "Inventory Level",
                headerAlign: "center",
                align: "center",
                editable: false,
                hasFocus: true,
                flex: 1,
                Padding: 0,
                renderCell: (params: GridRenderCellParams) => (
                    <BaseAutoComplete
                        options={inventoryList?.map((item: any) => item.name)}
                        value={params.row.inventoryLevel}
                        variant={"outlined"}
                        autocompleteSx={{
                            ".MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                        }}
                        id={params.row.id}
                        onChangeHandler={(value: any) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: value,
                            });
                        }}
                        readOnlyTextField={viewMode}
                        placeholder={"inventory"}
                        popupIcon={<ArrowDropDownIcon />}
                        defaultValue={params.row.inventoryLevel}
                        disabled
                    />
                ),
            },

            {
                field: "beingRennovated",
                headerName: "Is This Unit Being Renovated?",
                flex: 1,
                align: "center",
                headerAlign: "center",
                editable: false,
                renderCell: (params: GridRenderCellParams) => (
                    <BaseCheckbox
                        onChange={(event: any) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: event.target.checked,
                            });
                        }}
                        defaultChecked={params.row.beingRennovated}
                        id={params.row.id}
                        value={params.row.beingRennovated}
                        name={"beingRennovated"}
                        disabled={true}
                    />
                ),
            },
            {
                field: "level",
                headerName: "Upper or Ground Floor",
                headerAlign: "center",
                align: "center",
                editable: false,
                hasFocus: true,
                flex: 1,
                Padding: 0,
                renderCell: (params: GridRenderCellParams) => (
                    <BaseAutoComplete
                        variant={"outlined"}
                        options={["ground", "upper"]}
                        placeholder={"Floor level"}
                        label={""}
                        onChangeHandler={(value: any) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: value,
                            });
                        }}
                        value={params.row.level}
                        popupIcon={<ArrowDropDownIcon />}
                        autocompleteSx={{
                            ".MuiOutlinedInput-notchedOutline": {
                                border: "none",
                            },
                        }}
                        filterSelectedOptions
                        blurOnSelect
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        disabled
                    />
                ),
            },
            // {
            //     field: "actions",
            //     headerName: "Actions",
            //     headerAlign: "center",
            //     align: "center",
            //     renderCell: (params: GridRenderCellParams) =>
            //         params.row.isDeleted ? (
            //             <IconButton key={params.row.id} onClick={() => handleRowRemove(params.row)}>
            //                 <RestoreFromTrash style={{ color: "#6A6464" }} />
            //             </IconButton>
            //         ) : (
            //             <IconButton key={params.row.id} onClick={() => handleRowRemove(params.row)}>
            //                 <Delete />
            //             </IconButton>
            //         ),
            // },
        ],

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [viewMode, inventoryList],
    );
    function updateRowPosition(
        initialIndex: number,
        newIndex: number,
        rows: Array<GridRowModel>,
    ): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const rowsClone = [...rows];
                const row = rowsClone.splice(initialIndex, 1)[0];
                rowsClone.splice(newIndex, 0, row);
                resolve(rowsClone);
            }, Math.random() * 500 + 100); // simulate network latency
        });
    }
    const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
        const newRows = await updateRowPosition(params.oldIndex, params.targetIndex, rows);

        setRows(newRows);
    };
    const isEqual = (object1: any, object2: any) =>
        JSON.stringify(object1) === JSON.stringify(object2);

    const handleProcessRowUpdate = (updatedRow: any) => {
        // Find the index of the row that was edited

        const updatedRows = [...rows];
        const rowIndex = rows?.findIndex((row: any) => row.id === updatedRow.id);
        if (isEqual(updatedRows[rowIndex], updatedRow) == false) {
            updatedRow["isUpdated"] = true;
            updatedRows[rowIndex] = updatedRow;
            setRows(updatedRows);
        }

        // Return the updated row to update the internal state of the DataGrid
        return updatedRow;
    };
    const groupColumns = ["unitNumber", "inventoryLevel", "beingRennovated", "level"];
    return (
        <DataGridPro
            disableColumnMenu={false}
            loading={loading}
            disableRowSelectionOnClick
            columns={ManageUnitsColumns}
            rows={rows}
            rowsPerPageOptions={[10, 20, 30]}
            checkboxSelection={false}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            getCellClassName={(params: GridCellParams<any, any, number>) => {
                let classes = [];

                if (params.field === "level") {
                    classes.push("cellPadding0");
                }

                return classes;
            }}
            getRowClassName={(params: GridCellParams<any, any, number>) => {
                let classes = [];
                if (params.row.isUpdated) {
                    classes.push("updated");
                }
                if (params.row.isDeleted) {
                    classes.push("deleted");
                }
                if (params.row.id == "add_row") {
                    classes.push("newRow");
                }
                return classes;
            }}
            processRowUpdate={handleProcessRowUpdate}
            pagination={false}
            // experimental feature not working
            grouping={{
                aggregators: [
                    { field: "floorplanType", aggregator: "count" }, // Replace 'field1' with the actual column you want to show the count for
                ],
                columns: groupColumns,
            }}
            //ends here
            initialState={{
                // sorting: {
                //     sortModel: [{ field: "floorplanType", sort: "asc" }],
                // },
                pinnedColumns: { right: ["actions"] },
            }}
            slots={{
                toolbar: (props: any) => (
                    <Stack
                        gap={5}
                        direction={"row-reverse"}
                        alignItems={"center"}
                        sx={{ background: "#EEEEEE", padding: "8px 0px" }}
                        className="stack-columnHeaders"
                    >
                        <GridToolbar {...props} />
                        {/* {!viewMode && (
                            <CustomToolbar onClickCustomButton={handleCustomButtonClick} />
                        )} */}
                    </Stack>
                ),
            }}
            autoHeight={false}
        />
    );
};
export default MergeUnits;
