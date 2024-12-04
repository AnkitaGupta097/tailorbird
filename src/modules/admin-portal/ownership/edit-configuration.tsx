import React, { useEffect, useState } from "react";
import {
    cloneDeep,
    compact,
    forEach,
    isEmpty,
    keys,
    map,
    mapValues,
    pickBy,
    pull,
    uniq,
    values,
} from "lodash";
import { useParams } from "react-router-dom";
import { graphQLClient } from "utils/gql-client";
import { CONTAINER_DATA_QUERY } from "components/container-admin-interface/constants";
import { ControlledTreeEnvironment, Tree, TreeItem } from "react-complex-tree";
import { useCallbackPrompt } from "../../rfp-manager/common/use-callback-prompt";
import { useNavigate } from "react-router-dom";
import VectorIcon from "../../../assets/icons/Vector.svg";
import FolderIcon from "@mui/icons-material/Folder";
import { ReactComponent as AddSvg } from "../../../assets/icons/add-icon.svg";
import { ReactComponent as KebabIcon } from "../../../assets/icons/action_menu.svg";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ReorderIcon from "@mui/icons-material/Reorder";
import DialogBox from "modules/package-manager/create-edit-package/warning-dialog";
import { WORK_TYPE_MATERIAL } from "./constants";
import {
    Button,
    Dialog,
    Typography,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText,
    Grid,
    TextField,
    styled,
    MenuItem,
    IconButton,
    Menu,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./configuration.css";
import "react-complex-tree/lib/style-modern.css";
import AddGroupSubGroup from "./add-group-subgroup";
import MergeHotkeys from "./merge-hotkeys";
import { gql, useMutation } from "@apollo/client";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import FilterVector from "../../../assets/icons/filter-vector.svg";
import BaseButton from "components/button";
import CreateItemComponent from "./add-config-item";
import {
    CONTAINER_CONFIGURATION_NAME_PROJECTS_DATA,
    CONTAINER_CONFIGURATION_GROUP_SUBGROUP_DATA,
    // DummyOrgContainerItemResponse,
} from "./constants";
import AddConfigItemModal from "./add-config-item-modal";
import ItemSearchHeader from "./item-search-header";
import { fromResponse, getMergeConfig, toRequest } from "./requestResponseUtil";

const CREATE_ORGANISATION_CONTAINER_ITEMS = gql`
    mutation CreateOrganisationContainerItems($input: CreateOrganisationItemsInput) {
        createOrganisationContainerItems(input: $input) {
            container_item_id
        }
    }
`;

const GET_ORGANISATION_CONTAINER_ITEMS = gql`
    query GetOrganisationContainerItems($organisationContainerId: String) {
        getOrganisationContainerItems(organisation_container_id: $organisationContainerId) {
            tree {
                l1
                cost_code
                items {
                    id
                    item_name
                    cost_code
                    subcategory
                    work_type
                    category
                    scope
                    codex
                    container_item_id
                    item_index
                }
                merged_items {
                    id
                    item_name
                    cost_code
                    subcategory
                    work_type
                    category
                    scope
                    codex
                    container_item_id
                    merge_configuration {
                        labour_merge
                        scope_merge
                    }
                    items {
                        id
                        item_name
                        cost_code
                        subcategory
                        work_type
                        category
                        scope
                        codex
                        container_item_id
                        item_index
                    }
                }
                l2s {
                    l2
                    cost_code
                    items {
                        id
                        item_name
                        cost_code
                        subcategory
                        work_type
                        category
                        scope
                        codex
                        container_item_id
                        item_index
                    }
                    merged_items {
                        id
                        item_name
                        cost_code
                        subcategory
                        work_type
                        category
                        scope
                        codex
                        container_item_id
                        merge_configuration {
                            labour_merge
                            scope_merge
                        }
                        items {
                            id
                            item_name
                            cost_code
                            subcategory
                            work_type
                            category
                            scope
                            codex
                            container_item_id
                            item_index
                        }
                    }
                    l3s {
                        l3
                        cost_code
                        items {
                            id
                            item_name
                            cost_code
                            subcategory
                            work_type
                            category
                            scope
                            codex
                            container_item_id
                            item_index
                        }
                        merged_items {
                            id
                            item_name
                            cost_code
                            subcategory
                            work_type
                            category
                            scope
                            codex
                            container_item_id
                            merge_configuration {
                                labour_merge
                                scope_merge
                            }
                            items {
                                id
                                item_name
                                cost_code
                                subcategory
                                work_type
                                category
                                scope
                                codex
                                container_item_id
                                item_index
                            }
                        }
                    }
                }
            }
            organisation_container_id
            name
            project_ids
            organisation_id
        }
    }
`;

const STextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-root": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        fontSize: 16,
        marginTop: 10,
        height: "45px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
}));

