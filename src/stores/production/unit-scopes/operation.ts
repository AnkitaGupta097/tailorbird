import { groupBy } from "lodash";
import { PayloadAction } from "@reduxjs/toolkit";
import { graphQLClient } from "utils/gql-client";
import { put } from "@redux-saga/core/effects";
import {
    GET_UNIT_SCOPES,
    UPDATE_UNIT_SCOPE,
    GET_SCOPE,
    CHANGE_REQUEST,
    UPDATE_PRICING_GROUP,
    START_SCOPES,
    MARK_AS_COMPLETE_SCOPES,
    ADD_UNIT_SCOPE_ITEM,
    ACTIVATE_SCOPE_ITEM,
    DEACTIVATE_SCOPE_ITEM,
    ACTIVATE_PRICING_GROUP,
    DEACTIVATE_PRICING_GROUP,
} from "./queries";
import actions from "../../actions";
import TrackerUtil from "utils/tracker";

export function* fetchRenoUnitScopes(action: PayloadAction<any>) {
    const renoUnitId = action.payload.renoUnitId;

    try {
        // @ts-ignore
        const response: { getUnitScopes } = yield graphQLClient.query(
            "GetUnitScopes",
            GET_UNIT_SCOPES,
            {
                renoUnitId,
            },
        );
        yield put(
            actions.production.unitScopes.fetchRenoUnitScopesSuccess({
                renoUnitId,
                unitScopes: response.getUnitScopes || [],
            }),
        );
    } catch (exception) {
        yield put(
            actions.production.unitScopes.fetchRenoUnitScopesFailure({
                unitScopes: [],
            }),
        );
    }
}

