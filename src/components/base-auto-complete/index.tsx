import { Autocomplete, Popper, SxProps, TextField } from "@mui/material";
import React, { ReactNode, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AppTheme from "../../styles/theme";

interface IBaseAutoComplete {
    value: any;
    options: any;
    onChangeHandler?: Function;
    name?: string;
    id?: number;
    isError?: boolean;
    variant: "filled" | "outlined" | "standard";
    helperText?: string;
    emptyValueLabel?: string | ReactNode;
    getOptionLabel?: any;
    autocompleteSx?: SxProps;
    textFieldSx?: SxProps<any>;
    Popper?: React.FC<any>;
    readOnlyTextField?: boolean;
    [x: string]: any;
}

export const CustomPopper = (props: any) => {
    return <Popper {...props} placement="bottom-start" />;
};

const BaseAutoComplete = ({
    options,
    value,
    variant,
    autocompleteSx,
    getOptionLabel,
    helperText,
    id,
    isError,
    name,
    onChangeHandler,
    textFieldSx,
    Popper,
    readOnlyTextField,
    ...rest
}: IBaseAutoComplete) => {
    const [autoCompleteVal, setAutoCompleteVal] = useState(value);
    return (
        <Autocomplete
            PopperComponent={Popper ?? CustomPopper}
            options={options}
            contentEditable={false}
            getOptionLabel={getOptionLabel ? getOptionLabel : (option: string) => option}
            id="auto-complete"
            popupIcon={<KeyboardArrowDownIcon />}
            fullWidth
            sx={{ width: "100%", ...autocompleteSx }}
            value={autoCompleteVal ?? "N/A"}
            disableClearable={true}
            autoComplete
            onChange={(e, value) => {
                setAutoCompleteVal(value);
                //@ts-ignore
                if (onChangeHandler)
                    name ? onChangeHandler(name, value, id) : onChangeHandler(value);
            }}
            {...rest}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant={variant}
                    sx={{
                        input: {
                            color: isError ? AppTheme.error.not_found : AppTheme.text.light,
                        },
                        ...textFieldSx,
                    }}
                    inputProps={{
                        ...params?.inputProps,
                        readOnly: readOnlyTextField ? true : false,
                    }}
                    error={isError ? true : false}
                    helperText={isError ? helperText : ""}
                />
            )}
        />
    );
};

export default BaseAutoComplete;
