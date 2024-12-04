import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, includes } from "lodash";
import { BIDDING_PORTAL, ROUTES } from "modules/rfp-manager/common/constants";
import {
    getCategoryInScope,
    getSortedCategoryByContainer,
    getSortedCustomCategoryByContainer,
} from "modules/rfp-manager/helper";
import { updateObject } from "utils/store-helpers";
import initAjaxState from "../initAjaxState.json";
import {
    calculateFilteredProjectCost,
    computeAllFloorplans,
    computeAllFloorplansIfResetPrice,
    getAllFloorPlanItem,
    getPriceFromItem,
    groupBy,
    groupByCategory,
    updateBidItems,
    updateGroupedBidItems,
    updateValuesWithNewAltSum,
} from "./bidding-portal-helper";
import {
    IBiddingPortal,
    IGroupedRfpResponseItems,
    IItem,
    IRfpResponseItems,
    IExcelFileDetails,
} from "./bidding-portal-models";

const initState = cloneDeep(initAjaxState) as any;
initState.loading = false;
initState.floorplans = [];
initState.loadingSession = false;
initState.disableSubmit = true;
initState.selectedVersion = "";
initState.filteredProjectCost = {};

//eslint-disable-next-line
function createBidItemsForContractorStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
        bidItems: state?.bidItems,
        bidItemsUpdated: state?.bidItemsUpdated,
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}
// eslint-disable-next-line no-unused-vars
function createBidItemsForContractorSuccess(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        bidItems: state?.bidItems,
        bidItemsUpdated: state?.bidItemsUpdated,
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

//eslint-disable-next-line
function fetchBidItemsStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
        bidItems: state?.bidItems,
        bidItemsUpdated: [],
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

//eslint-disable-next-line
function fetchBidItemsHistoryStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: true,
        bidItems: state?.bidItems,
        bidItemsUpdated: [],
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

function linkOriginalWithAlternate(groupedBidItems: IGroupedRfpResponseItems[]) {
    groupedBidItems?.map((floorplanBidItems) => {
        let alternatesCategoryIndex = floorplanBidItems.categories.findIndex(
            (category) => category.category === "Alternates",
        );
        if (alternatesCategoryIndex < 0) {
            floorplanBidItems.categories.forEach((category) => {
                category.alternateSum = category.totalSum;
            });
        } else {
            floorplanBidItems.categories[alternatesCategoryIndex]?.items.forEach(
                (alternateItem) => {
                    let originalCategory = floorplanBidItems.categories.find((category) => {
                        return category.category === alternateItem.category;
                    });
                    if (!originalCategory || originalCategory.category === "Alternates") return;
                    let originalItem = originalCategory.items.find((item) => {
                        return item.reno_item_id === alternateItem.reno_item_id;
                    });
                    originalItem && (originalItem.alternate_item_ref = alternateItem);
                },
            );
            floorplanBidItems.categories.forEach((category) => {
                if (category.category === "Alternates") return;
                let altSum = 0;
                category.items.every((item) => {
                    let price = getPriceFromItem(item?.alternate_item_ref ?? item);
                    if (price === 0 && item?.type_of_change !== "deleted") {
                        altSum = 0;
                        return false;
                    } else {
                        altSum += price;
                        return true;
                    }
                });
                category.alternateSum = altSum;
            });
        }
    });
}

function fetchBidItemsSuccess(
    state: IBiddingPortal,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    let alternateItemsCount = 0;
    //let total_units_all_fp = 0;
    let bidItems = action.payload.response;
    let combineLineItems = false;
    let organisationContainerId = action?.payload?.organisation_container_id;
    let inventories: Set<string> = new Set<string>();
    bidItems = bidItems?.map((item: IRfpResponseItems) => {
        item?.is_combined && (combineLineItems = true);
        item?.is_alternate && alternateItemsCount++;
        if (item?.inventory_name) {
            item?.inventory_name.split(/[,#]/).forEach((inv) => inv && inventories.add(inv));
        }
        return item?.is_alternate
            ? {
                  ...item,
                  display_category: "Alternates",
              }
            : { ...item, display_category: organisationContainerId ? item.l1_name : item.category };
    });
    //Exclude all Floorplans reno items
    let responseWithoutAllFp = bidItems?.filter(
        (r: IRfpResponseItems) =>
            r?.floor_plan_id !== "ALL" && r?.total_units > 0 && r?.inventory_name !== null,
    );

    // Filter out only all Floorplans reno items
    let AllFps = bidItems?.filter(
        (r: { floor_plan_id: string; quantity: number }) => r?.floor_plan_id === "ALL",
    );
    //Group by floor_plan + inventory+ categories
    let groupedBidItems: IGroupedRfpResponseItems[] =
        responseWithoutAllFp?.length > 0
            ? groupBy(responseWithoutAllFp, ["fp_name", "inventory_name", "sub_group_name"])
            : [];

    //calculate each floor plan and it's total floor plan unit
    const result = groupedBidItems?.reduce((acc: any, curr: any) => {
        //total_units_all_fp = total_units_all_fp + curr?.total_units;
        const existing = acc?.find(
            (item: { fp_name: string }) =>
                item?.fp_name?.split(":")?.[0] === curr.fp_name?.split(":")?.[0],
        );
        if (existing) {
            existing.total_fp_units += curr.total_units;
        } else {
            acc?.push({
                fp_name: curr.fp_name?.split(":")?.[0],
                total_fp_units: curr.total_units,
            });
        }
        return acc;
    }, []);

    //group by category + reno_items for all floorplan
    const groupedRfpResponseItemsByCategory = AllFps?.length > 0 ? groupByCategory(AllFps) : [];
    let newRow: any = {
        fp_name: BIDDING_PORTAL.ALL_FLOOR_PLANS,
        inventory_name: "",
        total_units: action?.payload?.total_reno_units,
        sub_group_name: "",
        categories: groupedRfpResponseItemsByCategory,
    };

    //Append all floorplans with each floorplan list
    groupedBidItems = [newRow, ...groupedBidItems];

    alternateItemsCount > 0 && linkOriginalWithAlternate(groupedBidItems);

    if (combineLineItems) {
        groupedBidItems.forEach((bidItem) => {
            bidItem.categories.forEach((category) => {
                let itemsToRemove: any[] = [];
                category.items.forEach((item) => {
                    if (!item?.parent_bid_item_id) return;
                    category.items.every((it) => {
                        if (it.id.includes(item.parent_bid_item_id! as string)) {
                            // Assign child item to parent item and exit loop
                            it.children ? it.children.push(item) : (it.children = [item]);
                            itemsToRemove.push(item.id);
                            return false;
                        }
                        return true;
                    });
                });
                // Filter items & remove children items from item list
                category.items = category.items?.filter(
                    (item) => !includes(itemsToRemove, item.id),
                );
            });
        });
    }
    // to calculate filtered project cost floorplan wise with excluded categories
    let filteredProjectCost: any = {};
    let excludedCategories = ["tax", "general conditions", "profit & overhead", "alternates"];

    // Calculate Total Sum & Category sum after performing combinations
    groupedBidItems.forEach((groupedBidItem) => {
        let filterKey =
            groupedBidItem?.fp_name +
            (groupedBidItem?.inventory_name ?? "") +
            (groupedBidItem?.sub_group_name ?? "");

        if (!(filterKey in filteredProjectCost)) {
            filteredProjectCost[filterKey] = {
                categorySum: 0,
                materialCost: 0,
                laborCost: 0,
            };
        }

        groupedBidItem.categories.forEach((category) => {
            let catSum = 0;
            let materialCost = 0;
            let laborCost = 0;
            let setTotalAsZero = false;
            category?.items?.forEach((item) => {
                let price = getPriceFromItem(item);
                if (price === 0 && item?.type_of_change !== "deleted") {
                    setTotalAsZero = true;
                }

                catSum += price;

                if (item?.work_type?.toLowerCase() === "material") {
                    materialCost += price;
                } else if (
                    item?.work_type?.toLowerCase() === "labor" ||
                    item?.work_type?.toLowerCase() === "material & labor"
                ) {
                    laborCost += price;
                }
            });
            category.categorySum = catSum;

            if (!excludedCategories.includes(category.category?.toLowerCase())) {
                filteredProjectCost[filterKey].categorySum += catSum;
                filteredProjectCost[filterKey].materialCost += materialCost;
                filteredProjectCost[filterKey].laborCost += laborCost;
            }
            setTotalAsZero ? (category.totalSum = 0) : (category.totalSum = catSum);
        });

        // to recalculate cost for item with % uom, re-iterate all bid items
        filteredProjectCost = calculateFilteredProjectCost(groupedBidItems);
        groupedBidItem.categories.forEach((category) => {
            let catSum = 0;
            let setTotalAsZero = false;

            category?.items?.forEach((item) => {
                catSum += getPriceFromItem(item, filteredProjectCost);
                if (catSum === 0 && item?.type_of_change !== "deleted") {
                    setTotalAsZero = true;
                }
            });

            category.categorySum = catSum;
            setTotalAsZero ? (category.totalSum = 0) : (category.totalSum = catSum);
        });
    });

    //Add all categories available for renovation
    //If default price and unique price is not same for reno items
    //update that in list of floorplans in all floorplans for that item
    let categories: string[] = [];
    let total_reno_units = 0;
    groupedBidItems?.forEach((response) => {
        // initialise reno item categories based on category order in container
        // only consider all floorplans for comparing order as it contains all categories in the scope of renovation
        if (response?.fp_name === BIDDING_PORTAL?.ALL_FLOOR_PLANS) {
            //check if category already exist in the list
            categories = getCategoryInScope(
                action?.payload?.containerCategories,
                response?.categories,
                "category",
            );
            let shouldAddAlternatesToAllCategories =
                categories.findIndex((cat: string) => cat === "Alternates") > -1 ? false : true;
            if (alternateItemsCount > 0 && shouldAddAlternatesToAllCategories) {
                categories.push("Alternates");
            }
        }
        if (response?.fp_name !== BIDDING_PORTAL?.ALL_FLOOR_PLANS) {
            total_reno_units = total_reno_units + response?.total_units;
        }

        if (!organisationContainerId) {
            getSortedCategoryByContainer(categories, response?.categories, "category");
        } else {
            getSortedCustomCategoryByContainer(categories, response?.categories);
        }

        response?.categories?.forEach((category) => {
            category?.items?.forEach((item) => {
                if (response?.fp_name !== BIDDING_PORTAL?.ALL_FLOOR_PLANS) {
                    //Find this item in all Floorplan
                    let allFpItem = getAllFloorPlanItem(
                        groupedBidItems,
                        category?.category,
                        item?.reno_item_id,
                    );

                    //units left to be filled with unique prices
                    if (item?.is_unique_price && allFpItem) {
                        let unique_price =
                            item?.total_price > 0
                                ? item?.total_price / item?.quantity
                                : item?.unique_price;
                        allFpItem.unitsToBeFilled =
                            unique_price > 0
                                ? allFpItem?.unitsToBeFilled - item?.quantity
                                : allFpItem?.unitsToBeFilled;
                        allFpItem.floorplans = [
                            ...allFpItem.floorplans,
                            {
                                fp_name: item?.fp_name,
                                unique_price: unique_price,
                                isSelected: false,
                                inventory: item?.inventory_name,
                                uom: item?.uom,
                                sub_group_name: item?.sub_group_name,
                            },
                        ];
                    }
                }
            });
        });
    });
    // This will check if all Individual floorplans have been filled or not
    groupedBidItems.forEach((groupedBidItem) => {
        if (groupedBidItem.fp_name != BIDDING_PORTAL.ALL_FLOOR_PLANS) return;
        groupedBidItem.categories.forEach((category) => {
            category.items.forEach((item) => {
                let itemCount = 0;
                let reno_item_id = item.reno_item_id;
                groupedBidItems.forEach((bidItems) => {
                    let category = bidItems?.categories?.find(
                        (cat) => cat.category == item?.category,
                    );
                    if (!category || bidItems?.fp_name == BIDDING_PORTAL.ALL_FLOOR_PLANS) return;
                    else {
                        category.items.forEach((item) => {
                            if (reno_item_id?.includes(item?.reno_item_id)) {
                                itemCount++;
                            }
                        });
                    }
                });
                if (item?.floorplans?.length == itemCount) {
                    item.allFloorplansFilled = true;
                } else {
                    item.allFloorplansFilled = false;
                }
            });
        });
    });

    //find all floorplan entry in the data and update the total reno units
    // let found = groupedBidItems?.findIndex(
    //     (item) => item?.fp_name === BIDDING_PORTAL?.ALL_FLOOR_PLANS,
    // );
    // if (found !== -1) {
    //     groupedBidItems[found].total_units = total_reno_units;
    // }
    let disableSubmit = shouldDisableSubmit(groupedBidItems);
    return updateObject(state, {
        loading: false,
        error: false,
        bidItems: bidItems,
        bidItemsUpdated: [],
        groupedBidItems: groupedBidItems,
        categories: categories,
        renoUnits: result,
        disableSubmit,
        filteredProjectCost,
        inventories: Array.from(inventories),
    });
}
// To Check if all prices have been filled or not
function shouldDisableSubmit(groupedBidItems: IGroupedRfpResponseItems[]): boolean {
    let shouldDisable = false;
    groupedBidItems.every((groupedBidItem) => {
        groupedBidItem.categories.every((category) => {
            category.items.every((item) => {
                let price = getPriceFromItem(item);
                if (price === 0 && item?.type_of_change !== "deleted") {
                    shouldDisable = true;
                    return false;
                }
                return true;
            });
            if (shouldDisable) {
                return false;
            }
            return true;
        });
        if (shouldDisable) {
            return false;
        }
        return true;
    });
    return shouldDisable;
}

function checkIfSubmitShouldBeDisabled(state: IBiddingPortal) {
    let shouldDisable = false;
    state?.groupedBidItems.every((groupedBidItem) => {
        groupedBidItem.categories.every((category) => {
            category.items.every((item) => {
                if (item?.type_of_change === "DELETED") {
                    return true;
                }
                let price = getPriceFromItem(item);
                if (price === 0 && item?.type_of_change !== "deleted") {
                    shouldDisable = true;
                    return false;
                }
                return true;
            });
            if (shouldDisable) {
                return false;
            }
            return true;
        });
        if (shouldDisable) {
            return false;
        }
        return true;
    });
    return updateObject(state, {
        disableSubmit: shouldDisable,
    });
}

//eslint-disable-next-line
function fetchBidItemsFailure(
    state: IBiddingPortal,
    // eslint-disable-next-line no-unused-vars
    action: PayloadAction<any>,
) {
    return updateObject(state, {
        loading: false,
        error: true,
        bidItems: state?.bidItems,
        bidItemsUpdated: [],
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

function updatePriceInStoreIfExcludedItems(state: IBiddingPortal, action: PayloadAction<any>) {
    let groupedRfpResponseItemsUpdated = cloneDeep(state?.groupedBidItems);
    let bidItemsUpdated = cloneDeep(state?.bidItemsUpdated);
    let filteredProjectCost = cloneDeep(state?.filteredProjectCost);
    //List of reno_items to be excluded if all Floorplans has new default price
    let excludeRenoItems = action?.payload?.excludedList ?? [];
    updateBidItems(bidItemsUpdated, action);
    updateGroupedBidItems(
        bidItemsUpdated,
        groupedRfpResponseItemsUpdated,
        action,
        excludeRenoItems,
    );
    computeAllFloorplansIfResetPrice(
        bidItemsUpdated,
        groupedRfpResponseItemsUpdated,
        action,
        filteredProjectCost,
    );

    return updateObject(state, {
        bidItems: state?.bidItems,
        bidItemsUpdated: bidItemsUpdated,
        groupedBidItems: groupedRfpResponseItemsUpdated,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

function updatePriceInStore(state: IBiddingPortal, action: PayloadAction<any>) {
    let groupedBidItemsUpdated = cloneDeep(state?.groupedBidItems);
    let bidItemsUpdated = cloneDeep(state?.bidItemsUpdated);
    let filteredProjectCost = cloneDeep(state?.filteredProjectCost);
    let bidItem: IItem | undefined;
    groupedBidItemsUpdated?.forEach((groupedItem) => {
        if (
            groupedItem.fp_name !== action.payload.fp_name ||
            groupedItem.inventory_name !== action.payload.inventory ||
            groupedItem.sub_group_name !== action.payload.sub_group_name
        )
            return;
        let catIndex = groupedItem.categories.findIndex(
            (cat) => cat.category === action.payload.category,
        );
        bidItem = groupedItem.categories[catIndex].items.find(
            (item) => item.id === action.payload.id,
        );
        return;
    });
    let itemBeforeUpdate = cloneDeep(bidItem);
    updateBidItems(bidItemsUpdated, action);
    updateGroupedBidItems(bidItemsUpdated, groupedBidItemsUpdated, action, [], filteredProjectCost);
    /* The code below is to recalculate all floorplan prices
    of any indiviual floorplan changes*/
    computeAllFloorplans(
        bidItemsUpdated,
        groupedBidItemsUpdated,
        action,
        filteredProjectCost,
        itemBeforeUpdate,
    );
    return updateObject(state, {
        bidItems: state?.bidItems,
        bidItemsUpdated: bidItemsUpdated,
        groupedBidItems: groupedBidItemsUpdated,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

//eslint-disable-next-line
function syncStoreWithApiStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        bidItems: state?.bidItems,
        bidItemsUpdated: state?.bidItemsUpdated,
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

//eslint-disable-next-line
function syncStoreWithApiSuccess(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        responseSuccess: true,
        responseError: false,
        isSaving: false,
        loading: false,
        bidItems: state?.bidItems,
        bidItemsUpdated: [],
        // bidItemsUpdated: state?.bidItemsUpdated,
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}

//eslint-disable-next-line
function syncStoreWithApiFailed(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loading: false,
        error: true,
        responseError: true,
        responseSuccess: false,
        bidItems: state?.bidItems,
        bidItemsUpdated: state?.bidItemsUpdated,
        groupedBidItems: state?.groupedBidItems,
        categories: state?.categories,
        renoUnits: state?.renoUnits,
    });
}
// eslint-disable-next-line
function lockProjectForEditingStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingSession: true,
    });
}
// eslint-disable-next-line
function lockProjectForEditingComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingSession: false,
        isEditable: action.payload.isEditable,
        currentEditingUser: action.payload.user,
    });
}
// eslint-disable-next-line
function lockProjectForEditingFailure(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingSession: false,
        error: true,
        isEditable: false,
        currentEditingUser: null,
    });
}
//eslint-disable-next-line
function unlockProjectForEditingComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingSession: false,
        isEditable: false,
        currentEditingUser: null,
    });
}
//eslint-disable-next-line
function unlockProjectForEditingStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingSession: true,
    });
}
//eslint-disable-next-line
function unlockProjectForEditingFailure(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingSession: false,
        error: true,
    });
}

