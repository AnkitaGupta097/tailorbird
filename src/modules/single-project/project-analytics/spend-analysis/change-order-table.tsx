import React, { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash";
import { Typography } from "@mui/material";
import BaseChip from "components/chip";
import DataGridPro from "components/data-grid-pro";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { kebabToSentenceCase } from "components/production/approvals/utils";
import HumanReadableDate from "components/human-readable-date";
import { getRoundedOffAndFormattedAmount } from "components/production/helper";

interface IChangeOrderTableProps {
    budgetApprovalsAndChangeOrders: any;
    loading?: boolean;
}

function ChangeOrderTable(props: IChangeOrderTableProps) {
    const [rows, setRows]: any[] = useState([]);
    const { budgetApprovalsAndChangeOrders, loading } = props;

    useEffect(() => {
        setRows(
            budgetApprovalsAndChangeOrders?.map((item: any, index: number) => ({
                id: index,
                type: item.type,
                amount: item.amount,
                submittedBy: item.requestor?.name,
                approvalDate: item.reviewed_at,
                approvalBy: item.requestee?.name,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgetApprovalsAndChangeOrders]);

    const renovationProgressColumns: any = useMemo(
        () => [
            {
                field: "type",
                headerName: "Type",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <BaseChip
                        label={kebabToSentenceCase(params.row.type)}
                        sx={{ borderRadius: "4px" }}
                        borderColor="#0088C7"
                        textColor="#0088C7"
                        variant="outlined"
                        bgcolor=""
                    />
                ),
            },
            {
                field: "amount",
                headerName: "Amount",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="valueText">
                        {isNil(params.row.amount)
                            ? "-"
                            : `$${getRoundedOffAndFormattedAmount(params.row.amount)}`}
                    </Typography>
                ),
            },

            {
                field: "submissionDate",
                headerName: "Submission Date",
                type: "string",
                flex: 1,
                headerAlign: "left",
                align: "left",
                // eslint-disable-next-line no-unused-vars
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">-</Typography>
                ),
            },

            {
                field: "submittedBy",
                headerName: "Submitted By",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.submittedBy ?? "-- --"}
                    </Typography>
                ),
            },
            {
                field: "approvalDate",
                headerName: "Approval Date",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.approvalDate ? (
                            <HumanReadableDate dateString={params.row.approvalDate} />
                        ) : (
                            "--/--/----"
                        )}
                    </Typography>
                ),
            },
            {
                field: "approvalBy",
                headerName: "Approval By",
                type: "string",
                headerAlign: "left",
                align: "left",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.approvalBy ?? "-- --"}
                    </Typography>
                ),
            },
        ], //eslint-disable-next-line
        [],
    );
    return (
        <DataGridPro
            autoHeight={false}
            loading={loading}
            sx={{ height: "500px" }}
            disableColumnMenu={false}
            disableRowSelectionOnClick
            columns={renovationProgressColumns}
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
export default ChangeOrderTable;
