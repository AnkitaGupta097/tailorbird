import { PayloadAction } from "@reduxjs/toolkit";
import { BIDDING_PORTAL } from "modules/rfp-manager/common/constants";
import { IGroupedRfpResponseItems, IItem, IRfpResponseItems } from "./bidding-portal-models";
import { isEmpty } from "lodash";

export const updateBidItems = (
    bidItemsUpdated: IRfpResponseItems[],
    action: PayloadAction<any>,
) => {
    // update bidItemsUpdated state
    //if is_unique_price is false then updated price for all items with same reno_item_id
    //TODO: Update is_price_updated field
    let item: IRfpResponseItems = {} as any;
    item.is_historical_price = action.payload.is_historical_price;
    item.is_revised_price = action.payload.type_of_change === "updated";
    if (!action?.payload?.is_unique_price) {
        item.id = action.payload.id;
        item.is_unique_price = action?.payload?.is_unique_price;
        item.default_price = parseFloat(action?.payload?.default_price);
        item.total_price = parseFloat(action?.payload?.total_price);
        item.unique_price = parseFloat(action?.payload?.unique_price);
        item.price_expression = action?.payload?.price_expression;
        //Individual floorplan total price = All Floorplan total price / individual floorplan quantity
        //If unique price is being overriden by default price then make unique price as 0
        if (action?.payload?.default_price > 0) item.unique_price = 0;
        // }
    } else {
        item.id = action.payload.id;
        item.unique_price = parseFloat(action?.payload?.unique_price);
        item.is_unique_price = action?.payload?.is_unique_price;
        item.total_price = parseFloat(action?.payload?.total_price);
        item.default_price = parseFloat(action?.payload?.default_price);
        item.price_expression = action?.payload?.price_expression;
    } // One item
    bidItemsUpdated.push(item);
};

export const updateGroupedBidItems = (
    bidItemsUpdated: IRfpResponseItems[],
    groupedRfpResponseItemsUpdated: IGroupedRfpResponseItems[],
    action: PayloadAction<any>,
    excludeRenoItems: any,
    filteredProjectCost?: any,
) => {
    //Update groupedRfpResponseItem state
    groupedRfpResponseItemsUpdated?.forEach((response: IGroupedRfpResponseItems) => {
        let category = response?.categories?.filter(
            (list: { category: any }) => list.category === action?.payload?.category,
        );
        if (category?.length > 0) {
            let items = category[0]?.items?.filter((item: { reno_item_id: any }) =>
                action?.payload?.reno_item_id.includes(item?.reno_item_id),
            );
            //check if item is exluded from updating price or not
            for (const item of items) {
                let isItemExcluded = excludeRenoItems?.some(
                    (renoItem: { fp_name: string }) =>
                        renoItem?.fp_name === response?.fp_name &&
                        action?.payload?.reno_item_id.includes(item?.reno_item_id),
                );
                // if item is not in excluded list only then update price.
                if (!isItemExcluded)
                    if (!action?.payload?.is_unique_price && item) {
                        /* 
        The below condition should satisfy following use-cases 
        1. action?.payload?.is_unique_price is false = default price
            a.action?.payload?.default_price = <value> and action?.payload?.total_price = 0
            b.action?.payload?.total_price = <value> and action?.payload?.default_price = 0
            c.action?.payload?.unique_price will always be 0 since you can never update unique price if action?.payload?.is_unique_price is false

        2. action?.payload?.is_unique_price is true = unique price
            (Check if the item is the same item for which the unique price was added, i.e same fp , inv , subgroup)
            a.action?.payload?.unique_price = <value> and action?.payload?.total_price = 0
            b.action?.payload?.total_price = <value> and action?.payload?.unique_price = 0
            c.action?.payload?.default_price will always be 0 since action?.payload?.is_unique_price = true


        */
                        item.default_price = parseFloat(action?.payload?.default_price);
                        item.total_price = parseFloat(action?.payload?.total_price);
                        item.unique_price = parseFloat(action?.payload?.unique_price);
                        item.is_unique_price = action?.payload?.is_unique_price;
                        item.is_historical_price = action.payload.is_historical_price;
                        item.price_expression = action?.payload?.price_expression;
                        item?.type_of_change === "updated" && (item.is_revised_price = true);
                        //Individual floorplan total price = All Floorplan total price / individual floorplan quantity
                        if (
                            action?.payload?.total_price > 0 &&
                            action?.payload?.default_price === 0
                        ) {
                            if (item.fp_name !== BIDDING_PORTAL.ALL_FLOOR_PLANS) {
                                item.total_price = parseFloat(
                                    (
                                        (action?.payload?.total_price /
                                            (action?.payload?.specific_quantity ??
                                                action?.payload?.quantity)) *
                                        (item?.specific_quantity ?? item?.quantity)
                                    )?.toFixed(6),
                                );
                                //If unique price is being overriden by default price then make unique price as 0
                                if (action?.payload?.default_price > 0) {
                                    item.unique_price = 0;
                                }
                            }
                        }
                        let index = checkIfBidItemExist(bidItemsUpdated, item.id);
                        if (index !== -1) {
                            bidItemsUpdated[index].default_price = item.default_price;
                            bidItemsUpdated[index].total_price = item.total_price;
                            bidItemsUpdated[index].unique_price = item.unique_price;
                            bidItemsUpdated[index].is_unique_price = item.is_unique_price;
                            bidItemsUpdated[index].is_historical_price = item.is_historical_price;
                            bidItemsUpdated[index].price_expression = item.price_expression;
                            item?.type_of_change === "updated" &&
                                (bidItemsUpdated[index].is_revised_price = true);
                        } else {
                            bidItemsUpdated.push({
                                id: item.id,
                                default_price: item.default_price,
                                total_price: item.total_price,
                                unique_price: item.unique_price,
                                is_unique_price: item.is_unique_price,
                                is_historical_price: item.is_historical_price,
                                price_expression: item.price_expression,
                                is_revised_price: item.type_of_change === "updated" ? true : false,
                            } as any);
                        }
                    } else if (
                        action?.payload?.is_unique_price &&
                        response.fp_name === action?.payload?.fp_name &&
                        response.sub_group_name === action?.payload?.sub_group_name &&
                        response.inventory_name === action.payload.inventory &&
                        item
                    ) {
                        item.default_price = parseFloat(action?.payload?.default_price);
                        item.total_price = parseFloat(action?.payload?.total_price);
                        item.unique_price = parseFloat(action?.payload?.unique_price);
                        item.is_unique_price = action?.payload?.is_unique_price;
                        item.is_historical_price = action.payload.is_historical_price;
                        item.price_expression = action.payload?.price_expression;
                        item?.type_of_change === "updated" && (item.is_revised_price = true);
                    }
            }
            // calculate category sum
            let sum = 0;
            //If any item is without price for the given category then reset the value of totalSum to 0
            let isIncomplete = category[0]?.items?.some((item: IItem) => {
                if (item?.type_of_change === "updated" && !item?.is_revised_price) {
                    return true;
                }
                return (
                    item?.unique_price === 0 &&
                    item?.default_price === 0 &&
                    item?.total_price === 0 &&
                    item?.type_of_change !== "deleted"
                );
            });

            //calculate the total price for a category
            category[0]?.items?.forEach((item: any) => {
                // sending payload to accomodate percentage cost
                sum = sum + getPriceFromItem(item, filteredProjectCost);
            });
            //update category sum
            category[0] && (category[0].categorySum = sum);
            //total sum & alt sum should not be updated if there are incomplete price items
            if (isIncomplete) {
                category[0].totalSum = 0;
            } else category[0].totalSum = sum;

            // Update Alternate item ref
            if (action.payload.category === "Alternates") {
                let alternateItem = category?.[0]?.items.find(
                    (item: { id: any }) => item?.id === action.payload.id,
                );
                let originalCategory = response?.categories.find(
                    (category: { category: any }) => category.category === alternateItem?.category,
                );
                let originalItem = originalCategory?.items?.find(
                    (item: { reno_item_id: any }) =>
                        item.reno_item_id === alternateItem?.reno_item_id,
                );
                if (originalItem) {
                    originalItem.alternate_item_ref = alternateItem;
                }
            }
        }
        return response;
    });
};

