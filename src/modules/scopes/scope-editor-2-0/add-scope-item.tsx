/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Grid, Typography, CardHeader, IconButton, CardMedia, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BaseButton from "components/button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import BaseChipButton from "components/chip-button";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import ScopeRules from "utils/scopes.json";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import LinearProgress from "@mui/material/LinearProgress";
import {
    MATERIAL_LABOR_KIT,
    SCOPES,
    SCOPE_WORK_MAP,
    SIMPLE_MATERIAL_LABOR,
} from "components/container-admin-interface/constants";
import { useParams } from "react-router-dom";
import { IUser } from "stores/ims/interfaces";
import TrackerUtil from "utils/tracker";
interface IAddScope {
    scopeOptions?: any;
    closeAddScopeCard?: any;

    handleAddScopeItem?: any;
    index: any;
    scopeItemIndex: any;
    scopeItems?: any;
    setScopeItems?: any;
    scopeItem?: any;
    componentName?: any;
    componentScopeIndex?: any;
    isFromGroup?: any;
    scopeData?: any;
    isFromInventory?: any;
}

interface IScopeItem {
    [key: string]: any;
}
interface IScopeRules {
    [key: string]: IScopeItem;
}

const customSortOrder = [
    "Demo Existing",
    "Install New",
    "Remove and Store",
    "Reinstall Existing",
    "Repair Existing",
    "Refinish Existing",
    "Add New",
];

