import { includes, isEmpty } from "lodash";
import React from "react";
import { IItem, IGroupedRfpResponseItems } from "stores/bidding-portal/bidding-portal-models";
import actions from "stores/actions";
import { GridRowParams } from "@mui/x-data-grid-pro";
import { BIDDING_PORTAL } from "../common/constants";

export function onCombineLineItems2(
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
    groupedBidItems: IGroupedRfpResponseItems[],
    category: string,
    selectedRows: any[],
    setItemsToRemove: React.Dispatch<React.SetStateAction<any>>,
    setOpenCombineDialog: React.Dispatch<React.SetStateAction<boolean>>,
    dispatch: any,
    projectId: string | undefined,
    setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>,
    comboName: string,
    floorplanName: string,
    checkedItems: string[],
    uom: string,
    percentageValue: string,
) {
    setLoader(true);
    let items: IItem[] = [];
    let reno_item_ids: string[] = [];
    // Find all items and push their reno item ids and ids into arrays
    groupedBidItems.forEach((groupedBidItem) => {
        let cate = groupedBidItem.categories.find((cate) => cate.category === category);
        cate?.items.forEach((item) => {
            if (includes(selectedRows, item.id)) {
                items.push(item);
                reno_item_ids.push(item.reno_item_id);
            }
        });
    });
    let hasCombinedItem = false;
    let hasDeletedItem = false;
    items?.every((item) => {
        // Only for all floorplans check if items exists across multiple invs
        if (item?.type === "COMBINED") {
            hasCombinedItem = true;
            return false;
        } else if (item?.type_of_change === "deleted") {
            hasDeletedItem = true;
            return false;
        }
        return true;
    });
    // If Items are in multiple inventories, Show Error and exit
    if (hasCombinedItem || hasDeletedItem) {
        dispatch(
            actions.common.openSnack({
                variant: "error",
                message: hasDeletedItem
                    ? "Cannot combine as the selected items contain a deleted item"
                    : "Cannot combine as the items already contain a combined item",
                open: true,
            }),
        );
        setSelectedRows([]);
        setLoader(false);
        return;
    }

    let allFps = groupedBidItems.find(
        (groupedBidItem) => groupedBidItem.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS,
    );
    let allFpItems: IItem[] = [];

    // Get All fp items if the floorplan is not all fp else assign items to allFpItems
    if (floorplanName !== BIDDING_PORTAL.ALL_FLOOR_PLANS) {
        let c = allFps?.categories.find((c) => c.category === category);
        c?.items.forEach((it) => {
            for (let reno_item_id of reno_item_ids) {
                if (it.reno_item_id.includes(reno_item_id)) {
                    allFpItems.push(it);
                }
            }
        });
    } else {
        allFpItems = items;
    }

    // If all the items selected are in same category
    // find all inventories which has this category and assign them in Record
    let allInventories: Record<string, Array<IItem>> = {};
    allFpItems.forEach((item) => {
        let itemInvs = item.inventory_name.split("#");

        itemInvs.forEach((inv) => {
            if (!allInventories[inv]) {
                allInventories[inv] = [item];
            } else {
                allInventories[inv].push(item);
            }
        });
    });
    let missing_items: Record<string, IItem | undefined> = {};

    let allItemsAcrossInvs = Object.values(allInventories);
    allItemsAcrossInvs.forEach((invItems) => {
        for (let item of invItems) {
            allItemsAcrossInvs.forEach((otherInvItems) => {
                if (invItems === otherInvItems) {
                    return;
                }
                if (!otherInvItems.includes(item)) {
                    missing_items[`${item?.subcategory}//-${item?.scope}//-${item?.reno_item_id}`] =
                        item;
                }
            });
        }
    });

    // Check if item is present in all individual floor items &
    // if not display the dialog to deselect exceptions
    groupedBidItems.forEach((groupedBidItem) => {
        if (groupedBidItem.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS) return;
        let c = groupedBidItem.categories.find((cat) => cat.category === category);
        if (!c) {
            return;
        }
        let inventory_name = groupedBidItem.inventory_name;
        let itemsFromInventory = allInventories[inventory_name];
        // Find items which are not present in inventory to display them in dialog
        itemsFromInventory.forEach((itemFromInventory) => {
            let foundItem = c?.items?.find((it) =>
                itemFromInventory?.reno_item_id.includes(it.reno_item_id),
            );
            if (!foundItem) {
                missing_items[
                    `${itemFromInventory?.subcategory}//-${itemFromInventory?.scope}//-${itemFromInventory?.reno_item_id}`
                ] = itemFromInventory;
            }
        });
    });

    if (Object.keys(missing_items).length === 0) {
        dispatch(
            actions.biddingPortal.combineLineItemsStart({
                allInventories,
                projectId,
                category,
                comboName,
                quantityIds: checkedItems,
                uom,
                percentage: parseFloat(percentageValue),
            }),
        );
        setSelectedRows([]);
        setLoader(false);
    } else {
        setItemsToRemove({
            allInventories,
            missing_items,
            comboName,
        });
        setOpenCombineDialog(true);
        setLoader(false);
        setSelectedRows([]);
    }
}

