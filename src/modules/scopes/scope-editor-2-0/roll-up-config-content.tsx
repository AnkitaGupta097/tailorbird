/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Grid, Checkbox, FormControlLabel, Box, Typography } from "@mui/material";
import "../scopes.css";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import BaseTextField from "components/text-field";
import SearchIcon from "@mui/icons-material/Search";
import RollupConfigContentHelper from "./rollup-config-content-helper";
import BaseLoader from "../../../components/base-loading";

import { styled } from "@mui/material/styles";

const StyledGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        "& > *": {
            marginBottom: theme.spacing(2), // Add margin to bottom of each flex item
            "&:last-child": {
                marginBottom: 0, // Remove margin from last flex item
            },
        },
    },
    [theme.breakpoints.up("md")]: {
        flexDirection: "row",
        "& > *": {
            marginBottom: theme.spacing(2), // Add margin to bottom of each flex item
            "&:last-child": {
                marginBottom: 0, // Remove margin from last flex item
            },
        },
    },
}));
const SearchGrid = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        "& > *": {
            marginBottom: theme.spacing(2), // Add margin to bottom of each flex item
        },
    },
}));

interface IRollUpconfigContent {
    rollUpItems: any;
    setRollUpItems: any;
    isEditFlow?: boolean;
    searchText?: any;
    setSearchText?: any;
    hideMargins?: any;
    loadingRollup?: any;
}

const CustomCheckBox = (props: {
    label: string;
    isChecked: boolean;
    // eslint-disable-next-line no-unused-vars
    setValue: (args: boolean) => void;
    sx?: any;
    isCatList?: boolean;
    indeterminate?: any;
}) => {
    const [checked, setChecked] = useState(props.isChecked);
    useEffect(() => {
        setChecked(props.isChecked);
    }, [props.isChecked]);

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={() => props.setValue(!checked)}
                    sx={{ color: "#004D71" }}
                    indeterminate={props.indeterminate}
                />
            }
            label={
                <Typography
                    style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        ...props.sx,
                    }}
                >
                    {props.isCatList && (
                        <img
                            src={getCategoryIcon(props.label)}
                            width={20}
                            height={20}
                            alt={`${props.label} icon`}
                            className="Scope-table-reno-category-image"
                            style={{ marginRight: "1rem" }}
                        />
                    )}
                    {props.label}
                </Typography>
            }
            labelPlacement="end"
        />
    );
};

// eslint-disable-next-line
const RollupConfigContent = ({
    rollUpItems,
    setRollUpItems,
    isEditFlow,
    searchText,
    setSearchText,
    hideMargins,
    loadingRollup,
}: IRollUpconfigContent) => {
    const [showOrHideCategories, setShowOrHideCategories] = useState(true);
    const [indeterminate, setIndeterminate] = useState(false);

    const [subCategoryItems, setSubCategoryItems] = useState([]);

    useEffect(() => {
        onCategorySelection(rollUpItems);
        // adding an intermedinate icon to show/hide all checkbox
        let isIndeterminate = rollUpItems?.some((item: any) => item.isSelected);
        let showAllSelected = rollUpItems?.every((item: any) => item.isSelected);
        setIndeterminate(showAllSelected ? false : isIndeterminate);
        setShowOrHideCategories(showAllSelected);
    }, [rollUpItems]);

    const onShowOrHideCategoriesClick = (isChecked: boolean) => {
        const newRollUpItems = rollUpItems?.map((item: any) => ({
            ...item,
            isSelected: isChecked,
        }));
        setRollUpItems(newRollUpItems);
        onCategorySelection(newRollUpItems);
    };

    const onCategorySelection = (newRollUpItems: any) => {
        const newSubCategoryItems = newRollUpItems?.filter(
            (rollUpItem: any) => rollUpItem.isSelected,
        );
        setSubCategoryItems(newSubCategoryItems);
    };

    return (
        <Box
            component="div"
            style={{
                marginLeft: hideMargins ? "0px" : "38px",
                marginRight: hideMargins ? "0px" : "38px",
                marginTop: "10px",
            }}
        >
            {loadingRollup && <BaseLoader />}
            <Grid container md={12} sm={12} lg={12}>
                <SearchGrid
                    item
                    container
                    // to be enabled with rollup config
                    // sx={{ paddingRight: "10px" }}
                >
                    <CustomCheckBox
                        label="Show / hide all on right"
                        isChecked={showOrHideCategories}
                        setValue={(isChecked: boolean) => {
                            setShowOrHideCategories(isChecked);
                            onShowOrHideCategoriesClick(isChecked);
                        }}
                        indeterminate={indeterminate}
                    />

                    <BaseTextField
                        InputProps={{ endAdornment: <SearchIcon htmlColor="#757575" /> }}
                        variant="outlined"
                        size="small"
                        placeholder={`Search`}
                        onChange={(e: any) => {
                            setSearchText(e.target.value?.toLowerCase());
                        }}
                        value={searchText}
                    />
                </SearchGrid>

                <StyledGrid container marginTop={2} marginBottom={5}>
                    <Grid
                        item
                        md={3}
                        style={{
                            overflowY: "scroll",
                            height: "600px",
                            border: "1px solid #BCBCBB",
                            borderRadius: "5px",
                            overflowX: "hidden",
                        }}
                    >
                        {rollUpItems?.map((item: any, idx: number) => (
                            <Box
                                style={{
                                    backgroundColor: item.isSelected ? "#EEEEEE" : "#FFFFFF",
                                    display: "flex",
                                    alignItems: "center",
                                    paddingLeft: "15px",
                                    height: "50px",
                                    width: "100%",
                                    textAlign: "left",
                                    borderBottom: "1px solid #BCBCBC",
                                }}
                                key={`scope-item-${idx}`}
                            >
                                <CustomCheckBox
                                    label={item.name}
                                    isCatList
                                    isChecked={item.isSelected || false}
                                    setValue={(isSelected) => {
                                        const newrollUpItems = rollUpItems;

                                        newrollUpItems[idx].isSelected = isSelected;
                                        setRollUpItems([...newrollUpItems]);
                                        onCategorySelection(newrollUpItems);
                                    }}
                                    sx={{ color: item.isSelected ? "#000000" : "#C4C4C3" }}
                                />
                            </Box>
                        ))}
                    </Grid>

                    <Grid
                        item
                        md={9}
                        style={{
                            overflowY: "scroll",
                            height: "600px",
                        }}
                    >
                        <RollupConfigContentHelper
                            rollUpItems={subCategoryItems.filter((ite: any) => ite.isSelected)}
                            // setRollUpItems={(newRollupConfigData: any) => {
                            //     let subCategoryIndices: any[] = [];
                            //     let subCategoryIndex = 0;
                            //     let newRollUpItems = rollUpItems;
                            //     newRollUpItems.forEach((rollUpItem: any, idx: number) =>
                            //         subCategoryIndices.push(idx),
                            //     );
                            //     subCategoryIndices.forEach((index: any) => {
                            //         newRollUpItems[index] = newRollupConfigData[subCategoryIndex];
                            //         subCategoryIndex += 1;
                            //     });
                            //     setSubCategoryItems(newRollupConfigData);
                            //     setRollUpItems([...newRollUpItems]);
                            // }}
                            allRollUps={rollUpItems}
                            setRollUpItems={setRollUpItems}
                        />
                    </Grid>
                </StyledGrid>
            </Grid>
        </Box>
    );
};

export default RollupConfigContent;
