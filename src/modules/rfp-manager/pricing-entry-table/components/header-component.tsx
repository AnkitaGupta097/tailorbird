import { Grid, Typography, ButtonBase, Stack, Tooltip } from "@mui/material";
import { isEditable } from "@testing-library/user-event/dist/utils";
import BaseButton from "components/button";
import BaseChip from "components/chip";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import React, { useEffect, useState } from "react";
import { getFormattedNumber, BIDDING_PORTAL } from "../../common/constants";
import {
    isTodoItem,
    isDoneItem,
    transformDataToHierarchy,
    convertCombinedBidItemsToTreeData,
} from "../constants";
import { isCombineItemDisabled } from "../helper-components";
import AssignmentSharpIcon from "@mui/icons-material/AssignmentSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";

interface IHeaderComponent {
    showNavigation?: boolean;
    wrapWithAccordion: boolean;
    groupedBidItems: any;
    index: number;
    catIndex: number;
    category: string;
    orgContainerId: any;
    setItems: any;
    selectedRows: any;
    selectedRowsData: any;
    costsColumnWidth: any;
    projectDetails: any;
    setSelectedRows: any;
    isIdle?: boolean;
    isOffline?: boolean;
    enableCombineLineItems: boolean;
    setComboPromptState: any;
}

const HeaderComponent = ({
    showNavigation,
    groupedBidItems,
    index,
    catIndex,
    category,
    orgContainerId,
    setItems,
    selectedRows,
    costsColumnWidth,
    projectDetails,
    selectedRowsData,
    setSelectedRows,
    isIdle,
    isOffline,
    enableCombineLineItems,
    setComboPromptState,
    wrapWithAccordion,
}: IHeaderComponent) => {
    const [filter, setFilter] = useState<any>([]);
    let getTodoItems = React.useMemo(() => {
        const todoItems = groupedBidItems?.[index]?.categories?.[catIndex]?.items?.filter(
            (item: any) => isTodoItem(item),
        ) as Array<any>;
        const doneItems = groupedBidItems?.[index]?.categories?.[catIndex]?.items?.filter(
            (item: any) => isDoneItem(item),
        ) as Array<any>;

        let filterList = [];
        if (todoItems?.length > 0 && doneItems?.length > 0) {
            filterList?.push("Todo");
            filterList?.push("Done");
        } else if (todoItems?.length > 0) {
            filterList?.push("Todo");
        } else if (doneItems?.length > 0) {
            filterList?.push("Done");
        }
        setFilter(filterList);
        return todoItems?.length ?? 0;
    }, [groupedBidItems, index, catIndex]);
    useEffect(() => {
        //if only todo and not done then set todo items and vice versa
        if (filter?.length === 1) {
            if (filter?.includes("Todo")) {
                let items = orgContainerId
                    ? transformDataToHierarchy(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items?.filter(
                              (item: any) => isTodoItem(item),
                          ),
                      )
                    : convertCombinedBidItemsToTreeData(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items?.filter(
                              (item: any) => isTodoItem(item),
                          ),
                      );
                setItems(items);
            } else if (filter?.includes("Done")) {
                let items = orgContainerId
                    ? transformDataToHierarchy(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items?.filter(
                              (item: any) => isDoneItem(item),
                          ),
                      )
                    : convertCombinedBidItemsToTreeData(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items?.filter(
                              (item: any) => isDoneItem(item),
                          ),
                      );
                //let updatedItems = convertCombinedBidItemsToTreeData(items);
                setItems(items);
            }
        }
        //includes both todo and done
        if (filter?.includes("Todo") && filter?.includes("Done")) {
            //TO-DO : merge transformDataToHierarchy and convertCombinedBidItemsToTreeData function
            let items = orgContainerId
                ? transformDataToHierarchy(groupedBidItems?.[index]?.categories?.[catIndex]?.items)
                : convertCombinedBidItemsToTreeData(
                      groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                  );
            if (catIndex !== -1) setItems(items);
            // if (catIndex !== -1) {
            //     let updatedItems = convertCombinedBidItemsToTreeData(
            //         groupedBidItems?.[index]?.categories?.[catIndex]?.items,
            //     );
            //     setItems(updatedItems);
            // }
        }
        if (!filter?.includes("Todo") && !filter?.includes("Done")) {
            if (catIndex !== -1) {
                //TO-DO : merge transformDataToHierarchy and convertCombinedBidItemsToTreeData function
                let items = orgContainerId
                    ? transformDataToHierarchy(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                      )
                    : convertCombinedBidItemsToTreeData(
                          groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                      );
                setItems(items);
                // let updatedItems = convertCombinedBidItemsToTreeData(
                //     groupedBidItems?.[index]?.categories?.[catIndex]?.items,
                // );
                // setItems(updatedItems);
            }
        }
        //eslint-disable-next-line
    }, [filter, groupedBidItems, orgContainerId]);
    return (
        <Grid
            item
            xs
            sx={{
                display: "flex",
                alignItems: "center",
                ...(!showNavigation && !wrapWithAccordion && { marginTop: "-3.5rem" }),
            }}
        >
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
                <Grid item xs={6}>
                    <Grid container direction={"row"} columnGap={2}>
                        {/* <Grid
                                    item
                                    onClick={() => setPricingTableVisible(!pricingTableVisible)}
                                >
                                    <img
                                        src={expandMoreIcon}
                                        alt="expand"
                                        style={{
                                            display: wrapWithAccordion ? "inline" : "none",
                                            verticalAlign: "center",
                                            marginTop: "1.1rem",
                                            ...(!pricingTableVisible && { rotate: "-90deg" }),
                                        }}
                                    />
                                </Grid> */}
                        <Grid item>
                            <img
                                src={getCategoryIcon(
                                    groupedBidItems?.[index]?.categories?.[catIndex]?.items?.[0]
                                        ?.category,
                                )}
                                width={40}
                                height={40}
                                alt={`${category} icon`}
                                style={{
                                    marginRight: "1rem",
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="text_26_light">{category}</Typography>
                        </Grid>
                        <Grid
                            item
                            component={ButtonBase}
                            onClick={() => {
                                //check if toDo filter already applied then remove it from list
                                const index = filter?.indexOf("Todo");
                                if (index !== -1) {
                                    filter?.splice(index, 1);
                                    setFilter([...filter]);
                                } else setFilter([...filter, "Todo"]);
                            }}
                        >
                            <BaseChip
                                disabled={filter?.includes("Todo") ? false : true}
                                icon={<AssignmentSharpIcon fontSize="small" />}
                                label={
                                    <Typography variant="text_14_semibold">{`${getTodoItems} To Do`}</Typography>
                                }
                                bgcolor={"#FFD79D"}
                                textColor={"#916A00"}
                                sx={{
                                    ".MuiChip-icon": {
                                        color: "#916A00",
                                    },
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            component={ButtonBase}
                            onClick={() => {
                                //check if toDo filter already applied then remove it from list
                                const index = filter?.indexOf("Done");
                                if (index !== -1) {
                                    filter?.splice(index, 1);
                                    setFilter([...filter]);
                                } else setFilter([...filter, "Done"]);
                            }}
                        >
                            <BaseChip
                                disabled={filter?.includes("Done") ? false : true}
                                icon={<CheckCircleSharpIcon fontSize="small" />}
                                label={
                                    <Typography variant="text_14_semibold">{`${
                                        groupedBidItems?.[index]?.categories?.[catIndex]?.items
                                            ?.length - getTodoItems
                                    } Done`}</Typography>
                                }
                                bgcolor={"#AEE9D1"}
                                textColor={"#00B779"}
                                sx={{
                                    ".MuiChip-icon": {
                                        color: "#00B779",
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    {selectedRows.length === 0 ? (
                        <Grid
                            container
                            direction={"row"}
                            columnGap={4}
                            justifyContent="space-evenly"
                        >
                            <Grid item width={costsColumnWidth}>
                                <Stack direction={"row"}>
                                    <Typography variant="text_10_regular" color="#757575">
                                        {"Total category cost"}
                                    </Typography>
                                </Stack>
                                <Typography variant="text_26_semibold">
                                    {groupedBidItems?.[index]?.categories?.[catIndex]?.categorySum >
                                    0
                                        ? `$${getFormattedNumber(
                                              groupedBidItems?.[index]?.fp_name ===
                                                  BIDDING_PORTAL.ALL_FLOOR_PLANS
                                                  ? groupedBidItems?.[index]?.categories?.[catIndex]
                                                        ?.categorySum
                                                  : groupedBidItems?.[index]?.categories?.[catIndex]
                                                        ?.categorySum *
                                                        groupedBidItems?.[index]?.total_units,
                                          )}`
                                        : `$00.00`}
                                </Typography>
                            </Grid>
                            {projectDetails?.property_type?.toLowerCase() === "interior" ? (
                                <Grid item width={costsColumnWidth}>
                                    <Stack direction={"row"}>
                                        <Typography variant="text_10_regular" color="#757575">
                                            {"Category WAVG"}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="text_26_semibold">
                                        {groupedBidItems?.[index]?.categories?.[catIndex]
                                            ?.categorySum > 0
                                            ? `$${getFormattedNumber(
                                                  groupedBidItems?.[index]?.fp_name ===
                                                      BIDDING_PORTAL.ALL_FLOOR_PLANS
                                                      ? groupedBidItems?.[index]?.categories?.[
                                                            catIndex
                                                        ]?.categorySum /
                                                            groupedBidItems?.[index]?.total_units
                                                      : groupedBidItems?.[index]?.categories?.[
                                                            catIndex
                                                        ]?.categorySum,
                                              )}/unit`
                                            : `$00.00/unit`}
                                    </Typography>
                                </Grid>
                            ) : null}
                        </Grid>
                    ) : (
                        <Grid container direction={"row"} columnGap={4} justifyContent="flex-end">
                            <Grid item>
                                <BaseButton
                                    onClick={(): void => {
                                        setSelectedRows([]);
                                    }}
                                    label="Deselect All"
                                    labelStyles={{ paddingY: ".4rem" }}
                                    classes="grey default"
                                    variant="text_16_semibold"
                                />
                            </Grid>
                            <Tooltip title={isCombineItemDisabled(selectedRowsData)?.message}>
                                <Grid
                                    item
                                    sx={
                                        category === "Alternates" ||
                                        !isEditable ||
                                        isIdle ||
                                        isOffline ||
                                        !enableCombineLineItems
                                            ? {
                                                  display: "none",
                                              }
                                            : undefined
                                    }
                                >
                                    <BaseButton
                                        onClick={() => setComboPromptState({ open: true })}
                                        disabled={isCombineItemDisabled(selectedRowsData)?.value}
                                        labelStyles={{ paddingY: ".4rem" }}
                                        classes={`primary ${
                                            isCombineItemDisabled(selectedRowsData)?.value
                                                ? "disabled"
                                                : "default"
                                        }`}
                                        variant="text_16_semibold"
                                        label="Combine"
                                    />
                                </Grid>
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default HeaderComponent;
