import React, { useEffect, useState, useMemo } from "react";
import { Box, Dialog, Typography, Stack } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import BaseDataGrid from "components/data-grid";
import { useAppSelector } from "stores/hooks";
import { isEmpty } from "lodash";
import Loader from "../../admin-portal/common/loader";
import ContentPlaceholder from "components/content-placeholder";

interface IFPCommonModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    isBuilding?: boolean;
}

const FPCommonModal = ({ modalHandler, openModal, isBuilding }: IFPCommonModal) => {
    const { building, loading, commonArea } = useAppSelector((state) => ({
        building: state.propertiesConsumer.propertyFloorplan.building,
        commonArea: state.propertiesConsumer.propertyFloorplan.commonArea,
        loading: state.propertiesConsumer.propertyFloorplan.loading,
    }));
    const TableData = isBuilding ? building : commonArea;
    const [displayRows, setRows] = useState<any>([]);

    useEffect(() => {
        if (!isEmpty(TableData)) {
            let rows: any[] = TableData.map((unit: any) => ({
                name: unit?.name,
                type: unit?.type,
                quantity: unit?.total_units,
                area: unit?.area,
                id: unit?.id,
            }));
            setRows(rows);
        }
        //eslint-disable-next-line
    }, [TableData]);
    const UserColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: `${isBuilding ? "Building" : "Common Area"} Name`,
                flex: 1,
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.name}</Typography>
                ),
            },
            {
                field: "type",
                headerName: "Building Type",
                flex: 1,
                headerAlign: "center",
                align: "center",
                hide: isBuilding ? false : true,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.type}</Typography>
                ),
            },
            {
                field: "quantity",
                headerName: "Quantity",
                flex: 1,
                headerAlign: "center",
                hide: isBuilding ? false : true,
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.quantity}</Typography>
                ),
            },
            {
                field: "area",
                headerName: "Area",
                flex: 1,
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.area}</Typography>
                ),
            },
        ], //eslint-disable-next-line
        [TableData],
    );
    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">
                    {isBuilding ? "Building" : "Common Area"} Details
                </Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box minHeight="150px">
                <BaseDataGrid
                    columns={UserColumns}
                    rows={displayRows}
                    rowsPerPageOptions={[10, 20, 30]}
                    loading={false}
                    sx={{
                        // pointer cursor on ALL rows
                        "& .MuiDataGrid-row:hover": {
                            cursor: "pointer",
                        },
                    }}
                    components={{
                        NoRowsOverlay: () => (
                            <Stack sx={{ margin: "10px" }}>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <Box style={{ zIndex: 5, pointerEvents: "all" }}>
                                        <ContentPlaceholder
                                            text={`No ${
                                                isBuilding ? "Building" : "Common Area"
                                            } created.`}
                                            height="90px"
                                            aText=""
                                        />
                                    </Box>
                                )}
                            </Stack>
                        ),
                    }}
                    hideFooter={TableData?.length < 10 ? true : false}
                    getRowId={(row: any) => row.id}
                />
            </Box>
        </Dialog>
    );
};

export default FPCommonModal;
