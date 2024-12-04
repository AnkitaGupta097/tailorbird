import { all, put } from "@redux-saga/core/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    CONTAINER_CATEGORY_QUERY,
    ORGANIZATION_CONTAINER_CATEGORY_QUERY,
} from "components/container-admin-interface/constants";
import { groupBy } from "lodash";
import { GET_VERSIONED_DATA } from "modules/projects/details/budgeting/bidbook-v2/actions/mutation-contsants";
import { GET_ORGANISATION_CONTAINERS } from "stores/ims/queries";
import { GET_SINGLE_PROJECT } from "stores/single-project/queries";
import { graphQLClient } from "utils/gql-client";
import actions from "../actions";
import { IItem, IRfpResponseItems } from "./bidding-portal-models";
import {
    COMBINE_LINE_ITEMS,
    CREATE_NEW_SESSION,
    DELETE_CURRENT_SESSION,
    GET_CURRENT_SESSION,
    GET_HISTORICAL_PRICING,
    GET_USER_BY_ID,
    UNCOMBINE_LINE_ITEMS,
    UPDATE_COMBO_NAME,
    UPDATE_UNIT_OF_MEASURE,
    createAlternateItems,
    deleteAlternateItems,
    getBidItems,
    updateAlternateBidItem,
    updateBidItems,
} from "./bidding-portal-queries";

//eslint-disable-next-line
export function* createBidItemsForContractor(action: PayloadAction<any>) {
    try {
        const response = true;
        // const response: boolean = yield client.mutate("createBidItems", createBidItems, {
        //     input: {
        //         project_id: action?.payload?.input?.project_id,
        //         contractor_org_id: action?.payload?.input?.contractor_org_id,
        //         bid_request_id: action?.payload?.bid_request_id,
        //     },
        // });
        yield put(actions.biddingPortal.createBidItemsForContractorSuccess(response));
    } catch (error) {
        console.log(error, "error is..");
    }
}

//eslint-disable-next-line
export function* fetchBidItems(action: PayloadAction<any>) {
    try {
        let response = { getBidItems: { bid_items: [] } };
        response = yield graphQLClient.query("getBidItems", getBidItems, {
            projectId: action.payload.projectId,
            contractorOrgId: action.payload.contractorOrgId,
            renovationVersion: action?.payload?.renovationVersion,
        });
        //@ts-ignore
        let total_reno_units = response?.getBidItems?.total_reno_units;
        let bidItems = response?.getBidItems?.bid_items;

        //get project details
        const projectDetails: { getProjectById: any } = yield graphQLClient.query(
            "getProjectById",
            GET_SINGLE_PROJECT,
            {
                projectId: action.payload.projectId,
            },
        );

        const organisation_container_id = projectDetails.getProjectById?.organisation_container_id;
        const ownershipGroupId = projectDetails?.getProjectById?.ownershipGroupId;

        let containerCategories: any[] = [];
        if (!organisation_container_id) {
            let response: {
                getCategories: any[];
            } = yield graphQLClient.query("getCategories", CONTAINER_CATEGORY_QUERY);
            containerCategories = response?.getCategories;
        } else {
            //get all organization containers
            const allContainersResponse: { getOrganisationContainers: any[] } =
                yield graphQLClient.query(
                    "getOrganisationContainers",
                    GET_ORGANISATION_CONTAINERS,
                    {
                        organisationId: ownershipGroupId,
                    },
                );

            let allOrganizationContainers = allContainersResponse?.getOrganisationContainers;
            let filteredL1Categories: { category: any }[] = [];
            const promises = allOrganizationContainers?.map(async (container: any) => {
                const response: {
                    getOrganisationContainerGroups: any[];
                } = await graphQLClient.query(
                    "getOrganisationContainerGroups",
                    ORGANIZATION_CONTAINER_CATEGORY_QUERY,
                    {
                        organisationContainerId: container?.id,
                    },
                );

                return response.getOrganisationContainerGroups;
            });

            const containerGroupsArrays: any[] = yield Promise.allSettled(promises);

            // Flatten the arrays and push the items into filteredL1Categories
            containerGroupsArrays.forEach((groups) => {
                groups?.value?.forEach((item: any) => {
                    filteredL1Categories.push({
                        category: {
                            l1: item.l1,
                            l2: item.l2s?.map((l2Obj: any) => ({
                                l2: l2Obj.l2,
                                l3: l2Obj?.l3s?.map((l3Obj: any) => l3Obj.l3),
                            })),
                        },
                    });
                });
            });

            containerCategories = filteredL1Categories;
        }
        yield put(
            actions?.biddingPortal?.fetchBidItemsSuccess({
                projectId: action.payload.projectId,
                response: bidItems,
                containerCategories: containerCategories,
                total_reno_units: total_reno_units,
                organisation_container_id: organisation_container_id,
            }),
        );
    } catch (error) {
        console.log(error, "error is..");
        yield put(actions?.biddingPortal?.fetchBidItemsFailure({}));
    }
}