export const getPriceFromItem = (item?: IItem, filteredProjectCost?: any) => {
    if (
        !item ||
        item?.type_of_change === "deleted" ||
        (!item.is_revised_price && item?.type_of_change === "updated")
    ) {
        return 0;
    }

    // to calculate based on % value for items with % as uom
    if (
        (item?.uom?.toLowerCase() === "percentage" ||
            item?.specific_uom?.toLowerCase() === "percentage") &&
        !isEmpty(filteredProjectCost)
    ) {
        const filterKey =
            item?.fp_name +
            (item.fp_name?.toLowerCase() === "all floor plans" ? "" : item?.inventory_name ?? "") +
            (item?.sub_group_name ?? "");

        const isCombinedItem = item?.type?.toLowerCase() === "combined";

        const baseAmount =
            item?.subcategory?.toLowerCase().includes("tax on labor") && !isCombinedItem
                ? filteredProjectCost[filterKey]?.laborCost
                : item?.subcategory?.toLowerCase().includes("tax on material") && !isCombinedItem
                ? filteredProjectCost[filterKey]?.materialCost
                : filteredProjectCost[filterKey]?.categorySum;

        const price =
            item?.unique_price > 0
                ? (baseAmount * item?.unique_price) / 100
                : item?.default_price > 0
                ? (baseAmount * item?.default_price) / 100
                : 0;

        return price;
    }

    return item?.total_price > 0
        ? item?.total_price
        : item?.unique_price > 0
        ? item?.unique_price * (item?.specific_quantity ?? item?.quantity)
        : item?.default_price * (item?.specific_quantity ?? item?.quantity);
};

