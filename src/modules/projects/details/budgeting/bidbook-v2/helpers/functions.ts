import {
    CREATE_RENO_ITEM,
    UPDATE_RENOVATIONS,
} from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import actions from "stores/actions";
import { graphQLClient } from "utils/gql-client";
import { IInventories } from "stores/projects/details/floor-plans/floor-plans-models";
import { type GridApiPro } from "@mui/x-data-grid-pro";
import { MutableRefObject } from "react";

import { styled } from "@mui/material";
import { isFunction, isUndefined, uniqBy, isEmpty } from "lodash";

export async function saveChangesToPortal(
    inventories: IInventories,
    updatedItems: any,
    dispatch: any,
    newlyAddedItems: any,
    //eslint-disable-next-line
    showSnackBar: (variant: any, message: string) => void,
    projectId: any,
    setSavedWithChanges: any,
    setIsHavingUnsavedChanges: any,
    setSaveChanges: any,
    currentStep: any,
) {
    try {
        const inData = inventories?.data as any[];
        let isValidated = true;
        let isAllSucceeded: any[] = [];
        const inactiveItems = updatedItems?.filter((item: any) => !item.isActive);
        if (updatedItems?.length) {
            const payloadItems = updatedItems?.map((item: any) => {
                const result: any = [];
                const take_offs: any = [];
                for (const key in item) {
                    if (
                        typeof item[key] === "object" &&
                        item[key] !== null &&
                        "qty" in item[key] &&
                        "price" in item[key]
                    ) {
                        result.push({
                            floor_plan_id: key,
                            price: Number(item[key].price) || Number(0),
                        });
                        take_offs.push({
                            fp_id: key,
                            take_off_value: Number(item[key].qty) || Number(0),
                        });
                    }
                }

                return {
                    reno_id: item.id,
                    work_price: item.eachPrice || 0,
                    pc_item_id: item.scope.pc_item_id || item.pc_item_id,
                    sub_category: item.subcategory,
                    is_active: item.isActive,
                    price_floor_plan: result,
                    model_number: item.model,
                    manufacturer: item.manufacturer,
                    location: item.location,
                    description: item.description,
                    comments: item.comments,
                    finish: item?.finish,
                    take_off_value: take_offs,
                    uom: item.uom,
                    inventory_id:
                        currentStep == "ALTERNATIVES"
                            ? undefined
                            : inData?.find((inv: any) => inv.name == item.inventoryName)?.id,
                };
            }) as Array<Promise<any>>;
            const response = await graphQLClient.mutate("updateRenoItem", UPDATE_RENOVATIONS, {
                payload: payloadItems,
            });

            if (currentStep == "ALTERNATIVES") {
                dispatch(actions.budgeting.updateAltRenovationData(response.concat(inactiveItems)));
            }
            if (currentStep == "BASE_BID") {
                dispatch(
                    actions.budgeting.updateBaseRenovationData(response.concat(inactiveItems)),
                );
            }
            if (currentStep == "FLOORING") {
                dispatch(
                    actions.budgeting.updateFlooringRenovationData(response.concat(inactiveItems)),
                );
            }
        }

        if (newlyAddedItems?.length) {
            for (let i = 0; i < newlyAddedItems?.length; i++) {
                const item = newlyAddedItems[i];
                if (isEmpty(item.category)) {
                    isValidated = false;
                    showSnackBar("error", "Fill Category Field");
                    break;
                }
                if (isEmpty(item.item)) {
                    isValidated = false;
                    showSnackBar("error", "Fill Item Field");
                    break;
                }
                if (isEmpty(item.workType)) {
                    isValidated = false;
                    showSnackBar("error", "Fill Work Type Field");
                    break;
                }
                if (isEmpty(item.scope.pc_item_id)) {
                    isValidated = false;
                    showSnackBar("error", "Fill Scope Field");
                    break;
                }
            }
            if (isValidated) {
                const promisesAddItems = newlyAddedItems?.map((item: any) => {
                    return graphQLClient.mutate("createRenoItem", CREATE_RENO_ITEM, {
                        payload: {
                            project_id: projectId,
                            pc_item_id: item.scope.pc_item_id,
                            work_id: null,
                            work_price: item.work_price,
                            inventory_id: inData?.find((inv: any) => inv.name == item.inventoryName)
                                ?.id,
                            created_by: localStorage.getItem("user_id"),
                        },
                    });
                }) as Array<Promise<any>>;
                const responseAddNewItems = await Promise.allSettled(promisesAddItems);
                responseAddNewItems?.map((item) => {
                    if (item.status === "fulfilled") {
                        if (currentStep == "ALTERNATIVES") {
                            dispatch(actions.budgeting.createAltRenovationData(item.value));
                        }
                        if (currentStep == "BASE_BID") {
                            dispatch(actions.budgeting.createBaseRenovationData(item.value));
                        }
                        if (currentStep == "FLOORING") {
                            dispatch(
                                actions.budgeting.fetchFlooringRenoItemsStart({
                                    projectId: projectId,
                                }),
                            );
                        }
                    } else {
                        isAllSucceeded.push(item);
                    }
                });
            } else {
                setIsHavingUnsavedChanges && setIsHavingUnsavedChanges(true);
            }
        }
        if (isEmpty(isAllSucceeded)) {
            showSnackBar("success", "Changes Saved Successfully");
            setSavedWithChanges((prev: any) => [...prev, currentStep]);
        } else {
            showSnackBar("error", "Unable to save the changes");
        }
    } catch (error) {
        console.log("error", error);
        showSnackBar("error", "Unable to save the changes");
    } finally {
        setSaveChanges(false);
    }
}