//eslint-disable-next-line
export function* fetchBidItemsHistory(action: PayloadAction<any>) {
    try {
        let response = { getBidItems: { bid_items: [] } };
        response = yield graphQLClient.query("getBidItems", getBidItems, {
            bidRequestId: action?.payload?.bid_request_id,
            projectId: action.payload.projectId,
            contractorOrgId: action.payload.contractor_org_id,
        });
        //@ts-ignore
        let total_reno_units = response?.getBidItems?.total_reno_units;
        let bidItems = response?.getBidItems?.bid_items;

        const containerCategories: {
            getCategories: any[];
        } = yield graphQLClient.query("getCategories", CONTAINER_CATEGORY_QUERY);
        yield put(
            actions?.biddingPortal?.fetchBidItemsSuccess({
                projectId: action.payload.projectId,
                response: bidItems,
                containerCategories: containerCategories.getCategories,
                total_reno_units: total_reno_units,
            }),
        );
    } catch (error) {
        console.log(error, "error is..");
        yield put(actions?.biddingPortal?.fetchBidItemsFailure({}));
    }
}

//eslint-disable-next-line
export function* syncStoreWithApi(action: PayloadAction<any>) {
    try {
        const response: IRfpResponseItems[] = yield graphQLClient.mutate(
            "updateBidItems",
            updateBidItems,
            {
                input: action.payload.input,
            },
        );
        yield put(actions?.biddingPortal?.syncStoreWithApiSuccess({ response: response }));
    } catch (error) {
        yield all([
            put(actions?.biddingPortal?.syncStoreWithApiFailed({ error: error })),
            put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Data sync failed",
                    open: true,
                }),
            ),
        ]);
    }
}

export function* lockProjectForEditing(action: PayloadAction<any>) {
    try {
        let userId = action.payload.userId;
        let projectId = action.payload.projectId;
        //let organization_id = localStorage.getItem("organization_id");
        //@ts-ignore
        let sessionResponse = yield graphQLClient.query("getCurrentSession", GET_CURRENT_SESSION, {
            projectId: projectId,
            contractorOrgId: action?.payload?.organization_id,
        });
        if (!sessionResponse?.getCurrentSession) {
            //@ts-ignore
            sessionResponse = yield graphQLClient.mutate("createNewSession", CREATE_NEW_SESSION, {
                input: {
                    project_id: projectId,
                    user_id: userId,
                    organization_id: action?.payload?.organization_id,
                },
            });
        } else {
            sessionResponse = sessionResponse?.getCurrentSession;
        }
        let user = null;
        if (sessionResponse?.user_id && sessionResponse.user_id !== userId) {
            //@ts-ignore
            user = yield graphQLClient.query("getUserById", GET_USER_BY_ID, {
                getUserByIdId: sessionResponse.user_id,
            });
            user = user?.getUserById;
        }
        yield put(
            actions.biddingPortal.lockProjectForEditingComplete({
                isEditable: sessionResponse?.user_id === userId ? true : false,
                user: {
                    name: sessionResponse?.user_id == userId ? userId : user.name,
                    id: sessionResponse?.user_id == userId ? userId : user.id,
                    organization_id: action?.payload?.organization_id,
                    projectId: projectId,
                },
            }),
        );
    } catch (error) {
        yield put(actions.biddingPortal.lockProjectForEditingFailure({}));
    }
}

