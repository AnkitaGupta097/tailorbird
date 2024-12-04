import {
    FormHelperText,
    MenuItem,
    Select,
    SelectProps,
    Stack,
    SxProps,
    Theme,
    Typography,
    TypographyProps,
} from "@mui/material";
import React from "react";
import theme from "styles/theme";
import { makeStyles } from "@mui/styles";

interface IOption {
    value: string;
    label: string;
}

const useStyles = makeStyles({
    placeholderText: {
        color: theme.text.disabled,
    },
});

interface IBaseSelectProps {
    options: IOption[];
    headerLabel?: string;
    placeholder?: string;
    selectProps: SelectProps;
    containerStyle?: SxProps<Theme>;
    headerLabelTypographyProps?: TypographyProps;
    helperText?: string;
    error?: boolean;
}

const BaseSelect: React.FC<IBaseSelectProps> = ({
    options,
    headerLabel,
    placeholder,
    selectProps,
    containerStyle,
    headerLabelTypographyProps,
    helperText,
    error,
}) => {
    const classes = useStyles();

    return (
        <>
            <Stack direction="column" sx={containerStyle} justifyContent="left" alignItems="left">
                {headerLabel && (
                    <Typography {...headerLabelTypographyProps} style={{ marginBottom: "8px" }}>
                        {headerLabel}
                    </Typography>
                )}
                <Select
                    displayEmpty
                    {...selectProps}
                    classes={
                        placeholder && !selectProps.value ? { select: classes.placeholderText } : {}
                    }
                    // Need to fix this component as when placeholder is passed, it will show value in field instead of label
                    // renderValue={
                    //     placeholder
                    //         ? (selected: any) => {
                    //               if (selected === "") {
                    //                   return <em>{placeholder}</em>;
                    //               }
                    //               return undefined;
                    //           }
                    //         : undefined
                    // }
                    defaultValue={selectProps.defaultValue ?? ""}
                >
                    {placeholder && (
                        <MenuItem disabled value="">
                            {placeholder}
                        </MenuItem>
                    )}
                    {options.map((option) => {
                        return (
                            <MenuItem value={option.value} key={`${option.value}-select-item`}>
                                {option.label}
                            </MenuItem>
                        );
                    })}
                </Select>
                {helperText && (
                    <FormHelperText sx={{ color: error ? "#D90000" : "#6D7175", marginTop: "5px" }}>
                        {helperText}
                    </FormHelperText>
                )}
            </Stack>
        </>
    );
};

export default BaseSelect;
