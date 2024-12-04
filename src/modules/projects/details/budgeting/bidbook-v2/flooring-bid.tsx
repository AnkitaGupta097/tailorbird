import React, { useEffect, useState, useMemo } from "react";
import {
    GridRenderCellParams,
    GridColDef,
    GridRowModel,
    GridRowOrderChangeParams,
    GridCellParams,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import ContentPlaceholder from "components/content-placeholder";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem, Box, Select, Typography, TextField, IconButton } from "@mui/material";
import DataGridPro from "components/data-grid-pro";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { UOMS } from "components/container-admin-interface/constants";
import Autocomplete from "@mui/material/Autocomplete";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import { Delete, RestoreFromTrash } from "@mui/icons-material";
import { isEmpty } from "lodash";
import { BidbookToolbar, ColumnHeaderGrouping, WorkTypeDropDown } from "./helpers/components";
import { WORK_TYPE_OPTIONS } from "./constants";
import { StyledBox, getRowsFromTable, saveChangesToPortal } from "./helpers/functions";
import { columnGroupingModel } from "./helpers/components";

const FlooringBid: React.FC<any> = ({
    setIsHavingUnsavedChanges,
    categoryData,
    containerItemsList,
    saveChanges,
    setSavedWithChanges,
    setSaveChanges,
    viewMode,
    selectedVersionData,
    loading,
    confirmationCheck,
    addRowConfirmationAccepted,
    setAddRowConfirmationAccepted,
    projectId,
}) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    const {
        flooringScopeRenos,
        inventories,
        floorplans,
        subGroups,
        inventoryMix,
        isCommonAreaProject,
        containerVersion,
    } = useAppSelector((state) => {
        return {
            flooringScopeRenos: state.budgeting?.details?.flooringScope?.renovations as any,
            inventories: state.projectFloorplans.inventories,
            floorplans: state.projectFloorplans.floorplans.data,
            subGroups: state.projectFloorplans.floorplanSplits.subGroups,
            inventoryMix: state.projectFloorplans.inventoryMixes.data,
            isCommonAreaProject:
                state.projectDetails.data?.projectType == "COMMON_AREA" ||
                state.projectDetails.data?.projectType == "EXTERIOR" ||
                false,
            containerVersion: state.projectDetails?.data?.system_remarks?.container_version,
        };
    });
    const [rows, setRows]: any[] = useState([]);
    const [dynamicColumns, setDynamicColumns]: any = useState([]);
    const [dynamicColumnsGroups, setDynamicColumnsGroups]: any = useState([]);
    const [updatedItems, setUpdatedItems]: any = useState(null);
    const [newRows, setNewRows]: any[] = useState([]);
    const [newlyAddedItems, setNewlyAddedItems]: any = useState(null);
    const [rowsUpdatedInCurrentCommit, setRowsUpdatedInCurrentCommit] = useState<string[]>([]);
    const apiRef = useGridApiRef();
    useEffect(() => {
        return () => {
            setNewRows([]);
            setNewlyAddedItems(null);
            setUpdatedItems(null);
        };
    }, []);
    useEffect(() => {
        if (!viewMode)
            dispatch(
                actions.budgeting.fetchFlooringRenoItemsStart({
                    projectId: projectId,
                }),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, viewMode]);
    const { enqueueSnackbar } = useSnackbar();
    const nextStep = () => {
        setSaveChanges(false);
    };
    useEffect(() => {
        if (floorplans.length > 0) {
            const newCols: any[] = [];
            const newColGrps: any[] = [];

            floorplans?.map((item: any) => {
                const invDetails = inventoryMix
                    .filter((invData: any) => invData.floorplanId == item.id && invData.count > 0)
                    .map((invitem: any) => {
                        const filteredResult: any = inventories.data.find(
                            (inventory: any) => inventory.id == invitem.inventoryId,
                        );
                        return {
                            name: filteredResult.name,
                            numOfQty: invitem.count,
                        };
                    });
                newCols.push(
                    {
                        field: `${item.id}-qty`,
                        headerName: "Quantity",
                        type: "number",
                        headerAlign: "center",
                        minWidth: 150,
                        renderCell: (params: GridRenderCellParams) => (
                            <Typography variant="text_14_regular">
                                {(params.row[item.id]?.qty || 0)?.toFixed(2)}
                            </Typography>
                        ),
                    },
                    {
                        field: `${item.id}-price`,
                        headerName: "Price",
                        type: "number",
                        headerAlign: "center",
                        minWidth: 150,
                        renderCell: (params: GridRenderCellParams) => (
                            <Typography variant="text_14_regular">
                                {(params.row[item.id]?.price || 0)?.toFixed(2)}
                            </Typography>
                        ),
                    },
                );
                newColGrps.push({
                    groupId: item.id,
                    headerName: `${item.name} | Reno Units: ${item.renoUnits} | Area: ${item.area} ${item.areaUom} `,
                    freeReordering: true,
                    minWidth: 300,
                    renderHeaderGroup: () => (
                        <ColumnHeaderGrouping
                            item={item}
                            invDetails={invDetails}
                            isCommonAreaProject={isCommonAreaProject}
                        />
                    ),
                    children: [{ field: `${item.id}-qty` }, { field: `${item.id}-price` }],
                });
            });
            setDynamicColumns(newCols);

            setDynamicColumnsGroups(newColGrps);
        }
    }, [floorplans, viewMode, inventoryMix, inventories.data, isCommonAreaProject]);
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    //updating changes to a local variable on save
    useEffect(() => {
        const tableRows = getRowsFromTable(apiRef);
        if (saveChanges) {
            setUpdatedItems(
                tableRows.filter(
                    (item: any) =>
                        (item.isUpdated || !item.isActive) && !item.id.includes("add_row"),
                ),
            );
        }
        setNewlyAddedItems(
            tableRows.filter(
                (item: any) => item.isUpdated && item.isActive && item.id.includes("add_row"),
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveChanges]);

    // after succesfullupdate of local variable calling API
    useEffect(() => {
        if (updatedItems == null || newlyAddedItems == null) {
            return;
        }
        const currentStep = "FLOORING";
        if (updatedItems?.length || newlyAddedItems?.length) {
            saveChangesToPortal(
                inventories,
                updatedItems,
                dispatch,
                newlyAddedItems,
                showSnackBar,
                projectId,
                setSavedWithChanges,
                setIsHavingUnsavedChanges,
                setSaveChanges,
                currentStep,
            );
        } else {
            nextStep();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedItems]);

    const newObject = useMemo(() => {
        const result: any = {};

        inventories.data?.forEach((item) => {
            result[item.id] = item.name;
        });

        return result;
    }, [inventories.data]);

    //rows
    const getAllowedItems = (category: any) => {
        return containerItemsList.filter((contItem: any) => contItem.category == category) || [];
    };

    function getItemValue(item: any) {
        if (typeof item === "object" && item !== null) {
            return item?.item
                ? typeof item?.item === "object"
                    ? item?.item?.item
                    : item?.item
                : null;
        } else if (typeof item === "string") {
            return item;
        } else {
            return null;
        }
    }
    const getAllowedScopes = (item: any, workType: any) => {
        const itemName = getItemValue(item);
        let allowedScopes = containerItemsList
            ?.filter(
                (contItem: { item: any; work_type: any }) =>
                    contItem.item === itemName && contItem?.work_type === workType,
            )
            ?.flatMap((filteredContItem: { scope_list: any }) => filteredContItem?.scope_list);

        const uniqueScopesMap = new Map();
        allowedScopes.forEach((scopeObj: { pc_item_id: any; scope: any }) => {
            if (!uniqueScopesMap.has(scopeObj?.pc_item_id)) {
                uniqueScopesMap.set(scopeObj?.pc_item_id, {
                    scope: scopeObj?.scope,
                    pc_item_id: scopeObj?.pc_item_id,
                });
            }
        });
        const uniqueScopesArray = Array.from(uniqueScopesMap.values());
        return uniqueScopesArray; // Return an array of unique scope objects
    };

    const getAllowedWorkTypes = (item: any) => {
        let allowedWorkTypes: any = containerItemsList
            ?.filter((contItem: any) => contItem.item == item?.item)
            .map((filteredContItem: any) => filteredContItem?.work_type);

        const uniqueItems = Array.from(new Set(allowedWorkTypes));
        return uniqueItems; // Return the unique items array
    };

    const getAggregateQty = (renoItem: any) => {
        const agQty = renoItem?.take_offs?.reduce((totalQty: any, item: any) => {
            return (
                totalQty +
                item?.take_off_value *
                    (floorplans?.find((floorPlan) => floorPlan.id === item.fp_id)?.renoUnits || 0)
            );
        }, 0);
        return agQty?.toFixed(2);
    };

    useEffect(() => {
        let dataSource = [...flooringScopeRenos.data];
        if (viewMode) {
            const selectedData = selectedVersionData || {};
            const allRenovationItems = selectedData?.all_renovation_items || {};

            const flooring_scope = allRenovationItems?.flooring_scope || [];

            dataSource = [...flooring_scope];
        }

        setRows(
            dataSource?.map((renoItem: any) => {
                // Aggregate qty = [A1 Quantity x # of A1s] + [B1 Quantity x # of B1s] + [C1 Quantity x # of C1s] ….and so on
                // Aggregate Price = Aggregate qty * UOM price
                // WAVG QTY = Aggregate qty / Total reno_units
                // WAVG Price = WAVG QTY * UOM Price
                const totalRenoUnits = floorplans.reduce(
                    (total, item) => total + item.renoUnits,
                    0,
                );

                const dynamicObj: any = {};
                const dynamicTest: any = {};

                floorplans?.map((floorplan: any) => {
                    const fpId = floorplan.id;
                    const renoItemTakeOff = renoItem?.take_offs?.find(
                        (item: any) => item.fp_id === fpId,
                    );
                    const qtyValue = renoItemTakeOff ? renoItemTakeOff?.take_off_value : 0;
                    const priceValue = (qtyValue || 0) * (renoItem.unitCost || 0);
                    dynamicTest[`${fpId}-qty`] = qtyValue;
                    dynamicTest[`${fpId}-price`] = priceValue;
                    dynamicObj[fpId] = {
                        qty: qtyValue,
                        price: priceValue,
                    };
                });

                return {
                    id: renoItem.id,
                    category: renoItem.category || "",
                    location:
                        (renoItem?.workType?.toLowerCase() == "labor"
                            ? renoItem?.qualifier
                            : renoItem?.location || "") || "",
                    scope: renoItem?.scope || "",
                    item: renoItem?.item || "",
                    subcategory: renoItem?.subcategory || "",
                    inventoryName: newObject[renoItem?.inventoryId] || "",
                    description: renoItem?.description || "",
                    comments: renoItem?.comments || "",
                    finish: renoItem?.finish || "",
                    manufacturer: renoItem?.manufacturer || "",
                    model: renoItem?.modelNo || "",
                    uom: renoItem?.uom?.toLowerCase() || "",
                    eachQuantity: 1,
                    eachPrice: renoItem?.unitCost || "",
                    aggregateQuantity: getAggregateQty(renoItem),
                    isUpdated: false,
                    isActive: renoItem.is_active || true,
                    workType: renoItem?.workType,
                    totalRenoUnits: totalRenoUnits,
                    allowedItems: getAllowedItems(renoItem.category) || [],
                    allowedScopes: getAllowedScopes(renoItem, renoItem.workType),
                    allowedWorkTypes: getAllowedWorkTypes(renoItem),
                    floorLevel:
                        subGroups?.find((ite: any) => ite.id == renoItem.subGroupId)?.name || "",
                    take_offs: renoItem.take_offs,
                    type_of_change: renoItem.type_of_change,
                    renovation_item_project_takeoffs_id:
                        renoItem.renovation_item_project_takeoffs_id,
                    ...dynamicObj,
                };
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flooringScopeRenos, viewMode, selectedVersionData, newObject, floorplans]);

    const handleCellEditCommit = (params: any, event?: any) => {
        let value = event?.target?.value ?? params.value;
        value = parseFloat(value) || value;
        const allRows = getRowsFromTable(apiRef);
        const updatedRows = allRows?.map((item: any) => {
            if (item.id === params.id) {
                setRowsUpdatedInCurrentCommit((prev) => [...prev, params.id]);
                let itemCpy = { ...item };
                itemCpy.isUpdated = true;
                if (params.field?.includes("-qty")) {
                    let fpID = params.field.split("-")[0];
                    const price = value * (itemCpy.eachPrice ?? 0);
                    itemCpy[fpID] = {
                        ...itemCpy[fpID],
                        qty: value,
                        price: price,
                    };

                    return itemCpy;
                } else if (params.field == "category") {
                    itemCpy[params.field] = value;
                    itemCpy.allowedItems = getAllowedItems(value);
                    return itemCpy;
                } else if (params.field == "item") {
                    itemCpy[params.field] = value;

                    itemCpy.allowedWorkTypes = getAllowedWorkTypes(value);
                    return itemCpy;
                } else if (params.field == "workType") {
                    itemCpy[params.field] = value;
                    itemCpy.allowedScopes = getAllowedScopes(itemCpy, value);
                    return itemCpy;
                } else if (params.field == "scope") {
                    itemCpy[params.field] = value;
                    return itemCpy;
                } else {
                    return { ...item, [params.field]: value, isUpdated: true };
                }
            } else if (
                item.renovation_item_project_takeoffs_id ===
                    params.row.renovation_item_project_takeoffs_id &&
                params.field?.includes("-qty")
            ) {
                setRowsUpdatedInCurrentCommit((prev) => [...prev, item.id]);
                return item;
            } else {
                return { ...item };
            }
        });
        apiRef.current.updateRows(updatedRows);
    };

    const handleProcessRowUpdate = (updatedRow: any) => {
        // Find the index of the row that was edited

        updatedRow.updatedInCurrentCommit = true;
        const tableRows = getRowsFromTable(apiRef);
        const rowIndex = tableRows?.findIndex((row: any) => row.id === updatedRow.id);

        const updatedRows = tableRows.map((row: any, index: number) => {
            if (rowsUpdatedInCurrentCommit.includes(row.id)) {
                const updatedObj: any = { ...row, ...(index === rowIndex && updatedRow) };
                updatedObj["isUpdated"] = true;

                // updating floorplan prices based on the entered each price
                for (const key in updatedObj) {
                    if (
                        typeof updatedObj[key] === "object" &&
                        updatedObj[key] !== null &&
                        "qty" in updatedObj[key] &&
                        "price" in updatedObj[key]
                    ) {
                        const qty = updatedObj[`${key}-qty`] || updatedObj[key].qty;

                        if (qty) {
                            const price = qty * updatedObj.eachPrice ?? 0;
                            updatedObj[key] = { ...updatedObj[key], qty, price };
                        }
                        let takeoffCpy = [...updatedObj.take_offs];
                        takeoffCpy = takeoffCpy?.map((takeOff: any) => {
                            let copy = { ...takeOff };
                            if (copy.fp_id == key) {
                                copy.take_off_value = updatedObj[key].qty ?? copy.take_off_value;
                            }
                            return copy;
                        });
                        updatedObj.take_offs = takeoffCpy;
                        updatedObj.aggregateQuantity = getAggregateQty(updatedObj);
                    }
                }
                index === rowIndex && (updatedRow = updatedObj);
                return updatedObj;
            }
            return row;
        });
        setRowsUpdatedInCurrentCommit([]);
        apiRef.current.updateRows(updatedRows);
        // Return the updated row to update the internal state of the DataGrid
        return updatedRow;
    };
    const handleRowUpdateError = (error: any) => {
        // You can log the error or perform any other necessary actions here
        console.error("Error occurred during row update:", error);
    };
    const handleRowRemove = (updatedRow: any) => {
        apiRef.current.updateRows(
            getRowsFromTable(apiRef).map((item: any) => {
                return item.id === updatedRow.id
                    ? { ...item, isActive: !item.isActive }
                    : { ...item };
            }),
        );
    };
    // Add new row logic
    const appendNewRowsData = () => {
        const tableRows = getRowsFromTable(apiRef);

        const dynamicObj: any = {};
        const renoItem = (tableRows?.length && tableRows[0]) || {};
        renoItem?.take_offs?.map((item: any) => {
            const fpId = item.fp_id;
            const qtyValue = "";
            const priceValue = "";

            dynamicObj[fpId] = {
                qty: qtyValue,
                price: priceValue,
            };
        });
        const addNewRowData = {
            id: `add_row_${newRows?.length}`,
            category: "Flooring",
            location: "",
            scope: "",
            item: "",
            subcategory: "",
            inventoryName: "",
            description: "",
            comments: "",
            manufacturer: "",
            model: "",
            uom: "",
            eachQuantity: 1,
            eachPrice: 0,
            aggregateQuantity: 0,
            isUpdated: false,
            isActive: true,
            workType: "",
            totalRenoUnits: 0,
            take_offs: renoItem.take_offs,
            allowedItems: getAllowedItems("Flooring"),
            allowedScopes: [],
            allowedWorkTypes: [],
            floorLevel: "",

            ...dynamicObj,
        };
        setNewRows((currentState: any) => [addNewRowData, ...currentState]);

        setAddRowConfirmationAccepted(false);
        apiRef.current.updateRows([addNewRowData, ...tableRows]);
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

    const ScopeListColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "floorLevel",
                headerName: "Floor Level",
                editable: !viewMode,
                hasFocus: true,
                baseSelect: true,
                minWidth: 140,
                renderCell: (params: GridRenderCellParams) => (
                    <Autocomplete
                        id="floorLevel"
                        defaultValue={params.row.floorLevel}
                        onChange={(event: any, value) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: value,
                            });
                        }}
                        options={subGroups}
                        isOptionEqualToValue={(option, value) => option.name === value}
                        getOptionLabel={(option: any) => option.name ?? option}
                        renderInput={(paramsInput) => (
                            <TextField
                                {...paramsInput}
                                inputProps={{
                                    ...paramsInput.inputProps,
                                }}
                                value={params.value}
                            />
                        )}
                        sx={{ width: "inherit" }}
                        blurOnSelect
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        readOnly={viewMode}
                    />
                ),
            },
            {
                field: "category",
                headerName: "Category",
                Padding: 0,
                minWidth: 170,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Autocomplete
                            id="category"
                            defaultValue={params.row.category}
                            onChange={(event: any, value) => {
                                handleCellEditCommit({
                                    id: params.row.id,
                                    field: params.field,
                                    value: value,
                                });
                            }}
                            options={categoryData.filter((value: any) => value == "Flooring")}
                            isOptionEqualToValue={(option, value) => option === value}
                            renderOption={(props, option) => <li {...props}>{option}</li>}
                            renderInput={(paramsInput) => (
                                <TextField
                                    {...paramsInput}
                                    inputProps={{
                                        ...paramsInput.inputProps,
                                    }}
                                    value={params.value}
                                />
                            )}
                            sx={{ width: "inherit" }}
                            blurOnSelect
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            readOnly={viewMode}
                        />
                    );
                },
            },

            {
                field: "item",
                headerName: "Item",
                Padding: 0,
                minWidth: 170,
                renderCell: (params: GridRenderCellParams) => (
                    <Autocomplete
                        id="item"
                        defaultValue={params.row.item}
                        onChange={(event: any, value) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: value,
                            });
                        }}
                        options={params.row.allowedItems}
                        renderInput={(paramsInput) => (
                            <TextField
                                {...paramsInput}
                                inputProps={{
                                    ...paramsInput.inputProps,
                                }}
                                value={params.value}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.item === value}
                        getOptionLabel={(option: any) => option.item ?? option}
                        sx={{ width: "inherit" }}
                        blurOnSelect
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        readOnly={viewMode}
                    />
                ),
            },
            {
                field: "workType",
                headerName: "Work Type",
                minWidth: 170,
                renderCell: (params: GridRenderCellParams) => (
                    <WorkTypeDropDown
                        params={params}
                        handleCellEditCommit={handleCellEditCommit}
                        workTypeOptions={WORK_TYPE_OPTIONS}
                    />
                ),
            },
            {
                field: "scope",
                headerName: "Scope",
                Padding: 0,
                minWidth: 170,
                renderCell: (params) => (
                    <Autocomplete
                        id="scope"
                        defaultValue={params.row.scope}
                        onChange={(event: any, value) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: value,
                            });
                        }}
                        options={params.row.allowedScopes}
                        renderInput={(paramsInput) => (
                            <TextField
                                {...paramsInput}
                                inputProps={{
                                    ...paramsInput.inputProps,
                                }}
                                value={params.value}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.scope == value}
                        getOptionLabel={(option: any) => option.scope ?? option}
                        sx={{ width: "inherit" }}
                        blurOnSelect
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        readOnly={viewMode}
                    />
                ),
            },

            {
                field: "subcategory",
                headerName: "Subcategory",
                type: "string",
                editable: !viewMode,
                hasFocus: true,
                minWidth: 170,
                renderCell: (params: GridRenderCellParams) => {
                    const userModifiedSubcategory = `${params.row.item?.item ?? params.row.item}-${
                        params.row.scope?.scope ?? params.row.scope
                    }`;
                    const subcategory = params.row.scope?.scope
                        ? userModifiedSubcategory
                        : params.row.subcategory;

                    return <Typography variant="text_14_regular">{subcategory}</Typography>;
                },
            },
            {
                field: "location",
                headerName: "Location",
                type: "string",
                editable: !viewMode,
                hasFocus: true,
                minWidth: 170,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.location}</Typography>
                ),
            },

            {
                field: "inventoryName",
                headerName: "Inventory Name",
                minWidth: 170,
                renderCell: (params) => (
                    <Autocomplete
                        id="inventoryName"
                        defaultValue={params.row?.inventoryName}
                        onChange={(event: any, value) => {
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: value,
                            });
                        }}
                        isOptionEqualToValue={(option, value) => option === value}
                        options={inventories?.data?.map((item: any) => item.name)}
                        renderOption={(props, option) => <li {...props}>{option}</li>}
                        renderInput={(paramsInput) => (
                            <TextField
                                {...paramsInput}
                                inputProps={{
                                    ...paramsInput.inputProps,
                                }}
                                value={params.value}
                            />
                        )}
                        sx={{ width: "inherit" }}
                        blurOnSelect
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        readOnly={viewMode}
                    />
                ),
            },
            {
                field: "description",
                headerName: "Description",
                type: "string",
                editable: !viewMode,
                minWidth: 150,
                hasFocus: true,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.description}</Typography>
                ),
            },
            {
                field: "comments",
                headerName: "Comments",
                type: "string",
                editable: !viewMode,
                minWidth: 150,
                hasFocus: true,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.comments}</Typography>
                ),
            },
            {
                field: "finish",
                headerName: "Finish",
                type: "string",
                editable: !viewMode,
                minWidth: 150,
                hasFocus: true,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.finish}</Typography>
                ),
            },
            {
                field: "manufacturer",
                headerName: "Manufacturer",
                type: "string",
                editable: !viewMode,
                hasFocus: true,
                minWidth: 150,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.manufacturer}</Typography>
                ),
            },
            {
                field: "model",
                headerName: "Model",
                type: "string",
                editable: !viewMode,
                hasFocus: true,
                minWidth: 150,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.model}</Typography>
                ),
            },
            {
                field: "uom",
                headerName: "UOM",
                editable: !viewMode,
                hasFocus: true,
                baseSelect: true,
                minWidth: 100,
                renderCell: (params: GridRenderCellParams) => (
                    <Select
                        defaultValue={params.row.uom}
                        onChange={(event) =>
                            handleCellEditCommit({
                                id: params.row.id,
                                field: params.field,
                                value: event.target?.value,
                            })
                        }
                        sx={{ width: "inherit" }}
                        disabled={viewMode}
                    >
                        {UOMS?.map((option) => {
                            const opt = option?.toLowerCase();
                            return (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            );
                        })}
                    </Select>
                ),
            },
            {
                field: "eachQuantity",
                headerName: "Quantity",
                flex: 1,
                minWidth: 80,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.eachQuantity}</Typography>
                ),
            },
            {
                field: "eachPrice",
                headerName: "Price",
                flex: 1,
                type: "number",
                editable: !viewMode,
                align: "center",
                hasFocus: true,
                headerAlign: "center",
                minWidth: 100,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.eachPrice}</Typography>
                ),
            },
            {
                field: "aggregateQuantity",
                headerName: "Quantity",
                flex: 1,
                minWidth: 80,
                renderCell: (params: GridRenderCellParams) => {
                    // Aggregate qty = [A1 Quantity x # of A1s] + [B1 Quantity x # of B1s] + [C1 Quantity x # of C1s] ….and so on

                    return (
                        <Typography variant="text_14_regular">
                            {parseFloat(params?.row?.aggregateQuantity)?.toFixed(2)}
                        </Typography>
                    );
                },
            },
            {
                field: "aggregatePrice",
                headerName: "Price",
                flex: 1,
                minWidth: 100,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Typography variant="text_14_regular">
                            {(params.row?.aggregateQuantity * params.row?.eachPrice)?.toFixed(2)}
                        </Typography>
                    );
                },
            },

            {
                field: "actions",
                headerName: "Actions",
                headerAlign: "center",
                align: "center",
                minWidth: 80,
                renderCell: (params: GridRenderCellParams) =>
                    !params.row.isActive ? (
                        <IconButton key={params.row.id} onClick={() => handleRowRemove(params.row)}>
                            <RestoreFromTrash style={{ color: "#6A6464" }} />
                        </IconButton>
                    ) : (
                        <IconButton key={params.row.id} onClick={() => handleRowRemove(params.row)}>
                            <Delete />
                        </IconButton>
                    ),
            },
            ...(isCommonAreaProject
                ? []
                : [
                      // Aggregate Price = Aggregate qty * UOM price

                      {
                          field: "wavgQuantity",
                          headerName: "Quantity",
                          flex: 1,
                          minWidth: 80,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">
                                  {isNaN(
                                      params.row.aggregateQuantity / params.row.totalRenoUnits,
                                  ) ||
                                  params.row?.aggregateQuantity / params.row?.totalRenoUnits ==
                                      Infinity
                                      ? ""
                                      : (
                                            params.row?.aggregateQuantity /
                                            params.row?.totalRenoUnits
                                        )?.toFixed(2)}
                              </Typography>
                          ),
                      },
                      {
                          field: "wavgPrice",
                          headerName: "Price",
                          flex: 1,
                          minWidth: 100,
                          renderCell: (params: GridRenderCellParams) => (
                              <Typography variant="text_14_regular">
                                  {isNaN(
                                      (params.row.aggregateQuantity / params.row.totalRenoUnits) *
                                          (params.row?.eachPrice || 0),
                                  ) ||
                                  (params.row.aggregateQuantity / params.row.totalRenoUnits) *
                                      (params.row?.eachPrice || 0) ==
                                      Infinity
                                      ? ""
                                      : (
                                            (params.row.aggregateQuantity /
                                                params.row.totalRenoUnits) *
                                            (params.row?.eachPrice || 0)
                                        )?.toFixed(2)}
                              </Typography>
                          ),
                      },
                  ]),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [viewMode, categoryData, inventories?.data, isCommonAreaProject],
    );

    function updateRowPosition(
        initialIndex: number,
        newIndex: number,
        tableRows: Array<GridRowModel>,
    ): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const rowsClone = [...tableRows];
                const row = rowsClone.splice(initialIndex, 1)[0];
                rowsClone.splice(newIndex, 0, row);
                resolve(rowsClone);
            }, Math.random() * 500 + 100); // simulate network latency
        });
    }
    const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
        const tableRows = getRowsFromTable(apiRef);
        const newRows = await updateRowPosition(params.oldIndex, params.targetIndex, tableRows);

        setRows(newRows);
    };

    const hasUpdatedItem = getRowsFromTable(apiRef).some(
        (item: any) =>
            item.isUpdated ||
            (item.id.includes("add_row") && item.isActive) ||
            (!item.id.includes("add_row") && !item.isActive),
    );

    useEffect(() => {
        if (hasUpdatedItem) {
            setIsHavingUnsavedChanges && setIsHavingUnsavedChanges(true);
        } else {
            setIsHavingUnsavedChanges && setIsHavingUnsavedChanges(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasUpdatedItem]);
    const filteredColumns = (data: any) => {
        return data.filter((item: any) => item.field !== "actions");
    };

    return (
        <StyledBox>
            <DataGridPro
                apiRef={apiRef}
                disableColumnMenu={false}
                getRowId={(param: any) => param.id}
                loading={flooringScopeRenos.loading || loading}
                columns={
                    viewMode
                        ? filteredColumns([...ScopeListColumns, ...dynamicColumns])
                        : [...ScopeListColumns, ...dynamicColumns].map((column) => ({
                              ...column,
                              editable:
                                  column.field.includes("-qty") || column.field.includes("-price")
                                      ? !viewMode
                                      : column.editable,
                          }))
                }
                isCellEditable={(params: any) => {
                    const isQtyPriceColumn =
                        params.field.includes("-qty") || params.field.includes("-price");
                    if (isQtyPriceColumn) {
                        return !params.row.id.includes("add_row");
                    } else {
                        const correspondingColumn = [...ScopeListColumns, ...dynamicColumns].find(
                            (column) => column.field === params.field,
                        );
                        return correspondingColumn ? correspondingColumn.editable : false;
                    }
                }}
                rows={rows}
                rowsPerPageOptions={[10, 20, 30]}
                rowSelection={false}
                processRowUpdate={handleProcessRowUpdate}
                getCellClassName={(params: GridCellParams<any, any, number>) => {
                    let classes = [];

                    if (
                        params.field === "category" ||
                        params.field === "item" ||
                        params.field === "scope" ||
                        params.field === "uom" ||
                        params.field === "inventoryName" ||
                        params.field === "floorLevel"
                    ) {
                        classes.push("cellPadding0");
                    }
                    if (params.field == "eachPrice" && !params.row.isUpdated) {
                        classes.push("warning");
                    }
                    if (params.row.updatedInCurrentCommit) classes.push("updated");
                    return classes;
                }}
                getRowClassName={(params: GridCellParams<any, any, number>) => {
                    let classes = [];
                    if (params.row.isUpdated || params.row.type_of_change == "updated") {
                        classes.push("updated");
                    }
                    if (!params.row.isActive || params.row.type_of_change == "deleted") {
                        classes.push("deleted");
                    }
                    if (
                        params.row.id.includes("add_row") ||
                        params.row.type_of_change == "created"
                    ) {
                        classes.push("newRow");
                    }
                    if (params.row.updatedInCurrentCommit) classes.push("updated");
                    return classes;
                }}
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={[...columnGroupingModel, ...dynamicColumnsGroups]}
                rowReordering={!viewMode}
                onRowOrderChange={handleRowOrderChange}
                pagination={false}
                initialState={{ pinnedColumns: { right: ["actions"] } }}
                onCellEditStop={handleCellEditCommit}
                editMode="cell"
                slots={{
                    toolbar: (props: any) => (
                        <BidbookToolbar
                            defaultProps={props}
                            handleCustomButtonClick={handleCustomButtonClick}
                            viewMode={viewMode}
                            containerVersion={containerVersion}
                        />
                    ),
                    noRowsOverlay: () => (
                        <Box
                            sx={{ margin: "10px" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            {isEmpty(subGroups) ? (
                                <ContentPlaceholder
                                    text={"There is no Floor Split."}
                                    aText="Create Floor Split"
                                    height="100%"
                                    isLink
                                    onLinkClick={() =>
                                        navigate(
                                            `${pathname.substring(
                                                0,
                                                pathname.lastIndexOf("/"),
                                            )}/floorplans`,
                                        )
                                    }
                                />
                            ) : (
                                <div>
                                    <Typography variant="text_14_bold">No rows</Typography>
                                </div>
                            )}
                        </Box>
                    ),
                }}
                showCellVerticalBorder={true}
                showColumnVerticalBorder={true}
                onProcessRowUpdateError={handleRowUpdateError}
                rowBuffer={10}
                autoHeight={false}
                sx={{
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#eee",
                    },
                    [`& .MuiDataGrid-cell[data-field*="-price"]`]: {
                        borderRight: "2px solid gray",
                    },
                    [`& .parent-row .MuiDataGrid-cell[data-field*="-price"]`]: {
                        borderRight: "none",
                    },
                }}
            />
        </StyledBox>
    );
};
export default FlooringBid;
