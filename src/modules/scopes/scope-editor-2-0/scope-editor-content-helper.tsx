/* eslint-disable no-unused-vars */
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useMemo, useRef } from "react";
// import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import {
    Accordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
    Container,
    Grid,
    Select,
    Switch,
    Typography,
    MenuItem,
    styled,
} from "@mui/material";
import BaseAutoComplete from "components/auto-complete";
import { ReactComponent as AddScopeOption } from "assets/icons/rounded-plus.svg";
import DoneIcon from "@mui/icons-material/Done";
import BaseChipButton from "components/chip-button";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import ScopeRules from "utils/scopes.json";
import AddScopeItemToCategory from "./add-scope-item";
import { ConsoleLog } from "@openreplay/tracker/lib/app/messages.gen";
import { isArray } from "lodash";

const StyledAccordion: any = styled(Accordion)<AccordionProps>(() => ({
    border: " 1px solid #BCBCBB",
    borderRadius: "5px",
    background: "#FFFFFF",
    rowGap: "6px",
    display: "grid",
    gridAutoFlow: "row",
    marginLeft: "5px",
    marginBottom: "10px",
    "&.Mui-expanded": {
        marginLeft: "5px",
        // background: "#EEEEEE",
    },

    "&.MuiCollapse-wrapper": {
        marginLeft: "-5px !important",
        background: "#FFFFFF !important",
    },
}));
const StyledSwitch = styled(Switch)(() => ({
    padding: 8,
    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
        borderRadius: 100,
    },

    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        borderRadius: 100,
        backgroundColor: "#DAF3FF !important",
        background: "#DAF3FF !important",
        border: "1px solid #004D71 !important",
        margin: "-1px",
    },
}));
interface IScopeItem {
    [key: string]: any;
}
interface IScopeRules {
    [key: string]: IScopeItem;
}

interface IScopeDefinition {
    scopeItems: any;
    setScopeItems: any;
    isEditFlow?: boolean;
    scopeOptions?: any;
    searchText?: any;
    showAddScope?: boolean;
    updateDependantCatInfo?: any;
    handleAddScopeItem?: any;
    dependantScopeItems?: any;
    scopeData?: any;
    isFromInventory?: any;
}

