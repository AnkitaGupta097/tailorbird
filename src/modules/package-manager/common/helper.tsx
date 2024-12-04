import React from "react";
import BaseAutoComplete from "../../../components/base-auto-complete";
import ImagePopper from "../../scraper/scraper-image-popper";
import BaseTextField from "../../../components/base-text-field";
import AppTheme from "../../../styles/theme";
import { Typography, Link, Select, MenuItem, FormControl } from "@mui/material";
import { map, keys } from "lodash";

interface renderTableCellProps {
    value?: string | number | boolean;
    imageStyle?: React.CSSProperties | undefined;
    showImage?: boolean;
    isAutoComplete?: boolean;
    options?: any[];
    isShowLess?: boolean;
    showMore?: boolean;
    setShowMore?: React.Dispatch<React.SetStateAction<boolean>>;
    isError?: boolean;
    id?: number | undefined;
    anchorEl?: {
        id: any;
        value: null | HTMLElement;
    };
    setAnchorEl?: React.Dispatch<
        React.SetStateAction<{
            id: any;
            value: null | HTMLElement;
        }>
    >;
    handleClick?: any;
    onChange?: any;
    onChangeHandler?: any;
    name?: any;
    sku?: any;
    skuNumber?: any;
    showPopper?: boolean;
    isEditable?: boolean;
    categoryData?: any;
    selectedCategory?: any;
}

export const RenderTableCell = ({
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
    onChangeHandler,
    name,
    showPopper,
    isEditable,
    categoryData,
    selectedCategory,
}: renderTableCellProps) => {
    const isMultiLine = isShowLess;
    const autocompleteOptions = options;
    if (!isAutoComplete && !isEditable && !showPopper) {
        return showImage ? (
            <img
                src={`${process.env.PUBLIC_URL}/image-placeholder.png`}
                style={imageStyle}
                alt="placeholder"
            />
        ) : (
            <div>{value}</div>
        );
    }

    if (showPopper) {
        const imageSrc = value || `${process.env.PUBLIC_URL}/image-placeholder.png`;

        return (
            <React.Fragment>
                <ImagePopper
                    value={imageSrc}
                    imageStyle={imageStyle}
                    //@ts-ignore
                    anchorEl={anchorEl}
                    //@ts-ignore
                    setAnchorEl={setAnchorEl}
                    handleClick={handleClick}
                    id={id}
                    onChange={onChangeHandler}
                    alt={value ? undefined : "placeholder"}
                />
            </React.Fragment>
        );
    }

    if (isAutoComplete) {
        if (name === "subcategory" || name === "category") {
            const menuItems =
                name === "subcategory"
                    ? map(categoryData[selectedCategory], (subCategory, index) => (
                          <MenuItem key={index} value={subCategory.subcategory}>
                              {subCategory.subcategory}
                          </MenuItem>
                      ))
                    : keys(categoryData).map((category, index) => (
                          <MenuItem key={index} value={category}>
                              {category}
                          </MenuItem>
                      ));

            return (
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id={`${id}`}
                        displayEmpty
                        fullWidth
                        value={value as string}
                        defaultValue={value as string}
                        onChange={(e) => onChangeHandler(name, e.target.value, id)}
                        placeholder="users"
                        sx={{ height: "44px" }}
                    >
                        <MenuItem value="" style={{ display: "none" }}>
                            <Typography variant="text_14_regular" color={AppTheme.text.medium}>
                                {name === "subcategory" ? "Select Sub-Category" : "Select Category"}
                            </Typography>
                        </MenuItem>
                        {menuItems}
                    </Select>
                </FormControl>
            );
        }

        return (
            <BaseAutoComplete
                value={value === "" || value === null ? "N/A" : value}
                options={autocompleteOptions}
                isError={isError}
                onChangeHandler={onChangeHandler}
                id={id}
                name={name}
                variant="standard"
            />
        );
    }

    if (isEditable) {
        if (
            name === "price" ||
            name === "description" ||
            name === "model_number" ||
            name === "manufacturer_name"
        ) {
            return isMultiLine ? (
                <React.Fragment>
                    <BaseTextField
                        name={name}
                        id={id}
                        variant="standard"
                        multiline={true}
                        value={value}
                        inputProps={{ disableUnderline: true }}
                        onChangeHandler={onChangeHandler}
                    />
                    <Link
                        onClick={() => {
                            if (setShowMore) setShowMore(!showMore);
                        }}
                        underline="none"
                    >
                        <Typography color={AppTheme.jobStatus.success.textColor}>
                            {showMore ? "show less..." : "show more..."}
                        </Typography>
                    </Link>
                </React.Fragment>
            ) : (
                <BaseTextField
                    name={name}
                    id={id}
                    variant="standard"
                    multiline={true}
                    value={value}
                    inputProps={{ disableUnderline: true }}
                    onChangeHandler={onChangeHandler}
                />
            );
        } else {
            return isMultiLine ? (
                <React.Fragment>
                    <BaseTextField
                        name={name}
                        id={id}
                        variant="standard"
                        multiline={true}
                        value={value}
                        inputProps={{ disableUnderline: true }}
                        onChangeHandler={onChangeHandler}
                    />
                    <Link
                        onClick={() => {
                            if (setShowMore) setShowMore(!showMore);
                        }}
                        underline="none"
                    >
                        <Typography color={AppTheme.jobStatus.success.textColor}>
                            {showMore ? "show less..." : "show more..."}
                        </Typography>
                    </Link>
                </React.Fragment>
            ) : (
                <BaseTextField
                    name={name}
                    id={id}
                    variant="standard"
                    multiline={false}
                    value={value}
                    inputProps={{ disableUnderline: true }}
                    onChangeHandler={onChangeHandler}
                />
            );
        }
    }

    const imageSrc = `${value}` || `${process.env.PUBLIC_URL}/image-placeholder.png`;

    return showImage ? (
        <img src={imageSrc} style={imageStyle} alt="productImage" />
    ) : (
        value || "N/A"
    );
};