//eslint-disable-next-line
export function* unlockProject(action: PayloadAction<any>) {
    try {
        let projectId = action.payload.projectId;
        //let organization_id = localStorage.getItem("organization_id");
        //@ts-ignore
        const response = yield graphQLClient.mutate(
            "deleteCurrentSession",
            DELETE_CURRENT_SESSION,
            {
                projectId: projectId,
                contractorOrgId: action?.payload?.organization_id,
            },
        );
        if (response === true) yield put(actions.biddingPortal.unlockProjectForEditingComplete({}));
        else yield put(actions.biddingPortal.unlockProjectForEditingFailure({}));
    } catch (error) {
        yield put(actions.biddingPortal.unlockProjectForEditingFailure({}));
    }
}

//eslint-disable-next-line
export function* createAlternateItem(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        //eslint-disable-next-line
        const response = yield graphQLClient.mutate(
            "createAlternateBidItems",
            createAlternateItems,
            {
                input: {
                    unique_price: parseFloat(action.payload.formData.unique_price) || 0,
                    total_price: parseFloat(action.payload.formData.total_price) || 0,
                    specific_uom: action.payload.formData.specific_uom,
                    reno_item_id: action.payload.formData.reno_item_id,
                    reason: action.payload.formData.reason,
                    project_id: action.payload.formData.project_id,
                    model_no: action.payload.formData.model_no,
                    manufacturer: action.payload.formData.manufacturer,
                    is_unique_price: action.payload?.formData?.is_unique_price,
                    description: action.payload.formData.description,
                    default_price: parseFloat(action.payload.formData.default_price) || 0,
                    created_by: action.payload.formData.created_by,
                    contractor_org_id: action.payload.formData.contractor_org_id,
                    bid_request_id: action.payload.formData.bid_request_id,
                },
            },
        );
        if (response?.length > 0) {
            yield put(
                actions.biddingPortal.createAlternateItemComplete({
                    items: response,
                }),
            );
            yield put(
                actions.common.openSnack({
                    message: action.payload.formData?.message,
                    variant: "success",
                    open: true,
                }),
            );
        } else {
            yield all([
                put(actions.biddingPortal.createAlternateItemFailed({})),
                put(
                    actions.common.openSnack({
                        variant: "error",
                        message: "Failed to create Alternate item",
                        open: true,
                    }),
                ),
            ]);
        }
    } catch (e) {
        console.log(e);
        yield all([
            put(actions.biddingPortal.createAlternateItemFailed({})),
            put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Failed to create alternate item",
                    open: true,
                }),
            ),
        ]);
    }
}

export function* deleteAlternateItem(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const response: any = yield graphQLClient.mutate(
            "deleteAlternateBidItem",
            deleteAlternateItems,
            {
                input: {
                    user_id: action.payload.userID,
                    project_id: action.payload.project_id,
                    contractor_org_id: action.payload.contractor_org_id,
                    bid_item_id: action.payload.bid_item_id,
                },
            },
        );
        if (response) {
            yield put(
                actions.biddingPortal.deleteAlternateItemComplete({
                    reno_item_id: action.payload.reno_item_id,
                    navigate: action.payload.navigate,
                    userID: action.payload.userID,
                    projectId: action.payload.project_id,
                    role: action.payload.role,
                    orgId: action.payload.contractor_org_id,
                    isAdminAccess: action.payload.isAdminAccess,
                    isLatest: action.payload.isLatest,
                    version: action.payload.version,
                }),
            );
            yield put(
                actions.common.openSnack({
                    variant: "success",
                    message: "Successfully deleted alternate item",
                    open: true,
                }),
            );
        } else {
            yield put(actions.biddingPortal.deleteAlternateItemFailed({}));
            yield put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Failed to delete Alternate item",
                    open: true,
                }),
            );
        }
    } catch (e) {
        console.log(e);
        yield all([
            put(actions.biddingPortal.deleteAlternateItemFailed({})),
            put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Failed to delete Alternate item",
                    open: true,
                }),
            ),
        ]);
    }
}

