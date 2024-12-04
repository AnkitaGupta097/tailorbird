import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Avatar, Typography, Stack } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const HorizontalLinearStepper: React.FC<any> = ({
    steps,
    activeStep,
    savedWithChanges,
    background,
}) => {
    return (
        <Box
            sx={{
                width: "100%",
                margin: "15px 0px",
                display: "block",
                position: "sticky",
                top: "4.9rem",
                zIndex: "10",
                background: background || "#fafafb",
                padding: "10px 0px",
            }}
        >
            <Stepper activeStep={activeStep}>
                {steps.map((item: any, index: any) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};

                    return (
                        <Stack key={index} direction={"row"} alignItems="center">
                            <Avatar
                                style={{
                                    backgroundColor:
                                        activeStep === item.value
                                            ? "#004D71"
                                            : savedWithChanges?.findIndex(
                                                  (step: any) => step === item.value,
                                              ) > -1
                                            ? "#00b879"
                                            : "#FFFFFF",
                                    width: "32px",
                                    height: "32px",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color:
                                        activeStep === item.value
                                            ? "#FFFFFF"
                                            : savedWithChanges?.findIndex(
                                                  (step: any) => step === item.value,
                                              ) > -1
                                            ? "#FFFFFF"
                                            : "#757575",
                                    border:
                                        activeStep === item.value
                                            ? "1.5px solid #004D71"
                                            : savedWithChanges?.findIndex(
                                                  (step: any) => step === item.value,
                                              ) > -1
                                            ? "1.5px solid #00b879"
                                            : "1.5px solid #757575",
                                }}
                            >
                                {savedWithChanges?.findIndex((step: any) => step === item.value) >
                                -1 ? (
                                    <DoneIcon />
                                ) : (
                                    index + 1
                                )}
                            </Avatar>
                            <Step key={item.label} {...stepProps}>
                                <Stack key={index} direction={"row"} alignItems="center">
                                    <StepLabel {...labelProps}>
                                        <Typography
                                            variant="text_14_bold"
                                            sx={{
                                                color:
                                                    activeStep === item.value
                                                        ? "#004D71"
                                                        : savedWithChanges?.findIndex(
                                                              (step: any) => step === item.value,
                                                          ) > -1
                                                        ? "#00b879"
                                                        : "#757575",
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </StepLabel>
                                    {index != steps.length - 1 && (
                                        <ArrowForwardIosRoundedIcon
                                            htmlColor="#757575"
                                            sx={{ paddingRight: "6px" }}
                                        />
                                    )}
                                </Stack>
                            </Step>
                        </Stack>
                    );
                })}
            </Stepper>
        </Box>
    );
};

export default HorizontalLinearStepper;
