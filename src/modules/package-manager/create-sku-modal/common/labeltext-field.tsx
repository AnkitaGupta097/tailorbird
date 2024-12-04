import { Grid, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, FC } from "react";
import { LabelTextFieldProps } from "../../interfaces";
import AppTheme from "../../../../styles/theme";

const LabelTextField: FC<LabelTextFieldProps> = ({
    label,
    textFieldProps,
    dropDownMenu,
    variant,
    className,
    textFieldClass,
    error,
    helperText,
    required,
    disabled,
    rows,
    multiline,
    labelStyle,
}) => {
    return (
        <React.Fragment>
            <Grid container direction="column">
                <Grid item>
                    <Typography
                        style={{
                            color: AppTheme.text.medium,
                            marginBottom: "0.625rem",
                            ...labelStyle,
                        }}
                        variant={variant}
                        className={className}
                    >
                        {label}
                        {required ? "*" : null}
                    </Typography>
                </Grid>
                <Grid item>
                    {textFieldProps ? (
                        <TextField
                            disabled={disabled}
                            className={textFieldClass}
                            error={error}
                            rows={rows ?? 1}
                            multiline={multiline}
                            helperText={helperText}
                            variant="outlined"
                            {...textFieldProps}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                textFieldProps.onChange?.(e)
                            }
                        />
                    ) : (
                        dropDownMenu
                    )}
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default LabelTextField;
