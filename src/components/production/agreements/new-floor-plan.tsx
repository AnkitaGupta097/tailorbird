import React, { useState } from "react";
import { Autocomplete, Paper, Box, Checkbox, FormControlLabel, Divider } from "@mui/material";

// interface AutocompleteWithSelectAllProps<T> extends AutocompleteProps<T, true, any, false, any> {
//     //eslint-disable-next-line
//     setValue: (value: T[]) => void;
//     checkboxId?: string;
// }

/**
 * Requeirementes:
 * - multiple
 * - controlled value
 *
 * Prop PaperComponent is overriden
 *
 * aditional props:
 *  - setValue - setter for controlled Autocomplete value
 *  - checkboxId - optional id for checkbox
 */
const AutocompleteWithSelectAllMixin = (props: any) => {
    const { setValue, onChange, ...autocompleteProps } = props;
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const handleSelectAll = () => {
        setSelectAll((prev) => {
            if (!prev) setValue([...props.options]);
            else setValue([]);
            return !prev;
        });
    };

    return (
        <Autocomplete
            {...autocompleteProps}
            onChange={(_e, value: any, reason, details) => {
                if (reason === "clear" || reason === "removeOption") setSelectAll(false);
                if (reason === "selectOption" && value.length === props.options.length)
                    setSelectAll(true);
                setValue(value);

                if (onChange !== undefined) onChange(_e, value, reason, details);
            }}
            PaperComponent={(paperProps) => {
                const { children, ...restPaperProps } = paperProps;
                return (
                    <Paper {...restPaperProps}>
                        <Box
                            onMouseDown={(e) => e.preventDefault()} // prevent blur
                            pl={1.5}
                            py={0.5}
                        >
                            <FormControlLabel
                                label="Select all"
                                onClick={(e) => {
                                    e.preventDefault(); // prevent blur
                                    handleSelectAll();
                                }}
                                control={
                                    <Checkbox
                                        id={
                                            props.checkboxId ??
                                            `select-all-checkbox-for-autocomplete-${props.id}}`
                                        }
                                        checked={selectAll}
                                    />
                                }
                            />
                        </Box>
                        <Divider />
                        {children}
                    </Paper>
                );
            }}
        />
    );
};

export default AutocompleteWithSelectAllMixin;
