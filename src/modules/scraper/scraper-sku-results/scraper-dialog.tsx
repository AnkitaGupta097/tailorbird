import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import BaseDialog from "../../../components/base-dialog";
import { IScraperDialog } from "../interface";

const ScraperDialog: React.FC<IScraperDialog> = (props) => {
    return (
        <React.Fragment>
            <BaseDialog
                sx={{ borderRadius: "8px", boxShadow: "none", opacity: "unset" }}
                hideBackdrop={false}
                open={props?.open}
                content={
                    <Stack
                        direction="column"
                        spacing={4}
                        justifyContent="center"
                        alignItems="center"
                        width="22.8rem"
                        height="15rem"
                    >
                        <Box
                            sx={{
                                boxShadow: "0px 0px 21px 0px rgba(0, 0, 0, 0.11)",
                                padding: ".725rem",
                            }}
                        >
                            <svg
                                width="45"
                                height="45"
                                viewBox="0 0 45 45"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="22.4297"
                                    cy="22.5"
                                    r="21"
                                    stroke="#57B6B2"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M33.4297 15.5508L18.344 31.3002L11.4297 24.0817L13.2023 22.2311L18.344 27.586L31.6571 13.7002L33.4297 15.5508Z"
                                    fill="#57B6B2"
                                />
                            </svg>
                        </Box>
                        <Typography variant="loaderText">{props.message}</Typography>
                    </Stack>
                }
                setOpen={() => props.onClose()}
                button={undefined}
            />
        </React.Fragment>
    );
};
export default ScraperDialog;
