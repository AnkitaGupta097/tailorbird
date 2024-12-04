import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputBase,
    Typography,
    styled,
} from "@mui/material";
import { IRenovation } from "stores/projects/details/budgeting/base-scope";
import { useDispatch } from "react-redux";
import actions from "stores/actions";

const SInput = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        border: "1px solid #CCCCCC",
        fontSize: 16,
        paddingLeft: "10px",
        marginRight: "5px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
}));

type AddMaterialSpecModalProps = {
    open: boolean;
    onClose?: any;
    onDone?: any;
    renoItemToAddMaterialFor: IRenovation;
    packageId: string;
};

const AddMaterialSpecModal = ({
    open,
    onClose,
    onDone,
    renoItemToAddMaterialFor,
    packageId,
}: AddMaterialSpecModalProps) => {
    const dispatch = useDispatch();

    const [productName, setProductName] = useState<string>();
    const [manufacturer, setManufacturer] = useState<string>();
    const [supplier, setSupplier] = useState<string>();
    const [modelNumber, setModelNumber] = useState<string>();
    const [grade, setGrade] = useState<string>();
    const [itemNumber, setItemNumber] = useState<string>();
    const [style, setStyle] = useState<string>();
    const [finish, setFinish] = useState<string>();
    const [description, setDescription] = useState<string>();
    // const [primaryThumbnail, setPrimaryThumbnail] = useState<string>();

    const addMaterial = () => {
        console.log(onDone);
        // onDone();
        const createMaterialPayload = [
            {
                name: productName,
                manufacturer: manufacturer,
                category: renoItemToAddMaterialFor.category,
                subcategory: renoItemToAddMaterialFor.subcategory,
                model_id: modelNumber,
                supplier: supplier,
                sku_id: itemNumber,
                package_id: packageId,
                description,
                // primary_thumbnail: primaryThumbnail,
            },
        ];
        dispatch(
            actions.singleProject.addMaterialSpecStart({
                materials: createMaterialPayload,
                renoItemId: renoItemToAddMaterialFor.id,
            }),
        );
        onClose();
    };

    const materialInputs = [
        {
            name: "Product Name * ",
            value: productName,
            onSet: setProductName,
            required: true,
            placeholder: "Product Name",
        },
        {
            name: "Manufacturer * ",
            value: manufacturer,
            onSet: setManufacturer,
            required: true,
            placeholder: "Manufacturer",
        },
        {
            name: "Supplier * ",
            value: supplier,
            onSet: setSupplier,
            required: true,
            placeholder: "Supplier",
        },
        {
            name: "Model Number",
            value: modelNumber,
            onSet: setModelNumber,
            required: false,
            placeholder: "Model Number",
        },
        {
            name: "Grade",
            value: grade,
            onSet: setGrade,
            required: false,
            placeholder: "Grade",
        },
        {
            name: "Item Number",
            value: itemNumber,
            onSet: setItemNumber,
            required: false,
            placeholder: "Item Number",
        },
        {
            name: "Style",
            value: style,
            onSet: setStyle,
            required: false,
            placeholder: "Style",
        },
        {
            name: "Finish",
            value: finish,
            onSet: setFinish,
            required: false,
            placeholder: "Finish",
        },

        {
            name: "Description",
            value: description,
            onSet: setDescription,
            required: false,
            placeholder: "Description",
            width: 1,
        },
        // {
        //     name: "Thumbnail",
        //     value: primaryThumbnail,
        //     onSet: setPrimaryThumbnail,
        //     required: false,
        //     placeholder: "Thumbnail",
        //     width: 1,
        // },
    ];
    return (
        <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogTitle
                sx={{
                    borderBottom: "solid 1px #f5f5f5",
                    padding: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="text_16_semibold">Add a New Material Spec</Typography>
            </DialogTitle>
            <DialogContent sx={{ borderBottom: "solid 1px #f5f5f5", padding: "16px !important" }}>
                <Box display="flex" flexWrap="wrap">
                    {materialInputs.map((mi, i) => {
                        return (
                            <Box key={i} width={mi.width || 0.45} p={2} flexGrow={1}>
                                <Box pb={1}>
                                    <Typography variant="text_14_medium">{mi.name}</Typography>
                                </Box>
                                <Box>
                                    <SInput
                                        fullWidth
                                        value={mi.value}
                                        onChange={(e: any) => mi.onSet(e.target.value)}
                                        placeholder={mi.placeholder}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={addMaterial}>
                    Add New Material Spec
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMaterialSpecModal;
