import React from "react";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import loader from "../../../../../assets/icons/loader.gif";

export default function SavingConfig() {
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
                <CardMedia component="img" image={loader} alt="loading..." />
            </Card>
            <Typography variant="text_18_medium">SOW (Ex A) Settings are getting saved</Typography>
        </Box>
    );
}
