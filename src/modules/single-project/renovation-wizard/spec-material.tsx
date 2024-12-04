/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Typography, Box, Grid, Switch, FormControlLabel, Skeleton } from "@mui/material";
import appTheme from "styles/theme";
import { ReactComponent as SpecPlaceholder } from "assets/icons/img-placeholder.svg";
import SkeletonLoader from "./skeleton-loader";

const AvailableSpecsMaterial = ({
    currentQuestion,
    specsData,
    selectedSpecs,
    setSelectedSpecs,
    selectPlaceholder,
    setSelectPlaceholder,
    loading,
    setDisableSpectSave,
}: any) => {
    useEffect(() => {
        setDisableSpectSave(
            selectedSpecs[currentQuestion.item_id]?.length > 0 || selectPlaceholder,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSpecs, selectPlaceholder]);

    const handleToggle = (value: any, specID: string) => {
        const currentQuestionId = currentQuestion.item_id;

        setSelectedSpecs(
            (prevSelectedSpecs: {
                [key: string]: { material_id: string; is_preferred: boolean }[];
            }) => {
                const updatedSelectedSpecs = { ...prevSelectedSpecs };

                // Check if the current question ID already exists in selectedSpecs
                if (updatedSelectedSpecs[currentQuestionId]) {
                    if (value == true) {
                        // Set is_preferred to false for all specifications in the current question
                        updatedSelectedSpecs[currentQuestionId].forEach(
                            (spec: { is_preferred: boolean; material_id: string }) => {
                                spec.is_preferred = false;
                            },
                        );
                    }
                    // Find the selected specification by its material_id
                    const selectedSpec = updatedSelectedSpecs[currentQuestionId].find(
                        (spec: { material_id: string }) => spec.material_id === specID,
                    );

                    if (selectedSpec) {
                        // Toggle is_preferred for the selected specification
                        selectedSpec.is_preferred = value;
                    }
                }
                return updatedSelectedSpecs;
            },
        );
    };
    const handleClick = (index: any) => {
        const specID = specsData[index].id;
        const currentQuestionId = currentQuestion.item_id;

        setSelectedSpecs(
            (prevSelectedSpecs: {
                [key: string]: { material_id: string; is_preferred: boolean }[];
            }) => {
                const updatedSelectedSpecs = { ...prevSelectedSpecs };
                if (updatedSelectedSpecs[currentQuestionId]) {
                    // If the current question ID already exists in the selectedSpecs object
                    const existingSpecIndex = updatedSelectedSpecs[currentQuestionId].findIndex(
                        (spec: { material_id: string }) => spec.material_id === specID,
                    );
                    if (existingSpecIndex !== -1) {
                        // If the selected button ID is already in the array, remove it
                        updatedSelectedSpecs[currentQuestionId].splice(existingSpecIndex, 1);
                    } else {
                        // If the selected button ID is not in the array, add it
                        updatedSelectedSpecs[currentQuestionId].push({
                            material_id: specID,
                            is_preferred: false,
                        });
                    }
                } else {
                    // If the current question ID does not exist in the selectedSpecs object, create a new entry
                    updatedSelectedSpecs[currentQuestionId] = [
                        { material_id: specID, is_preferred: false },
                    ];
                }
                return updatedSelectedSpecs;
            },
        );
        setSelectPlaceholder(false);
    };

    return (
        <>
            {loading ? (
                <SkeletonLoader />
            ) : (
                <Grid
                    gridAutoFlow={"row"}
                    columnGap={"12px"}
                    rowGap={"15px"}
                    display={"grid"}
                    gridTemplateColumns={"repeat(auto-fill, minmax(210px, 1fr))"}
                >
                    {specsData &&
                        specsData?.map((material: any, index: number) => {
                            const specID = material.id;
                            const isSelected = selectedSpecs[currentQuestion.item_id]?.some(
                                (spec: { material_id: string }) => spec.material_id === specID,
                            );

                            const isPrefered = selectedSpecs[currentQuestion.item_id]?.find(
                                (spec: { material_id: string }) => spec.material_id === specID,
                            )?.is_preferred;

                            return (
                                <Box
                                    p={"16px"}
                                    key={index}
                                    borderRadius={"4px"}
                                    onClick={() => handleClick(index)}
                                    sx={{
                                        cursor: "pointer",
                                        border: isSelected
                                            ? "4px solid var(--v-3-colors-text-primary-light, #0088C7)"
                                            : "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
                                        boxShadow: isSelected
                                            ? "0px 0px 21px 0px rgba(0, 0, 0, 0.25)"
                                            : "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                                    }}
                                >
                                    {material.primary_thumbnail ? (
                                        <img
                                            src={material.primary_thumbnail}
                                            alt="material_image"
                                            style={{
                                                maxWidth: 150,
                                                maxHeight: 170,
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <SpecPlaceholder
                                            title={`spec_alt_${index}`}
                                            style={{ width: "-webkit-fill-available" }}
                                        />
                                    )}

                                    <Box mt={3}>
                                        <Typography variant="text_18_medium">
                                            {`${material.subcategory}`}
                                        </Typography>
                                        <br />
                                        <Typography
                                            variant="text_14_regular"
                                            color={appTheme.border.medium}
                                        >
                                            {`${material.manufacturer} - ${material.model_id} `}
                                        </Typography>
                                        <br />
                                        <Typography
                                            variant="text_12_regular"
                                            color={appTheme.border.medium}
                                        >
                                            {`${material.description}`}
                                        </Typography>
                                        <br />

                                        {isSelected && (
                                            <button
                                                onClick={(e: any) => {
                                                    e.stopPropagation();
                                                }}
                                                aria-label="toggle-button"
                                                style={{
                                                    cursor: "pointer",
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                }}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            disableRipple
                                                            checked={isPrefered}
                                                            onChange={(event: any) => {
                                                                handleToggle(
                                                                    event.target.checked,
                                                                    specID,
                                                                );
                                                            }}
                                                            name="gilad"
                                                        />
                                                    }
                                                    label={
                                                        isPrefered
                                                            ? "Preferred Option"
                                                            : "Alternative Option"
                                                    }
                                                />
                                            </button>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                </Grid>
            )}
        </>
    );
};

export default AvailableSpecsMaterial;
