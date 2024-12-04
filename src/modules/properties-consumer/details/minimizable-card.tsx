import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const MinimizableCard = ({ children, sx, prokey }: any) => {
    const [isMinimized, setIsMinimized] = useState(false);

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <Box
            key={prokey}
            sx={{
                boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                minHeight: "60vh",
                maxHeight: "60vh",
                overflowY: "auto",
                position: "relative",
                width: isMinimized ? "30px" : "auto",
                borderRadius: " 4px",
                border: "1px solid var(--v-3-colors-border-normal-disabled, #D2D5D8)",
                background: "#FFF",
                ...sx,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    cursor: "pointer",
                }}
                onClick={handleMinimize}
            >
                {!isMinimized ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
            </Box>

            {!isMinimized && (
                <Box
                    mt={2}
                    mb={"16px"}
                    p={2}
                    display="flex"
                    flexDirection={"column"}
                    alignItems="center"
                >
                    <Typography variant="text_16_medium" color={"#000"}></Typography>
                    {children}
                </Box>
            )}
        </Box>
    );
};

export default MinimizableCard;
