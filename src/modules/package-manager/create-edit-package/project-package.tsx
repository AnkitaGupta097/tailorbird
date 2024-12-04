import { useLazyQuery } from "@apollo/client";
import { LinearProgress } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    GetMaterials,
    getPackageById,
    GET_DATA_FOR_SEARCH_FILTERS,
} from "../../../stores/packages/creation/queries";
import { GET_ALL_OWNERSHIPS } from "../../../queries/b2b/project/project";
import actions from "../../../stores/actions";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import PkgSnackBar from "../common/snackbar";
import AddNewSKUModalV2 from "../create-sku-modal/add-new-sku-modal-v2";
import { ILabor, IMaterialPackage, IProjectPackage } from "../interfaces";
import SavePackageModal from "../save-package";
import BackNavigationBar from "./back-navigation-bar";
import DropdownMenus from "./dropdown-menus";
import PackageData from "./package-data";
import PackageSelection from "./package-selection";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";

const ProjectPackage: FC<IProjectPackage> = ({ projectId, packageId, projectName, isAlt }) => {
    //Redux
    const dispatch = useAppDispatch();
    //Navigation
    const navigate = useNavigate();
    //States
    const navState = useLocation().state as any;
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [addPackageOpen, setAddPackageOpen] = useState(false);
    const [isPackageEditMode, setIsPackageEditMode] = useState(false);
    const [showCopySelected, setShowCopySelected] = useState(false);
    const [showRemove, setShowRemove] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({} as any);
    const [selectedLaborFilters, setSelectedLaborFilters] = useState({} as any);
    const [materialsData, setMaterialsData] = useState([] as Array<IMaterialPackage | ILabor>);
    const [newPackageMaterialsData, setNewPackageMaterialsData] = useState(
        [] as Array<IMaterialPackage | ILabor>,
    );
    const [packageDataExpand, setPackageDataExpand] = useState(false);
    const [packageSelectionExpand, setPackageSelectionExpand] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState<Array<any>>([]);
    const [isLabor, setLabor] = useState(false);
    const [packageFilters, setPackageFilters] = useState<any>();
    const { saving, saved, error } = useAppSelector((state) => ({
        saving: state.packageManager.packages.loading,
        saved: state.packageManager.packages.saved,
        error: state.packageManager.packages.error,
    }));
    const version = "2.0";
    //Queries

    const [getPackage, { data: packageData }] = useLazyQuery(getPackageById, {
        fetchPolicy: "network-only",
        onCompleted(response) {
            const { materials, labor } = response.getPackage;
            const data = [
                ...materials.map((t: IMaterialPackage) => {
                    return { ...t, selected: false };
                }),
                ...labor.map((t: ILabor) => {
                    return { ...t, selected: false };
                }),
            ];
            setNewPackageMaterialsData(data);
            setIsPackageEditMode(true);
        },
        onError() {
            navigate("/packages", { replace: true });
        },
    });

    const [getFilters] = useLazyQuery(GET_DATA_FOR_SEARCH_FILTERS, {
        variables: {
            input: {
                ...selectedFilters,
                package: selectedFilters["package"]?.name,
                package_id: selectedFilters["package"]?.id,
                version: version,
            },
        },
        fetchPolicy: "network-only",
        onCompleted(data) {
            setPackageFilters(data);
        },
    });

    const [getAllOrganizationData, { data: allOrganizationData, loading: allOrganizationLoading }] =
        useLazyQuery(GET_ALL_OWNERSHIPS, { fetchPolicy: "network-only" });
    const [createSKUModal, setCreateSKUModal] = useState(false);
    const [getSKUs, { loading: materialsLoading }] = useLazyQuery(GetMaterials, {
        onCompleted(response) {
            const data = response?.getMaterials ?? [];
            setMaterialsData(
                data.map((d: IMaterialPackage) => {
                    return { ...d, selected: false };
                }),
            );
        },
        fetchPolicy: "network-only",
    });

    //Initilizations
    const loading = materialsLoading || allOrganizationLoading;
    const skuRows: Array<IMaterialPackage | ILabor> = materialsData;
    //Functions
    const handleCopySKUs = () => {
        let selectedItems = skuRows.filter((skuRow) => skuRow.selected);

        let keys = newPackageMaterialsData.map((item) =>
            item.material_id ? item.material_id : item.labor_id,
        );
        let newlyAddedItems = selectedItems.filter((item) =>
            item.material_id ? !keys.includes(item.material_id) : !keys.includes(item.labor_id),
        );

        selectedItems = selectedItems.map((item: IMaterialPackage | ILabor) => {
            // Deselecting them and adding a package_id if filter contains a package id
            item = item as any;
            if ("supplier_index" in item && "suppliers" in item) {
                let suppliers =
                    item?.supplier_index !== null &&
                    item?.supplier_index !== undefined &&
                    !!item?.suppliers
                        ? [item?.suppliers?.[item?.supplier_index]]
                        : null;

                return {
                    ...item,
                    selected: false,
                    rel_pacakge_id: !isLabor
                        ? selectedFilters["package"]?.id ?? null
                        : selectedLaborFilters["package"]?.id ?? null,
                    suppliers: suppliers,
                };
            } else {
                return {
                    ...item,
                    selected: false,
                    suppliers: null,
                    rel_pacakge_id: !isLabor
                        ? selectedFilters["package"]?.id ?? null
                        : selectedLaborFilters["package"]?.id ?? null,
                };
            }
        });
        setMaterialsData((prev) => [...prev.map((p) => ({ ...p, selected: false }))]);
        setNewPackageMaterialsData((prev) => [...prev, ...newlyAddedItems]);
        setUnsavedChanges([...selectedItems]);
        setPackageSelectionExpand(true);
        setPackageDataExpand(false);

        dispatch(
            actions.common.openSnack({
                variant: "success",
                message: `${newlyAddedItems.length} item(s) were successfully added to the Package.`,
            }),
        );

        //Perform these operations only when there are new items selected
        if (selectedItems.length > 0) {
            const selected = false;
            const resetSKUs = skuRows.map((skuRow) => {
                return { ...skuRow, selected };
            });
            setMaterialsData(resetSKUs);
            setShowDialog(true);
        }
    };

    const handleFilterChange = (
        key: string,
        value: string | { id: string } | { id: string; name: string },
    ) => {
        const _selectedFilters = { ...selectedFilters };
        _selectedFilters[key] = value;
        setSelectedFilters(_selectedFilters);
    };

    const toggleRadio = () => {
        setLabor((prev) => {
            setMaterialsData([]);
            setSelectedFilters({});
            setSelectedLaborFilters({});
            return !prev;
        });
    };

    const addNewSKUtoMaterials = (skus: IMaterialPackage | ILabor) => {
        const selected = false;
        if (Array.isArray(skus) && skus.length) {
            const data = skus.filter((obj) => obj !== null);
            setNewPackageMaterialsData([
                ...data.map((s) => {
                    return { ...s, selected, is_editable: true };
                }),
                ...newPackageMaterialsData,
            ]);
        } else {
            setNewPackageMaterialsData([
                ...newPackageMaterialsData,
                { ...skus, selected, is_editable: true },
            ]);
        }
        getFilters({
            variables: {
                input: {
                    version,
                },
            },
        });
    };

    const handleRemoveNewPackageItems = () => {
        const updatedList = newPackageMaterialsData.filter((sku) => sku.selected);
        setUnsavedChanges([
            ...unsavedChanges
                .filter((sku) => {
                    updatedList.forEach((i) => {
                        if (i.material_id !== sku.id || i.labor_id !== sku.id) {
                            return sku;
                        } else {
                            return null;
                        }
                    });
                })
                .filter((i) => i !== null),
        ]);
        setNewPackageMaterialsData([...newPackageMaterialsData.filter((sku) => !sku.selected)]);

        //If removed items from existing package selection list, show warning dialog
        if (updatedList.length > 0) {
            setShowDialog(true);
        }
    };

    const handleSave = () => {
        setAddPackageOpen(true);
        setUnsavedChanges([]);
    };
    function onSave() {
        setAddPackageOpen(false);
        const packageMode = isPackageEditMode ? "updated" : "created";
        dispatch(
            actions.common.openSnack({
                variant: "success",
                message: `Package ${packageMode} successfully.`,
            }),
        );
        setTimeout(() => {
            if (navState?.redirect) {
                navigate(navState?.redirect, { replace: true, state: undefined });
            } else if (packageId) {
                navigate("/packages", { replace: true });
            } else {
                navigate(-1);
            }
        }, 2000);
    }
    function onFailed(e: any) {
        setAddPackageOpen(false);
        const packageMode = isPackageEditMode ? "update" : "creation";
        let showMessage =
            e?.graphQLErrors?.[0]?.extensions?.response?.body?.error?.description?.includes(
                "HTTPConnectionPool",
            );
        if (!showMessage) {
            dispatch(
                actions.common.openSnack({
                    variant: "error",
                    message: `Package ${packageMode} failed.`,
                }),
            );
        } else {
            onSave();
        }
    }

    //Hooks
    useEffect(() => {
        if (packageId && packageId !== "") {
            getPackage({ variables: { input: packageId } });
        }
        getAllOrganizationData();
        getFilters({
            variables: {
                input: {
                    ...selectedFilters,
                    package: selectedFilters["package"]?.name,
                    package_id: selectedFilters["package"]?.id,
                    version: version,
                },
            },
        });

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAlt]);

    useEffect(() => {
        setShowCopySelected(skuRows.filter((skuRow) => skuRow.selected).length > 0);
    }, [skuRows]);

    useEffect(() => {
        setShowRemove(newPackageMaterialsData.filter((row) => row.selected).length > 0);
    }, [newPackageMaterialsData]);
    useEffect(() => {
        if (!saving && addPackageOpen && (saved || error)) {
            if (saved) onSave();
            else if (error) onFailed(error);
        }
        //eslint-disable-next-line
    }, [saving, saved, error]);
    useEffect(() => {
        getFilters({
            variables: {
                input: {
                    ...selectedFilters,
                    package: selectedFilters["package"]?.name,
                    package_id: selectedFilters["package"]?.id,
                    version: version,
                },
            },
        });
        //eslint-disable-next-line
    }, [version]);

    const [value, setValue] = React.useState("1");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div>
            <div style={{ height: "0.313rem" }}>{loading && <LinearProgress />}</div>
            <AddNewSKUModalV2
                open={createSKUModal}
                subcategoryPairs={
                    packageFilters?.getPackageCreateSearchFilters.subcategory_pair ?? []
                }
                allSubCategories={packageFilters?.getPackageCreateSearchFilters.subcategory ?? []}
                setCreateSKUModal={setCreateSKUModal}
                onSubmit={addNewSKUtoMaterials}
                setPackageSelectionExpand={setPackageSelectionExpand}
                setPackageDataExpand={setPackageDataExpand}
                version={version}
            />
            <SavePackageModal
                setShowDialog={setShowDialog}
                isEditMode={isPackageEditMode}
                isOpen={addPackageOpen}
                askOwnershipGroup={true}
                extraMetadata={{
                    version: version,
                    is_alternate: isAlt === "true" ? true : false,
                    project_id: projectId === "" ? null : projectId,
                    item_ids: newPackageMaterialsData
                        .filter((material) => !!material.material_id)
                        .map((material) => ({
                            supplier_id:
                                (material as IMaterialPackage).suppliers?.[0]?.supplier_id ?? null,
                            id: material.material_id,
                            rel_package_id: material?.rel_pacakge_id ?? null,
                        })),
                    package_id: packageId ?? undefined,
                }}
                onClose={() => {
                    setAddPackageOpen(false);
                }}
                metadata={packageId && packageId !== "" ? packageData?.getPackage ?? null : null}
                onSave={onSave}
                onFailed={onFailed}
            />
            <BackNavigationBar
                projectId={projectId}
                isAlt={isAlt}
                onClick={setCreateSKUModal}
                onRadioToggle={toggleRadio}
                radioState={isLabor}
                projectName={
                    projectName === ""
                        ? `${packageData?.getPackage?.name ?? ""} ${
                              navState?.projectId
                                  ? navState?.isAlt === true
                                      ? ": Alt Package"
                                      : ": Base Package"
                                  : ""
                          }`
                        : `${projectName} ${isAlt === "false" ? ": Base Package" : ": Alt Package"}`
                }
                handleCopySKUs={handleCopySKUs}
                handleSave={handleSave}
                handleRemove={handleRemoveNewPackageItems}
                showSave={newPackageMaterialsData.length > 0 && !showCopySelected}
                showRemove={showRemove}
                showCopySelected={showCopySelected}
            />
            <DropdownMenus
                showProgress={loading}
                {...(packageFilters?.getPackageCreateSearchFilters ?? {})}
                ownership={allOrganizationData?.getAllOrganizations ?? []}
                onChange={handleFilterChange}
                onSearch={() => {
                    getSKUs({
                        variables: {
                            input: {
                                ...selectedFilters,
                                package: selectedFilters["package"]?.name,
                                package_id: selectedFilters["package"]?.id,
                                version: version,
                            },
                        },
                    });
                    setPackageDataExpand(true);
                }}
            />
            <Box sx={{ width: "100%", typography: "body1" }}>
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
                            aria-label="package tabs"
                            style={{ display: "flex", justifyContent: "space-between" }}
                        >
                            <Tab
                                label={`Content (${newPackageMaterialsData.length})`}
                                value="1"
                                sx={{
                                    color: "#000000",
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                }}
                            />
                            <Tab
                                label={`Selection (${materialsData.length})`}
                                value="2"
                                sx={{
                                    color: "#000000",
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                }}
                            />
                        </TabList>
                    </Box>
                    <TabPanel value="1" sx={{ display: "block" }}>
                        <PackageSelection
                            showDialog={showDialog}
                            newPackageMaterialsData={newPackageMaterialsData}
                            setNewPackageMaterialsData={setNewPackageMaterialsData}
                            filtersData={packageFilters}
                            expanded={packageSelectionExpand}
                            setExpanded={setPackageSelectionExpand}
                        />
                    </TabPanel>
                    <TabPanel value="2" sx={{ display: "block" }}>
                        <PackageData
                            skuRows={skuRows}
                            setMaterialsData={setMaterialsData}
                            expanded={packageDataExpand}
                            setExpanded={setPackageDataExpand}
                            materialsData={materialsData}
                        />
                    </TabPanel>
                </TabContext>
            </Box>
            <PkgSnackBar />
        </div>
    );
};

export default React.memo(ProjectPackage);
