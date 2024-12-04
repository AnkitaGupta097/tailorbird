import React, { useState, useEffect } from "react";
import BaseButton from "components/base-button";
import BaseScopeContent from "./base-scope-content";
import BaseSelectionCard from "components/base-selection-card";
import ScopeDefinition from "../scope-definition";
import ScopeDefinitionV2 from "../scope-definition-2-0";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import ScopeTable from "../scope-table";
import { cloneDeep } from "lodash";
import {
    Grid,
    CircularProgress as Loader,
    Dialog,
    DialogTitle,
    Typography,
    Box,
} from "@mui/material";
import actions from "stores/actions";
import EllipseIcon from "assets/icons/icon-ellipses.svg";
import { ICategory } from "stores/projects/details/budgeting/base-scope/base-scope-models";
import { useParams } from "react-router-dom";
import { getSelections, getInventoriesWithRenos } from "./service";
import BaseIconButton from "components/base-icon-button";
import CloseIcon from "assets/icons/icon-close.svg";
import { FETCH_USER_DETAILS } from "modules/projects/constant";
import { getFormattedScopeContainerTree } from "modules/scopes/scopes-editor/service";
import { graphQLClient } from "utils/gql-client";
import { UPDATE_SCOPE_OF_EXISTING_ITEM } from "stores/projects/details/budgeting/base-scope/base-scope-mutations";
const defaultScope = {
    description: "",
    id: "",
    name: "",
    ownership: "",
    containerVersion: "1.0",
    ownershipGroupId: null,
};

