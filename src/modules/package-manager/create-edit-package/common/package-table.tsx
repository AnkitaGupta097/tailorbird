import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { IPackageSpaceProps } from "../../interfaces";
import { Icon, CheckedIcon } from "../../common";
import AppTheme from "../../../../styles/theme";
import { RenderTableCell } from "../../common/helper";

const columns = [
    { name: "primary_thumbnail", label: "Image" },
    { name: "category", label: "Category" },
    { name: "subcategory", label: "Sub Category" },
    { name: "manufacturer", label: "Manufacturer" },
    { name: "model_id", label: "Model Number" },
    { name: "suppliers", label: "Supplier" },
    { name: "sku_id", label: "Item Number" },
    { name: "description", label: "Description" },
    { name: "location", label: "Location" },
    { name: "grade", label: "Grade" },
    { name: "style", label: "Style" },
    { name: "finish", label: "Finish" },
];

const tableCellStyle = { fontSize: "0.75rem" };
const tableStyle = {
    maxHeight: "75vh",
    width: "95vw",
    margin: ".5rem 2.5rem .5rem 2.5rem",
    borderRadius: "8px 8px 0px 0px",
    border: "1px solid rgba(0, 0, 0, 0.11)",
};

const PackageTable: React.FC<IPackageSpaceProps> = (props: IPackageSpaceProps) => {
    const imageStyle = {
        height: "2.175rem",
        width: "2.175rem",
        display: "block",
        border: `0.5px solid ${AppTheme.table.border}`,
    };
    const { skuRows, setPackageSelectedCount } = props;
    useEffect(() => {
        setPackageSelectedCount?.(skuRows?.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skuRows.length]);
    return (
        <div>
            <TableContainer
                style={tableStyle}
                sx={{ boxShadow: `-1px -.5px 5px .5px ${AppTheme.background.boxShadow}` }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                style={{
                                    ...tableCellStyle,
                                    position: "sticky",
                                    left: 0,
                                    backgroundColor: AppTheme.table.headerBackground,
                                }}
                            >
                                {props.skuRows.length > 0 && (
                                    <Checkbox
                                        checked={
                                            props?.skuRows?.filter((sku) => sku.selected).length ===
                                            props?.skuRows?.length
                                        }
                                        icon={<Icon />}
                                        onChange={() => {
                                            props.skuRows.filter((sku) => sku.selected).length !==
                                            props.skuRows.length
                                                ? props.onAllRowsSelection(true)
                                                : props.onAllRowsSelection(false);
                                        }}
                                        disableRipple
                                        color="default"
                                        inputProps={{ "aria-label": "decorative checkbox" }}
                                        checkedIcon={<CheckedIcon />}
                                    />
                                )}
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    style={{
                                        ...tableCellStyle,
                                        backgroundColor: AppTheme.table.headerBackground,
                                    }}
                                    key={column.label + column.name}
                                >
                                    <Typography color={"textPrimary"}>{column.label}</Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.skuRows.map((sku, index) => (
                            <TableRow
                                key={sku.material_id || sku.labor_id}
                                style={{
                                    backgroundColor: props?.isSelection
                                        ? sku.material_id
                                            ? AppTheme.table.white
                                            : AppTheme.table.laborRows
                                        : AppTheme.table.white,
                                }}
                            >
                                <TableCell
                                    style={{
                                        ...tableCellStyle,
                                        position: "sticky",
                                        left: 0,
                                        backgroundColor: props?.isSelection
                                            ? sku.material_id
                                                ? AppTheme.table.white
                                                : AppTheme.table.laborRows
                                            : AppTheme.table.white,
                                    }}
                                >
                                    <Checkbox
                                        checked={sku.selected}
                                        onChange={() => {
                                            props.onSelectionChange(index);
                                        }}
                                        disableRipple
                                        icon={<Icon />}
                                        color="default"
                                        checkedIcon={<CheckedIcon />}
                                        inputProps={{ "aria-label": "decorative checkbox" }}
                                    />
                                </TableCell>
                                {columns.map((column) => {
                                    const showImage = column.name === "primary_thumbnail";
                                    const name = column.name as keyof typeof sku;
                                    let value = sku[name as keyof typeof sku];
                                    if (column.name === "suppliers") {
                                        value =
                                            (value as unknown as Array<any>)?.[0]?.supplier_name ??
                                            null;
                                    }
                                    if (column.name === "sku_id") {
                                        value = (sku as any).suppliers?.[0]?.sku_id ?? null;
                                    }
                                    const component = RenderTableCell({
                                        value,
                                        imageStyle,
                                        showImage,
                                    });
                                    return (
                                        <TableCell style={tableCellStyle} key={column.name + value}>
                                            {
                                                <Typography color={"textPrimary"}>
                                                    {component}
                                                </Typography>
                                            }
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                        {skuRows.length === 0 ? (
                            <TableRow>
                                <TableCell>
                                    <Checkbox disabled icon={<Icon />} />
                                </TableCell>
                                {columns.map((column) => {
                                    const showImage = column.name === "primary_thumbnail";
                                    const value = undefined;
                                    const component = RenderTableCell({
                                        value,
                                        imageStyle,
                                        showImage,
                                    });
                                    return (
                                        <TableCell
                                            style={tableCellStyle}
                                            key={`${column.name}-placeholder`}
                                        >
                                            {
                                                <Typography color={"textPrimary"}>
                                                    {component}
                                                </Typography>
                                            }
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PackageTable;