//eslint-disable-next-line
export function* editAlternateItem(action: PayloadAction<any>) {
    try {
        const { id, reno_item_id, manufacturer, model_no, description, reason, userID } =
            action.payload;
        //@ts-ignore
        const response = yield graphQLClient.mutate(
            "updateAlternateBidItems",
            updateAlternateBidItem,
            {
                input: {
                    id: id,
                    manufacturer,
                    description,
                    model_no,
                    reason,
                    updated_by_user_id: userID,
                },
            },
        );
        if (response)
            yield put(
                actions.biddingPortal.editAlternateItemComplete({
                    reno_item_id,
                    manufacturer,
                    description,
                    model_no,
                    reason,
                }),
            );
        yield put(
            actions.common.openSnack({
                variant: "success",
                message: "Alternate item saved",
                open: true,
            }),
        );
    } catch (e) {
        console.log(e);
        yield all([
            put(actions.biddingPortal.editAlternateItemFailed({})),
            put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Failed to save",
                    open: true,
                }),
            ),
        ]);
    }
}

export function* combineLineItems(action: PayloadAction<any>) {
    try {
        const allInventories = action.payload.allInventories as Record<string, Array<IItem>>;
        let areItemsLessThan2 = false;
        let doesItemCountMismatch = false;
        const initalCount = Object?.values(allInventories)?.[0].length;
        Object.values(allInventories).forEach((inventoryItems) => {
            if (inventoryItems?.length < 2 || !inventoryItems) {
                areItemsLessThan2 = true;
            }
            if (inventoryItems && inventoryItems?.length !== initalCount) {
                doesItemCountMismatch = true;
            }
        });
        const user_id = localStorage?.getItem("user_id");
        const projectId = action.payload.projectId;
        const comboName = action.payload.comboName;
        const uom = action.payload?.uom;
        const quantityIds = action.payload?.quantityIds ?? [];
        const percentage = action.payload?.percentage;

        if (areItemsLessThan2 || doesItemCountMismatch) {
            yield put(actions.biddingPortal.combineLineItemsFailed({}));
            yield put(
                actions.common.openSnack({
                    variant: "error",
                    message: doesItemCountMismatch
                        ? "Items are not present in all inventories"
                        : "Cannot combine as the number of items is less than 2",
                    open: true,
                }),
            );
        } else {
            let inv = "";
            let itemsListFromOneInventory;

            for (const k in allInventories) {
                inv = k;
                itemsListFromOneInventory = allInventories[k];
                break;
            }

            const ids = itemsListFromOneInventory?.map((item) => {
                const itemId = item.id;
                let qtyIdx;

                if (quantityIds?.includes(itemId)) {
                    qtyIdx = quantityIds.findIndex((id: string) => id === itemId);
                }

                const inv_index = item.inventory_name.split("#").findIndex((i) => i === inv);

                if (qtyIdx > -1) {
                    quantityIds[qtyIdx] = quantityIds[qtyIdx].split("#")[inv_index];
                }

                return itemId.split("#")[inv_index];
            });
            // Combined Response

            let response: Array<IRfpResponseItems> = yield graphQLClient.mutate(
                "combineLineItems",
                COMBINE_LINE_ITEMS,
                {
                    ids,
                    userId: user_id,
                    projectId,
                    comboName,
                    uom,
                    quantityIds,
                    percentage,
                },
            );

            let hasFailed = false;
            //  If success , append to result array , else uncombine all from result array and call failure
            if (response?.length > 0) {
                let allFpItems = response.filter((item) => item?.floor_plan_id === "ALL");
                let nonFpItems = response.filter((item) => item?.floor_plan_id !== "ALL");
                let groupedObjects = groupBy(
                    allFpItems,
                    (item) =>
                        `${item.manufacturer}${item.scope}${item.description}${item.subcategory}${item.model_no}`,
                );
                let allFPMergedItems: IRfpResponseItems[] = Object.values(groupedObjects).map(
                    (groupedItems) => {
                        let fmergedObject = {
                            ...groupedItems[0],
                        };
                        fmergedObject.inventory_name = "";
                        fmergedObject.id = "";
                        fmergedObject.reno_item_id = "";
                        groupedItems.forEach((item, index) => {
                            fmergedObject.inventory_name +=
                                index == groupedItems.length - 1
                                    ? item.inventory_name
                                    : `${item.inventory_name}#`;
                            fmergedObject.id +=
                                index == groupedItems.length - 1 ? item.id : `${item.id}#`;

                            fmergedObject.reno_item_id +=
                                index == groupedItems.length - 1
                                    ? item.reno_item_id
                                    : `${item.reno_item_id}#`;
                        });
                        return fmergedObject;
                    },
                );
                response = [...allFPMergedItems, ...nonFpItems];
            } else {
                hasFailed = true;
            }

            if (hasFailed) {
                yield graphQLClient.mutate("uncombineLineItems", UNCOMBINE_LINE_ITEMS, {
                    uncombineLineItemsId: ids,
                    userId: user_id,
                });
                yield put(actions.biddingPortal.combineLineItemsFailed({}));
                yield put(
                    actions.common.openSnack({
                        variant: "error",
                        message: "Failed to combine line items",
                        open: true,
                    }),
                );
            } else {
                yield put(
                    actions.biddingPortal.combineLineItemsComplete({
                        ids: ids,
                        parentItems: response,
                        category: action.payload.category,
                        allFpItems: itemsListFromOneInventory,
                    }),
                );

                yield put(
                    actions.common.openSnack({
                        variant: "success",
                        message: "Successfully combined items",
                        open: true,
                    }),
                );
            }
        }
    } catch (error) {
        console.log(error);
        yield put(actions.biddingPortal.combineLineItemsFailed({}));
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Failed to combine line items",
                open: true,
            }),
        );
    }
}

