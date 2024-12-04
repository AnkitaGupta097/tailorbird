import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { Add, Download, UploadFile } from "@mui/icons-material";
import { DndProvider } from "react-dnd";
import {
    MultiBackend,
    getBackendOptions,
    Tree,
    NodeModel,
    isAncestor,
    getDescendants,
} from "@minoru/react-dnd-treeview";
import { DragLayer } from "./DragLayer";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./App.module.css";
import { AddDialog } from "./AddDialog";
import { graphQLClient } from "utils/gql-client";
import { CONTAINER_DATA_QUERY } from "components/container-admin-interface/constants";
import { json2csv } from "json-2-csv";
import { MultipleDragPreview } from "./MultipleDragPreview";
import Papa from "papaparse";

const App = () => {
    const [tree, setTree] = useState<Array<any>>([]);
    const [externalNodes, setExternalNodes] = useState<Array<any>>([]);
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedNodes, setSelectedNodes] = useState<NodeModel[]>([]);
    const [isCtrlPressing, setIsCtrlPressing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragSourceIds, setDragSourceIds] = useState<(string | number)[]>([]);

    const reference = useRef(null);
    const handleDrop = (newTree: any, options: any) => {
        const { dropTargetId } = options;
        const updatedTree = tree.map((node: any) => {
            if (selectedNodes.some((selectedNode) => selectedNode.id === node.id)) {
                // Assign new parent if node is selected
                return {
                    ...node,
                    parent: dropTargetId,
                };
            }

            return node;
        });

        selectedNodes.forEach((selectedNode: any) => {
            const alreadyExists = updatedTree.some((node: any) => node.id === selectedNode.id);
            if (!alreadyExists) {
                updatedTree.push({
                    ...selectedNode,
                    parent: dropTargetId,
                });
            }
        });

        const updatedExternalNodes = externalNodes.filter(
            (exnode: any) => !selectedNodes.some((selectedNode) => selectedNode.id === exnode.id),
        );

        setTree(updatedTree);
        setExternalNodes(updatedExternalNodes);

        localStorage.setItem("treeData", JSON.stringify(updatedTree));
        localStorage.setItem("externalNodes", JSON.stringify(updatedExternalNodes));
    };

    const handleDrop2 = (newTree: any, options: any) => {
        if (searchValue.trim().length > 0) {
            alert("Please clear search filter to perform item repositioning");
            return;
        }
        const { dragSourceId } = options;
        setExternalNodes(newTree);
        const updatedTree = tree.filter((exnode: any) => exnode.id !== dragSourceId);
        setTree(updatedTree);
        localStorage.setItem("treeData", JSON.stringify(updatedTree));
        localStorage.setItem("externalNodes", JSON.stringify(newTree));
    };

    const getContainerData = async () => {
        if (externalNodes.length > 0) {
            return;
        }
        const res = await graphQLClient.query("getContainerData", CONTAINER_DATA_QUERY, {
            allItems: false,
        });
        const { getContainerV2 } = res;
        const categories = new Set();
        getContainerV2.forEach((s: any) => categories.add(s.category));
        const nodes_list = Array.from(categories).map((s) => {
            return { id: s, parent: 2, text: s, droppable: true };
        });
        getContainerV2.forEach((t: any) => {
            nodes_list.push({
                ...t,
                parent: t.category,
                text: `${t.item_name} ${t.scope} ${t.work_type}`,
                droppable: false,
            });
        });
        setExternalNodes([...nodes_list]);
        localStorage.setItem("externalNodes", JSON.stringify([...nodes_list]));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "escape") {
                setSelectedNodes([]);
            } else if (e.ctrlKey || e.metaKey) {
                setIsCtrlPressing(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "control" || e.key.toLowerCase() === "meta") {
                setIsCtrlPressing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        getContainerData();
    });

    const handleAddExternalNode = () => {
        setOpen(true);
    };
    const generateCSV = (
        data: Array<any>,
        parent_id: number,
        visited_path: Array<any>,
        generated_data: Array<any>,
    ) => {
        const children = data.filter((s) => s.parent == parent_id);
        if (children.length == 0) {
            const t = {} as any;
            visited_path.forEach((s: any, index: number) => {
                if (s.droppable) {
                    const key = `Level-${index + 1}`;
                    t[key] = s.text;
                    t[`${key} Cost Code`] = s.costCode;
                } else {
                    t["Tailorbird Category"] = s.category;
                    t["Tailorbird Item Name"] = s.item_name;
                    t["Tailorbird Scope"] = s.scope;
                    t["Tailorbird Work Type"] = s.work_type;
                    t["Tailorbird Subcategory"] = s.subcategory;
                    t["Tailorbird Cost Code"] = s.cost_code;
                }
            });
            generated_data.push(t);
            return;
        } else {
            children.forEach((child) => {
                generateCSV(data, child.id, [...visited_path, child], generated_data);
            });
        }
    };
    const exportToCSV = async () => {
        let generated_data = [] as Array<any>;
        generateCSV(tree, 0, [], generated_data);
        const response = await json2csv(generated_data);
        let hiddenElement = document.createElement("a");
        hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(response)}`;
        hiddenElement.target = "_blank";
        hiddenElement.download = `cost_code_map_${new Date().getTime()}.csv`;
        hiddenElement.click();
    };

    let nodeId = 0;
    const getNextId = () => {
        return ++nodeId;
    };

    const createTreeFromCSV = (csvData: Array<any>) => {
        let treeData: Array<any> = [];

        csvData.forEach((row: any) => {
            let parentNode = { id: 0, parent: null, text: "", droppable: false };
            for (let i = 1; i <= 10; i++) {
                const levelKey = `Level-${i}`;
                const levelText = row[levelKey];
                const levelCostCode = row[`${levelKey} Cost Code`];

                if (!levelText) {
                    break;
                }

                let node = treeData.find((node) => node.text === levelText);
                if (!node) {
                    node = {
                        id: getNextId(),
                        parent: parentNode.id,
                        text: levelText,
                        costCode: levelCostCode,
                        droppable: true,
                    };
                    treeData.push(node);
                }

                parentNode = node;
            }

            if (parentNode.id !== 0) {
                treeData.push({
                    id: getNextId(),
                    parent: parentNode.id,
                    text: `${row["Tailorbird Category"]} ${row["Tailorbird Item Name"]} ${row["Tailorbird Scope"]} ${row["Tailorbird Work Type"]}`,
                    category: row["Tailorbird Category"],
                    item_name: row["Tailorbird Item Name"],
                    scope: row["Tailorbird Scope"],
                    work_type: row["Tailorbird Work Type"],
                    subcategory: row["Tailorbird Subcategory"],
                    cost_code: row["Tailorbird Cost Code"],
                    droppable: false,
                });
            }
        });

        setTree(treeData);
        localStorage.setItem("treeData", JSON.stringify(treeData));
    };

    const importFromCSV = (csvFile: File) => {
        Papa.parse(csvFile, {
            header: true,
            complete: (results) => {
                const parsedData = results.data;
                createTreeFromCSV(parsedData);
            },
        });
    };

    function FileUploadButton() {
        const inputRef = useRef<HTMLInputElement>(null);

        const onButtonClick = () => {
            inputRef.current?.click();
        };

        return (
            <div>
                <input
                    type="file"
                    ref={inputRef}
                    accept=".csv"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        if (e.target.files) {
                            importFromCSV(e.target.files[0]);
                        }
                    }}
                />
                <Button variant="outlined" onClick={onButtonClick} startIcon={<UploadFile />}>
                    Import CSV
                </Button>
            </div>
        );
    }

    const handleTextChange = (incoming_node: any, value: any) => {
        const { description, cost_code } = value;
        const existingNodes = tree.filter(
            (s: any) => s.text == description && s.parent == incoming_node.parent,
        );
        if (existingNodes.length > 0) {
            alert(`Node with name ${description} already present in the hierarchy`);
            return false;
        }
        const newTree = tree.map((node: any) => {
            if (node.id === incoming_node.id) {
                return {
                    ...node,
                    text: description,
                    costCode: cost_code,
                };
            }

            return node;
        });
        setTree(newTree);
        localStorage.setItem("treeData", JSON.stringify(newTree));
    };

    const getLastId = (treeData: any[]) => {
        const droppableArray = treeData.filter((item) => item.droppable);

        if (droppableArray.length === 0) return 0;

        const sortedArray = droppableArray.sort((a, b) => b.id - a.id);

        return sortedArray[0].id;
    };

    const handleSubmit = (newNode: any) => {
        const { text, parent } = newNode;
        const existingNodes = tree.filter((s: any) => s.text == text && s.parent == parent);
        if (existingNodes.length > 0) {
            alert(`Node with name ${text} already present in the hierarchy`);
            return false;
        }
        const lastId = getLastId(tree) + 1;
        const updatedTree = [
            ...tree,
            {
                ...newNode,
                id: lastId,
            },
        ];

        setTree(updatedTree);
        localStorage.setItem("treeData", JSON.stringify(updatedTree));

        setOpen(false);
    };

    const handleSingleSelect = (node: NodeModel) => {
        setSelectedNodes([node]);
    };

    const handleMultiSelect = (clickedNode: NodeModel) => {
        // Creating a map for constant time lookup
        const selectedMap = new Map(selectedNodes.map((node) => [node.id, node]));

        // ignore if the clicked node is already selected
        if (selectedMap.has(clickedNode.id)) {
            return;
        }

        // ignore if ancestor node already selected
        for (const node of selectedNodes) {
            if (isAncestor(tree, node.id, clickedNode.id)) {
                return;
            }
        }

        const updateNodes = selectedNodes.filter((selectedNode) => {
            return !isAncestor(tree, clickedNode.id, selectedNode.id);
        });

        updateNodes.push(clickedNode);

        setSelectedNodes(updateNodes);
    };

    const handleClick = (e: React.MouseEvent, node: NodeModel) => {
        if (e.ctrlKey || e.metaKey) {
            handleMultiSelect(node);
        } else {
            handleSingleSelect(node);
        }
    };

    const handleDragStart = (node: NodeModel) => {
        const isSelectedNode = selectedNodes.some((n) => n.id === node.id);
        setIsDragging(true);

        if (!isCtrlPressing && isSelectedNode) {
            return;
        }

        if (!isCtrlPressing) {
            setSelectedNodes([node]);
            setDragSourceIds([node.id]);
            return;
        }

        if (!selectedNodes.some((n) => n.id === node.id)) {
            setSelectedNodes([...selectedNodes, node]);
            setDragSourceIds([...dragSourceIds, node.id]);
        }
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setIsCtrlPressing(false);
        setSelectedNodes([]);
        setDragSourceIds([]);
    };

    const handleDelete = (id: NodeModel["id"]) => {
        const deleteIds = [id, ...getDescendants(tree, id).map((node) => node.id)];
        const newTree = tree.filter((node) => !deleteIds.includes(node.id));
        const deletedNodes = tree.filter((node) => deleteIds.includes(node.id));
        const deletedNodesUpdatedParent = deletedNodes.map((node) => ({
            ...node,
            parent: node.category,
        }));
        const updatedExternalNodes = [...externalNodes, ...deletedNodesUpdatedParent];

        setTree(newTree);
        setExternalNodes(updatedExternalNodes);
        localStorage.setItem("treeData", JSON.stringify(newTree));
        localStorage.setItem("externalNodes", JSON.stringify(updatedExternalNodes));
    };

    useEffect(() => {
        const treeDataFromLocalStorage = localStorage.getItem("treeData");
        const externalNodeDataFromLocalStorage = localStorage.getItem("externalNodes");
        if (treeDataFromLocalStorage) {
            setTree(JSON.parse(treeDataFromLocalStorage));
        }
        if (externalNodeDataFromLocalStorage) {
            setExternalNodes(JSON.parse(externalNodeDataFromLocalStorage));
        }
    }, []);

    return (
        <div className="cost-code-mapper">
            <DndProvider backend={MultiBackend} options={getBackendOptions()} debugMode={true}>
                <DragLayer />
                <div className={styles.rootGrid}>
                    <div className={styles.externalContainer}>
                        <div>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <input
                                    placeholder="Search Items Here"
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const t = reference.current as any;
                                        t?.openAll();
                                    }}
                                >
                                    Expand All
                                </button>
                                <button
                                    onClick={() => {
                                        const t = reference.current as any;
                                        t?.closeAll();
                                    }}
                                >
                                    Minimize All
                                </button>
                            </div>

                            <Tree
                                ref={reference}
                                rootId={2}
                                tree={externalNodes.filter((s: any) => {
                                    if (s.droppable) {
                                        return s;
                                    }
                                    return s.item_name
                                        .toLowerCase()
                                        .includes(searchValue.trim().toLowerCase());
                                })}
                                // listItemComponent={"div"}
                                // listComponent={"div"}
                                classes={{
                                    root: styles.treeRoot,
                                    draggingSource: styles.draggingSource,
                                    dropTarget: styles.dropTarget,
                                }}
                                render={(node, options) => {
                                    const selected = selectedNodes.some(
                                        (selectedNode) => selectedNode.id === node.id,
                                    );

                                    return (
                                        <CustomNode
                                            onTextChange={handleTextChange}
                                            node={node}
                                            onClick={handleClick}
                                            isSelected={selected}
                                            {...options}
                                            isDragging={selected && isDragging}
                                        />
                                    );
                                }}
                                dragPreviewRender={(monitorProps) => {
                                    if (selectedNodes.length > 1) {
                                        return <MultipleDragPreview dragSources={selectedNodes} />;
                                    }

                                    return <CustomDragPreview monitorProps={monitorProps} />;
                                }}
                                onDrop={handleDrop2}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            />
                        </div>
                    </div>
                    <div>
                        <Box display={"flex"} mt={5}>
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={handleAddExternalNode}
                            >
                                Add node
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Download />}
                                onClick={exportToCSV}
                            >
                                Export to csv
                            </Button>
                            <FileUploadButton />
                        </Box>

                        {open && (
                            <AddDialog
                                tree={tree}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                onSubmit={handleSubmit}
                            />
                        )}
                        <Tree
                            rootId={0}
                            tree={tree}
                            // listItemComponent={"div"}
                            // listComponent={"div"}
                            classes={{
                                root: styles.treeRoot,
                                draggingSource: styles.draggingSource,
                                dropTarget: styles.dropTarget,
                            }}
                            render={(node, options) => {
                                return (
                                    <CustomNode
                                        onTextChange={handleTextChange}
                                        node={node}
                                        {...options}
                                        showDelete
                                        onDelete={handleDelete}
                                    />
                                );
                            }}
                            dragPreviewRender={(monitorProps) => {
                                if (selectedNodes.length > 1) {
                                    return <MultipleDragPreview dragSources={selectedNodes} />;
                                }

                                return <CustomDragPreview monitorProps={monitorProps} />;
                            }}
                            onDrop={handleDrop}
                        />
                    </div>
                </div>
            </DndProvider>
        </div>
    );
};

export default App;
