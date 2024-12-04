/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Divider, Skeleton } from "@mui/material";
import BaseButton from "components/button";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import BaseCheckbox from "components/checkbox";
import { ReactComponent as PlusIcon } from "assets/icons/plus.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/settings.svg";
import { ReactComponent as ArrowRight } from "assets/icons/arrow-circle-right.svg";
import AvailableSpecParameters from "./spec-parameter";
import AvailableSpecsMaterial from "./spec-material";

import BaseToggle from "components/toggle";
import { isEmpty } from "lodash";
interface ISpecSelectionProps {
    currentQuestions: any[];
    setIsModal: any;
    packageId: any;
    setDisableSpectSave: any;
    selectedParameter: any;
    setSelectedParameter: any;
    selectedSpecs: any;
    setSelectedSpecs: any;
}
interface IcurrentQuestion {
    meta_data: any;
    item_name: any;
    id: string;
    item_id: any;
    question_description: string;
    answers: any[]; // Add the type for the answers property
}

const SpecSelection = ({
    currentQuestions,
    setIsModal,
    packageId,
    setDisableSpectSave,
    selectedParameter,
    setSelectedParameter,
    selectedSpecs,
    setSelectedSpecs,
}: ISpecSelectionProps) => {
    const dispatch = useAppDispatch();
    const { loading, specsData, parameterData } = useAppSelector((state) => ({
        loading: state.singleProject.renovationWizard.questionAnswerData.specOptions.loading,
        specsData: state.singleProject.renovationWizard.questionAnswerData.specOptions.data,
        parameterData: state.singleProject.renovationWizard.questionAnswerData.specParameters.data,
    }));

    const [materialsAvailable, setmaterialsAvailable] = useState<{ [key: string]: string[] }>({});
    const [selectPlaceholder, setSelectPlaceholder] = useState<boolean>(false);

    useEffect(() => {
        currentQuestions.forEach((question) => {
            let data = {
                category: question.category_name,
                package_id: packageId,
                subcategory: question.item_name,
                version: "2.0",
            };
            if (question.item_name) {
                dispatch(
                    actions.singleProject.fetchSpecsOptionsStart({
                        data: data,
                        item_id: question.item_id,
                    }),
                );
            }
            question?.renoItems?.forEach((renoItem: any) => {
                dispatch(
                    actions.singleProject.fetchRenoParametersStart({
                        organisationContainerId: renoItem.org_container_item_id,
                        item_id: question.item_id,
                    }),
                );
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setmaterialsAvailable(specsData);
    }, [specsData]);

    return (
        <Box component="div" aria-label="spec-selection">
            {currentQuestions.map((currentQuestion: IcurrentQuestion) => {
                const itemId = currentQuestion.item_id;

                return (
                    <Grid
                        display={"grid"}
                        gridAutoFlow={"row"}
                        rowGap={"16px"}
                        key={currentQuestion.id}
                    >
                        <Typography variant="text_34_regular">
                            {currentQuestion.question_description}
                        </Typography>
                        <Grid
                            gridAutoFlow={"column"}
                            columnGap={"12px"}
                            display={"grid"}
                            margin={"16px 0px 48px 0px"}
                            justifyContent={"flex-start"}
                            alignItems={"center"}
                        >
                            <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />
                            <Typography
                                variant="text_18_medium"
                                whiteSpace={"nowrap"}
                            >{`${currentQuestion.item_name}`}</Typography>
                            <ArrowRight />
                            <Typography
                                variant="text_18_regular"
                                whiteSpace={"nowrap"}
                            >{`I want to`}</Typography>

                            {currentQuestion.answers
                                ?.filter((ans: any) => ans.isSelected)
                                ?.map((answer: any) => (
                                    <BaseButton
                                        key={answer.id}
                                        classes={"default"}
                                        style={{
                                            border: "0.50px #004D71 solid",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "44px",
                                        }}
                                        variant={"outlined"}
                                        labelStyles={{
                                            fontSize: 18,
                                            fontFamily: "Roboto",
                                            fontWeight: "500",
                                            wordWrap: "break-word",
                                        }}
                                        onClick={() => null}
                                        label={answer.buttonContent}
                                    />
                                ))}
                            {currentQuestion.meta_data?.is_damaged && (
                                <>
                                    <Typography
                                        variant="text_18_regular"
                                        whiteSpace={"nowrap"}
                                    >{`for`}</Typography>
                                    <BaseButton
                                        classes={"default"}
                                        style={{
                                            border: "0.50px #004D71 solid",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "44px",
                                        }}
                                        variant={"outlined"}
                                        labelStyles={{
                                            fontSize: 18,
                                            fontFamily: "Roboto",
                                            fontWeight: "500",
                                            wordWrap: "break-word",
                                        }}
                                        onClick={() => null}
                                        label={"units that are damaged"}
                                    />
                                </>
                            )}
                        </Grid>
                        <Grid
                            gridAutoFlow={"column"}
                            display={"grid"}
                            justifyContent={"space-between"}
                        >
                            <Grid display={"grid"} gridAutoFlow={"row"} rowGap={"3px"}>
                                <Typography
                                    variant="text_18_medium"
                                    whiteSpace={"nowrap"}
                                >{`Options, selected for you`}</Typography>
                                <Typography
                                    variant="text_14_regular"
                                    whiteSpace={"nowrap"}
                                >{`  Select your preferred option, as well as multiple alternates`}</Typography>
                            </Grid>
                            <Grid
                                gridAutoFlow={"column"}
                                display={"grid"}
                                justifyContent={"space-between"}
                                columnGap={"15px"}
                            >
                                <BaseButton
                                    onClick={() =>
                                        setIsModal((prevState: any) => {
                                            return {
                                                ...prevState,
                                                parameter: true,
                                            };
                                        })
                                    }
                                    label={""}
                                    endIcon={<SettingsIcon fill={"#004D71"} />}
                                >
                                    <Typography variant="text_14_medium">
                                        Set Parameters for GC
                                    </Typography>
                                </BaseButton>
                                <BaseButton
                                    onClick={() =>
                                        setIsModal((prevState: any) => {
                                            return {
                                                ...prevState,
                                                newSpec: true,
                                            };
                                        })
                                    }
                                    label={""}
                                    endIcon={<PlusIcon />}
                                >
                                    <Typography variant="text_14_medium">Add a Spec</Typography>
                                </BaseButton>
                            </Grid>
                        </Grid>
                        <AvailableSpecsMaterial
                            currentQuestion={currentQuestion}
                            specsData={
                                materialsAvailable && materialsAvailable[itemId]
                                    ? materialsAvailable && materialsAvailable[itemId]
                                    : []
                            }
                            selectedSpecs={selectedSpecs}
                            setSelectedSpecs={setSelectedSpecs}
                            setSelectPlaceholder={setSelectPlaceholder}
                            selectPlaceholder={selectPlaceholder}
                            loading={loading}
                            setDisableSpectSave={setDisableSpectSave}
                        />
                        <AvailableSpecParameters
                            currentQuestion={currentQuestion}
                            selectedParameter={selectedParameter}
                            setSelectedParameter={setSelectedParameter}
                            setSelectPlaceholder={setSelectPlaceholder}
                            selectPlaceholder={selectPlaceholder}
                            setDisableSpectSave={setDisableSpectSave}
                            setSelectedSpecs={setSelectedSpecs}
                        />
                        <Grid
                            gridAutoFlow={"column"}
                            display={"grid"}
                            justifyContent={"flex-start"}
                            columnGap={"15px"}
                        >
                            {" "}
                            {loading ? (
                                <>
                                    <Skeleton variant="text" width={250} height={30} />
                                    <Skeleton variant="text" width={250} height={30} />{" "}
                                </>
                            ) : (
                                <>
                                    <Box
                                        gap={"10px"}
                                        display={"grid"}
                                        gridAutoFlow={"column"}
                                        justifyContent={"flex-start"}
                                    >
                                        <BaseCheckbox />
                                        <Typography variant="text_14_regular">
                                            {"Request value engineering"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        gap={"10px"}
                                        display={"grid"}
                                        gridAutoFlow={"column"}
                                        justifyContent={"flex-start"}
                                    >
                                        <BaseCheckbox />
                                        <Typography variant="text_14_regular">
                                            {"Owner will provide materials for all"}
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </Grid>
                    </Grid>
                );
            })}
        </Box>
    );
};

export default SpecSelection;
