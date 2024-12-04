import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import { groupBy } from "lodash";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import defaultMaterialImg from "assets/icons/default-material.svg";
import { fetchBasePackage, fetchPackageContents } from "../utils";

type PackageContentsModalProps = {
    open: boolean;
    projectName: string;
    projectId: string;
    onClose?: any;
};

const PackageContentsModal = ({
    open,
    projectName,
    projectId,
    onClose,
}: PackageContentsModalProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [groupedPackageContents, setGroupedPackageContents] = useState<any>();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const getContent = async () => {
        const basePackage = await fetchBasePackage(projectId);
        const packageId: string = basePackage.package_id;
        const packageContents = await fetchPackageContents(packageId);
        const groupedMaterials = groupBy(packageContents?.materials, "category");
        setGroupedPackageContents(groupedMaterials);
        setExpandedCategories(Object.keys(groupedMaterials));
        setLoading(false);
    };

    useEffect(() => {
        getContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleCategoryItemsDisplay = (category: string) => {
        if (expandedCategories.includes(category))
            setExpandedCategories(expandedCategories.filter((c) => c !== category));
        else setExpandedCategories([...expandedCategories, category]);
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
                <Typography variant="text_16_semibold">Package Information</Typography>
                <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
            </DialogTitle>
            <DialogContent sx={{ borderBottom: "solid 1px #f5f5f5", padding: "16px !important" }}>
                <Box pb={4}>
                    <Typography variant="text_20_medium">{projectName} package</Typography>
                </Box>
                {loading ? (
                    <IconButton>
                        <CircularProgress />
                    </IconButton>
                ) : (
                    <Box padding={2}>
                        {Object.keys(groupedPackageContents).map((category) => {
                            return (
                                <Box key={category}>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        onClick={() => toggleCategoryItemsDisplay(category)}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <Typography variant="text_18_medium">
                                            {category} ({groupedPackageContents[category].length}{" "}
                                            items)
                                        </Typography>
                                        {expandedCategories.includes(category) ? (
                                            <ArrowDropDownIcon />
                                        ) : (
                                            <ArrowDropUpIcon />
                                        )}
                                    </Box>

                                    <Collapse in={expandedCategories.includes(category)}>
                                        <Box display="flex" flexWrap="wrap" p={2}>
                                            {groupedPackageContents[category].map(
                                                (material: any) => {
                                                    return (
                                                        <Box
                                                            key={material.material_id}
                                                            sx={{
                                                                width: "25%",
                                                                minWwdth: 200,
                                                            }}
                                                            display="flex"
                                                        >
                                                            <Box
                                                                sx={{
                                                                    border: "solid 2px #ddd",
                                                                    borderRadius: 5,
                                                                    margin: 4,
                                                                    padding: 4,
                                                                }}
                                                                flexGrow={1}
                                                            >
                                                                <Box width={100} height={100}>
                                                                    <img
                                                                        src={
                                                                            material.primary_thumbnail ||
                                                                            defaultMaterialImg
                                                                        }
                                                                        alt=""
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="text_18_medium">
                                                                        {material.description}
                                                                    </Typography>
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="text_14_regular">
                                                                        Manufacturer:{" "}
                                                                        {material.manufacturer}
                                                                    </Typography>
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="text_14_regular">
                                                                        Suppliers:{" "}
                                                                        {material.suppliers
                                                                            .map(
                                                                                (s: any) =>
                                                                                    s.supplier_name,
                                                                            )
                                                                            .join(", ") || "NA"}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    );
                                                },
                                            )}
                                        </Box>
                                    </Collapse>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PackageContentsModal;
