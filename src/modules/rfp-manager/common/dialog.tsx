import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    Grid,
    Stack,
    styled,
    Typography,
} from "@mui/material";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import React, { useState } from "react";
import BaseCheckbox from "components/checkbox";
import { IFloorplanPrice, IItem } from "stores/bidding-portal/bidding-portal-models";
import BaseButton from "components/button";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import { getDisplayUOM } from "../pricing-entry-table/constants";

interface IRfpDialog {
    open: boolean;
    updatedFps: IFloorplanPrice[] | undefined;
    setUpdatedFps: any;
    setOpen: any;
    newDefaultPrice: {
        unit_price: number;
        lump_sum: number;
    };
    allFloorPlan: IItem | undefined;
    category: string;
    currentFp: IFloorplanPrice;
    sourceOfChange: string;
    is_historical_price?: boolean;
    showInventories?: boolean;
}

const StyledDialog = styled(Dialog)<DialogProps>(() => ({
    "& .MuiPaper-root": {
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
    },
}));

const RfpDialog = ({
    open,
    updatedFps,
    setUpdatedFps,
    setOpen,
    newDefaultPrice,
    allFloorPlan,
    currentFp,
    category,
    sourceOfChange,
    is_historical_price,
    showInventories = true,
}: IRfpDialog) => {
    const dispatch = useDispatch();
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const resetState = () => {
        setOpen(false);
        setSelectAll(false);
    };

    const onSelectAll = (e: any) => {
        setUpdatedFps((prevState: any) => {
            let stateCopy = JSON.parse(JSON.stringify(prevState));
            stateCopy = stateCopy.map((item: any) => {
                return {
                    ...item,
                    isSelected: e?.target?.checked,
                };
            });
            return stateCopy;
        });
        setSelectAll(e?.target?.checked);
    };

    const onSelectItem = (e: any, fp_name: string) => {
        setUpdatedFps((prevState: any) => {
            let stateCopy = JSON.parse(JSON.stringify(prevState));
            stateCopy = stateCopy.map((item: any) => {
                if (item.fp_name === fp_name) {
                    item.isSelected = e.target.checked;
                }
                return item;
            });
            return stateCopy;
        });
        setSelectAll(false);
    };

    const handleProceed = () => {
        const selectedItems = updatedFps?.filter((fp) => fp?.isSelected === true);
        const notSelectedItems = updatedFps?.filter((fp) => fp?.isSelected === false);
        // condition 1: If there are no items selected to override price
        // then do nothing
        if (selectedItems !== undefined && selectedItems?.length > 0) {
            // condition 1: If all items are selected to override price
            // then dispatch action to change default price for all items to new default price
            if (selectedItems?.length === updatedFps?.length) {
                dispatch(
                    actions?.biddingPortal?.updatePriceInStore({
                        quantity: allFloorPlan?.quantity,
                        fp_name: "All Floor Plans",
                        category: category,
                        id: allFloorPlan?.id,
                        reno_item_id: allFloorPlan?.reno_item_id,
                        unique_price: 0,
                        default_price:
                            sourceOfChange === "all_fp"
                                ? newDefaultPrice?.unit_price
                                : allFloorPlan?.default_price,
                        is_unique_price: false,
                        total_price: newDefaultPrice?.lump_sum,
                        is_historical_price,
                    }),
                );
            }

            //condition 2: If only some items are selected to override price
            // then dispatch action to change price selectively
            else {
                dispatch(
                    actions?.biddingPortal?.updatePriceInStoreIfExcludedItems({
                        quantity: allFloorPlan?.quantity,
                        fp_name: "All Floor Plans",
                        category: category,
                        id: allFloorPlan?.id,
                        reno_item_id: allFloorPlan?.reno_item_id,
                        default_price: newDefaultPrice?.unit_price,
                        is_unique_price: false,
                        total_price: newDefaultPrice?.lump_sum,
                        excludedList: notSelectedItems,
                        selectedItems: [...selectedItems, currentFp],
                        is_historical_price,
                    }),
                );
            }
        } else {
            // condition 3: If all floorplans and if none selected
            dispatch(
                actions?.biddingPortal?.updatePriceInStoreIfExcludedItems({
                    quantity: allFloorPlan?.quantity,
                    fp_name: "All Floor Plans",
                    category: category,
                    id: allFloorPlan?.id,
                    reno_item_id: allFloorPlan?.reno_item_id,
                    default_price: newDefaultPrice?.unit_price,
                    is_unique_price: false,
                    total_price: newDefaultPrice?.lump_sum,
                    excludedList: notSelectedItems,
                    selectedItems: [currentFp],
                    is_historical_price,
                }),
            );
        }
        resetState();
    };

    return (
        <StyledDialog
            open={open}
            onClose={() => {
                resetState();
                setOpen(false);
            }}
        >
            <DialogTitle>
                <Box
                    sx={{
                        width: "4.3rem",
                        height: "4.3rem",
                        background: "#FFFFFF",
                        boxShadow: " 0px 0px 21px rgba(0, 0, 0, 0.11)",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <InfoSharpIcon htmlColor="#004D71" fontSize="large" />
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container direction={"column"} sx={{ display: "flex", alignItems: "center" }}>
                    <Grid item>
                        <Typography> {"The following floor plans have unique prices."}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{"Select the ones you wish to override."}</Typography>
                    </Grid>
                    <Grid item>
                        <Stack
                            direction={"row"}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                            gap={2}
                            padding="8px"
                        >
                            <BaseCheckbox
                                checked={selectAll}
                                onChange={(e: any) => onSelectAll(e)}
                            />
                            <Typography>{`Select All (${updatedFps?.length})`}</Typography>
                        </Stack>
                    </Grid>
                    <Grid
                        component={Box}
                        item
                        sx={{
                            maxHeight: "118px",
                            maxWidth: "15px",
                            overflowY: "auto",
                            border: "solid 1px #C1C1C1",
                            borderRadius: "5px",
                        }}
                    >
                        {updatedFps?.map((fp: any, index: number) => {
                            return (
                                <Stack
                                    key={index}
                                    direction={"row"}
                                    sx={{ display: "flex", alignItems: "center" }}
                                    gap={2}
                                    padding="8px"
                                >
                                    <BaseCheckbox
                                        checked={fp?.isSelected}
                                        onChange={(e: any) => onSelectItem(e, fp?.fp_name)}
                                    />
                                    <Typography>{`${fp?.fp_name}${
                                        showInventories ? `:${fp.inventory ?? ""}` : ""
                                    }:${fp.sub_group_name ?? ""} = $${
                                        fp?.unique_price
                                    } / ${getDisplayUOM(fp?.uom)}`}</Typography>
                                </Stack>
                            );
                        })}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: 5 }}>
                <BaseButton
                    onClick={() => {
                        resetState();
                        setOpen(false);
                    }}
                    label={"Cancel"}
                    classes={"grey default"}
                />
                <BaseButton onClick={handleProceed} label={"Proceed"} classes={"primary default"} />
            </DialogActions>
        </StyledDialog>
    );
};

export default RfpDialog;
