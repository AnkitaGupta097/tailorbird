import { Grid, Typography } from "@mui/material";
import BaseButton from "components/button";
import { ReactComponent as MaterialIcon } from "../../../assets/icons/material.svg";
import { ReactComponent as LaborIcon } from "../../../assets/icons/labor.svg";
import React, { useCallback } from "react";
import { Stack } from "@mui/system";
import BaseSvgIcon from "components/svg-icon";
import { isSelectedType } from "../constants";
import { IAgreementMetaData } from "./new-agreement";
import BaseCheckbox from "components/checkbox";

type IWorkType = {
    activeStep: number;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    selectedType: string[];
    setSelectedType: React.Dispatch<React.SetStateAction<string[]>>;
    agreementMetadata: IAgreementMetaData;
    setAgreementMetadata: React.Dispatch<React.SetStateAction<IAgreementMetaData>>;
};

const WorkType = ({
    activeStep,
    setActiveStep,
    selectedType,
    setSelectedType,
    agreementMetadata,
    setAgreementMetadata,
}: IWorkType) => {
    const updateSelectedWorkType = useCallback(
        (type: string) => {
            if (selectedType?.includes(type)) {
                // Create a new array without the type (Material or Labor) item
                const updatedType = selectedType?.filter((selected) => selected !== type);
                setSelectedType(updatedType);
            } else {
                // Create a new array with the type (Material or Labor) added
                const updatedType = [...selectedType, type];
                setSelectedType(updatedType);
            }
        },
        //eslint-disable-next-line
        [selectedType],
    );

    const handleWorkType = () => {
        const updatedAgreementMetadata = {
            ...agreementMetadata,
            work_type: selectedType,
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
                        {"What type of work will be a part of this agreement?"}
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
                        checked={selectedType?.length}
                        onClick={() => {
                            if (
                                isSelectedType(selectedType, "Material") &&
                                isSelectedType(selectedType, "Labor")
                            ) {
                                setSelectedType([]);
                            } else {
                                const allTypes = ["Material", "Labor"];
                                setSelectedType(allTypes);
                            }
                        }}
                        indeterminate={selectedType?.length > 0 && selectedType?.length != 2}
                    />
                    <Typography variant="text_16_regular" alignSelf={"center"}>
                        {"Select All"}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item>
                <BaseButton
                    sx={{
                        width: "400px",
                        border: isSelectedType(selectedType, "Material")
                            ? "none"
                            : "1px solid #909090",
                        borderRadius: "4px",
                        backgroundColor: isSelectedType(selectedType, "Material")
                            ? "#909090"
                            : "#FFFFFF",
                        color: isSelectedType(selectedType, "Material") ? "#FFFFFF" : "#909090",
                        "&:hover": {
                            backgroundColor: isSelectedType(selectedType, "Material")
                                ? "#909090"
                                : "#FFFFFF",
                        },
                    }}
                    label="Material"
                    labelStyles={{
                        fontSize: "18px",
                        fontWeight: "500",
                    }}
                    onClick={() => updateSelectedWorkType("Material")}
                    startIcon={<BaseSvgIcon svgPath={<MaterialIcon />} />}
                />
            </Grid>
            <Grid item>
                <BaseButton
                    sx={{
                        width: "400px",
                        border: isSelectedType(selectedType, "Labor")
                            ? "none"
                            : "1px solid #909090",
                        borderRadius: "4px",
                        backgroundColor: isSelectedType(selectedType, "Labor")
                            ? "#909090"
                            : "#FFFFFF",
                        color: isSelectedType(selectedType, "Labor") ? "#FFFFFF" : "#909090",
                        "&:hover": {
                            backgroundColor: isSelectedType(selectedType, "Labor")
                                ? "#909090"
                                : "#FFFFFF",
                        },
                    }}
                    label="Labor"
                    labelStyles={{ fontSize: "18px", fontWeight: "500" }}
                    onClick={() => updateSelectedWorkType("Labor")}
                    startIcon={<BaseSvgIcon svgPath={<LaborIcon />} />}
                />
            </Grid>
            <Grid item>
                <BaseButton
                    classes={selectedType?.length > 0 ? "primary default" : "primary disabled"}
                    label="Next"
                    onClick={handleWorkType}
                />
            </Grid>
        </Grid>
    );
};

export default WorkType;
