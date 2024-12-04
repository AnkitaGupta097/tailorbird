import React, { MouseEventHandler } from "react";
import { SxProps, Typography } from "@mui/material";
import { StyledButton } from "./style";

interface IBaseButton {
    onClick: MouseEventHandler;
    classes?: string;
    label: string;
    type?: string;
    variant?: any;
    disabled?: boolean;
    labelStyles?: SxProps;
    [v: string]: any;
}

const BaseButton = ({
    onClick,
    type = "",
    classes,
    label,
    variant,
    disabled,
    labelStyles,
    ...buttonProps
}: IBaseButton) => {
    return (
        <StyledButton
            onClick={onClick}
            className={`Base-button ${classes} ${type}`}
            {...buttonProps}
            disabled={disabled}
        >
            {buttonProps?.children}
            <Typography variant={variant} sx={labelStyles}>
                {label}
            </Typography>
        </StyledButton>
    );
};

export default BaseButton;