export function* updateUnitScope(action: PayloadAction<any>) {
    const payload = action.payload.updatePayload;
    const renoUnitId = action.payload.renoUnitId;
    const successMsg = action.payload.successMsg;
    const errorEvent = action.payload.errorEvent;

    try {
        // @ts-ignore
        yield graphQLClient.mutate("updateRenovationUnitScope", UPDATE_UNIT_SCOPE, payload);

        yield put(
            actions.production.unitScopes.fetchSingleUnitScopeStart({
                scopeId: payload.scopeId,
                successMessage: successMsg || "Updated Successfully!!",
            }),
        );

        yield put(
            actions.production.approval.fetchApprovalsStart({
                renoUnitId,
            }),
        );

        yield put(
            actions.production.unit.fetchRenovationUnitStart({
                renoUnitId: renoUnitId,
            }),
        );
    } catch (exception: any) {
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                scopeId: payload.scopeId,
                projectName: action.payload.projectName,
            },
            errorEvent,
        );

        yield put(actions.production.unitScopes.updateUnitScopeFailure({}));

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* addRenoUnitScopeItem(action: PayloadAction<any>) {
    const payload = action.payload.newItemData;
    const renoUnitId = action.payload.renoUnitId;
    const projectName = action.payload.projectName;
    const successMessage = "New scope item sent for approval";

    try {
        // @ts-ignore
        yield graphQLClient.mutate("addRenovationUnitScopeItem", ADD_UNIT_SCOPE_ITEM, payload);
        const isAddingToCurrentUnit = payload.renoUnitIds.includes(renoUnitId);
        if (isAddingToCurrentUnit) {
            yield put(
                actions.production.unitScopes.fetchSingleUnitScopeStart({
                    scopeId: payload.unitScopeId,
                    successMessage,
                }),
            );

            yield put(
                actions.production.approval.fetchApprovalsStart({
                    renoUnitId,
                }),
            );
        } else {
            yield put(actions.production.unitScopes.addRenovationUnitScopeItemSuccess({}));

            yield put(
                actions.common.openSnack({
                    message: successMessage,
                    variant: "success",
                    open: true,
                }),
            );
        }
    } catch (exception: any) {
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;

        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                scopeId: payload.unitScopeId,
                newItemName: payload.name,
                projectName,
            },
            "SUBMIT_NEW_LINE_ITEM_FAILED",
        );

        yield put(actions.production.unitScopes.addRenovationUnitScopeItemFailure({}));

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* updateMultipleUnitScopes(action: PayloadAction<any>) {
    const scopeIds = action.payload.scopeIds;
    const actionType = action.payload.type;
    const renoUnitId = action.payload.renoUnitId;

    try {
        // @ts-ignore
        if (actionType === "start-scope") {
            yield graphQLClient.mutate("startRenovationUnitScopes", START_SCOPES, action.payload);

            yield put(
                actions.production.unitScopes.fetchRenoUnitScopesStart({
                    renoUnitId,
                }),
            );
            yield put(
                actions.production.approval.fetchApprovalsStart({
                    renoUnitId,
                }),
            );
            yield put(
                actions.common.openSnack({
                    message: `${scopeIds?.length} categories moved to In Progress`,
                    variant: "success",
                    open: true,
                }),
            );
        } else if (actionType === "complete-scope") {
            yield graphQLClient.mutate(
                "markRenovationUnitScopesAsComplete",
                MARK_AS_COMPLETE_SCOPES,
                action.payload,
            );
            yield put(
                actions.production.unitScopes.fetchRenoUnitScopesStart({
                    renoUnitId,
                }),
            );
            yield put(
                actions.production.approval.fetchApprovalsStart({
                    renoUnitId,
                }),
            );
            yield put(
                actions.common.openSnack({
                    message: `${scopeIds?.length} categories sent for approval`,
                    variant: "success",
                    open: true,
                }),
            );
        }
    } catch (exception: any) {
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;

        TrackerUtil.error(
            exception,
            {
                projectName: action.payload.projectName,
                renoUnitId,
                scopeIds: scopeIds,
            },
            actionType === "start-scope"
                ? "START_SCOPES_BULK_ACTION_FAILED"
                : "MARK_AS_COMPLETED_SCOPES_BULK_ACTION_FAILED",
        );

        yield put(actions.production.unitScopes.updateUnitScopeFailure({}));

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* fetchSingleUnitScope(action: PayloadAction<any>) {
    const scopeId = action.payload.scopeId;
    const successMessage = action.payload.successMessage;

    try {
        // @ts-ignore
        const response: { getUnitScope } = yield graphQLClient.query("GetUnitScope", GET_SCOPE, {
            unitScopeId: scopeId,
        });

        yield put(
            actions.production.unitScopes.fetchSingleUnitScopeSuccess({
                scopeId,
                scope: response.getUnitScope,
            }),
        );

        if (successMessage) {
            yield put(
                actions.common.openSnack({
                    message: successMessage,
                    variant: "success",
                    open: true,
                }),
            );
        }
    } catch {
        yield put(actions.production.unitScopes.fetchRenoUnitScopesFailure({}));
    }
}

export function* updateUnitScopeItem(action: PayloadAction<any>) {
    const payload = action.payload.updatePayload;
    const renoUnitId = action.payload.renoUnitId;
    const scopeId = action.payload.scopeId;
    const successMessage = action.payload.successMessage;
    try {
        // @ts-ignore
        yield graphQLClient.mutate("updateRenovationUnitScopeItem", CHANGE_REQUEST, payload);

        yield put(
            actions.production.unitScopes.fetchSingleUnitScopeStart({
                scopeId,
                successMessage: successMessage ? successMessage : "Change Request Sent!",
            }),
        );

        yield put(
            actions.production.approval.fetchApprovalsStart({
                renoUnitId,
            }),
        );
    } catch (exception: any) {
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                scopeId,
                itemId: payload.scopeItemId,
                projectName: action.payload.projectName,
            },
            "RAISING_CHANGE_ORDER_FAILED",
        );

        yield put(actions.production.unitScopes.updateUnitScopeFailure({}));

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* activateScopeItem(action: PayloadAction<any>) {
    try {
        const { renoUnitIds, activateUnitScopeItemsId } = action.payload;
        const requestPayload = { renoUnitIds, activateUnitScopeItemsId };
        // @ts-ignore
        const response = yield graphQLClient.mutate(
            "activateUnitScopeItems",
            ACTIVATE_SCOPE_ITEM,
            requestPayload,
        );

        const items = response?.items;
        const groupedItemsByUnitId = groupBy(items, "reno_unit_id");

        yield put(actions.production.unitScopes.activateScopeItemSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Activated scope item",
                variant: "success",
                open: true,
            }),
        );
        yield put(actions.production.unitScopes.updateItems({ itemsByUnit: groupedItemsByUnitId }));
    } catch (exception: any) {
        yield put(actions.production.unitScopes.activateScopeItemFailure({}));

        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(exception, action.payload, "ACTIVATE_LINE_ITEM_FAILED");

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* deActivateScopeItem(action: PayloadAction<any>) {
    try {
        const { renoUnitIds, deActivateUnitScopeItemsId } = action.payload;
        const requestPayload = { renoUnitIds, deActivateUnitScopeItemsId };
        // @ts-ignore

        const response = yield graphQLClient.mutate(
            "deActivateUnitScopeItems",
            DEACTIVATE_SCOPE_ITEM,
            requestPayload,
        );

        const items = response?.items;
        const groupedItemsByUnitId = groupBy(items, "reno_unit_id");

        yield put(actions.production.unitScopes.deActivateScopeItemSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Deactivated scope item",
                variant: "success",
                open: true,
            }),
        );
        yield put(actions.production.unitScopes.updateItems({ itemsByUnit: groupedItemsByUnitId }));
    } catch (exception: any) {
        yield put(actions.production.unitScopes.deActivateScopeItemFailure({}));
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(exception, action.payload, "DEACTIVATE_LINE_ITEM_FAILED");

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* activatePricingGroup(action: PayloadAction<any>) {
    try {
        const { renoUnitIds, activatePricingGroupsId } = action.payload;
        const requestPayload = { renoUnitIds, activatePricingGroupsId };

        // @ts-ignore
        const response = yield graphQLClient.mutate(
            "activatePricingGroups",
            ACTIVATE_PRICING_GROUP,
            requestPayload,
        );
        const pricingGroups = response?.pricing_groups;
        const pricingGroupByUnit = groupBy(pricingGroups, "reno_unit_id");

        yield put(
            actions.production.unitScopes.updatePricingGroupAndItems({
                pricingGroupByUnit,
            }),
        );

        yield put(actions.production.unitScopes.activatePricingGroupSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Activated combined row",
                variant: "success",
                open: true,
            }),
        );
    } catch (exception: any) {
        yield put(actions.production.unitScopes.activatePricingGroupFailure({}));
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(exception, action.payload, "ACTIVATE_PRICING_GROUP_FAILED");

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* deActivatePricingGroup(action: PayloadAction<any>) {
    const { renoUnitIds, deActivatePricingGroupsId } = action.payload;
    const requestPayload = { renoUnitIds, deActivatePricingGroupsId };
    try {
        // @ts-ignore
        const response = yield graphQLClient.mutate(
            "deActivatePricingGroups",
            DEACTIVATE_PRICING_GROUP,
            requestPayload,
        );

        yield put(actions.production.unitScopes.deActivatePricingGroupSuccess({}));
        yield put(
            actions.common.openSnack({
                message: "Deactivated combined row",
                variant: "success",
                open: true,
            }),
        );

        const pricingGroups = response?.pricing_groups;
        const pricingGroupByUnit = groupBy(pricingGroups, "reno_unit_id");

        yield put(
            actions.production.unitScopes.updatePricingGroupAndItems({
                pricingGroupByUnit,
            }),
        );
    } catch (exception: any) {
        yield put(actions.production.unitScopes.deActivatePricingGroupFailure({}));
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(exception, action.payload, "DEACTIVATE_PRICING_GROUP_FAILED");

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}

export function* updateItemPricingGroup(action: PayloadAction<any>) {
    const payload = action.payload.updatePayload;
    const renoUnitId = action.payload.renoUnitId;
    const scopeId = action.payload.scopeId;
    const successMessage = action.payload.successMessage;

    try {
        // @ts-ignore
        yield graphQLClient.mutate("updateItemPricingGroup", UPDATE_PRICING_GROUP, payload);
        yield put(
            actions.production.unitScopes.fetchSingleUnitScopeStart({
                scopeId,
                successMessage: successMessage ?? "Change Request Sent!",
            }),
        );
        yield put(
            actions.production.approval.fetchApprovalsStart({
                renoUnitId,
            }),
        );
    } catch (exception: any) {
        const descMsg = exception?.graphQLErrors[0].extensions.response.body.error.description;
        TrackerUtil.error(
            exception,
            {
                renoUnitId,
                projectName: action.payload.projectName,
                scopeId: payload.scopeId,
                pricingGroupId: payload?.pricing_group_id,
            },
            "RAISING_CHANGE_ORDER_FAILED",
        );

        yield put(actions.production.unitScopes.updateUnitScopeFailure({}));

        yield put(
            actions.common.openSnack({
                message: descMsg || exception?.message,
                variant: "error",
                open: true,
            }),
        );
    }
}
