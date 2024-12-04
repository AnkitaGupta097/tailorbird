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
import { warningDialog } from "../../constants";
import AppTheme from "../../../../styles/theme";
import warning from "../../../../assets/icons/warning.png";

interface DialogBoxProps {
    showDialog: boolean;
    cancelNavigation: any;
    confirmNavigation: any;
}

const DialogBox: React.FC<DialogBoxProps> = ({
    showDialog,
    cancelNavigation,
    confirmNavigation,
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
                                image={warning}
                                alt="warning"
                            />
                            <Typography
                                variant="heading"
                                color={AppTheme.jobStatus.error.textColor}
                            >
                                {warningDialog.WARNING}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ marginTop: "0.6rem" }}>
                            <Typography variant="text1" color={AppTheme.text.light}>
                                {warningDialog.WARNING_TEXT1}
                            </Typography>
                            <Typography variant="text1" color={AppTheme.text.light} display="block">
                                {warningDialog.WARNING_TEXT2}
                            </Typography>
                        </Grid>
                    </Grid>
                </React.Fragment>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginBottom: "1rem" }}>
                <Button
                    variant="contained"
                    onClick={cancelNavigation}
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
                    sx={{ width: "6.1rem", height: "3.1rem", textTransform: "none" }}
                    onClick={confirmNavigation}
                >
                    {warningDialog.LEAVE}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default DialogBox;
