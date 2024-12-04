import { has, omit, uniq } from "lodash";

const toRequest = (tree: any, rootKey = "root-2") => {
    const constructPayload = (nodeKey: string, parentNode: any, level: number) => {
        // if (level === 4) return {};

        const levelsArrayElement = level < 3 ? { [`l${level + 1}s`]: [] } : {};
        const folderNode: any = {
            [`l${level}`]: tree[nodeKey].data?.split("~")[0],
            cost_code: tree[nodeKey].data?.split("~")[1],
            ...levelsArrayElement,
            items: [],
        };

        if (tree[nodeKey].children.length > 0 && !tree[nodeKey].mergedFolder) {
            tree[nodeKey].children.forEach((key: any) => {
                const childFolder = constructPayload(key, folderNode, level + 1);
                if (
                    childFolder?.items?.length > 0 ||
                    childFolder?.merged_items?.length > 0 ||
                    childFolder[`l${level + 2}s`]?.length > 0
                ) {
                    folderNode[`l${level + 1}s`].push(childFolder);
                }
            });
        } else {
            if (tree[nodeKey].mergedFolder) {
                parentNode.merged_items = parentNode.merged_items ?? [];
                const newMergedItem = {
                    container_item_id: null,
                    item_name: tree[nodeKey].item_name,
                    scope: tree[nodeKey].scope,
                    work_type: tree[nodeKey].work_type,
                    cost_code: tree[nodeKey].cost_code,
                    category: tree[nodeKey].category,
                    subcategory: tree[nodeKey].subcategory,
                    codex: tree[nodeKey].codex,
                    merge_configuration: tree[nodeKey].merge_hotkeys_selection,
                    items: [],
                };

                newMergedItem.items = tree[nodeKey].children.map((key: any) => {
                    return {
                        container_item_id: tree[key].container_item_id,
                        item_name: tree[key].item_name,
                        scope: tree[key].scope,
                        work_type: tree[key].work_type,
                        cost_code: tree[key].cost_code,
                        category: tree[key].tb_category,
                        subcategory: tree[key].subcategory,
                        codex: tree[key].codex,
                    };
                });
                parentNode.merged_items = [...parentNode.merged_items, newMergedItem];
            } else {
                const item = {
                    container_item_id: tree[nodeKey].container_item_id,
                    item_name: tree[nodeKey].item_name,
                    scope: tree[nodeKey].scope,
                    work_type: tree[nodeKey].work_type,
                    cost_code: tree[nodeKey].cost_code,
                    category: tree[nodeKey].tb_category,
                    subcategory: tree[nodeKey].subcategory,
                    codex: tree[nodeKey].codex,
                };
                parentNode?.items?.push(item);
            }
        }

        return folderNode;
    };

    const payload: any = [];
    tree[rootKey]?.children?.forEach((childKey: any) => {
        let level = 1;
        const categoryNode = constructPayload(childKey, {}, level);
        if (
            categoryNode?.items?.length > 0 ||
            categoryNode?.merged_items?.length > 0 ||
            categoryNode?.l2s.length > 0
        ) {
            payload.push(categoryNode);
        }
    });
    return payload;
};

const getLevel = (level: any) => {
    if (has(level, "l1")) return "l1";
    if (has(level, "l2")) return "l2";
    if (has(level, "l3")) return "l3";
    return "";
};

const getNextLevel = (currentLevel: any) => {
    if (currentLevel === "l1") return "l2";
    if (currentLevel === "l2") return "l3";
    return "";
};

const fromResponse = (responseTree: any) => {
    const newTree: any = {};

    const processItems = (items: any, parent: any) => {
        items?.forEach((item: any) => {
            const itemData = `${item.subcategory} ${item.work_type}~${item.cost_code}`;
            newTree[item.container_item_id] = {
                ...item,
                category: parent,
                tb_category: item.category,
                data: itemData,
                tree: "tree-2",
                index: item.container_item_id,
                children: [],
            };
            newTree[parent].children = [...newTree[parent].children, item.container_item_id];
        });
    };

    const explodeNodes = (node: any, parent: any) => {
        const level = getLevel(node);
        if (level) {
            const folderName = `${node[level]}~${node.cost_code}`;
            newTree[folderName] = {
                category: parent,
                children: [],
                cost_code: node.cost_code,
                isFolder: true,
                tree: "tree-2",
                data: folderName,
                index: folderName,
            };

            if (level === "l1") {
                newTree["root-2"].children = [...newTree["root-2"].children, folderName];
            }

            //process items
            processItems(node?.items, folderName);

            //process merged items
            node.merged_items?.forEach((merged_item: any) => {
                // todo need to make this unique
                const mergedFolderIndex = merged_item.cost_code;
                newTree[folderName].children = [...newTree[folderName].children, mergedFolderIndex];
                const mergedFolder = {
                    category: folderName,
                    children: [],
                    isFolder: true,
                    tree: "tree-2",
                    data: `${merged_item.item_name} ${merged_item.scope}`,
                    index: mergedFolderIndex,
                    mergedFolder: true,
                    merge_hotkeys_selection: merged_item.merge_configuration ?? {
                        scope_merge: [],
                        labour_merge: [],
                    },
                    ...omit(merged_item, ["items", "merge_configuration"]),
                };
                newTree[mergedFolderIndex] = mergedFolder;

                // process items present in merge folder
                processItems(merged_item?.items, mergedFolderIndex);
            });

            const nextLevel = getNextLevel(level);

            if (nextLevel) {
                const nextElementsKey = `${nextLevel}s`;

                // process levels
                node[nextElementsKey].forEach((nextLevelNode: any) => {
                    const subFolderName = `${nextLevelNode[nextLevel]}~${nextLevelNode.cost_code}`;

                    newTree[folderName].children = [...newTree[folderName].children, subFolderName];
                    explodeNodes(nextLevelNode, folderName);
                });
            }
        }
    };

    newTree["root-2"] = {
        index: "root-2",
        isFolder: true,
        canMove: true,
        data: "root-2",
        children: [],
    };

    responseTree.forEach((l1: any) => {
        explodeNodes(l1, "root-2");
    });

    return newTree;
};

// method to get merge config for either merged folder or subgroup/group
const getMergeConfig = (nodeKey: any, tree: any) => {
    const node = tree[nodeKey];
    if (node.isFolder) {
        if (node.mergedFolder) {
            return node.merge_hotkeys_selection;
        } else {
            let scopeMerges: any = [];
            let labourMerges: any = [];
            node.children.forEach((childKey: any) => {
                if (tree[childKey].mergedFolder) {
                    const scope_merge = tree[childKey].merge_hotkeys_selection.scope_merge ?? [];
                    const labour_merge = tree[childKey].merge_hotkeys_selection.labour_merge ?? [];
                    scopeMerges = [...scopeMerges, ...scope_merge];
                    labourMerges = [...labourMerges, ...labour_merge];
                }
            });
            return {
                scope_merge: uniq(scopeMerges),
                labour_merge: uniq(labourMerges),
            };
        }
    }
    return { scope_merge: [], labour_merge: [] };
};

export { toRequest, fromResponse, getMergeConfig };
