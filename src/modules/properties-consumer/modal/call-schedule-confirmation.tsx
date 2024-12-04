/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Dialog, Typography, Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";

interface ICallScheduleConfirmation {
    /* eslint-disable-next-line */
    setOpenCallScheduleConfirmation: (val: boolean) => void;
    openCallScheduleConfirmation: boolean;
    title: any;
}

const CallScheduleConfirmation = ({
    setOpenCallScheduleConfirmation,
    openCallScheduleConfirmation,
    title,
}: ICallScheduleConfirmation) => {
    return (
        <Dialog
            open={openCallScheduleConfirmation}
            fullWidth={true}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => setOpenCallScheduleConfirmation(false)}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">{title}</Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        setOpenCallScheduleConfirmation(false);
                    }}
                />
            </Box>
            <Box p={6} minHeight="150px">
                <Typography variant="text_16_regular">
                    An email has been sent to our team. We will get back to you shortly
                </Typography>
            </Box>
            <Box>
                <Box pb={5} px={6} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        style={{ height: "40px" }}
                        onClick={() => setOpenCallScheduleConfirmation(false)}
                    >
                        <Typography variant="text_16_semibold"> Close Window</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default CallScheduleConfirmation;
