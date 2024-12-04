import { StyledToggle } from "./style";
import React from "react";
import {
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Typography,
    SxProps,
} from "@mui/material";

interface IBaseToggle {
    label?: string;
    value?: string;
    // checked prop should be used instead of value, adding it as new prop as of now
    checked?: boolean;
    onClick?: any;
    disabled?: boolean;
    //eslint-disable-next-line
    onChange?: (value: boolean) => void;
    toggleValue?: boolean;
    formControlStyle?: SxProps;
    [v: string]: any;
}
const BaseToggle = ({
    label,
    value,
    onChange,
    onClick,
    disabled,
    toggleValue,
    checked,
    formControlStyle,
}: IBaseToggle) => {
    return (
        <FormControl component="fieldset" variant="standard" sx={{ ...formControlStyle }}>
            <FormLabel component="legend" sx={{ marginBottom: "5px" }}>
                <Typography variant="text_12_regular" color="#757575">
                    {label}
                </Typography>
            </FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={
                        <StyledToggle
                            checked={checked}
                            disabled={disabled}
                            value={toggleValue}
                            onClick={onClick}
                            onChange={(e) => {
                                onChange && onChange(e.target.checked);
                            }}
                        />
                    }
                    label={
                        <Typography variant="text_14_regular" color="#232323">
                            {value}
                        </Typography>
                    }
                />
            </FormGroup>
        </FormControl>
    );
};

export default BaseToggle;
