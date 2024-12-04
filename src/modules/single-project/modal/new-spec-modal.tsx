import React, { useState } from "react";
import { Box, Dialog, Typography, Button, Divider, Grid } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import BaseTextField from "components/text-field";
import { MATERIAL_DETAILS } from "../contants";
import { IMaterialDetails } from "../interface";

interface INewSpecModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    setMaterialData: any;
}

const NewSpecModal = ({ modalHandler, openModal, setMaterialData }: INewSpecModal) => {
    const [materialDetails, setMaterialDetails] = useState<IMaterialDetails>(MATERIAL_DETAILS);

    const updateSKUDetail = (key: string, value: string) => {
        setMaterialDetails({ ...materialDetails, [key]: value });
    };

    const createSKU = async () => {
        setMaterialData(materialDetails);
        modalHandler(false);
    };

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="md"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid` }}
            >
                <Typography variant="text_18_bold">Add a New Spec</Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box p={6} mt={4}>
                <Typography variant="text_16_regular" color={appTheme.text.medium}>
                    You may add or update a Spec manually below
                </Typography>
                <Grid container mt={6} mb={8}>
                    <Grid item md={6} pr={5}>
                        <BaseTextField
                            value={materialDetails.name}
                            onChange={(e: any) => updateSKUDetail("name", e.target.value)}
                            placeholder="SKU Name"
                            label="Product Name * "
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pl={5}>
                        <BaseTextField
                            value={materialDetails.manufacturer}
                            onChange={(e: any) => updateSKUDetail("manufacturer", e.target.value)}
                            placeholder="Manufacturer"
                            label="Manufacturer *"
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pr={5} mt={6}>
                        <BaseTextField
                            value={materialDetails.supplier}
                            onChange={(e: any) => updateSKUDetail("supplier", e.target.value)}
                            placeholder="Supplier"
                            label="Supplier * "
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pl={5} mt={6}>
                        <BaseTextField
                            value={materialDetails.model_id}
                            onChange={(e: any) => updateSKUDetail("model_id", e.target.value)}
                            placeholder="Model Number"
                            label="Model Number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pr={5} mt={6}>
                        <BaseTextField
                            value={materialDetails.grade}
                            onChange={(e: any) => updateSKUDetail("grade", e.target.value)}
                            placeholder="Grade"
                            label="Grade"
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pl={5} mt={6}>
                        <BaseTextField
                            value={materialDetails.sku_id}
                            onChange={(e: any) => updateSKUDetail("sku_id", e.target.value)}
                            placeholder="Item Number"
                            label="Item Number"
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pr={5} mt={6}>
                        <BaseTextField
                            value={materialDetails.style}
                            onChange={(e: any) => updateSKUDetail("style", e.target.value)}
                            placeholder="Style"
                            label="Style"
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={6} pl={5} mt={6}>
                        <BaseTextField
                            value={materialDetails.finish}
                            onChange={(e: any) => updateSKUDetail("finish", e.target.value)}
                            placeholder="Finish"
                            label="Finish"
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Divider />
                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        component="label"
                        style={{ height: "40px", marginRight: "15px" }}
                    >
                        <Typography variant="text_16_medium">Cancel</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        component="label"
                        style={{ height: "40px" }}
                        onClick={createSKU}
                    >
                        <Typography variant="text_16_medium">Add New Spec</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default NewSpecModal;
