import React from "react";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { includes } from "lodash";

interface IColumnList {
    /* eslint-disable-next-line */
    columnName: String;
    options: [string];
    onSelection: any;
    selectedColumn: [string];
    index: number;
    value: String;
}

const autocompleteSx = {
    ".MuiInputBase-input": {
        height: "0.7rem",
        marginRight: "0.5rem",
    },
    marginTop: ".7rem",
};
const ColumnList = ({
    columnName,
    options,
    onSelection,
    selectedColumn,
    index,
    value,
}: IColumnList) => {
    return (
        <Box mb={6}>
            <Typography variant="text_16_semibold">{columnName}</Typography>
            <Autocomplete
                sx={autocompleteSx}
                onChange={(event, newValue) => {
                    onSelection(newValue, index);
                }}
                fullWidth
                freeSolo
                value={value == "" ? "" : value}
                clearOnBlur
                selectOnFocus
                options={options}
                getOptionDisabled={(option) => includes(selectedColumn, option)}
                popupIcon={<KeyboardArrowDownIcon />}
                forcePopupIcon
                renderInput={(params) => (
                    <TextField {...params} placeholder="Select source column" variant="standard" />
                )}
            />
        </Box>
    );
};

export default ColumnList;
