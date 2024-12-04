import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import actions from "stores/actions";

// NOTE: CKEditor caches the editor in browser, so you need to refresh the page, if you make any changes in config below
type MaterialDetailsProps = {
    renoItemId: string;
    material: any;
    closePopover: any;
};

function MaterialDetails({ renoItemId, material, closePopover }: MaterialDetailsProps) {
    const dispatch = useDispatch();

    const deleteMaterialSpec = () => {
        dispatch(
            actions.singleProject.updateRenovationItemsStart([
                {
                    reno_id: renoItemId,
                    work_id: null,
                },
            ]),
        );
        closePopover();
    };

    return (
        <Box
            p={2}
            sx={{ background: "#44474A", color: "white" }}
            display="flex"
            flexWrap="wrap"
            justifyContent="space-evenly"
            maxWidth={400}
        >
            <Box width={1} pb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="text_16_medium">
                        {material.name || "Material Spec"}
                    </Typography>
                </Box>
                <Box>
                    <IconButton sx={{ color: "white" }} onClick={closePopover}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            {material.primary_thumbnail && (
                <Box width={1} pb={2}>
                    <img src={material.primary_thumbnail} alt="" width={100} height={100} />
                </Box>
            )}
            <Box width={0.5} pb={2}>
                <Box>
                    <Typography variant="text_14_medium">Manufacturer:</Typography>
                </Box>
                <Box>{material.manufacturer || "-"}</Box>
            </Box>
            <Box width={0.5} pb={2}>
                <Box>
                    <Typography variant="text_14_medium">Supplier:</Typography>
                </Box>
                <Box>{material.suppliers.map((s: any) => s.supplier_name).join(",") || "-"}</Box>
            </Box>
            <Box width={0.5} pb={2}>
                <Box>
                    <Typography variant="text_14_medium">Model Number:</Typography>
                </Box>
                <Box>{material.model_id || "-"}</Box>
            </Box>
            <Box width={0.5} pb={2}>
                <Box>
                    <Typography variant="text_14_medium">SKU:</Typography>
                </Box>
                <Box>{material.suppliers.map((s: any) => s.sku_id).join(",") || "-"}</Box>
            </Box>
            <Box width={1} pb={2}>
                <Box>
                    <Typography variant="text_14_medium">Description:</Typography>
                </Box>
                <Box>{material.description || "-"}</Box>
            </Box>
            <Box pt={4} display="flex" justifyContent="space-between" width={1}>
                <Button
                    variant="outlined"
                    style={{ background: "white", border: "none" }}
                    onClick={deleteMaterialSpec}
                >
                    <Typography variant="text_14_medium">Delete This Material Spec</Typography>
                </Button>
                <Box flexGrow={1} />
            </Box>
        </Box>
    );
}

export default MaterialDetails;
