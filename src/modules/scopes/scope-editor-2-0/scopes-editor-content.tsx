/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
    Grid,
    Checkbox,
    FormControlLabel,
    Box,
    Typography,
    Radio,
    RadioGroup,
    styled,
    Divider,
    TypographyProps,
} from "@mui/material";
import "../scopes.css";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import BaseTextField from "components/text-field";
import SearchIcon from "@mui/icons-material/Search";
import ActionsInAccordionSummary from "./scope-editor-content-helper";
import { ReactComponent as SettingsIcon } from "assets/icons/cog.svg";

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
            marginBottom: "10px", // Add margin to bottom of each flex item
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

interface IScopeDefinition {
    scopeItems: any;
    setScopeItems: any;
    isEditFlow?: boolean;
    scopeOptions?: any;
    searchText?: any;
    setSearchText?: any;
    hideMargins?: any;
    setOpenRollUpConfig?: any;
    openRollUpConfig?: any;
    showRollupConfig?: boolean;
    showAddScope?: boolean;
    dependantScopeItems?: any;
    handleAddScopeItem?: any;
    scopeData: any;
    isFromInventory: any;
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
const ScopeEditorContent = ({
    scopeItems,
    setScopeItems,
    isEditFlow,
    scopeOptions,
    searchText,
    setSearchText,
    hideMargins,
    setOpenRollUpConfig,
    openRollUpConfig,
    showRollupConfig,
    showAddScope,
    dependantScopeItems,
    handleAddScopeItem,
    scopeData,
    isFromInventory,
}: IScopeDefinition) => {
    const [showOrHideCategories, setShowOrHideCategories] = useState(true);
    const [indeterminate, setIndeterminate] = useState(false);

    const [subCategoryItems, setSubCategoryItems] = useState([]);

    useEffect(() => {
        onCategorySelection(scopeItems);
        // adding an intermedinate icon to show/hide all checkbox
        let isIndeterminate = scopeItems?.some((item: any) => item.isSelected);
        let showAllSelected = scopeItems?.every((item: any) => item.isSelected);
        setIndeterminate(showAllSelected ? false : isIndeterminate);
        setShowOrHideCategories(showAllSelected);
    }, [scopeItems]);

    const onShowOrHideCategoriesClick = (isChecked: boolean) => {
        const newScopeItems = scopeItems.map((scopeItem: any) => ({
            ...scopeItem,
            isSelected: isChecked,
        }));
        setScopeItems(newScopeItems);
        onCategorySelection(newScopeItems);
    };

    const onCategorySelection = (newScopeItems: any) => {
        const newSubCategoryItems = newScopeItems?.filter((scopeItem: any) => scopeItem.isSelected);
        setSubCategoryItems(newSubCategoryItems);
    };

    const updateDependantCatInfo = (option: any, scopeName: any) => {
        let matchedCat = dependantScopeItems.find(
            (item: any) => item.item_name == scopeName && item.scope == option,
        );

        setScopeItems((state: any) => {
            let stateCopy = [...state];
            stateCopy?.map((item: any) => {
                item.items = item?.items?.map((scIt: any) => {
                    if (
                        ["name", "component", "scopes"].every((scopeKey) =>
                            Object.keys(scIt)?.includes(scopeKey),
                        ) == false
                    ) {
                        Object.keys(scIt)?.map((itemKey: any) => {
                            Array.isArray(scIt[itemKey]) &&
                                scIt[itemKey]?.map((itemCpy: any) => {
                                    if (
                                        matchedCat?.dependent_scopes?.findIndex(
                                            (depCat: any) => depCat.item_name == itemCpy.name,
                                        ) > -1
                                    ) {
                                        itemCpy.scopes = itemCpy?.scopes?.map((scItScope: any) => {
                                            if (
                                                matchedCat?.dependent_scopes?.findIndex(
                                                    (depScope: any) =>
                                                        depScope.scope == scItScope.name,
                                                ) > -1
                                            ) {
                                                return { ...scItScope, isSelected: true };
                                            }
                                            return { ...scItScope };
                                        });
                                        return { ...itemCpy, isSelected: true };
                                    }
                                    return { ...itemCpy };
                                });
                        });
                    } else {
                        if (
                            matchedCat?.dependent_scopes?.findIndex(
                                (depCat: any) => depCat.item_name == scIt.name,
                            ) > -1
                        ) {
                            scIt.scopes = scIt?.scopes?.map((scItScope: any) => {
                                if (
                                    matchedCat?.dependent_scopes?.findIndex(
                                        (depScope: any) => depScope.scope == scItScope.name,
                                    ) > -1
                                ) {
                                    return { ...scItScope, isSelected: true };
                                }
                                return { ...scItScope };
                            });
                            return { ...scIt, isSelected: true };
                        }
                    }
                    return { ...scIt };
                });
                return { ...item };
            });

            return stateCopy;
        });
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
            {/* <AddScopeItemToCategory
                open={open}
                setOpen={setOpen}
                addScopeItemFor={addScopeItemFor}
                scopeOptions={scopeOptions}
            /> */}
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
                    <Grid
                        display={"flex"}
                        columnGap={5}
                        justifyContent="space-between"
                        alignItems={"center"}
                    >
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
                        {/* To be completed for Merge configurationn functionality */}
                        {showRollupConfig && (
                            <SettingsIcon
                                onClick={() => setOpenRollUpConfig(!openRollUpConfig)}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </Grid>
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
                        {scopeItems?.map((item: any, idx: number) => (
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
                                        const newScopeItems = scopeItems;

                                        newScopeItems[idx].isSelected = isSelected;
                                        setScopeItems([...newScopeItems]);
                                        onCategorySelection(newScopeItems);
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
                        <ActionsInAccordionSummary
                            scopeOptions={scopeOptions}
                            scopeItems={subCategoryItems}
                            setScopeItems={(newSubCategoryItems: any) => {
                                let subCategoryIndices: any[] = [];
                                let subCategoryIndex = 0;
                                let newScopeItems = scopeItems;
                                newScopeItems.forEach(
                                    (scopeItem: any, idx: number) =>
                                        scopeItem.isSelected && subCategoryIndices.push(idx),
                                );
                                subCategoryIndices.forEach((index: any) => {
                                    newScopeItems[index] = newSubCategoryItems[subCategoryIndex];
                                    subCategoryIndex += 1;
                                });
                                setSubCategoryItems(newSubCategoryItems);
                                setScopeItems([...newScopeItems]);
                            }}
                            searchText={searchText}
                            showAddScope={showAddScope}
                            updateDependantCatInfo={updateDependantCatInfo}
                            handleAddScopeItem={handleAddScopeItem}
                            dependantScopeItems={dependantScopeItems}
                            scopeData={scopeData}
                            isFromInventory={isFromInventory}
                        />
                    </Grid>
                </StyledGrid>
            </Grid>
        </Box>
    );
};

export default ScopeEditorContent;
