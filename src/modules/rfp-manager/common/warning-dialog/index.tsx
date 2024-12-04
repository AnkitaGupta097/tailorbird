import {
    Button,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import React from "react";
import { warningDialog } from "../../../package-manager/constants";
import warning from "../../../../assets/icons/filled-error-icon.svg";
import decline from "../../../../assets/icons/decline.svg";
import AppTheme from "styles/theme";

interface DialogBoxProps {
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    handleSave: () => void;
    variant: "Submit" | "Decline";
}

const DialogBox: React.FC<DialogBoxProps> = ({
    showDialog,
    setShowDialog,
    handleSave,
    variant,
}) => {
    return (
        <Dialog open={showDialog}>
            <DialogContent>
                <React.Fragment>
                    <Grid
                        container
                        sx={{
                            width: "34rem",
                            textAlign: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Grid
                            item
                            sx={{
                                margin: "1.5rem 15rem 0rem 15rem",
                                alignItems: "center",
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{
                                    width: "5.5rem",
                                    height: "5.5rem",
                                }}
                                image={variant === "Submit" ? warning : decline}
                                alt="warning"
                            />
                        </Grid>
                        <Grid item sx={{ marginTop: "0.6rem" }}>
                            <Typography variant="text1">
                                {`Are you sure you want to ${variant.toLowerCase()} this bid?`}
                            </Typography>
                            <Typography variant="text1" display="block">
                                {variant === "Submit"
                                    ? "You won't be able to edit your bid any further."
                                    : "Declining will remove your access to this project."}
                            </Typography>
                        </Grid>
                    </Grid>
                </React.Fragment>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginBottom: "1rem" }}>
                <Button
                    variant="contained"
                    onClick={() => setShowDialog(false)}
                    sx={{
                        width: "6.1rem",
                        height: "3.1rem",
                        marginRight: "0.8rem",
                        textTransform: "none",
                    }}
                    color="secondary"
                >
                    {warningDialog.CANCEL}
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        width: "6.1rem",
                        height: "3.1rem",
                        textTransform: "none",
                        ...(variant === "Decline" && {
                            backgroundColor: AppTheme.text.error,
                            "&:hover": {
                                backgroundColor: AppTheme.text.error,
                                opacity: 0.9,
                            },
                        }),
                    }}
                    onClick={handleSave}
                >
                    {"Proceed"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default DialogBox;
