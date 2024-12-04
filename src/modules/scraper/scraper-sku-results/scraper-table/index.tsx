import {
    Checkbox,
    Icon,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RenderTableCell } from "../../../package-manager/common/helper";
import SingleScrapedResult from "../single-scraped-result";
import AppTheme from "../../../../styles/theme";
import { handleProductSelect } from "../common/helper";

const tableCellStyle = { fontSize: "0.75rem" };

const ScraperTable = (props: {
    data: {
        [x: string]: any[];
    }[];
    setData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >;
    tableData: {
        [x: string]: any[];
    }[];
    setTableData: React.Dispatch<
        React.SetStateAction<
            {
                [x: string]: any[];
            }[]
        >
    >;
    skuRows: {
        length: number;
        filter: Function;
        map: Function;
    };
    containerStyle: React.CSSProperties;
    columns: any[];
    imageStyle: React.CSSProperties;
    checkBoxStyle: React.CSSProperties;
    anchorEl: {
        id: number;
        value: null | HTMLElement;
    };
    setAnchorEl: React.Dispatch<
        React.SetStateAction<{
            id: number;
            value: null | HTMLElement;
        }>
    >;
    handleClick: Function;
    onChange: Function;
    handleClickAway: Function;
    categoriesInfo: any;
}) => {
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

    useEffect(() => {
        handleProductSelect(
            props?.tableData,
            props?.setTableData,
            undefined,
            undefined,
            isSelectAll,
        );
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSelectAll]);

    return (
        <React.Fragment>
            <TableContainer component={Paper} sx={props?.containerStyle}>
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
                                            props?.skuRows?.filter((obj: any) => obj.isSelected)
                                                .length === props?.skuRows?.length
                                        }
                                        onChange={() => setIsSelectAll(!isSelectAll)}
                                        onClick={(e) => e.stopPropagation()}
                                        sx={props?.checkBoxStyle}
                                    />
                                )}
                            </TableCell>
                            {props?.columns.map((column) => (
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
                        {props?.skuRows.map((sku: any) => {
                            return (
                                <SingleScrapedResult
                                    skuRows={props?.skuRows}
                                    data={props?.data}
                                    setData={props?.setData}
                                    tableData={props?.tableData}
                                    setTableData={props?.setTableData}
                                    key={sku?.id}
                                    sku={sku}
                                    tableCellStyle={tableCellStyle}
                                    onChange={props?.onChange}
                                    checkBoxStyle={props?.checkBoxStyle}
                                    columns={props?.columns}
                                    imageStyle={props?.imageStyle}
                                    anchorEl={props?.anchorEl}
                                    setAnchorEl={props?.setAnchorEl}
                                    handleClick={props?.handleClick}
                                    categoriesInfo={props.categoriesInfo}
                                />
                            );
                        })}
                        {props?.skuRows.length === 0 ? (
                            <TableRow>
                                <TableCell>
                                    <Checkbox disabled icon={<Icon />} />
                                </TableCell>
                                {props?.columns.map((column) => {
                                    const showImage = column.showImage;
                                    const value = undefined;
                                    const isAutoComplete = false;
                                    const options = isAutoComplete ? column.options : [];
                                    const imageStyle = props?.imageStyle;
                                    const showPopper = showImage ? true : false;
                                    const component = RenderTableCell({
                                        value,
                                        imageStyle,
                                        showImage,
                                        isAutoComplete,
                                        options,
                                        showPopper,
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
        </React.Fragment>
    );
};

export default ScraperTable;
