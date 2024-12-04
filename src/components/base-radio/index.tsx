import React, { ReactNode } from "react";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    SxProps,
    styled,
    Theme,
    Typography,
    TypographyProps,
} from "@mui/material";
import "./base-radio.css";
import { map } from "lodash";

const StyledRadio = styled(Radio)(({ theme }) => ({
    color: theme.palette.secondary.main,
}));

interface IBaseRadio {
    options: any;
    header?: ReactNode;
    alignment: String;
    sx?: SxProps<Theme> | undefined;
    /* eslint-disable-next-line */
    onValChange: (v: any) => void;
    value: any;
    labelStyle?: TypographyProps;
}

const BaseRadio = ({
    header,
    options,
    alignment,
    sx,
    onValChange,
    value,
    labelStyle,
}: IBaseRadio) => {
    return (
        <FormControl>
            {header && <FormLabel id="demo-row-radio-buttons-group-label">{header}</FormLabel>}
            <RadioGroup
                row={alignment == "row" && true}
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={sx}
                value={value}
                onChange={(e) => onValChange(e.target.value)}
            >
                {map(options, (option) => {
                    return (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<StyledRadio />}
                            label={<Typography {...labelStyle}>{option.label}</Typography>}
                        />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
};

export default BaseRadio;
