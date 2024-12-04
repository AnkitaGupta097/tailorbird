/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Typography } from "@mui/material";
import ScopeEditorHeader from "./scopes-editor-header";
import React, { useEffect, useState } from "react";
import ScopeEditorContent from "./scopes-editor-content";
import { getFormattedScopeContainerTree, getRollupDetailsTree } from "../scopes-editor/service";
import ConfigurationRollUp from "./configuration-roll-up";
import ContentPlaceholder from "components/content-placeholder";
import RollupConfigContent from "./roll-up-config-content";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { FETCH_USER_DETAILS } from "modules/projects/constant";
import BaseButton from "components/base-button";
import { useNavigate } from "react-router-dom";

import { getContainerIds, getNewlyAddedContainerIds } from "../scopes-editor/service";
import BaseLoader from "components/base-loading";
import { cloneDeep } from "lodash";
interface IScopeEditorContainer2Version {
    scopeData: {
        id?: any;
        type: string;
        ownership: string;
        name: string;
        description: string;
        scopeList: any;
        isEdit?: boolean;
        ownershipGroupId: any;
        containerVersion: string;
        scopeType?: any;
        projectType?: any;
    };
    setScopeData: any;
    isFromInventory?: any;
    scopeItems?: any;
    setScopeItems?: any;
    searchTextFromInv?: any;
    setSearchTextFromInv?: any;
    setIsRollUp?: any;
    setRollUpInfo?: any;
}

