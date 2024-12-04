import { Grid, Typography, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";

const ContractorChangeComponent = ({
    defaultValue,
    onChange,
    contractors,
}: {
    defaultValue: string;
    onChange: any;
    contractors: any;
}) => {
    const [dropdownValue, setDropDownValue] = useState("");
    useEffect(() => {
        setDropDownValue(defaultValue);
    }, [defaultValue]);

    const contractorNames = Object.entries(contractors) as Array<Array<string>>;

    return (
        <Grid container flexDirection={"column"} gap={4}>
            <Grid item>
                <Typography>Choose a new contractor for the work</Typography>
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
                    {contractorNames.map((s) => (
                        <MenuItem value={s[0]} key={s[1]}>
                            {s[1]}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    );
};

export default ContractorChangeComponent;
