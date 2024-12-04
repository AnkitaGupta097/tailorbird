import { Box, Card, CardMedia, Typography } from "@mui/material";
import React from "react";
import CheckOutlined from "../../../../../assets/icons/check-circle-outlines.svg";

export default function ConfigSavedSuccessfully() {
    return (
        <Box
            sx={{
                display: "flex",
            }}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
            width={"50rem"}
            height={"25rem"}
            gap="2rem"
        >
            <Card
                sx={{
                    width: "2.75rem",
                    height: "2.75rem",
                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.11)",
                    borderRadius: "8px",
                }}
            >
                <CardMedia component="img" image={CheckOutlined} alt="CheckOutlined..." />
            </Card>
            <Typography variant="text_18_medium">
                SOW (Ex A) Settings have been successfully saved.
            </Typography>
        </Box>
    );
}
