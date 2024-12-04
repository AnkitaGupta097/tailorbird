import React from "react";
import { Card, CardMedia, Dialog, DialogProps, styled } from "@mui/material";
import loader from "../../assets/icons/loader.gif";

const StyledDialog = styled(Dialog)<DialogProps>(() => ({
    "& .MuiPaper-root": {
        maxWidth: "100%",
    },
    "& .MuiDialog-paper": {
        background: "none",
    },
}));

const BaseLoader = () => {
    return (
        <StyledDialog open={true}>
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
        </StyledDialog>
    );
};

export default BaseLoader;
