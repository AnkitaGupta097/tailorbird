import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import BaseButton from "components/base-button";

const ContactTailorbirdModal = ({ open, onClose, onSend }: any) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ borderBottom: "solid 1px #f5f5f5", padding: 2, paddingX: 4 }}>
                <Typography variant="text_16_semibold">Contact Tailorbird</Typography>
            </DialogTitle>
            <DialogContent sx={{ borderBottom: "solid 1px #f5f5f5", padding: "16px !important" }}>
                <Typography>
                    Send a message to the Tailorbird team regarding your project.
                </Typography>
                <Typography>We will get back to you as soon as we are able.</Typography>
            </DialogContent>
            <DialogActions>
                <BaseButton
                    onClick={onClose}
                    label="Cancel"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="outlined"
                />
                <BaseButton
                    onClick={onSend}
                    label="Contact Now"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="contained"
                />
            </DialogActions>
        </Dialog>
    );
};

export default ContactTailorbirdModal;
