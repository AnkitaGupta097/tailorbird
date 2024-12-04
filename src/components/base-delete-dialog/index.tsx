import React from "react";
import { Dialog, DialogContent, styled, Typography, DialogProps, Box } from "@mui/material";
import DeleteDialogIcon from "../../assets/icons/icon-delete-popup.svg";
import BaseButton from "../base-button";

interface IBaseDeleteDialog {
    confirmationText: string;
    noLabel: string;
    yesLabel: string;
    open: boolean;
    /* eslint-disable-next-line */
    setOpen: (v: boolean) => void;
    onNoClick: any;
    onYesClick: any;
    [v: string]: any;
}

const StyledDialog = styled(Dialog)<DialogProps>(() => ({
    "& .MuiPaper-root": {
        maxWidth: "100%",
    },
}));

const BaseDeleteDialog = ({
    open,
    setOpen,
    confirmationText,
    noLabel,
    yesLabel,
    onNoClick,
    onYesClick,
    ...others
}: IBaseDeleteDialog) => {
    const handleClose = () => setOpen(false);

    return (
        <StyledDialog open={open} onClose={handleClose} {...others}>
            <DialogContent
                className="Base-dialog-content"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "83px 99px 83px 99px",
                    overflowY: "initial",
                }}
            >
                <Box
                    style={{
                        width: "70px",
                        height: "70px",
                        marginBottom: "16px",
                        background: "#FFFFFF",
                        boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.11)",
                        borderRadius: "8px",
                    }}
                >
                    <img
                        src={DeleteDialogIcon}
                        alt="delete-icon"
                        style={{ margin: "13px 13px 13px 13px" }}
                    />
                </Box>
                <Typography variant="text1">{confirmationText}</Typography>
                <Box
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                        marginTop: "35px",
                    }}
                >
                    <BaseButton
                        label={noLabel}
                        onClick={onNoClick}
                        type="active"
                        style={{ padding: "16px 40px", height: "50px" }}
                    />
                    <BaseButton
                        label={yesLabel}
                        onClick={onYesClick}
                        type="danger"
                        style={{ padding: "16px 40px", height: "50px" }}
                    />
                </Box>
            </DialogContent>
        </StyledDialog>
    );
};

export default BaseDeleteDialog;