export function appendNewRowsData(
    rows: any,
    newRows: any,
    setNewRows: any,
    setAddRowConfirmationAccepted: any,
    setRows: any,
) {
    const dynamicObj: any = {};
    const renoItem = (rows?.length && rows[0]) || {};
    renoItem?.take_offs?.map((item: any) => {
        const fpId = item.fp_id;
        const qtyValue = "";
        const priceValue = "";

        dynamicObj[fpId] = {
            qty: qtyValue,
            price: priceValue,
        };
    });
    const addNewRowData = {
        id: `add_row_${newRows?.length}`,
        category: "",
        hierarchy: [`New Rows`, `${newRows?.length}`],
        location: "",
        scope: "",
        item: "",
        subcategory: "",
        inventoryName: "",
        description: "",
        comments: "",
        finish: "",
        manufacturer: "",
        model: "",
        uom: "",
        eachQuantity: 1,
        eachPrice: 0,
        aggregateQuantity: 0,
        isUpdated: false,
        isActive: true,
        workType: "",
        totalRenoUnits: 0,
        take_offs: renoItem.take_offs,
        allowedItems: [],
        allowedScopes: [],
        allowedWorkTypes: [],
        ...dynamicObj,
    };
    setNewRows((currentState: any) => [addNewRowData, ...currentState]);

    setAddRowConfirmationAccepted(false);
    setRows([addNewRowData, ...rows]);
}

export const StyledBox = styled("div")(({ theme }) => ({
    height: "100%",
    width: "100%",
    "& .MuiInputBase-root": {
        fontSize: "16px",
    },
    "& .Mui-error": {
        backgroundColor: `rgb(126,10,15, ${theme.palette.mode === "dark" ? 0 : 0.1})`,
        color: theme.palette.mode === "dark" ? "#ff4343" : "#750f0f",
    },
}));

export const compareObjIfUpdatedFp = (newObj: any, oldObj: any) => {
    const fixedCol = [
        "aggregateQuantity",
        "category",
        "comments",
        "description",
        "eachPrice",
        "eachQuantity",
        "finish",
        "inventoryName",
        "item",
        "location",
        "manufacturer",
        "model",
        "scope",
        "subcategory",
        "uom",
        "workType",
    ];
    let updatedField: string = "";
    for (let key in newObj) {
        if (
            !isUndefined(newObj[key]) &&
            !isUndefined(oldObj[key]) &&
            newObj[key].toString() !== oldObj[key].toString()
        ) {
            updatedField = key.split("-")[0];
            break;
        }
    }

    return { isUpdatedTakeoff: !fixedCol.includes(updatedField), updatedField: updatedField };
};

