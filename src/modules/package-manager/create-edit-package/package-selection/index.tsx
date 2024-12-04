import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IPackageSelection } from "../../interfaces";
import { handleMaterialUpdate } from "../../create-sku-modal/common/helper";
import { useCallbackPrompt } from "../../../../hooks/use-callback-prompt";
import DialogBox from "../warning-dialog";
import BaseDataGrid from "components/data-grid";
import { GridToolbar, GridColumns, GridColDef } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";
import { ThumbnailRenderer, ThumbnailUploaderDialog } from "./helper";
import BaseCheckbox from "components/checkbox";

const columns: GridColumns = [
    {
        field: "category",
        headerName: "Category",
        type: "string",
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
        headerName: "Subcategory",
        type: "string",
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
        sortable: true,
        filterable: true,
        minWidth: 150,
        maxWidth: 200,
        renderCell: (params: any) => (
            <Typography variant="text_14_regular">{params.row.supplier}</Typography>
        ),
    },
    {
        field: "supplier_id",
        headerName: "Supplier Number",
        sortable: true,
        filterable: true,
        minWidth: 150,
        maxWidth: 200,
        renderCell: (params: any) => (
            <Typography variant="text_14_regular">{params.row.supplier_id}</Typography>
        ),
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
        type: "string",
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
        type: "string",
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
        type: "string",
        editable: true,
        sortable: true,
        filterable: true,
        minWidth: 150,
        maxWidth: 200,
        renderCell: (params: any) => (
            <Typography variant="text_14_regular">{params.row.finish}</Typography>
        ),
    },
];

const PackageSelection = (props: IPackageSelection) => {
    //States
    const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
    const [activeRow, setActiveRow] = useState({});
    const thumbnailCol: GridColDef = {
        field: "primary_thumbnail",
        headerName: "Image",
        minWidth: 150,
        maxWidth: 200,
        filterable: true,
        renderCell: (params) => {
            const props = { params, setActiveRow, setIsImageUploaderOpen };
            return <ThumbnailRenderer {...props} />;
        },
    };
    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(props?.showDialog);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        "children" | "severity"
    > | null>(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    const resetStates = () => {
        setActiveRow({});
        setIsImageUploaderOpen(false);
    };

    useEffect(() => {
        return () => resetStates();
    }, []);

    const thumbnailUploaderProps = {
        setActiveRow,
        materialData: activeRow,
        isImageUploaderOpen,
        setIsImageUploaderOpen,
        setNewPackageMaterialsData: props?.setNewPackageMaterialsData,
    };

    return (
        <React.Fragment>
            <DialogBox
                // @ts-ignore
                showDialog={showPrompt}
                confirmNavigation={confirmNavigation}
                cancelNavigation={cancelNavigation}
            />
            <ThumbnailUploaderDialog {...thumbnailUploaderProps} />
            <Grid container direction="column">
                <Grid item>
                    <BaseDataGrid
                        sx={{
                            height: 400,
                            width: "100%",
                            "& .MuiDataGrid-cell--editable": {
                                bgcolor: (theme: any) =>
                                    theme.palette.mode === "dark" ? "#DAF3FF" : "#DAF3FF",
                            },
                        }}
                        columns={[thumbnailCol, ...columns]}
                        rows={props?.newPackageMaterialsData.map((value: any) => {
                            return {
                                id: value?.material_id || value?.labor_id,
                                manufacturer: value?.manufacturer,
                                primary_thumbnail: value?.primary_thumbnail,
                                category: value?.category,
                                subcategory: value?.subcategory,
                                model_id: value?.model_id,
                                supplier:
                                    (value?.suppliers && value?.suppliers[0]?.supplier_name) || "",
                                supplier_id:
                                    (value?.suppliers && value?.suppliers[0]?.sku_id) || "",
                                description: value?.description,
                                grade: value?.grade,
                                style: value?.style,
                                finish: value?.finish,
                                is_editable: false,
                            };
                        })}
                        checkboxSelection={true}
                        getRowHeight={() => "auto"}
                        autoHeight={true}
                        autoPageSize={true}
                        editMode="row"
                        disableSelectionOnClick={true}
                        disableColumnMenu={false}
                        experimentalFeatures={{ newEditingApi: true }}
                        isCellEditable={(params: any) => {
                            return (
                                props.newPackageMaterialsData?.find(
                                    (item: any) => item.material_id === params.id,
                                )?.is_editable === true
                            );
                        }}
                        processRowUpdate={(params: any) => {
                            handleMaterialUpdate(params);
                            // props?.setNewPackageMaterialsData(
                            //     props?.newPackageMaterialsData?.map((item: any) => {
                            //         if (item.id === params.id) {
                            //             return {
                            //                 ...item,
                            //                 style: params?.style,
                            //                 finish: params?.finish,
                            //                 grade: params?.grade,
                            //                 description: params?.description,
                            //             };
                            //         }
                            //         return item;
                            //     }),
                            // );
                            return params;
                        }}
                        onProcessRowUpdateError={() => {
                            setSnackbar({
                                children: "Material update failed",
                                severity: "error",
                            });
                        }}
                        components={{
                            toolbar: GridToolbar,
                            BaseCheckbox: (props: any) => <BaseCheckbox {...props} />,
                        }}
                        onSelectionModelChange={(selection: any) => {
                            props?.setNewPackageMaterialsData(
                                props?.newPackageMaterialsData.map((sku) => {
                                    if (
                                        (sku.labor_id && selection.includes(sku.labor_id)) ||
                                        (sku.material_id && selection.includes(sku.material_id))
                                    )
                                        return { ...sku, selected: true };
                                    return { ...sku, selected: false };
                                }),
                            );
                        }}
                        rowsPerPageOptions={[50, 10, 25, 50, 100]}
                    ></BaseDataGrid>
                    {!!snackbar && (
                        <Snackbar
                            open
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                            onClose={handleCloseSnackbar}
                            autoHideDuration={6000}
                        >
                            <Alert {...snackbar} onClose={handleCloseSnackbar} />
                        </Snackbar>
                    )}
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default React.memo(PackageSelection);
