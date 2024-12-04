/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Switch, FormControlLabel, Skeleton } from "@mui/material";
import appTheme from "styles/theme";
import SkeletonLoader from "./skeleton-loader";
import { ReactComponent as Tailorbird } from "assets/icons/tailorbird-logo.svg";
import { useAppSelector } from "stores/hooks";
import { ReactComponent as SpecParameter } from "assets/icons/shower.svg";
import { isEmpty } from "lodash";

const AvailableSpecParameters = ({
    currentQuestion,
    setDisableSpectSave,
    selectedParameter,
    setSelectedParameter,
    setSelectPlaceholder,
    selectPlaceholder,
    setSelectedSpecs,
}: any) => {
    // eslint-disable-next-line
    const { parameterData, loading } = useAppSelector((state) => ({
        parameterData: state.singleProject.renovationWizard.questionAnswerData.specParameters.data,
        loading: state.singleProject.renovationWizard.questionAnswerData.specParameters.loading,
    }));

    const [parameterDisplayData, setParameterDisplayData] = useState<any>({});

    useEffect(() => {
        if (!isEmpty(parameterData)) {
            if (!isEmpty(parameterData[currentQuestion?.item_id]))
                setParameterDisplayData(parameterData[currentQuestion.item_id][0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameterData]);

    useEffect(() => {
        if (selectPlaceholder) {
            setSelectedSpecs({ [currentQuestion.item_id]: [] });
            setSelectedParameter({ [currentQuestion.item_id]: [] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPlaceholder]);

    // useEffect(() => {
    //     setDisableSpectSave(
    //         selectedParameter[currentQuestion.item_id]?.length > 0 || selectPlaceholder,
    //     );
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedParameter, selectPlaceholder]);

    const handleToggle = (value: any) => {
        setSelectedParameter({ ...selectedParameter, isPrefered: value });
    };
    const handleClick = () => {
        setSelectedParameter({ ...selectedParameter, isSelected: !selectedParameter.isSelected });
        setSelectPlaceholder(false);
        setDisableSpectSave(!selectedParameter.isSelected);
    };
    const { isSelected, isPrefered } = selectedParameter;
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
                    {!isEmpty(parameterDisplayData) && (
                        <Box
                            p={"16px"}
                            borderRadius={"4px"}
                            onClick={handleClick}
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
                            <SpecParameter />
                            <Box mt={3}>
                                <Typography variant="text_18_medium">Spec Parameters</Typography>
                                <br />
                                <Typography variant="text_12_regular">{`Edit`}</Typography>
                                <br />
                                <Typography variant="text_14_medium">Manufacturer:</Typography>
                                <br />
                                <Typography variant="text_12_regular">
                                    {`${parameterDisplayData.manufacturers}`}
                                </Typography>
                                <br />
                                <Typography variant="text_14_medium" color={appTheme.border.medium}>
                                    {`Price Point:`}
                                </Typography>
                                <br />
                                <Typography
                                    variant="text_12_regular"
                                    color={appTheme.border.medium}
                                >
                                    {`${parameterDisplayData.low_price} - ${parameterDisplayData.high_price} `}
                                </Typography>
                                <br />{" "}
                                <Typography variant="text_14_medium" color={appTheme.border.medium}>
                                    {`Finishes:`}
                                </Typography>
                                <br />
                                <Typography
                                    variant="text_12_regular"
                                    color={appTheme.border.medium}
                                >
                                    {`${parameterDisplayData.finish}`}
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
                                                        handleToggle(event.target.checked);
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
                    )}
                    <Box
                        p={"16px"}
                        borderRadius={"4px"}
                        onClick={() => setSelectPlaceholder(!selectPlaceholder)}
                        sx={{
                            cursor: "pointer",
                            border: selectPlaceholder
                                ? "4px solid var(--v-3-colors-text-primary-light, #0088C7)"
                                : "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
                            boxShadow: selectPlaceholder
                                ? "0px 0px 21px 0px rgba(0, 0, 0, 0.25)"
                                : "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                    >
                        <Tailorbird
                            title={`spec_alt_${null}`}
                            style={{
                                width: "-webkit-fill-available",
                                padding: "27px 43px",
                                borderRadius: "4px",
                                border: "2px solid #004D71",
                            }}
                        />

                        <Box mt={3}>
                            <Typography variant="text_18_medium">{`Select Placeholder`}</Typography>
                            <br />
                            <Typography variant="text_14_regular" color={appTheme.border.medium}>
                                {`Not sure just yet? Set this as a placeholder and come back later. `}
                            </Typography>
                            <br />
                        </Box>
                    </Box>
                </Grid>
            )}
        </>
    );
};

export default AvailableSpecParameters;