//eslint-disable-next-line
function enableIdleMode(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        isIdle: true,
    });
}

//eslint-disable-next-line
function markOffline(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        isOffline: true,
    });
}

//eslint-disable-next-line
function markOnline(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        isOffline: false,
    });
}

//eslint-disable-next-line
function createAlternateItemStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: true,
        loadingMessage: "Please wait, Creating Alternate items",
        responseSuccess: false,
        responseError: false,
        syncTimeout: false,
        isSaving: true,
    });
}
//eslint-disable-next-line
function createAlternateItemComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    let groupedBidItems = cloneDeep(state.groupedBidItems);
    let bidItems: IRfpResponseItems[] = action.payload.items;
    // Map bid items with an additional attribute called as display_category to find the display category
    // and put items which have is_alternate as true to Alternates on FE
    bidItems = bidItems?.map((item) =>
        item?.is_alternate
            ? {
                  ...item,
                  display_category: "Alternates",
              }
            : { ...item, display_category: item.category },
    );

    //Exclude all Floorplans bid items
    let bidItemsWithoutAllFloorplan = bidItems?.filter(
        (r: IRfpResponseItems) =>
            r?.floor_plan_id !== "ALL" && r?.total_units > 0 && r?.inventory_name !== null,
    );

    // Filter out only all Floorplans bid items
    let bidItemsWithAllFloorplans = bidItems?.filter(
        (r: { floor_plan_id: string; quantity: number }) => r?.floor_plan_id === "ALL",
    );

    let shouldUpdateCategories = !state.categories.find((cat) => cat === "Alternates");
    let newCategories = [...state.categories];
    if (shouldUpdateCategories) {
        newCategories.push("Alternates");
    }

    const groupedAlternateItems = groupBy(bidItemsWithoutAllFloorplan, [
        "fp_name",
        "inventory_name",
        "sub_group_name",
    ]);

    const groupedRfpResponseItemsByCategory = groupByCategory(bidItemsWithAllFloorplans);
    groupedBidItems.forEach((bidFloorItem) => {
        if (bidFloorItem.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS) {
            let alternatesCategory = bidFloorItem.categories.find(
                (category) => category.category === "Alternates",
            );
            if (!alternatesCategory) {
                let category = bidFloorItem.categories.find((cat) => {
                    //@ts-ignore
                    return cat.category === groupedRfpResponseItemsByCategory[0].items[0].category;
                });
                //@ts-ignore
                let item = category?.items.find((item) => {
                    return (
                        item?.reno_item_id ===
                        //@ts-ignore
                        groupedRfpResponseItemsByCategory[0].items[0]?.reno_item_id
                    );
                });
                //@ts-ignore
                item && (item.alternate_item_ref = groupedRfpResponseItemsByCategory[0].items[0]);
                bidFloorItem.categories.push((groupedRfpResponseItemsByCategory as any)[0]);
            } else {
                bidFloorItem.categories.forEach((cat) => {
                    if (
                        cat.category !== "Alternates" &&
                        (groupedRfpResponseItemsByCategory[0] as any).items[0]?.category ===
                            cat.category
                    ) {
                        let alternateItem = (groupedRfpResponseItemsByCategory[0] as any).items[0];
                        let originalItem = cat.items?.find((item) => {
                            return item.reno_item_id === alternateItem.reno_item_id;
                        });
                        // If Original Item exists , Create a link
                        originalItem && (originalItem.alternate_item_ref = alternateItem);
                    } else if (cat.category === "Alternates") {
                        // If alternate Category exists , push the item onto items list and compute categorySum
                        let item = (groupedRfpResponseItemsByCategory[0] as any).items[0];
                        cat.items.push(item as any);
                    }
                });
            }
        } else {
            // Find floor where fp_name & inv_name & sub_group_name matches
            let floorplan = groupedAlternateItems.find(
                (item) =>
                    item.fp_name === bidFloorItem.fp_name &&
                    item.inventory_name === bidFloorItem.inventory_name &&
                    item.sub_group_name === bidFloorItem.sub_group_name,
            );
            if (!floorplan) {
                return;
            }
            let alternateItem = floorplan.categories[0].items[0];
            let alternatesCategory = bidFloorItem.categories.find(
                (category) => category.category === "Alternates",
            );
            if (!alternatesCategory) {
                bidFloorItem.categories.forEach((category) => {
                    // Find the original category and compute alternateSum
                    if (category.category === alternateItem.category) {
                        let originalItem = category.items.find(
                            (item) => item.reno_item_id === alternateItem.reno_item_id,
                        );
                        originalItem && (originalItem.alternate_item_ref = alternateItem);
                    }
                    return;
                });
                // Push the entire Category obj if Alternates doesn't exist
                bidFloorItem.categories.push(floorplan.categories[0]);
            } else if (alternatesCategory) {
                bidFloorItem.categories.forEach((category) => {
                    // If the category is not alternate category and it is the original category of the alternate item
                    if (
                        category.category !== "Alternates" &&
                        alternateItem.category === category.category
                    ) {
                        let originalItem = category.items.find(
                            (item) => item.reno_item_id === alternateItem.reno_item_id,
                        );
                        // create a ref to alt item
                        originalItem && (originalItem.alternate_item_ref = alternateItem);
                    } else if (category.category === "Alternates") {
                        // If the category is alternate , then push the item to the items list
                        category.items.push(alternateItem);
                        category.categorySum += getPriceFromItem(alternateItem);
                    }
                });
            }
        }
    });

    groupedBidItems = updateValuesWithNewAltSum(groupedBidItems);
    return updateObject(state, {
        loadingOperation: false,
        categories: newCategories,
        groupedBidItems,
        loadingMessage: undefined,
        responseSuccess: true,
        responseError: false,
        syncTimeout: false,
        isSaving: false,
    });
}
//eslint-disable-next-line
function createAlternateItemFailed(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: false,
        error: true,
        loadingMessage: undefined,
    });
}

