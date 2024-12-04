import { Dialog, DialogActions, DialogContent, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import BaseButton from "components/button";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
interface ICombineDialog {
    open: boolean;
    items?: Record<string, any>;
    onClose?: Function;
    onSubmit?: Function;
}

const CombineDialog = ({ open, items, onClose, onSubmit }: ICombineDialog) => {
    let missingItems: Array<IItem> = Object.values(items?.missing_items ?? []);
    return (
        <Dialog open={open} sx={{ padding: "1rem" }}>
            <DialogContent sx={{ marginTop: "1rem" }}>
                <Stack direction="column" alignItems="center">
                    <Paper
                        sx={{
                            boxShadow: `0px 0px 21px 0px rgba(0, 0, 0, 0.11)`,
                            padding: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <ErrorIcon htmlColor="#D90000" fontSize="large" />
                    </Paper>
                    <Typography variant="text_18_regular" textAlign={"center"}>
                        This combination is not possible because the following selected rows are not
                        in scope on all floorplans:
                    </Typography>
                    <br />
                    <Typography variant="text_18_bold">
                        {missingItems.map(
                            (item: IItem, index: number) =>
                                `${item.subcategory} ${
                                    index === missingItems.length - 1 ? "" : ", "
                                }`,
                        )}
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginBottom: "1rem" }}>
                <BaseButton
                    onClick={(): void => onClose?.()}
                    label="Cancel"
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="grey default"
                    variant="text_16_semibold"
                />
                <BaseButton
                    onClick={(): void => onSubmit?.()}
                    labelStyles={{ paddingY: ".4rem" }}
                    classes="error default"
                    variant="text_16_semibold"
                    label="Deselect Exceptions"
                />
            </DialogActions>
        </Dialog>
    );
};

export default CombineDialog;
