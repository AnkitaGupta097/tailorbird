import React, { ReactNode } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import BaseButton from "components/base-button";

type ConfirmationDialogProps = {
    title: ReactNode;
    content: ReactNode;
    open: boolean;
    onCancel: any;
    onDone: any;
    cancelBtnLabel?: string;
    doneBtnLabel?: string;
};
const ConfirmationDialog = ({
    title,
    content,
    open,
    onCancel,
    onDone,
    cancelBtnLabel = "Cancel",
    doneBtnLabel = "Yes, I'm Sure",
}: ConfirmationDialogProps) => {
    return (
        <Dialog open={open}>
            <DialogTitle sx={{ borderBottom: "solid 1px #f5f5f5", padding: 2, paddingX: 4 }}>
                <Typography variant="text_16_semibold">{title}</Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    borderBottom: "solid 1px #f5f5f5",
                    padding: "16px",
                    paddingTop: "8px !important",
                    paddingBottom: 16,
                }}
            >
                <Typography variant="text_14_regular">{content}</Typography>
            </DialogContent>
            <DialogActions>
                <BaseButton
                    onClick={onCancel}
                    label={cancelBtnLabel}
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="outlined"
                />
                <BaseButton
                    onClick={onDone}
                    label={doneBtnLabel}
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="contained"
                />
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