export function areSameItem(item1: IItem, item2: IItem) {
    let fieldsToTest = ["scope", "subcategory", "description", "model_no", "manufacturer"];
    let areTheySame = true;

    fieldsToTest.every((field: string) => {
        let f = field as keyof IItem;
        if (item1?.[f] !== item2?.[f]) {
            areTheySame = false;
            return false;
        }
        return true;
    });
    return areTheySame;
}

export function onUncombineLineItems(
    groupedBidItems: IGroupedRfpResponseItems[],
    dispatch: any,
    params: GridRowParams<IItem>,
    category: string,
) {
    let allItemsToUncombine = getCombinedItemFromMultipleInventoriesFromAllFpItem(
        groupedBidItems,
        category,
        params,
    );
    dispatch(
        actions.biddingPortal.uncombineLineItemsStart({
            idsToUncombine: allItemsToUncombine,
            category,
        }),
    );
}

export function renameCombination(
    groupedBidItems: IGroupedRfpResponseItems[],
    dispatch: any,
    params: GridRowParams<IItem>,
    category: string,
    comboName: string,
) {
    let allItemsToRename = getCombinedItemFromMultipleInventoriesFromAllFpItem(
        groupedBidItems,
        category,
        params,
    );
    dispatch(
        actions.biddingPortal.updateComboNameStart({
            idsToUpdate: allItemsToRename,
            category,
            comboName: comboName,
        }),
    );
}

function getCombinedItemFromMultipleInventoriesFromAllFpItem(
    groupedBidItems: IGroupedRfpResponseItems[],
    category: string,
    params: GridRowParams<IItem>,
) {
    let allFps = groupedBidItems.find(
        (bidItems) => bidItems.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS,
    );
    let allCombinedItems = allFps?.categories
        .find((cate) => cate.category === category)
        ?.items?.filter((item) => item.type === "COMBINED");
    let ids: Array<string> = [];
    let combinedItem: IItem | undefined = params.row;
    if (params?.row?.fp_name !== BIDDING_PORTAL.ALL_FLOOR_PLANS) {
        combinedItem = allCombinedItems?.find((item) =>
            item.reno_item_id.includes(combinedItem!.reno_item_id),
        );
    }
    ids = [combinedItem!.id];
    return ids;
}

export function isTodoItem(item: IItem) {
    return (
        (item?.unique_price === 0 &&
            item?.default_price === 0 &&
            item?.total_price === 0 &&
            item?.type_of_change !== "deleted") ||
        ((item?.unique_price > 0 || item?.default_price > 0 || item?.total_price > 0) &&
            item?.type_of_change === "deleted") ||
        (!item?.is_revised_price && item.type_of_change === "updated")
    );
}

export function isDoneItem(item: IItem) {
    let isItemValid;
    let isCostGreaterThanZero =
        item?.unique_price > 0 || item?.total_price > 0 || item?.default_price > 0;
    if (isCostGreaterThanZero && item?.type_of_change !== "deleted") {
        isItemValid = true;
    } else if (
        item?.unique_price === 0 &&
        item?.default_price === 0 &&
        item?.total_price === 0 &&
        item?.type_of_change === "deleted"
    ) {
        isItemValid = true;
    } else if (
        isCostGreaterThanZero &&
        item?.type_of_change === "updated" &&
        item?.is_revised_price
    ) {
        isItemValid = true;
    }
    return isItemValid;
}