export function* uncombineLineItems(action: PayloadAction<any>) {
    try {
        let idsToUncombine = action.payload.idsToUncombine;
        let user_id = localStorage?.getItem("user_id");
        //@ts-ignore
        let uncombinedIdsList: Array<string> = [];
        for (let id of idsToUncombine) {
            //@ts-ignore
            const response = yield graphQLClient.mutate(
                "uncombineLineItems",
                UNCOMBINE_LINE_ITEMS,
                {
                    uncombineLineItemsId: id,
                    userId: user_id,
                },
            );

            if (response) {
                yield put(
                    actions.biddingPortal.uncombineLineItemsComplete({
                        id: id,
                        category: action.payload.category,
                    }),
                );
                uncombinedIdsList.push(id);
            }
        }
        if (uncombinedIdsList.length === idsToUncombine?.length) {
            yield put(
                actions.common.openSnack({
                    variant: "success",
                    message: "Successfully uncombined items",
                    open: true,
                }),
            );
        } else {
            yield put(
                actions.common.openSnack({
                    variant: "error",
                    message:
                        uncombineLineItems?.length > 0
                            ? "There was an issue while uncombining line items, some combinations were not uncombined"
                            : "Error occured while uncombining line items",
                    open: true,
                }),
            );
        }
        yield put(actions.biddingPortal.uncombineLineItemsEnd({}));
    } catch (e) {
        console.log(e);
        yield put(actions.biddingPortal.uncombineLineItemsEnd({}));
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Failed to uncombine line items",
                open: true,
            }),
        );
    }
}

