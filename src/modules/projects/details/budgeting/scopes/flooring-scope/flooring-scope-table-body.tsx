import { TableCell, TableRow, Typography } from "@mui/material";
import React from "react";
import AppTheme from "../../../../../../styles/theme";
import FlooringScopeSelection from "./flooring-scope-selection";

interface TableBody {
    tableRows: any;
    setTableRows: any;
}

const FlooringScopeTableBody = ({ tableRows, setTableRows }: TableBody) => {
    const updateRowData = (rowIndex: number, cellIndex: number) => {
        tableRows[rowIndex].forEach((cell: Record<string, string>, index: number) => {
            if (index === cellIndex) {
                cell.cellValue = "checked";
            } else if (cell.cellType !== "RoomType" && cell.cellType !== "FloorLevel") {
                cell.cellValue = "unChecked";
            }
        });
        setTableRows([...tableRows]);
    };

    const removeSelection = (rowIndex: number, cellIndex: number) => {
        tableRows[rowIndex].forEach((cell: Record<string, string>, index: number) => {
            if (index === cellIndex) {
                cell.cellValue = "unChecked";
            }
        });
        setTableRows([...tableRows]);
    };

    return (
        <React.Fragment>
            {tableRows.map((row: Record<string, string>[], rowIndex: number) => {
                return (
                    <TableRow key={rowIndex}>
                        {row.map((cell: Record<string, string>, cellIndex: number) => {
                            const tableCellClassName =
                                rowIndex % 2 === 1
                                    ? "Flooring-scope-table-cell row-border-cell"
                                    : "Flooring-scope-table-cell";
                            return cell.cellType !== "RoomType" ? (
                                <TableCell className={tableCellClassName} key={cellIndex}>
                                    {cell.cellType === "FloorLevel" ? (
                                        <Typography
                                            variant="tableHeaderText"
                                            sx={{
                                                fontWeight:
                                                    cell.cellValue === "Ground" ? "400" : "600",
                                                marginLeft: "2rem",
                                            }}
                                        >
                                            {cell.cellValue}
                                        </Typography>
                                    ) : (
                                        <FlooringScopeSelection
                                            isDefault={cell.isDisabled || false}
                                            checked={cell.cellValue === "checked"}
                                            updateRowData={updateRowData.bind(
                                                this,
                                                rowIndex,
                                                cellIndex,
                                            )}
                                            removeSelection={() =>
                                                removeSelection(rowIndex, cellIndex)
                                            }
                                        />
                                    )}
                                </TableCell>
                            ) : (
                                <TableCell
                                    className="Flooring-scope-table-cell row-border-cell room-type"
                                    key={cellIndex}
                                    rowSpan={2}
                                >
                                    <Typography
                                        variant="tableHeaderText"
                                        sx={{
                                            color: AppTheme.palette.primary.main,
                                            marginLeft: "2rem",
                                        }}
                                    >
                                        {cell.cellValue}
                                    </Typography>
                                </TableCell>
                            );
                        })}
                    </TableRow>
                );
            })}
        </React.Fragment>
    );
};

export default React.memo(FlooringScopeTableBody);