//TO-DO: This is to manipulate bid items for adding l1_name/l2_name/l3_name property until API is in place
export const transformDataToHierarchy = (items: any) => {
    /*
    Case 1: 
    All l1, l2 and l3 is null
    
    case 2: 
    l1 is not null, l2 and l3 is null
    
    case 3: 

    l1 is not null, l2 not null and l3 is null

    case 4: 
    l1 is not null, l2 and l3 is not null

    case 5: 
    l1 is not null, l2 and l3 is not null and parent bid item id is not null
    */
    let groupedData: any[] = [];
    items
        ?.slice()
        .sort((a: any, b: any) => {
            let current_cat =
                a?.l3_name && a?.l3_name !== ""
                    ? `${a?.l1_name} ${a?.l2_name} ${a?.l3_name}`
                    : a?.l2_name && a?.l2_name !== ""
                    ? `${a?.l1_name} ${a?.l2_name}`
                    : `${a?.l1_name}`;

            let next_cat =
                b?.l3_name && b?.l3_name !== ""
                    ? `${b?.l1_name} ${b?.l2_name} ${b?.l3_name}`
                    : b?.l2_name && b?.l2_name !== ""
                    ? `${b?.l1_name} ${b?.l2_name}`
                    : `${b?.l1_name}`;
            return current_cat > next_cat ? 1 : current_cat < next_cat ? -1 : 0;
        })
        .forEach((item: any) => {
            //check if hierachy already exist
            if (
                item?.l2_name &&
                item?.l2_name !== null &&
                (item?.l3_name == null || item?.l3_name == "")
            ) {
                let found = groupedData?.findIndex(
                    (data: any) => data?.subcategory === item?.l2_name,
                );
                if (found === -1) {
                    groupedData?.push({
                        id: item?.l2_name,
                        hierarchy: [item?.l2_name],
                        subcategory: item?.l2_name,
                        scope: item?.l2_name,
                        isParentCategory: true,
                        items: [item],
                    });
                } else if (found !== -1 && groupedData?.[found]?.subcategory === item?.l2_name) {
                    groupedData[found].items = [...groupedData[found].items, item];
                }
                if (item?.type == "COMBINED") {
                    transformCombinedBidItems(groupedData, item, item?.l2_name);
                } else {
                    let updatedItem = {
                        ...item,
                        hierarchy: [`${item?.l2_name}`, item?.id],
                    };
                    groupedData?.push(updatedItem);
                }
            } else if (
                item?.l2_name &&
                item?.l2_name !== null &&
                item?.l3_name != null &&
                item?.l3_name != ""
            ) {
                let found = groupedData?.findIndex(
                    (data: any) => data?.subcategory == `${item?.l2_name} > ${item?.l3_name}`,
                );
                if (found === -1) {
                    groupedData?.push({
                        id: `${item?.l2_name} > ${item?.l3_name}`,
                        hierarchy: [`${item?.l2_name} > ${item?.l3_name}`],
                        subcategory: `${item?.l2_name} > ${item?.l3_name}`,
                        scope: `${item?.l2_name} > ${item?.l3_name}`,
                        isParentCategory: true,
                        items: [item],
                    });
                } else if (
                    found !== -1 &&
                    groupedData?.[found]?.subcategory === `${item?.l2_name} > ${item?.l3_name}`
                ) {
                    groupedData[found].items = [...groupedData[found].items, item];
                }
                if (item?.type == "COMBINED") {
                    transformCombinedBidItems(
                        groupedData,
                        item,
                        `${item?.l2_name} > ${item?.l3_name}`,
                    );
                } else {
                    let updatedItem = {
                        ...item,
                        hierarchy: [`${item?.l2_name} > ${item?.l3_name}`, item?.id],
                    };
                    groupedData?.push(updatedItem);
                }
            } else {
                if (item?.type == "COMBINED") {
                    transformCombinedBidItems(groupedData, item);
                } else {
                    if (items?.some((item: any) => item?.l2_name !== null && item?.l2_name)) {
                        let updatedItem = {
                            ...item,
                            hierarchy: [item?.id],
                        };
                        //insert item without any sub category to the top of the list
                        groupedData = [updatedItem, ...groupedData];
                    } else {
                        let updatedItem = {
                            ...item,
                            hierarchy: [item?.id],
                        };
                        groupedData?.push(updatedItem);
                    }
                }
            }
        });
    return groupedData;
};

export const transformCombinedBidItems = (groupedData: any, item: any, rootLevels: string = "") => {
    groupedData?.push({
        ...item,
        hierarchy: isEmpty(rootLevels) ? [item.id] : [rootLevels, item.id],
    });

    item?.children?.forEach((child: any) => {
        groupedData?.push({
            ...child,
            hierarchy: isEmpty(rootLevels)
                ? [item?.id, child?.id]
                : [rootLevels, item?.id, child?.id],
        });
    });
};

