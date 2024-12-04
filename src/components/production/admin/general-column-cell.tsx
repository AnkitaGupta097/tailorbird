import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import { EDIT_PRODUCTION_DATA, GET_UNIT_SCOPE_NAMES } from "../constants";
import { useParams } from "react-router-dom";
import ContractorChangeComponent from "./contractor_change_component";

type IGeneralColumnCell = React.ComponentPropsWithRef<"div"> & {
    row: any;
    column: any;
    onEdit: any;
    contractors: any;
};

const ScopeChangeComponent = ({
    defaultValue,
    onChange,
}: {
    defaultValue: string;
    onChange: any;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { projectId } = useParams();
    const [scopes, setScopes] = useState([] as Array<string>);
    const [dropdownValue, setDropDownValue] = useState("");
    useEffect(() => {
        setDropDownValue(defaultValue);
    }, [defaultValue]);
    useEffect(() => {
        getScopeNames();
        // eslint-disable-next-line
    }, [projectId]);
    async function getScopeNames() {
        try {
            setIsLoading(true);
            const { getUnitScopeNames } = await graphQLClient.query(
                "getUnitScopeNames",
                GET_UNIT_SCOPE_NAMES,
                { projectId },
            );
            setScopes(getUnitScopeNames);
        } finally {
            setIsLoading(false);
        }
    }
    if (isLoading) {
        return <CircularProgress />;
    }
    return (
        <Grid container flexDirection={"column"} gap={4}>
            <Grid item>
                <Typography>Select an existing customer scope or rename the scope</Typography>
            </Grid>
            <Grid item>
                <Select
                    fullWidth
                    value={dropdownValue}
                    onChange={(e) => {
                        setDropDownValue(e.target.value);
                        onChange(e.target.value);
                    }}
                >
                    {scopes.map((s) => (
                        <MenuItem value={s} key={s}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>

            <Grid item>
                <TextField
                    placeholder="Rename Customer Scope"
                    fullWidth
                    onChange={(e) => onChange(e.target.value)}
                />
            </Grid>
        </Grid>
    );
};

const GeneralColumnCell = ({ row, column, onEdit, contractors }: IGeneralColumnCell) => {
    const [editMode, setEditMode] = useState(false);
    useEffect(() => {
        editMode ? setEditValue(row[column.key] || "Not Set") : setEditValue("");
        // eslint-disable-next-line
    }, [editMode]);
    const [editValue, setEditValue] = useState("");
    const [updating, setUpdating] = useState(false);
    async function updateProductionData() {
        setUpdating(true);
        try {
            const payload = {
                column: column.key,
                data: `${editValue}`,
                operation: "update",
                unitScopeItemIds: row.unitScopeItemIdList,
            };
            await graphQLClient.mutate("", EDIT_PRODUCTION_DATA, payload);
            onEdit();
        } finally {
            setUpdating(false);
        }
    }
    let cellValue = row[column.key];
    if (column.key == "contractorOrgId") {
        cellValue = contractors[row[column.key]];
    }
    cellValue = cellValue || "Not Set";
    return (
        <>
            <Dialog open={editMode} onClose={() => setEditMode(false)}>
                <DialogTitle>Edit {column.label}</DialogTitle>
                <DialogContent>
                    {column.key == "customerCategory" ? (
                        <ScopeChangeComponent
                            defaultValue={row[column.key]}
                            onChange={setEditValue}
                        />
                    ) : column.key == "contractorOrgId" ? (
                        <ContractorChangeComponent
                            defaultValue={
                                Object.entries(contractors).find((s) => s[1] == cellValue)?.[0] ??
                                ""
                            }
                            contractors={contractors}
                            onChange={setEditValue}
                        />
                    ) : (
                        <TextField
                            fullWidth
                            disabled={updating}
                            placeholder={`Edit ${column.label}`}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button disabled={updating} onClick={updateProductionData}>
                        {updating ? "Editing" : "Edit"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* eslint-disable-next-line */}
            <a href="#" style={{ color: "blue" }} onClick={() => setEditMode(true)}>
                {cellValue}
            </a>
        </>
    );
};

export default GeneralColumnCell;
