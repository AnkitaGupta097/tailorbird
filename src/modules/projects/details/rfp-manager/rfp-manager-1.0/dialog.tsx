import { Dialog, DialogContent, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { ReactComponent as InfoIcon } from "../../../../../assets/icons/square-info.svg";
import BaseButton from "components/button";
import { EMAIL_WARNING } from "modules/projects/constant";

interface IRfpProjectDialogProps {
    open: boolean;
    setOpen: any;
    setEmailMetadata: any;
}

const RfpProjectDialog = ({ open, setOpen, setEmailMetadata }: IRfpProjectDialogProps) => {
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
                <Grid
                    container
                    width={"34rem"}
                    minHeight={"22rem"}
                    direction="column"
                    justifyContent="center"
                >
                    <Stack height="100%" justifyContent="center" alignItems="center">
                        <InfoIcon />
                        <Typography variant={"text_18_regular"} sx={{ marginBottom: "20px" }}>
                            {EMAIL_WARNING.WARNING_TEXT}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="center" gap={"15px"}>
                        <BaseButton
                            onClick={() => {
                                setOpen(false);
                            }}
                            label={EMAIL_WARNING.CANCEL}
                            classes="grey default spaced"
                            variant={"text_14_regular"}
                        />
                        <BaseButton
                            onClick={() => {
                                setEmailMetadata({ open: true, isGenerateCopies: true });
                            }}
                            label={EMAIL_WARNING.FILL_EMAIL_METADATA}
                            classes="primary default spaced"
                            variant={"text_16_semibold"}
                        />
                    </Stack>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default RfpProjectDialog;
