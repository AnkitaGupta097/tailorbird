import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import BaseAutoComplete from "components/auto-complete";
import React, { FC, useEffect, useState } from "react";
import BaseButton from "components/button";
import { IUOM, UOMs, getUOMByLable } from "./constants";
import { IItem } from "stores/bidding-portal/bidding-portal-models";
import AppTheme from "styles/theme";

interface IChangeUOMDialogItems {
    open: boolean;
    /* eslint-disable-next-line */
    onSave: (selectedUOM: string) => void;
    onCancel: () => void;
    item?: IItem;
}

const customPaperComponent = (props: any) => (
    <Paper elevation={10} sx={{ borderRadius: "8px" }} {...props} />
);

const ChangeUOMDialog: FC<IChangeUOMDialogItems> = ({ open, onSave, onCancel, item }) => {
    const [selectedUOM, setSelectedUOM] = useState<IUOM>(
        UOMs[item?.specific_uom ? item?.specific_uom : item?.uom ?? ""] ?? "",
    );
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [UOMOptions, setUOMOptions] = useState<IUOM[]>([]);

    useEffect(() => {
        if (item?.specific_uom || item?.uom) {
            const currentUOM = item?.specific_uom ? item?.specific_uom : item?.uom;
            setSelectedUOM(UOMs[currentUOM]);
            setUOMOptions(
                ["count", "percentage"].includes(currentUOM.toLowerCase())
                    ? [UOMs.count, UOMs.percentage]
                    : Object.values(UOMs).filter(({ value }) =>
                          value.startsWith(currentUOM.slice(0, 2)),
                      ),
            );
        }
        return () => setShowWarning(false);
    }, [item]);

    return (
        <Dialog
            open={open}
            PaperProps={{ style: { borderRadius: "8px", width: "400px", height: "auto" } }}
        >
            <DialogTitle>
                <Typography variant="text_18_semibold">{`Unit of Measure for ${item?.subcategory}`}</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" gap={2} mt=".5rem">
                    <Typography variant="text_14_regular">Unit of Measure</Typography>
                    <BaseAutoComplete
                        options={UOMOptions.map(({ label }) => label)}
                        value={
                            selectedUOM?.label
                                ? selectedUOM?.label
                                : getUOMByLable(
                                      item?.specific_uom ? item?.specific_uom : item?.uom ?? "",
                                  ).label
                        }
                        variant="outlined"
                        disableClearable
                        onChange={(_: any, selectedVal: string) => {
                            setShowWarning(true);
                            setSelectedUOM(getUOMByLable(selectedVal));
                        }}
                        customPaperComponent={customPaperComponent}
                    />
                    {["count", "percentage"].includes(selectedUOM?.value?.toLowerCase()) &&
                        showWarning && (
                            <Stack direction="column" gap={2} marginTop="1rem">
                                <Typography variant="text_14_regular" color={AppTheme.text.medium}>
                                    Note: The percentage point gets multiplied by the totals in all
                                    categories other than General Conditions, Profit & Overhead, and
                                    Tax.
                                </Typography>
                                <Typography variant="text_14_bold" color={AppTheme.text.error}>
                                    {`Warning: Once this item UoM changes to "${selectedUOM.label}", Previous value will be cleared.`}
                                </Typography>
                            </Stack>
                        )}
                </Stack>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "left",
                    margin: "auto auto 1rem 1rem",
                }}
            >
                <BaseButton label="Cancel" classes="default grey" onClick={onCancel} />
                <BaseButton
                    label="Save"
                    classes="default primary"
                    onClick={() => onSave(selectedUOM.value)}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ChangeUOMDialog;
