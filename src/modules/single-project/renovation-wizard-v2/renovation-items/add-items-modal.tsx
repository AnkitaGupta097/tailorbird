import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type AddItemsModalProps = {
    open: boolean;
    allowedItems: any[];
    componentName: string;
    onClose?: any;
    onDone?: any;
};

const AddItemsModal = ({
    open,
    allowedItems,
    componentName,
    onClose,
    onDone,
}: AddItemsModalProps) => {
    const [selectedItems, setSelectedItems] = useState<any[]>([]);

    const selectItem = (item: string) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const addRenoItems = () => {
        onDone(selectedItems);
    };

    return (
        <Dialog
            open={open}
            maxWidth="lg"
            fullWidth
            onClose={onClose}
            PaperProps={{
                sx: {
                    minHeight: 500,
                },
            }}
        >
            <DialogTitle
                sx={{
                    borderBottom: "solid 1px #f5f5f5",
                    padding: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="text_16_semibold">{componentName}</Typography>
                <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
            </DialogTitle>
            <DialogContent sx={{ borderBottom: "solid 1px #f5f5f5", padding: "16px !important" }}>
                {allowedItems.length > 0 ? (
                    <Box>
                        <Box display="flex" flexWrap="wrap">
                            {allowedItems.map((item) => {
                                return (
                                    <Box key={item.id} p={1}>
                                        <Button
                                            variant={
                                                selectedItems.includes(item)
                                                    ? "contained"
                                                    : "outlined"
                                            }
                                            onClick={() => selectItem(item)}
                                        >
                                            {item.item}
                                        </Button>
                                    </Box>
                                );
                            })}
                        </Box>
                        {selectedItems.length > 0 && (
                            <Box pt={2}>
                                <Box py={2}>
                                    <Typography variant="text_18_semibold">
                                        Choose actions for the selected items?
                                    </Typography>
                                </Box>
                                <Box sx={{ borderLeft: "solid 1px #C9CCCF", paddingLeft: 4 }}>
                                    {selectedItems.map((si) => {
                                        return (
                                            <Box display="flex" key={si.id} py={2}>
                                                <Box width={0.2}>
                                                    <Typography variant="text_16_medium">
                                                        {si.item}
                                                    </Typography>
                                                </Box>
                                                <Button variant="contained">{si.scope}</Button>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box display="flex" justifyContent="center">
                        <Typography>No items to add</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                {selectedItems.length > 0 && (
                    <Button variant="contained" onClick={addRenoItems}>
                        Confirm
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddItemsModal;
