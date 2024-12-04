import { Grid, Typography } from "@mui/material";
import React from "react";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";

interface IBackNavigationBar {
    projectName: string;
}

const BackNavigationBar = ({ projectName }: IBackNavigationBar) => {
    const navigate = useNavigate();
    return (
        <Grid container alignItems={"center"} gap={"0.6rem"} onClick={() => navigate(-1)}>
            <Grid item sx={{ marginTop: "6px" }}>
                <ArrowBackIosRoundedIcon fontSize="small" />
            </Grid>
            <Grid item>
                <Typography
                    variant={"text_24_medium"}
                    sx={{
                        color: "#000000",
                    }}
                >
                    {projectName}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default BackNavigationBar;