const customSort = (a: any, b: any) => {
    const aIndex = customSortOrder.indexOf(a.name);
    const bIndex = customSortOrder.indexOf(b.name);

    if (aIndex > -1 && bIndex > -1) {
        return aIndex - bIndex;
    } else if (aIndex > -1) {
        return -1;
    } else if (bIndex > -1) {
        return 1;
    } else {
        return 0;
    }
};
const AddScopeItemToCategory = ({
    scopeOptions,
    closeAddScopeCard,
    scopeItems,
    handleAddScopeItem,
    index,
    scopeItemIndex,
    setScopeItems,
    scopeItem,
    componentName,
    componentScopeIndex,
    isFromGroup,
    scopeData,
    isFromInventory,
}: IAddScope) => {
    const { loadingAddNewScope } = useAppSelector((state) => ({
        loadingAddNewScope: state.scopes.loadingAddNewScope,
    }));
    const dispatch = useAppDispatch();
    const ScopeRulesNew: IScopeRules = ScopeRules;
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const { projectId } = useParams();
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");

    const createScopeMap = (scopes: Array<string>, scopeMap: any, scope: string) => {
        if (scopes.includes(scope)) {
            let work_type = SCOPE_WORK_MAP[scope];
            if (
                scopes.filter((t) => t == scope).length == 3 &&
                work_type == SIMPLE_MATERIAL_LABOR
            ) {
                work_type = MATERIAL_LABOR_KIT;
            }
            scopeMap[scope] = { scope: scope, work_type: work_type };
        }
    };
    const handleSave = () => {
        const updatedScope = selectedItems.find(
            (item: any) => item.index == index && item.scopeItemIndex == scopeItemIndex,
        );
        const uoms = [];
        let uom = "";
        if (!isFromGroup) {
            scopeItems[index].items[scopeItemIndex].scopes = [
                ...scopeItems[index].items[scopeItemIndex].scopes,
                ...updatedScope.scopes.filter((si: any) => si.isSelected),
            ]?.sort(customSort);
            scopeItems[index].items[scopeItemIndex].availableScopesToAdd = [
                ...updatedScope.scopes.filter((si: any) => !si.isSelected),
            ]?.sort(customSort);

            uom = scopeItems[index].items[scopeItemIndex].uom ?? false;
            uom && uoms.push({ uom });
        } else {
            scopeItems[index].items[scopeItemIndex][`${componentName}`][
                componentScopeIndex
            ].scopes = [
                ...scopeItems[index].items[scopeItemIndex][`${componentName}`][componentScopeIndex]
                    .scopes,
                ...updatedScope.scopes.filter((si: any) => si.isSelected),
            ]?.sort(customSort);
            scopeItems[index].items[scopeItemIndex][`${componentName}`][
                componentScopeIndex
            ].availableScopesToAdd = [
                ...updatedScope.scopes.filter((si: any) => !si.isSelected),
            ]?.sort(customSort);
            uom =
                scopeItems[index].items[scopeItemIndex][`${componentName}`][componentScopeIndex]
                    .uom ?? false;
            uom &&
                uoms.push({
                    uom,
                });
        }
        const scopeMap = {} as any;
        const currScopes = scopeItem.scopes.map((scope: any) => scope.name) as Array<string>;
        setScopeItems([...scopeItems]);
        SCOPES.forEach((scope) => {
            createScopeMap(currScopes, scopeMap, scope);
        });
        setSelectedItems((state: any) => [
            ...state,
            { ...updatedScope, scopes: updatedScope.scopes.filter((us: any) => !us.isSelected) },
        ]);
        const scopes = Object.values(scopeMap);
        let reqData: any = {
            category: scopeItems[index].name,
            item_name: scopeItem.name,
            user: email,
        };
        if (!isFromInventory) {
            //for createnewcontainer api (mdm) >> it will create new item in mdm and here
            //we need to pass all the existing scopeoptions along with newly added because we using create api and there is no update api provided

            reqData["scopes"] = scopes;
            reqData["component"] = scopeItem.component;
            reqData["uoms"] = uoms;
            reqData["is_active"] = true;
            reqData["project_support"] = [scopeData?.projectType?.toLowerCase() || "interior"];
        }
        if (isFromInventory) {
            //for add new item api >> it will update renos based on input from scope options
            //and here we need to pass only selected scope options
            reqData["scopes"] = scopeItem.scopes
                .filter((scope: any) => scope.isSelected)
                .map((scope: any) => scope.name) as Array<string>;
            reqData["project_id"] = projectId;
            reqData["user_id"] = localStorage.getItem("user_id");
            reqData["work_package"] = "Simple Material/Labor";
            reqData["uom"] = uom || "count";
            dispatch(actions.scopes.createNewItemScopesReqDetails(reqData));
        } else {
            dispatch(
                actions.scopes.upsertSubcategoryScopeOptionsStart({
                    reqData: reqData,
                    newScopes: scopeItem.scopes
                        .filter((item: any) => !item.containerItemIds)
                        .map((x: any) => x.name),
                }),
            );
        }
        TrackerUtil.event("CONTAINER_V2_UPDATE_SCOPE", {
            category: scopeItems[index].name,
            item_name: scopeItem.name,
            email,
        });
    };
    const checkDisableStatus = (option: any) => {
        let parentScope: any[] = [];
        Object.keys(ScopeRulesNew).map((key: any) => {
            if (key == option.name) {
                parentScope = ScopeRulesNew[key].parent_scope;
            }
        });
        let isParentSelected = true;

        scopeItems[index].items[scopeItemIndex][`${componentName}`][
            componentScopeIndex
        ].availableScopesToAdd.filter((scope: any, index: number) => {
            if (parentScope.includes(scope.name)) {
                isParentSelected = scope.isSelected;
            }
        });
        return isParentSelected;
    };

    const getIsDisabled = (option: { name: any }) => {
        let parentScope: any[] = [];
        Object.keys(ScopeRulesNew).map((key: any) => {
            if (key == option.name) {
                parentScope = ScopeRulesNew[key].parent_scope;
            }
        });

        let isParentSelected = true;
        if (parentScope?.length > 0) {
            scopeItems[index].items[scopeItemIndex].availableScopesToAdd.forEach((scope: any) => {
                if (parentScope.includes(scope.name)) {
                    isParentSelected = scope.isSelected;
                } else {
                    isParentSelected = false;
                }
            });
        }

        return isParentSelected;
    };
    interface Option {
        isSelected: boolean;
        name: string;
    }
    const handleBaseChipSelection = (option: Option, itemIndex: number): void => {
        let isSelected = !option.isSelected;
        let childScopeData: any[] = [];
        let scopeItem = isFromGroup
            ? scopeItems[index].items[scopeItemIndex][componentName][componentScopeIndex]
            : scopeItems[index].items[scopeItemIndex];

        // Get child scope data
        childScopeData = ScopeRulesNew[option.name]?.child_scope ?? [];

        // Update available scopes based on condition
        let updatedScopes = scopeItem.availableScopesToAdd.map((scope: any) => ({
            ...scope,
            isSelected:
                childScopeData.includes(scope.name) || scope.name == option.name
                    ? isSelected
                    : scope.isSelected,
        }));
        // Update relevant parts of the state object
        if (isFromGroup) {
            scopeItems[index].items[scopeItemIndex][componentName][
                componentScopeIndex
            ].availableScopesToAdd = updatedScopes;
        } else {
            scopeItem.availableScopesToAdd = updatedScopes;
        }

        // Update new scopes for selected items
        setScopeItems([...scopeItems]);

        // Add selected items
        let newItem = {
            name: scopeItems[index].name,
            scopes: updatedScopes,
            index,
            scopeItemIndex,
            componentName,
            componentScopeIndex,
        };
        let newItemExists = false;
        let existingItems = [...selectedItems];
        existingItems.forEach((existingItem: any, index: any) => {
            if (
                existingItem.componentName === newItem.componentName &&
                existingItem.scopeItemIndex === newItem.scopeItemIndex &&
                existingItem.componentScopeIndex === newItem.componentScopeIndex &&
                existingItem.index === newItem.index
            ) {
                existingItems[index] = newItem;
                newItemExists = true;
            }
        });

        if (!newItemExists) {
            existingItems.push(newItem);
        }
        setSelectedItems(existingItems);
    };
    const tooltipInfo: any = {
        "Demo Existing": "Demolish Existing and Install New both will be activated together.",
        "Remove and Store":
            "Remove and Store and Reinstall Existing both will be activated together.",
    };
    console.log("scopeitems", scopeItems);

    return (
        <Card sx={{ marginTop: "10px", marginBottom: "10px" }}>
            <CardHeader
                title={
                    <Typography style={{ fontSize: "14px", lineHeight: "18px", fontWeight: "500" }}>
                        Add Scope items
                    </Typography>
                }
                sx={{ padding: "5px 16px" }}
                action={
                    <IconButton aria-label="close" onClick={() => closeAddScopeCard()}>
                        <CloseIcon />
                    </IconButton>
                }
            />

            <CardContent sx={{ padding: "0px 16px" }}>
                <Grid
                    container
                    wrap="wrap"
                    gridTemplateColumns="repeat(5, 1fr)"
                    display={"grid"}
                    rowGap="0.3rem"
                    columnGap={"0.3rem"}
                >
                    {scopeItem?.availableScopesToAdd?.length ? (
                        scopeItem?.availableScopesToAdd?.map((option: any, itemIndex: number) => {
                            let clickable =
                                isFromGroup == true
                                    ? checkDisableStatus(option)
                                    : getIsDisabled(option);
                            return (
                                <BaseChipButton
                                    key={`scope-items-addl-option-${option.name}-${itemIndex}-${index}-${scopeItem.name}-${scopeItemIndex}`}
                                    fullWidth
                                    classes={`${option.isSelected ? "selected" : "primary"}`}
                                    type={
                                        (
                                            isFromGroup == true
                                                ? checkDisableStatus(option)
                                                : getIsDisabled(option)
                                        )
                                            ? "default"
                                            : "disabled"
                                    }
                                    tooltip={tooltipInfo[option.name] || ""}
                                    onClick={
                                        clickable
                                            ? () => {
                                                  handleBaseChipSelection(option, itemIndex);
                                              }
                                            : undefined
                                    }
                                    label={option.name}
                                    startIcon={option.isSelected ? <DoneIcon /> : <AddIcon />}
                                />
                            );
                        })
                    ) : (
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                mt: 2,
                                width: "max-content",
                            }}
                        >
                            No new scopes available to add ... !!!
                        </Typography>
                    )}
                </Grid>
            </CardContent>
            {loadingAddNewScope && (
                <Box sx={{ width: "100%", marginTop: "15px" }}>
                    <LinearProgress />
                </Box>
            )}
            <CardActions sx={{ justifyContent: "end" }}>
                <BaseButton
                    classes="invisible default"
                    onClick={() => closeAddScopeCard()}
                    label={"Cancel"}
                    startIcon={null}
                    variant={"text_16_semibold"}
                />
                <BaseButton
                    classes="activeLight"
                    variant={"text_16_semibold"}
                    onClick={() => handleSave()}
                    label={"Save"}
                    startIcon={null}
                    disabled={
                        !scopeItem?.availableScopesToAdd?.some((scope: any) => scope.isSelected)
                    }
                />
            </CardActions>
        </Card>
    );
};
export default React.memo(AddScopeItemToCategory);