const ActionsInAccordionSummary = ({
    scopeItems,
    setScopeItems,
    scopeOptions,
    searchText,
    showAddScope,
    updateDependantCatInfo,
    handleAddScopeItem,
    dependantScopeItems,
    scopeData,
    isFromInventory,
}: IScopeDefinition) => {
    const [expanded, setExpanded] = React.useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded((state: any) => {
            if (isExpanded) {
                return [...state, panel];
            } else {
                return state.filter((item: any) => item != panel);
            }
        });
    };
    const handleAddScope = (index: any, scopeItemIndex: any) => {
        let scopeItesCopy = [...scopeItems];
        scopeItesCopy[index].items[scopeItemIndex].showAddScope = true;
        setScopeItems(scopeItesCopy);
    };
    const handleAddScopeForComponentGroup = (
        index: any,
        scopeItemIndex: any,
        componentName: any,
        componentScopeIndex: any,
    ) => {
        let scopeItesCopy = [...scopeItems];
        scopeItesCopy[index].items[scopeItemIndex][`${componentName}`][
            componentScopeIndex
        ].showAddScope = true;

        setScopeItems(scopeItesCopy);
    };
    const closeAddScopeCardForComponentGroup = (
        index: any,
        scopeItemIndex: any,
        componentName: any,
        componentScopeIndex: any,
    ) => {
        let scopeItesCopy = [...scopeItems];
        scopeItesCopy[index].items[scopeItemIndex][`${componentName}`][
            componentScopeIndex
        ].showAddScope = false;

        setScopeItems(scopeItesCopy);
    };
    const closeAddScopeCard = (index: any, scopeItemIndex: any) => {
        let scopeItesCopy = [...scopeItems];
        scopeItesCopy[index].items[scopeItemIndex].showAddScope = false;
        setScopeItems(scopeItesCopy);
    };

    const ScopeRulesNew: IScopeRules = ScopeRules;

    //commented this block to be checked with @ehthesam about the newly added block of code

    // const getIsDisabled = (
    //     option: { name: any },
    //     scopeItems: { [x: string]: { items: { [x: string]: { scopes: any[] } } } },
    //     index: string | number,
    //     scopeItemIndex: string | number,
    //     scopeIndex: string | number, // Inner scope option index
    // ): boolean => {
    //     let parentScope: any[] = [];
    //     Object.keys(ScopeRulesNew).map((key: any) => {
    //         if (key == option.name) {
    //             parentScope = ScopeRulesNew[key].parent_scope;
    //         }
    //     });
    //     let isParentSelected = true;

    //     let selectedItems = 0;
    //     scopeItems[index].items[scopeItemIndex].scopes.filter((scope: any, index: number) => {
    //         if (parentScope.includes(scope.name)) {
    //             isParentSelected = scope.isSelected;
    //         }

    //         scope.isSelected && selectedItems++;
    //     });

    //     if (parentScope.length > 0) return isParentSelected;
    //     else {
    //         if (selectedItems == 0) return true;
    //         else {
    //             return scopeItems[index].items[scopeItemIndex].scopes[scopeIndex as any]
    //                 ?.isSelected;
    //         }
    //     }
    // };

    const getIsDisabled = (
        option: { name: any; isSelected: boolean },
        index: string | number,
        scopeItemIndex: string | number,
    ) => {
        let parentScope: any[] = [];
        Object.keys(ScopeRulesNew).map((key: any) => {
            if (key == option.name) {
                parentScope = ScopeRulesNew[key].parent_scope;
            }
        });
        let isParentSelected = true;
        scopeItems[index].items[scopeItemIndex].scopes.filter((scope: any, index: number) => {
            if (parentScope.includes(scope.name) && !option?.isSelected) {
                isParentSelected = scope.isSelected;
            }
        });
        return isParentSelected;
    };

    const checkDisableStatus = (
        option: any,
        scopeItems: any,
        index: any,
        scopeItemIndex: any,
        componentName: any,
        componentScopeIndex: any,
    ) => {
        let parentScope: any[] = [];
        Object.keys(ScopeRulesNew).map((key: any) => {
            if (key == option.name) {
                parentScope = ScopeRulesNew[key].parent_scope;
            }
        });
        let isParentSelected = true;

        scopeItems[index].items[scopeItemIndex][`${componentName}`][
            componentScopeIndex
        ].scopes.filter((scope: any, index: number) => {
            if (parentScope.includes(scope.name)) {
                isParentSelected = scope.isSelected;
            }
        });
        return isParentSelected;
    };
    // const customSelectionCategories = ["Kitchen & Bath Finishes"];

    const customSelectionCategories = useMemo(() => {
        const categories: any[] = [];
        dependantScopeItems.forEach((item: any) => {
            if (!categories.includes(item.category)) {
                categories.push(item.category);
            }
        });
        return categories;
    }, [dependantScopeItems]);
    return (
        <div style={{ width: "100%" }}>
            {scopeItems?.map((scopeItem: any, index: number) => {
                let isExpanded = expanded.includes(`${scopeItem.name}-${index}`);
                return (
                    <StyledAccordion
                        key={`${scopeItem.name}-${index}`}
                        onChange={handleChange(`${scopeItem.name}-${index}`)}
                        expanded={isExpanded}
                        defaultExpanded={searchText != ""}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-label={`${scopeItem.name}-${index}-expand`}
                            aria-controls={`${scopeItem.name}-${index}-content`}
                            id={`${scopeItem.name}-${index}-header`}
                            sx={{
                                background: isExpanded ? "#EEEEEE" : "#FFFF",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flex: 1,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        flex: 1,
                                    }}
                                >
                                    <img
                                        src={getCategoryIcon(scopeItem.name)}
                                        width={20}
                                        height={20}
                                        alt={`${scopeItem.name} icon`}
                                        className="Scope-table-reno-category-image"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <Typography variant="text_14_semibold">
                                        {scopeItem.name}
                                    </Typography>
                                </div>
                                {isExpanded && (
                                    <Container
                                        onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
                                        sx={{
                                            maxWidth: "30rem",
                                            width: "20rem",
                                            marginLeft: "auto",
                                            marginRight: "1rem",
                                        }}
                                    >
                                        <Select
                                            displayEmpty
                                            size="small"
                                            renderValue={(selected: any) => {
                                                if (!selected) {
                                                    return "Bulk Edit";
                                                }
                                                return selected;
                                            }}
                                            key={`select-${scopeItem.name}`}
                                            onChange={(event: any) => {
                                                let newValue = event.target?.value ?? null;
                                                // Do Nothing if the Autocomplete value is null or undefined or empty
                                                if (!newValue || newValue === "") {
                                                    return newValue;
                                                }
                                                // To Change the selected Values from these 2 categories as they are booleans
                                                if (
                                                    scopeItem.name == "General Conditions" ||
                                                    scopeItem.name == "Profit & Overhead"
                                                ) {
                                                    let val =
                                                        "Select all" === newValue ? true : false;
                                                    const newScopeItems = [...scopeItems];

                                                    newScopeItems[index] = {
                                                        ...scopeItem,
                                                        items:
                                                            Array.isArray(scopeItem.items) &&
                                                            scopeItem.items
                                                                .filter(
                                                                    (item: any) =>
                                                                        Object.keys(item).length >
                                                                        0,
                                                                )
                                                                .map((item: any) => ({
                                                                    ...item,
                                                                    isSelected: val,
                                                                    scopes:
                                                                        Array.isArray(
                                                                            item.scopes,
                                                                        ) &&
                                                                        item.scopes.map(
                                                                            (scope: any) => ({
                                                                                ...scope,
                                                                                isSelected: val,
                                                                            }),
                                                                        ),
                                                                })),
                                                    };
                                                    setScopeItems([...newScopeItems]);
                                                } else {
                                                    // For all other categories we change the scopes
                                                    let isSelected = true;
                                                    scopeItems[index].items.map((item: any) => {
                                                        if (
                                                            ["name", "component", "scopes"].every(
                                                                (scopeKey) =>
                                                                    Object.keys(item).includes(
                                                                        scopeKey,
                                                                    ),
                                                            )
                                                        ) {
                                                            item.isSelected = isSelected;
                                                        }
                                                        return item;
                                                    });
                                                    // to check if there is any child scope >> if any we need to select the child scopes automatically
                                                    let childScopeData: any[] = [];
                                                    Object.keys(ScopeRulesNew).map((key: any) => {
                                                        if ((newValue as string).includes(key)) {
                                                            childScopeData =
                                                                ScopeRulesNew[key].child_scope;
                                                        }
                                                    });
                                                    // Array to store all the changed scopes
                                                    let newScopes: Array<Array<any>> = [];
                                                    let groupedComp: any = {};
                                                    // For Each item , we modify the scope according to the value selected
                                                    scopeItems[index].items.forEach((item: any) => {
                                                        let scopes: any[] = [];
                                                        if (
                                                            ["name", "component", "scopes"].every(
                                                                (scopeKey) =>
                                                                    Object.keys(item).includes(
                                                                        scopeKey,
                                                                    ),
                                                            )
                                                        ) {
                                                            scopes = item.scopes.map(
                                                                (scope: any, index: number) => {
                                                                    if (
                                                                        (
                                                                            newValue as string
                                                                        ).includes(scope.name) ||
                                                                        childScopeData.includes(
                                                                            scope.name,
                                                                        )
                                                                    ) {
                                                                        return {
                                                                            ...scope,
                                                                            isSelected: isSelected,
                                                                        };
                                                                    } else {
                                                                        return {
                                                                            ...scope,
                                                                            isSelected: !isSelected,
                                                                        };
                                                                    }
                                                                },
                                                            );
                                                            newScopes.push(scopes);
                                                        } else {
                                                            Object.keys(item).map(
                                                                (
                                                                    compKey: any,
                                                                    compKeyIndex: any,
                                                                ) => {
                                                                    groupedComp[compKey] = item[
                                                                        `${compKey}`
                                                                    ].map(
                                                                        (
                                                                            groupedItem: any,
                                                                            groupedItemIndex: any,
                                                                        ) => {
                                                                            let updatedComponentGrpScopes =
                                                                                groupedItem.scopes.map(
                                                                                    (
                                                                                        scope: any,
                                                                                        index: number,
                                                                                    ) => {
                                                                                        if (
                                                                                            (
                                                                                                newValue as string
                                                                                            ).includes(
                                                                                                scope.name,
                                                                                            ) ||
                                                                                            childScopeData.includes(
                                                                                                scope.name,
                                                                                            )
                                                                                        ) {
                                                                                            return {
                                                                                                ...scope,
                                                                                                isSelected:
                                                                                                    isSelected,
                                                                                            };
                                                                                        } else {
                                                                                            return {
                                                                                                ...scope,
                                                                                                isSelected:
                                                                                                    !isSelected,
                                                                                            };
                                                                                        }
                                                                                    },
                                                                                );
                                                                            return {
                                                                                ...groupedItem,
                                                                                isSelected:
                                                                                    updatedComponentGrpScopes?.some(
                                                                                        (it: any) =>
                                                                                            it.isSelected,
                                                                                    ),
                                                                                scopes: updatedComponentGrpScopes,
                                                                            };
                                                                        },
                                                                    );
                                                                },
                                                            );
                                                            newScopes.push(groupedComp);
                                                        }
                                                    });
                                                    // Changing Scopes to these modified scopes
                                                    let copy = scopeItems[index].items.map(
                                                        (item: any, newindex: number) => {
                                                            return [
                                                                "name",
                                                                "component",
                                                                "scopes",
                                                            ].every((scopeKey) =>
                                                                Object.keys(item).includes(
                                                                    scopeKey,
                                                                ),
                                                            )
                                                                ? (item.scopes =
                                                                      newScopes[newindex])
                                                                : (scopeItems[index].items[
                                                                      newindex
                                                                  ] = groupedComp);
                                                        },
                                                    );
                                                    setScopeItems([...scopeItems]);
                                                    if (
                                                        customSelectionCategories.includes(
                                                            scopeItem.name,
                                                        ) &&
                                                        (newValue ==
                                                            "Demo Existing & Install New" ||
                                                            newValue == "Refinish Existing")
                                                    ) {
                                                        updateDependantCatInfo(
                                                            newValue ==
                                                                "Demo Existing & Install New"
                                                                ? "Install New"
                                                                : newValue,

                                                            scopeItem.name,
                                                        );
                                                    }
                                                }
                                            }}
                                            fullWidth
                                            sx={{
                                                ".MuiSelect-select": {
                                                    backgroundColor: "#FFF",
                                                },
                                                // Apply this to textfield
                                            }}
                                        >
                                            <MenuItem disabled value="">
                                                Bulk Edit
                                            </MenuItem>
                                            {scopeItem.name == "General Conditions" ||
                                            scopeItem.name == "Profit & Overhead"
                                                ? ["Select all", "Unselect all"].map(
                                                      (option, index) => (
                                                          <MenuItem
                                                              key={`${option}-${scopeItem.name}`}
                                                              value={option}
                                                          >
                                                              {option}
                                                          </MenuItem>
                                                      ),
                                                  )
                                                : [
                                                      "Demo Existing & Install New",
                                                      "Remove and Store & Reinstall Existing",
                                                      "Repair Existing",
                                                      "Refinish Existing",
                                                      "Add New",
                                                  ].map((option, index) => (
                                                      <MenuItem
                                                          key={`${option}-${scopeItem.name}`}
                                                          value={option}
                                                      >
                                                          {option}
                                                      </MenuItem>
                                                  ))}
                                        </Select>
                                    </Container>
                                )}
                            </div>
                        </AccordionSummary>
                        {scopeItem?.items?.map((scope: any, scopeItemIndex: number) => {
                            return ["name", "component", "scopes"].every((item) =>
                                Object.keys(scope).includes(item),
                            ) == false ? (
                                Object.keys(scope).map((componentName: any, keyindex: any) => {
                                    let isExpandedGroup = expanded.includes(
                                        `${componentName}-${keyindex}`,
                                    );
                                    return (
                                        <StyledAccordion
                                            key={`${componentName}-${keyindex}`}
                                            onChange={handleChange(`${componentName}-${keyindex}`)}
                                            expanded={isExpandedGroup}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-label={`${componentName}-${keyindex}-expand`}
                                                aria-controls={`${componentName}-${keyindex}-content`}
                                                id={`${componentName}-${keyindex}-header`}
                                                sx={{
                                                    background: isExpanded ? "#EEEEEE" : "#FFFF",
                                                }}
                                            >
                                                <Typography variant="text_14_semibold">
                                                    {componentName}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails
                                                id={`${componentName}-${keyindex}-detail`}
                                                key={`scope-component-${componentName}-${keyindex}`}
                                            >
                                                {componentName &&
                                                    scope[componentName] &&
                                                    Array.isArray(scope[componentName]) &&
                                                    scope[componentName]?.map(
                                                        (
                                                            componentScope: any,
                                                            componentScopeIndex: number,
                                                        ) => {
                                                            return (
                                                                <>
                                                                    <Grid
                                                                        key={`${componentName}-${componentScope.name}-${componentScopeIndex}`}
                                                                        display={"flex"}
                                                                        flexDirection={"row"}
                                                                        justifyContent={
                                                                            "space-between"
                                                                        }
                                                                        sx={{
                                                                            backgroundColor: `${
                                                                                scopeItemIndex %
                                                                                    2 ==
                                                                                0
                                                                                    ? "#FAFAFB"
                                                                                    : "#FFFF"
                                                                            }`,
                                                                        }}
                                                                        columnGap="10px"
                                                                        alignItems={"center"}
                                                                        padding={"15px 0px"}
                                                                        className={`${
                                                                            searchText != "" &&
                                                                            scope?.name
                                                                                ?.toLowerCase()
                                                                                ?.includes(
                                                                                    searchText?.toLowerCase(),
                                                                                )
                                                                                ? "highlight-blue"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <Grid
                                                                            wrap="nowrap"
                                                                            paddingLeft={"8px"}
                                                                            display="flex"
                                                                            flex={"0.25"}
                                                                        >
                                                                            <Typography variant="text_14_regular">
                                                                                {
                                                                                    componentScope?.name
                                                                                }
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid
                                                                            display={"grid"}
                                                                            gridAutoFlow="column"
                                                                            columnGap={"15px"}
                                                                            justifyContent="space-between"
                                                                            alignItems={"center"}
                                                                            gridTemplateColumns={
                                                                                "repeat(auto-fit, minmax(auto, 1fr))"
                                                                            }
                                                                            gap={"10px"}
                                                                            flex={"0.75"}
                                                                        >
                                                                            <Grid
                                                                                display={"grid"}
                                                                                justifyContent={
                                                                                    "space-between"
                                                                                }
                                                                                gridTemplateColumns={
                                                                                    "repeat(4, minmax(auto, 1fr))"
                                                                                }
                                                                                columnGap={"0.5rem"}
                                                                                rowGap={"0.5rem"}
                                                                                alignItems="center"
                                                                            >
                                                                                {componentScope?.scopes?.map(
                                                                                    (
                                                                                        option: any,
                                                                                        itemIndex: number,
                                                                                    ) => {
                                                                                        return (
                                                                                            <BaseChipButton
                                                                                                key={`scope-items-option-${componentScope.name}-${option.name}-${itemIndex}`}
                                                                                                classes={`${
                                                                                                    option.isSelected
                                                                                                        ? "selected"
                                                                                                        : "primary"
                                                                                                }`}
                                                                                                fullWidth
                                                                                                type={
                                                                                                    checkDisableStatus(
                                                                                                        option,
                                                                                                        scopeItems,
                                                                                                        index,
                                                                                                        scopeItemIndex,
                                                                                                        componentName,
                                                                                                        componentScopeIndex,
                                                                                                    )
                                                                                                        ? "default"
                                                                                                        : "disabled"
                                                                                                }
                                                                                                tooltip={
                                                                                                    option.name ==
                                                                                                    "Demo Existing"
                                                                                                        ? "Demolish Existing and Install New both will be activated together."
                                                                                                        : option.name ==
                                                                                                          "Remove and Store"
                                                                                                        ? "Remove and Store and Reinstall Existing both will be activated together."
                                                                                                        : ""
                                                                                                }
                                                                                                onClick={
                                                                                                    checkDisableStatus(
                                                                                                        option,
                                                                                                        scopeItems,
                                                                                                        index,
                                                                                                        scopeItemIndex,
                                                                                                        componentName,
                                                                                                        componentScopeIndex,
                                                                                                    )
                                                                                                        ? () => {
                                                                                                              let isSelected =
                                                                                                                  !option.isSelected;
                                                                                                              scopeItems[
                                                                                                                  index
                                                                                                              ].items[
                                                                                                                  scopeItemIndex
                                                                                                              ][
                                                                                                                  `${componentName}`
                                                                                                              ][
                                                                                                                  componentScopeIndex
                                                                                                              ].isSelected =
                                                                                                                  isSelected;
                                                                                                              // to check if there is any child scope >> if any we need to select the child scopes automatically
                                                                                                              let childScopeData: any[] =
                                                                                                                  [];
                                                                                                              Object.keys(
                                                                                                                  ScopeRulesNew,
                                                                                                              ).map(
                                                                                                                  (
                                                                                                                      key: any,
                                                                                                                  ) => {
                                                                                                                      if (
                                                                                                                          key ==
                                                                                                                          option.name
                                                                                                                      ) {
                                                                                                                          childScopeData =
                                                                                                                              ScopeRulesNew[
                                                                                                                                  key
                                                                                                                              ]
                                                                                                                                  .child_scope;
                                                                                                                      }
                                                                                                                  },
                                                                                                              );

                                                                                                              //ends here
                                                                                                              let newScopes: any[] =
                                                                                                                  [];
                                                                                                              newScopes =
                                                                                                                  scopeItems[
                                                                                                                      index
                                                                                                                  ].items[
                                                                                                                      scopeItemIndex
                                                                                                                  ][
                                                                                                                      `${componentName}`
                                                                                                                  ][
                                                                                                                      componentScopeIndex
                                                                                                                  ].scopes.map(
                                                                                                                      (
                                                                                                                          scope: any,
                                                                                                                          index: number,
                                                                                                                      ) => {
                                                                                                                          if (
                                                                                                                              scope.name ==
                                                                                                                                  option.name ||
                                                                                                                              childScopeData.includes(
                                                                                                                                  scope.name,
                                                                                                                              )
                                                                                                                          ) {
                                                                                                                              return {
                                                                                                                                  ...scope,
                                                                                                                                  isSelected:
                                                                                                                                      isSelected,
                                                                                                                              };
                                                                                                                          } else {
                                                                                                                              return {
                                                                                                                                  ...scope,
                                                                                                                              };
                                                                                                                          }
                                                                                                                      },
                                                                                                                  );
                                                                                                              scopeItems[
                                                                                                                  index
                                                                                                              ].items[
                                                                                                                  scopeItemIndex
                                                                                                              ][
                                                                                                                  `${componentName}`
                                                                                                              ][
                                                                                                                  componentScopeIndex
                                                                                                              ].scopes =
                                                                                                                  newScopes;
                                                                                                              console.log(
                                                                                                                  "childScopeData",
                                                                                                                  childScopeData,
                                                                                                                  newScopes,
                                                                                                              );
                                                                                                              setScopeItems(
                                                                                                                  [
                                                                                                                      ...scopeItems,
                                                                                                                  ],
                                                                                                              );

                                                                                                              if (
                                                                                                                  customSelectionCategories.includes(
                                                                                                                      scopeItem.name,
                                                                                                                  ) &&
                                                                                                                  isSelected
                                                                                                              ) {
                                                                                                                  updateDependantCatInfo(
                                                                                                                      option.name ==
                                                                                                                          "Demo Existing"
                                                                                                                          ? "Install New"
                                                                                                                          : option.name,
                                                                                                                      scopeItems[
                                                                                                                          index
                                                                                                                      ]
                                                                                                                          .items[
                                                                                                                          scopeItemIndex
                                                                                                                      ][
                                                                                                                          `${componentName}`
                                                                                                                      ][
                                                                                                                          componentScopeIndex
                                                                                                                      ]
                                                                                                                          .name,
                                                                                                                  );
                                                                                                              }
                                                                                                          }
                                                                                                        : undefined
                                                                                                }
                                                                                                label={
                                                                                                    option.name
                                                                                                }
                                                                                                startIcon={
                                                                                                    option.isSelected ? (
                                                                                                        <DoneIcon />
                                                                                                    ) : (
                                                                                                        <AddIcon />
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        );
                                                                                    },
                                                                                )}
                                                                                <div
                                                                                    style={{
                                                                                        cursor:
                                                                                            componentScope
                                                                                                ?.availableScopesToAdd
                                                                                                ?.length >
                                                                                            0
                                                                                                ? "pointer"
                                                                                                : "not-allowed",
                                                                                    }}
                                                                                >
                                                                                    <AddScopeOption
                                                                                        onClick={() =>
                                                                                            componentScope
                                                                                                ?.availableScopesToAdd
                                                                                                ?.length >
                                                                                            0
                                                                                                ? handleAddScopeForComponentGroup(
                                                                                                      index,
                                                                                                      scopeItemIndex,
                                                                                                      componentName,
                                                                                                      componentScopeIndex,
                                                                                                  )
                                                                                                : undefined
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    {componentScope.showAddScope && (
                                                                        <AddScopeItemToCategory
                                                                            closeAddScopeCard={() =>
                                                                                closeAddScopeCardForComponentGroup(
                                                                                    index,
                                                                                    scopeItemIndex,
                                                                                    componentName,
                                                                                    componentScopeIndex,
                                                                                )
                                                                            }
                                                                            index={index}
                                                                            scopeItemIndex={
                                                                                scopeItemIndex
                                                                            }
                                                                            isFromGroup={true}
                                                                            handleAddScopeItem={
                                                                                handleAddScopeItem
                                                                            }
                                                                            scopeItems={scopeItems}
                                                                            setScopeItems={
                                                                                setScopeItems
                                                                            }
                                                                            scopeItem={
                                                                                componentScope
                                                                            }
                                                                            componentName={
                                                                                componentName
                                                                            }
                                                                            componentScopeIndex={
                                                                                componentScopeIndex
                                                                            }
                                                                            isFromInventory={
                                                                                isFromInventory
                                                                            }
                                                                        />
                                                                    )}
                                                                </>
                                                            );
                                                        },
                                                    )}
                                            </AccordionDetails>
                                        </StyledAccordion>
                                    );
                                })
                            ) : (
                                <AccordionDetails
                                    id={`${scopeItem.name}-${index}-detail`}
                                    key={`scope-items-box-${scope.name}-${scopeItemIndex}`}
                                >
                                    {scopeItem.name == "General Conditions" ||
                                    scopeItem.name == "Profit & Overhead" ? (
                                        scope?.scopes?.map((option: any, itemIndex: number) => {
                                            return (
                                                <Grid
                                                    display={"grid"}
                                                    gridAutoFlow="column"
                                                    justifyContent={"space-between"}
                                                    sx={{
                                                        backgroundColor: `${
                                                            itemIndex % 2 == 0 ? "#FAFAFB" : "#FFFF"
                                                        }`,
                                                    }}
                                                    columnGap="10px"
                                                    alignItems={"center"}
                                                    padding={"15px 0px"}
                                                    className={`${
                                                        searchText != "" &&
                                                        scope?.name
                                                            ?.toLowerCase()
                                                            ?.includes(searchText?.toLowerCase())
                                                            ? "highlight-blue"
                                                            : ""
                                                    }`}
                                                    key={`scope-items-option-${scope.name}-${option.name}-${itemIndex}`}
                                                >
                                                    <div
                                                        style={{
                                                            whiteSpace: "nowrap",
                                                            paddingLeft: "8px",
                                                        }}
                                                    >
                                                        <Typography variant="text_14_regular">
                                                            {scope.name}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <StyledSwitch
                                                            onClick={() => {
                                                                let isSelected = !option.isSelected;
                                                                scopeItems[index].items[
                                                                    scopeItemIndex
                                                                ].isSelected = isSelected;
                                                                // to check if there is any child scope >> if any we need to select the child scopes automatically
                                                                let childScopeData: any[] = [];
                                                                Object.keys(ScopeRulesNew).map(
                                                                    (key: any) => {
                                                                        if (key == option.name) {
                                                                            childScopeData =
                                                                                ScopeRulesNew[key]
                                                                                    .child_scope;
                                                                        }
                                                                    },
                                                                );

                                                                let newScopes = [];

                                                                newScopes = scopeItems[index].items[
                                                                    scopeItemIndex
                                                                ].scopes.map(
                                                                    (scope: any, index: number) => {
                                                                        if (
                                                                            scope.name ==
                                                                                option.name ||
                                                                            childScopeData.includes(
                                                                                scope.name,
                                                                            )
                                                                        ) {
                                                                            return {
                                                                                ...scope,
                                                                                isSelected:
                                                                                    isSelected,
                                                                            };
                                                                        } else {
                                                                            return {
                                                                                ...scope,
                                                                            };
                                                                        }
                                                                    },
                                                                );
                                                                //ends here
                                                                scopeItems[index].items[
                                                                    scopeItemIndex
                                                                ].scopes = newScopes;
                                                                setScopeItems([...scopeItems]);
                                                            }}
                                                            checked={option.isSelected}
                                                        />
                                                    </div>
                                                </Grid>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <Grid
                                                display={"flex"}
                                                flexDirection={"row"}
                                                justifyContent={"space-between"}
                                                sx={{
                                                    backgroundColor: `${
                                                        scopeItemIndex % 2 == 0
                                                            ? "#FAFAFB"
                                                            : "#FFFF"
                                                    }`,
                                                }}
                                                columnGap="10px"
                                                alignItems={"center"}
                                                padding={"15px 0px"}
                                                className={`${
                                                    searchText != "" &&
                                                    scope?.name
                                                        ?.toLowerCase()
                                                        ?.includes(searchText?.toLowerCase())
                                                        ? "highlight-blue"
                                                        : ""
                                                }`}
                                            >
                                                <Grid
                                                    wrap="nowrap"
                                                    paddingLeft={"8px"}
                                                    display="flex"
                                                    flex={"0.25"}
                                                >
                                                    <Typography variant="text_14_regular">
                                                        {scope?.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    display={"grid"}
                                                    gridAutoFlow="column"
                                                    columnGap={"15px"}
                                                    justifyContent="space-between"
                                                    alignItems={"center"}
                                                    gridTemplateColumns={
                                                        "repeat(auto-fit, minmax(auto, 1fr))"
                                                    }
                                                    gap={"10px"}
                                                    flex={"0.75"}
                                                >
                                                    {/* <Grid
                                                        display={"grid"}
                                                        justifyContent={"space-between"}
                                                        alignItems="center"
                                                        gridAutoFlow={"column"}
                                                        marginRight={"0.3rem"}
                                                    > */}
                                                    <Grid
                                                        display={"grid"}
                                                        justifyContent={"space-between"}
                                                        gridTemplateColumns={"repeat(4, 1fr)"}
                                                        columnGap={"0.5rem"}
                                                        rowGap={"0.5rem"}
                                                        alignItems="center"
                                                    >
                                                        {scope?.scopes?.map(
                                                            (option: any, itemIndex: number) => {
                                                                return (
                                                                    <BaseChipButton
                                                                        key={`scope-items-option-${scope.name}-${option.name}-${itemIndex}`}
                                                                        classes={`${
                                                                            option.isSelected
                                                                                ? "selected"
                                                                                : "primary"
                                                                        }`}
                                                                        fullWidth
                                                                        type={
                                                                            getIsDisabled(
                                                                                option,
                                                                                index,
                                                                                scopeItemIndex,
                                                                            )
                                                                                ? "default"
                                                                                : "disabled"
                                                                        }
                                                                        tooltip={
                                                                            option.name ==
                                                                            "Demo Existing"
                                                                                ? "Demolish Existing and Install New both will be activated together."
                                                                                : option.name ==
                                                                                  "Remove and Store"
                                                                                ? "Remove and Store and Reinstall Existing both will be activated together."
                                                                                : ""
                                                                        }
                                                                        onClick={
                                                                            getIsDisabled(
                                                                                option,
                                                                                index,
                                                                                scopeItemIndex,
                                                                            )
                                                                                ? () => {
                                                                                      let isSelected =
                                                                                          !option.isSelected;
                                                                                      scopeItems[
                                                                                          index
                                                                                      ].items[
                                                                                          scopeItemIndex
                                                                                      ].isSelected =
                                                                                          isSelected;
                                                                                      // to check if there is any child scope >> if any we need to select the child scopes automatically
                                                                                      let childScopeData: any[] =
                                                                                          [];
                                                                                      Object.keys(
                                                                                          ScopeRulesNew,
                                                                                      ).map(
                                                                                          (
                                                                                              key: any,
                                                                                          ) => {
                                                                                              if (
                                                                                                  key ==
                                                                                                      option.name &&
                                                                                                  !option?.isSelected
                                                                                              ) {
                                                                                                  childScopeData =
                                                                                                      ScopeRulesNew[
                                                                                                          key
                                                                                                      ]
                                                                                                          .child_scope;
                                                                                              }
                                                                                          },
                                                                                      );

                                                                                      let newScopes =
                                                                                          [];

                                                                                      newScopes =
                                                                                          scopeItems[
                                                                                              index
                                                                                          ].items[
                                                                                              scopeItemIndex
                                                                                          ].scopes.map(
                                                                                              (
                                                                                                  scope: any,
                                                                                                  index: number,
                                                                                              ) => {
                                                                                                  if (
                                                                                                      scope.name ==
                                                                                                          option.name ||
                                                                                                      childScopeData.includes(
                                                                                                          scope.name,
                                                                                                      )
                                                                                                  ) {
                                                                                                      return {
                                                                                                          ...scope,
                                                                                                          isSelected:
                                                                                                              isSelected,
                                                                                                      };
                                                                                                  } else {
                                                                                                      return {
                                                                                                          ...scope,
                                                                                                      };
                                                                                                  }
                                                                                              },
                                                                                          );
                                                                                      //ends here
                                                                                      scopeItems[
                                                                                          index
                                                                                      ].items[
                                                                                          scopeItemIndex
                                                                                      ].scopes =
                                                                                          newScopes;
                                                                                      setScopeItems(
                                                                                          [
                                                                                              ...scopeItems,
                                                                                          ],
                                                                                      );
                                                                                  }
                                                                                : undefined
                                                                        }
                                                                        label={option.name}
                                                                        startIcon={
                                                                            option.isSelected ? (
                                                                                <DoneIcon />
                                                                            ) : (
                                                                                <AddIcon />
                                                                            )
                                                                        }
                                                                    />
                                                                );
                                                            },
                                                        )}
                                                        {/* add scope option was hidden for container 2.1  */}
                                                        {scopeData.containerVersion != "2.1" && (
                                                            <div
                                                                style={{
                                                                    cursor:
                                                                        scope?.availableScopesToAdd
                                                                            ?.length > 0
                                                                            ? "pointer"
                                                                            : "not-allowed",
                                                                }}
                                                            >
                                                                <AddScopeOption
                                                                    onClick={() =>
                                                                        scope?.availableScopesToAdd
                                                                            ?.length > 0
                                                                            ? handleAddScope(
                                                                                  index,
                                                                                  scopeItemIndex,
                                                                              )
                                                                            : undefined
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </Grid>
                                                    {/* </Grid> */}
                                                </Grid>
                                            </Grid>
                                            {scope.showAddScope && (
                                                <AddScopeItemToCategory
                                                    closeAddScopeCard={() =>
                                                        closeAddScopeCard(index, scopeItemIndex)
                                                    }
                                                    index={index}
                                                    scopeItemIndex={scopeItemIndex}
                                                    isFromGroup={false}
                                                    handleAddScopeItem={handleAddScopeItem}
                                                    scopeItems={scopeItems}
                                                    setScopeItems={setScopeItems}
                                                    scopeItem={scope}
                                                    scopeData={scopeData}
                                                    isFromInventory={isFromInventory}
                                                />
                                            )}
                                        </>
                                    )}
                                </AccordionDetails>
                            );
                        })}
                    </StyledAccordion>
                );
            })}
        </div>
    );
};
export default ActionsInAccordionSummary;