export const convertCombinedBidItemsToTreeData = (items: any) => {
    let groupedData: any[] = [];
    items?.forEach((item: any) => {
        if (item?.type == "COMBINED") {
            transformCombinedBidItems(groupedData, item);
        } else {
            let updatedItem = {
                ...item,
                hierarchy: [item?.id],
            };
            groupedData?.push(updatedItem);
        }
    });
    return groupedData;
};

export const getSubscript = (data: any) => {
    //For all floorplan
    if (data?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS) {
        // either it can be estimated or default or average
        if (data?.total_price > 0) {
            if (data?.floorplans?.length > 0) {
                return "Average";
            } else {
                return "Estimated";
            }
        } else {
            if (data?.floorplans?.length > 0) {
                return "Average";
            } else {
                return "Default";
            }
        }
    } else {
        // either it can be estimated or default or unique
        if (data?.total_price > 0) {
            {
                return "Estimated";
            }
        } else {
            if (data?.is_unique_price) {
                return "Unique";
            } else {
                return "Default";
            }
        }
    }
};

export const getLumpsumSubscript = (data: any) => {
    if (data?.total_price > 0) {
        if (data?.is_unique_price) {
            return "Unique";
        } else {
            return "Default";
        }
    }
};

export function uomConverter(uom1: string, uom2: string): number {
    const uomFactors: Record<string, Record<string, number>> = {
        sqyd: {
            sqft: 9,
            sqin: 1296,
            lnyd: 36,
            lnft: 3,
            lnin: 36,
            cuyd: 1 / 27,
            cuft: 1,
            cuin: 1728,
        },
        sqft: {
            sqyd: 1 / 9,
            sqin: 144,
            lnyd: 4,
            lnft: 1 / 9,
            lnin: 12,
            cuyd: 1 / 243,
            cuft: 1 / 27,
            cuin: 144,
        },
        sqin: {
            sqyd: 1 / 1296,
            sqft: 1 / 144,
            lnyd: 1 / 1296,
            lnft: 1 / 144,
            lnin: 1,
            cuyd: 1 / 46656,
            cuft: 1 / 1728,
            cuin: 1,
        },
        lnyd: {
            sqyd: 1 / 36,
            sqft: 9,
            sqin: 36,
            lnft: 1 / 3,
            lnin: 36,
            cuyd: 1 / 972,
            cuft: 1 / 108,
            cuin: 648,
        },
        lnft: {
            sqyd: 3,
            sqft: 9,
            sqin: 144,
            lnyd: 3,
            lnin: 12,
            cuyd: 1 / 324,
            cuft: 1 / 36,
            cuin: 1944,
        },
        lnin: {
            sqyd: 1 / 36,
            sqft: 1 / 12,
            sqin: 1,
            lnyd: 1 / 36,
            lnft: 1 / 12,
            cuyd: 1 / 11664,
            cuft: 1 / 1728,
            cuin: 1,
        },
        cuyd: {
            sqyd: 27,
            sqft: 243,
            sqin: 46656,
            lnyd: 972,
            lnft: 324,
            lnin: 11664,
            cuft: 27,
            cuin: 46656,
        },
        cuft: {
            sqyd: 27,
            sqft: 1,
            sqin: 1728,
            lnyd: 108,
            lnft: 36,
            lnin: 1728,
            cuyd: 1 / 27,
            cuin: 1728,
        },
        cuin: {
            sqyd: 1 / 1728,
            sqft: 1 / 1728,
            sqin: 1,
            lnyd: 1 / 648,
            lnft: 1 / 1944,
            lnin: 1,
            cuyd: 1 / 46656,
            cuft: 1 / 1728,
        },
    };

    if (!uomFactors[uom1] || !uomFactors[uom1][uom2]) {
        return 0;
    }

    return uomFactors[uom1][uom2];
}

export interface IPriceDataGrid {
    items: any;
    setItems: any;
    bidItemsUpdated: any;
    syncTimeout: boolean;
    projectDetails: any;
    isEditable?: boolean;
    isIdle?: boolean;
    isOffline?: boolean;
    isAgreement: boolean;
    index: number;
    category: any;
    setComboPromptState: any;
    currentRenoversion: any;
    orgId?: string;
    selectedRowsData: any;
    setSelectedRows: any;
    selectedRows: any;
    comboPromptState: any;
    isAdminAccess: boolean;
    isLatest: boolean;
    setSelectedRowsData: any;
    orgContainerId: null;
    setSyncTimeout: any;
    disableSnackbar?: boolean;
}

export const getDisplayUOM = (uom: string): string =>
    uom?.toLowerCase() === "count" ? "Ct" : uom?.toLowerCase() === "apt-sqft" ? "Apt sqft" : uom;
