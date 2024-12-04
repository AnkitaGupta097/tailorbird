import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import {
    DialogContent,
    Dialog,
    TextField,
    Button,
    Stack,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Divider,
    DialogActions,
    FormLabel,
} from "@mui/material";
import {
    CONTAINER_CATEGORY_QUERY,
    CONTAINER_COMMON_CATEGORIES,
    MATERIAL_LABOR_KIT,
    PROJECT_SUPPORT,
    SAVE_CONTAINER_COMMON_ITEM,
    SAVE_CONTAINER_ITEM,
    SCOPES,
    SCOPE_WORK_MAP,
    UOMS,
} from "./constants";
import TrackerUtil from "utils/tracker";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import { IUser } from "stores/ims/interfaces";

interface IScopeObject {
    scope: string;
    work_type: string;
}

interface IContainerEditObjectProps {
    category: string;
    item_name: string;
    component: string;
    uom: string;
    scopes: Array<IScopeObject>;
    project_support: Array<string>;
    is_active: boolean;
    deletedScopes: Array<IScopeObject>;
}

interface IContainerAdminModalProps {
    open: boolean;
    editObject: IContainerEditObjectProps | null;
    onClose: Function;
    onSave: Function;
}

const ContainerAdminModal: React.FC<IContainerAdminModalProps> = ({
    open,
    editObject,
    onClose,
    onSave,
}) => {
    const [categoryData, setCategoryData] = useState([]);
    const [category, setCategory] = useState("");
    const [itemName, setItemName] = useState("");
    const [component, setComponent] = useState("");
    const [uom, setUom] = useState("");
    const [projectSupport, setProjectSupport] = useState([] as Array<string>);
    const [scopes, setScopes] = useState([] as Array<IScopeObject>);
    const [inProgress, setInProgress] = useState(false);
    const getCategoryData = async () => {
        const res = await graphQLClient.query("getCategoryData", CONTAINER_CATEGORY_QUERY);
        setCategoryData(res.getCategories.map((s: any) => s.category));
    };
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    useEffect(() => {
        if (categoryData.length == 0) {
            getCategoryData();
        }
        if (Object.keys(editObject ?? {}).length > 0) {
            setCategory(editObject?.category ?? "");
            setItemName(editObject?.item_name ?? "");
            setComponent(editObject?.component ?? "");
            setUom(editObject?.uom ?? "");
            setProjectSupport(editObject?.project_support ?? []);
            if (editObject?.is_active) {
                setScopes(editObject?.scopes ?? []);
            } else {
                setScopes(editObject?.deletedScopes ?? []);
            }
        } else {
            setCategory("");
            setItemName("");
            setComponent("");
            setUom("");
            setProjectSupport([]);
            setScopes([]);
        }
    }, [editObject, categoryData]);
    const disabled = !!editObject && Object.keys(editObject).length > 0;
    const saveContainerItem = async (
        confirmMessage = `Type ${itemName} to confirm the save`,
        isActive = true,
    ) => {
        if (!category?.trim()) {
            window.alert("Category field cannot be empty");
            return;
        }
        if (!itemName?.trim()) {
            window.alert("Item Name field cannot be empty");
            return;
        }
        if (!CONTAINER_COMMON_CATEGORIES.includes(category)) {
            if (!uom?.trim()) {
                window.alert("UoM field cannot be empty");
                return;
            }
            if (!uom?.trim()) {
                window.alert("UoM field cannot be empty");
                return;
            }
            if (projectSupport.length == 0) {
                window.alert("Project Support field cannot be empty");
                return;
            }
            if (scopes.length == 0) {
                window.alert("Scopes field cannot be empty");
                return;
            }
        }
        const _item_name = window.prompt(confirmMessage);
        if (_item_name == itemName) {
            setInProgress(true);
            try {
                if (CONTAINER_COMMON_CATEGORIES.includes(category)) {
                    await graphQLClient.mutate("", SAVE_CONTAINER_COMMON_ITEM, {
                        input: {
                            category: category.trim(),
                            scope: itemName.trim(),
                            is_active: isActive,
                            user: email,
                        },
                    });
                } else {
                    await graphQLClient.mutate("upsertContainerItemV2", SAVE_CONTAINER_ITEM, {
                        input: {
                            category: category.trim(),
                            component: component?.trim() ?? null,
                            item_name: itemName.trim(),
                            project_support: projectSupport,
                            scopes: scopes,
                            uoms: [
                                {
                                    uom: uom.trim(),
                                    formula: null,
                                },
                            ],
                            is_active: isActive,
                            user: email,
                        },
                    });
                }
                TrackerUtil.event("CONTAINER_V2_ADMIN_INTERFACE", { category, _item_name, email });
                window.alert("Saved Successfully");
                onSave();
            } catch (error) {
                window.alert("Save Failed");
            } finally {
                setInProgress(false);
            }
        } else {
            window.alert("Confirmation failed, please try again");
        }
    };

    const markInactive = async () => {
        await saveContainerItem(
            `Marking item as inactive will render this item invalid for future projects. Type ${itemName} to confirm the save`,
            false,
        );
        TrackerUtil.event("CONTAINER_V2_ADMIN_INTERFACE_MARK_INACTIVE", { item_name: itemName });
    };
    const is_container_admin = useFeature(FeatureFlagConstants.CONTAINER_ADMIN).on;
    return (
        <Dialog
            open={open}
            onClose={() => {
                if (!inProgress) {
                    onClose?.();
                }
            }}
        >
            <DialogContent>
                <Stack direction={"column"} spacing={4}>
                    <Select
                        disabled={disabled}
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categoryData.map((category) => {
                            return (
                                <MenuItem value={category} key={category}>
                                    {category}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <TextField
                        disabled={disabled}
                        value={itemName}
                        label="Item Name"
                        onChange={(e) => {
                            setItemName(e.target.value);
                        }}
                    />
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) && (
                        <TextField
                            value={component}
                            label="Component"
                            onChange={(e) => {
                                setComponent(e.target.value);
                            }}
                        />
                    )}
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) && (
                        <Select
                            value={uom}
                            label="UoM"
                            onChange={(e) => {
                                setUom(e.target.value);
                            }}
                        >
                            {UOMS.map((uom) => (
                                <MenuItem value={uom} key={uom}>
                                    {uom}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) && <Divider />}
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) && (
                        <FormLabel style={{ color: "black" }}>Projects Supported</FormLabel>
                    )}
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) &&
                        PROJECT_SUPPORT.map((s) => (
                            <FormControlLabel
                                key={s}
                                label={s}
                                control={
                                    <Checkbox
                                        style={{ color: "black" }}
                                        onClick={() => {
                                            if (projectSupport.includes(s)) {
                                                setProjectSupport([
                                                    ...projectSupport.filter((t) => t != s),
                                                ]);
                                            } else {
                                                setProjectSupport([...projectSupport, s]);
                                            }
                                        }}
                                        checked={projectSupport?.includes(s)}
                                    />
                                }
                            />
                        ))}
                    <Divider />
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) && (
                        <FormLabel style={{ color: "black" }}>Scopes</FormLabel>
                    )}
                    {!CONTAINER_COMMON_CATEGORIES.includes(category) &&
                        SCOPES.map((s) => {
                            return (
                                <Stack key={s} direction={"row"}>
                                    <FormControlLabel
                                        label={s}
                                        control={
                                            <Checkbox
                                                checked={scopes.map((t) => t.scope)?.includes(s)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setScopes([
                                                            ...scopes,
                                                            {
                                                                scope: s,
                                                                work_type: SCOPE_WORK_MAP[s],
                                                            },
                                                        ]);
                                                    } else {
                                                        setScopes([
                                                            ...scopes.filter((t) => t.scope != s),
                                                        ]);
                                                    }
                                                }}
                                                style={{ color: "black" }}
                                            />
                                        }
                                    />
                                    {(s == "Install New" || s == "Add New") &&
                                        scopes.map((t) => t.scope).includes(s) && (
                                            <FormControlLabel
                                                label="Requires Install Kit"
                                                control={
                                                    <Checkbox
                                                        style={{ color: "black" }}
                                                        checked={
                                                            scopes.find((t) => t.scope == s)
                                                                ?.work_type == MATERIAL_LABOR_KIT
                                                        }
                                                        onChange={(e) => {
                                                            const newScopes = scopes.filter(
                                                                (t) => t.scope != s,
                                                            );
                                                            setScopes([
                                                                ...newScopes,
                                                                {
                                                                    scope: s,
                                                                    work_type: e.target.checked
                                                                        ? MATERIAL_LABOR_KIT
                                                                        : SCOPE_WORK_MAP[s],
                                                                },
                                                            ]);
                                                        }}
                                                    />
                                                }
                                            />
                                        )}
                                </Stack>
                            );
                        })}
                </Stack>
            </DialogContent>
            <DialogActions>
                {editObject?.is_active && (
                    <div style={{ marginRight: "auto" }}>
                        <Button onClick={markInactive} disabled={inProgress || !is_container_admin}>
                            Mark as Inactive
                        </Button>
                    </div>
                )}

                <Button
                    disabled={inProgress || !is_container_admin}
                    onClick={() => {
                        onClose?.();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    disabled={inProgress || !is_container_admin}
                    onClick={() => {
                        saveContainerItem();
                    }}
                >
                    {editObject?.is_active || Object.keys(editObject ?? {}).length == 0
                        ? "Save"
                        : "Mark as Active"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContainerAdminModal;
