import { TableRow, TableCell, Typography, Grid, Checkbox } from "@mui/material";
import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { StyledTableHead, StyledTableSortLabel } from "./style";

type Order = "asc" | "desc";

interface IBaseTableHeader {
    columns: any[];
    isCheckBox: boolean;
    orderBy: string;
    order: Order;
    onRequestSort: Function;
    numSelected: number;
    rowCount: number;
    onSelectAllClick: any;
    [v: string]: any;
}

const TableHeader = ({
    columns,
    numSelected,
    rowCount,
    onSelectAllClick,
    isCheckBox,
    orderBy,
    order,
    onRequestSort,
    ...tableHeaderProps
}: IBaseTableHeader) => {
    const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <StyledTableHead {...tableHeaderProps}>
            <TableRow>
                {isCheckBox && (
                    <TableCell>
                        <Checkbox
                            sx={{ color: "#004D71" }}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                "aria-label": "select all desserts",
                            }}
                        />
                    </TableCell>
                )}
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                    >
                        {column.isSort ? (
                            <StyledTableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : "asc"}
                                onClick={createSortHandler(column.id)}
                            >
                                <Typography>{column.label}</Typography>
                            </StyledTableSortLabel>
                        ) : (
                            <Grid container flexDirection={"row"} gap="10px">
                                <Grid item>
                                    <Typography>{column.label}</Typography>
                                </Grid>
                                <Grid item>
                                    {column.isIcon && <ErrorOutlineIcon htmlColor="#004D71" />}
                                </Grid>
                            </Grid>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </StyledTableHead>
    );
};

export default TableHeader;
