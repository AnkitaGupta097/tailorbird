import React, { useEffect, useState } from "react";
import { chain, each, isEmpty, isNil, keyBy, mapValues, omit, reduce } from "lodash";
import { Typography } from "@mui/material";
import DataGridPro from "components/data-grid-pro";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";
import actions from "stores/actions";
import moment from "moment";

function MonthlyUnitTurnedTable() {
    const [rows, setRows]: any[] = useState([]);
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const { monthlyUnits, loading } = useAppSelector(
        (state) => ({
            monthlyUnits:
                state.singleProject.projectAnalytics.renovationTime.monthByMonthUnitsTurned,
            loading: state.singleProject.loading,
        }),
        shallowEqual,
    );

    useEffect(() => {
        if (isEmpty(monthlyUnits)) {
            dispatch(
                actions.singleProject.fetchMonthlyTurnedUnitsStart({
                    projectId,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setRows(getRows());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlyUnits]);

    const getRows = () => {
        const unitTypeRows = chain(monthlyUnits)
            .groupBy("unit_type")
            .map((entries, unitType) => ({
                id: unitType,
                unitType,
                ...mapValues(keyBy(entries, "month"), "count"),
            }))
            .value();

        const allRow = reduce(
            unitTypeRows,
            (result: any, obj) => {
                each(omit(obj, ["id", "unitType"]), (value, key) => {
                    result[key] = (result[key] || 0) + value || 0;
                });
                return result;
            },
            { id: "All", unitType: "All" },
        );

        return isEmpty(monthlyUnits) ? [] : [allRow, ...unitTypeRows];
    };

    const getMonthColumns = () => {
        return chain(monthlyUnits)
            .map("month")
            .uniq()
            .sort()
            .map((m: any) => ({
                field: m,
                headerName: moment(m, "YYYY-MM").format("MMMM YYYY"),
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={
                            params.row.unitType === "All" ? "text_16_semibold" : "text_14_regular"
                        }
                    >
                        {isNil(params.row[m]) ? "-" : params.row[m]}
                    </Typography>
                ),
            }))
            .value();
    };

    const getAllColumns = () => {
        const unitTypeColumn = {
            field: "unitType",
            headerName: "Unit Type",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant={params.row.unitType === "All" ? "text_16_semibold" : "text_14_regular"}
                >
                    {params.row.unitType}
                </Typography>
            ),
        };

        return [unitTypeColumn, ...getMonthColumns()];
    };

    return (
        <DataGridPro
            autoHeight={false}
            loading={loading}
            sx={{ height: "500px" }}
            disableColumnMenu={false}
            disableRowSelectionOnClick
            columns={getAllColumns()}
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
export default MonthlyUnitTurnedTable;
