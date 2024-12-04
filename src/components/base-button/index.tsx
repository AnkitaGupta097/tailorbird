import React, { MouseEventHandler } from "react";
import { Button, styled, ButtonProps, Typography } from "@mui/material";

interface IBaseButton {
    onClick: MouseEventHandler;
    classes?: string;
    label: string;
    type?: string;
    loading?: boolean;
    [v: string]: any;
}

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
    minWidth: "4.375rem",
    minHeight: "2.1rem",
    margin: "0 0.313rem",
    padding: "0.188rem 0.625rem",
    borderRadius: "0.438rem",
    textTransform: "none",
    opacity: 0.9,
    ":hover": {
        opacity: 1,
    },
    "&.active": {
        backgroundColor: theme.button.active.backgroundColor,
        color: theme.button.active.textColor,
    },
    "&.disabled": {
        backgroundColor: theme.button.disabled.backgroundColor,
        color: theme.button.disabled.textColor,
        cursor: "not-allowed",
        pointerEvents: "auto",
    },
    "&.danger": {
        backgroundColor: theme.button.danger.backgroundColor,
        color: theme.button.danger.textColor,
    },
    "&.warning": {
        backgroundColor: theme.button.warning.backgroundColor,
        color: theme.button.warning.textColor,
    },
    "&.export": {
        backgroundColor: theme.button.export.backgroundColor,
        color: theme.button.export.textColor,
    },
    "&.activeLight": {
        backgroundColor: theme.button.activeLight.backgroundColor,
        color: theme.button.activeLight.textColor,
    },
}));

const BaseButton = ({ onClick, type = "", classes, label, ...buttonProps }: IBaseButton) => {
    return (
        <StyledButton
            className={`Base-button ${classes} ${type}`}
            onClick={onClick}
            {...buttonProps}
        >
            <Typography variant="buttonDefaultText">{label}</Typography>
        </StyledButton>
    );
};

export default BaseButton;
