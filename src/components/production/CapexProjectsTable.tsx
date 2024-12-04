import { Grid, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import DataGridPro from "components/data-grid-pro";
import {
    GridFilterModel,
    GridFooterContainer,
    GridRenderCellParams,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    useGridApiRef,
    gridFilteredSortedRowIdsSelector,
} from "@mui/x-data-grid-pro";
import { groupBy } from "lodash";
import { getAppropriateDateFormat, getRoundedOffAndFormattedAmount } from "./helper";

interface ICapexProjectsTableProps {
    rows?: any;
}

const CapexProjectsTable: React.FC<ICapexProjectsTableProps> = ({ rows = [] }) => {
    const [, setIsFilteredItems] = useState<any>({});
    // test data
    // const rows = [
    //     {
    //         id: "1234-1",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "1",
    //         project: "Elevated Deck/Waterproofing Repairs",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 35686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 522984.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "1234-2",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "2",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 346.0,
    //         approvalChanges: -22984999.0,
    //         currentBudget: 477016.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "1234-3",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "3",
    //         project: "Elevated Deck/Waterproofing Repairs",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 35686.0,
    //         approvalChanges: -2298004.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "1234-4",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "4",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 34686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-29T00:00:00"),
    //     },
    //     {
    //         id: "1234-5",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "5",
    //         project: "Elevated Deck/Waterproofing Repairs",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 35686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "1234-6",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "6",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 34686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "1234-7",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "7",
    //         project: "Elevated Deck/Waterproofing Repairs",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 35686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "1234-8",
    //         property: "The Hills of Corona",
    //         propertyId: "1234",
    //         projectId: "8",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 346.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "12345-1",
    //         property: "The Hills of Corona 2",
    //         projectId: "1",
    //         propertyId: "12345",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 34686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "12345-2",
    //         property: "The Hills of Corona 2",
    //         projectId: "2",
    //         propertyId: "12345",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "Ankita",
    //         originalBudget: 500000.0,
    //         pendingChanges: 34686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "12345-3",
    //         property: "The Hills of Corona 2",
    //         projectId: "3",
    //         propertyId: "12345",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 34686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    //     {
    //         id: "12345-4",
    //         property: "The Hills of Corona 2",
    //         projectId: "4",
    //         propertyId: "12345",
    //         project: "Elevated Deck/Waterproofing Siteprep",
    //         manager: "Tim",
    //         projectManager: "John",
    //         originalBudget: 500000.0,
    //         pendingChanges: 34686.0,
    //         approvalChanges: 22984.0,
    //         currentBudget: 557670.0,
    //         startDate: new Date("2024-01-20T00:00:00"),
    //         endDate: new Date("2024-01-20T00:00:00"),
    //     },
    // ];

    const columns = [
        {
            field: "propertyName",
            headerName: "Property Name",
            type: "string",
            resizable: false,
            headerAlign: "center",
            align: "center",
            sortable: false,
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const currentModalIds = gridFilteredSortedRowIdsSelector(apiRef);

                const currentRows = rows.filter((row: any) => currentModalIds.includes(row.id));
                const groupedData = groupBy(currentRows, "propertyId");
                console.log(groupedData, "--grouped");
                const isFirstOccurance =
                    groupedData[params.row.propertyId]?.length &&
                    groupedData[params.row.propertyId].findIndex(
                        (data: any) => data.projectId === params.row.projectId,
                    ) == 0;

                return (
                    <Link href="#">
                        <Typography
                            variant="text_14_semibold"
                            className={`capex-property-${params.row.propertyId}`}
                            style={{ display: isFirstOccurance ? "block" : "none" }}
                        >
                            {params.row.property}
                        </Typography>
                    </Link>
                );
            },
        },
        {
            field: "project",
            headerName: "Project",
            resizable: false,
            sortable: false,
            type: "string",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Link href="#">
                    <Typography variant="text_14_semibold">{params.row.project}</Typography>
                </Link>
            ),
        },
        {
            field: "manager",
            headerName: "Asset Manager",
            type: "string",
            resizable: false,
            sortable: false,
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row.manager}</Typography>
            ),
        },
        {
            field: "projectManager",
            headerName: "Project Manager",
            type: "string",
            resizable: false,
            sortable: false,
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row.projectManager}</Typography>
            ),
        },
        {
            field: "originalBudget",
            headerName: "Original Budget",
            headerAlign: "center",
            sortable: false,
            align: "center",
            type: "number",
            resizable: false,
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{`$${getRoundedOffAndFormattedAmount(
                    params.row.originalBudget || 0,
                )}`}</Typography>
            ),
        },
        {
            field: "pendingChanges",
            headerName: "Pending Changes",
            type: "number",
            resizable: false,
            sortable: false,
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="text_14_regular"
                    color={params.row.pendingChanges > 0 ? "red" : "green"}
                >{`$${getRoundedOffAndFormattedAmount(
                    Math.abs(params.row.pendingChanges || 0),
                )}`}</Typography>
            ),
        },
        {
            field: "approvalChanges",
            headerName: "Approved Changes",
            headerAlign: "center",
            resizable: false,
            type: "number",
            sortable: false,
            align: "center",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="text_14_regular"
                    color={params.row.approvalChanges > 0 ? "red" : "green"}
                >{`$${getRoundedOffAndFormattedAmount(
                    Math.abs(params.row.approvalChanges || 0),
                )}`}</Typography>
            ),
        },
        {
            field: "currentBudget",
            headerName: "Current Budget",
            type: "number",
            flex: 1,
            resizable: false,
            sortable: false,
            headerAlign: "center",
            align: "center",
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant="text_14_regular"
                    color={params.row.currentBudget > params.row.originalBudget ? "red" : "green"}
                >{`$${getRoundedOffAndFormattedAmount(params.row.currentBudget || 0)}`}</Typography>
            ),
        },
        {
            field: "startDate",
            headerName: "Est Start Date",
            headerAlign: "center",
            resizable: false,
            sortable: false,
            type: "date",
            align: "center",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {getAppropriateDateFormat(params.row.startDate)}
                </Typography>
            ),
        },
        {
            field: "endDate",
            headerName: "Est End Date",
            resizable: false,
            sortable: false,
            type: "date",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">
                    {getAppropriateDateFormat(params.row.endDate)}
                </Typography>
            ),
        },
    ];

    const apiRef = useGridApiRef();

    const getTotalsTextColor = (
        columnKey: string,
        total: number,
        totalOriginalBudget: number,
    ): string => {
        let textColor = "";
        if (columnKey === "originalBudget") {
            textColor = "black";
        } else if (columnKey === "currentBudget") {
            textColor = total > totalOriginalBudget ? "red" : "green";
        } else {
            textColor = total > 0 ? "red" : "green";
        }
        return textColor;
    };

    const getFooterData = (columnKey: string, rows: any) => {
        let totalOriginalBudget = 0;

        switch (columnKey) {
            case "propertyName":
            case "scope":
            case "manager":
            case "startDate":
            case "endDate": {
                return <></>;
            }
            case "projectManager":
                return <Typography variant="text_14_semibold">Totals</Typography>;
            case "originalBudget":
            case "pendingChanges":
            case "approvalChanges":
            case "currentBudget": {
                const total = rows.reduce(
                    (acc: number, row: any) => acc + (row[columnKey] || 0),
                    0,
                );
                if (columnKey === "originalBudget") {
                    totalOriginalBudget = total;
                }
                return (
                    <Typography
                        variant="text_14_semibold"
                        color={getTotalsTextColor(columnKey, total, totalOriginalBudget)}
                    >{`$${getRoundedOffAndFormattedAmount(Math.abs(total || 0))}`}</Typography>
                );
            }
        }
    };

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <Grid container justifyContent="space-between">
                    <GridToolbarFilterButton />
                    <GridToolbarQuickFilter />
                </Grid>
            </GridToolbarContainer>
        );
    };

    const CustomFooter = () => {
        return (
            <GridFooterContainer>
                <Grid container sx={{ minHeight: "inherit" }}>
                    {columns?.map((column: any) => (
                        <Grid
                            item
                            key={column.field}
                            xs
                            textAlign="center"
                            sx={{
                                "&:not(:last-child)": {
                                    borderRight: "1px solid #8C9196",
                                    margin: "-1px 0 0 -1px",
                                    paddingTop: "20px",
                                },
                            }}
                        >
                            {getFooterData(column.field, rows)}
                        </Grid>
                    ))}
                </Grid>
            </GridFooterContainer>
        );
    };

    const onFilterChange = (modal: GridFilterModel) => {
        console.log(modal.items);
        setIsFilteredItems({ items: modal.items, quickFilters: modal.quickFilterValues });
    };

    return (
        <div style={{ maxHeight: "810px", display: "flex" }}>
            <DataGridPro
                disableColumnMenu
                columns={columns}
                rows={rows}
                disableDensitySelector
                disableColumnSelector
                disableSelectionOnClick
                apiRef={apiRef}
                rowsPerPageOptions={[]}
                filterDebounceMs={300}
                onFilterModelChange={(modal: GridFilterModel) => onFilterChange(modal)}
                getRowHeight={() => "auto"}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                showColumnVerticalBorder
                showCellVerticalBorder
                sx={{
                    ".MuiDataGrid-columnHeader": {
                        "&:not(:last-child)": {
                            borderRight: "1px solid #8C9196",
                        },
                    },
                    ".MuiDataGrid-row .MuiDataGrid-withBorderColor": {
                        "&:not(:last-child)": {
                            borderRight: "1px solid #8C9196",
                        },
                        borderBottom: "1px solid #8C9196",
                        padding: "16px",
                        justifyContent: "center",
                        lineHeight: 1.6,
                    },
                    ".MuiDataGrid-virtualScroller": {
                        overflowY: "auto !important",
                        overflowX: "hidden",
                    },
                    ".MuiDataGrid-toolbarContainer": {
                        paddingBottom: "12px",
                        borderBottom: "1px solid",
                    },
                    ".MuiDataGrid-columnHeaders": {
                        borderBottomWidth: "1px !important",
                    },
                }}
                pagination={false}
                subComponents={{
                    footer: CustomFooter,
                    toolbar: CustomToolbar,
                }}
            ></DataGridPro>
        </div>
    );
};
export default CapexProjectsTable;
