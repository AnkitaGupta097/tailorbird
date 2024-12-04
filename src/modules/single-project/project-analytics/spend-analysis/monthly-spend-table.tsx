import React, { useEffect, useState } from "react";
import { chain, each, isEmpty, isNil, keyBy, mapValues, omit, reduce, sumBy } from "lodash";
import { Typography } from "@mui/material";
import DataGridPro from "components/data-grid-pro";
import { GridRenderCellParams } from "@mui/x-data-grid";
import moment from "moment";
import { getRoundedOffAndFormattedAmount } from "components/production/helper";

interface IMonthlySpendTableProps {
    monthlySpends: any;
    loading?: boolean;
}

function MonthlySpendTable(props: IMonthlySpendTableProps) {
    const [rows, setRows]: any[] = useState([]);
    const { monthlySpends, loading } = props;

    useEffect(() => {
        setRows(getRows());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlySpends]);

    const getRows = () => {
        const categoryRows = chain(monthlySpends)
            .groupBy("category")
            .map((entries, category) => ({
                id: category,
                category,
                total: sumBy(entries, "total_spend"),
                ...mapValues(keyBy(entries, "yyyy_mm"), "total_spend"),
            }))
            .value();

        const allRow = reduce(
            categoryRows,
            (result: any, obj) => {
                each(omit(obj, ["id", "category"]), (value, key) => {
                    result[key] = (result[key] || 0) + value;
                });
                return result;
            },
            { id: "All", category: "All" },
        );

        return isEmpty(monthlySpends) ? [] : [allRow, ...categoryRows];
    };

    const getMonthColumns = () => {
        return chain(monthlySpends)
            .map("yyyy_mm")
            .uniq()
            .sort()
            .map((month: any) => ({
                field: month,
                headerName: moment(month, "YYYY-MM").format("MMMM YYYY"),
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant={
                            params.row.category === "All" ? "text_16_semibold" : "text_14_regular"
                        }
                    >
                        {isNil(params.row[month])
                            ? "-"
                            : `$${getRoundedOffAndFormattedAmount(params.row[month])}`}
                    </Typography>
                ),
            }))
            .value();
    };

    const getAllColumns = () => {
        const categoryColumn = {
            field: "category",
            headerName: "Category",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant={params.row.category === "All" ? "text_16_semibold" : "text_14_regular"}
                >
                    {params.row.category}
                </Typography>
            ),
        };

        const totalColumn = {
            field: "total",
            headerName: "Total YTD",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant={params.row.category === "All" ? "text_16_semibold" : "text_14_regular"}
                >
                    {isNil(params.row.total)
                        ? "-"
                        : `$${getRoundedOffAndFormattedAmount(params.row.total)}`}
                </Typography>
            ),
        };

        return [categoryColumn, ...getMonthColumns(), totalColumn];
    };

    return (
        <DataGridPro
            disableColumnMenu={false}
            autoHeight={false}
            sx={{ height: "500px" }}
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
            pageSizeOptions={[10, 20, 30]}
            hideToolbar
            rowsPerPageOptions={[10]}
            loading={loading}
        />
    );
}
export default MonthlySpendTable;
