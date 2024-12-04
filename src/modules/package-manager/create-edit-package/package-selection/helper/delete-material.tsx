import Delete from "@mui/icons-material/Delete";
import React, { FC, useState } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import { destructureMaterialData, OptionalTypographyRender } from ".";
import BaseButton from "components/button";
import { graphQLClient } from "utils/gql-client";
import { softDeleteMaterial } from "../gql";
import actions from "../../../../../stores/actions";
import { useAppDispatch } from "../../../../../stores/hooks";
import { TdeleteMaterialResponse, type IDeleteMaterial } from "./interfaces";
import { IMaterial } from "modules/package-manager/interfaces";

const DeleteMaterial: FC<IDeleteMaterial> = (props) => {
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);
    const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const cancelHandler = () => {
        setDialogOpened(false);
    };

    const deleteHandler = () => {
        setDeleteInProgress(true);
        graphQLClient
            .mutate("softDeleteMaterial", softDeleteMaterial, {
                input: props.row.id,
            })
            .then((response: TdeleteMaterialResponse) => {
                dispatch(
                    actions.common.openSnack({
                        message: "Material deleted successfully",
                        variant: "success",
                    }),
                );
                setDialogOpened(false);
                props.row.setMaterialsData((prevItems: IMaterial[]) => {
                    return prevItems.filter((item) => item.material_id !== response.material_id);
                });
            })
            .catch(() => {
                dispatch(
                    actions.common.openSnack({
                        variant: "error",
                        message: "Material delete failed",
                    }),
                );
            })
            .finally(() => {
                setDeleteInProgress(false);
            });
    };

    return (
        <>
            <Box
                onClick={() => {
                    setDialogOpened(true);
                }}
            >
                <IconButton
                    sx={{
                        backgroundColor: "transparent",
                        transition: "transform .2s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.2)",
                        },
                    }}
                    disableRipple
                >
                    <Delete />
                </IconButton>
            </Box>
            <Dialog open={dialogOpened}>
                <DialogTitle>
                    <Typography variant="text_18_bold" textAlign="center" mb="1rem">
                        Delete SKU?
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", minWidth: "30rem" }}>
                    {destructureMaterialData({ ...props.row, supplier: null }).map((props, idx) => (
                        <OptionalTypographyRender key={idx} {...props} />
                    ))}
                </DialogContent>
                <DialogActions sx={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}>
                    <BaseButton
                        onClick={cancelHandler}
                        label="Cancel"
                        labelStyles={{ paddingY: ".4rem" }}
                        classes="grey default"
                        variant="text_16_semibold"
                    />
                    <BaseButton
                        onClick={deleteHandler}
                        label="Delete"
                        labelStyles={{ paddingY: ".4rem" }}
                        classes="primary default"
                        disabled={deleteInProgress}
                        variant="text_16_semibold"
                    />
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteMaterial;
