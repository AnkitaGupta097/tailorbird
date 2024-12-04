import React, { useEffect, useState } from "react";
import {
    Grid,
    Dialog,
    DialogActions,
    Typography,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
    Divider,
} from "@mui/material";

import BaseButton from "components/button";
import BaseCheckbox from "components/checkbox";
// import ConfirmationModal from "components/confirmation-modal";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import { cloneDeep, join, map, pull, pullAll, uniq } from "lodash";
import { WORK_TYPE_LABOR } from "./constants";

interface IAddScope {
    open: boolean;
    setOpen: any;
    externalNodes: any;
    setExternalNodes: any;
    organisationContainerDeletedIds: any;
    setOrganisationContainerDeletedIds: any;
    selectedItem: any;
    rollupConfigDetails: any;
    setRollupConfigDetails: any;
}

const ConfigurationRollUp = ({
    open,
    setOpen,
    externalNodes,
    setExternalNodes,
    selectedItem,
    rollupConfigDetails,
    setRollupConfigDetails,
}: IAddScope) => {
    const theme = useTheme();
    const LabourRollupRules: any = {
        "Demo Existing": "Install New",
        "Remove and Store": "Reinstall Existing",
        "Install New": "Demo Existing",
        "Reinstall Existing": "Remove and Store",
    };
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const possibleScopeValue = [
        "Demo Existing & Install New",
        "Remove and Store & Reinstall Existing",
    ];

    const possibleLabourValue = [
        "Demo Existing",
        "Install New",
        "Remove and Store",
        "Reinstall Existing",
        "Repair Existing",
        "Refinish Existing",
        "Add New",
    ];

    const scopeMerge = rollupConfigDetails.scope_merge?.length
        ? uniq(rollupConfigDetails.scope_merge).filter((value: any) =>
              possibleScopeValue.includes(value),
          )
        : [];

    const labourMerge = rollupConfigDetails.labour_merge?.length
        ? uniq(rollupConfigDetails.labour_merge).filter((value: any) =>
              possibleLabourValue.includes(value),
          )
        : [];

    const [checkedScopeRollups, setCheckedScopeRollups] = React.useState(scopeMerge);
    const [checkedLabourRollups, setCheckedLabourRollups] = React.useState(labourMerge);

    // eslint-disable-next-line no-unused-vars
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

    // const [openDailog, setOpenDailog] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        setRollupConfigDetails((config: any) => {
            let rollUpTypesSelected = [];
            checkedScopeRollups?.length > 0 && rollUpTypesSelected.push("scope_merge");
            checkedLabourRollups?.length > 0 && rollUpTypesSelected.push("labour_merge");
            return {
                ...config,
                scope_merge: checkedScopeRollups,
                labour_merge: checkedLabourRollups,
                rollUpTypesSelected: rollUpTypesSelected,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedScopeRollups, checkedLabourRollups]);

    useEffect(() => {
        const tempFolderNodes = [];
        tempFolderNodes.push({ index: "root-2", data: "root" });

        let childrenFunction = (treeKey: any) => {
            externalNodes[treeKey]?.children.forEach((elm: any) => {
                if (externalNodes[elm]?.isFolder && !externalNodes[elm]?.mergedFolder)
                    tempFolderNodes.push({
                        index: externalNodes[elm]?.index,
                        data: externalNodes[elm]?.data,
                    });
                childrenFunction(elm);
            });
        };

        childrenFunction("root-2");
    }, [externalNodes]);

    const getMergedFolderCostCode = (items: any) => {
        return `${join(map(items, "container_item_id"), "|")}-merged`;
    };

    const flattenMergedFolder = (tree: any, nodeKey: any) => {
        let chilrenFolderToDelete: any = [];
        tree[nodeKey].children.forEach((mergedFolderKey: any) => {
            if (tree[mergedFolderKey]?.isFolder && tree[mergedFolderKey]?.mergedFolder) {
                const children = tree[mergedFolderKey].children.map((key: any) => tree[key]);
                shiftNodes(nodeKey, children, tree);
                chilrenFolderToDelete.push(mergedFolderKey);
                delete tree[mergedFolderKey];
            }
        });
        pullAll(tree[nodeKey].children, chilrenFolderToDelete);
    };

    const groupByLabour = (labourRule: string, nodeKey: string, tree: any, groupedNodes: any) => {
        const node = tree[nodeKey];
        if (node.children && node.children.length > 0) {
            node.children.forEach((key: any) => {
                !tree[key].isFolder && groupByLabour(labourRule, key, tree, groupedNodes);
            });
        } else {
            if (
                node.scope === labourRule &&
                node.work_type &&
                node.work_type.toLowerCase() === WORK_TYPE_LABOR
            ) {
                groupedNodes.push(node);
            }
        }
        return groupedNodes;
    };

    const groupByScope = (scopeRule: string, nodeKey: any, tree: any, nodeBuckets: any) => {
        const node = tree[nodeKey];
        if (node.children && node.children.length > 0) {
            node.children.forEach((key: any) => {
                !tree[key].isFolder && groupByScope(scopeRule, key, tree, nodeBuckets);
            });
        } else {
            if (
                scopeRule.includes(node.scope) &&
                node.work_type &&
                node.work_type.toLowerCase() === WORK_TYPE_LABOR
            ) {
                if (nodeBuckets[node.item_name]) {
                    nodeBuckets[node.item_name].push(node);
                } else {
                    nodeBuckets[node.item_name] = [node];
                }
            }
        }
        return nodeBuckets;
    };

    const groupByScopeAndLabour = (
        scopeRule: string,
        nodeKey: string,
        tree: any,
        groupedNodes: any,
    ) => {
        const node = tree[nodeKey];
        if (node.children && node.children.length > 0) {
            node.children.forEach((key: any) => {
                !tree[key].isFolder && groupByScopeAndLabour(scopeRule, key, tree, groupedNodes);
            });
        } else {
            if (
                scopeRule.includes(node.scope) &&
                node.work_type &&
                node.work_type.toLowerCase() === WORK_TYPE_LABOR
            ) {
                groupedNodes.push(node);
            }
        }
        return groupedNodes;
    };

    const getScopeAndLabourRules = (scopeRules: any, labourRules: any) => {
        const scopeAndLabourRules: any = [];
        if (
            scopeRules.includes("Demo Existing & Install New") &&
            labourRules.includes("Demo Existing") &&
            labourRules.includes("Install New")
        ) {
            scopeAndLabourRules.push("Demo Existing & Install New");
            scopeRules.splice(scopeRules.indexOf("Demo Existing & Install New"), 1);
            labourRules.splice(labourRules.indexOf("Demo Existing"), 1);
            labourRules.splice(labourRules.indexOf("Install New"), 1);
        }

        if (
            scopeRules.includes("Remove and Store & Reinstall Existing") &&
            labourRules.includes("Remove and Store") &&
            labourRules.includes("Reinstall Existing")
        ) {
            scopeAndLabourRules.push("Remove and Store & Reinstall Existing");
            scopeRules.splice(scopeRules.indexOf("Remove and Store & Reinstall Existing"), 1);
            labourRules.splice(labourRules.indexOf("Remove and Store"), 1);
            labourRules.splice(labourRules.indexOf("Reinstall Existing"), 1);
        }
        return [scopeRules, labourRules, scopeAndLabourRules];
    };

    // shift childrens and updates tree
    const shiftNodes = (newKey: any, nodes: any, tree: any) => {
        nodes.forEach((node: any) => {
            //update current parent
            const parent = tree[node.category];
            parent.children = pull(parent.children, node.index);

            node.category = newKey;
            tree[newKey].children.push(node.index);
        });
    };

    const applyScopeAndLabourMerge = (tree: any, scopeAndLabourRules: any, selectedKey: any) => {
        scopeAndLabourRules.forEach((rule: any) => {
            const groupedNodes = groupByScopeAndLabour(rule, selectedKey, tree, []);
            if (groupedNodes && groupedNodes.length > 0) {
                const parentName = tree[selectedKey].data.split("~")[0];
                const mergedFolderCostCode = getMergedFolderCostCode(groupedNodes);
                const mergedGroupIndex = mergedFolderCostCode;
                const mergedGroup = {
                    index: mergedGroupIndex,
                    isFolder: true,
                    canMove: true,
                    mergedFolder: true,
                    merge_hotkeys_selection: {
                        scope_merge: [rule],
                        labour_merge: rule.split("&").map((v: any) => v.trim()),
                    },
                    tree: "tree-2",
                    tb_category: selectedKey,
                    subcategory: `${parentName} - ${rule}`,
                    item_name: parentName,
                    scope: rule,
                    work_type: "Labor",
                    cost_code: mergedFolderCostCode,
                    container_item_id: null,
                    category: selectedKey,
                    data: `${parentName} ${rule}`,
                    children: [],
                };

                tree[mergedGroupIndex] = mergedGroup;
                tree[selectedKey].children.push(mergedGroupIndex);

                shiftNodes(mergedGroupIndex, groupedNodes, tree);
            }
        });
    };

    const applyScopeMerges = (tree: any, scopeRules: any, selectedKey: any) => {
        scopeRules.forEach((rule: any) => {
            const groupedNodeBuckets = groupByScope(rule, selectedKey, tree, []);
            let validGroupedNodeBuckets: any = {};
            Object.keys(groupedNodeBuckets).forEach((elm) => {
                if (groupedNodeBuckets[elm].length === 2) {
                    validGroupedNodeBuckets[elm] = groupedNodeBuckets[elm];
                }
            });
            Object.entries(validGroupedNodeBuckets).forEach(
                ([itemName, groupedNodes]: [any, any]) => {
                    const mergedFolderCostCode = getMergedFolderCostCode(groupedNodes);
                    const mergedGroupIndex = mergedFolderCostCode;
                    const mergedGroup = {
                        index: mergedGroupIndex,
                        isFolder: true,
                        canMove: true,
                        mergedFolder: true,
                        merge_hotkeys_selection: { scope_merge: [rule] },
                        tree: "tree-2",
                        tb_category: selectedKey,
                        subcategory: `${itemName} - ${rule}`,
                        item_name: itemName,
                        scope: rule,
                        work_type: "Labor",
                        cost_code: mergedFolderCostCode,
                        container_item_id: null,
                        category: selectedKey,
                        data: `${itemName} ${rule}`,
                        children: [],
                    };

                    tree[mergedGroupIndex] = mergedGroup;
                    tree[selectedKey].children.push(mergedGroupIndex);

                    shiftNodes(mergedGroupIndex, groupedNodes, tree);
                },
            );
        });
    };

    const applyLabourMerges = (tree: any, labourRules: any, selectedKey: any) => {
        labourRules.forEach((rule: any) => {
            const groupedNodes = groupByLabour(rule, selectedKey, tree, []);

            if (groupedNodes && groupedNodes.length > 0) {
                const parentName = tree[selectedKey].data.split("~")[0];
                const mergedFolderCostCode = getMergedFolderCostCode(groupedNodes);
                const mergedGroupIndex = mergedFolderCostCode;
                const mergedGroup = {
                    index: mergedGroupIndex,
                    isFolder: true,
                    canMove: true,
                    mergedFolder: true,
                    merge_hotkeys_selection: { labour_merge: [rule] },
                    tree: "tree-2",
                    tb_category: selectedKey,
                    subcategory: `${parentName} - ${rule}`,
                    item_name: parentName,
                    scope: rule,
                    work_type: "Labor",
                    cost_code: mergedFolderCostCode,
                    container_item_id: null,
                    category: selectedKey,
                    data: `${parentName} ${rule}`,
                    children: [],
                };

                tree[mergedGroupIndex] = mergedGroup;
                tree[selectedKey].children.push(mergedGroupIndex);

                shiftNodes(mergedGroupIndex, groupedNodes, tree);
            }
        });
    };

    const merge = () => {
        const tree: any = cloneDeep(externalNodes);
        flattenMergedFolder(tree, selectedItem);

        const [scopeRules, labourRules, scopeAndLabourRules] = getScopeAndLabourRules(
            [...checkedScopeRollups],
            [...checkedLabourRollups],
        );

        scopeAndLabourRules && applyScopeAndLabourMerge(tree, scopeAndLabourRules, selectedItem);

        scopeRules && applyScopeMerges(tree, scopeRules, selectedItem);

        labourRules && applyLabourMerges(tree, labourRules, selectedItem);

        setExternalNodes(tree);
    };

    // const handleClose = () => {
    //     setOpenDailog(false);
    // };

    const handleConfirm = () => {
        merge();
        setOpen(false);
        // setOpenDailog(false);
    };

    const handleChangeScopeRollups = (e: any) => {
        const { checked, name } = e.target;
        const selectedScopeRollupNames = name
            .split("&")
            .map((item: any) => item.trim())
            .flat();
        // Find the labour merge that matches the selected scope option names
        const selectedDepLabourMerge: any = checkedLabourRollups.find((LM: any) =>
            selectedScopeRollupNames.includes(LM),
        );
        const dependantMergeItem = LabourRollupRules[selectedDepLabourMerge];
        if (!checked) {
            setCheckedScopeRollups((prevCheckedIds: any) =>
                prevCheckedIds.filter((c: any) => c !== name),
            );
        } else {
            setCheckedScopeRollups((state) => {
                let result: string[] = [];
                result = [...state, name];
                return result || [];
            });
            if (dependantMergeItem) {
                setCheckedLabourRollups((prevCheckedIds) => [
                    ...prevCheckedIds,
                    dependantMergeItem,
                ]);
            }
        }
    };

    const handleChangeLabourRollups = (e: any) => {
        const { checked, name } = e.target;
        const dependantRollupItem = LabourRollupRules[name];

        // Extract the names of selected scope rollups
        const selectedScopeRollupNames = checkedScopeRollups
            .map((scopeElement: any) => scopeElement?.split("&").map((item: any) => item.trim()))
            .flat();

        if (!checked) {
            // Handle case when the checkbox is unchecked
            if (selectedScopeRollupNames.includes(name)) {
                // If the unchecked item is included in selectedScopeRollupNames, filter it and its dependantRollupItem
                setCheckedLabourRollups((prevCheckedIds) =>
                    prevCheckedIds.filter((c: any) => c !== name && c !== dependantRollupItem),
                );
            } else {
                // Otherwise, only filter the unchecked item
                setCheckedLabourRollups((prevCheckedIds: any) =>
                    prevCheckedIds.filter((c: any) => c !== name),
                );
            }
        } else {
            // Handle case when the checkbox is checked
            if (selectedScopeRollupNames.includes(name)) {
                // If the checked item is included in selectedScopeRollupNames, add it and its dependantRollupItem
                setCheckedLabourRollups((state: any) => [...state, name, dependantRollupItem]);
            } else {
                // Otherwise, only add the checked item
                setCheckedLabourRollups((state: any) => [...state, name]);
            }
        }
    };

    const handleSave = () => {
        let message = "";
        let conditionsPassed = true;

        if (
            rollupConfigDetails?.rollUpTypesSelected?.length > 0 &&
            selectedItem !== "root-2" &&
            conditionsPassed
        ) {
            handleConfirm();
            // setOpenDailog(true);
        } else {
            enqueueSnackbar("", {
                variant: "error",
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="Error"
                        description={
                            rollupConfigDetails?.rollUpTypesSelected?.length == 0
                                ? "Please select at least one merge option"
                                : message
                                ? message
                                : "Root can not be merged"
                        }
                    />
                ),
            });
        }
    };

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="responsive-dialog-title"
                fullWidth={true}
                // sx={{ display: openDailog ? "none" : "" }}
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography variant="text_16_semibold">{"Merge Configuration"}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid>
                        <div
                            style={{
                                marginBottom: "13px",
                                lineHeight: "18.2px",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="text_14_medium">{"Scope merges"}</Typography>
                        </div>
                        <Grid
                            sx={{
                                display: "grid",
                                gridGap: "1rem",
                            }}
                        >
                            {scopeRollUps.map((option: any) => (
                                <div
                                    key={`${option.name}-${option.id}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "max-content",
                                        columnGap: "11px",
                                    }}
                                >
                                    <BaseCheckbox
                                        onChange={(e: any) => handleChangeScopeRollups(e)}
                                        id={option?.id}
                                        value={option?.name}
                                        name={option?.name}
                                        checked={checkedScopeRollups?.includes(option?.name)}
                                    />
                                    <Typography variant="text_14_regular">
                                        {" "}
                                        {option?.name}
                                    </Typography>
                                </div>
                            ))}
                        </Grid>
                        <Divider sx={{ marginTop: "20px" }} />
                        <div
                            style={{
                                marginBottom: "13px",
                                lineHeight: "18.2px",
                                marginTop: "20px",
                            }}
                        >
                            <Typography variant="text_14_medium">{"Labor merges"}</Typography>
                        </div>
                        <Grid
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                                gridGap: "1rem",
                            }}
                        >
                            {scopeOptions.map((option: any) => (
                                <div
                                    key={`${option.name}-${option.id}`}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "max-content",
                                        columnGap: "11px",
                                    }}
                                >
                                    <BaseCheckbox
                                        onChange={(e: any) => handleChangeLabourRollups(e)}
                                        id={option?.id}
                                        value={option?.name}
                                        name={option?.name}
                                        checked={checkedLabourRollups?.includes(option?.name)}
                                    />
                                    <Typography variant="text_14_regular">
                                        {" "}
                                        {option?.name}
                                    </Typography>
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ marginBottom: "12px" }}>
                    <BaseButton
                        onClick={() => {
                            setOpen(false);
                            setCheckedLabourRollups([]);
                            setCheckedScopeRollups([]);
                            setRollupConfigDetails({});
                        }}
                        label={"Cancel"}
                        classes="grey default spaced"
                        variant={"text_14_regular"}
                        sx={{ width: "146px" }}
                    />
                    <BaseButton
                        onClick={() => handleSave()}
                        label={"Save"}
                        classes="primary default spaced"
                        variant={"text_16_semibold"}
                        sx={{ width: "146px" }}
                    />
                </DialogActions>
            </Dialog>
            {/* <ConfirmationModal
                text={"The changes you have made will be saved on project level. "}
                onCancel={() => handleClose()}
                onProceed={() => handleConfirm()}
                open={openDailog}
                actionText="Confirm"
                cancelText={"Cancel"}
                variant="warning"
            /> */}
        </>
    );
};
export default ConfigurationRollUp;
