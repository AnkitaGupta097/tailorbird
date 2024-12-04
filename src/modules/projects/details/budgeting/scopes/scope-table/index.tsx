/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import {
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
    ListItemButton,
    List,
    styled,
    GridProps,
    FormControlLabelProps,
    Typography,
    ListItemButtonProps,
    Skeleton,
    IconButton,
    SvgIcon,
} from "@mui/material";
import BaseTextField from "components/text-field";
import SearchIcon from "@mui/icons-material/Search";
import Icon from "assets/icons/icon-exclamation.svg";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import {
    getCatTreeFromRenoItems,
    getOverallWAVG,
    getRenoItemsWithWavgValues,
} from "../base-scope/service";
import RenoTable from "./reno-table";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import RenoDetails from "./reno-details";
import BaseButton from "components/button";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    SCOPE_INVENTORY_DEFINITION_MESSAGE,
    SCOPE_INVENTORY_INCOMPLETE_FILTER_LABEL,
    SCOPE_INVENTORY_PAGINATION_OPTIONS,
    SCOPE_INVENTORY_SHOW_HIDE_BUTTON,
    SCOPE_INVENTORY_TEXT_FIELD_PLACEHOLDER,
    SCOPE_INVENTORY_VARIATION_FILTER_LABEL,
    SCOPE_INVENTORY_WAVG_PRETEXT,
    SCOPE_INVENTORY_INV_WAVG_PRETEXT,
    CATEGORIES_ORDER,
    CATEGORY_INCOMPLETE_TEXT,
} from "../../constants";
import { getCategoryIcon } from "../../category-icons";
import actions from "stores/actions";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { GridArrowUpwardIcon } from "@mui/x-data-grid";
import NewItemList from "./new-item-list";
import { cloneDeep } from "lodash";
interface IScopeTable {
    showScopeTable: boolean;
    setShowScopeTable?: any;
    selectedInventory: any;
    scopeType: string;
    isFlooringScopeDefined?: any;
}

const DefaultScopeSection = styled(Grid)<GridProps>(({ theme }) => ({
    background: theme.palette.secondary.light,
    border: `1px solid ${theme.border.outer}`,
    borderRadius: "5px",
    width: "100%",
    minHeight: "480px",
    marginTop: "20px",
}));

const DefaultTableSection = styled(Grid)<GridProps>(({ theme }) => ({
    margin: "auto",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "18px",
    lineHeight: "23px",
    color: theme.error.scraper,
}));

const CategorySelection = styled(FormControlLabel)<FormControlLabelProps>(() => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginRight: 0,
    "span:last-child": {
        width: "100%",
    },
}));

const ItemListButton = styled(ListItemButton)<ListItemButtonProps>(() => ({
    display: "flex",
    width: "100%",
}));

const NoItemsGrid = styled(Grid)<GridProps>(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "25rem",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
}));

const ItemSelection = styled(FormControlLabel)<FormControlLabelProps>(() => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: "0.45rem",
    "&:not(:last-child)": {
        borderBottom: "1px solid rgba(0 0 0 / 12%)",
    },
    "&>span:last-child": {
        width: "100%",
    },
}));