//eslint-disable-next-line
function deleteAlternateItemStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: true,
        loadingMessage: "Please wait, Deleting Alternate items",
        responseSuccess: false,
        responseError: false,
        syncTimeout: false,
        isSaving: true,
    });
}
function deleteAlternateItemComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    const reno_item_id = action.payload.reno_item_id;
    let categories = cloneDeep(state.categories);
    let shouldNavigateBack: boolean | undefined = undefined;
    let groupedBidItems = cloneDeep(state.groupedBidItems);
    groupedBidItems = groupedBidItems?.map((bidItems) => {
        let alternatesCategoryIndex = bidItems?.categories?.findIndex(
            (category) => category.category === "Alternates",
        );
        // If alternate Category exists
        if (alternatesCategoryIndex > -1) {
            let itemToRemove = bidItems?.categories[alternatesCategoryIndex].items?.find(
                (item) => item.reno_item_id === reno_item_id,
            );
            // Alternates after removing item
            let filteredAlternates = bidItems?.categories[alternatesCategoryIndex].items?.filter(
                (item) => item.reno_item_id !== reno_item_id,
            );
            // If item exists
            if (itemToRemove) {
                // Find its original category
                let originalCategory = bidItems.categories?.find(
                    (category) => category.category === itemToRemove?.category,
                );
                // Item to which it is Alt for
                let originalItem = originalCategory?.items.find((item) => {
                    return item.reno_item_id === itemToRemove?.reno_item_id;
                });
                if (originalItem && originalCategory) {
                    // unlink items
                    originalItem.alternate_item_ref = undefined;
                }
            }
            // If there are no other alternate items, we remove the items from the list
            if (filteredAlternates.length === 0) {
                bidItems.categories.splice(alternatesCategoryIndex, 1);
                shouldNavigateBack === undefined && (shouldNavigateBack = true);
            } else {
                shouldNavigateBack = false;
                // In The alternates category we remove the item and reduce category sum
                bidItems.categories[alternatesCategoryIndex].items = filteredAlternates;
                bidItems.categories[alternatesCategoryIndex].categorySum -=
                    getPriceFromItem(itemToRemove);
                // Update alternate category total sum if item is deleted
                bidItems.categories[alternatesCategoryIndex].items.every((item) => {
                    let price = getPriceFromItem(item);
                    if (price === 0 && item?.type_of_change !== "deleted") {
                        bidItems.categories[alternatesCategoryIndex].totalSum = 0;
                        return false;
                    }
                    bidItems.categories[alternatesCategoryIndex].totalSum += price;
                    return true;
                });
            }
        }
        return bidItems;
    });
    groupedBidItems = updateValuesWithNewAltSum(groupedBidItems);
    // if there are no items in alternates, we go back to the price summary page
    if (shouldNavigateBack) {
        categories = categories.filter((category) => category !== "Alternates");
        if (action.payload.isAdminAccess) {
            action.payload.navigate(
                ROUTES.SUMMARY_TABLE_ADMIN(
                    action.payload.role,
                    action.payload.userID!,
                    action.payload.projectId!,
                    action.payload.orgId,
                    action.payload.version,
                    action.payload.isLatest ? "&isLatest=true" : "&isLatest=false",
                ),
                {
                    isAdminAccess: action.payload.isAdminAccess,
                },
            );
        } else
            action.payload.navigate(
                ROUTES.SUMMARY_TABLE(
                    action.payload.role,
                    action.payload.userID!,
                    action.payload.projectId!,
                ),
            );
    }
    return updateObject(state, {
        loadingOperation: false,
        groupedBidItems,
        categories,
        loadingMessage: undefined,
        responseSuccess: true,
        responseError: false,
        syncTimeout: false,
        isSaving: false,
    });
}
//eslint-disable-next-line
function deleteAlternateItemFailed(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: false,
        error: true,
        loadingMessage: undefined,
    });
}

