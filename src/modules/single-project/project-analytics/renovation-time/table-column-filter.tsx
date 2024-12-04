import React, { useState } from "react";
import { map } from "lodash";
import {
    Typography,
    Autocomplete,
    TextField,
    Button as MuiButton,
    Grid,
    Divider,
} from "@mui/material";
import BaseCheckbox from "components/checkbox";

interface ITableColumnFilterProps {
    columns: { label: string; value: string }[];
    selectedColumns: string[];
    onApply: any;
}

const TableColumnFilter = (props: ITableColumnFilterProps) => {
    const { columns, selectedColumns, onApply } = props;

    const [selected, setSelected] = useState<any>(selectedColumns);

    const renderTags = (value: any) => {
        const textValue = map(value, "label").join(", ");
        return (
            <div
                style={{
                    display: "inline-block",
                    marginRight: 5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "80%",
                }}
            >
                <Typography variant="text_14_regular"> {textValue}</Typography>
            </div>
        );
    };

    const getSelectedValue = () => {
        return columns.filter((val) => selected.includes(val.value));
    };

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            disableClearable
            size="small"
            id="combo-box-demo"
            value={getSelectedValue()}
            options={columns}
            componentsProps={{
                popper: {
                    sx: {
                        padding: 0,
                        height: "240px",
                        overflowY: "hidden",
                    },
                },
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
                <>
                    <Typography variant="text_14_medium">Add to Table</Typography>
                    <TextField {...params} />
                </>
            )}
            renderTags={renderTags}
            renderOption={(props, option, state) => {
                return (
                    <>
                        <Grid container spacing={2} margin={"4px"}>
                            <Grid item>
                                <BaseCheckbox
                                    checked={selected.includes(option.value)}
                                    // eslint-disable-next-line no-unused-vars
                                    onClick={(e: any) =>
                                        setSelected((prevSelected: any) => {
                                            return prevSelected.includes(option.value)
                                                ? prevSelected.filter(
                                                      (v: any) => v !== option.value,
                                                  )
                                                : [...prevSelected, option.value];
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="text_14_regular">{option.label}</Typography>
                            </Grid>
                        </Grid>
                        {state.index < columns.length - 1 && <Divider />}

                        {state.index === columns.length - 1 && (
                            <MuiButton
                                sx={{ marginTop: "4px" }}
                                fullWidth
                                variant="contained"
                                onClick={() => onApply(selected)}
                            >
                                Apply ({selected.length})
                            </MuiButton>
                        )}
                    </>
                );
            }}
        />
    );
};

export default TableColumnFilter;