const ScopeTable = ({
    showScopeTable,
    setShowScopeTable,
    selectedInventory,
    scopeType,
    isFlooringScopeDefined,
}: IScopeTable) => {
    const dispatch = useAppDispatch();
    let {
        renovationItems,
        loading,
        flooringTakeOffs,
        floorPlanData,
        isOneOfEach,
        baseDataForDiff,
        inventoryMixes,
        updatedRenovations,
        comLoading,
        projectDetails,
    } = useAppSelector((state) => ({
        renovationItems: (state.budgeting.details as any)[`${scopeType}`].renovations,
        updatedRenovations: (state.budgeting.details as any)[`${scopeType}`].updatedRenovations,
        loading: (state.budgeting.details as any)[`${scopeType}`].renovations.loading,
        flooringTakeOffs: state.budgeting.details.flooringScope.flooringTakeOffs,
        floorPlanData: state.projectFloorplans.floorplans.data,
        isOneOfEach: state.budgeting.commonEntities.isOneOfEach,
        baseDataForDiff: state.budgeting.details.altScope.baseDataForDiff,
        inventoryMixes: state.projectFloorplans.inventoryMixes.data,
        comLoading: state.budgeting.commonEntities.loading,
        projectDetails: state.projectDetails.data,
    }));

    const [page, setPage] = useState(SCOPE_INVENTORY_PAGINATION_OPTIONS.start);
    const [lastPage, setLastPage] = useState(
        renovationItems.data
            ? Math.ceil(
                  renovationItems.data?.length / SCOPE_INVENTORY_PAGINATION_OPTIONS.itemsPerPage,
              ) - 1
            : 0,
    );

    const [renovationItemsWithWAVG, setRenovationItemsWithWAVG] = useState<any>([]);
    const [renoItems, setRenoItems] = useState<any>([]);
    const [expanded, setExpanded] = useState<string[]>(["panel-0"]);
    const [categoriesData, setCategoriesData] = useState<any>([]);
    const [renoItem, setRenoItem] = useState<any>();
    const [show, setShow] = useState<any>(true);
    // eslint-disable-next-line
    const [pageView, setPageView] = useState<any>(true);
    const [itemsPerPage, setItemsPerPage] = useState<any>(
        SCOPE_INVENTORY_PAGINATION_OPTIONS.itemsPerPage,
    );
    const [showIncomplete, setshowIncomplete] = useState<any>(false);
    const [showVariations, setShowVariations] = useState<any>(false);
    const [search, setSearch] = useState<string>("");
    const [selectedInvTotalWavg, setSelectedInvTotalWavg] = useState(0);
    const [overallWAVG, setOverallWAVG] = useState<any>("");
    const [altScopeDiffWavg, setAltScopeDiffWavg] = useState<any>();
    const [catWavgKey, setCatWavgKey] = useState<any>();
    const [isNewItemSelected, setNewItemSelection] = useState<any>(false);

    useEffect(() => {
        setItemsPerPage(5);
        setRenoItems([]);
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (setShowScopeTable) setShowScopeTable(loading || comLoading ? true : showScopeTable);
    }, [loading, comLoading]);

    useEffect(() => {
        if (renovationItems.data?.length) {
            let renoItemsCopy = cloneDeep(
                getRenoItemsWithWavgValues(
                    renovationItems?.data,
                    inventoryMixes,
                    floorPlanData,
                    scopeType,
                ),
            );
            setRenovationItemsWithWAVG(renoItemsCopy);
        }
    }, [renovationItems.data]);

    useEffect(() => {
        return () => {
            dispatch(
                actions.budgeting.updateRenovationItemsWithSelectionFlag({
                    renoItems: [],
                    scopeType: scopeType,
                }),
            );
        };
    }, []);

    let flooringItems = flooringTakeOffs?.flooringItems.map((fitem: any) => {
        return fitem.toLowerCase();
    });
    useEffect(() => {
        dispatch(actions.budgeting.updateOverallWavg({ overallWavg: overallWAVG }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overallWAVG]);

    useEffect(() => {
        if (renovationItemsWithWAVG?.length) {
            let renoItemsCopy = [...renovationItemsWithWAVG];
            //intially setting selected checkbox data to true here
            renoItemsCopy = renoItemsCopy.map((item: any) => {
                item.isSelected = true;
                return {
                    ...item,
                };
            });
            let filteredrenoitems: any = [];
            if (scopeType === "baseScope" && isFlooringScopeDefined === true) {
                renoItemsCopy.forEach((element: any) => {
                    let name = element?.item?.toLowerCase();
                    if (flooringItems.some((v) => name?.includes(v)) === false) {
                        filteredrenoitems.push(element);
                    }
                });
            } else if (scopeType === "altScope") {
                filteredrenoitems = renoItemsCopy.filter((reno: any) => !reno.inventoryId);
            } else {
                filteredrenoitems = renoItemsCopy;
            }
            const { allRenoWavg, oneOfEachWavg } = getOverallWAVG(filteredrenoitems);
            setOverallWAVG(isOneOfEach ? oneOfEachWavg : allRenoWavg);
            // if the scope is base or flooring the reno items and category selection tree should be shown with respect to selected inventory
            if (scopeType === "baseScope" || scopeType === "flooringScope") {
                filteredrenoitems = filteredrenoitems.filter(
                    (it: any) => it.inventoryId == selectedInventory?.id,
                );
            }
            // checking if we have the data of renotable in redux >> if yes getting selected value and updating back
            if (updatedRenovations?.length > 0) {
                filteredrenoitems = filteredrenoitems.map((item: any) => {
                    let itemFound = updatedRenovations.find((it: any) => it.id == item.id);
                    item.isSelected = itemFound ? itemFound?.isSelected : true;
                    return {
                        ...item,
                    };
                });
            }

            setLastPage(
                filteredrenoitems
                    ? Math.ceil(
                          filteredrenoitems.filter((x: any) => x.isSelected)?.length /
                              SCOPE_INVENTORY_PAGINATION_OPTIONS.itemsPerPage,
                      ) - 1
                    : 0,
            );
            //considering seach value even after any update to the re items
            let searchLC = search.toLocaleLowerCase();
            filteredrenoitems = filteredrenoitems.map((item: any) => {
                if (
                    item.category?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.subcategory?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.scope?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.item?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.description?.toLowerCase()?.includes(`${searchLC}`) == true
                ) {
                    item.showInCatTree = true;
                } else {
                    item.showInCatTree = false;
                }
                return item;
            });
            setRenoItems(filteredrenoitems);
        }
        // eslint-disable-next-line
    }, [
        renovationItemsWithWAVG,
        selectedInventory?.id,
        showIncomplete,
        showVariations,
        search,
        scopeType,
        isFlooringScopeDefined,
        isOneOfEach,
    ]);

    useEffect(() => {
        if (showIncomplete) {
            setRenoItems((state: any) => {
                const stateCopy = cloneDeep(state);
                return stateCopy.map((item: any) => {
                    if (item.workId == null || item.workId == "") {
                        item.showInCatTree = true;
                    } else {
                        item.showInCatTree = false;
                    }
                    return item;
                });
            });
            setPage(0);
        }
    }, [showIncomplete]);

    useEffect(() => {
        if (showVariations) {
            setRenoItems((state: any) => {
                const stateCopy = cloneDeep(state);
                return stateCopy.map((item: any) => {
                    if (
                        item.qualifier &&
                        item.projectCodexIdDerivedFrom &&
                        !item.item.toLowerCase().match("flooring") &&
                        item.location !== item.qualifier
                    ) {
                        item.showInCatTree = true;
                    } else {
                        item.showInCatTree = false;
                    }
                    return item;
                });
            });
            setPage(0);
        }
    }, [showVariations]);

    useEffect(() => {
        let searchLC = search.toLocaleLowerCase();
        setRenoItems((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy = stateCopy.map((item: any) => {
                if (
                    item.category?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.subcategory?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.scope?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.item?.toLowerCase()?.includes(`${searchLC}`) == true ||
                    item.description?.toLowerCase()?.includes(`${searchLC}`) == true
                ) {
                    item.showInCatTree = true;
                } else {
                    item.showInCatTree = false;
                }
                return item;
            });

            return stateCopy;
        });
        setPage(0);
    }, [search]);

    useEffect(() => {
        setLastPage(
            renoItems
                ? Math.ceil(
                      renoItems.filter((x: any) => x.isSelected)?.length /
                          SCOPE_INVENTORY_PAGINATION_OPTIONS.itemsPerPage,
                  ) - 1
                : 0,
        );
        setCategoriesData(getCatTreeFromRenoItems(renoItems, baseDataForDiff, scopeType));

        setCategoriesData((state: any) => {
            let test1 = cloneDeep(state);
            // Sort Items based on Indices on CATEGORIES_ORDER
            (test1 as Array<any>).sort(
                (val1, val2) =>
                    CATEGORIES_ORDER[val1.name as keyof typeof CATEGORIES_ORDER] -
                    CATEGORIES_ORDER[val2.name as keyof typeof CATEGORIES_ORDER],
            );
            return test1;
        });
        //Hide pagination if renoitems are lesser than the items per page
        if (renoItems.filter((i: any) => i.showInCatTree && i.isSelected).length <= itemsPerPage) {
            setPageView(false);
        } else {
            setPageView(true);
        }
        // storing the table reno items data to redux to have snapshot
        dispatch(
            actions.budgeting.updateRenovationItemsWithSelectionFlag({
                renoItems: renoItems,
                scopeType: scopeType,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renoItems, scopeType, itemsPerPage]);

    useEffect(() => {
        const prop = isOneOfEach ? "cat_one_of_each_wavg" : "cat_all_reno_wavg";
        setSelectedInvTotalWavg(
            categoriesData
                ?.reduce((accumulator: any, currentValue: any) => {
                    return accumulator + (isNaN(currentValue[prop]) ? 0 : currentValue[prop]);
                }, 0)
                .toFixed(2),
        );
        setCatWavgKey(prop);

        let showAll = categoriesData.every((catItem: any) => {
            return (
                catItem.isSelected && catItem.items.every((scopeItem: any) => scopeItem.isSelected)
            );
        });
        setShow(showAll);
    }, [categoriesData, isOneOfEach]);

    const onChangeShowAll = (show: any) => {
        setRenoItems((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            stateCopy = stateCopy.map((item: any) => {
                return {
                    ...item,
                    isSelected: show,
                };
            });
            return stateCopy;
        });
    };

    const changeExpanded = (e: any, panel: string, newExpanded: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (newExpanded) {
            setExpanded([...expanded, panel]);
        } else {
            setExpanded([...expanded.filter((e: any) => e !== panel)]);
        }
    };

    const onScopeFilter = (e: any, subCategory: any) => {
        e.preventDefault();
        e.stopPropagation();
        setRenoItems((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            let stateCopyUpdated = stateCopy.map((cat: any) => {
                if (cat.item === subCategory.name) {
                    cat.isSelected = !cat.isSelected;
                }
                return cat;
            });

            return stateCopyUpdated;
        });
    };

    const onCategoryFilter = (e: any, category: any, idx: any) => {
        e.preventDefault();
        e.stopPropagation();
        setRenoItems((state: any) => {
            let stateCopy = JSON.parse(JSON.stringify(state));
            let stateCopyUpdated = stateCopy.map((cat: any) => {
                if (cat.category === category.name) {
                    cat.isSelected = e.target.checked;
                }
                return cat;
            });

            const panel = `panel-${idx}`;
            if (!e.target.checked) {
                setExpanded([...expanded.filter((e) => e !== panel)]);
            } else {
                setExpanded([...expanded, panel]);
            }

            return stateCopyUpdated;
        });
    };
    const checkIsNegative = (val: any) => {
        if (val < 0) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        let diffAmt =
            (isOneOfEach
                ? baseDataForDiff.totalWavg.oneOfEachWavg
                : baseDataForDiff.totalWavg.allRenoWavg) - selectedInvTotalWavg;
        setAltScopeDiffWavg(diffAmt?.toFixed(2));
    }, [selectedInvTotalWavg, baseDataForDiff.totalWavg, isOneOfEach]);

    useEffect(() => {
        if (renoItem) {
            const renoItemToPreview = renoItems.find(
                (item: any) => item.isSelected && item.showInCatTree && item.id === renoItem.id,
            );
            setRenoItem(renoItemToPreview);
        }
    }, [renoItems]);

    const onPageChange = (pageNumber: number) => {
        setPage(pageNumber);
        setRenoItem(null);
    };

    return !showScopeTable ? (
        <DefaultScopeSection container className="Scope-table-default-section">
            <DefaultTableSection item md={12} className="Scope-table-no-data">
                <img src={Icon} alt="exclamation icon" />
                <Typography variant="warningText" sx={{ display: "block" }}>
                    {SCOPE_INVENTORY_DEFINITION_MESSAGE}
                </Typography>
            </DefaultTableSection>
        </DefaultScopeSection>
    ) : (
        <>
            <Grid
                container
                className="Scope-table-container"
                width={"100%"}
                sx={{
                    display: "grid",
                    gridAutoFlow: "column",
                    columnGap: "10px",
                    padding: "0px 0px 10px 0px",
                    gridTemplateColumns: "24% 40% 34%",
                }}
            >
                <Grid className="Scope-table-filter-group">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={show}
                                onChange={() => onChangeShowAll(!show)}
                                sx={{ color: "#004D71" }}
                            />
                        }
                        label={
                            <Typography variant="scopeFilterText">
                                {SCOPE_INVENTORY_SHOW_HIDE_BUTTON}
                            </Typography>
                        }
                        labelPlacement="end"
                    />
                    {scopeType === "altScope" && (
                        <Typography
                            variant="warningText"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                fontSize: "small",
                                textAlign: "center",
                                width: "inherit",
                                color: `${checkIsNegative(altScopeDiffWavg) ? "red" : "green"}`,
                            }}
                        >
                            {`$ ${Math.abs(altScopeDiffWavg)}`}
                            {checkIsNegative(altScopeDiffWavg) ? (
                                <ArrowUpwardIcon fontSize="small" />
                            ) : (
                                <ArrowDownwardIcon fontSize="small" />
                            )}
                        </Typography>
                    )}

                    {scopeType !== "flooringScope" && (
                        <Typography variant="labelText">
                            {SCOPE_INVENTORY_INV_WAVG_PRETEXT} {selectedInvTotalWavg}
                        </Typography>
                    )}
                </Grid>
                <Grid
                    sx={{
                        display: "grid",
                        gridAutoFlow: "column",
                        columnGap: "10px",
                        gridTemplateColumns: "50% 25% 25%",
                    }}
                    className="Scope-table-filter-section"
                >
                    {pageView ? (
                        <Grid
                            className="Scope-table-control-group"
                            sx={{
                                display: "grid",
                                gridAutoFlow: "column",
                                columnGap: "15px",
                                gridTemplateColumns: "10% 10% 40% 10% 10%",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                color="primary"
                                aria-label="Move to first page"
                                disabled={page === 0}
                                onClick={() =>
                                    onPageChange(SCOPE_INVENTORY_PAGINATION_OPTIONS.start)
                                }
                            >
                                <FirstPageIcon />
                            </IconButton>
                            <IconButton
                                color="primary"
                                aria-label="Move to previous page"
                                disabled={page === 0}
                                onClick={() => onPageChange(page > 0 ? page - 1 : page)}
                            >
                                <NavigateBeforeIcon />
                            </IconButton>
                            <Typography margin="0 5px" padding="10px">
                                Page {page + 1} of {lastPage < 0 ? 1 : lastPage + 1}
                            </Typography>
                            <IconButton
                                color="primary"
                                aria-label="Move to next page"
                                disabled={page === lastPage}
                                onClick={() => onPageChange(page < lastPage ? page + 1 : page)}
                            >
                                <NavigateNextIcon />
                            </IconButton>
                            <IconButton
                                color="primary"
                                aria-label="Move to last page"
                                disabled={page === lastPage}
                                onClick={() => onPageChange(lastPage)}
                            >
                                <LastPageIcon />
                            </IconButton>
                        </Grid>
                    ) : null}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showIncomplete}
                                onChange={() => setshowIncomplete(!showIncomplete)}
                                sx={{ color: "#004D71" }}
                            />
                        }
                        label={
                            <Typography variant="scopeFilterText">
                                {SCOPE_INVENTORY_INCOMPLETE_FILTER_LABEL} (
                                {renoItems?.filter((reno: any) => !reno.workId).length})
                            </Typography>
                        }
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showVariations}
                                onChange={() => setShowVariations(!showVariations)}
                                sx={{ color: "#004D71" }}
                            />
                        }
                        label={
                            <Typography variant="scopeFilterText">
                                {SCOPE_INVENTORY_VARIATION_FILTER_LABEL} (
                                {
                                    renoItems.filter(
                                        (t: any) =>
                                            t.qualifier &&
                                            t.projectCodexIdDerivedFrom &&
                                            !t.item.toLowerCase().match("flooring") &&
                                            t.location !== t.qualifier,
                                    ).length
                                }
                                )
                            </Typography>
                        }
                        labelPlacement="end"
                    />
                </Grid>
                <Grid className="Scope-table-search-container" width={"100%"}>
                    <BaseTextField
                        InputProps={{ endAdornment: <SearchIcon htmlColor="#757575" /> }}
                        variant="outlined"
                        size="small"
                        placeholder={`${SCOPE_INVENTORY_TEXT_FIELD_PLACEHOLDER}`}
                        onChange={(e: any) => {
                            setSearch(e.target.value);
                        }}
                        sx={{
                            display: "flex",
                            flexGrow: 1,
                        }}
                    />
                </Grid>
            </Grid>

            {comLoading || loading ? (
                <div
                    style={{
                        boxShadow:
                            "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
                        width: "100%",
                    }}
                >
                    <Grid
                        sx={{
                            gridAutoFlow: "column",
                            columnGap: "10px",
                            display: "grid",
                            marginLeft: "10px",
                            gridTemplateColumns: "25% 65% 7%",
                        }}
                    >
                        <Grid
                            sx={{
                                display: "flex",
                                marginLeft: "10px",
                                flexDirection: "column",
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((item: any) => (
                                <Typography variant="h2" key={item}>
                                    <Skeleton />
                                </Typography>
                            ))}
                        </Grid>
                        <Grid
                            sx={{
                                display: "flex",
                                marginLeft: "10px",
                                flexDirection: "column",
                            }}
                        >
                            {[1, 2, 3, 4, 5].map((item: any) => (
                                <Typography variant="h2" key={item}>
                                    <Skeleton />
                                </Typography>
                            ))}
                        </Grid>

                        <div style={{ display: "grid", marginTop: "15px" }}>
                            <Skeleton variant="rectangular" height={70} />
                            <Typography variant="body1">
                                <Skeleton />
                            </Typography>
                            <Typography variant="body1">
                                <Skeleton />
                            </Typography>
                            <Typography variant="caption">
                                <Skeleton />
                            </Typography>
                            <Typography variant="body1">
                                <Skeleton />
                            </Typography>
                            <Typography variant="caption">
                                <Skeleton />
                            </Typography>
                            <Typography variant="body1">
                                <Skeleton />
                            </Typography>
                            <Typography variant="caption">
                                <Skeleton />
                            </Typography>
                        </div>
                    </Grid>
                </div>
            ) : (
                <Grid
                    container
                    marginTop={1}
                    className="Scope-table-section"
                    sx={{
                        display: "grid",
                        gridAutoFlow: "column",
                        columnGap: "10px",
                        gridTemplateColumns: "24% 64% 10%",
                        maxHeight: "405px",
                    }}
                >
                    <Grid
                        item
                        className="first-selector-box"
                        sx={{
                            overflowY: "scroll",
                            boxShadow:
                                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
                            maxHeight: "405px",
                        }}
                    >
                        {/* New item functionality not supported for 2.0  higher versions */}
                        {projectDetails?.system_remarks?.container_version <= 2 && (
                            <BaseButton
                                classes="primary default"
                                label={`${isNewItemSelected ? "Hide" : "View"} New Items`}
                                sx={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    marginLeft: "10px",
                                    height: "50px",
                                    padding: "15px",
                                }}
                                onClick={() => setNewItemSelection(!isNewItemSelected)}
                            />
                        )}
                        {categoriesData
                            ?.filter((cat: any) => cat.showInCatTree)
                            .map((category: any, catIndex: number) => (
                                <Accordion
                                    expanded={expanded.includes(`panel-${catIndex}`)}
                                    key={`category-panel-${category.name}`}
                                    disableGutters={true}
                                    className="Scope-table-section-cat-table"
                                    onClick={() => {}}
                                    sx={{
                                        backgroundColor: category.isSelected ? "#eee" : "#fff",
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                onClick={(e) =>
                                                    changeExpanded(
                                                        e,
                                                        `panel-${catIndex}`,
                                                        !expanded.includes(`panel-${catIndex}`),
                                                    )
                                                }
                                            />
                                        }
                                        aria-controls={`panel-${catIndex}d-content`}
                                        id={`panel-${catIndex}d-header`}
                                        className="Scope-table-category-title-group"
                                    >
                                        <CategorySelection
                                            value={category.isSelected}
                                            control={
                                                <Checkbox
                                                    checked={category.isSelected}
                                                    onClick={(e: any) =>
                                                        onCategoryFilter(e, category, catIndex)
                                                    }
                                                    sx={{
                                                        color: "#004D71",
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography
                                                    className="Scope-table-reno-category-title-group"
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        justifyContent: "space-between",
                                                    }}
                                                    onClick={(e) =>
                                                        changeExpanded(
                                                            e,
                                                            `panel-${catIndex}`,
                                                            !expanded.includes(`panel-${catIndex}`),
                                                        )
                                                    }
                                                >
                                                    <Typography
                                                        className="Scope-table-reno-category-label-group"
                                                        variant="labelText"
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <img
                                                            src={getCategoryIcon(category.name)}
                                                            width={30}
                                                            height={30}
                                                            alt={`${category.name} icon`}
                                                            className="Scope-table-reno-category-image"
                                                        />
                                                        {category.name}
                                                        {!category.isComplete && (
                                                            <SvgIcon>
                                                                <InfoIcon
                                                                    fill="white"
                                                                    title={CATEGORY_INCOMPLETE_TEXT}
                                                                />
                                                            </SvgIcon>
                                                        )}
                                                    </Typography>
                                                    {scopeType !== "flooringScope" &&
                                                        scopeType === "altScope" &&
                                                        category[`${catWavgKey}_diff`] != 0 && (
                                                            <Typography
                                                                variant="warningText"
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    fontSize: "small",
                                                                    textAlign: "center",
                                                                    width: "inherit",
                                                                    color: `${
                                                                        checkIsNegative(
                                                                            category[
                                                                                `${catWavgKey}_diff`
                                                                            ],
                                                                        )
                                                                            ? "red"
                                                                            : "green"
                                                                    }`,
                                                                }}
                                                            >
                                                                {`$ ${Math.abs(
                                                                    category[`${catWavgKey}_diff`],
                                                                )}`}
                                                                {checkIsNegative(
                                                                    category[`${catWavgKey}_diff`],
                                                                ) ? (
                                                                    <GridArrowUpwardIcon fontSize="small" />
                                                                ) : (
                                                                    <ArrowDownwardIcon fontSize="small" />
                                                                )}
                                                            </Typography>
                                                        )}
                                                    {scopeType !== "flooringScope" &&
                                                        category.name !== "New Items" && (
                                                            <Typography
                                                                variant="labelText"
                                                                sx={{ textAlign: "right" }}
                                                            >
                                                                {SCOPE_INVENTORY_WAVG_PRETEXT}{" "}
                                                                {category[catWavgKey]}
                                                            </Typography>
                                                        )}
                                                </Typography>
                                            }
                                            labelPlacement="end"
                                            className="Scope-table-category-title"
                                        />
                                    </AccordionSummary>
                                    <AccordionDetails
                                        className="Scope-table-category-item-list"
                                        sx={{ padding: 0 }}
                                    >
                                        <List sx={{ padding: 0 }}>
                                            {category?.items?.length
                                                ? category.items
                                                      .filter((cit: any) => cit.showInCatTree)
                                                      .map((item: any) =>
                                                          item.scopes.map(
                                                              (scope: any, idx: number) => {
                                                                  return (
                                                                      <ItemSelection
                                                                          key={`${item.name}:${scope.name}-${idx}`}
                                                                          style={{
                                                                              backgroundColor:
                                                                                  !item.isComplete
                                                                                      ? "#DAF3FF"
                                                                                      : "#fff",
                                                                              marginRight: 0,
                                                                              paddingLeft: "20px",
                                                                          }}
                                                                          value={item.isSelected}
                                                                          control={
                                                                              <Checkbox
                                                                                  key={`${scope.name}-${idx}`}
                                                                                  value={
                                                                                      scope.isSelected
                                                                                  }
                                                                                  onChange={(e) =>
                                                                                      onScopeFilter(
                                                                                          e,
                                                                                          item,
                                                                                      )
                                                                                  }
                                                                                  sx={{
                                                                                      padding:
                                                                                          "0.313rem",
                                                                                      color: "#004D71",
                                                                                  }}
                                                                                  checked={
                                                                                      scope.isSelected
                                                                                  }
                                                                              />
                                                                          }
                                                                          label={
                                                                              <ItemListButton
                                                                                  className="Scope-table-category-item"
                                                                                  sx={{
                                                                                      display:
                                                                                          "flex",
                                                                                      justifyContent:
                                                                                          "space-between",
                                                                                      width: "100%",
                                                                                  }}
                                                                              >
                                                                                  <Typography variant="summaryText">
                                                                                      {projectDetails
                                                                                          ?.system_remarks
                                                                                          ?.container_version !=
                                                                                          "2.0" &&
                                                                                      projectDetails
                                                                                          ?.system_remarks
                                                                                          ?.container_version !=
                                                                                          "2.1"
                                                                                          ? `${item.name}: ${scope.name}`
                                                                                          : `${item.name}`}
                                                                                  </Typography>
                                                                                  {scopeType !==
                                                                                      "flooringScope" && (
                                                                                      <Typography
                                                                                          variant="summaryText"
                                                                                          align="right"
                                                                                      >
                                                                                          {
                                                                                              SCOPE_INVENTORY_WAVG_PRETEXT
                                                                                          }{" "}
                                                                                          {isOneOfEach
                                                                                              ? item.oneOfEachWavgAmount
                                                                                              : item.allRenoWavgAmount}
                                                                                      </Typography>
                                                                                  )}
                                                                              </ItemListButton>
                                                                          }
                                                                          labelPlacement="end"
                                                                          className="Scope-table-category-title"
                                                                      />
                                                                  );
                                                              },
                                                          ),
                                                      )
                                                : null}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </Grid>
                    {isNewItemSelected && <NewItemList />}
                    <Grid item>
                        {renoItems?.length && !isNewItemSelected ? (
                            <RenoTable
                                renoItems={renoItems.filter(
                                    (ri: any) => ri.isSelected && ri.showInCatTree,
                                )}
                                setRenoItems={setRenoItems}
                                setRenoItem={setRenoItem}
                                page={page}
                                itemsPerPage={itemsPerPage}
                                isPageView={pageView}
                                scopeType={scopeType}
                            />
                        ) : (
                            <>
                                {!isNewItemSelected && (
                                    <NoItemsGrid>
                                        <Typography variant="warningText">
                                            No renovation items with the selected filters
                                        </Typography>
                                    </NoItemsGrid>
                                )}
                            </>
                        )}
                    </Grid>
                    <Grid>
                        {renoItem && !isNewItemSelected ? (
                            <RenoDetails renoItem={renoItem} />
                        ) : null}
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default React.memo(ScopeTable);