const BaseScope = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const {
        inventories,
        scopeDetails,
        catLoading,
        basePackageId,
        scopes,
        flooringTakeOffs,
        isFlooringScopeDefined,
        overallWavg,
        currentInv,
        projectDetails,
        createNewItemScopesReqData,
    } = useAppSelector((state) => ({
        inventories: state.budgeting.details.baseScope.inventories,
        scopeDetails: state.budgeting.details.baseScope.categories,
        catLoading: state.budgeting.details.baseScope.categories.loading,
        basePackageId: state.budgeting.details.basePackage.data?.[0]?.id,
        scopes: state.budgeting.commonEntities.scopes,
        flooringTakeOffs: state.budgeting.details.flooringScope.flooringTakeOffs,
        isFlooringScopeDefined:
            state.budgeting.commonEntities.budgetMetadata.isFlooringScopeDefined,
        overallWavg: state.budgeting.commonEntities.overallWavg,
        currentInv: state.budgeting.commonEntities.selectedInv,
        projectDetails: state.projectDetails?.data,
        createNewItemScopesReqData: state.scopes.createNewItemScopesReqData,
    }));
    const [open, setOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isRollUp, setIsRollUp] = useState(false);
    const [rollUpItems, setRollUpItems] = useState([]);
    const [selectedScope, setSelectedScope] = useState<any>(defaultScope);
    const [inventoriesCopy, setInventoriesCopy] = useState(getInventoriesWithRenos(inventories));
    const [scopeDetailsCopy, setScopeDetailsCopy] = useState<ICategory[]>(
        cloneDeep(scopeDetails.data || []),
    );

    const [selectedInventory, setSelectedInventory] = useState(
        inventoriesCopy?.find((it: any) => it.id == currentInv) || inventoriesCopy?.[0],
    );
    const [isDefined, setIsDefined] = useState(!!inventoriesCopy?.[0]?.baseScopeId);

    useEffect(() => {
        setSelectedInventory(
            inventoriesCopy?.find((it: any) => it.id == currentInv) || inventoriesCopy?.[0],
        );
        setIsDefined(!!inventoriesCopy?.[0]?.baseScopeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventoriesCopy]);

    useEffect(() => {
        setInventoriesCopy(getInventoriesWithRenos(inventories));
    }, [inventories]);

    useEffect(() => {
        const scope = scopes.find((scope: any) => scope.id === selectedInventory?.baseScopeId);
        setSelectedScope({ ...scope });
        selectedInventory &&
            dispatch(
                actions.budgeting.updateCurrentInv({
                    selectedInv: selectedInventory?.id,
                }),
            );
        // eslint-disable-next-line
    }, [selectedInventory, scopes]);
    const fetchMergeInfo = () => {
        dispatch(
            actions.scopes.fetchMergeRenoItemByProjectStart({
                projectId: params.projectId,
            }),
        );
    };
    useEffect(() => {
        if (selectedScope?.id) {
            dispatch(
                actions.budgeting.fetchBaseScopeDetailsStart({
                    scopeId: selectedScope?.id,
                    projectId: params.projectId,
                }),
            );
            if (selectedScope.containerVersion && Number(selectedScope.containerVersion) > 2) {
                dispatch(actions.scopes.fetchScopeLibraryStart({ id: selectedScope?.id }));
                fetchMergeInfo();
            }
        }
        // eslint-disable-next-line
    }, [selectedScope?.id]);

    let flooringItems = flooringTakeOffs?.flooringItems.map((fitem: any) => {
        return fitem.toLowerCase();
    });
    useEffect(() => {
        if (scopeDetails.data?.length) {
            let scopeDetailsDeepClone = cloneDeep(scopeDetails.data);
            if (isFlooringScopeDefined === true) {
                let flooringCatDataIndex: any = scopeDetails.data.findIndex(
                    (item: any) => item.name.toLocaleLowerCase() == "flooring",
                );
                if (flooringCatDataIndex >= 0) {
                    let flooringCategoryDataCopy = cloneDeep(
                        scopeDetails.data[flooringCatDataIndex],
                    );
                    let filteredFlooringItems: any = [];
                    flooringCategoryDataCopy.items.forEach((element: any) => {
                        let str = element.name.toLowerCase();
                        if (flooringItems.some((v) => str.includes(v)) == false) {
                            filteredFlooringItems.push(element);
                        }
                    });
                    flooringCategoryDataCopy.items = filteredFlooringItems;
                    scopeDetailsDeepClone.splice(flooringCatDataIndex, 1, flooringCategoryDataCopy);
                }
            }
            const scopeListFormatted = getFormattedScopeContainerTree(scopeDetailsDeepClone);
            setScopeDetailsCopy(scopeListFormatted);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scopeDetails]);

    const saveRollUpData = () => {
        let reqData: any = { created_by: "", data: [] };

        reqData.name = projectDetails?.name;
        reqData.project_id = projectDetails?.id;

        reqData.created_by = FETCH_USER_DETAILS()?.id || "user";
        let reqPayload = rollUpItems.filter(
            (item: any) =>
                item.scopeRollUps?.some((it: any) => it.isSelected) ||
                item.labourRollUps?.some((it: any) => it.isSelected),
        );

        let reformattedData = reqPayload.map((itemNew: any) => {
            let newItem: any = {};
            newItem.category_name = itemNew.name;
            newItem.scopeRollUps = itemNew.scopeRollUps
                .filter((i: any) => i.isSelected)
                .map((ii: any) => ii.name);
            newItem.labourRollUps = itemNew.labourRollUps
                .filter((i: any) => i.isSelected)
                .map((ii: any) => ii.name);
            newItem.rollUpTypesSelected = [];
            if (newItem.scopeRollUps?.length > 0) {
                newItem.rollUpTypesSelected.push("scope_merge");
            }
            if (newItem.labourRollUps?.length > 0) {
                newItem.rollUpTypesSelected.push("labour_merge");
            }
            return newItem;
        });

        let formattedData: { category_name: any; scope_name: any; merge_type: any }[] = [];
        reformattedData.map((reformattedDataItem: any) => {
            reformattedDataItem.rollUpTypesSelected.map((rollUpTypeInfo: any) => {
                formattedData.push({
                    category_name: reformattedDataItem.category_name,
                    scope_name:
                        rollUpTypeInfo == "scope_merge"
                            ? reformattedDataItem["scopeRollUps"].join(" & ")
                            : reformattedDataItem["labourRollUps"].join(" & "),
                    merge_type: rollUpTypeInfo?.replace("_", " "),
                });
            });
        });
        reqData.data = formattedData;
        dispatch(actions.scopes.upsertProjectMergeRenoItemStart(reqData));
    };

    const saveDefinitionDetails = () => {
        // as per the requiredment/Issue raised whenever any change happened on merge config
        //and on save updating the scope changes if any and making closing the modal window
        // if (isRollUp) {
        saveRollUpData();
        // } else {
        const data = getSelections(scopeDetailsCopy, scopeDetails.data, "create");
        dispatch(
            actions.budgeting.defineInventoryStart({
                categories: scopeDetailsCopy,
                inventoryId: selectedInventory?.id,
                projectId: params.projectId,
                basePackageId: basePackageId ?? "",
                baseScopeId: selectedScope?.id,
                data,
                createdBy: FETCH_USER_DETAILS().id || "user",
                summary: selectedScope.description,
            }),
        );
        setOpen(false);
        // }
    };
    const updateDefinitionDetails = async () => {
        // as per the requiredment/Issue raised whenever any change happened on merge config
        // and on save updating the scope changes if any and making closing the modal window
        // if (isRollUp) {
        saveRollUpData();
        // } else {
        const data = getSelections(scopeDetailsCopy, scopeDetails.data, "update");
        dispatch(
            actions.budgeting.updateInventoryStart({
                inventoryId: selectedInventory?.id,
                basePackageId: basePackageId ?? "",
                summary: selectedScope.description,
                data,
                updatedBy: FETCH_USER_DETAILS().id || "user",
                projectId: params.projectId,
            }),
        );

        const promises = createNewItemScopesReqData?.map((reqObj: any) => {
            return graphQLClient.mutate("", UPDATE_SCOPE_OF_EXISTING_ITEM, {
                input: reqObj,
            });
        }) as Array<Promise<any>>;
        const response = await Promise.allSettled(promises);
        if (response) {
            dispatch(actions.scopes.clearNewItemScopesReqDetails({}));
        }

        setOpen(false);
        setIsEdit(false);
        // }
    };

    const Header = () => {
        const closeModal = () => {
            setOpen(!open);
        };
        return (
            <Box component="div" style={{ display: "flex", alignItems: "space-between" }}>
                <Typography variant="heading">
                    {isEdit ? "Update" : "Define"} Inventory: {selectedInventory.name}
                </Typography>
                <BaseIconButton icon={CloseIcon} onClick={closeModal} sx={{ marginLeft: "auto" }} />
            </Box>
        );
    };

    const Actions = () => (
        <BaseButton
            label={isEdit ? "Update" : "Save"}
            classes="Base-scope-create-button active"
            onClick={isEdit ? updateDefinitionDetails : saveDefinitionDetails}
            sx={{ marginLeft: "1rem" }}
            disabled={catLoading}
        />
    );

    const cleanScope = () => {
        setConfirmationOpen(false);
        setSelectedScope(defaultScope);
        dispatch(
            actions.budgeting.deleteInventoryStart({
                id: selectedInventory?.id,
                projectId: params.projectId,
            }),
        );
    };

    const updateInventoryDefinition = () => {
        setIsEdit(true);
        dispatch(
            actions.budgeting.fetchInventoryDetailsStart({
                inventoryDetailsId: selectedInventory?.id,
            }),
        );
        fetchMergeInfo();
        setOpen(true);
    };

    const getScopeDefinitionComponent = () => {
        return Number(selectedScope.containerVersion) >= 2 ? (
            <ScopeDefinitionV2
                scopeItems={
                    selectedScope?.id !== undefined &&
                    selectedScope.id !== null &&
                    selectedScope.id != ""
                        ? scopeDetailsCopy
                        : []
                }
                setScopeItems={setScopeDetailsCopy}
                scopeLabel={"base-scope"}
                selectedScope={selectedScope}
                setIsRollUp={setIsRollUp}
                setRollUpItems={setRollUpItems}
            />
        ) : (
            <ScopeDefinition
                scopeItems={
                    selectedScope?.id !== undefined &&
                    selectedScope.id !== null &&
                    selectedScope.id != ""
                        ? scopeDetailsCopy
                        : []
                }
                setScopeItems={setScopeDetailsCopy}
                scopeLabel={"base-scope"}
            />
        );
    };
    const ConfirmationDialog = () => {
        return (
            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle
                    sx={{
                        padding: "1rem",
                        paddingBottom: "0",
                        marginLeft: "2.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    <Typography variant="dialogHeader">
                        Delete Inventory: {selectedInventory?.name}
                    </Typography>
                </DialogTitle>
                <Grid container sx={{ padding: "1.5rem", paddingTop: "0" }}>
                    <Grid item md={12} sx={{ marginBottom: "2rem", marginLeft: "2rem" }}>
                        <Typography variant="dialogContent">
                            Are you sure you want to delete this inventory?
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Grid item md={6}>
                            <BaseButton
                                label="Cancel"
                                type="active"
                                onClick={() => setConfirmationOpen(false)}
                                sx={{ marginLeft: "2rem" }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <BaseButton
                                label="Delete"
                                type="danger"
                                onClick={cleanScope}
                                sx={{ marginLeft: "12rem" }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        );
    };

    return (
        <Grid container className="Base-scope-container">
            <Grid item md={12} sm={12} lg={12} xl={12} xs={12} marginTop={0} className="">
                <BaseSelectionCard
                    label={"Inventories"}
                    content={
                        <Grid container>
                            <BaseScopeContent
                                selectedScope={selectedScope}
                                setSelectedScope={setSelectedScope}
                                disableScopeSelection={
                                    selectedInventory?.baseScopeId !== undefined &&
                                    selectedInventory?.baseScopeId !== null &&
                                    selectedInventory?.baseScopeId != ""
                                }
                            />
                            {scopeDetails.data?.length ? (
                                catLoading ? (
                                    <Grid
                                        item
                                        md={12}
                                        marginTop={4}
                                        sx={{ "text-align": "center" }}
                                    >
                                        <Loader />
                                    </Grid>
                                ) : (
                                    selectedScope?.id !== undefined &&
                                    selectedScope.id !== null &&
                                    selectedScope.id != "" &&
                                    getScopeDefinitionComponent()
                                )
                            ) : null}
                        </Grid>
                    }
                    header={<Header />}
                    actions={<Actions />}
                    open={open}
                    setOpen={setOpen}
                    selections={inventoriesCopy}
                    parentClassName={"Base-scope"}
                    selectedItem={selectedInventory}
                    setSelectedScopeInventory={setSelectedInventory}
                    icon={{ show: false, menuIcon: EllipseIcon }}
                    menuActions={{
                        defined: {
                            Edit: { action: () => updateInventoryDefinition() },
                            Remove: {
                                action: () => setConfirmationOpen(true),
                            },
                        },
                        toDefine: {
                            Define: {
                                action: (id: any) => {
                                    setSelectedInventory(
                                        inventories.data.find((inventory) => inventory.id === id),
                                    );
                                    setOpen(true);
                                },
                            },
                        },
                    }}
                    isLoading={false}
                    dialogSx={{
                        "& > .MuiDialog-container > .MuiPaper-root": { width: "60rem" },
                    }}
                    showWavg={true}
                    overallWAVG={overallWavg}
                />
            </Grid>
            <Grid
                item
                md={12}
                sm={12}
                lg={12}
                xl={12}
                xs={12}
                marginTop={6}
                className="Inventory-container"
            >
                <ScopeTable
                    showScopeTable={isDefined}
                    setShowScopeTable={setIsDefined}
                    selectedInventory={selectedInventory}
                    scopeType={"baseScope"}
                    isFlooringScopeDefined={isFlooringScopeDefined}
                />
            </Grid>
            <ConfirmationDialog />
        </Grid>
    );
};

export default React.memo(BaseScope);
