import React, { useEffect, useState, useMemo } from "react";
import {
    GridRenderCellParams,
    GridCellParams,
    GridRowOrderChangeParams,
    GridRowModel,
    GridColDef,
    DataGridProProps,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import DataGridPro from "components/data-grid-pro";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import {
    ORGANIZATION_CONTAINER_CATEGORY_QUERY,
    UOMS,
} from "components/container-admin-interface/constants";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import { Delete, RestoreFromTrash } from "@mui/icons-material";
import { isUndefined } from "lodash";
import { MenuItem, Select, TextField, Typography } from "@mui/material";
import {
    BidbookToolbar,
    ColumnHeaderGrouping,
    WorkTypeDropDown,
    columnGroupingModel,
} from "./helpers/components";
import { WORK_TYPE_OPTIONS } from "./constants";
import {
    StyledBox,
    appendNewRowsData,
    compareObjIfUpdatedFp,
    getAggregateQty,
    getAllowedItems,
    getAllowedScopes,
    getAllowedWorkTypes,
    getRowsFromTable,
    saveChangesToPortal,
    updateRowTakeOffs,
} from "./helpers/functions";
import { graphQLClient } from "utils/gql-client";

const Alts: React.FC<any> = ({
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
    const {
        altScopeRenos,
        inventories,
        floorplans,
        inventoryMix,
        isCommonAreaProject,
        containerVersion,
        projectDetails,
    } = useAppSelector((state) => {
        return {
            altScopeRenos: state.budgeting?.details?.altScope?.renovations,
            inventories: state.projectFloorplans.inventories,
            floorplans: state.projectFloorplans.floorplans.data,
            inventoryMix: state.projectFloorplans.inventoryMixes.data,
            isCommonAreaProject:
                state.projectDetails.data?.projectType == "COMMON_AREA" ||
                state.projectDetails.data?.projectType == "EXTERIOR" ||
                false,
            containerVersion: state.projectDetails?.data?.system_remarks?.container_version,
            projectDetails: state.projectDetails.data,
        };
    });

    const [rows, setRows]: any[] = useState([]);
    const [dynamicColumns, setDynamicColumns]: any = useState([]);
    const [dynamicColumnsGroups, setDynamicColumnsGroups]: any = useState([]);
    const [updatedItems, setUpdatedItems]: any = useState(null);
    const [newRows, setNewRows]: any[] = useState([]);
    const [newlyAddedItems, setNewlyAddedItems]: any = useState(null);
    const [organisationCategoryData, setOrganisationCategoryData]: any = useState([]);
    const apiRef = useGridApiRef();

    useEffect(() => {
        return () => {
            setNewRows([]);
            setNewlyAddedItems(null);
            setUpdatedItems(null);
        };
    }, []);
    const getOrganisationCategoryData = async () => {
        const organisationContainerId = projectDetails?.organisation_container_id;
        const res = await graphQLClient.query(
            "getOrganisationContainerGroups",
            ORGANIZATION_CONTAINER_CATEGORY_QUERY,
            { organisationContainerId },
        );
        setOrganisationCategoryData(
            res.getOrganisationContainerGroups.map((data: { l1: string }) => data.l1),
        );
    };
    useEffect(() => {
        if (!viewMode)
            dispatch(
                actions.budgeting.fetchAltScopeStart({
                    projectId: projectId,
                }),
            );
        if (projectDetails?.organisation_container_id) getOrganisationCategoryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, viewMode]);
    const { enqueueSnackbar } = useSnackbar();

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
                        minWidth: 150,
                        headerAlign: "center",
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
        const allRows = getRowsFromTable(apiRef);
        if (saveChanges) {
            setUpdatedItems(
                allRows.filter(
                    (item: any) =>
                        (item?.isUpdated || !item?.isActive) && !item?.id?.includes("add_row"),
                ),
            );
        }
        setNewlyAddedItems(
            allRows.filter(
                (item: any) => item?.isUpdated && item?.isActive && item?.id?.includes("add_row"),
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveChanges]);

    // after succesfullupdate of local variable calling API
    useEffect(() => {
        if (updatedItems == null || newlyAddedItems == null) {
            return;
        }
        const currentStep = "ALTERNATIVES";
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
            return;
        } else {
            setSaveChanges(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedItems]);

    const newObject = useMemo(() => {
        const result: any = {};

        inventories.data?.forEach((item: any) => {
            result[item.id] = item.name;
        });

        return result;
    }, [inventories.data]);

    //rows

    useEffect(() => {
        let dataSource = [...(altScopeRenos?.data ?? [])];
        if (viewMode) {
            const selectedData = selectedVersionData || {};
            const allRenovationItems = selectedData.all_renovation_items || {};
            const alt_scope = allRenovationItems.alt_scope || [];
            dataSource = [...alt_scope];
        }

        setRows(
            dataSource
                ?.sort((a: any, b: any) => {
                    return (
                        organisationCategoryData.indexOf(a?.l1_name) -
                        organisationCategoryData.indexOf(b?.l1_name)
                    );
                })
                ?.map((renoItem: any, index: any) => {
                    // Aggregate qty = [A1 Quantity x # of A1s] + [B1 Quantity x # of B1s] + [C1 Quantity x # of C1s] ….and so on
                    // Aggregate Price = Aggregate qty * UOM price
                    // WAVG QTY = Aggregate qty / Total reno_units
                    // WAVG Price = WAVG QTY * UOM Price
                    const totalRenoUnits = floorplans.reduce(
                        (total: number, item: any) => total + item.renoUnits,
                        0,
                    );

                    const dynamicObj: any = {};
                    const dynamicTest: any = {};

                    floorplans?.map((floorplan: any) => {
                        const renoItemTakeOff = renoItem?.take_offs?.find(
                            (item: any) => item.fp_id === floorplan.id,
                        );
                        const fpId = floorplan.id;
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
                        hierarchy: [renoItem.category, `${renoItem.item}@groupedKey${index + 1}`],
                        item: renoItem?.item || "",
                        subcategory: renoItem?.subcategory || "",
                        // inventoryName: newObject[renoItem?.inventoryId] || "",
                        description: renoItem?.description || "",
                        comments: renoItem?.comments || "",
                        finish: renoItem?.finish || "",
                        manufacturer: renoItem?.manufacturer || "",
                        model: renoItem?.modelNo || "",
                        uom: renoItem?.uom?.toLowerCase() || "",
                        eachQuantity: 1,
                        eachPrice: renoItem?.unitCost || "",
                        aggregateQuantity: getAggregateQty(renoItem, floorplans),
                        isUpdated: false,
                        isActive: renoItem.is_active || true,
                        workType: renoItem?.workType,
                        totalRenoUnits: totalRenoUnits,
                        allowedItems: getAllowedItems(renoItem.category, containerItemsList) || [],
                        allowedScopes: getAllowedScopes(
                            renoItem,
                            renoItem.workType,
                            containerItemsList,
                        ),
                        allowedWorkTypes: getAllowedWorkTypes(renoItem, containerItemsList),
                        take_offs: renoItem.take_offs,
                        type_of_change: renoItem.type_of_change,
                        renovation_item_project_takeoffs_id:
                            renoItem.renovation_item_project_takeoffs_id,
                        ...dynamicObj,
                    };
                }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        altScopeRenos?.data,
        floorplans,
        newObject,
        selectedVersionData,
        viewMode,
        containerItemsList,
    ]);

    const handleCellEditCommit = (params: any) => {
        let value = params.value;
        value = parseFloat(value) || value;
        const allRows = getRowsFromTable(apiRef);
        const updatedRows = allRows?.map((item: any) => {
            if (item.id === params.id) {
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
                    itemCpy.allowedItems = getAllowedItems(value, containerItemsList);
                    return itemCpy;
                } else if (params.field == "item") {
                    itemCpy[params.field] = value;

                    itemCpy.allowedWorkTypes = getAllowedWorkTypes(value, containerItemsList);
                    return itemCpy;
                } else if (params.field == "scope") {
                    itemCpy[params.field] = value;
                    return itemCpy;
                } else if (params.field == "workType") {
                    itemCpy[params.field] = value;
                    itemCpy.allowedScopes = getAllowedScopes(itemCpy, value, containerItemsList);
                    return itemCpy;
                } else {
                    return { ...item, [params.field]: value, isUpdated: true };
                }
            } else {
                return { ...item };
            }
        });
        setIsHavingUnsavedChanges && setIsHavingUnsavedChanges(true);
        apiRef.current.updateRows(updatedRows);
    };
    const isEqual = (object1: any, object2: any) =>
        JSON.stringify(object1) === JSON.stringify(object2);

    const handleProcessRowUpdate = (updatedRow: any, oldRow: any) => {
        if (!isEqual(updatedRow, oldRow)) {
            const allRows = getRowsFromTable(apiRef);
            const { isUpdatedTakeoff } = compareObjIfUpdatedFp(updatedRow, oldRow);
            // Find the index of the row that was edited

            const rowIndex = allRows?.findIndex((row: any) => row.id === updatedRow.id);
            updatedRow.updatedInCurrentCommit = true;

            const updatedRenoItemProjectTakeOffId = updatedRow.renovation_item_project_takeoffs_id;
            const updatedRows = allRows.map((row: any, index: number) => {
                const updatedObj: any = {
                    ...row,
                    ...(index === rowIndex && updatedRow),
                };
                const renoItemProjectTakeOffId = row.renovation_item_project_takeoffs_id;
                if (
                    isUpdatedTakeoff &&
                    !isUndefined(updatedRenoItemProjectTakeOffId) &&
                    !isUndefined(renoItemProjectTakeOffId) &&
                    updatedRenoItemProjectTakeOffId === renoItemProjectTakeOffId
                ) {
                    // updating floorplan prices based on the entered each price
                    const updatedObjWithTakeOffs = {
                        ...updateRowTakeOffs(updatedObj, updatedRow, floorplans),
                        isUpdated: true,
                    };
                    index === rowIndex && (updatedRow = updatedObjWithTakeOffs);
                    return updatedObjWithTakeOffs;
                } else if (updatedRow?.id === row.id) {
                    const updatedObjWithTakeOffs = isUpdatedTakeoff
                        ? {
                              ...updateRowTakeOffs(updatedObj, updatedRow, floorplans),
                              isUpdated: true,
                          }
                        : { ...updatedObj, isUpdated: true };
                    index === rowIndex && (updatedRow = updatedObjWithTakeOffs);
                    return updatedObjWithTakeOffs;
                }
                return row;
            });
            setIsHavingUnsavedChanges && setIsHavingUnsavedChanges(true);
            apiRef.current.updateRows(updatedRows);
        }

        return updatedRow;
    };
    const handleRowUpdateError = (error: any) => {
        // You can log the error or perform any other necessary actions here
        console.error("Error occurred during row update:", error);
    };

    // Add new row logic

    const handleCustomButtonClick = () => {
        if (newRows?.length > 0) {
            confirmationCheck();
        } else {
            const tableRows = getRowsFromTable(apiRef);
            appendNewRowsData(
                tableRows,
                newRows,
                setNewRows,
                setAddRowConfirmationAccepted,
                setRows,
            );
        }
    };

    useEffect(() => {
        if (addRowConfirmationAccepted) {
            const tableRows = getRowsFromTable(apiRef);
            appendNewRowsData(
                tableRows,
                newRows,
                setNewRows,
                setAddRowConfirmationAccepted,
                setRows,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addRowConfirmationAccepted]);
    //ends

    //Columns
    const handleRowRemove = (updatedRow: any) => {
        const allRows = getRowsFromTable(apiRef);
        apiRef.current.updateRows(
            allRows?.map((item: any) => {
                return item.id === updatedRow.id
                    ? { ...item, isActive: !item.isActive }
                    : { ...item };
            }),
        );
    };
    const ScopeListColumns: GridColDef[] = useMemo(
        () => [
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
                            isOptionEqualToValue={(option, value) => option == value}
                            options={categoryData}
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
                            filterSelectedOptions
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
                        isOptionEqualToValue={(option, value) => option.item == value}
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
                        sx={{ width: "inherit" }}
                        filterSelectedOptions
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
                editable: !viewMode,
                hasFocus: true,
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
                        isOptionEqualToValue={(option, value) => option.scope == value}
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
                        getOptionLabel={(option: any) => option.scope ?? option}
                        sx={{ width: "inherit" }}
                        filterSelectedOptions
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
                    <Typography variant="text_14_regular">{params.row.location}</Typography>
                ),
            },

            // {
            //     field: "inventoryName",
            //     headerName: "Inventory Name",
            //     minWidth: 170,
            //     renderCell: (params) => (
            //         <Autocomplete
            //             id="inventoryName"
            //             defaultValue={params.row.inventoryName}
            //             onChange={(event: any, value) => {
            //                 handleCellEditCommit({
            //                     id: params.row.id,
            //                     field: params.field,
            //                     value: value,
            //                 });
            //             }}
            //             isOptionEqualToValue={(option, value) => option == value}
            //             options={inventories?.data?.map((item: any) => item.name)}
            //             renderOption={(props, option) => <li {...props}>{option}</li>}
            //             renderInput={(paramsInput) => (
            //                 <TextField
            //                     {...paramsInput}
            //                     inputProps={{
            //                         ...paramsInput.inputProps,
            //                     }}
            //                     value={params.value}
            //                 />
            //             )}
            //             sx={{ width: "inherit" }}
            //             blurOnSelect
            //             selectOnFocus
            //             clearOnBlur
            //             handleHomeEndKeys
            //             readOnly={viewMode}
            //         />
            //     ),
            // },
            {
                field: "description",
                headerName: "Description",
                type: "string",
                editable: !viewMode,
                minWidth: 150,
                hasFocus: true,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.description}</Typography>
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
                    <Typography variant="text_14_regular">{params.row.comments}</Typography>
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
                    <Typography variant="text_14_regular">{params.row.finish}</Typography>
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
                    <Typography variant="text_14_regular">{params.row.manufacturer}</Typography>
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
                    <Typography variant="text_14_regular">{params.row.model}</Typography>
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
                                value: event.target.value,
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
                    <Typography variant="text_14_regular">{params.row.eachQuantity}</Typography>
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
                    <Typography variant="text_14_regular">{params.row.eachPrice}</Typography>
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
                            {(params.row.aggregateQuantity * params.row.eachPrice).toFixed(2)}
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
                renderCell: (params: GridRenderCellParams) => {
                    if (params.rowNode.type === "group") {
                        return null;
                    } else {
                        return !params.row.isActive ? (
                            <IconButton
                                key={params.row.id}
                                onClick={() => handleRowRemove(params.row)}
                            >
                                <RestoreFromTrash style={{ color: "#6A6464" }} />
                            </IconButton>
                        ) : (
                            <IconButton
                                key={params.row.id}
                                onClick={() => handleRowRemove(params.row)}
                            >
                                <Delete />
                            </IconButton>
                        );
                    }
                },
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
                                  params.row.aggregateQuantity / params.row.totalRenoUnits ==
                                      Infinity
                                      ? ""
                                      : (
                                            params.row.aggregateQuantity / params.row.totalRenoUnits
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
        [viewMode, categoryData, inventories?.data],
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

    const filteredColumns = (data: any) => {
        return data.filter((item: any) => item.field !== "actions");
    };
    const getTreeDataPath: DataGridProProps["getTreeDataPath"] = (row) => row.hierarchy;

    return (
        <StyledBox>
            <DataGridPro
                apiRef={apiRef}
                treeData={true}
                getTreeDataPath={getTreeDataPath}
                disableColumnMenu={false}
                defaultGroupingExpansionDepth={-1}
                loading={altScopeRenos?.loading || loading}
                getRowId={(param: any) => param.id}
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
                    if (
                        params.field === "location" ||
                        params.field === "description" ||
                        params.field === "comments" ||
                        params.field === "manufacturer" ||
                        params.field === "model"
                    ) {
                        return !params.row.id.includes("add_row");
                    }
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
                getCellClassName={(params: GridCellParams<any, any, any>) => {
                    let classes: any = [];
                    if (
                        params.field === "category" ||
                        params.field === "item" ||
                        params.field === "scope" ||
                        params.field === "uom" ||
                        params.field === "inventoryName"
                    ) {
                        classes.push("cellPadding0");
                    }
                    if (params.field == "eachPrice" && !params.row.isUpdated) {
                        classes.push("warning");
                    }
                    if (
                        params.field == "__tree_data_group__" &&
                        params?.rowNode &&
                        params?.rowNode?.type == "leaf"
                    ) {
                        classes.push("hidden");
                    }
                    if (params.row.updatedInCurrentCommit) classes.push("updated");
                    return classes;
                }}
                getRowClassName={(params: any) => {
                    let classes: any = [];
                    // Check if the row is a autogenerated row
                    const isParentRow = params?.id?.split("/").length === 2;
                    const isChildRow = params?.id?.split("/").length > 2;
                    if (isParentRow) {
                        classes.push("parent-row");
                    }
                    if (isChildRow) {
                        classes.push("tree-child-row");
                    }
                    // Apply classes only to non-parent rows
                    if (!isParentRow && !isChildRow) {
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
                    }
                    return classes;
                }}
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={[...columnGroupingModel, ...dynamicColumnsGroups]}
                onRowOrderChange={handleRowOrderChange}
                pagination={false}
                initialState={{ pinnedColumns: { right: ["actions"] } }}
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
export default Alts;