// eslint-disable-next-line
const ScopeEditorContainer2Version = ({
    scopeData,
    setScopeData,
    isFromInventory,
    scopeItems,
    setScopeItems,
    searchTextFromInv,
    setSearchTextFromInv,
    setIsRollUp,
    setRollUpInfo,
}: IScopeEditorContainer2Version) => {
    const {
        scopeContainerTree,
        scopeMerge,
        projectMerge,
        projectDetails,
        loadingRollup,
        dependantScopeItems,
        newlyAddedScopesContIds,
        loadingScopeData,
    } = useAppSelector((state) => ({
        scopeContainerTree:
            scopeData?.isEdit || isFromInventory
                ? state.scopes.scopeContainerTree
                : state.scopes.containerTree,
        scopeMerge: state.scopes.scopeMerge?.data,
        projectMerge: state.scopes.projectMerge?.data,
        projectDetails: state.projectDetails?.data,
        loadingRollup: state.scopes.loadingRollup,
        dependantScopeItems: state.scopes.dependantScopeItems,
        newlyAddedScopesContIds: state.scopes.newlyAddedScopesContIds,
        loadingScopeData: state.scopes.loading,
    }));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [scopeList, setScopeList] = useState<any>();
    const [isReset, setIsReset] = useState(false);
    const [scopeOptions, setScopeOptions] = useState([
        { name: "Demo Existing", id: 0, isSelected: false },
        { name: "Install New", id: 1, isSelected: false },
        { name: "Remove and Store", id: 2, isSelected: false },
        { name: "Reinstall Existing", id: 3, isSelected: false },
        { name: "Repair Existing", id: 4, isSelected: false },
        { name: "Refinish Existing", id: 5, isSelected: false },
        { name: "Add New", id: 6, isSelected: false },
    ]);

    const scopeRollUps = [
        {
            name: "Demo Existing & Install New",
            id: 0,
        },
        {
            name: "Remove and Store & Reinstall Existing",
            id: 1,
        },
    ];
    const [searchText, setSearchText] = useState<any>();
    const [value, setValue] = React.useState("1");
    const [rollUpDefined, setRollUpDefined] = useState(false);
    const [openRollUpConfig, setOpenRollUpConfig] = useState(false);
    const [rollupConfigDetails, setRollupConfigDetails] = useState<any>({});
    const [rollUpItems, setRollUpItems] = useState<any>();

    const [newlyAddedScopeItemsData, setNewlyAddedScopeItemsData] = useState([]);

    let isEditMode = scopeData?.isEdit || rollUpDefined;
    useEffect(() => {
        if (isFromInventory) {
            setRollUpDefined(!!projectMerge?.length);
        } else {
            setRollUpDefined(!!scopeMerge?.length);
        }
    }, [scopeMerge, projectMerge]);

    useEffect(() => {
        return () => {
            dispatch(actions.scopes.clearNewlyAddedScopeIds({}));
            setScopeData({
                id: "",
                type: "",
                ownership: "",
                name: "",
                description: "",
                scopeList: [],
                isEdit: false,
                ownershipGroupId: "",
                projectType: "",
                containerVersion: "2.0",
                scopeType: "",
            });
        };
    }, []);

    useEffect(() => {
        const scopeListFormatted = getFormattedScopeContainerTree(scopeContainerTree);
        const rollUpItemsFormatted = getRollupDetailsTree(
            scopeContainerTree,
            isEditMode,
            scopeOptions,
            scopeRollUps,
            scopeMerge,
            projectMerge,
            isFromInventory,
        );
        setRollUpItems(rollUpItemsFormatted);
        setScopeList(scopeListFormatted);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scopeContainerTree, rollUpDefined]);

    useEffect(() => {
        if (isFromInventory) {
            setRollUpInfo(rollUpItems);
        }
    }, [rollUpItems]);

    const handleAddScopeItem = (
        optionName: any,
        index: any,
        scopeItemIndex: any,
        isSelected: any,
    ) => {
        let scopeItemsData = isFromInventory ? scopeItems : scopeList;
        let scopeCategory = scopeItemsData[index];
        if (!isSelected) {
            setNewlyAddedScopeItemsData((prevCheckedData: any) =>
                prevCheckedData.filter((c: any) => c.category !== scopeCategory.name),
            );
        } else {
            const newObj = {
                category: scopeCategory.name,
                subCategory: scopeCategory.items[scopeItemIndex].name,
                scopeAdded: optionName,
            };
            setNewlyAddedScopeItemsData((state: any) => {
                state.push(newObj);
                return state;
            });
        }
    };
    useEffect(() => {
        if (value == "1") {
            if (searchText != undefined && searchText != "") {
                setScopeList((state: any) => {
                    let stateCopy = [...state];
                    stateCopy?.map((category) => {
                        let categoryMatch = category.name?.toLowerCase()?.includes(searchText);
                        let subCategoryMatch = category.items.some((subCategory: any) =>
                            subCategory.name?.toLowerCase()?.includes(searchText),
                        );
                        category?.items?.map((subCategory: any) => {
                            let scopeItemMatch = subCategory?.scopes?.some((scopeData: any) =>
                                scopeData.name?.toLowerCase()?.includes(searchText),
                            );
                            category.isSelected =
                                categoryMatch || subCategoryMatch || scopeItemMatch;
                        });
                    });
                    return stateCopy;
                });
            }
            if (searchText == "") {
                const containerVersion = scopeData.containerVersion || "1.0";
                const scopeListFormatted = getFormattedScopeContainerTree(scopeList);

                setScopeList(scopeListFormatted);
            }
        } else {
            if (searchText != undefined && searchText != "") {
                setRollUpItems((state: any) => {
                    let stateCopy = [...state];
                    stateCopy?.map((category) => {
                        let categoryMatch = category.name?.toLowerCase()?.includes(searchText);

                        category.isSelected = categoryMatch;
                    });

                    return stateCopy;
                });
            }
            if (searchText == "") {
                const rollUpItemsFormatted = getRollupDetailsTree(
                    scopeContainerTree,
                    isEditMode,
                    scopeOptions,
                    scopeRollUps,
                    scopeMerge,
                    projectMerge,
                    isFromInventory,
                );
                setRollUpItems(rollUpItemsFormatted);
            }
        }

        //search functionality
    }, [searchText]);

    useEffect(() => {
        if (isReset) {
            setSearchText("");
            setIsReset(false);
            const scopeTreeCopy = JSON.parse(JSON.stringify(scopeContainerTree));
            const scopeList = scopeTreeCopy.map((category: any) => {
                let categoryCopy = {
                    ...category,
                    items: category.items.map((item: any) => {
                        let itemCopy = {
                            ...item,
                            scopes: item.scopes.map((scope: any) => {
                                const scopeCopy = {
                                    ...scope,
                                    isSelected: scopeData?.isEdit ? scope.isSelected : false,
                                };
                                return scopeCopy;
                            }),
                            isSelected: item.scopes.some((scope: any) => scope.isSelected),
                        };
                        return itemCopy;
                    }),
                };
                const isCategorySelected = categoryCopy.items.some((item: any) => item.isSelected);
                categoryCopy.isSelected = isCategorySelected;
                return categoryCopy;
            });

            setScopeList(scopeList);
        }
        // eslint-disable-next-line
    }, [isReset]);

    useEffect(() => {
        setScopeData({ ...scopeData, scopeList });
        // eslint-disable-next-line
    }, [scopeList]);

    /// selecting Profit & Overhead and General Conditions categogories by default in new scope creation
    useEffect(() => {
        if (scopeData?.isEdit == undefined || scopeData?.isEdit == false) {
            setScopeList((state: any) => {
                const stateCopy = cloneDeep(state);
                return stateCopy?.map((item: any) => {
                    if (item.name == "Profit & Overhead" || item.name == "General Conditions") {
                        item.isSelected = true;
                        item.items.forEach((element: any) => {
                            element.isSelected = true;
                            element.scopes?.map((scItem: any, index: any) => {
                                scItem.isSelected = true;
                                return { ...item };
                            });
                        });
                        return item;
                    }
                    return item;
                });
            });
        }
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue == "2") {
            setIsRollUp && setIsRollUp(true);
        } else {
            setIsRollUp && setIsRollUp(false);
        }
        setValue(newValue);
    };

    const saveRollUpConfig = () => {
        let reqData: any = { created_by: "", data: [] };
        if (isFromInventory) {
            reqData.name = projectDetails?.name;
            reqData.project_id = projectDetails?.id;
        } else {
            reqData.name = scopeData?.ownership;
            reqData.organization_id = scopeData?.ownershipGroupId;
        }
        reqData.created_by = FETCH_USER_DETAILS()?.id || "user";
        let formattedData: { category_name: any; scope_name: any; merge_type: any }[] = [];
        rollupConfigDetails.rollUpTypesSelected.map((rollupType: any) => {
            rollupConfigDetails.category.map((cat: any) => {
                formattedData.push({
                    category_name: cat,
                    scope_name: rollupConfigDetails[rollupType].join(" & "),
                    merge_type: rollupType?.replace("_", " "),
                });
            });
        });
        reqData.data = formattedData;
        if (!isFromInventory) {
            dispatch(actions.scopes.upsertMergeRenoItemStart(reqData));
            setOpenRollUpConfig(false);
        } else {
            dispatch(actions.scopes.upsertProjectMergeRenoItemStart(reqData));
            setOpenRollUpConfig(false);
        }
    };

    const handleSave_FromHeader = () => {
        if (value == "1") {
            const containerIds = getContainerIds(scopeList);
            const newlyAddedContIds = getNewlyAddedContainerIds(newlyAddedScopesContIds);

            dispatch(
                actions.scopes.upsertScopeLibraryStart({
                    ...(scopeData.id && scopeData.id.length && { id: scopeData.id }),
                    name: scopeData.name,
                    description: scopeData.description,
                    type: scopeData.scopeType || scopeData.type.toUpperCase(),
                    ownership: scopeData.ownershipGroupId ?? "",
                    createdBy: FETCH_USER_DETAILS().id || "user",
                    data: [...containerIds, ...newlyAddedContIds],
                    projectType: scopeData.projectType?.toUpperCase(),
                    containerVersion: scopeData.containerVersion,
                }),
            );
            navigate("/scopes", { replace: true });
        } else {
            let reqData: any = { created_by: "", data: [] };
            if (isFromInventory) {
                reqData.name = projectDetails?.name;
                reqData.project_id = projectDetails?.id;
            } else {
                reqData.name = scopeData?.ownership;
                reqData.organization_id = scopeData?.ownershipGroupId;
            }
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
            if (!isFromInventory) {
                dispatch(actions.scopes.upsertMergeRenoItemStart(reqData));
            } else {
                dispatch(actions.scopes.upsertProjectMergeRenoItemStart(reqData));
            }
        }
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            {loadingScopeData && <BaseLoader />}
            <TabContext value={value}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        margin: "10px 25px",
                        alignItems: "center",
                    }}
                    display="grid"
                    alignItems={"center"}
                    justifyContent="space-between"
                    gridAutoFlow={"column"}
                >
                    <TabList
                        onChange={handleChange}
                        aria-label="scope tabs"
                        style={{ color: "#000000 !important" }}
                    >
                        <Tab
                            label={<Typography variant="heading">Spec Options</Typography>}
                            value="1"
                            sx={{ color: "#000" }}
                        />
                        {scopeData.ownershipGroupId && scopeData.containerVersion == "2.0" && (
                            <Tab
                                label={
                                    <Typography variant="heading">Merge Configuration</Typography>
                                }
                                value="2"
                                sx={{ color: "#000" }}
                            />
                        )}
                    </TabList>
                    {!isFromInventory && (
                        <ScopeEditorHeader
                            setIsReset={setIsReset}
                            scopeList={scopeList}
                            scopeData={scopeData}
                            handleSave_FromHeader={handleSave_FromHeader}
                        />
                    )}
                </Box>
                <TabPanel value="1">
                    <ScopeEditorContent
                        scopeItems={isFromInventory ? scopeItems : scopeList}
                        setScopeItems={isFromInventory ? setScopeItems : setScopeList}
                        isEditFlow={isFromInventory ? true : scopeData?.isEdit}
                        scopeOptions={scopeOptions}
                        searchText={isFromInventory ? searchTextFromInv : searchText}
                        setSearchText={isFromInventory ? setSearchTextFromInv : setSearchText}
                        hideMargins={isFromInventory}
                        showAddScope={!isFromInventory}
                        showRollupConfig={!isFromInventory}
                        dependantScopeItems={dependantScopeItems}
                        handleAddScopeItem={handleAddScopeItem}
                        scopeData={scopeData}
                        isFromInventory={isFromInventory}
                    />
                </TabPanel>
                <TabPanel value="2">
                    {!rollUpDefined && (
                        <ContentPlaceholder
                            text={
                                "You haven’t created any merge configuration yet. It will help you to organise your bid book more effectively"
                            }
                            aText={"Create merge"}
                            height={isFromInventory ? "auto" : "60vh"}
                            isLink={false}
                            actionItem={
                                <BaseButton
                                    label={`Create merge`}
                                    onClick={() => setOpenRollUpConfig(true)}
                                    variant="outlined"
                                    sx={{
                                        color: "#410099",
                                        border: "1px solid #410099",
                                        borderRadius: "5px",
                                        padding: "13px 21px",
                                        marginTop: "16px",
                                    }}
                                />
                            }
                        />
                    )}
                    {!rollUpDefined && (
                        <ConfigurationRollUp
                            open={openRollUpConfig}
                            setOpen={setOpenRollUpConfig}
                            categoriesList={
                                (isFromInventory ? scopeItems : scopeList)?.map(
                                    (scItem: any) => scItem?.name,
                                ) || []
                            }
                            labourRollUpOptions={scopeOptions}
                            scopeRollupOptions={scopeRollUps}
                            setRollupConfigDetails={setRollupConfigDetails}
                            rollupConfigDetails={rollupConfigDetails}
                            isFromInventory={isFromInventory}
                            saveRollUpConfig={saveRollUpConfig}
                        />
                    )}
                    {rollUpDefined && (
                        <RollupConfigContent
                            rollUpItems={rollUpItems}
                            setRollUpItems={setRollUpItems}
                            isEditFlow={isFromInventory ? true : scopeData?.isEdit}
                            searchText={isFromInventory ? searchTextFromInv : searchText}
                            setSearchText={isFromInventory ? setSearchTextFromInv : setSearchText}
                            loadingRollup={loadingRollup}
                            hideMargins={isFromInventory}
                        />
                    )}
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default ScopeEditorContainer2Version;
