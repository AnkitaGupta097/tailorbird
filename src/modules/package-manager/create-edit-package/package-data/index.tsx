import React from "react";
import { IPackageDataProps } from "../../interfaces";
/* eslint-disable no-unused-vars */
import { Grid, Typography, styled, Tab, Tabs, TextField } from "@mui/material";
import AppTheme from "../../../../styles/theme";
import BaseAutoComplete from "components/auto-complete";
import BaseDataGrid from "components/data-grid";
import { GridColDef, GridToolbar } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import DeleteMaterial from "../package-selection/helper/delete-material";

const PackageData = (props: IPackageDataProps) => {
    const onSupplierChange = (item: string, value: any, index: number) => {
        props.setMaterialsData((skuRows: any) => {
            if (value) {
                skuRows[index] = {
                    ...skuRows[index],
                    supplier_index: skuRows[index]?.suppliers?.findIndex(
                        (supplier: any) => supplier.id === value?.id,
                    ),
                };

                return [...skuRows];
            } else {
                skuRows[index] = {
                    ...skuRows[index],
                    supplier_index: null,
                };

                return [...skuRows];
            }
        });
    };
    const columns: GridColDef[] = [
        {
            field: "primary_thumbnail",
            headerName: "Image",
            minWidth: 150,
            maxWidth: 200,
            filterable: true,

            renderCell: ({ value }) => {
                return (
                    <Box
                        sx={{
                            display: "inline-block",
                            border: "0.5px solid rgb(223, 224, 235)",
                            borderRadius: "4px",
                            overflow: "hidden",
                        }}
                    >
                        <Avatar
                            alt="thumbnail"
                            src={value || "/image-placeholder.png"}
                            sx={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "4px",
                                transition: "transform .2s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.2)",
                                },
                            }}
                        />
                    </Box>
                );
            },
        },
        {
            field: "category",
            headerName: "Category",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.category}</Typography>
            ),
        },
        {
            field: "subcategory",
            headerName: "Item",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.subcategory}</Typography>
            ),
        },
        {
            field: "manufacturer",
            headerName: "Manufacturer",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.manufacturer}</Typography>
            ),
        },
        {
            field: "model_id",
            headerName: "Model Number",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.model_id}</Typography>
            ),
        },
        {
            field: "supplier",
            headerName: "Supplier",
            width: 200,
            renderCell: (params: any) => {
                return (
                    <BaseAutoComplete
                        options={params.row.supplier as unknown as Array<any>}
                        placeholder="Suppliers"
                        // variant="default"
                        variant="outlined"
                        sx={{ width: "100%" }}
                        // autoWidth
                        renderInput={(params: any) => (
                            <TextField
                                {...params}
                                label="Suppliers"
                                placeholder="Suppliers"
                                variant="outlined"
                                sx={{ width: "100%" }}
                            />
                        )}
                        onChange={(e: any, value: any) => {
                            onSupplierChange(
                                params.row.current_item.material_id,
                                params.row.current_item,
                                params.row.index,
                            );
                        }}
                        getOptionLabel={(option: any) => {
                            return option.supplier_name.concat(" - ", option.sku_id);
                        }}
                    />
                );
            },
        },
        {
            field: "description",
            headerName: "Description",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 300,
            maxWidth: 700,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular" sx={{ lineHeight: "1.5em" }}>
                    {params.row.description}
                </Typography>
            ),
        },
        {
            field: "grade",
            headerName: "Grade",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.grade}</Typography>
            ),
        },
        {
            field: "style",
            headerName: "Style",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.style}</Typography>
            ),
        },
        {
            field: "finish",
            headerName: "Finish",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="text_14_regular">{params.row.finish}</Typography>
            ),
        },
        {
            field: "Actions",
            headerName: "Actions",
            editable: true,
            sortable: true,
            filterable: true,
            minWidth: 150,
            maxWidth: 200,
            renderCell: (params) => (
                <>
                    <DeleteMaterial {...params} />
                </>
            ),
        },
    ];
    return (
        <BaseDataGrid
            columns={columns}
            rows={props?.skuRows.map((value: any, index: any) => {
                return {
                    index: index,
                    id: value?.material_id || value?.labor_id,
                    manufacturer: value?.manufacturer,
                    primary_thumbnail: value?.primary_thumbnail,
                    category: value?.category,
                    subcategory: value?.subcategory,
                    model_id: value?.model_id,
                    supplier: value?.suppliers,
                    description: value?.description,
                    grade: value?.grade,
                    style: value?.style,
                    finish: value?.finish,
                    current_item: value,
                    setMaterialsData: props.setMaterialsData,
                };
            })}
            checkboxSelection={true}
            getRowHeight={() => "auto"}
            slots={{
                toolbar: GridToolbar,
            }}
            disableSelectionOnClick={true}
            disableColumnMenu={false}
            onSelectionModelChange={(selectedItems: any) => {
                props.setMaterialsData((materialData: any) => {
                    return materialData.map((data: any) => {
                        if (selectedItems.includes(data.material_id)) {
                            data.selected = true;
                        } else {
                            data.selected = false;
                        }
                        return data;
                    });
                });
            }}
            rowsPerPageOptions={[50, 10, 25, 50, 100]}
        ></BaseDataGrid>
    );
};

export default PackageData;
