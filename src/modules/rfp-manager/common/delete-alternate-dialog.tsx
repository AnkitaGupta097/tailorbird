import { Dialog, DialogActions, DialogContent, Stack, TextField, Typography } from "@mui/material";
import BaseButton from "components/button";
import React from "react";
import CriticalIcon from "../../../assets/icons/critical-icon.svg";

interface IDeleteAlternateDialog {
    open: boolean;
    onClose?: Function;
    onRemove?: Function;
}

const DeleteAlternateDialog: React.FC<IDeleteAlternateDialog> = ({
    open = false,
    onClose,
    onRemove,
}) => {
    const [text, setText] = React.useState<string>("");
    React.useEffect(() => {
        if (!open) {
            setText("");
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={() => onClose?.()}
            sx={{
                margin: "1rem 2rem",
            }}
        >
            <DialogContent>
                <Stack direction="column" gap={2} alignItems="center">
                    <img src={CriticalIcon} alt="warning" width="150px" height="150px" />
                    <Typography variant="text_18_regular">
                        Are you sure you want to remove this alternate item?
                    </Typography>
                    <Typography variant="text_18_regular">
                        It will get removed from all floorplans, and added price will be lost
                    </Typography>
                    <Typography variant="text_18_regular">
                        Type&nbsp;
                        <span
                            style={{
                                fontWeight: "500",
                            }}
                        >
                            &quot;REMOVE&quot;
                        </span>
                        &nbsp; to confirm
                    </Typography>
                    <TextField
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                        }}
                        variant="outlined"
                    />
                </Stack>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "center",
                    "&.MuiDialogActions-root": {
                        marginBottom: "2rem",
                    },
                }}
            >
                <BaseButton
                    onClick={() => onClose?.()}
                    label="Cancel"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="text_16_semibold"
                />
                <BaseButton
                    onClick={(): void => {
                        onRemove?.();
                    }}
                    disabled={text !== "REMOVE"}
                    labelStyles={{ paddingY: ".4rem" }}
                    classes={`error ${text !== "REMOVE" ? "disabled" : "default"}`}
                    variant="text_16_semibold"
                    label="Remove"
                />
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAlternateDialog;