//eslint-disable-next-line
function editAlternateItemStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: true,
        loadingMessage: "Please wait, Updating Alternate item",
        responseSuccess: false,
        responseError: false,
        syncTimeout: false,
        isSaving: true,
    });
}

//eslint-disable-next-line
function editAlternateItemComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    const { reno_item_id, manufacturer, model_no, description, reason } = action.payload;
    let groupedBidItems = cloneDeep(state.groupedBidItems);
    groupedBidItems?.map((bidItems) => {
        let alternatesCategoryIndex = bidItems?.categories?.findIndex(
            (category) => category.category === "Alternates",
        );
        if (alternatesCategoryIndex > -1) {
            bidItems.categories[alternatesCategoryIndex].items.forEach((item) => {
                if (item.reno_item_id === reno_item_id) {
                    item.manufacturer = manufacturer;
                    item.model_no = model_no;
                    item.description = description;
                    item.reason = reason;
                }
            });
        }
        return bidItems;
    });
    return updateObject(state, {
        loadingOperation: false,
        groupedBidItems,
        loadingMessage: undefined,
        responseSuccess: true,
        responseError: false,
        syncTimeout: false,
        isSaving: false,
    });
}
//eslint-disable-next-line
function editAlternateItemFailed(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: false,
        error: true,
        loadingMessage: undefined,
    });
}
//eslint-disable-next-line
function updateSyncTimerStatesStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        responseSuccess: false,
        responseError: false,
        syncTimeout: false,
        isSaving: false,
    });
}

