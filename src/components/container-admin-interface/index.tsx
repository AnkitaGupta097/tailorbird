import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import { Add, Download, Upload } from "@mui/icons-material";
import {
    CONTAINER_COLUMNS,
    CONTAINER_COMMON_CATEGORIES,
    CONTAINER_DATA_QUERY,
    MATERIAL_LABOR_KIT,
    SCOPES,
    SCOPE_WORK_MAP,
    SIMPLE_MATERIAL_LABOR,
    downloadJSON,
} from "./constants";
import ContainerAdminModal from "./item-modal";
import BulkUploadModal from "./bulk-upload-modal";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import TrackerUtil from "utils/tracker";
import { IUser } from "stores/ims/interfaces";

const ContainerAdminInterface = () => {
    const [tableData, setTableData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [editContainerItem, setEditContainerItem] = useState(null);
    const [bulkUploadJSON, setBulkUploadJSON] = useState(null);
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
    const getContainerData = async () => {
        const res = await graphQLClient.query("getContainerData", CONTAINER_DATA_QUERY, {
            allItems: true,
        });
        const { getContainerItemsV2, getContainerV2 } = res;
        const _tableData = getContainerItemsV2.map((s: any) => {
            const { category, item_name, uoms, project_support } = s;
            const uom = uoms[0]?.uom;
            const matchedItems = getContainerV2.filter(
                (t: any) => t.category == category && t.item_name == item_name && t.is_active,
            );
            const deletedItems = getContainerV2.filter(
                (t: any) => t.category == category && t.item_name == item_name && !t.is_active,
            );
            const component = matchedItems![0]?.component;
            const projectTypeArray = project_support;
            const currScopes = matchedItems.map((s: any) => s.scope) as Array<string>;
            const prevScopes = deletedItems.map((s: any) => s.scope) as Array<string>;
            const scopeMap = {} as any;
            const deletedScopeMap = {} as any;
            SCOPES.forEach((scope) => {
                createScopeMap(currScopes, scopeMap, scope);
                createScopeMap(prevScopes, deletedScopeMap, scope);
            });
            const scopes = Object.values(scopeMap);
            const deletedScopes = Object.values(deletedScopeMap);
            const deleted = s.is_active ? "Not Deleted" : "Deleted";
            return {
                category,
                item_name,
                component,
                uom,
                scopes,
                project_support: projectTypeArray,
                deleted,
                is_active: s.is_active,
                projectSupport: projectTypeArray?.join(", "),
                deletedScopes: deletedScopes,
            };
        });
        CONTAINER_COMMON_CATEGORIES.forEach((container_common_category) => {
            getContainerV2
                .filter((data: any) => data.category == container_common_category)
                .forEach((data: any) => {
                    const {
                        category,
                        item_name,
                        component,
                        uom,
                        scopes,
                        project_support,
                        deleted,
                        is_active,
                        projectSupport,
                        deletedScopes,
                    } = data;
                    _tableData.push({
                        category,
                        item_name,
                        component,
                        uom,
                        scopes,
                        project_support,
                        deleted,
                        is_active,
                        projectSupport,
                        deletedScopes,
                    });
                });
        });
        setTableData(
            _tableData.sort((first: any, second: any) => second.is_active - first.is_active),
        );
        return _tableData;
    };

    const undoDelete = (containerObject: any) => {
        setEditContainerItem(containerObject);
    };
    useEffect(() => {
        if (tableData.length == 0) {
            getContainerData();
        }
    });

    const downloadContainer = async () => {
        const _tableData = await getContainerData();
        const t = _tableData.map((s: any) => {
            const {
                category,
                component,
                item_name,
                scopes,
                project_support,
                uom,
                is_active,
                deletedScopes,
            } = s;
            return {
                category,
                component,
                item_name,
                scopes: is_active ? scopes : deletedScopes,
                project_support,
                uoms: [{ uom: uom, formula: null }],
                is_active,
            };
        });
        downloadJSON(t);
        TrackerUtil.event("CONTAINER_V2_DOWNLOAD_JSON", { email });
    };
    const is_container_admin = useFeature(FeatureFlagConstants.CONTAINER_ADMIN).on;
    return (
        <div style={{ margin: 32 }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    <TextField
                        label="Search Container"
                        variant="outlined"
                        focused={true}
                        helperText="Search Container"
                        onChange={(e) => {
                            setFilterText(e.target.value);
                        }}
                    />
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <Stack direction={"row"} spacing={2}>
                        <Button
                            variant="outlined"
                            disabled={!is_container_admin}
                            startIcon={<Add />}
                            onClick={() => {
                                setEditContainerItem({} as any);
                            }}
                        >
                            New Item
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => {
                                downloadContainer();
                            }}
                        >
                            Download Container
                        </Button>
                        <Button
                            variant="outlined"
                            disabled={!is_container_admin}
                            startIcon={<Upload />}
                            component="label"
                        >
                            Upload Container
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    console.log({ e });
                                    let fr = new FileReader();
                                    fr.onload = function (e) {
                                        const loadedContainer = JSON.parse(`${e.target?.result}`);
                                        setBulkUploadJSON(loadedContainer);
                                    };
                                    fr.readAsText(e?.target?.files![0]);
                                    e.target.value = "";
                                }}
                            />
                        </Button>
                    </Stack>
                </div>
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {CONTAINER_COLUMNS.map((s) => (
                                <TableCell key={s} style={{ fontSize: "18px" }}>
                                    {s}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {tableData
                        .filter((s: any) =>
                            s.item_name.toLowerCase().includes(filterText.toLowerCase()),
                        )
                        .map((containerObject: any, rIndex) => {
                            const categoryItemName = `${containerObject.category}-${containerObject.item_name}`;
                            const rowChildren = CONTAINER_COLUMNS.map((containerColumn, cIndex) => (
                                <TableCell key={`${rIndex}-${cIndex}`} style={{ fontSize: "18px" }}>
                                    {containerObject[containerColumn]}
                                </TableCell>
                            ));
                            rowChildren.push(
                                <TableCell style={{ fontSize: "18px" }}>
                                    {containerObject.is_active ? (
                                        <button
                                            disabled={!is_container_admin}
                                            onClick={() => {
                                                setEditContainerItem(containerObject);
                                            }}
                                        >
                                            Edit {categoryItemName}
                                        </button>
                                    ) : (
                                        <button
                                            disabled={!is_container_admin}
                                            onClick={() => undoDelete(containerObject)}
                                        >
                                            Undo Delete {categoryItemName}
                                        </button>
                                    )}
                                </TableCell>,
                            );
                            return (
                                <TableRow id={categoryItemName} key={`${rIndex}`}>
                                    {rowChildren}
                                </TableRow>
                            );
                        })}
                </Table>
            </TableContainer>
            <ContainerAdminModal
                open={!!editContainerItem}
                onClose={() => {
                    setEditContainerItem(null);
                }}
                editObject={editContainerItem}
                onSave={() => {
                    setEditContainerItem(null);
                    getContainerData();
                }}
            />
            <BulkUploadModal
                open={!!bulkUploadJSON}
                onClose={() => {
                    setBulkUploadJSON(null);
                }}
                onSave={() => {
                    setBulkUploadJSON(null);
                    getContainerData();
                }}
                bulkUploadJSON={bulkUploadJSON}
            />
        </div>
    );
};

export default ContainerAdminInterface;
