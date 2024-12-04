import React, { useEffect, useMemo, useState } from "react";
import { groupBy, isEmpty, isNumber } from "lodash";
import { Typography } from "@mui/material";
import DataGridPro from "components/data-grid-pro";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";

function RenoProgressDetails() {
    const [rows, setRows]: any[] = useState([]);
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const { renovationProgressDetail, loading } = useAppSelector(
        (state) => ({
            renovationProgressDetail:
                state.singleProject.projectAnalytics.renovationProgress.details,
            loading: state.singleProject.loading,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (isEmpty(renovationProgressDetail)) {
            dispatch(
                actions.singleProject.fetchRenovationProgressStart({
                    projectId,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getRows = () => {
        //group by unit type and floor plan type
        const renoProgressDetails = groupBy(
            renovationProgressDetail || [],
            (item) => `${item.unit_type}+${item.floor_plan_type}`,
        );

        return Object.keys(renoProgressDetails).map((key: string) => {
            const item = renoProgressDetails[key][0];
            const statusMap: any = {
                completed: 0,
                in_progress: 0,
                not_started: 0,
                pending_approval: 0,
                unscheduled: 0,
                scheduled: 0,
            };
            renoProgressDetails[key]?.forEach((item: any) => {
                statusMap[item.status] = item.count;
            });
            return {
                id: key,
                unitType: item.unit_type,
                floorPlanType: item.floor_plan_type,
                completed: statusMap.completed,
                inProgress: statusMap.in_progress + statusMap.pending_approval,
                notStarted: statusMap.not_started + statusMap.unscheduled + statusMap.scheduled,
                inventories: item.inventory_details,
            };
        });
    };

    useEffect(() => {
        setRows(getRows());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renovationProgressDetail]);

    const getInventoryNames = () => {
        const inventoryNames = Array.from(
            new Set(
                (
                    (renovationProgressDetail || []).map((item: any) =>
                        item.inventory_details.map((inventory: any) => inventory.inventory_name),
                    ) || []
                ).flat(),
            ),
        );
        return inventoryNames;
    };

    const getInventoryColumnHeader = () => {
        const inventoryNames = getInventoryNames();
        return inventoryNames?.length > 0
            ? `Inventory (${inventoryNames.join(", ")})`
            : "Inventory";
    };

    const getInventoryCellData = (inventories: any[] = []) => {
        const inventoryNames: string[] = getInventoryNames() || [];
        if (inventoryNames.length == 0) {
            return "-";
        } else if (inventoryNames.length === 1) {
            return (
                inventories.find((inventory) => inventory.inventory_name == inventoryNames[0])
                    ?.count || "N/A"
            );
        } else {
            const inventoryCounts = inventoryNames.map(
                (inventoryName) =>
                    inventories.find((inventory) => inventory.inventory_name === inventoryName)
                        ?.count || "N/A",
            );
            const totalCount = inventoryCounts.reduce(
                (accumulator, currentValue) =>
                    accumulator + (isNumber(currentValue) ? currentValue : 0),
                0,
            );
            return `${totalCount} (${inventoryCounts.join(", ")})`;
        }
    };

    const renovationProgressColumns: any = useMemo(
        () => [
            {
                field: "unitType",
                headerName: "Unit Type",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.unitType}</Typography>
                ),
            },
            {
                field: "floorPlanType",
                headerName: "Floor Plan Type",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.floorPlanType}</Typography>
                ),
            },
            {
                field: "inventories",
                headerName: getInventoryColumnHeader(),
                type: "string",
                flex: 1,
                headerAlign: "left",
                align: "left",
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {getInventoryCellData(params.row.inventories)}
                    </Typography>
                ),
            },
            {
                field: "completed",
                headerName: "Completed",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.completed}</Typography>
                ),
            },
            {
                field: "inprogress",
                headerName: "In Progress",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.inProgress}</Typography>
                ),
            },
            {
                field: "notStarted",
                headerName: "Not Started",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.notStarted}</Typography>
                ),
            },
        ], //eslint-disable-next-line
        [renovationProgressDetail],
    );
    return (
        <DataGridPro
            disableColumnMenu={false}
            loading={loading}
            disableRowSelectionOnClick
            columns={renovationProgressColumns}
            sx={{ height: "500px" }}
            rows={rows}
            checkboxSelection={false}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            hideToolbar
            rowsPerPageOptions={[10, 20, 30]}
        />
    );
}
export default RenoProgressDetails;