//eslint-disable-next-line
function updateSyncTimerOnFocusOut(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        responseSuccess: false,
        responseError: false,
        syncTimeout: false,
        isSaving: true,
    });
}

//eslint-disable-next-line
function updateSyncTimerOnTimeout(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        ...state,
        responseSuccess: false,
        responseError: false,
        syncTimeout: true,
        isSaving: false,
    });
}

//eslint-disable-next-line
function updateSyncTimerStates(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        syncTimeout: true,
    });
}

function toggleConsiderAlternates(
    state: IBiddingPortal,
    action: PayloadAction<{ value: boolean }>,
) {
    return updateObject(state, {
        considerAlternates: action.payload.value,
    });
}

function setSelectedVersion(state: IBiddingPortal, action: PayloadAction<string>) {
    return updateObject(state, {
        selectedVersion: action.payload,
    });
}

// eslint-disable-next-line
function combineLineItemsStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingOperation: true, loadingMessage: "Combining Line items" });
}
// After getting Parent item, Combine all children into a key and put it inside & also update Price
function combineLineItemsComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    let parentItems = action.payload.parentItems;
    let groupedBidItems = cloneDeep(state.groupedBidItems);
    let allFpItems: IItem[] = action.payload.allFpItems;
    let cat = action.payload.category;
    let reno_item_ids: Array<String> = [];

    allFpItems.forEach((item) => {
        let r_ids = item.reno_item_id.split("#");
        for (let r_id of r_ids) {
            if (r_id) {
                reno_item_ids.push(r_id);
            }
        }
        if (item.reno_item_id.includes("#")) {
            reno_item_ids.push(item.reno_item_id);
        }
    });

    //Exclude all Floorplans reno items
    let responseWithoutAllFp = parentItems?.filter(
        (r: IRfpResponseItems) =>
            r?.floor_plan_id !== "ALL" && r?.total_units > 0 && r?.inventory_name !== null,
    );

    // Filter out only all Floorplans reno items
    let allFpParentBidItem = parentItems?.filter(
        (r: { floor_plan_id: string; quantity: number }) => r?.floor_plan_id === "ALL",
    );
    //Group by floor_plan + inventory+ categories
    let groupedParentBidItems: IGroupedRfpResponseItems[] = groupBy(responseWithoutAllFp, [
        "fp_name",
        "inventory_name",
        "sub_group_name",
    ]);
    const groupedRfpResponseItemsByCategory = groupByCategory(allFpParentBidItem);
    let newRow: any = {
        fp_name: BIDDING_PORTAL.ALL_FLOOR_PLANS,
        inventory_name: "",
        sub_group_name: "",
        categories: groupedRfpResponseItemsByCategory,
    };

    //Append all floorplans with each floorplan list
    groupedParentBidItems = [newRow, ...groupedParentBidItems];

    // for Each FP, find the parent Element & Push it into its respective Floorplan
    groupedBidItems.forEach((groupedBidItem) => {
        let category = groupedBidItem.categories.find((category) => category.category === cat);
        if (!category) {
            return;
        }
        let childrenItems = category?.items?.filter((item) =>
            includes(reno_item_ids, item.reno_item_id),
        );
        category.items = category?.items?.filter(
            (item) => !includes(reno_item_ids, item.reno_item_id),
        );
        let item: IItem | null = null;
        groupedParentBidItems.every((groupParentBidItem) => {
            if (
                groupParentBidItem.fp_name === groupedBidItem.fp_name &&
                groupParentBidItem.inventory_name === groupedBidItem.inventory_name &&
                groupParentBidItem.sub_group_name === groupedBidItem.sub_group_name
            ) {
                item = groupParentBidItem.categories[0].items[0];
                return false;
            } else if (
                groupParentBidItem.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS &&
                BIDDING_PORTAL.ALL_FLOOR_PLANS == groupedBidItem.fp_name
            ) {
                item = groupParentBidItem.categories[0].items[0];
                return false;
            }
            return true;
        });
        if (item === null) {
            return;
        }
        childrenItems.forEach((it) => {
            it.parent_bid_item_id = item?.id;
            // item && (item.inventory_name = it?.inventory_name);
        });
        item = item as IItem;
        item.children = childrenItems;

        category.items.push(item);
    });

    // Recompute the price of the elements
    groupedBidItems.forEach((bidItem) => {
        bidItem.categories.forEach((category) => {
            let totalSum = 0;
            let incompleteSum = false;
            category.items.forEach((item) => {
                let price = getPriceFromItem(item);
                totalSum += price;
                if (price === 0 && item?.type_of_change !== "deleted") {
                    incompleteSum = true;
                }
            });
            // Verify this with @PoulomiGhosh1308
            category.categorySum = totalSum;
            category.totalSum = incompleteSum ? 0 : totalSum;
        });
    });

    return updateObject(state, { loadingOperation: false, groupedBidItems });
}