export function* updateUnitOfMeasure(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        const response = yield graphQLClient.mutate("updateUom", UPDATE_UNIT_OF_MEASURE, {
            input: [
                {
                    id: action.payload.id,
                    specific_uom: action.payload.specific_uom,
                },
            ],
        });
        if (response?.length > 0) {
            //success response
            yield put(
                actions.biddingPortal.fetchBidItemsStart({
                    projectId: action.payload.projectId,
                    contractorOrgId: action.payload.contractorOrgId,
                    renovationVersion: action.payload.renovationVersion,
                }),
            );

            yield put(actions.biddingPortal.updateUnitOfMeasureSuccess({}));
        } else {
            //failure response
            yield put(actions.biddingPortal.updateUnitOfMeasureFailure({}));
            yield put(
                actions.common.openSnack({
                    variant: "error",
                    message: "Failed to update the uom",
                    open: true,
                }),
            );
        }
    } catch (e) {
        console.log(e);
        yield put(actions.biddingPortal.updateUnitOfMeasureFailure({}));
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Failed to update the uom",
                open: true,
            }),
        );
    }
}

export function* updateComboName(action: PayloadAction<any>) {
    try {
        //eslint-disable-next-line
        let allFpCombinedId: Array<string> = action.payload.idsToUpdate;
        let idsToUpdate: Array<string> = action.payload.idsToUpdate;
        idsToUpdate = idsToUpdate[0].split("#").filter((id) => id);
        let user_id = localStorage?.getItem("user_id");
        //@ts-ignore
        let uncombinedIdsList: Array<string> = [];
        for (let id of idsToUpdate) {
            //@ts-ignore
            const response = yield graphQLClient.mutate("updateComboName", UPDATE_COMBO_NAME, {
                updateComboNameId: id,
                userId: user_id,
                comboName: action.payload.comboName,
            });
            if (response) {
                yield put(
                    actions.biddingPortal.updateComboNameComplete({
                        id: id,
                        category: action.payload.category,
                        comboName: action.payload.comboName,
                    }),
                );
                uncombinedIdsList.push(id);
            }
        }
        if (uncombinedIdsList.length === idsToUpdate?.length) {
            yield put(
                actions.common.openSnack({
                    variant: "success",
                    message: "Updated combination name",
                    open: true,
                }),
            );
        } else {
            yield put(
                actions.common.openSnack({
                    variant: "error",
                    message:
                        uncombineLineItems?.length > 0
                            ? "There was an issue with renaming all combined items"
                            : "Error occured while updating combination name",
                    open: true,
                }),
            );
        }
        yield put(actions.biddingPortal.updateComboNameEnd({}));
    } catch (e) {
        console.log(e);
        yield put(actions.biddingPortal.updateComboNameEnd({}));
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Failed to update combination name",
                open: true,
            }),
        );
    }
}

