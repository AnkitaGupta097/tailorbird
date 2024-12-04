import React from "react";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Box, Dialog, DialogContent, Paper, Typography } from "@mui/material";

interface IModalProps {
    open: boolean;
    onClose: () => void;
}

export default function InfoModal({ open, onClose }: IModalProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent sx={{ width: 548, height: 360 }}>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    height={"100%"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    alignContent={"space-evenly"}
                >
                    <Box
                        component={Paper}
                        display={"flex"}
                        width={70}
                        height={70}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <CheckCircleOutlineRoundedIcon
                            fontSize="large"
                            sx={{
                                color: "#57B6B2",
                                fontSize: 62,
                            }}
                        />
                    </Box>
                    <Typography align="center" variant="text_24_regular">
                        {
                            "Take off files have been successfully saved. It might take a while to complete processing of file"
                        }
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
