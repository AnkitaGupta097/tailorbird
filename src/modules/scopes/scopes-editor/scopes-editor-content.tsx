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
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

interface IScopeDefinition {
    scopeItems: any;
    setScopeItems: any;
    isEditFlow?: boolean;
}

const StyledBox = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "flex-start",
});

const StyledGridBox = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    width: "100%",
});

// const StyledRadioLabel = styled(Typography)(({ active }: { active: boolean }) => ({
//     background: active ? "#004D71" : "#EEEEEE",
//     color: active ? "#FFFFFF" : "#000000",
//     padding: "5px 12px",
//     borderRadius: "50px",
// }));

const StyledRadioLabel = styled(Typography)<TypographyProps>(({ theme }) => ({
    "&.active": {
        background: theme.scopeHeader.radioTextActive,
        color: "#FFFFFF",
        padding: "5px 12px",
        borderRadius: "50px",
    },
    "&.default": {
        background: theme.scopeHeader.radioTextDefault,
        color: "#000000",
        padding: "5px 12px",
        borderRadius: "50px",
    },
}));

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
                    indeterminateIcon={<IndeterminateCheckBoxIcon />}
                />
            }
            label={
                <Typography
                    style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        width: "100%",
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

const CustomRadioGroup = ({
    scopes,
    setRadioSelection,
}: {
    scopes: any;
    setRadioSelection: any;
}) => {
    const selectedScope = scopes.find((scope: any) => scope.isSelected === true);
    const isSelectedScope = selectedScope ? selectedScope.name : "";
    const [selectedValue, setSelectedValue] = useState(isSelectedScope);
    useEffect(() => {
        setSelectedValue(isSelectedScope);
    }, [isSelectedScope]);
    return (
        <RadioGroup
            row
            aria-labelledby="scope-row-radio-buttons-group-label"
            name="scope-row-radio-buttons-group"
            value={selectedValue}
            onChange={(e) => {
                setSelectedValue(e.target.value);
                setRadioSelection(e.target.value);
            }}
        >
            {scopes.map((scope: any, idx: number) => (
                <FormControlLabel
                    value={scope.name}
                    control={<Radio style={{ color: "#004D71" }} />}
                    label={
                        <StyledRadioLabel
                            variant="title2"
                            className={scope.isSelected ? "active" : "default"}
                        >
                            {scope.name}
                        </StyledRadioLabel>
                    }
                    key={idx}
                />
            ))}
        </RadioGroup>
    );
};

const SubCategoryItem = ({
    item,
    itemIndex,
    scopeItemIndex,
    setScopeItems,
    scopeItems,
}: {
    item: any;
    itemIndex: any;
    scopeItemIndex: any;
    setScopeItems: any;
    scopeItems: any;
}) => {
    return Object.keys(item)?.length > 0 && item?.scopes?.length > 0 ? (
        <StyledBox>
            <CustomCheckBox
                label={item.name}
                isChecked={item.isSelected || false}
                setValue={(isSelected) => {
                    scopeItems[scopeItemIndex].items[itemIndex].isSelected = isSelected;
                    let newScopes = [];
                    if (!isSelected) {
                        // when you unselect the sub category checkbox, unselecting corresponding scopes
                        newScopes = scopeItems[scopeItemIndex].items[itemIndex].scopes.map(
                            (scope: any) => ({ ...scope, isSelected }),
                        );
                    } else {
                        newScopes = scopeItems[scopeItemIndex].items[itemIndex].scopes.map(
                            (scope: any, index: number) =>
                                index === 0 ? { ...scope, isSelected } : { ...scope },
                        );
                    }
                    scopeItems[scopeItemIndex].items[itemIndex].scopes = newScopes;
                    setScopeItems([...scopeItems]);
                }}
            />
            <Divider style={{ background: "#C4C4C3", width: "100%" }} />
            <CustomRadioGroup
                scopes={item.scopes}
                setRadioSelection={(scopeName: string) => {
                    const stateCopy = JSON.parse(JSON.stringify(scopeItems));
                    stateCopy[scopeItemIndex].isSelected = true;
                    stateCopy[scopeItemIndex].items[itemIndex].isSelected = true;
                    stateCopy[scopeItemIndex].items[itemIndex].scopes.forEach((scope: any) => {
                        if (scope.name === scopeName) {
                            scope.isSelected = true;
                        } else {
                            scope.isSelected = false;
                        }
                    });

                    setScopeItems(stateCopy);
                }}
            />
        </StyledBox>
    ) : null;
};

const SubCategoryGrid = ({ scopeItems, setScopeItems }: IScopeDefinition) => {
    return (
        <React.Fragment>
            {scopeItems?.map((scopeItem: any, index: number) => (
                <StyledBox
                    style={{ marginTop: "16px", marginLeft: "16px", width: "98%" }}
                    key={`scope-items-box-${index}`}
                >
                    <Typography
                        style={{
                            lineHeight: "14px",
                            letterSpacing: "0.3em",
                            textAlign: "center",
                            color: "#004D71",
                        }}
                        variant="footerTextInter"
                    >
                        {scopeItem?.name.toUpperCase()}
                    </Typography>
                    <Divider style={{ background: "#004D71", width: "100%" }} />
                    <StyledGridBox>
                        {scopeItem?.items.map((item: any, idx: number) => (
                            <SubCategoryItem
                                key={`sub-category-item-${idx}`}
                                item={item}
                                itemIndex={idx}
                                scopeItemIndex={index}
                                scopeItems={scopeItems}
                                setScopeItems={setScopeItems}
                            />
                        ))}
                    </StyledGridBox>
                </StyledBox>
            ))}
        </React.Fragment>
    );
};

// eslint-disable-next-line
const ScopeEditorContent = ({ scopeItems, setScopeItems, isEditFlow }: IScopeDefinition) => {
    const [showOrHideCategories, setShowOrHideCategories] = useState(true);
    const [subCategoryItems, setSubCategoryItems] = useState([]);
    const [indeterminate, setIndeterminate] = useState(false);

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

    return (
        <Box
            component="div"
            style={{
                marginLeft: "38px",
                marginRight: "38px",
                marginTop: "10px",
            }}
        >
            <Grid container>
                <Grid item md={10}>
                    <CustomCheckBox
                        label="Show / hide all on right"
                        isChecked={showOrHideCategories}
                        setValue={(isChecked: boolean) => {
                            setShowOrHideCategories(isChecked);
                            onShowOrHideCategoriesClick(isChecked);
                        }}
                        indeterminate={indeterminate}
                    />
                </Grid>
                <Grid container marginTop={2} marginBottom={5}>
                    <Grid
                        item
                        md={3.9}
                        style={{
                            overflowY: "scroll",
                            height: "600px",
                            border: "1px solid #BCBCBB",
                            borderRadius: "5px",
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
                        md={8}
                        style={{
                            overflowY: "scroll",
                            height: "600px",
                            width: "60%",
                            border: "1px solid #BCBCBB",
                            borderRadius: "5px",
                        }}
                    >
                        <StyledBox>
                            <SubCategoryGrid
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
                                        newScopeItems[index] =
                                            newSubCategoryItems[subCategoryIndex];
                                        subCategoryIndex += 1;
                                    });
                                    setSubCategoryItems(newSubCategoryItems);
                                    setScopeItems([...newScopeItems]);
                                }}
                            />
                        </StyledBox>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ScopeEditorContent;
