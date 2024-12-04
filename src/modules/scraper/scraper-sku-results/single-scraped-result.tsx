import { Checkbox, TableCell, TableRow, Typography } from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import AppTheme from "../../../styles/theme";
import { RenderTableCell } from "../../package-manager/common/helper";
import { handleProductSelect } from "./common/helper";

interface ISingleScrapedResults {
    skuRows: { length: number; filter: Function; map: Function };
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
    sku: any;
    onChange: Function;
    tableCellStyle: React.CSSProperties;
    checkBoxStyle: React.CSSProperties;
    handleClick: Function;
    anchorEl?: {
        id: number;
        value: null | HTMLElement;
    };
    setAnchorEl: React.Dispatch<
        React.SetStateAction<{
            id: number;
            value: null | HTMLElement;
        }>
    >;
    imageStyle?: React.CSSProperties;
    columns: any[];
    categoriesInfo: any;
}

const SingleScrapedResult = (props: ISingleScrapedResults) => {
    //Initilization
    const not_implemented = ["not_implemented", "failed"].includes(props?.sku?.status);

    //States
    const [showMore, setShowMore] = useState(false);
    const [inputs, setInputs] = useState({
        model_number: "",
        subcategory: "",
        manufacturer_name: "",
        supplier: "",
        item_number: "",
        style: "",
        finish: "",
        grade: "",
        price: "",
        description: "",
        category: "",
    });

    //Hooks
    useEffect(() => {
        function getInitialVal(item: any, key: string) {
            //@ts-ignore
            return item?.[key] != "" && item?.[key] != null
                ? //@ts-ignore
                  item?.[key]
                : "";
        }
        setInputs({
            model_number: getInitialVal(props?.sku, "model_number"),
            subcategory: getInitialVal(props?.sku, "subcategory"),
            manufacturer_name: getInitialVal(props?.sku, "manufacturer_name"),
            supplier: getInitialVal(props?.sku, "supplier"),
            item_number: getInitialVal(props?.sku, "item_number"),
            style: getInitialVal(props?.sku, "style"),
            finish: getInitialVal(props?.sku, "finish"),
            grade: getInitialVal(props?.sku, "grade"),
            price: getInitialVal(props?.sku, "price"),
            description: getInitialVal(props?.sku, "description"),
            category: getInitialVal(props?.sku, "category"),
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncerFunc = useCallback(
        debounce((skuNumber: string, id: number, key: string, value: string) => {
            let list = [];
            list.push({
                skuNumber: skuNumber,
                id: id,
                key: key,
                value: value,
            });
            props?.onChange(list);
        }, 700),
        [props?.onChange, props?.sku?.skuNumber],
    );

    //Functions
    const onChangeHandler = (attr: string, val: string, id: number) => {
        setInputs({
            ...inputs,
            [attr]: val,
        });
        debouncerFunc(props?.sku?.skuNumber, id, attr, val);
    };

    return (
        <TableRow
            key={props?.sku.id}
            style={{
                backgroundColor:
                    not_implemented || props?.sku?.["subcategory"] === ""
                        ? AppTheme.jobStatus.error.backgroundColor
                        : AppTheme.table.white,
            }}
        >
            <TableCell
                style={{
                    ...props?.tableCellStyle,
                    position: "sticky",
                    left: 0,
                    backgroundColor:
                        not_implemented || props?.sku?.["subcategory"] === ""
                            ? AppTheme.jobStatus.error.backgroundColor
                            : AppTheme.table.white,
                }}
            >
                <Checkbox
                    checked={
                        props?.sku.isSelected ||
                        props?.data?.filter((obj: any) => obj.isSelected).length ===
                            props?.data?.length
                    }
                    onChange={() =>
                        handleProductSelect(
                            props?.tableData,
                            props?.setTableData,
                            props?.sku?.["model_number"],
                            props?.sku?.id,
                        )
                    }
                    sx={props?.checkBoxStyle}
                />
            </TableCell>
            {props?.columns?.map((column: any) => {
                const name = column.name as keyof typeof props.sku;
                const showImage = column.showImage;
                const isShowLess = props?.sku[name]?.length > 20 ? column.isShowLess : false;
                let value =
                    (name === "description" ||
                        name === "price" ||
                        name === "model_number" ||
                        name === "manufacturer_name") &&
                    !showMore &&
                    props?.sku[name]?.length > 20
                        ? props?.sku[name]?.substring(0, 20)
                        : props?.sku[name];
                const isAutoComplete = column.isAutoComplete;
                const options = isAutoComplete ? column.options : [];
                const imageStyle = props?.imageStyle;
                const id = props?.sku.id;
                const anchorEl =
                    id === props?.anchorEl?.id ? props?.anchorEl : { id: null, value: null };
                const handleClick = props?.handleClick;
                const isError =
                    (name === "subcategory" && props?.sku[name] === "") ||
                    (not_implemented && (props?.sku[name] === "" || props?.sku[name] === null));
                const sku = props?.sku;
                const setAnchorEl = props?.setAnchorEl;
                const onChange = props?.onChange;
                const skuNumber = props?.sku?.skuNumber;
                const showPopper = showImage ? true : false;
                const isEditable =
                    name === "price" ||
                    name === "description" ||
                    name === "model_number" ||
                    name === "manufacturer_name"
                        ? true
                        : false;
                value =
                    (name === "price" ||
                        name === "description" ||
                        name === "model_number" ||
                        name === "manufacturer_name") &&
                    value == ""
                        ? "N/A"
                        : value;
                const component = RenderTableCell({
                    value,
                    imageStyle,
                    showImage,
                    isAutoComplete,
                    options,
                    isShowLess,
                    showMore,
                    setShowMore,
                    isError,
                    id,
                    anchorEl,
                    setAnchorEl,
                    handleClick,
                    onChange,
                    onChangeHandler,
                    name,
                    sku,
                    skuNumber,
                    showPopper,
                    isEditable,
                    categoryData: props.categoriesInfo,
                    selectedCategory: props.sku.category || "",
                });
                return (
                    <TableCell style={props?.tableCellStyle} key={column.name + value}>
                        {<Typography color={"textPrimary"}>{component}</Typography>}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};
export default SingleScrapedResult;
