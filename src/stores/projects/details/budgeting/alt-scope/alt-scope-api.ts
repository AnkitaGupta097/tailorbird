import { put, all } from "@redux-saga/core/effects";
import {
    GET_ALT_PACKAGE,
    GET_ALT_PACKAGES,
    GET_SCOPE_TREE_FOR_ALT_SCOPE,
    GET_ALT_SCOPE_EDIT_TREE,
    GET_ALT_SCOPE,
} from "./alt-scope-queries";
import {
    CREATE_ALT_SCOPE,
    DELETE_ALT_SCOPE,
    DELETE_ALT_PACKAGE,
    EDIT_ALT_PACKAGE,
    EDIT_ALT_SCOPE_DEFINITION,
    ADD_ALT_PACKAGE,
} from "./alt-scope-mutations";
import actions from "../../../../actions";
import { graphQLClient } from "../../../../../utils/gql-client";
import { PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import {
    addItem,
    addItemFailure,
    fetchItemFailure,
    removeItem,
    removeItemFailure,
    updateItem,
    updateItemFailure,
} from "../snack-messages";

interface scopeTreeResponse {
    scopeTree: any[];
}

export function* fetchAltScope(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALT_SCOPE, {
            projectId: action.payload.projectId,
        });
        yield put(actions.budgeting.fetchAltScopeSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchAltScopeFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("alt scope renovation items"))),
        ]);
    }
}

export function* fetchAltPackage(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALT_PACKAGE, {
            project_id: action.payload.projectId,
        });
        yield put(actions.budgeting.fetchAltPackageSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchAltPackageFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("alt packages"))),
        ]);
    }
}

export function* fetchAltPackages(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.query("", GET_ALT_PACKAGES, {
            ownershipGroupId: action.payload.ownershipId,
            containerVersion: action.payload.container_version,
        });
        yield put(actions.budgeting.fetchAltPackagesSuccess(response));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchAltPackagesFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("alt packages"))),
        ]);
    }
}

export function* addAltPackage(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("altPackages", ADD_ALT_PACKAGE, {
            projectId: action.payload.projectId,
            packageId: action.payload.packageId,
            ownershipGroupId: action.payload.ownershipId,
            createdBy: action.payload.createdBy,
        });
        yield all([
            put(actions.budgeting.addAltPackageSuccess({ altPackages: response })),
            put(actions.budgeting.fetchAltScopeStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(addItem("alt package"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.addAltPackageFailure(error)),
            put(actions.common.openSnack(addItemFailure("alt package"))),
        ]);
    }
}

export function* deleteAltPackage(action: PayloadAction<any>) {
    try {
        // eslint-disable-next-line
        yield graphQLClient.mutate("", DELETE_ALT_PACKAGE, {
            projectId: action.payload.projectId,
            createdBy: action.payload.createdBy,
        });
        yield all([
            put(actions.budgeting.removeCommonAltPackage(action.payload.packageId)),
            put(actions.budgeting.deleteAltPackageSuccess({ id: action.payload.packageId })),
            put(actions.budgeting.fetchAltScopeStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(removeItem("alt package"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.deleteAltPackageFailure(error)),
            put(actions.common.openSnack(removeItemFailure("alt package"))),
        ]);
    }
}

export function* editAltPackage(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("", EDIT_ALT_PACKAGE, {
            projectId: action.payload.projectId,
            packageId: action.payload.packageId,
        });
        yield all([
            put(actions.budgeting.editAltPackageSuccess(response)),
            put(actions.budgeting.fetchAltScopeStart({ projectId: action.payload.projectId })),
            put(actions.common.openSnack(updateItem("alt package"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.editAltPackageFailure(error)),
            put(actions.common.openSnack(updateItemFailure("alt package"))),
        ]);
    }
}

export function* fetchScopeTreeForAltScope(action: PayloadAction<any>) {
    try {
        const response: scopeTreeResponse = yield graphQLClient.query(
            "",
            GET_SCOPE_TREE_FOR_ALT_SCOPE,
            {
                project_id: action.payload.projectId,
            },
        );
        let res = {
            scopeTree: response.scopeTree.map((category: any) => {
                let categoryCopy = {
                    ...category,
                    items: category.items.map((item: any) => {
                        let itemCopy = {
                            ...item,
                            scopes: item.scopes.map((scope: any) => {
                                let scopeCopy = { ...scope };
                                return merge({}, scopeCopy, {
                                    isSelected: scope.isSelected ?? false,
                                });
                            }),
                            isAltSku: false,
                        };
                        return merge({}, itemCopy, { isSelected: !item.excluded });
                    }),
                };
                return merge({}, categoryCopy, { isSelected: !!category.items.length });
            }),
        };
        yield put(actions.budgeting.fetchAltScopeTreeSuccess(res));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchAltScopeTreeFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("alt scope tree"))),
        ]);
    }
}

