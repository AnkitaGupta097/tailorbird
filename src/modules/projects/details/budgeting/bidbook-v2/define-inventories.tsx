/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import {
    GridRenderCellParams,
    GridCellParams,
    GridRowModel,
    GridRowOrderChangeParams,
    GridToolbar,
} from "@mui/x-data-grid-pro";
import DataGridPro from "components/data-grid-pro";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router-dom";

import { Add, RestoreFromTrash, Delete } from "@mui/icons-material";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import {
    UPDATE_INVENTORY_DETAILS,
    CREATE_INVENTORY_ITEM,
} from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import { graphQLClient } from "utils/gql-client";

const DefineInventories: React.FC<any> = ({
    setIsHavingUnsavedChanges,
    setSavedWithChanges,
    setActiveStep,
    saveChanges,
    setSaveChanges,
    viewMode,
    confirmationCheck,
    addRowConfirmationAccepted,
    setAddRowConfirmationAccepted,
    projectId,
}) => {
    const dispatch = useAppDispatch();
    const [updatedItems, setUpdatedItems]: any = useState(null);
    const [newRows, setNewRows]: any[] = useState([]);
    const [newlyAddedItems, setNewlyAddedItems]: any = useState(null);

    const { inventories } = useAppSelector((state) => {
        return {
            inventories: state.projectFloorplans.inventories,
        };
    });
    const [rows, setRows]: any[] = useState([]);
    useEffect(() => {
        dispatch(
            actions.projectFloorplans.fetchFloorplanDataStart({
                id: projectId,
            }),
        );
        return () => {
            setNewRows([]);
            setNewlyAddedItems(null);
            setUpdatedItems(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { enqueueSnackbar } = useSnackbar();
    const nextStep = () => {
        setActiveStep("MANAGE_UNITS");
        setSaveChanges(false);
    };
    const saveChanges_to_portal = async () => {
        try {
            //    update API call
            const promises = updatedItems?.map((item: any) => {
                return graphQLClient.mutate(
                    "UpdateInventoryDetailsPayload",
                    UPDATE_INVENTORY_DETAILS,
                    {
                        payload: {
                            updated_by: localStorage.getItem("user_id"),
                            name: item.name,
                            id: item.id,
                        },
                    },
                );
            }) as Array<Promise<any>>;
            const response = await Promise.allSettled(promises);
            let responseAddNewItems = undefined;
            try {
                graphQLClient.mutate("UpdateInventoryMix", CREATE_INVENTORY_ITEM, {
                    updateInventoryMix: {
                        project_id: projectId,
                        inventory_list: rows
                            ?.filter((row: any) => !(row.id.includes("add_row") && row.isDeleted))
                            ?.filter((row: any) => !row.isDeleted)
                            ?.map((item: any) => ({ inventory_name: item.name })),
                        updated_by: localStorage.getItem("user_id"),
                    },
                });
                responseAddNewItems = true;
            } catch (e) {
                responseAddNewItems = false;
            }

            const allSucceeded =
                response.every((item) => item.status === "fulfilled") && responseAddNewItems;

            if (allSucceeded) {
                enqueueSnackbar("", {
                    variant: "success",
                    action: <BaseSnackbar variant="success" title={"Changes Saved Successfully"} />,
                });
                setSavedWithChanges((prev: any) => [...prev, "INVENTORIES"]);
            } else {
                enqueueSnackbar("", {
                    variant: "error",
                    action: <BaseSnackbar variant="error" title={"Unable to save the changes"} />,
                });
            }
        } catch (error) {
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
        if (updatedItems == null || newlyAddedItems == null) {
            return;
        }
        if (updatedItems?.length || newlyAddedItems?.length) {
            saveChanges_to_portal();
        } else {
            nextStep();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedItems]);

    //rows

    useEffect(() => {
        setRows(
            inventories.data.map((inventory: any, index: number) => ({
                id: inventory.id,
                slno: index + 1,
                name: inventory.name,
                isDeleted: false,
                isUpdated: false,
                isDefault: inventory.isDefault,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventories.data]);
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
            id: `add_row_${newRows?.length}`,
            slno: rows?.length + 1,
            name: "",
            isDeleted: false,
            isUpdated: false,
            isDefault: false,
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

    //Columns
    const handleRowRemove = (updatedRow: any) => {
        setRows((currentRows: any) => {
            return currentRows.map((item: any) => {
                return item.id === updatedRow.id
                    ? { ...item, isDeleted: !item.isDeleted }
                    : { ...item };
            });
        });
    };
    const InventoryListColumns: any = useMemo(
        () => [
            {
                field: "slno",
                flex: 0.1,
                headerName: "Inventory Order",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.slno}</Typography>
                ),
            },
            {
                field: "name",
                headerName: "Name",
                flex: 0.4,
                type: "string",
                editable: false,
                hasFocus: true,
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                ),
            },
            {
                field: "isDefault",
                headerName: "Default",
                flex: 0.5,
                type: "string",
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.isDefault ? "Yes" : "No"}
                    </Typography>
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
        ], //eslint-disable-next-line
        [inventories.data],
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
    return (
        <DataGridPro
            disableColumnMenu={false}
            loading={inventories.loading}
            disableRowSelectionOnClick
            columns={InventoryListColumns}
            rows={rows}
            rowsPerPageOptions={[10, 20, 30]}
            checkboxSelection={false}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            getCellClassName={(params: GridCellParams<any, any, number>) => {
                let classes = [];

                if (
                    params.field === "category" ||
                    params.field === "item" ||
                    params.field === "scope" ||
                    params.field === "uom"
                ) {
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
                if (params.row.id.includes("add_row")) {
                    classes.push("newRow");
                }
                return classes;
            }}
            processRowUpdate={handleProcessRowUpdate}
            pagination={false}
            initialState={{
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
export default DefineInventories;
