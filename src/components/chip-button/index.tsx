import React, { MouseEventHandler } from "react";
import { Typography } from "@mui/material";
import { StyledChipButton } from "./style";
import { styled } from "@mui/material/styles";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

interface IBaseChipButton {
    onClick?: MouseEventHandler;
    classes?: string;
    label: string;
    type?: string;
    variant?: any;
    tooltip?: any;
    labelStyles?: any;
    [v: string]: any;
}
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

const BaseChipButton = ({
    onClick,
    type = "",
    classes,
    label,
    variant,
    tooltip,
    labelStyles,
    ...chipButtonProps
}: IBaseChipButton) => {
    return (
        <StyledChipButton
            onClick={onClick}
            className={`Base-chip-button ${classes} ${type}`}
            {...chipButtonProps}
        >
            {chipButtonProps?.children}
            <BootstrapTooltip title={tooltip}>
                <Typography variant={variant} {...labelStyles}>
                    {label}
                </Typography>
            </BootstrapTooltip>
        </StyledChipButton>
    );
};

export default BaseChipButton;
