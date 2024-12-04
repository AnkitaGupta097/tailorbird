/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import {
    GridRenderCellParams,
    GridRowModel,
    GridRowOrderChangeParams,
    GridCellParams,
    GridToolbar,
} from "@mui/x-data-grid-pro";
import DataGridPro from "components/data-grid-pro";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";

import { Add, RestoreFromTrash, Delete } from "@mui/icons-material";

import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import {
    UPDATE_FLOOR_PLAN_DETAILS,
    CREATE_FLOOR_PLAN_ITEM,
} from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import { graphQLClient } from "utils/gql-client";

const DefineFloorplans: React.FC<any> = ({
    setIsHavingUnsavedChanges,
    saveChanges,
    setSavedWithChanges,
    setActiveStep,
    setSaveChanges,
    viewMode,
    confirmationCheck,
    addRowConfirmationAccepted,
    setAddRowConfirmationAccepted,
    projectId,
    organization_id,
}) => {
    const dispatch = useAppDispatch();
    const { floorplans, isCommonAreaProject } = useAppSelector((state) => {
        return {
            floorplans: state.projectFloorplans.floorplans,
            isCommonAreaProject:
                state.projectDetails.data?.projectType == "COMMON_AREA" ||
                state.projectDetails.data?.projectType == "EXTERIOR" ||
                false,
        };
    });
    //rows
    const [rows, setRows]: any[] = useState([]);
    const [newRows, setNewRows]: any[] = useState([]);
    const [newlyAddedItems, setNewlyAddedItems]: any = useState(null);
    const [updatedItems, setUpdatedItems]: any = useState(null);

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
        setActiveStep("INVENTORIES");
        setSaveChanges(false);
    };
    const saveChanges_to_portal = async () => {
        try {
            //    update API call
            const promises = updatedItems?.map((item: any) => {
                return graphQLClient.mutate("FloorPlanUpdateInput", UPDATE_FLOOR_PLAN_DETAILS, {
                    input: {
                        name: item.name,
                        beds_per_unit: item.bedrooms,
                        baths_per_unit: item.bathrooms,
                        area: item.standardArea,
                        id: item.id,
                    },
                });
            }) as Array<Promise<any>>;
            const response = await Promise.allSettled(promises);

            const promisesAddItems = newlyAddedItems?.map((item: any) => {
                return graphQLClient.mutate("FloorPlanUpdateInput", CREATE_FLOOR_PLAN_ITEM, {
                    input: {
                        project_id: projectId,
                        organization_id: organization_id,
                        name: item.name,
                        beds_per_unit: item.bedrooms,
                        baths_per_unit: item.bathrooms,
                        area: item.standardArea,
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
                setSavedWithChanges((prev: any) => [...prev, "FLOOR_PLANS"]);
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

    useEffect(() => {
        setRows(
            floorplans.data.map((floorplan: any) => ({
                id: floorplan.id,
                name: floorplan.name,
                bedrooms: floorplan?.bedsPerUnit,
                bathrooms: floorplan?.bathsPerUnit,
                standardArea: floorplan?.area,
                isDeleted: false,
                isUpdated: false,
                commercial_name: floorplan?.commercial_name,
            })),
        );
        //eslint-disable-next-line
    }, [floorplans.data]);

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
            name: "",
            bedrooms: "",
            bathrooms: "",
            standardArea: "",
            isDeleted: false,
            isUpdated: false,
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

    useEffect(() => {
        if (hasUpdatedItem) {
            setIsHavingUnsavedChanges(true);
        } else {
            setIsHavingUnsavedChanges(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasUpdatedItem]);

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

    const handleRowRemove = (updatedRow: any) => {
        setRows((currentRows: any) => {
            return currentRows.map((item: any) => {
                return item.id === updatedRow.id
                    ? { ...item, isDeleted: !item.isDeleted }
                    : { ...item };
            });
        });
    };
    const ScopeListColumns = useMemo(() => {
        const baseColumns = [
            {
                field: "name",
                headerName: isCommonAreaProject ? "Area Name" : "Floorplan Name",
                align: "center",
                headerAlign: "center",
                editable: false,
                type: "string",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.commercial_name}</Typography>
                ),
            },
            {
                field: "standardArea",
                headerName: "Standard Area(Sq ft)",
                align: "center",
                headerAlign: "center",
                type: "number",
                editable: false,
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.standardArea}</Typography>
                ),
            },
        ];

        if (!isCommonAreaProject) {
            baseColumns.splice(
                1,
                0,
                {
                    field: "bedrooms",
                    headerName: "Bedrooms",
                    align: "center",
                    headerAlign: "center",
                    editable: false,
                    flex: 1,
                    type: "number",

                    renderCell: (params: GridRenderCellParams) => (
                        <Typography variant="text_14_regular">{params.row.bedrooms}</Typography>
                    ),
                },
                {
                    field: "bathrooms",
                    headerName: "Bath Rooms",
                    align: "center",
                    headerAlign: "center",
                    editable: false,
                    type: "number",
                    flex: 1,
                    renderCell: (params: GridRenderCellParams) => (
                        <Typography variant="text_14_regular">{params.row.bathrooms}</Typography>
                    ),
                },
            );
        }

        return baseColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCommonAreaProject, floorplans.data]);

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
    return (
        // <div style={{ height: "calc(100vh - 15rem)" }}>
        <DataGridPro
            disableColumnMenu={false}
            loading={floorplans.loading}
            disableRowSelectionOnClick
            columns={ScopeListColumns}
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
                        {/* Commenting add row */}
                        {/* {!viewMode && (
                            <CustomToolbar onClickCustomButton={handleCustomButtonClick} />
                        )} */}
                    </Stack>
                ),
            }}
            initialState={{
                pinnedColumns: { right: ["actions"] },
            }}
            autoHeight={false}
        />
        // </div>
    );
};
export default DefineFloorplans;
