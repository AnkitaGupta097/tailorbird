import React from "react";
import { Dialog, DialogContent, Stack, Paper, Typography } from "@mui/material";
import BaseButton from "components/button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { REVOKE_DIALOG } from "modules/projects/constant";

interface IRevokeDialog {
    open: boolean;
    onClose: Function;
    onRevoke: Function;
}

const RevokeDialog: React.FC<IRevokeDialog> = ({ open, onClose, onRevoke }) => {
    return (
        <>
            <Dialog open={open} onClose={() => onClose()} sx={{ padding: "1rem" }}>
                <DialogContent sx={{ padding: "2rem 4rem" }}>
                    <Stack height="100%" justifyContent="center" alignItems="center">
                        <Paper elevation={3} sx={{ padding: "1rem", marginBottom: "1rem" }}>
                            <InfoOutlinedIcon htmlColor="#004D71" fontSize="large" />
                        </Paper>
                        <Typography
                            variant={"text_18_regular"}
                            sx={{ marginBottom: "20px" }}
                            textAlign="center"
                        >
                            {REVOKE_DIALOG.DIALOG_TEXT_1}
                            <br />
                            {REVOKE_DIALOG.DIALOG_TEXT_2}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="center" gap={"15px"}>
                        <BaseButton
                            onClick={() => onClose()}
                            label={REVOKE_DIALOG.CANCEL}
                            classes="grey default"
                            variant={"text_14_regular"}
                            style={{ padding: "1rem" }}
                        />
                        <BaseButton
                            onClick={() => {
                                onRevoke();
                            }}
                            label={REVOKE_DIALOG.REVOKE}
                            style={{ padding: "1rem" }}
                            classes="primary default"
                            variant={"text_16_semibold"}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RevokeDialog;
