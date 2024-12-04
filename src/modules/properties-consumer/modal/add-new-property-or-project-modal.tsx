import React from "react";
import { Box, Dialog, Typography, Button } from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
    dialog: {
        transition: "transform 0.3s ease-in-out", // Customize the transition here
        "& .MuiDialog-paper": {
            transformOrigin: "center center",
            transform: "scale(1)", // Initial scale (no zoom)
            transition: "transform 0.3s ease-in-out", // Transition for zoom effect
        },
    },
}));

interface ICreateNewItemModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    confirmSchedule: any;
    title?: string;
}

const AddNewPropertyModal = ({
    modalHandler,
    openModal,
    confirmSchedule,
    title,
}: ICreateNewItemModal) => {
    const classes = useStyles();
    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
            className={classes.dialog}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">{title || "Add New Property"}</Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box p={6} minHeight="150px">
                <Typography variant="text_16_regular">
                    Schedule a call with our team to add a new property.
                </Typography>
            </Box>
            <Box>
                <Box pb={5} px={6} display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        style={{ height: "40px" }}
                        onClick={() => modalHandler(false)}
                    >
                        <Typography variant="text_16_semibold"> Cancel</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        style={{ marginLeft: "10px", height: "40px" }}
                        onClick={confirmSchedule}
                    >
                        <Typography variant="text_16_semibold"> Schedule Now</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default AddNewPropertyModal;
