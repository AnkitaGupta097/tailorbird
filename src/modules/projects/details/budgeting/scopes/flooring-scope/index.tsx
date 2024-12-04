import React, { SyntheticEvent, useEffect, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    Typography,
    Snackbar,
    Alert,
    GridProps,
    styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SvgIcon from "@mui/material/SvgIcon";
import FlooringScopeContent from "./flooring-scope-content";
import "./flooring-scope.css";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { ReactComponent as TakeOffSplitsIcon } from "assets/icons/icon-take-off-splits.svg";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import ScopeTable from "../scope-table";
import actions from "stores/actions";
import { commonActions } from "stores/common";
// import {
//     addItemFailure
// } from "../../../../../../stores/projects/details/budgeting/snack-messages"

import { addItemFailure } from "stores/projects/details/budgeting/snack-messages";

import { useParams } from "react-router-dom";
import { getInventoriesWithRenos, getSelections } from "../base-scope/service";
import BaseSelectionCard from "components/base-selection-card";
import EllipseIcon from "assets/icons/icon-ellipses.svg";
import { isEmpty, cloneDeep } from "lodash";
import BaseIconButton from "components/base-icon-button";
import CloseIcon from "assets/icons/icon-close.svg";
import BaseButton from "components/base-button";
import { FETCH_USER_DETAILS } from "modules/projects/constant";
import ScopeDefinition from "modules/projects/details/budgeting/scopes/scope-definition";
import ScopeDefinitionV2 from "modules/projects/details/budgeting/scopes/scope-definition-2-0";
import BaseScopeContent from "modules/projects/details/budgeting/scopes/base-scope/base-scope-content";
import { ICategory } from "stores/projects/details/budgeting/base-scope/base-scope-models";
import BaseLoader from "components/base-loading";
const defaultScope = {
    description: "",
    id: "",
    name: "",
    ownership: "",
    conatainerVersion: "1.0",
};
const NoItemsGrid = styled(Grid)<GridProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "25rem",
    border: `1px solid ${theme.border.divider}`,
    color: "#410099",
}));
const FlooringScope = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const [expanded, setExpanded] = useState<string[]>([]);
    const [takeOffData, setTakeOffData] = useState([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedScope, setSelectedScope] = useState<any>(defaultScope);
    const {
        renovationItems,
        inventories,
        flooringInfo,
        snackbar,
        subGroups,
        scopeDetails,
        basePackageId,
        scopes,
        isFloorSplit,
        isFlooringScopeDefined,
        isInvDataloading,
        overallWavg,
        currentInv,
        projectDetails,
        floorPlansData,
        isLoadingFlooringTakeOffs,
    } = useAppSelector((state) => ({
        renovationItems: state.budgeting.details.flooringScope.renovations,
        loading: state.budgeting.details.flooringScope?.renovations?.loading,
        inventories: state.budgeting.details.baseScope.inventories,
        flooringInfo: state.budgeting.details.flooringScope.flooringTakeOffs,
        snackbar: state.common.snackbar,
        subGroups: state.budgeting.details.flooringScope.subGroups,
        scopeDetails: state.budgeting.details.flooringScope.categories,
        basePackageId: state.budgeting.details.basePackage.data?.[0]?.id,
        scopes: state.budgeting.commonEntities.scopes,
        isFloorSplit: state.budgeting.commonEntities.budgetMetadata.isFloorSplit,
        isFlooringScopeDefined:
            state.budgeting.commonEntities.budgetMetadata.isFlooringScopeDefined,
        isInvDataloading: state.budgeting.details.baseScope.categories.loading,
        overallWavg: state.budgeting.commonEntities.overallWavg,
        currentInv: state.budgeting.commonEntities.selectedInv,
        projectDetails: state.projectDetails?.data,
        floorPlansData: state.projectFloorplans.floorplans.data,
        isLoadingFlooringTakeOffs: state.budgeting.details.flooringScope.flooringTakeOffs.loading,
    }));

    const [flooringTakeOffs, setFlooringTakeOffs] = useState(flooringInfo);

    useEffect(() => {
        const areasJson = floorPlansData?.map((obj: any) => obj.areas_json);
        const groupedAreas = areasJson?.reduce((acc: any, curr: any) => {
            if (curr && typeof curr === "object") {
                Object.keys(curr).forEach((key) => {
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(curr[key]);
                });
            }
            return acc;
        }, {});

        const result = groupedAreas?.flooring?.reduce((acc: any, obj: any) => {
            if (obj && typeof obj === "object") {
                Object.entries(obj).forEach(([key, value]) => {
                    if (key in acc) {
                        acc[key] += value;
                    } else {
                        acc[key] = value;
                    }
                });
            }
            return acc;
        }, {});
        // const updatedTakeOffArray = flooringTakeOffs?.data?.filter((item: any) => {
        //     return result[item.roomType] && result[item.roomType] > 0;
        // });

        // need this for other way of ux ...will have to look
        const updatedTakeOffArray = flooringInfo.data.map((item: any) => {
            if (result && result[item.roomType] && result[item.roomType] > 0) {
                return {
                    ...item,
                    isDisabled: false,
                };
            } else {
                return {
                    ...item,
                    isDisabled: true,
                };
            }
        });
        setFlooringTakeOffs((state: any) => {
            return { ...state, ...flooringInfo, data: updatedTakeOffArray };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [floorPlansData, flooringInfo, flooringInfo.data]);

    const [showRenoTable, setShowRenoTable] = useState(isFlooringScopeDefined);
    const [inventoriesCopy, setInventoriesCopy] = useState(getInventoriesWithRenos(inventories));
    const [selectedInventory, setSelectedInventory] = useState(
        inventoriesCopy?.find((it: any) => it.id == currentInv) || inventoriesCopy?.[0],
    );
    const [isInventoryDefined, setIsInventoryDefined] = useState<boolean>(false);
    const [scopeDetailsCopy, setScopeDetailsCopy] = useState<ICategory[]>(
        cloneDeep(scopeDetails.data || []),
    );
    const [isRollUp, setIsRollUp] = useState(false);
    const [rollUpItems, setRollUpItems] = useState([]);

    useEffect(() => {
        if (!showRenoTable) {
            const panel = "panel-0";
            setExpanded([...expanded, panel]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showRenoTable]);

    useEffect(() => {
        setShowRenoTable(isFlooringScopeDefined);
    }, [isFlooringScopeDefined]);

    useEffect(() => {
        setSelectedInventory(inventoriesCopy?.find((it: any) => it.id == currentInv));
    }, [currentInv, inventoriesCopy]);

    const floorLevelCount = flooringTakeOffs?.data?.[0]?.subGroups?.length || 0;
    const [floorLevels, setFloorLevels] = useState(floorLevelCount);

    useEffect(() => {
        setFloorLevels(floorLevelCount);
    }, [floorLevelCount]);
    useEffect(() => {
        if (selectedScope?.id) {
            dispatch(
                actions.budgeting.fetchBaseScopeDetailsStart({
                    scopeId: selectedScope?.id,
                    projectId: projectId,
                }),
            );
        }
        // eslint-disable-next-line
    }, [selectedScope?.id]);

    useEffect(() => {
        setIsInventoryDefined(selectedInventory?.isDefined);
        const scope = scopes.find((scope: any) => scope.id === selectedInventory?.baseScopeId);
        setSelectedScope({ ...scope });
        selectedInventory &&
            dispatch(
                actions.budgeting.updateCurrentInv({
                    selectedInv: selectedInventory?.id,
                }),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedInventory, scopes]);

    useEffect(() => {
        let invs = getInventoriesWithRenos(inventories);
        let updatedinvDetails = invs.find((inv: any) => inv.id === selectedInventory?.id);
        if (updatedinvDetails) {
            setIsInventoryDefined(updatedinvDetails.isDefined);
            setSelectedInventory({ ...updatedinvDetails });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inventoriesCopy?.data]);

    const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
        event.preventDefault();
        if (newExpanded) {
            setExpanded([...expanded, panel]);
        } else {
            setExpanded([...expanded.filter((e) => e !== panel)]);
        }
    };

    let flooringItems = flooringTakeOffs?.flooringItems?.map((fitem: any) => {
        return fitem.toLowerCase();
    });
    useEffect(() => {
        if (scopeDetails.data?.length) {
            let scopeDetailsDeepClone = cloneDeep(scopeDetails.data);
            let flooringCatDataIndex: any = scopeDetails.data.findIndex(
                (item: any) => item.name.toLocaleLowerCase() == "flooring",
            );
            let flooringCategoryDataCopy = cloneDeep(scopeDetails.data[flooringCatDataIndex]);
            let filteredFlooringItems: any = [];
            flooringCategoryDataCopy.items.forEach((element: any) => {
                let str = element.name.toLowerCase();
                if (flooringItems.some((v) => str.includes(v)) == true) {
                    filteredFlooringItems.push(element);
                }
            });
            flooringCategoryDataCopy.items = filteredFlooringItems;
            scopeDetailsDeepClone.splice(flooringCatDataIndex, 1, flooringCategoryDataCopy);
            setScopeDetailsCopy(cloneDeep(scopeDetailsDeepClone));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scopeDetails]);
    useEffect(() => {
        setInventoriesCopy(getInventoriesWithRenos(inventories));
    }, [inventories, renovationItems]);

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
                newItem.rollUpTypesSelected.push("scope_rollup");
            }
            if (newItem.labourRollUps?.length > 0) {
                newItem.rollUpTypesSelected.push("labour_rollup");
            }
            return newItem;
        });

        let formattedData: { category_name: any; scope_name: any; rollup_type: any }[] = [];
        reformattedData.map((reformattedDataItem: any) => {
            reformattedDataItem.rollUpTypesSelected.map((rollUpTypeInfo: any) => {
                formattedData.push({
                    category_name: reformattedDataItem.category_name,
                    scope_name:
                        rollUpTypeInfo == "scope_rollup"
                            ? reformattedDataItem["scopeRollUps"].join(" & ")
                            : reformattedDataItem["labourRollUps"].join(" & "),
                    rollup_type: rollUpTypeInfo?.replace("_", " "),
                });
            });
        });
        reqData.data = formattedData;

        dispatch(actions.scopes.upsertProjectMergeRenoItemStart(reqData));
    };

    const getPayload = (data: any) => {
        const payload: any = [];
        let roomType: string = "";
        let subGroupItems = [];

        for (let index = 0; index < data.length; index++) {
            const isRowTypeRow = index % floorLevels === 0;

            if (isRowTypeRow) {
                roomType = data[index][0].cellValue;
                const selectedItem = data[index].find((cell: any) => cell.cellValue === "checked");

                if (!selectedItem) continue;
                const subGroupItem = {
                    sub_group_id: isRowTypeRow
                        ? data[index][1].subGroupId
                        : data[index][0].subGroupId,
                    is_default: selectedItem.isCellDefault,
                    selected_item: selectedItem.cellType,
                };
                subGroupItems.push(subGroupItem);
            } else {
                const selectedItem = data[index].find((cell: any) => cell.cellValue === "checked");
                if (!selectedItem) continue;
                const subGroupItem = {
                    sub_group_id: isRowTypeRow
                        ? data[index][1].subGroupId
                        : data[index][0].subGroupId,
                    is_default: selectedItem.isCellDefault,
                    selected_item: selectedItem.cellType,
                };
                subGroupItems.push(subGroupItem);
            }
            const payloadItem = {
                room_type: roomType,
                sub_groups: subGroupItems,
            };
            payload.push(payloadItem);
            subGroupItems = [];
        }
        return payload;
    };
    const saveDefinitionDetails = () => {
        if (isRollUp) {
            saveRollUpData();
        } else {
            const data = getSelections(scopeDetailsCopy, scopeDetails.data, "create");
            // setScopeTableTree(scopeDetailsCopy);
            dispatch(
                actions.budgeting.defineInventoryStart({
                    categories: scopeDetailsCopy,
                    inventoryId: selectedInventory?.id,
                    projectId: projectId,
                    basePackageId: basePackageId ?? "",
                    baseScopeId: selectedScope?.id,
                    data,
                    createdBy: FETCH_USER_DETAILS().id || "user",
                    summary: selectedScope?.description,
                }),
            );
            setOpen(false);
        }
    };

    const updateDefinitionDetails = () => {
        if (isRollUp) {
            saveRollUpData();
        } else {
            const data = getSelections(scopeDetailsCopy, scopeDetails.data, "update");
            // setScopeTableTree(scopeDetailsCopy);
            dispatch(
                actions.budgeting.updateInventoryStart({
                    inventoryId: selectedInventory?.id,
                    basePackageId: basePackageId ?? "",
                    summary: selectedScope.description,
                    data,
                    updatedBy: FETCH_USER_DETAILS().id || "user",
                    projectId: projectId,
                    scopeType: "flooringScope",
                    flooringTakeOffs: {
                        projectId: projectId,
                        data: getPayload(takeOffData),
                        createdBy: FETCH_USER_DETAILS().id || "user",
                    },
                    currentInv: currentInv,
                }),
            );
            setOpen(false);
        }
    };

    const onSaveClicked = (tableData: any) => {
        if (!getPayload(tableData)?.length) {
            dispatch(commonActions.openSnack(addItemFailure("flooring·scope·group")));
        } else {
            dispatch(
                actions.budgeting.upsertGroupStart({
                    projectId: projectId,
                    data: getPayload(tableData),
                    createdBy: FETCH_USER_DETAILS().id || "user",
                }),
            );
            setExpanded([]);
            setShowRenoTable(true);
        }
    };

    const flooringData = (tableData: any) => {
        setTakeOffData(tableData);
    };

    const Header = () => {
        const closeModal = () => {
            setOpen(!open);
        };
        return (
            <Box component="div" style={{ display: "flex", alignItems: "space-between" }}>
                <Typography variant="heading">{`${
                    isInventoryDefined ? "Update" : "Define"
                } Inventory: ${selectedInventory.name}`}</Typography>
                <BaseIconButton icon={CloseIcon} onClick={closeModal} sx={{ marginLeft: "auto" }} />
            </Box>
        );
    };
    const updateInventoryDefinition = () => {
        dispatch(
            actions.budgeting.fetchInventoryDetailsStart({
                inventoryDetailsId: selectedInventory?.id,
            }),
        );
        setOpen(true);
    };

    const Actions = () => (
        <BaseButton
            label={`${isInventoryDefined ? "Update" : "Save"}`}
            classes="Base-scope-create-button active"
            onClick={isInventoryDefined ? updateDefinitionDetails : saveDefinitionDetails}
            sx={{ marginLeft: "1rem" }}
        />
    );

    const IsFloorLevelDataUpdated = () => {
        let upperGroup = subGroups?.data?.filter(
            (item: any) => item?.name?.toLocaleLowerCase() == "upper",
        );
        let upperGroupId = upperGroup[0]?.id || "";
        let itemsUpdated = flooringTakeOffs?.data?.map((item: any) => {
            return item.subGroups.filter(
                (sgitem: any) => sgitem.subGroupId == upperGroupId && sgitem.selectedItem !== null,
            );
        });
        return Array.prototype.concat.apply([], itemsUpdated)?.length > 0 ? false : true;
    };
    const getScopeDefinitionComponent = () => {
        return selectedScope.containerVersion && Number(selectedScope.containerVersion) >= 2 ? (
            <ScopeDefinitionV2
                scopeItems={
                    selectedScope.id !== undefined &&
                    selectedScope.id !== null &&
                    selectedScope.id != ""
                        ? scopeDetailsCopy
                        : []
                }
                setScopeItems={setScopeDetailsCopy}
                scopeLabel={"flooring-scope"}
                selectedScope={selectedScope}
                setIsRollUp={setIsRollUp}
                setRollUpItems={setRollUpItems}
            />
        ) : (
            <ScopeDefinition
                scopeItems={
                    selectedScope.id !== undefined &&
                    selectedScope.id !== null &&
                    selectedScope.id != ""
                        ? scopeDetailsCopy
                        : []
                }
                setScopeItems={setScopeDetailsCopy}
                scopeLabel={"flooring-scope"}
            />
        );
    };

    return !isEmpty(flooringTakeOffs) ? (
        <Grid container>
            {isLoadingFlooringTakeOffs && <BaseLoader />}
            <Snackbar
                open={snackbar.open}
                onClose={() => dispatch(actions.common.closeSnack())}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={3000}
            >
                <Alert
                    onClose={() => dispatch(actions.common.closeSnack())}
                    severity={snackbar.variant}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Grid item md={12} sm={12} lg={12} xl={12} xs={12}>
                <Accordion
                    expanded={expanded.includes("panel-0")}
                    onChange={handleChange("panel-0")}
                    className="Flooring-scope-container"
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        className="Flooring-scope-accordion-summary"
                    >
                        <Box className="Flooring-scope-takeoff-splits-box">
                            <SvgIcon component={TakeOffSplitsIcon} />
                            <Typography variant="tableHeaderText">Take-off Splits</Typography>
                            {IsFloorLevelDataUpdated() && (
                                <SvgIcon>
                                    <InfoIcon fill="white" />
                                </SvgIcon>
                            )}
                        </Box>
                    </AccordionSummary>

                    <AccordionDetails className="Flooring-scope-accordion-details">
                        <FlooringScopeContent
                            flooringTakeOffs={flooringTakeOffs}
                            isFloorSplit={isFloorSplit}
                            onSaveClicked={onSaveClicked}
                            subGroups={subGroups}
                            flooringData={flooringData}
                        />
                    </AccordionDetails>
                </Accordion>
            </Grid>
            <Grid item md={12} sm={12} lg={12} xl={12} xs={12} marginBottom={5}>
                {showRenoTable ? (
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
                        <Card sx={{ background: "#eee" }}>
                            <CardContent>Flooring</CardContent>
                        </Card>

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
                                        isInvDataloading ? (
                                            <Grid
                                                item
                                                md={12}
                                                marginTop={4}
                                                sx={{ "text-align": "center" }}
                                            >
                                                <CircularProgress />
                                            </Grid>
                                        ) : (
                                            selectedScope.id !== undefined &&
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
                            parentClassName={"Flooring-scope"}
                            selectedItem={selectedInventory}
                            setSelectedScopeInventory={setSelectedInventory}
                            icon={{ show: false, menuIcon: EllipseIcon }}
                            menuActions={{
                                defined: {
                                    Edit: { action: () => updateInventoryDefinition() },
                                },
                                toDefine: {
                                    Define: {
                                        action: (id: any) => {
                                            setSelectedInventory(
                                                inventories.data.find(
                                                    (inventory) => inventory.id === id,
                                                ),
                                            );
                                            setOpen(true);
                                        },
                                    },
                                },
                                Edit: { action: () => setOpen(true) },
                            }}
                            isLoading={false}
                            showWavg={false}
                            overallWAVG={overallWavg}
                            dialogSx={{
                                "& > .MuiDialog-container > .MuiPaper-root": { width: "60rem" },
                            }}
                        />
                        <Grid container marginTop={4} md={12} sm={12} lg={12} xl={12} xs={12}>
                            {!flooringTakeOffs?.data?.length ? (
                                <NoItemsGrid container>
                                    <Typography variant="warningText">
                                        Take-offs are not yet updated for Ground and Upper floors
                                    </Typography>
                                </NoItemsGrid>
                            ) : (
                                <ScopeTable
                                    showScopeTable={isInventoryDefined}
                                    setShowScopeTable={setIsInventoryDefined}
                                    selectedInventory={selectedInventory}
                                    scopeType={"flooringScope"}
                                />
                            )}
                        </Grid>
                    </Grid>
                ) : null}
            </Grid>
        </Grid>
    ) : null;
};

export default React.memo(FlooringScope);
