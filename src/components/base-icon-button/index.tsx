import React from "react";
import { Button, ButtonProps, styled } from "@mui/material";

export interface IButton {
    icon: string;
    classes?: string;
    onClick?: any;
    [v: string]: any;
}

const StyledIconButton: any = styled(Button)<ButtonProps>(({ theme }) => ({
    padding: "0",
    minWidth: "1.25rem",
    minHeight: "1.25rem",
    background: theme.palette.primary.main,
    borderRadius: "0.313rem",
    margin: "0 0.625rem",
    opacity: 0.9,
    "&:hover": {
        background: theme.palette.primary.main,
        opacity: 1,
    },
    "&.disabled": {
        background: "#DAF3FF",
        opacity: 0.25,
    },
}));

const BaseIconButton = ({ icon, classes, onClick, ...others }: IButton) => {
    return (
        <StyledIconButton className={`${classes}`} onClick={onClick} {...others}>
            <img src={icon} alt="icon button" {...others} style={{ margin: "auto" }} />
        </StyledIconButton>
    );
};

export default BaseIconButton;