export const computeAllFloorplans = (
    bidItemsUpdated: IRfpResponseItems[],
    groupedRfpResponseItemsUpdated: IGroupedRfpResponseItems[],
    action: PayloadAction<any>,
    filteredProjectCost: {
        [index: string]: {
            categorySum: number;
            laborCost: number;
            materialCost: number;
        };
    },
    itemBeforeUpdate?: IItem,
) => {
    let allFloorPlan = getAllFloorPlanItem(
        groupedRfpResponseItemsUpdated,
        action?.payload?.category,
        action?.payload?.reno_item_id,
    );

    if (!action?.payload?.is_unique_price) {
        allFloorPlan.floorplans = [];
    }
    //If unique price change then calculate average price and populate floorplans with unique price
    else if (action?.payload?.is_unique_price) {
        let allFloorPlanCategory = getAllFloorPlanCategory(
            groupedRfpResponseItemsUpdated,
            action?.payload?.category,
        );
        let new_fp_unit_price =
            action?.payload?.unique_price !== 0
                ? action?.payload?.unique_price
                : action?.payload?.total_price /
                  (action?.payload?.specific_quantity ?? action?.payload?.quantity);
        new_fp_unit_price = parseFloat(new_fp_unit_price.toFixed(6));
        let allFloorPlanCurrentUnitPrice =
            allFloorPlan?.total_price > 0
                ? parseFloat(
                      (
                          allFloorPlan?.total_price /
                          (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity)
                      )?.toFixed(6),
                  )
                : allFloorPlan?.unique_price > 0
                ? allFloorPlan?.unique_price
                : allFloorPlan?.default_price;

        //calculate new average price for all floorplan
        /* 
        1. Unique price is entered for first time
        2. Unique price is modified again
        */
        //This is price to be removed from current total price
        let priceToBeRemoved =
            allFloorPlan?.default_price > 0
                ? allFloorPlan?.default_price
                : allFloorPlan?.total_price /
                  (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
        //If floorplan is already present in unique list of floorplans

        if (
            allFloorPlan?.floorplans?.some(
                (unique_fp) => unique_fp?.fp_name === action?.payload?.fp_name,
            )
        ) {
            //find previous unique price
            let index = allFloorPlan?.floorplans?.findIndex(
                (unique_fp) => unique_fp?.fp_name === action?.payload?.fp_name,
            );
            if (index !== -1) {
                priceToBeRemoved = allFloorPlan?.floorplans[index]?.unique_price;
            }
        }
        if (
            itemBeforeUpdate?.fp_name !== BIDDING_PORTAL.ALL_FLOOR_PLANS &&
            allFloorPlan.is_historical_price
        ) {
            priceToBeRemoved =
                itemBeforeUpdate?.is_historical_price &&
                !bidItemsUpdated.find((item) => item.id === action.payload.id)?.is_historical_price
                    ? allFloorPlan.default_price
                    : itemBeforeUpdate!.default_price ?? itemBeforeUpdate!.unique_price;
            if (allFloorPlan.floorplans?.length === 0 || !allFloorPlan.floorplans)
                allFloorPlan.floorplans = [
                    {
                        fp_name: action?.payload?.fp_name,
                        unique_price: action.payload.unique_price,
                        isSelected: false,
                        inventory: action.payload?.inventory,
                        uom: action.payload?.uom,
                        sub_group_name: action.payload?.sub_group_name,
                    },
                ];
            else {
                let index = allFloorPlan.floorplans.findIndex(
                    (fpi) =>
                        fpi.fp_name === action.payload.fp_name &&
                        fpi.inventory === action.payload.inventory &&
                        fpi.sub_group_name === action.payload.sub_group_name,
                );
                if (index === -1) {
                    allFloorPlan.floorplans.push({
                        fp_name: action?.payload?.fp_name,
                        unique_price: action.payload.unique_price,
                        isSelected: false,
                        inventory: action.payload?.inventory,
                        uom: action.payload?.uom,
                        sub_group_name: action.payload?.sub_group_name,
                    });
                } else {
                    allFloorPlan.floorplans[index] = {
                        fp_name: action?.payload?.fp_name,
                        unique_price: action.payload.unique_price,
                        isSelected: false,
                        inventory: action.payload?.inventory,
                        uom: action.payload?.uom,
                        sub_group_name: action.payload?.sub_group_name,
                    };
                }
            }
        }
        //calculate average price
        //(Previous average price * Total quantity - (Old price * Old total quantity) + (New price * New total quantity)) / Total quantity
        let fp_unit = action?.payload?.total_units;
        let average_price =
            (allFloorPlanCurrentUnitPrice *
                (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity) -
                priceToBeRemoved *
                    (action?.payload?.specific_quantity ?? action?.payload?.quantity) *
                    fp_unit +
                new_fp_unit_price *
                    (action?.payload?.specific_quantity ?? action?.payload?.quantity) *
                    fp_unit) /
            (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
        updateAllFloorplansWithUniqueValue(allFloorPlan, action, new_fp_unit_price);

        //update category sum if average price
        let catSum = 0;
        const filterKey =
            allFloorPlan?.fp_name +
            (allFloorPlan.fp_name?.toLowerCase() === "all floor plans"
                ? ""
                : allFloorPlan?.inventory_name ?? "") +
            (allFloorPlan?.sub_group_name ?? "");
        if (allFloorPlan?.specific_uom === "percentage" || allFloorPlan?.uom === "percentage") {
            const isCombinedItem = allFloorPlan?.type?.toLowerCase() === "combined";

            const baseAmount =
                allFloorPlan?.subcategory?.toLowerCase().includes("tax on labor") && !isCombinedItem
                    ? filteredProjectCost[filterKey]?.laborCost
                    : allFloorPlan?.subcategory?.toLowerCase().includes("tax on material") &&
                      !isCombinedItem
                    ? filteredProjectCost[filterKey]?.materialCost
                    : filteredProjectCost[filterKey]?.categorySum;
            catSum =
                allFloorPlanCategory.categorySum -
                (allFloorPlan?.unique_price > 0
                    ? (allFloorPlan?.unique_price * baseAmount) / 100
                    : (allFloorPlan?.default_price * baseAmount) / 100) *
                    (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity) +
                parseFloat(average_price?.toFixed(2)) *
                    (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
        } else {
            catSum =
                allFloorPlanCategory.categorySum -
                (allFloorPlan?.total_price > 0
                    ? allFloorPlan?.total_price
                    : (allFloorPlan?.unique_price > 0
                          ? allFloorPlan?.unique_price
                          : allFloorPlan?.default_price) *
                      (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity)) +
                parseFloat(average_price?.toFixed(2)) *
                    (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
        }

        //total sum & alt sum should not be updated if there are incomplete price items
        let isIncomplete = allFloorPlanCategory?.items?.some((item) => {
            return (
                item?.unique_price === 0 &&
                item?.default_price === 0 &&
                item?.total_price === 0 &&
                item?.type_of_change !== "deleted"
            );
        });
        if (isIncomplete) {
            allFloorPlanCategory.totalSum = 0;
        } else allFloorPlanCategory.totalSum = catSum;

        if (allFloorPlan && allFloorPlan?.total_price > 0) {
            if (allFloorPlan?.default_price === 0) {
                allFloorPlan.default_price = parseFloat(
                    (
                        allFloorPlan?.total_price /
                        (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity)
                    )?.toFixed(6),
                );
            }
            allFloorPlan.total_price =
                parseFloat(average_price?.toFixed(6)) *
                (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
        }
        allFloorPlan.unique_price = parseFloat(average_price?.toFixed(6));
        // This will check if all Items across individual floorplans have unique prices set.
        let itemCount = 0;
        let reno_item_id = allFloorPlan.reno_item_id;
        groupedRfpResponseItemsUpdated.forEach((bidItems) => {
            let category = bidItems?.categories?.find(
                (cat) => cat.category == allFloorPlan?.category,
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
        if (allFloorPlan?.floorplans?.length == itemCount) {
            allFloorPlan.allFloorplansFilled = true;
        } else {
            allFloorPlan.allFloorplansFilled = false;
        }

        //update all floorplan default and unique price
        let rfpResponseIndex = bidItemsUpdated?.findIndex((item) => item?.id === allFloorPlan?.id);

        if (rfpResponseIndex !== -1) {
            bidItemsUpdated[rfpResponseIndex].default_price = allFloorPlan?.default_price;
            bidItemsUpdated[rfpResponseIndex].unique_price = allFloorPlan?.unique_price;
            bidItemsUpdated[rfpResponseIndex].total_price = allFloorPlan?.total_price;
            bidItemsUpdated[rfpResponseIndex].is_historical_price =
                allFloorPlan?.is_historical_price;
        } else {
            bidItemsUpdated.push({
                id: allFloorPlan?.id,
                default_price: allFloorPlan?.default_price,
                total_price: allFloorPlan?.total_price,
                unique_price: allFloorPlan?.unique_price,
                is_unique_price: true,
                is_historical_price: allFloorPlan.is_historical_price,
            } as any);
        }

        allFloorPlanCategory.categorySum = catSum;
    }
    if (action.payload.category === "Alternates") {
        groupedRfpResponseItemsUpdated = updateValuesWithNewAltSum(groupedRfpResponseItemsUpdated);
    }
};

export const computeAllFloorplansIfResetPrice = (
    bidItemsUpdated: IRfpResponseItems[],
    groupedRfpResponseItemsUpdated: IGroupedRfpResponseItems[],
    action: PayloadAction<any>,
    filteredProjectCost: {
        [index: string]: {
            categorySum: number;
            laborCost: number;
            materialCost: number;
        };
    },
) => {
    //return all floorPlan details
    let allFloorPlan = getAllFloorPlanItem(
        groupedRfpResponseItemsUpdated,
        action?.payload?.category,
        action?.payload?.reno_item_id,
    );
    let allFloorPlanCategory = getAllFloorPlanCategory(
        groupedRfpResponseItemsUpdated,
        action?.payload?.category,
    );

    //New Default price for all floorplans except excluded ones
    // allFloorplans list with unique price needs to be updated
    // remove selected items to be overriden with default price from the unique price list
    allFloorPlan.floorplans = allFloorPlan?.floorplans?.filter(
        (fp) =>
            !action?.payload?.selectedItems?.some((renoItem: { fp_name: string }) => {
                return renoItem?.fp_name === fp?.fp_name;
            }),
    );
    // Update unit price with new average price or lump_sum price of all floorplans
    // steps to get updated price for all floorplans
    // step 1: calculate (number of floorplans * new default price)
    let new_default_price = 0;
    if (action?.payload?.fp_name === BIDDING_PORTAL?.ALL_FLOOR_PLANS) {
        new_default_price =
            action?.payload?.default_price !== 0
                ? action?.payload?.default_price
                : action?.payload?.total_price /
                  (action?.payload?.specific_quantity ?? action?.payload?.quantity);
    } else {
        new_default_price =
            action?.payload?.unique_price !== 0
                ? action?.payload?.unique_price
                : action?.payload?.total_price /
                  (action?.payload?.specific_quantity ?? action?.payload?.quantity);
    }

    let total_unique_price =
        (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity) *
        parseFloat(new_default_price.toFixed(6));

    // step 2: since some floorplans have unique price remove the assumed default price from total
    // calculate (total_default_price - number of floorplan with unique_price * new_default_price)
    total_unique_price =
        total_unique_price - (allFloorPlan?.floorplans?.length ?? 0) * new_default_price;

    // step 3: since some floorplans have unique price add the sum of all unique price to total
    // calculate (total_default_price + sum of unique price in floorplans)
    let sum = 0;
    //@ts-ignore
    allFloorPlan?.floorplans?.forEach((fp) => (sum = sum + parseFloat(fp?.unique_price)));
    total_unique_price =
        (total_unique_price + sum) / (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
    allFloorPlan.unique_price = parseFloat(total_unique_price?.toFixed(6));
    allFloorPlan.total_price = parseFloat(
        (
            allFloorPlan?.unique_price *
                (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity) ?? 0.0
        )?.toFixed(6),
    );

    //update default price with new default price
    allFloorPlan.default_price = parseFloat(new_default_price.toFixed(6));

    //update all floorplan default and unique price
    let rfpResponseIndex = checkIfBidItemExist(bidItemsUpdated, allFloorPlan.id);

    if (rfpResponseIndex !== -1) {
        bidItemsUpdated[rfpResponseIndex].default_price = allFloorPlan?.default_price;
        bidItemsUpdated[rfpResponseIndex].unique_price = allFloorPlan?.unique_price;
        bidItemsUpdated[rfpResponseIndex].total_price = allFloorPlan?.total_price;
        bidItemsUpdated[rfpResponseIndex].is_historical_price = allFloorPlan?.is_historical_price;
    } else {
        bidItemsUpdated.push({
            id: allFloorPlan?.id,
            default_price: allFloorPlan?.default_price,
            total_price: allFloorPlan?.total_price,
            unique_price: allFloorPlan?.unique_price,
            is_unique_price: true,
            is_historical_price: allFloorPlan.is_historical_price,
        } as any);
    }

    //update category sum
    const filterKey =
        allFloorPlan?.fp_name +
        (allFloorPlan.fp_name?.toLowerCase() === "all floor plans"
            ? ""
            : allFloorPlan?.inventory_name ?? "") +
        (allFloorPlan?.sub_group_name ?? "");
    let catSum = 0;
    if (allFloorPlan?.specific_uom === "percentage" || allFloorPlan?.uom === "percentage") {
        const isCombinedItem = allFloorPlan?.type?.toLowerCase() === "combined";

        const baseAmount =
            allFloorPlan?.subcategory?.toLowerCase().includes("tax on labor") && !isCombinedItem
                ? filteredProjectCost[filterKey]?.laborCost
                : allFloorPlan?.subcategory?.toLowerCase().includes("tax on material") &&
                  !isCombinedItem
                ? filteredProjectCost[filterKey]?.materialCost
                : filteredProjectCost[filterKey]?.categorySum;
        catSum =
            allFloorPlanCategory.categorySum -
            (allFloorPlan?.default_price * baseAmount) / 100 +
            (allFloorPlan?.unique_price * baseAmount) / 100;
    } else {
        catSum =
            allFloorPlanCategory.categorySum - allFloorPlan?.default_price ??
            1 * (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity) +
                allFloorPlan?.unique_price *
                    (allFloorPlan?.specific_quantity ?? allFloorPlan?.quantity);
    }
    allFloorPlanCategory.categorySum = catSum;
    // This will check if all Items across individual floorplans have unique prices set.
    let itemCount = 0;
    let reno_item_id = allFloorPlan.reno_item_id;
    groupedRfpResponseItemsUpdated.forEach((bidItems) => {
        let category = bidItems?.categories?.find((cat) => cat.category == allFloorPlan?.category);
        if (!category || bidItems?.fp_name == BIDDING_PORTAL.ALL_FLOOR_PLANS) return;
        else {
            category.items.forEach((item) => {
                if (reno_item_id?.includes(item?.reno_item_id)) {
                    itemCount++;
                }
            });
        }
    });
    if (allFloorPlan?.floorplans?.length == itemCount) {
        allFloorPlan.allFloorplansFilled = true;
    } else {
        allFloorPlan.allFloorplansFilled = false;
    }

    if (action.payload.category === "Alternates") {
        groupedRfpResponseItemsUpdated = updateValuesWithNewAltSum(groupedRfpResponseItemsUpdated);
    }
};

export const getAllFloorPlanItem = (
    groupedBidItems: IGroupedRfpResponseItems[],
    category: string,
    renoItemId: string,
) => {
    let catItems = getAllFloorPlanCategory(groupedBidItems, category);
    let itemIndex = catItems?.items?.findIndex((item) => item.reno_item_id.includes(renoItemId));
    return catItems?.items?.[itemIndex];
};

//TODO: Check if this works with WBS (l1_name , l2_name etc)
export const getAllFloorPlanCategory = (
    groupedBidItems: IGroupedRfpResponseItems[],
    category: string,
) => {
    let floorplanIndex = groupedBidItems?.findIndex(
        (item) => item?.fp_name === BIDDING_PORTAL.ALL_FLOOR_PLANS,
    );
    let catIndex = groupedBidItems?.[floorplanIndex]?.categories?.findIndex(
        (cat) => cat?.category === category,
    );
    return groupedBidItems?.[floorplanIndex]?.categories?.[catIndex];
};

export const updateAllFloorplansWithUniqueValue = (
    allFloorPlan: IItem,
    action: any,
    unit_price: number,
) => {
    if (allFloorPlan?.floorplans?.length === 0) {
        allFloorPlan.unitsToBeFilled =
            unit_price > 0
                ? allFloorPlan?.unitsToBeFilled -
                  (action?.payload?.specific_quantity ?? action?.payload?.quantity)
                : allFloorPlan?.unitsToBeFilled;
        // check if unit_price is more than 0
        allFloorPlan.floorplans = [
            {
                fp_name: action?.payload?.fp_name,
                unique_price: unit_price,
                isSelected: false,
                inventory: action.payload?.inventory,
                uom: action.payload?.uom,
                sub_group_name: action.payload?.sub_group_name,
            },
        ];
    }
    //@ts-ignore
    else if (allFloorPlan?.floorplans?.length > 0) {
        //check if floorplan already exist in allFloorplan list
        let index = allFloorPlan?.floorplans?.findIndex(
            (fp) =>
                fp?.fp_name === action?.payload?.fp_name &&
                fp.inventory === action.payload.inventory,
        );
        //if floorplan doesn't exist in list of floorplans with unique value
        if (index === -1) {
            allFloorPlan.unitsToBeFilled =
                unit_price > 0
                    ? allFloorPlan?.unitsToBeFilled -
                      (action?.payload?.specific_quantity ?? action?.payload?.quantity)
                    : allFloorPlan?.unitsToBeFilled;
            allFloorPlan.floorplans = [
                //@ts-ignore
                ...allFloorPlan.floorplans,
                {
                    fp_name: action?.payload?.fp_name,
                    unique_price: unit_price,
                    isSelected: false,
                    inventory: action.payload?.inventory,
                    uom: action.payload?.uom,
                    sub_group_name: action.payload?.sub_group_name,
                },
            ];
        }
        //if floorplan exist in list of floorplans with unique value
        else {
            //@ts-ignore
            allFloorPlan.unitsToBeFilled =
                unit_price > 0
                    ? allFloorPlan?.unitsToBeFilled -
                      (action?.payload?.specific_quantity ?? action?.payload?.quantity)
                    : allFloorPlan?.unitsToBeFilled +
                      (action?.payload?.specific_quantity ?? action?.payload?.quantity);
            allFloorPlan.floorplans[index].unique_price = unit_price;
        }
    }
    allFloorPlan.floorplans = allFloorPlan?.floorplans?.filter((fp) => fp.unique_price > 0);
};

export const updateValuesWithNewAltSum = (
    groupedRfpResponseItemsUpdated: IGroupedRfpResponseItems[],
) => {
    groupedRfpResponseItemsUpdated = groupedRfpResponseItemsUpdated.map((groupedBidItem) => {
        groupedBidItem.categories.forEach((category) => {
            if (category.category === "Alternates") {
                let totalSum = 0;
                category.items.every((item) => {
                    let price = getPriceFromItem(item);
                    if (price === 0 && item?.type_of_change !== "deleted") {
                        category.totalSum = 0;
                        return false;
                    }
                    totalSum += price;
                    return true;
                });
                category.totalSum = totalSum;
                // Make Alternates category sum as 0
                let categorySum = 0;
                category.items.forEach((item) => {
                    let price = getPriceFromItem(item);
                    categorySum += price ?? 0;
                });
                category.categorySum = categorySum;
                return;
            }
            let altSum = 0;
            category.items.every((item) => {
                let price = getPriceFromItem(item?.alternate_item_ref ?? item);
                if (price === 0 && item?.type_of_change !== "deleted") {
                    altSum = 0;
                    return false;
                }
                altSum += price;
                return true;
            });
            category.alternateSum = altSum;
        });
        return groupedBidItem;
    });
    return groupedRfpResponseItemsUpdated;
};

// This is used to group items by categories in individual floorplans
export const groupBy = (array: any[], keys: string[]) => {
    return Object?.values(
        array?.reduce((result, obj: IRfpResponseItems) => {
            // get the key for this object
            //@ts-ignore
            let key = keys?.map((k) => obj[k])?.join("-");
            // check if the key exists in the result
            if (!result[key]) {
                // create a new entry for this key
                //@ts-ignore
                result[key] = {};
                // assign the values for the group properties
                //@ts-ignore
                [
                    "fp_name",
                    "inventory_name",
                    "total_units",
                    "sub_group_name",
                    "fp_commercial_name",
                ].forEach((k) => (result[key][k] = obj[k as keyof typeof obj]));
                // result["total_units"] = obj.total_units;
                // create an array for the items
                result[key].categories = [];
            }

            //If category existing
            let index = result[key].categories?.findIndex(
                (list: any) => list.category === obj.display_category,
            );
            if (index !== -1 && result[key].categories[index].items.length > 0) {
                let unique_price = obj.unique_price === null ? 0 : obj.unique_price;
                let default_price = obj.default_price === null ? 0 : obj.default_price;
                let total_price = obj.total_price === null ? 0 : obj.total_price;
                let quantity = obj.quantity === null ? 0 : obj?.quantity;
                result[key].categories[index].categorySum = 0;
                result[key].categories[index].totalSum = 0;
                result[key].categories[index].items?.push({
                    inventory_name: obj.inventory_name,
                    fp_name: obj.fp_name,
                    fp_id: obj.floor_plan_id,
                    id: obj.id,
                    reno_item_id: obj.reno_item_id,
                    is_unique_price: obj.is_unique_price,
                    unique_price: unique_price,
                    total_price: total_price,
                    quantity: quantity,
                    description: obj?.description,
                    finish: obj?.finish,
                    uom: obj.uom,
                    scope: obj.scope,
                    subcategory: obj.subcategory,
                    category: obj.category,
                    work_type: obj.work_type,
                    location: obj.location,
                    default_price: default_price,
                    is_alternate: obj?.is_alternate,
                    baths_count: obj?.baths_count,
                    beds_count: obj.beds_count,
                    fp_area: obj?.fp_area,
                    is_ownership_alt: obj?.is_ownership_alt,
                    reason: obj?.reason,
                    type_of_change: obj.type_of_change,
                    bid_request_id: obj?.bid_request_id,
                    fp_area_uom: obj.fp_area_uom,
                    manufacturer: obj?.manufacturer,
                    model_no: obj?.model_no,
                    alt_bid_id: obj?.alt_bid_id,
                    parent_bid_item_id: obj?.parent_bid_item_id,
                    type: obj?.type,
                    sub_group_name: obj?.sub_group_name,
                    pc_item_id: obj?.pc_item_id,
                    specific_uom: obj?.specific_uom,
                    specific_quantity: obj?.specific_quantity,
                    combo_name: obj?.combo_name,
                    l1_name: obj?.l1_name,
                    l2_name: obj?.l2_name,
                    l3_name: obj?.l3_name,
                    is_historical_price: obj?.is_historical_price,
                    is_revised_price: obj?.is_revised_price,
                    price_expression: obj?.price_expression,
                    subgroup_id: obj.subgroup_id,
                    inventory_id: obj.inventory_id,
                    fp_commercial_name: obj?.fp_commercial_name,
                });
            } else {
                let unique_price = obj.unique_price === null ? 0 : obj.unique_price;
                let total_price = obj.total_price === null ? 0 : obj.total_price;
                let default_price = obj.default_price === null ? 0 : obj.default_price;
                let quantity = obj.quantity === null ? 0 : obj?.quantity;
                result[key]?.categories?.push({
                    category: obj.display_category,
                    display_category: obj.display_category,
                    alternateSum: 0,
                    categorySum: 0,
                    totalSum: 0,
                    items: [
                        {
                            inventory_name: obj.inventory_name,
                            fp_name: obj.fp_name,
                            id: obj.id,
                            fp_id: obj.floor_plan_id,
                            reno_item_id: obj.reno_item_id,
                            is_unique_price: obj.is_unique_price,
                            unique_price: unique_price,
                            total_price: total_price,
                            quantity: quantity,
                            description: obj?.description,
                            finish: obj?.finish,
                            uom: obj.uom,
                            scope: obj.scope,
                            subcategory: obj.subcategory,
                            work_type: obj.work_type,
                            location: obj.location,
                            default_price: default_price,
                            is_alternate: obj?.is_alternate,
                            baths_count: obj?.baths_count,
                            beds_count: obj.beds_count,
                            fp_area: obj?.fp_area,
                            is_ownership_alt: obj?.is_ownership_alt,
                            reason: obj?.reason,
                            type_of_change: obj.type_of_change,
                            bid_request_id: obj?.bid_request_id,
                            category: obj.category,
                            fp_area_uom: obj.fp_area_uom,
                            manufacturer: obj?.manufacturer,
                            model_no: obj?.model_no,
                            alt_bid_id: obj?.alt_bid_id,
                            parent_bid_item_id: obj?.parent_bid_item_id,
                            type: obj?.type,
                            sub_group_name: obj?.sub_group_name,
                            pc_item_id: obj?.pc_item_id,
                            specific_uom: obj?.specific_uom,
                            specific_quantity: obj?.specific_quantity,
                            combo_name: obj?.combo_name,
                            l1_name: obj?.l1_name,
                            l2_name: obj?.l2_name,
                            l3_name: obj?.l3_name,
                            is_historical_price: obj?.is_historical_price,
                            is_revised_price: obj?.is_revised_price,
                            price_expression: obj?.price_expression,
                            subgroup_id: obj.subgroup_id,
                            inventory_id: obj.inventory_id,
                            fp_commercial_name: obj?.fp_commercial_name,
                        },
                    ],
                });
            }
            return result;
        }, {}),
    ) as IGroupedRfpResponseItems[];
};

// This is used to group items by categories for all floorplans
export const groupByCategory = (array: any[]) => {
    return Object?.values(
        array?.reduce((result, obj) => {
            let key = obj.display_category;
            if (!result[key]) {
                let unique_price = obj.unique_price === null ? 0 : obj.unique_price;
                let total_price = obj.total_price === null ? 0 : obj.total_price;
                let default_price = obj.default_price === null ? 0 : obj.default_price;
                result[key] = {};

                result[key].category = obj?.display_category;
                result[key].parent_category = obj?.category;
                (result[key].categorySum = 0),
                    (result[key].totalSum = 0),
                    (result[key].items = [
                        {
                            fp_name: BIDDING_PORTAL.ALL_FLOOR_PLANS,
                            id: obj.id,
                            fp_id: obj.floor_plan_id,
                            reno_item_id: obj.reno_item_id,
                            is_unique_price: obj.is_unique_price,
                            unique_price: unique_price,
                            total_price: total_price,
                            quantity: obj?.quantity,
                            description: obj.description,
                            finish: obj?.finish,
                            uom: obj.uom,
                            category: obj.category,
                            scope: obj.scope,
                            subcategory: obj.subcategory,
                            type_of_change: obj.type_of_change,
                            work_type: obj.work_type,
                            location: obj.location,
                            floorplans: [],
                            total_take_off_value: parseFloat(obj?.total_take_off_value?.toFixed(2)),
                            unitsToBeFilled: parseFloat(obj?.total_take_off_value?.toFixed(2)),
                            default_price: default_price,
                            inventory_name: obj.inventory_name,
                            bid_request_id: obj?.bid_request_id,
                            manufacturer: obj?.manufacturer,
                            model_no: obj?.model_no,
                            alt_bid_id: obj?.alt_bid_id,
                            reason: obj?.reason,
                            is_alternate: obj?.is_alternate,
                            is_ownership_alt: obj?.is_ownership_alt,
                            parent_bid_item_id: obj?.parent_bid_item_id,
                            type: obj?.type,
                            sub_group_name: obj?.sub_group_name,
                            pc_item_id: obj?.pc_item_id,
                            specific_uom: obj?.specific_uom,
                            specific_quantity: obj?.specific_quantity,
                            l1_name: obj?.l1_name,
                            l2_name: obj?.l2_name,
                            l3_name: obj?.l3_name,
                            combo_name: obj?.combo_name,
                            is_historical_price: obj?.is_historical_price,
                            is_revised_price: obj?.is_revised_price,
                            price_expression: obj?.price_expression,
                            subgroup_id: obj.subgroup_id,
                            inventory_id: obj.inventory_id,
                            fp_commercial_name: obj?.fp_commercial_name,
                        },
                    ]);
            } else {
                //check if same reno_item_id exists
                let unique_price = obj.unique_price === null ? 0 : obj.unique_price;
                let total_price = obj.total_price === null ? 0 : obj.total_price;
                let default_price = obj.default_price === null ? 0 : obj.default_price;
                let index = result[key].items?.findIndex(
                    (item: any) => item?.reno_item_id === obj.reno_item_id,
                );
                if (index === -1) {
                    result[key].categorySum = 0;
                    result[key].totalSum = 0;

                    result[key].items = [
                        ...result[key].items,
                        {
                            fp_name: BIDDING_PORTAL.ALL_FLOOR_PLANS,
                            id: obj.id,
                            fp_id: obj.floor_plan_id,
                            reno_item_id: obj.reno_item_id,
                            is_unique_price: obj.is_unique_price,
                            unique_price: unique_price,
                            total_price: total_price,
                            quantity: obj?.quantity,
                            description: obj.description,
                            comments: obj.comments,
                            finish: obj?.finish,
                            uom: obj.uom,
                            scope: obj.scope,
                            subcategory: obj.subcategory,
                            type_of_change: obj.type_of_change,
                            work_type: obj.work_type,
                            location: obj.location,
                            is_ownership_alt: obj?.is_ownership_alt,
                            floorplans: [],
                            total_take_off_value: parseFloat(obj?.total_take_off_value?.toFixed(2)),
                            unitsToBeFilled: parseFloat(obj?.total_take_off_value?.toFixed(2)),
                            default_price: default_price,
                            inventory_name: obj.inventory_name,
                            bid_request_id: obj?.bid_request_id,
                            category: obj.category,
                            manufacturer: obj?.manufacturer,
                            model_no: obj?.model_no,
                            alt_bid_id: obj?.alt_bid_id,
                            reason: obj?.reason,
                            is_alternate: obj?.is_alternate,
                            parent_bid_item_id: obj?.parent_bid_item_id,
                            type: obj?.type,
                            sub_group_name: obj?.sub_group_name,
                            pc_item_id: obj?.pc_item_id,
                            specific_uom: obj?.specific_uom,
                            specific_quantity: obj?.specific_quantity,
                            l1_name: obj?.l1_name,
                            l2_name: obj?.l2_name,
                            l3_name: obj?.l3_name,
                            combo_name: obj?.combo_name,
                            is_historical_price: obj?.is_historical_price,
                            is_revised_price: obj?.is_revised_price,
                            price_expression: obj?.price_expression,
                            subgroup_id: obj.subgroup_id,
                            inventory_id: obj.inventory_id,
                            fp_commercial_name: obj?.fp_commercial_name,
                        },
                    ];
                }
            }
            return result;
        }, {}),
    );
};

const checkIfBidItemExist = (bidItemsUpdated: IRfpResponseItems[], id: string) => {
    return bidItemsUpdated?.findIndex((item) => item?.id === id);
};

export function calculateFilteredProjectCost(groupedBidItems: IGroupedRfpResponseItems[]) {
    let filteredProjectCost: any = {};
    let excludedCategories = ["tax", "general conditions", "profit & overhead", "alternates"];

    // Calculate Total Sum & Category sum after performing combinations
    groupedBidItems.forEach((groupedBidItem) => {
        const filterKey =
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

            category?.items?.forEach((item) => {
                let price = getPriceFromItem(item);
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
            if (!excludedCategories.includes(category.parent_category?.toLowerCase())) {
                filteredProjectCost[filterKey].categorySum += catSum;
                filteredProjectCost[filterKey].materialCost += materialCost;
                filteredProjectCost[filterKey].laborCost += laborCost;
            }
        });
    });

    return filteredProjectCost;
}
