import React from "react";
import { Stack, Box, Typography, Link } from "@mui/material";

const BreadCrumbs = (role: string | undefined, userID: string | undefined, projectname: string) => {
    const goToPrevious = () => {
        window.history.back();
    };
    return (
        <Stack direction="row" alignItems="center" marginTop={0}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Link
                    onClick={goToPrevious}
                    underline="always"
                    sx={{
                        alignItems: "center",
                        color: "#004D71",
                        fontFamily: "Roboto",
                        marginLeft: "0",
                    }}
                >
                    <Typography variant="text_16_regular">Go to previous</Typography>
                </Link>
            </Box>
            /
            <Link
                href="#"
                underline="hover"
                sx={{
                    color: "#757575",
                    alignItems: "center",
                }}
            >
                {projectname}
            </Link>
        </Stack>
    );
};

export default BreadCrumbs;
