import { FormHelperText, InputLabel, MenuItem, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import appTheme from "styles/theme";
import { StyledTextField } from "./style";

interface IBaseTextField {
    value?: any;
    label?: string | ReactNode;
    variant?: "filled" | "outlined" | "standard";
    onChange?: any;
    classes?: string;
    type?: string;
    inputProps?: object;
    helper?: string;
    isSelect?: boolean;
    placeholder?: string;
    options?: { label: any; value: any }[];
    [v: string]: any;
}

const BaseTextField = ({
    label,
    variant,
    value,
    onChange,
    classes,
    type = "",
    inputProps,
    helper,
    isSelect,
    placeholder,
    options,
    ...textFieldProps
}: IBaseTextField) => {
    return (
        <React.Fragment>
            {label && (
                <InputLabel sx={{ color: appTheme?.palette?.text?.primary, marginBottom: "5px" }}>
                    <Typography variant="text_14_medium">{label}</Typography>
                </InputLabel>
            )}
            {isSelect ? (
                <StyledTextField
                    variant={variant}
                    select
                    value={value}
                    className={`base-text-field ${classes} ${type}`}
                    onChange={onChange}
                    InputProps={inputProps}
                    type={type}
                    {...textFieldProps}
                >
                    {placeholder && (
                        <MenuItem disabled value="">
                            {placeholder}
                        </MenuItem>
                    )}
                    {options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </StyledTextField>
            ) : (
                <StyledTextField
                    variant={variant}
                    value={value}
                    placeholder={placeholder}
                    className={`base-text-field ${classes} ${type}`}
                    onChange={onChange}
                    InputProps={inputProps}
                    type={type}
                    {...textFieldProps}
                />
            )}
            {helper && (
                <FormHelperText sx={{ color: "#D90000", marginTop: "5px" }}>
                    {helper}
                </FormHelperText>
            )}
        </React.Fragment>
    );
};

export default BaseTextField;
