import React from "react";
import { Box, Dialog, Typography } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";

interface IAddConfigItemModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    modalComponent?: any;
    onSave?: any;
}

const AddConfigItemModal = ({
    modalHandler,
    openModal,
    modalComponent,
    onSave,
}: IAddConfigItemModal) => {
    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="md"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_16_medium">Add Item </Typography>
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
            <Box p={5} minHeight="300px">
                {modalComponent &&
                    React.cloneElement(modalComponent, {
                        isModal: true,
                        modalHandler: modalHandler,
                        onSave: onSave,
                    })}
            </Box>
        </Dialog>
    );
};

export default AddConfigItemModal;
