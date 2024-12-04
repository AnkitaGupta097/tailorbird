import { Checkbox, Table, TableBody, TableCell, Typography } from "@mui/material";
import React from "react";
import TableHeader from "./table-header";
import { RenderTableCell } from "./table-data";
import { StyledTableRow } from "./style";
type Order = "asc" | "desc";

interface IBaseTable {
    columns: any[];
    rows: any[];
    isCheckBox: boolean;
    onChangeHandler?: Function;
    [v: string]: any;
}

const BaseTable = ({ columns, rows, isCheckBox, onChangeHandler, ...tableProps }: IBaseTable) => {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<any>("any");
    const [selected, setSelected] = React.useState<readonly number[]>([]);

    //@ts-ignore
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, index: number) => {
        //const selectedIndex = selected.indexOf(name);
        let newSelected: readonly number[] = [];

        if (index === -1) {
            newSelected = newSelected.concat(selected, index);
        } else if (index === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (index === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (index > 0) {
            newSelected = newSelected.concat(selected.slice(0, index), selected.slice(index + 1));
        }

        setSelected(newSelected);
    };

    const isSelected = (index: number) => index !== -1;

    return (
        <Table>
            <TableHeader
                numSelected={selected.length}
                rowCount={rows.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                columns={columns}
                isCheckBox={isCheckBox}
                onSelectAllClick={handleSelectAllClick}
                {...tableProps}
            />
            <TableBody>
                {rows.map((row, index) => {
                    const isItemSelected = isSelected(index);
                    return (
                        <StyledTableRow
                            onClick={(event) => handleClick(event, index)}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                        >
                            <TableCell>
                                {isCheckBox && (
                                    <Checkbox sx={{ color: "#004D71" }} checked={isItemSelected} />
                                )}
                            </TableCell>
                            {columns.map((column: any, index: number) => {
                                const value: string | number | boolean = row?.[column.name];
                                const name: string = row?.[column.label];
                                const showImage: boolean = column.showImage;
                                const isAutoComplete: boolean = column.isAutoComplete;
                                const options: any[] = column.options;
                                const id: number = index;
                                return (
                                    <TableCell key={index}>
                                        <Typography color={"textPrimary"}>
                                            {RenderTableCell({
                                                value,
                                                showImage,
                                                isAutoComplete,
                                                options,
                                                id,
                                                onChangeHandler,
                                                name,
                                            })}
                                        </Typography>
                                    </TableCell>
                                );
                            })}
                        </StyledTableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default BaseTable;