export const getAllowedScopes = (item: any, workType: any, containerItemsList: any) => {
    const itemName = getItemValue(item);
    let allowedScopes = containerItemsList
        ?.filter(
            (contItem: { item: any; work_type: any }) =>
                contItem?.item === itemName && contItem?.work_type === workType,
        )
        ?.flatMap((filteredContItem: { scope_list: any }) => filteredContItem?.scope_list);

    const uniqueScopesMap = new Map();
    allowedScopes.forEach((scopeObj: { pc_item_id: any; scope: any }) => {
        if (!uniqueScopesMap.has(scopeObj.pc_item_id)) {
            uniqueScopesMap.set(scopeObj.pc_item_id, {
                scope: scopeObj.scope,
                pc_item_id: scopeObj.pc_item_id,
            });
        }
    });
    const uniqueScopesArray = Array.from(uniqueScopesMap.values());
    return uniqueScopesArray; // Return an array of unique scope objects
};

export function getItemValue(item: any) {
    if (typeof item === "object" && item !== null) {
        return item.item ? (typeof item?.item === "object" ? item?.item?.item : item?.item) : null;
    } else if (typeof item === "string") {
        return item;
    } else {
        return null;
    }
}

export const getAllowedItems = (category: any, containerItemsList: any) => {
    let categoryItems = containerItemsList.filter(
        (contItem: any) => contItem?.category == category,
    );
    categoryItems = uniqBy(categoryItems, (item: any) => item.item);
    return categoryItems || [];
};

export const getContainerVersionGrouping = (
    renoItem: any,
    index: number,
    containerVersion: number,
) => {
    const groupedKey = `${renoItem.item}@groupedKey${index + 1}`;

    if (Number(containerVersion) <= 2.0) {
        return [renoItem.category, groupedKey];
    }
    if (!renoItem?.l1_name) {
        return ["Other", groupedKey];
    }
    const result = [renoItem.l1_name];
    if (renoItem?.l2_name) {
        result.push(renoItem.l2_name);
    }
    result.push(groupedKey);
    return result;
};

export const updateRowTakeOffs = (Obj: any, updatedRow: any, floorplans: any) => {
    for (const key in Obj) {
        if (
            typeof Obj[key] === "object" &&
            Obj[key] !== null &&
            "qty" in Obj[key] &&
            "price" in Obj[key]
        ) {
            const qty = updatedRow[`${key}-qty`] || updatedRow[key].qty;
            if (qty) {
                const price = qty * Obj.eachPrice ?? 0;
                Obj[key] = { ...Obj[key], qty, price };
                Obj[`${key}-qty`] = qty;
                Obj[`${key}-price`] = price;
            }
            let takeoffCpy = Obj.take_offs;
            takeoffCpy = takeoffCpy?.map((takeOff: any) => {
                let copy = { ...takeOff };
                if (copy.fp_id == key) {
                    copy.take_off_value = Obj[key].qty ?? copy.take_off_value;
                }
                return copy;
            });
            Obj.take_offs = takeoffCpy;
            Obj.aggregateQuantity = getAggregateQty(Obj, floorplans);
        }
    }
    return Obj;
};

export const getAggregateQty = (renoItem: any, floorplans: any) => {
    const agQty = renoItem?.take_offs?.reduce((totalQty: any, item: any) => {
        return (
            totalQty +
            item?.take_off_value *
                (floorplans?.find((floorPlan: any) => floorPlan.id === item.fp_id)?.renoUnits || 0)
        );
    }, 0);
    return agQty?.toFixed(2);
};

export const getRowsFromTable = (apiRef: MutableRefObject<GridApiPro>) => {
    if (isFunction(apiRef.current.getAllRowIds)) {
        const allIds = apiRef?.current?.getAllRowIds();
        return allIds.map((id) => apiRef.current.getRow(id));
    }
    return [];
};

export const getAllowedWorkTypes = (item: any, containerItemsList: any) => {
    let allowedWorkTypes: any = containerItemsList
        ?.filter((contItem: any) => contItem?.item == item?.item)
        .map((filteredContItem: any) => filteredContItem?.work_type);

    const uniqueItems = Array.from(new Set(allowedWorkTypes));
    return uniqueItems; // Return the unique items array
};
