import React, { useEffect, useMemo, useState } from "react";
import { filter, isEmpty, isEqual, isNumber } from "lodash";
import { Typography } from "@mui/material";
import DataGridPro from "components/data-grid-pro";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import moment from "moment";

interface IRenoTimeTableProps {
    columns: string[];
}

function RenoTimeTable(props: IRenoTimeTableProps) {
    const { columns } = props;
    const [rows, setRows]: any[] = useState([]);
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const { renoTimeByUnit, loading, prevColumns } = useAppSelector(
        (state) => ({
            renoTimeByUnit: state.singleProject.projectAnalytics.renovationTime.renoTimeByUnit.data,
            prevColumns: state.singleProject.projectAnalytics.renovationTime.renoTimeByUnit.columns,
            loading: state.singleProject.loading,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (!isEqual(columns, prevColumns) || isEmpty(renoTimeByUnit)) {
            dispatch(
                actions.singleProject.fetchRenoTimeByUnitStart({
                    projectId,
                    columns,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);

    useEffect(() => {
        setRows(getRows());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renoTimeByUnit]);

    const getRows = () => {
        const dataRows = renoTimeByUnit?.map((item: any, index: number) => ({
            id: index,
            unitType: item.unit_type,
            unitName: item.unit_name,
            floorPlanType: item.type,
            averageRenoTimeInSeconds: item.avg_renovation_time,
            inventory: item.name,
        }));

        // const dataRowsWithValidData = dataRows.filter((r) =>
        //     _.isNumber(r.averageRenoTimeInSeconds),
        // );

        // const combinedAverage =
        //     dataRowsWithValidData && dataRowsWithValidData.length
        //         ? _.sumBy(dataRowsWithValidData, "averageRenoTimeInSeconds") /
        //           dataRowsWithValidData.length
        //         : undefined;

        // const allCombinedRow = {
        //     id: "All",
        //     unitType: "All",
        //     unitName: "All",
        //     floorPlanType: "All",
        //     averageRenoTimeInSeconds: combinedAverage,
        //     inventory: "All",
        // };

        return dataRows;
    };

    const getAllPossibleDynamicColumns = () => {
        return [
            {
                field: "unit_number",
                headerName: "Unit Number",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={params.row.id === "All" ? "text_16_semibold" : "text_14_regular"}
                    >
                        {params.row.unitName}
                    </Typography>
                ),
            },
            {
                field: "unit_type",
                headerName: "Unit Type",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={params.row.id === "All" ? "text_16_semibold" : "text_14_regular"}
                    >
                        {params.row.unitType}
                    </Typography>
                ),
            },

            {
                field: "floor_plan_type",
                headerName: "Floor Plan Type",
                type: "string",
                flex: 1,
                headerAlign: "left",
                align: "left",
                // eslint-disable-next-line no-unused-vars
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={params.row.id === "All" ? "text_16_semibold" : "text_14_regular"}
                    >
                        {params.row.floorPlanType}
                    </Typography>
                ),
            },
            {
                field: "inventory",
                headerName: "Inventory",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={params.row.id === "All" ? "text_16_semibold" : "text_14_regular"}
                    >
                        {params.row.inventory}
                    </Typography>
                ),
            },
        ];
    };

    const renoTimeByUnitColumns: any = useMemo(
        () => [
            ...filter(getAllPossibleDynamicColumns(), (col) => columns.includes(col.field)),
            {
                field: "avgRenoDays",
                headerName: "Avg. Number of Renovation Days",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={params.row.id === "All" ? "text_16_semibold" : "text_14_regular"}
                    >
                        {isNumber(params.row.averageRenoTimeInSeconds)
                            ? moment
                                  .duration(params.row.averageRenoTimeInSeconds, "seconds")
                                  .asDays()
                                  .toFixed(4)
                            : "-"}
                    </Typography>
                ),
            },
        ], //eslint-disable-next-line
        [columns],
    );
    return (
        <DataGridPro
            autoHeight={false}
            loading={loading}
            sx={{ height: "500px" }}
            disableColumnMenu={false}
            disableRowSelectionOnClick
            columns={renoTimeByUnitColumns}
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
export default RenoTimeTable;
