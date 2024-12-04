import React from "react";
import { CircularProgress, Dialog, DialogContent } from "@mui/material";

type LoadingDialogProps = {
    open: boolean;
};
const LoadingDialog = ({ open }: LoadingDialogProps) => {
    return (
        <Dialog open={open}>
            <DialogContent>
                <CircularProgress />
            </DialogContent>
        </Dialog>
    );
};

export default LoadingDialog;