export function* fetchEditAltScopeTree(action: PayloadAction<any>) {
    try {
        const response: scopeTreeResponse = yield graphQLClient.query("", GET_ALT_SCOPE_EDIT_TREE, {
            project_id: action.payload.projectId,
        });
        let res = {
            scopeTree: response.scopeTree.map((category: any) => {
                let categoryCopy = {
                    ...category,
                    items: category.items.map((item: any) => {
                        let itemCopy = {
                            ...item,
                        };
                        return merge({}, itemCopy, { isSelected: !item.excluded });
                    }),
                };
                return merge({}, categoryCopy, { isSelected: !!category.items.length });
            }),
        };
        yield put(actions.budgeting.fetchAltScopeEditTreeSuccess(res));
    } catch (error) {
        yield all([
            put(actions.budgeting.fetchAltScopeEditTreeFailure(error)),
            put(actions.common.openSnack(fetchItemFailure("edit alt scope tree"))),
        ]);
    }
}

export function* createAltScope(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate("renovations", CREATE_ALT_SCOPE, {
            createAltScopePayload: {
                project_id: action.payload.projectId,
                base_package_id: action.payload.basePackageId,
                alt_package_id: action.payload.altPackageId,
                data: action.payload.data.map((item: any) => ({
                    category: item.category,
                    scope: item.scope,
                    item: item.item,
                    is_alt_sku: item.isAltSku ?? false,
                })),
                created_by: action.payload.createdBy,
            },
        });
        yield all([
            put(actions.budgeting.createAltScopeSuccess({ renovations: response })),
            put(actions.common.openSnack(addItem("alt scope"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.createAltScopeFailure(error)),
            put(actions.common.openSnack(addItemFailure("alt scope"))),
        ]);
    }
}

export function* editAltScope(action: PayloadAction<any>) {
    try {
        const response: any[] = yield graphQLClient.mutate(
            "renovations",
            EDIT_ALT_SCOPE_DEFINITION,
            {
                updateAltScopePayload: {
                    project_id: action.payload.projectId,
                    base_package_id: action.payload.basePackageId,
                    alt_package_id: action.payload.altPackageId,
                    data: action.payload.data.map((item: any) => ({
                        category: item.category,
                        scope: item.scope,
                        item: item.item,
                        is_alt_sku: item.isAltSku ?? false,
                    })),
                    updated_by: action.payload.updatedBy,
                },
            },
        );
        yield all([
            put(actions.budgeting.createAltScopeSuccess({ renovations: response })),
            put(actions.common.openSnack(updateItem("alt scope"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.createAltScopeFailure(error)),
            put(actions.common.openSnack(updateItemFailure("alt scope"))),
        ]);
    }
}

export function* deleteAltScope(action: PayloadAction<any>) {
    try {
        yield graphQLClient.mutate("", DELETE_ALT_SCOPE, {
            project_id: action.payload.projectId,
        });
        yield all([
            put(actions.budgeting.deleteAltScopeSuccess({ renovations: [], scopeTrees: [] })),
            put(actions.common.openSnack(removeItem("alt scope"))),
        ]);
    } catch (error) {
        yield all([
            put(actions.budgeting.deleteAltScopeFailure(error)),
            put(actions.common.openSnack(removeItemFailure("alt scope"))),
        ]);
    }
}
