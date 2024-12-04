import { Grid, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BaseButton from "components/button";

interface SetupCompletionProps {
    activeStep: any;
    setActiveStep: any;
}
const SetupCompletion = ({ activeStep, setActiveStep }: SetupCompletionProps) => {
    return (
        <Grid
            container
            direction={"column"}
            alignItems="center"
            justifyContent={"center"}
            gap="10px"
            sx={{
                border: "1px solid #BCBCBB",
                borderRadius: "5px",
                padding: "68px 512px",
                background: "#FFFFFF",
            }}
        >
            <Grid item></Grid>
            <Grid item>
                <CheckCircleIcon htmlColor="#00B779" />
            </Grid>
            <Grid item>
                <Typography variant="text_18_regular" color="#00B779">
                    {"Bid setup complete."}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="text_18_regular" color="#00B779">
                    {" You can now perform Bidbook Actions from the Contractors tab."}
                </Typography>
            </Grid>
            <Grid item>
                <BaseButton
                    classes="primary default"
                    onClick={() => {
                        setActiveStep(activeStep - 1);
                    }}
                    label={"Edit bid information"}
                />
            </Grid>
        </Grid>
    );
};

export default SetupCompletion;
