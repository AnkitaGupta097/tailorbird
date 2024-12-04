import { TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import AppTheme from "styles/theme";

interface IDatePickerProps {
    value?: any;
    onChange: any;
    label?: string;
    errorText?: string;
    error?: boolean;
    disabled?: boolean;
}

const DatePicker = (props: IDatePickerProps) => {
    const { value, onChange, label, errorText, error, disabled } = props;
    const [isOpen, setIsOpen] = useState(false);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiDatePicker
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
                disabled={disabled}
                value={value}
                onChange={(value) => {
                    onChange(value);
                    setIsOpen(false);
                }}
                renderInput={(params) => (
                    <>
                        <div style={{ marginBottom: "4px" }}>
                            <Typography
                                color={disabled ? AppTheme.text.medium : "#202223"}
                                variant={"text_14_medium"}
                            >
                                {label}
                            </Typography>
                        </div>
                        <TextField
                            fullWidth
                            {...params}
                            disabled={disabled}
                            value={value}
                            variant={"outlined"}
                            size="small"
                            helperText={errorText}
                            error={error}
                            onKeyDown={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                setIsOpen(true);
                            }}
                            onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                setIsOpen(true);
                            }}
                        />
                    </>
                )}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;