// eslint-disable-next-line
function combineLineItemsFailed(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingOperation: false, error: true });
}

// eslint-disable-next-line
function uncombineLineItemsStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: true,
        loadingMessage: "Uncombining line items",
    });
}
// After Removing Parent item, unCombine all children and put back into category & Recalculate the sum
// eslint-disable-next-line
function uncombineLineItemsComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    let groupedBidItems = cloneDeep(state.groupedBidItems);
    let id = action.payload.id;
    let item: IItem | undefined = undefined;
    let category = action.payload.category;
    // Finding the item which was sent to be uncombined
    groupedBidItems.forEach((groupedBidItem) => {
        let cat = groupedBidItem.categories.find((cat) => cat.category === category);
        item = item ? item : cat?.items.find((it) => it.id.includes(id));
    });
    if (!item) {
        return updateObject(state, { loadingOperation: false });
    }
    // If there exists an parent element, pluck children element & push them back onto elements array
    groupedBidItems.forEach((bidItem) => {
        bidItem.categories.forEach((category) => {
            let index = category.items.findIndex((it) => {
                return item?.reno_item_id.includes(it.reno_item_id);
            });
            if (index < 0) {
                return;
            }
            let children = category.items[index]?.children;
            children?.forEach((child) => {
                child.parent_bid_item_id = undefined;
                child.total_price = 0;
                child.default_price = 0;
                child.unique_price = 0;
                child.is_unique_price = false;
            });
            category.items.splice(index, 1, ...(children ?? []));
        });
    });

    // Recompute the price of the elements
    groupedBidItems.forEach((bidItem) => {
        bidItem.categories.forEach((category) => {
            let totalSum = 0;
            let incompleteSum = false;
            category.items.forEach((item) => {
                let price = getPriceFromItem(item);
                totalSum += price;
                if (price === 0 && item?.type_of_change !== "deleted") {
                    incompleteSum = true;
                }
            });
            // Verify this with @PoulomiGhosh1308
            category.categorySum = totalSum;
            category.totalSum = incompleteSum ? 0 : totalSum;
        });
    });

    return updateObject(state, { groupedBidItems });
}

