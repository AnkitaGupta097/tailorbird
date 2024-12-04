import React from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const ArrowTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#757575",
        color: "#A6A6A6",
        textAlign: "center",
        textAlignVertical: "center",
        fontFamily: "IBM Plex Sans",
        fontSize: "12px",
        fontWeight: "500",
        padding: "4px 10px 4px 10px",
    },
}));

export default ArrowTooltip;
