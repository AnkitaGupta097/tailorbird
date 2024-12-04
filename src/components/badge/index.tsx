import React, { MouseEventHandler } from "react";
import { Box } from "@mui/material";
import "./badge.css";

interface IBadge {
    onClick?: MouseEventHandler;
    classes?: string;
    label: string;
}

const Badge = ({ onClick, classes, label }: IBadge) => {
    return (
        <Box className={`Badge-container ${classes}`} onClick={onClick}>
            <span>{label}</span>
        </Box>
    );
};

export default Badge;