// eslint-disable-next-line
function uncombineLineItemsEnd(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingOperation: false });
}

//eslint-disable-next-line
function updateExcelFileDetails(state: IExcelFileDetails, action: PayloadAction<any>) {
    const { eventId, eventName, floorplanName, projectId, projectName, bidStatus } = action.payload;
    return updateObject(state, {
        eventId,
        eventName,
        floorplanName,
        projectId,
        projectName,
        bidStatus,
    });
}

//eslint-disable-next-line
function updateUnitOfMeasureStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingOperation: true, loadingMessage: "Updating uom..." });
}

//eslint-disable-next-line
function updateUnitOfMeasureSuccess(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingOperation: false, loadingMessage: "Update UOM success" });
}

//eslint-disable-next-line
function updateUnitOfMeasureFailure(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingOperation: false, loadingMessage: "Update UOM failed" });
}
//eslint-disable-next-line
function updateComboNameStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: true,
        loadingMessage: "Updating combination name",
    });
}

//eslint-disable-next-line
function updateComboNameEnd(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingOperation: false,
        loadingMessage: undefined,
    });
}

//eslint-disable-next-line
function updateComboNameFailure(state: IBiddingPortal) {
    return updateObject(state, {
        loadingOperation: false,
        error: true,
        loadingMessage: undefined,
    });
}

function updateComboNameComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    let groupedBidItems = cloneDeep(state.groupedBidItems);
    let id = action.payload.id;
    let item: IItem | undefined = undefined;
    let category = action.payload.category;
    let comboName = action.payload.comboName;
    // Finding the item which was sent to be renamed
    groupedBidItems.forEach((groupedBidItem) => {
        let cat = groupedBidItem.categories.find((cat) => cat.category === category);
        item = item ? item : cat?.items.find((it) => it.id.includes(id));
    });
    if (!item) {
        return updateObject(state, { loadingOperation: false });
    }
    // If there exists an parent element with this reno_item_id, Rename it to combo name
    groupedBidItems.forEach((bidItem) => {
        bidItem.categories.forEach((category) => {
            let index = category.items.findIndex((it) => {
                return item?.reno_item_id.includes(it.reno_item_id);
            });
            if (index < 0) {
                return;
            }
            category.items[index].combo_name = comboName;
        });
    });

    return updateObject(state, { groupedBidItems });
}

function updateFilteredProjectCost(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { filteredProjectCost: action.payload.filteredProjectCost });
}
//eslint-disable-next-line
function fetchDiffFromRenovationVersionStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return state;
}
//eslint-disable-next-line
function fetchDiffFromRenovationVersionComplete(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        itemChangeLog: action.payload.itemChangeLog,
        quantityChangeLog: action.payload.quantityChangeLog,
    });
}
//eslint-disable-next-line
function fetchHistoricalPricingDataStart(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, { loadingHistoricalData: true });
}

function fetchHistoricalPricingDataEnd(state: IBiddingPortal, action: PayloadAction<any>) {
    return updateObject(state, {
        loadingHistoricalData: false,
        historicalPricingData: action.payload?.historicalPricingData,
    });
}

// eslint-disable-next-line no-unused-vars
function resetBidItems(state: IBiddingPortal, action: PayloadAction<any>) {
    return initState;
}

const slice = createSlice({
    initialState: initState,
    name: "rfp_bidding_portal",
    reducers: {
        createBidItemsForContractorStart,
        createBidItemsForContractorSuccess,
        fetchBidItemsStart,
        fetchBidItemsHistoryStart,
        fetchBidItemsSuccess,
        fetchBidItemsFailure,
        updatePriceInStore,
        updatePriceInStoreIfExcludedItems,
        syncStoreWithApiStart,
        syncStoreWithApiSuccess,
        syncStoreWithApiFailed,
        lockProjectForEditingStart,
        lockProjectForEditingFailure,
        lockProjectForEditingComplete,
        unlockProjectForEditingComplete,
        unlockProjectForEditingStart,
        unlockProjectForEditingFailure,
        enableIdleMode,
        markOffline,
        markOnline,
        createAlternateItemComplete,
        createAlternateItemFailed,
        createAlternateItemStart,
        editAlternateItemStart,
        editAlternateItemComplete,
        editAlternateItemFailed,
        deleteAlternateItemComplete,
        deleteAlternateItemFailed,
        deleteAlternateItemStart,
        updateSyncTimerStates,
        updateSyncTimerStatesStart,
        updateSyncTimerOnFocusOut,
        updateSyncTimerOnTimeout,
        toggleConsiderAlternates,
        setSelectedVersion,
        checkIfSubmitShouldBeDisabled,
        combineLineItemsComplete,
        combineLineItemsFailed,
        combineLineItemsStart,
        uncombineLineItemsComplete,
        uncombineLineItemsEnd,
        uncombineLineItemsStart,
        updateExcelFileDetails,
        updateUnitOfMeasureStart,
        updateUnitOfMeasureSuccess,
        updateUnitOfMeasureFailure,
        updateComboNameComplete,
        updateComboNameFailure,
        updateComboNameStart,
        updateComboNameEnd,
        updateFilteredProjectCost,
        fetchDiffFromRenovationVersionStart,
        fetchDiffFromRenovationVersionComplete,
        fetchHistoricalPricingDataStart,
        fetchHistoricalPricingDataEnd,
        resetBidItems,
    },
});

export default slice;
export const actions = slice.actions;
export const reducer = slice.reducer;
