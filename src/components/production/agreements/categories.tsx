import { Grid, Typography } from "@mui/material";
import BaseButton from "components/button";
import React, { useCallback } from "react";
import { Stack } from "@mui/system";
import { isSelectedCategory } from "../constants";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import { IAgreementMetaData } from "./new-agreement";
import BaseCheckbox from "components/checkbox";

type ICategories = {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    containerCategories: any[];
    selectedCategories: any[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<any[]>>;
    agreementMetadata: IAgreementMetaData;
    setAgreementMetadata: React.Dispatch<React.SetStateAction<IAgreementMetaData>>;
};

const Categories = ({
    activeStep,
    setActiveStep,
    containerCategories,
    selectedCategories,
    setSelectedCategories,
    agreementMetadata,
    setAgreementMetadata,
}: ICategories) => {
    const updateSelectedCategory = useCallback(
        (category: any) => {
            if (selectedCategories?.some((selected) => selected?.id === category?.id)) {
                // Create a new array without the category item
                const updatedCategories = selectedCategories?.filter(
                    (selected) => selected?.id !== category?.id,
                );
                setSelectedCategories(updatedCategories);
            } else {
                // Create a new array with category added
                const updatedCategories = [
                    ...selectedCategories,
                    {
                        id: category?.id,
                        name: category?.category,
                    },
                ];
                setSelectedCategories(updatedCategories);
            }
        },
        //eslint-disable-next-line
        [selectedCategories],
    );

    const allCategoriesSelected = selectedCategories?.length === containerCategories?.length;

    const handleAddCategories = () => {
        const updatedAgreementMetadata = {
            ...agreementMetadata,
            categories: selectedCategories?.map((category) => category?.name),
        };
        setAgreementMetadata(updatedAgreementMetadata);
        setActiveStep(activeStep + 1);
    };

    return (
        <Grid
            container
            direction={"column"}
            justifyContent="center"
            alignItems={"center"}
            gap={10}
            alignSelf="stretch"
        >
            <Grid item>
                {
                    <Typography variant="text_16_medium" sx={{ color: "#757575" }}>
                        {"What type of work will this contractor taking up?"}
                    </Typography>
                }
            </Grid>
            <Grid
                item
                sx={{
                    display: "flex",
                    alignSelf: "stretch",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Stack direction={"row"}>
                    <BaseCheckbox
                        size="small"
                        sx={{ marginRight: "8px" }}
                        checked={selectedCategories?.length}
                        onClick={() => {
                            if (selectedCategories?.length === containerCategories?.length) {
                                setSelectedCategories([]);
                            } else {
                                const allTypes = containerCategories?.map((category) => {
                                    return {
                                        id: category?.id,
                                        name: category?.category,
                                    };
                                });
                                setSelectedCategories(allTypes);
                            }
                        }}
                        indeterminate={selectedCategories?.length > 0 && !allCategoriesSelected}
                    />
                    <Typography variant="text_16_regular" alignSelf={"center"}>
                        {"Select All"}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item>
                <Grid
                    container
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                        maxWidth: "800px",
                    }}
                >
                    {containerCategories?.map((category) => {
                        return (
                            <Grid item key={category?.id}>
                                {
                                    <BaseButton
                                        sx={{
                                            border: isSelectedCategory(
                                                selectedCategories,
                                                category?.category,
                                            )
                                                ? "none"
                                                : "1px solid #909090",
                                            borderRadius: "4px",
                                            backgroundColor: isSelectedCategory(
                                                selectedCategories,
                                                category?.category,
                                            )
                                                ? "#909090"
                                                : "#FFFFFF",
                                            color: isSelectedCategory(
                                                selectedCategories,
                                                category?.category,
                                            )
                                                ? "#FFFFFF"
                                                : "#909090",
                                            "&:hover": {
                                                backgroundColor: isSelectedCategory(
                                                    selectedCategories,
                                                    category?.category,
                                                )
                                                    ? "#909090"
                                                    : "#FFFFFF",
                                            },
                                            padding: "12px 20px",
                                        }}
                                        labelStyles={{ fontSize: "18px", fontWeight: "500" }}
                                        onClick={() => updateSelectedCategory(category)}
                                        label={category?.category}
                                        startIcon={
                                            <img
                                                src={getCategoryIcon(category?.category)}
                                                width={20}
                                                height={20}
                                                alt={`${category?.category} icon`}
                                                style={
                                                    {
                                                        //marginRight: "1rem",
                                                    }
                                                }
                                            />
                                        }
                                    />
                                }
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
            <Grid item>
                <BaseButton
                    classes={
                        selectedCategories?.length > 0 ? "primary default" : "primary disabled"
                    }
                    label="Next"
                    onClick={handleAddCategories}
                />
            </Grid>
        </Grid>
    );
};

export default Categories;