export function* fetchDiffFromRenovationVersion(action: PayloadAction<any>) {
    try {
        //@ts-ignore
        let resp = yield Promise.all([
            graphQLClient.query("RenovationVersion", GET_VERSIONED_DATA, {
                projectId: action.payload.projectId,
                version: action.payload.renovationVersion,
            }),
            graphQLClient.query("getBidItems", getBidItems, {
                bidRequestId: action?.payload?.bidResponse?.id,
                projectId: action.payload.projectId,
                contractorOrgId: action.payload.contractor_org_id,
            }),
        ]);
        let response = resp[0];
        let prevBidItems: { getBidItems: { bid_items: Array<IRfpResponseItems> } } = resp[1];
        let itemChangeLog: Record<string, Record<string, any>> = {};
        Object.keys(response?.renovationVersion?.change_log).forEach(
            (key) => (itemChangeLog[key] = {}),
        );
        Object.entries(response?.renovationVersion?.change_log).map(([key, value]) => {
            ((value as any)?.change_log as Array<Record<string, any>>)?.forEach((val) => {
                if (val?.type_of_change === "updated" && val?.reno_item_diff) {
                    itemChangeLog[key][val?.id] = { reno_item_diff: val?.reno_item_diff };
                    if (
                        "takeoff_values" in val.reno_item_diff &&
                        "old_value" in val.reno_item_diff.takeoff_values &&
                        val.reno_item_diff.takeoff_values.old_value
                    ) {
                        itemChangeLog[key][val?.id] = {
                            ...itemChangeLog[key][val?.id],
                            takeoff_values: {
                                ...groupBy(
                                    val.reno_item_diff["old_value"] ?? {},
                                    (item) => item.fp_id,
                                ),
                                ALL: {
                                    fp_id: "ALL",
                                    take_off_value:
                                        (val.reno_item_diff["old_value"] ?? [])?.reduce(
                                            (sum: number, curr: any) =>
                                                sum + (curr?.take_off_value ?? 0),
                                            0,
                                        ) ?? 0,
                                },
                            },
                        };
                    }
                }
            });
        });
        let quantityChangeLog: Record<string, { display: string; quantity: number }> = {};
        prevBidItems.getBidItems.bid_items.forEach((bid_item) => {
            let inventory_id: string | null = bid_item.inventory_id;
            let subgroup_id: string | null = bid_item.subgroup_id;
            let data = {
                display: `${bid_item.quantity} ${
                    (bid_item.specific_uom ?? bid_item.uom) !== "percentage"
                        ? `/ ${bid_item.specific_uom ?? bid_item.uom}`
                        : "%"
                }`,
                quantity: bid_item.quantity,
            };
            if (
                bid_item.floor_plan_id === "ALL" &&
                (bid_item.uom ?? bid_item.specific_uom) !== "percentage"
            ) {
                inventory_id = null;
                subgroup_id = null;
                let overallQuantity = 0;
                let uom = bid_item.specific_uom ? bid_item.specific_uom : bid_item.uom;
                prevBidItems.getBidItems.bid_items.forEach((item) => {
                    if (
                        item.reno_item_id === bid_item.reno_item_id &&
                        item.floor_plan_id !== "ALL"
                    ) {
                        overallQuantity += item.quantity * item.total_units;
                    }
                });
                data = {
                    display: `${overallQuantity?.toFixed(2)} / ${uom}`,
                    quantity: overallQuantity,
                };
            }
            quantityChangeLog[
                `${bid_item.reno_item_id}:${bid_item.floor_plan_id}:${inventory_id}:${subgroup_id}`
            ] = data;
        });

        yield put(
            actions.biddingPortal.fetchDiffFromRenovationVersionComplete({
                itemChangeLog,
                quantityChangeLog,
            }),
        );
    } catch (e) {
        console.log(e);
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Failed to load changes",
                open: true,
            }),
        );
    }
}

export function* fetchHistoricalPricingData(
    action: PayloadAction<{
        projectId: string;
        renovationVersion: number;
        contractorOrgId: string;
    }>,
) {
    const { projectId, contractorOrgId, renovationVersion } = action.payload;
    let transformedData: Record<
        string,
        {
            pc_item_id: string;
            historical_prices: Array<any>;
        }
    > = {};
    try {
        if (!projectId || !contractorOrgId || !renovationVersion) {
            throw new Error("Failed to load historical pricing data");
        }
        let response: {
            getBidItemsHistoricalPricing: Array<{
                pc_item_id: string;
                historical_prices: Array<any>;
            }>;
        } = yield graphQLClient.query("getBidItemsHistoricalPricing", GET_HISTORICAL_PRICING, {
            renovationVersion: renovationVersion,
            projectId: projectId,
            contractorOrgId: contractorOrgId,
        });
        let data = response?.getBidItemsHistoricalPricing;
        for (let item of data) {
            transformedData[item.pc_item_id] = item;
        }
    } catch (error) {
        console.log("error", error);
        yield put(
            actions.common.openSnack({
                variant: "error",
                message: "Failed to load historical pricing",
                open: true,
            }),
        );
    } finally {
        yield put(
            actions.biddingPortal.fetchHistoricalPricingDataEnd({
                historicalPricingData: transformedData,
            }),
        );
    }
}
