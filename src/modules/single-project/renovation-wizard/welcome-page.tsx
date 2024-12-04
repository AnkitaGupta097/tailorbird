/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ReactComponent as FlipToFront } from "assets/icons/flip-to-front.svg";
import RenoHeader from "../common/reno-header";
import appTheme from "styles/theme";
import { useAppDispatch } from "stores/hooks";
import actions from "../../../stores/actions";
import { STEPS_NAME } from "../contants";

const WelcomePage = () => {
    const dispatch = useAppDispatch();
    return (
        <Box mb={10}>
            <Box display="flex" justifyContent="space-between">
                <RenoHeader
                    title="Welcome to Renovation Wizard"
                    subTitle="Use this tool to create custom renovations planned for specific categories and actions  "
                />
                <Button
                    variant="contained"
                    component="label"
                    style={{ marginTop: "10px", height: "40px", width: "260px" }}
                    endIcon={<FlipToFront />}
                    onClick={() => dispatch(actions.singleProject.changeStep(STEPS_NAME.INVENTORY))}
                >
                    <Typography variant="text_16_medium">Create New Sub-Project</Typography>
                </Button>
            </Box>
            <Box
                mt={10}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="250px"
                sx={{
                    borderRadius: "8px",
                    border: `1px dashed ${appTheme.border.medium}`,
                }}
            >
                <FlipToFront
                    stroke={appTheme.border.medium}
                    style={{ width: "40px", height: "40px" }}
                />
                <div>
                    <Typography variant="text_14_medium" color={appTheme.border.medium}>
                        To get started, create a new Sub-Project
                    </Typography>
                </div>
            </Box>
        </Box>
    );
};

export default WelcomePage;
