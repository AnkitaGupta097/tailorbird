import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    MenuItem,
    Select,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import {
    GET_ALL_CONTRACTORS,
    GET_CONTRACTOR_UNIT_SCOPE_ADMIN_VIEW_DATA,
    UPDATE_CONTRACTOR_UNIT_SCOPE_ADMIN_DATA,
} from "../constants";
import { useParams } from "react-router-dom";
import { useProductionContext } from "context/production-context";

export const EditScopes = () => {
    const { projectId } = useParams();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [rows, setRows] = useState([] as Array<any>);
    const columnNames = [
        { label: "Unit", key: "unitName" },
        { label: "Scope", key: "scope" },
        { label: "GC", key: "contractorOrgId" },
        { label: "Status", key: "status" },
    ];
    const [unitSearchString, setUnitSearchString] = useState("");
    const [scopeSearchString, setScopeSearchString] = useState("");
    const [statusSearchString, setStatusSearchString] = useState("");
    const [contractors, setContractors] = useState({} as any);
    const [showModal, setShowModal] = useState("");
    const {
        constants: { UnitScopeStatus: unitScopeItemStatuses },
    } = useProductionContext();
    useEffect(() => {
        getContractorOrgs();
        getContractorUnitScopeAdminDataView();
        // eslint-disable-next-line
    }, []);
    async function getContractorOrgs() {
        try {
            setIsLoadingData(true);
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
            setIsLoadingData(false);
        }
    }
    async function getContractorUnitScopeAdminDataView() {
        setIsLoadingData(true);
        try {
            const { getContractorUnitScopeAdminDataView: data } = await graphQLClient.query(
                "getContractorUnitScopeAdminDataView",
                GET_CONTRACTOR_UNIT_SCOPE_ADMIN_VIEW_DATA,
                {
                    projectId: projectId,
                },
            );
            setRows(data);
        } finally {
            setIsLoadingData(false);
        }
    }
    const searchedResults = rows
        .filter((row) => {
            const unitNames = unitSearchString
                .toLowerCase()
                .trim()
                .split(",")
                .filter((s) => s)
                .map((s) => s.trim());
            return unitNames.length ? unitNames.includes(row.unitName.toLowerCase()) : true;
        })
        .filter((row) => {
            const scopeNames = scopeSearchString
                .toLowerCase()
                .trim()
                .split(",")
                .filter((s) => s)
                .map((s) => s.trim());
            return scopeNames.length ? scopeNames.includes(row.scope.toLowerCase()) : true;
        })
        .filter((row) => {
            const statusName = statusSearchString
                .toLowerCase()
                .trim()
                .split(",")
                .filter((s) => s)
                .map((s) => s.trim());
            return statusName.length ? statusName.includes(row.status.toLowerCase()) : true;
        });
    const [selectedRows, setSelectedRows] = useState({} as any);
    const selectedRowLength = Object.values(selectedRows).filter((s) => s).length;
    const allSelected = searchedResults.length == selectedRowLength && searchedResults.length > 0;
    const [selectedDropDownValue, setSelectedDropDownValue] = useState("");
    const dropDownOptions =
        showModal == "contractor_org_id"
            ? Object.entries(contractors).map((s: any) => {
                  return { value: s[0], display: s[1] };
              })
            : unitScopeItemStatuses;
    useEffect(() => {
        setSelectedDropDownValue("");
    }, [showModal]);

    async function onUpdate() {
        try {
            setIsLoadingData(true);
            await graphQLClient.mutate("", UPDATE_CONTRACTOR_UNIT_SCOPE_ADMIN_DATA, {
                column: showModal,
                value: selectedDropDownValue,
                contractorUnitScopeId: Object.entries(selectedRows)
                    .filter((s) => s[1])
                    .map((s) => Number.parseInt(s[0], 10)),
            });
            await getContractorUnitScopeAdminDataView();
            setShowModal("");
        } finally {
            setIsLoadingData(false);
        }
    }
    return (
        <div>
            {isLoadingData && <LinearProgress />}
            <Grid container gap={4} flexDirection={"row"}>
                <Grid item>
                    <TextField
                        placeholder="Search By Units"
                        value={unitSearchString}
                        onChange={(e) => setUnitSearchString(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        placeholder="Search By Scope"
                        value={scopeSearchString}
                        onChange={(e) => setScopeSearchString(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        placeholder="Search By Status"
                        value={statusSearchString}
                        onChange={(e) => setStatusSearchString(e.target.value)}
                    />
                </Grid>
                <Grid marginLeft={"auto"}></Grid>
                {selectedRowLength > 0 && (
                    <>
                        <Grid>
                            <Button
                                disabled={isLoadingData}
                                onClick={() => setShowModal("contractor_org_id")}
                            >
                                Change Contractor
                            </Button>
                        </Grid>
                        <Grid onClick={() => setShowModal("status")}>
                            <Button disabled={isLoadingData}>Change Status</Button>
                        </Grid>
                    </>
                )}
            </Grid>
            <Grid>
                <Typography>You can search by comma separate values</Typography>
            </Grid>
            <Grid>
                <Typography>
                    Search Results: {searchedResults.length}, Selected Rows: {selectedRowLength}
                </Typography>
            </Grid>
            <Dialog open={!!showModal} onClose={() => setShowModal("")}>
                <DialogTitle>Edit Scopes {showModal} information</DialogTitle>
                <DialogContent>
                    <Select
                        value={selectedDropDownValue}
                        onChange={(e: any) => setSelectedDropDownValue(e.target.value)}
                    >
                        {dropDownOptions.map((option: any) => (
                            <MenuItem value={option.value} key={option.value}>
                                {option.display}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isLoadingData} onClick={onUpdate}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer style={{ maxHeight: "80vh" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={() => {
                                        const t = {} as any;
                                        searchedResults.forEach((s: any) => {
                                            t[s.contractorUnitScopeId] = !allSelected;
                                        });
                                        setSelectedRows(t);
                                    }}
                                />
                            </TableCell>
                            {columnNames.map((columnName) => (
                                <TableCell key={columnName.key}>{columnName.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {searchedResults.map((row) => (
                        <TableRow key={row.contractorUnitScopeId}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={selectedRows[row.contractorUnitScopeId]}
                                    onClick={() => {
                                        setSelectedRows({
                                            ...selectedRows,
                                            [row.contractorUnitScopeId]:
                                                !selectedRows[row.contractorUnitScopeId],
                                        });
                                    }}
                                />
                            </TableCell>
                            {columnNames.map((columnName) => (
                                <TableCell key={`${row.contractorUnitScopeId}-${columnName.key}`}>
                                    {columnName.key == "contractorOrgId"
                                        ? contractors[row[columnName.key]]
                                        : row[columnName.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </Table>
            </TableContainer>
        </div>
    );
};
