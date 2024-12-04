import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { graphQLClient } from "utils/gql-client";
import { EDIT_PRODUCTION_DATA, GET_ADMIN_DATA_VIEW, GET_ALL_CONTRACTORS } from "../constants";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from "@mui/material";
import { GET_FLOORPLANS } from "stores/projects/properties/details/index/index-queries";
import FloorPlanPrice from "./floorplancell";
import GeneralColumnCell from "./general-column-cell";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";
import ImportFromRFPDialog from "./import-from-rfp-dialog";
import BaseCheckbox from "components/checkbox";
import ContractorChangeComponent from "./contractor_change_component";

const ProductionAdmin = () => {
    const { projectId } = useParams();
    const [columnNames, setColumnNames] = useState([] as Array<any>);
    let [selectedItemIds, setSelectedItemIds] = useState(new Set<any>());
    const [isPullingData, setIsPullingData] = useState(false);
    const [isImportDialog, setIsImportDialog] = useState(false);
    const [multiplebuttonsview, setMultiplebuttonsview] = useState(false);
    const [tableRows, setTableRows] = useState([] as Array<any>);
    const [selections, setSelections] = useState([] as Array<any>);
    const [contractors, setContractors] = useState({} as any);
    const isTBP2DataAdmin = useFeature(FeatureFlagConstants.TBP_2_DATA_ADMIN).on || true;
    const constantColumnNames = [
        { key: "customerCategory", label: "Customer category" },
        { key: "customerCostCode", label: "Customer cost code" },
        { key: "category", label: "Category" },
        { key: "description", label: "Description" },
        { key: "item", label: "Item" },
        { key: "manufacturer", label: "Manufacturer" },
        { key: "modelNumber", label: "Model number" },
        { key: "scope", label: "Scope" },
        { key: "workType", label: "Work type" },
        { key: "contractorOrgId", label: "Contractor" },
    ] as Array<any>;

    async function getContractorOrgs() {
        try {
            setIsPullingData(true);
            const { getAllOrganizations } = await graphQLClient.query(
                "getAllOrganizations",
                GET_ALL_CONTRACTORS,
            );
            const _contractors = {} as any;
            getAllOrganizations.forEach((organization: any) => {
                _contractors[organization.id] = organization.name;
            });
            setContractors(_contractors);
        } finally {
            setIsPullingData(false);
        }
    }

    async function getAdminDataView() {
        try {
            setIsPullingData(true);
            const { getAdminDataView } = await graphQLClient.query(
                "getAdminDataView",
                GET_ADMIN_DATA_VIEW,
                { projectId },
            );
            const { getProjectFloorPlans } = await graphQLClient.query(
                "getProjectFloorPlans",
                GET_FLOORPLANS,
                { projectId },
            );
            const columnNames = constantColumnNames;
            getProjectFloorPlans.forEach((floorPlan: any) => {
                columnNames.push({
                    key: `${floorPlan.name}`,
                    label: `${floorPlan.name}`,
                    type: "floorplan",
                });
            });
            setColumnNames([...columnNames]);
            setTableRows(
                getAdminDataView.map((s: any) => {
                    return {
                        ...s,
                        aggregatedData: new Map(
                            s.aggregatedData.map((item: any) => [item.floorPlanName, item]),
                        ),
                    };
                }),
            );
        } finally {
            setIsPullingData(false);
        }
    }
    useEffect(() => {
        if (isTBP2DataAdmin) {
            getAdminDataView();
            getContractorOrgs();
        }
        // eslint-disable-next-line
    }, [projectId, isTBP2DataAdmin, isImportDialog]);

    useEffect(() => {
        if (selections.length > 0) {
            setMultiplebuttonsview(true);
            const tSelectedItemIds = new Set(
                tableRows
                    .filter((row) => {
                        return selections.includes(row.rowIndex) ?? false;
                    })
                    .map((row) => row.unitScopeItemIdList)
                    .reduce((pValue, ilist) => pValue.concat(ilist), []),
            );
            setSelectedItemIds(tSelectedItemIds);
        } else {
            setSelectedItemIds(new Set());
            setMultiplebuttonsview(false);
        }
        // eslint-disable-next-line
    }, [selections]);

    if (!isTBP2DataAdmin) {
        return <p>Access Denied</p>;
    }
    return (
        <div>
            {!isPullingData && tableRows.length == 0 && (
                <Button
                    variant="contained"
                    style={{ height: "100%" }}
                    onClick={() => {
                        setIsImportDialog(true);
                    }}
                >
                    Load Project Data
                </Button>
            )}
            <ImportFromRFPDialog
                projectId={projectId}
                onClose={() => {
                    setIsImportDialog(false);
                }}
                open={isImportDialog}
            />
            {multiplebuttonsview && (
                <Multiplebuttonsview
                    key={selectedItemIds.size}
                    contractors={contractors}
                    onEdit={getAdminDataView}
                    selectedItemIds={selectedItemIds}
                />
            )}
            <div style={{ height: 4 }}>{isPullingData && <LinearProgress />}</div>
            <TableContainer style={{ maxHeight: "80vh" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <BaseCheckbox
                                    size="small"
                                    sx={{ marginRight: "8px" }}
                                    checked={selections.length == tableRows.length}
                                    indeterminate={selections.length > 0}
                                    onClick={() => {
                                        if (selections.length > 0) {
                                            setSelections(new Array<any>());
                                        } else {
                                            const sels: Array<any> = [];
                                            tableRows.forEach((row) => {
                                                sels.push(row.rowIndex);
                                            });
                                            setSelections(sels);
                                        }
                                    }}
                                />
                            </TableCell>
                            {columnNames.map((columnName) => (
                                <TableCell key={columnName.key}>{columnName.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tableRows.map((row) => (
                            <TableRow key={row.rowIndex}>
                                <TableCell>
                                    <BaseCheckbox
                                        checked={selections.includes(row.rowIndex)}
                                        onClick={() => {
                                            console.log(row);
                                            let tselections = new Array();
                                            tselections = tselections.concat(selections);
                                            console.log(tselections);
                                            const index = tselections.indexOf(row.rowIndex);
                                            if (index >= 0) {
                                                tselections.splice(index, 1);
                                            } else {
                                                tselections.push(row.rowIndex);
                                            }
                                            setSelections(tselections);
                                        }}
                                    />
                                </TableCell>
                                {columnNames.map((column) => (
                                    <TableCell key={`${row.rowIndex}-${column.key}`}>
                                        {column.type == "floorplan" ? (
                                            <FloorPlanPrice
                                                row={row}
                                                column={column}
                                                onFPLevelDataEdit={() => {
                                                    getAdminDataView();
                                                }}
                                            />
                                        ) : (
                                            <GeneralColumnCell
                                                row={row}
                                                column={column}
                                                contractors={contractors}
                                                onEdit={() => {
                                                    getAdminDataView();
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            {columnNames.map((columnName) => (
                                <TableCell key={columnName.key}>{columnName.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};

const Multiplebuttonsview = ({
    contractors,
    onEdit,
    selectedItemIds,
}: {
    contractors: any;
    onEdit: any;
    selectedItemIds: any;
}) => {
    const [showContractorChangeView, setshowContractorChangeView] = useState(false);
    const [savingChanges, setsavingChanges] = useState(false);
    let contractorOrgId = "";
    async function updateProductionData() {
        setsavingChanges(true);
        try {
            const payload = {
                column: "contractorOrgId",
                data: `${contractorOrgId}`,
                operation: "update",
                unitScopeItemIds: [...selectedItemIds],
            };
            await graphQLClient.mutate("", EDIT_PRODUCTION_DATA, payload);
            onEdit();
        } finally {
            setsavingChanges(false);
        }
    }
    return showContractorChangeView ? (
        <Dialog
            open={true}
            onClose={() => {
                setshowContractorChangeView(false);
                setsavingChanges(false);
            }}
        >
            <DialogContent>
                <ContractorChangeComponent
                    contractors={contractors}
                    defaultValue=""
                    onChange={(val: any) => {
                        contractorOrgId = val;
                        console.log(contractorOrgId, "onChange");
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={savingChanges} onClick={updateProductionData}>
                    {savingChanges ? "Saving" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    ) : (
        <Button
            variant="contained"
            style={{ height: "100%" }}
            onClick={() => {
                console.log("in clicked");
                setshowContractorChangeView(true);
            }}
        >
            Update Contractor
        </Button>
    );
};

export default ProductionAdmin;
