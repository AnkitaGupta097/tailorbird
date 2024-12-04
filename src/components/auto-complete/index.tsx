import {
    Autocomplete,
    CircularProgress,
    FormHelperText,
    InputLabel,
    TextField,
    Typography,
} from "@mui/material";
import React, { HTMLAttributes, JSXElementConstructor } from "react";

interface IBaseAutoComplete {
    options: any[];
    placeholder: string;
    variant: any;
    label?: string;
    error?: boolean;
    errorText?: boolean;
    helperText?: string;
    helperTextColor?: string;
    [v: string]: any;
    ref?: React.Ref<any>;
    readOnlyTextField: boolean;
    labelComponent?: React.ReactNode;
    customPaperComponent?: JSXElementConstructor<HTMLAttributes<HTMLElement>>;
}

const BaseAutoComplete = (
    {
        options,
        variant,
        placeholder,
        label,
        error,
        errorText,
        helperText,
        helperTextColor,
        readOnlyTextField,
        labelComponent,
        customPaperComponent, // for dropdown styling
        ...autoCompleteProps
    }: IBaseAutoComplete,
    ref?: any,
) => {
    return (
        <Autocomplete
            id="tags-filled"
            ref={ref}
            PaperComponent={customPaperComponent}
            renderInput={(params) => (
                <>
                    {labelComponent ? (
                        labelComponent
                    ) : (
                        <InputLabel sx={{ color: "#757575", marginBottom: "5px" }}>
                            <Typography variant="text_12_regular">{label}</Typography>
                        </InputLabel>
                    )}

                    <TextField
                        {...params}
                        variant={variant}
                        error={error}
                        helperText={errorText}
                        placeholder={placeholder}
                        size="small"
                        inputProps={{
                            ...params?.inputProps,
                            readOnly: !!readOnlyTextField,
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {autoCompleteProps.loading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                    {helperText && (
                        <FormHelperText
                            sx={{ color: helperTextColor || "#D90000", marginTop: "5px" }}
                        >
                            {helperText}
                        </FormHelperText>
                    )}
                </>
            )}
            options={options?.length > 0 ? options : []}
            {...autoCompleteProps}
        />
    );
};

export default React.forwardRef(BaseAutoComplete);
