import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../../../../../stores/hooks";
import { Grid, FormControl, TextField, Autocomplete, Box, Typography, styled } from "@mui/material";

interface IBaseScopeContent {
    selectedScope: any;
    setSelectedScope: any;
    disableScopeSelection: any;
}

const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${theme.border.divider}`,
        borderBottom: `3px solid ${theme.border.divider}`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.border.divider,
    },
    "& .Mui-disabled": {
        cursor: "not-allowed",
    },
}));

const AutocompleteTextField = styled(TextField)({
    fontSize: "14px",
    borderRadius: "0px",
    [`& fieldset`]: {
        borderRadius: 0,
    },
});
const defaultScope = {
    description: "",
    id: "",
    name: "",
    ownership: "",
    conatainerVersion: "1.0",
};

const BaseScopeContent = ({
    selectedScope,
    setSelectedScope,
    disableScopeSelection,
}: IBaseScopeContent) => {
    const { projectScopes } = useAppSelector((state) => ({
        projectScopes: state.budgeting.commonEntities.scopes,
    }));
    const initialScope = { ...(selectedScope || defaultScope) };
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (selectedScope?.name) setName(selectedScope?.name);
        if (selectedScope?.description) setDescription(selectedScope?.description);
    }, [selectedScope]);

    useEffect(() => {
        return () => {
            setSelectedScope(initialScope);
            setName("");
            setDescription("");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSummaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
        // let scopeCopy = { ...selectedScope };
        // scopeCopy.description = e.target.value;
        // setSelectedScope(scopeCopy);
    };

    const onScopeChange = (e: any, newVal: any) => {
        if (newVal == null || newVal == "") {
            setName("");
        }
        setSelectedScope(projectScopes.find((p: any) => p.name === newVal) || {});
    };

    const getOptions = () => {
        const options = projectScopes.map((scope: any) => scope.name);
        return options;
    };

    return (
        <Grid container className="Inventory-create-container">
            <Grid item md={12} sm={12} lg={12} xs={12} xl={12}>
                <FormControl fullWidth={true}>
                    <Typography variant="labelText" className="Inventory-create-label">
                        Summary (Optional)
                    </Typography>
                    <TextField
                        className="Inventory-create-summary-field"
                        variant="outlined"
                        value={description}
                        onChange={onSummaryChange}
                        size="small"
                    />
                </FormControl>
            </Grid>
            <Grid item marginTop={4} md={12} sm={12} lg={12} xs={12} xl={12}>
                <Typography variant="labelText" className="Inventory-create-label">
                    Select a Scope
                </Typography>
                <CustomAutocomplete
                    id="inventoryCreateScopeField"
                    className="Inventory-auto-complete-feild"
                    options={getOptions()}
                    disabled={disableScopeSelection}
                    getOptionLabel={(option: any) => option}
                    renderOption={(props, option: any) => (
                        <Box component="li" {...props}>
                            {option}
                        </Box>
                    )}
                    onChange={onScopeChange}
                    value={name}
                    renderInput={(params) => (
                        <AutocompleteTextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                            }}
                            className="variation-auto-text-feild"
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default React.memo(BaseScopeContent);