const ConfigurationEdit = () => {
    const { organisationId, organisationContainerId } = useParams();
    const [externalNodes, setExternalNodes] = useState<any>({});
    const [filteredNodes, setFilteredNodes] = useState<any>({});
    const [queryTree1, setQueryTree1] = useState("");
    const [queryTree2, setQueryTree2] = useState("");

    const [isOpenGroupModal, setIsOpenGroupModal] = useState(false);
    const [openMergeHotkeys, setMergeHotkeysModal] = useState(false);
    const navigate = useNavigate();

    const [expandedItems, setExpandedItems] = useState<any>([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [actionType, setActionType] = useState<string>();
    const [organisationContainerDeletedIds, setOrganisationContainerDeletedIds] = React.useState<
        string[]
    >([]);
    const [openDailog, setOpenDailog] = useState(false);
    const [rollupConfigDetails, setRollupConfigDetails] = useState<any>({});
    const [openItemModal, setItemModal] = useState<any>(false);
    const [reorderMode, setReorderMode] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [initialTree, setInitialTree] = useState<any>({});

    const isTreeTouched = () => {
        const newRightTree = toRequest(externalNodes);
        const oldRightTree = toRequest(initialTree);

        return JSON.stringify(newRightTree) !== JSON.stringify(oldRightTree);
    };

    const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(isTreeTouched());

    // const { ownership } = useAppSelector((state) => ({
    //     ownership: state.ims.ims.ownership,
    // }));

    useEffect(() => {
        if (!isOpenGroupModal && selectedItem) {
            setSelectedItem("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpenGroupModal]);

    const handleClose = () => {
        // setActionType("");
        setOpenDailog(false);
    };

    const handleConfirm = () => {
        if (actionType === "delete") deleteGroupSubGroup();
        else if (actionType === "unmerge") unMerge();
        setOpenDailog(false);
        setSelectedItem("");
    };

    const [addOragnisation, { data, loading, error }] = useMutation(
        CREATE_ORGANISATION_CONTAINER_ITEMS,
    );
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (error && !loading) {
            showSnackBar("error", "Failed to save org item");
        } else if (data && !loading) {
            showSnackBar("success", "Configuration Saved Successfully");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, loading, error]);

    const onAddNewItem = (data: any) => {
        if (data && data.length > 0) {
            const newCategory = data[0].category;
            const tempExternalNodes = { ...externalNodes };

            //setting the new category in the tree if it doesn't exist
            if (!tempExternalNodes[newCategory]) {
                tempExternalNodes[newCategory] = {
                    index: newCategory,
                    isFolder: true,
                    canMove: true,
                    tree: "tree-1",
                    data: newCategory,
                    children: [],
                };
            }

            const totalCount = Object.keys(tempExternalNodes).length;

            // setting children node for the category
            data.forEach((container: any, index: number) => {
                const containerIndex = index + totalCount;
                tempExternalNodes[containerIndex] = {
                    index: containerIndex,
                    isFolder: false,
                    canMove: true,
                    category: container.category,
                    tb_category: container.category,
                    subcategory: container.subcategory,
                    tree: "tree-1",
                    item_name: container.item_name,
                    scope: container.scope,
                    work_type: container.work_type,
                    cost_code: container.cost_code,
                    codex: container.codex,
                    container_item_id: container.id,
                    data: `${container.subcategory} ${container.work_type}~${container.cost_code}`,
                    children: [],
                };

                tempExternalNodes[newCategory].children.push(containerIndex);
            });

            setExternalNodes(tempExternalNodes);
        }
    };

    const getContainerData = async () => {
        if (!isEmpty(externalNodes)) {
            return;
        }

        setLoading(true);
        const res = await graphQLClient.query("getContainerData", CONTAINER_DATA_QUERY, {
            allItems: false,
            isActive: true,
        });

        let orgContainerItemsResponse;
        try {
            orgContainerItemsResponse = await graphQLClient.query(
                "getOrganisationContainerItems",
                GET_ORGANISATION_CONTAINER_ITEMS,
                {
                    organisationContainerId: organisationContainerId,
                },
            );
        } catch (error) {
            showSnackBar("error", "Failed to get org items");
            console.log("error while getting org container items", error);
        }

        const orgContainerItems = orgContainerItemsResponse?.getOrganisationContainerItems;

        setConfigurationData({
            name: orgContainerItems?.name ?? "",
            project_ids: orgContainerItems?.project_ids ?? [],
        });

        let { getContainerV2 } = res;
        let getContainerV2Copy = [...getContainerV2];
        getContainerV2Copy.sort((a: any, b: any) => {
            if (a.category === b.category) {
                return a.subcategory > b.subcategory ? 1 : -1;
            }
            return a.category > b.category ? 1 : -1;
        });
        getContainerV2 = getContainerV2Copy;
        let categories: any = new Set();
        getContainerV2.forEach((s: any) => categories.add(s.category));
        const nodes_list: any = {};
        nodes_list["root-1"] = {
            index: "root-1",
            isFolder: true,
            canMove: true,
            data: "root-1",
            children: [],
        };

        categories.forEach((s: any) => {
            nodes_list[s] = {
                index: s,
                isFolder: true,
                canMove: true,
                tree: "tree-1",
                data: s,
                children: [],
            };

            nodes_list["root-1"].children.push(s);
        });

        const rightTree = fromResponse(orgContainerItems?.tree ?? []);
        const containerIds = compact(values(mapValues(rightTree, "container_item_id")));

        getContainerV2.forEach((t: any) => {
            if (!containerIds.includes(t.id)) {
                nodes_list[t.id] = {
                    index: t.id,
                    isFolder: false,
                    canMove: true,
                    category: t.category,
                    tb_category: t.category,
                    subcategory: t.subcategory,
                    tree: "tree-1",
                    item_name: t.item_name,
                    scope: t.scope,
                    work_type: t.work_type,
                    cost_code: t.cost_code,
                    codex: t.codex,
                    container_item_id: t.id,
                    data: `${t.subcategory} ${t.work_type}~${t.cost_code}`,
                    children: [],
                };

                nodes_list[t.category].children.push(t.id);
            }
        });

        setExternalNodes(cloneDeep({ ...nodes_list, ...rightTree }));
        setInitialTree(cloneDeep({ ...nodes_list, ...rightTree }));

        localStorage.setItem("externalNodes", JSON.stringify({ ...nodes_list }));
        setLoading(false);
    };

    useEffect(() => {
        getContainerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    /**
     * Moves a sequence of values within an array to a target value's index, preserving their order.
     *
     * @param {any[]} array - The array to modify.
     * @param {any[]} values - The sequence of values to move.
     * @param {number} targetValue - The value whose index becomes where the values should be moved to.
     * @returns {any[]} A new array with the values moved to the target index.
     */
    const moveValues = (array: any[], values: any[], targetValue: any) => {
        const newArray = [...array];
        const valuesInOrder = [];
        let targetIndex = newArray.indexOf(targetValue);

        // Remove values from original positions
        for (let i = 0; i < array.length; i++) {
            if (values.includes(array[i])) {
                newArray.splice(newArray.indexOf(array[i]), 1);
                valuesInOrder.push(array[i]);
            }
        }

        if (targetIndex > newArray.length - 1) {
            targetIndex = newArray.indexOf(targetValue) + 1;
        }

        // Insert values at the target index
        newArray.splice(targetIndex, 0, ...valuesInOrder);

        return newArray;
    };

    const onDrop = (items: TreeItem[], target: any) => {
        const itemsToMove: any = [];
        let tree: any = cloneDeep(externalNodes);
        const targetTreeId = target.treeId;
        const targetKey = target.targetItem;
        const targetParentKey = target.parentItem;

        if (reorderMode) {
            const srcTreeNames = compact(uniq(map(items, "tree")));
            const srcParentKey = compact(uniq(map(items, "category")));
            const itemsToBeMoved = uniq(map(items, "index"));

            if (
                srcTreeNames.length === 1 &&
                srcTreeNames[0] === "tree-2" &&
                targetTreeId === "tree-2" &&
                srcParentKey.length === 1 &&
                srcParentKey[0] === targetParentKey
            ) {
                const children = tree[targetParentKey]?.children;
                const newChildren = moveValues(children, itemsToBeMoved, targetKey);
                tree[targetParentKey].children = newChildren;
            }
        } else {
            if (tree[targetKey]?.mergedFolder || tree[targetParentKey]?.mergedFolder) {
                showSnackBar("warning", "Cannot drag and drop to and from merged rows root.");
                return;
            }

            items.forEach((srcItem: any) => {
                const srcParentKey = srcItem?.category;

                // Dragging tree-1 folders are not allowed
                if (srcItem.isFolder && srcItem.tree === "tree-1") {
                    return;
                }

                // Dropping on the same folder
                if (tree[targetKey].isFolder && srcParentKey === targetKey) {
                    return;
                }

                if (!tree[targetKey].isFolder && srcParentKey === targetParentKey) {
                    return;
                }

                if (tree[srcParentKey]?.mergedFolder || srcItem?.mergedFolder) {
                    showSnackBar("warning", "Cannot drag and drop to and from merged rows root.");
                    return;
                }

                tree[srcItem.index].tree = targetTreeId;

                itemsToMove.push(srcItem?.index);

                tree[srcParentKey].children = tree[srcParentKey].children.filter(
                    (childKey: string) => srcItem.index !== childKey,
                );

                if (tree[targetKey].isFolder === true) {
                    tree[srcItem.index].category = targetKey;
                } else {
                    tree[srcItem.index].category = targetParentKey;
                }
            });

            if (tree[targetKey]?.isFolder === true) {
                tree[targetKey].children = [...tree[targetKey].children, ...itemsToMove];
            } else {
                tree[targetParentKey].children = [
                    ...tree[targetParentKey].children,
                    ...itemsToMove,
                ];
            }
        }

        setExternalNodes(cloneDeep(tree));
    };

    const openGroupSubGroup = (actionTypeSent: string, itemIndex: string) => {
        if (actionTypeSent === "edit") {
            let node_list = cloneDeep(externalNodes);
            let treeKey: any = itemIndex;
            let splitData = node_list[treeKey].data.split("~");
            let obj = {
                name: splitData[0],
                cost_code: splitData[1],
            };
            setGroupSubgroupData({ ...groupSubgroupData, ...obj });
        }

        setIsOpenGroupModal(true);
    };

    const addGroupSubGroup = (actionTypeSent: string, itemIndex: string) => {
        setActionType(actionTypeSent);
        openGroupSubGroup(actionTypeSent, itemIndex);
    };

    const mergeHotkeys = (actionTypeSent: string, itemIndex: string | number) => {
        setActionType(actionTypeSent);
        const mergeHotKeysSelection = getMergeConfig(itemIndex, externalNodes);
        // show old scope
        if (mergeHotKeysSelection) {
            let obj: any = { rollUpTypesSelected: [] };
            if (
                mergeHotKeysSelection.labour_merge &&
                mergeHotKeysSelection.labour_merge.length > 0
            ) {
                obj.rollUpTypesSelected.push("labour_merge");
                obj["labour_merge"] = cloneDeep(mergeHotKeysSelection.labour_merge);
            }
            if (mergeHotKeysSelection.scope_merge && mergeHotKeysSelection.scope_merge.length > 0) {
                obj.rollUpTypesSelected.push("scope_merge");
                obj["scope_merge"] = cloneDeep(mergeHotKeysSelection.scope_merge);
            }

            setRollupConfigDetails(obj);
        }
        setMergeHotkeysModal(true);
    };

    const unMerge = () => {
        let treeKey: any = selectedItem;

        let node_list = cloneDeep(externalNodes);

        if (node_list[treeKey].mergedFolder) {
            const parentKey = node_list[treeKey].category;
            let parentChildren = [...node_list[parentKey].children];

            node_list[treeKey].children.forEach((key: any) => {
                node_list[key].category = parentKey;
                parentChildren.push(key);
            });
            parentChildren = pull(parentChildren, treeKey);
            node_list[parentKey].children = parentChildren;
        } else {
            node_list[treeKey].children.forEach((elm: any) => {
                if (node_list[elm].isFolder && node_list[elm].mergedFolder) {
                    node_list[elm].children.forEach((child: any) => {
                        node_list[child].category = node_list[elm].category;
                    });

                    node_list[treeKey].children = [
                        ...node_list[treeKey].children,
                        ...node_list[elm].children,
                    ];

                    node_list[treeKey].children = node_list[treeKey].children.filter(
                        (child: any) => child !== elm,
                    );

                    delete node_list[elm];
                }
            });
        }

        setExternalNodes(node_list);

        setIsOpenGroupModal(false);
        setSelectedItem("");
    };

    const deleteGroupSubGroup = () => {
        const tree: any = cloneDeep(externalNodes);
        const selectedNode = { ...tree[selectedItem] };

        const destroyFoldersAndMoveItems = (nodeKey: any) => {
            const node = tree[nodeKey];

            if (node?.children?.length > 0 && node.tree === "tree-2") {
                node?.children.forEach((childKey: string) => {
                    destroyFoldersAndMoveItems(childKey);
                    delete tree[nodeKey];
                });
            } else {
                const tb_category = node?.tb_category;
                node.tree = "tree-1";
                node.category = tb_category;
                tree[tb_category]?.children?.push(nodeKey);
            }
        };

        destroyFoldersAndMoveItems(selectedItem);

        const parentNodeKey = selectedNode.category;
        const parentNode = tree[parentNodeKey];
        pull(parentNode.children, selectedItem);

        setExternalNodes(tree);
        setIsOpenGroupModal(false);
    };

    const [configurationData, setConfigurationData] = useState<any>(
        CONTAINER_CONFIGURATION_NAME_PROJECTS_DATA,
    );

    const [groupSubgroupData, setGroupSubgroupData] = useState(
        CONTAINER_CONFIGURATION_GROUP_SUBGROUP_DATA,
    );

    const updateConfigurationData = (key: string, data: any) => {
        let val = data;
        let obj = {};

        if (key === "name") {
            setValidation({ ...validateField, name_exists: false, name: false });
        }
        if (key === "project_ids") {
            setValidation({ ...validateField, project_ids: false });
        }

        setConfigurationData({ ...configurationData, [key]: val, ...obj });
    };

    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryTree1, queryTree2, externalNodes]);

    const onSearch = () => {
        const existingNodes = cloneDeep(externalNodes);
        const updatedTree1 = reStructureTree(existingNodes, "root-1", queryTree1);
        const finalTree = reStructureTree(updatedTree1, "root-2", queryTree2);

        setFilteredNodes(finalTree);
    };

    const reStructureTree = (tree: any, rootKey: string, searchText: string) => {
        const filterNodes = (nodeKey: string) => {
            const node = tree[nodeKey];

            if (!node) {
                return null;
            }

            if (node.children && node.children.length > 0) {
                const filteredChildren = node.children
                    .map((childKey: string) => filterNodes(childKey))
                    .filter((child: any) => child != null);

                if (filteredChildren.length > 0) {
                    forEach(node.children, (key: string) => {
                        if (!filteredChildren.includes(key)) {
                            delete tree[key];
                        }
                    });
                    node.children = filteredChildren;
                    return nodeKey;
                } else {
                    delete tree[nodeKey];
                    return null;
                }
            } else if (node.data.toLowerCase().includes(searchText.toLowerCase())) {
                return searchText && node.isFolder ? null : nodeKey;
            }

            return null;
        };

        filterNodes(rootKey);
        return tree;
    };

    const onExpandAllClick = (treeName: string) => {
        const treeFolders = pickBy(
            externalNodes,
            (node) => node.isFolder && node.tree === treeName,
        );
        setExpandedItems([...expandedItems, ...keys(treeFolders)]);
    };

    const onCollapseAllClick = (treeName: string) => {
        const treeFolders = pickBy(
            externalNodes,
            (node) => node.isFolder && node.tree === treeName,
        );
        const treeFolderKeys = keys(treeFolders);
        const newExpandedItems: string[] = expandedItems.filter(
            (item: string) => !treeFolderKeys.includes(item),
        );
        setExpandedItems(newExpandedItems);
    };

    const RenderItemTitle = (item: any) => {
        const [isHovered, setIsHovered] = useState(false);
        const [anchorEl, setAnchorEl] = useState<any>(null);

        const renderName = () => {
            const data = item?.data ?? "";

            if (item.isFolder) {
                // eslint-disable-next-line no-unused-vars
                const [name, costCode] = data.split("~");
                return name;
            } else {
                // eslint-disable-next-line no-unused-vars
                const [name, costCode] = data.split("~");
                const splitWorkType = name.split(" ");
                splitWorkType.pop();
                return splitWorkType.join(" ");
            }
        };

        const renderCostCodeWorkType = () => {
            const data = item?.data ?? "";
            if (item.isFolder && item.tree === "tree-1") {
                return "";
            } else if (item.isFolder && item.tree === "tree-2") {
                // eslint-disable-next-line no-unused-vars
                const [name, costCode] = data.split("~");
                return `Cost Code: ${costCode}`;
            } else {
                // eslint-disable-next-line no-unused-vars
                const [name, costCode] = data.split("~");
                // eslint-disable-next-line no-unused-vars
                const splitWorkType = name.split(" ");
                return splitWorkType[splitWorkType.length - 1];
            }
        };

        const getClass = () => {
            if (item.isFolder && item.tree === "tree-2") {
                return "typography-folder-cost-code";
            }
        };

        return (
            <Grid
                container
                sx={{
                    height: "100%",
                    width: "100%",
                    background:
                        item.work_type && item.work_type.toLowerCase() === WORK_TYPE_MATERIAL
                            ? "#DAF3FF"
                            : undefined,
                    paddingRight: "10px",
                    paddingLeft: "30px",
                }}
                alignItems="center"
                justifyContent="space-between"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setAnchorEl(null);
                }}
            >
                <Grid item xs>
                    <Grid container alignItems="center">
                        {item.isFolder && (
                            <>
                                <Grid item>
                                    <img src={VectorIcon} height="10" width="10" alt="arrow-icon" />
                                </Grid>
                                <Grid item sx={{ marginTop: "5px" }}>
                                    {item.mergedFolder ? (
                                        <FolderZipIcon
                                            sx={{ color: "#6A6464", margin: "0 16px" }}
                                        />
                                    ) : (
                                        <FolderIcon sx={{ color: "#6A6464", margin: "0 16px" }} />
                                    )}
                                </Grid>
                            </>
                        )}
                        <Grid item>
                            <Typography
                                style={{ wordWrap: "break-word" }}
                                variant="text_12_regular"
                            >
                                {renderName()}
                            </Typography>
                            <br />
                            <Typography
                                style={{ wordWrap: "break-word" }}
                                variant="text_12_regular"
                                className={getClass()}
                            >
                                {renderCostCodeWorkType()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {reorderMode && item.tree === "tree-2" && (
                    <Grid item>
                        <ReorderIcon sx={{ color: "#6A6464", margin: "0 16px" }} />
                    </Grid>
                )}
                {item.tree === "tree-2" && item.isFolder && isHovered && !reorderMode && (
                    <Grid item>
                        {!item.mergedFolder && (
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedItem(item.index);
                                    addGroupSubGroup("add", item.index);
                                }}
                            >
                                <AddSvg />
                            </IconButton>
                        )}
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                setAnchorEl(event.currentTarget);
                            }}
                        >
                            <KebabIcon />
                        </IconButton>
                        <Menu
                            id="action-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={(event: any) => {
                                event.stopPropagation();
                                setAnchorEl(null);
                                setIsHovered(false);
                            }}
                        >
                            {!item.mergedFolder && (
                                <>
                                    <MenuItem
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedItem(item.index);
                                            mergeHotkeys("merge_hotkeys", item.index);
                                        }}
                                    >
                                        Merge
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedItem(item.index);
                                            addGroupSubGroup("edit", item.index);
                                        }}
                                    >
                                        Edit
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedItem(item.index);
                                            setActionType("delete");
                                            setOpenDailog(true);
                                        }}
                                    >
                                        Delete
                                    </MenuItem>
                                </>
                            )}

                            <MenuItem
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setSelectedItem(item.index);
                                    setActionType("unmerge");
                                    setOpenDailog(true);
                                }}
                            >
                                Unmerge
                            </MenuItem>
                        </Menu>
                    </Grid>
                )}
            </Grid>
        );
    };

    const [validateField, setValidation] = useState({
        name: false,
        project_ids: false,
        name_exists: false,
    });

    const saveContainerConfiguration = () => {
        setInitialTree(externalNodes);
        addOragnisation({
            variables: {
                input: {
                    organisation_id: organisationId,
                    organisation_container_id: organisationContainerId,
                    ...configurationData,
                    tree: toRequest(externalNodes),
                },
            },
        });
    };

    return (
        <>
            <DialogBox
                // @ts-ignore
                showDialog={showPrompt}
                confirmNavigation={confirmNavigation}
                cancelNavigation={cancelNavigation}
            />
            {isLoading ? (
                <div
                    style={{
                        height: "80vh",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <Grid container style={{ padding: "25px" }}>
                        <Grid container style={{ marginTop: "20px" }}>
                            <Grid item md={6} pr={4}>
                                <Typography variant="text_14_regular">
                                    Configuration Name
                                </Typography>
                                <STextField
                                    fullWidth
                                    error={validateField.name}
                                    id="filled-error-helper-text"
                                    helperText="Project name required*"
                                    value={configurationData.name}
                                    onChange={(e) =>
                                        updateConfigurationData("name", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid container>
                                <Grid item md={4} style={{ paddingTop: "30px" }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ height: "40px" }}
                                        onClick={() => {
                                            navigate(-1);
                                            // navigate(`/admin/ownerships/${ownership.id}`);
                                        }}
                                    >
                                        <Typography variant="text_16_semibold"> Cancel</Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={saveContainerConfiguration}
                                        style={{ marginLeft: "10px", height: "40px" }}
                                    >
                                        <Typography variant="text_16_semibold"> Save</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <ControlledTreeEnvironment
                        items={filteredNodes}
                        getItemTitle={(item) => item.data}
                        canSearchByStartingTyping={false}
                        canSearch
                        // eslint-disable-next-line no-unused-vars
                        renderItemArrow={(props: any) => {
                            return null;
                        }}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={false}
                        renderItemTitle={(props: any) => RenderItemTitle(props.item)}
                        viewState={{
                            ["tree-1"]: {
                                expandedItems,
                                selectedItems,
                            },
                            ["tree-2"]: {
                                expandedItems,
                                selectedItems,
                            },
                        }}
                        onSelectItems={(items: any) => {
                            setSelectedItems(items);
                        }}
                        onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
                        onCollapseItem={(item) =>
                            setExpandedItems(
                                expandedItems.filter(
                                    (expandedItemIndex: any) => expandedItemIndex !== item.index,
                                ),
                            )
                        }
                        //eslint-disable-next-line
                        // canDropAt={(arg1, arg2) => {
                        //             return true;
                        //         }}
                        onDrop={onDrop}
                        canDragAndDrop={true}
                        canDropOnNonFolder={true}
                        canDropOnFolder={true}
                        canReorderItems={false}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                margin: "25px",
                            }}
                        >
                            <div
                                className="parent-div"
                                style={{
                                    width: "29%",
                                    backgroundColor: "white",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "IBM Plex Sans",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        lineHeight: "18px",
                                        letterSpacing: "0px",
                                        textAlign: "left",
                                        height: "48px",
                                        borderRadius: "4px 4px 0px 0px",
                                        background: "#EEEEEE",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ paddingLeft: "10px" }}>TB Configuration</div>

                                    <div style={{ paddingRight: "10px" }}>
                                        <img alt="filter-vector" src={FilterVector} />
                                        <Button
                                            sx={{ marginLeft: "30px" }}
                                            color="primary"
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => setItemModal(true)}
                                        >
                                            <Typography variant="text_16_medium">
                                                New Item
                                            </Typography>
                                        </Button>
                                    </div>
                                </div>

                                <ItemSearchHeader
                                    onSearchChange={setQueryTree1}
                                    onClickExpand={() => onExpandAllClick("tree-1")}
                                    onClickCollapse={() => onCollapseAllClick("tree-1")}
                                />

                                <div style={{ height: "600px", overflowY: "scroll" }}>
                                    <Tree treeId="tree-1" rootItem="root-1" treeLabel="Tree 1" />
                                </div>
                            </div>
                            <div
                                className="parent-div"
                                style={{
                                    width: "70%",
                                    backgroundColor: "white",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "IBM Plex Sans",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        lineHeight: "18px",
                                        letterSpacing: "0px",
                                        textAlign: "left",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        height: "48px",
                                        borderRadius: "4px 4px 0px 0px",
                                        background: "#EEEEEE",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{ paddingLeft: "10px" }}>
                                        Customer Configuration
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            paddingRight: "10px",
                                        }}
                                    >
                                        <Button
                                            className="configuration-button"
                                            onClick={() => {
                                                addGroupSubGroup("add", "root-1");
                                            }}
                                            disabled={reorderMode}
                                        >
                                            <Typography
                                                variant="text_16_semibold"
                                                textAlign="center"
                                                className="configuration-typography"
                                            >
                                                + Create Group
                                            </Typography>
                                        </Button>
                                    </div>
                                </div>
                                <ItemSearchHeader
                                    reorderMode={reorderMode}
                                    setReorderMode={setReorderMode}
                                    onSearchChange={setQueryTree2}
                                    onClickExpand={() => onExpandAllClick("tree-2")}
                                    onClickCollapse={() => onCollapseAllClick("tree-2")}
                                />
                                {filteredNodes && filteredNodes["root-2"]?.children?.length > 0 && (
                                    <Tree treeId="tree-2" rootItem="root-2" treeLabel="Tree 2" />
                                )}
                            </div>
                        </div>
                    </ControlledTreeEnvironment>
                </>
            )}

            {isOpenGroupModal && (
                <AddGroupSubGroup
                    setGroupSubgroupModal={setIsOpenGroupModal}
                    groupSubgroupData={groupSubgroupData}
                    setGroupSubgroupData={setGroupSubgroupData}
                    openModal={isOpenGroupModal}
                    treeKey={"root-2"}
                    actionType={actionType}
                    externalNodes={externalNodes}
                    setExternalNodes={setExternalNodes}
                    selectedItem={selectedItem}
                />
            )}

            {openMergeHotkeys && (
                <MergeHotkeys
                    open={openMergeHotkeys}
                    setOpen={setMergeHotkeysModal}
                    externalNodes={externalNodes}
                    setExternalNodes={setExternalNodes}
                    organisationContainerDeletedIds={organisationContainerDeletedIds}
                    setOrganisationContainerDeletedIds={setOrganisationContainerDeletedIds}
                    selectedItem={selectedItem}
                    rollupConfigDetails={rollupConfigDetails}
                    setRollupConfigDetails={setRollupConfigDetails}
                />
            )}

            <Dialog
                open={openDailog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography variant="text_16_semibold">{`${
                        actionType === "delete" ? "Delete" : "Un-merge"
                    } Group/Sub group`}</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ color: "#000000" }}>
                        Are you sure you want to {actionType} this group/sub group?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ marginBottom: "12px" }}>
                    <BaseButton
                        onClick={handleClose}
                        label={"Cancel"}
                        classes="grey default spaced"
                        variant={"text_14_regular"}
                        sx={{ width: "146px" }}
                    />
                    <BaseButton
                        onClick={() => handleConfirm()}
                        label={"Save"}
                        classes="primary default spaced"
                        variant={"text_16_semibold"}
                        sx={{ width: "146px" }}
                    />
                </DialogActions>
            </Dialog>
            {openItemModal && (
                <AddConfigItemModal
                    openModal={openItemModal}
                    modalHandler={setItemModal}
                    onSave={onAddNewItem}
                    modalComponent={<CreateItemComponent />}
                />
            )}
        </>
    );
};

export default ConfigurationEdit;
