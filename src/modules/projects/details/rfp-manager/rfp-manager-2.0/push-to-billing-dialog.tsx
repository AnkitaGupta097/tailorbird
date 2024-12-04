import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Dialog, DialogContent, Paper, Stack, Typography } from "@mui/material";
import BaseButton from "components/button";
import BaseTextField from "components/text-field";
import { SENT_TO_BILLING_DIALOG } from "modules/projects/constant";
import React, { useState, useEffect } from "react";

interface IBillingDialog {
    open: boolean;
    //eslint-disable-next-line
    setOpen: (val: boolean) => void;
    onProceed?: Function;
    contractorName: string;
}

const BillingDialog: React.FC<IBillingDialog> = ({ open, setOpen, onProceed, contractorName }) => {
    const [field, setField] = useState<string>("");

    const handleProceed = () => {
        onProceed?.();
        setOpen?.(false);
    };
    useEffect(() => {
        return () => {
            setField("");
        };
    }, []);

    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    setField("");
                }}
            >
                <DialogContent sx={{ padding: "2rem 4rem" }}>
                    <Stack height="100%" justifyContent="center" alignItems="center">
                        <Paper elevation={3} sx={{ padding: "1rem", marginBottom: "1rem" }}>
                            <WarningAmberOutlinedIcon htmlColor="#D90000" fontSize="large" />
                        </Paper>
                        <Typography
                            variant={"text_18_regular"}
                            sx={{ marginBottom: "20px" }}
                            textAlign="center"
                        >
                            {SENT_TO_BILLING_DIALOG.DIALOG_TEXT_1}
                            <br />
                            {SENT_TO_BILLING_DIALOG.DIALOG_TEXT_2}
                            <br />
                            {SENT_TO_BILLING_DIALOG.CONTRACTOR_NAME(contractorName)}
                        </Typography>
                        <BaseTextField
                            variant={"outlined"}
                            sx={{ marginBottom: "20px" }}
                            onChange={(event: any) => {
                                setField(event.target.value);
                            }}
                        />
                    </Stack>
                    <Stack direction="row" justifyContent="center" gap={"15px"}>
                        <BaseButton
                            onClick={() => {
                                setOpen(false);
                                setField("");
                            }}
                            label={SENT_TO_BILLING_DIALOG.CANCEL}
                            classes="grey default"
                            variant={"text_14_regular"}
                            style={{ padding: "1rem" }}
                        />
                        <BaseButton
                            onClick={() => {
                                handleProceed();
                                setField("");
                            }}
                            disabled={field !== contractorName}
                            label={SENT_TO_BILLING_DIALOG.PROCEED}
                            classes={
                                field === contractorName ? "primary default" : "primary disabled"
                            }
                            variant={"text_16_semibold"}
                            style={{ padding: "1rem" }}
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BillingDialog;
