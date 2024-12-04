import React, { useEffect, useState, useMemo } from "react";
import { Box, Dialog, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import BaseDataGrid from "components/data-grid";
import { useAppSelector } from "stores/hooks";
import { isEmpty } from "lodash";
import { getUserDetails, getUserOrgDetails } from "mixpanel/mixpanelHelper";
import mixpanel from "mixpanel-browser";

interface IFloorPlanModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    propertyId?: any;
}

const FloorPlanModal = ({ modalHandler, openModal, propertyId }: IFloorPlanModal) => {
    const { unitMixes } = useAppSelector((state) => ({
        unitMixes: state.propertiesConsumer.unitMixes.data,
    }));

    const [displayRows, setRows] = useState<any>([]);

    useEffect(() => {
        if (!isEmpty(unitMixes)) {
            let rows: any[] = unitMixes.map((unit: any) => ({
                unit_type: unit.unit_type,
                level: unit.level,
                [unit.inventoryHeader]: unit[unit.inventoryHeader],
                id: unit.unit_type,
            }));
            setRows(rows);
        }
        //eslint-disable-next-line
    }, [unitMixes]);
    const UserColumns: GridColumns = useMemo(
        () => [
            {
                field: "unit_type",
                headerName: "Unit Type",
                flex: 1,
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.unit_type}</Typography>
                ),
            },
            {
                field: "level",
                headerName: "Level (Ground, Upper)",
                flex: 2,
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row?.level}</Typography>
                ),
            },
            {
                field: unitMixes[0]?.inventoryHeader,
                headerName: unitMixes[0]?.inventoryHeader,
                flex: 2,
                headerAlign: "center",
                align: "center",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row?.[unitMixes[0]?.inventoryHeader]}
                    </Typography>
                ),
            },
        ], //eslint-disable-next-line
        [unitMixes],
    );
    useEffect(() => {
        //MIXPANEL : Event tracking for Project List Viewed From Property Detail
        mixpanel.track(
            "PROPERTY DETAIL FLOORPLANS VIEWED  : Property Details Floorplan Details Viewed",
            {
                eventId: "property_floorplan_details_views",
                ...getUserDetails(),
                ...getUserOrgDetails(),
                propertyId: propertyId,
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                <Typography variant="text_18_bold">Floor Plan Information</Typography>
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
                    hideFooter={unitMixes?.length < 10 ? true : false}
                    getRowId={(row: any) => row.id}
                />
            </Box>
        </Dialog>
    );
};

export default FloorPlanModal;
