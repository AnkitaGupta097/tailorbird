import React, { useState } from "react";
import { Typography, CircularProgress, Box, Grid, Divider } from "@mui/material";
import BaseButton from "components/button";
import actions from "stores/actions";
import { useSnackbar } from "notistack";
import { useAppDispatch } from "stores/hooks";
import BaseSnackbar from "components/base-snackbar";
import BaseCheckbox from "components/checkbox";
import BaseTextField from "components/text-field";

interface QuestionAnswerWrapperProps {
    qtnKey: any;
    catIndex: any;
    question: string;
    hint: string;
    loading: boolean;
    contentData: any[];
    setContentData?: any;
    isRoomSelection?: boolean;
    questionInfo?: any;
    questionAnswerData?: any;
}

const QuestionAnswerWrapper: React.FC<QuestionAnswerWrapperProps> = ({
    qtnKey,
    catIndex,
    question,
    hint,
    loading,
    contentData,
    setContentData,
    isRoomSelection,
    questionInfo,
    questionAnswerData,
}) => {
    const dispatch = useAppDispatch();
    const ButtonRows = () => {
        const { enqueueSnackbar } = useSnackbar();

        const updateRoomSelection = (data: any) => {
            dispatch(
                actions.singleProject.updateRoomSelectionOnStore({
                    data: data,
                }),
            );
        };

        const showSnackBar = (variant: any, message: string) => {
            enqueueSnackbar("", {
                variant: variant,
                action: <BaseSnackbar variant={variant} title={message} />,
            });
        };

        const handleClick = (
            index: number, // The index of the selected button
            next_question_id: any, // The ID of the next question
            isSkipButton: boolean, // Indicates if the button is a "Skip" button
            button: any, // The selected button object
        ) => {
            if (isRoomSelection) {
                let updated: any[];
                if (button.isExclusive) {
                    updated = contentData.map((btn: any, i: number) => {
                        if (i == index) {
                            return { ...btn, isSelected: !btn.isSelected }; // Toggle the isSelected property of the selected btn
                        }
                        return { ...btn, isSelected: false };
                    });
                } else {
                    updated = contentData.map((btn: any, i: number) => {
                        if (i == index) {
                            return { ...btn, isSelected: !btn.isSelected }; // Toggle the isSelected property of the selected btn
                        }
                        if (btn.isExclusive) {
                            return { ...btn, isSelected: false };
                        }
                        return { ...btn };
                    });
                }
                setContentData && setContentData(updated); // Update the content data with the updated button selection
                updateRoomSelection(updated); // Update the room selection
            } else {
                let questionAnswerDataCopy: any = JSON.parse(JSON.stringify(questionAnswerData)); // Create a deep copy of the questionAnswerData object

                // Find the index of the current question within the category
                const currentQtnIndex = questionAnswerDataCopy[catIndex].questions.findIndex(
                    (item: any) => item.id == qtnKey, // Find the index of the current question
                );

                let isPreviouslySelected =
                    questionAnswerDataCopy[catIndex].questions[currentQtnIndex].answers[index]
                        .isSelected; // Check if the selected button was previously selected

                // Toggle the isSelected property of the selected answer and current question
                questionAnswerDataCopy[catIndex].questions[currentQtnIndex].answers[
                    index
                ].isSelected = !isPreviouslySelected;
                questionAnswerDataCopy[catIndex].questions[currentQtnIndex].isSelected =
                    !isPreviouslySelected;

                if (questionInfo.isSubcategoryQuestion) {
                    // Dispatch action to update the current category ID
                    dispatch(
                        actions.singleProject.updateCurrentCategoryId({
                            currentCategoryId: questionAnswerDataCopy[catIndex].category_id,
                        }),
                    );

                    // Handle "Skip" button logic
                    if (isSkipButton) {
                        // Update skipped categories data
                        dispatch(
                            actions.singleProject.updateSkippedCategorys({
                                data: questionInfo,
                                isSelected: !isPreviouslySelected,
                            }),
                        );

                        // Reset answers and queue numbers for skipped question
                        questionAnswerDataCopy[catIndex].questions[currentQtnIndex].answers =
                            questionAnswerDataCopy[catIndex].questions[currentQtnIndex].answers.map(
                                (copyItem: any, i: number) => {
                                    if (i === index) {
                                        return copyItem;
                                    } else {
                                        return {
                                            ...copyItem,
                                            isSelected: false,
                                        };
                                    }
                                },
                            );

                        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[
                            catIndex
                        ].questions.map((copyItem: any, i: number) => {
                            if (i === currentQtnIndex) {
                                return copyItem;
                            } else {
                                return {
                                    ...copyItem,
                                    qtnQueueNum: null,
                                };
                            }
                        });
                    } else {
                        // Handle non-"Skip" button logic

                        // Reset other answers if they are marked to skip
                        questionAnswerDataCopy[catIndex].questions[currentQtnIndex].answers =
                            questionAnswerDataCopy[catIndex].questions[currentQtnIndex].answers.map(
                                (copyItem: any) => {
                                    if (copyItem.isToSkipQuestion) {
                                        return { ...copyItem, isSelected: false };
                                    } else {
                                        return copyItem;
                                    }
                                },
                            );

                        const maxQtnQueueNum = Math.max(
                            ...questionAnswerDataCopy[catIndex].questions.map(
                                (item: any) => item.qtnQueueNum || 0, // Find the maximum qtnQueueNum value in the current category
                            ),
                        );

                        // Update queue numbers and properties for the next question
                        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[
                            catIndex
                        ].questions.map((copyItem: any) => {
                            if (copyItem.id == next_question_id) {
                                copyItem.isParentSelected = !isPreviouslySelected; // Toggle the isParentSelected property of the next question
                                if (!isPreviouslySelected) {
                                    return {
                                        ...copyItem,
                                        qtnQueueNum: Number((maxQtnQueueNum + 1).toFixed(1)), // Increment the qtnQueueNum value
                                    };
                                } else {
                                    return {
                                        ...copyItem,
                                        qtnQueueNum: null, // Set the qtnQueueNum value to null
                                    };
                                }
                            } else {
                                if (isPreviouslySelected && copyItem.qtnQueueNum) {
                                    return {
                                        ...copyItem,
                                        qtnQueueNum: copyItem.item_id
                                            ? Number((copyItem.qtnQueueNum - 0.1).toFixed(1))
                                            : Number((copyItem.qtnQueueNum - 1).toFixed(1)), // Decrement the qtnQueueNum value
                                    };
                                } else {
                                    return copyItem;
                                }
                            }
                        });
                    }
                } else {
                    // Handle non-subcategory question logic

                    // Find the index of the next question within the category
                    const nextQuestionIndex = questionAnswerDataCopy[catIndex].questions.findIndex(
                        (it: any) => it.id == next_question_id, // Find the index of the next question
                    );

                    if (
                        nextQuestionIndex < 0 &&
                        !isPreviouslySelected &&
                        button.container_item_id
                    ) {
                        showSnackBar("error", "No Question Found For The Selected Item.");
                    }
                    if (
                        nextQuestionIndex < 0 &&
                        !isPreviouslySelected &&
                        !button.container_item_id
                    ) {
                        showSnackBar(
                            "error",
                            "Container item was not present for the selected scope.",
                        );
                    }

                    const maxQtnQueueNumInCurrentRoom = Math.max(
                        ...questionAnswerDataCopy[catIndex].questions
                            .filter((qtn: any) => qtn.room_name == questionInfo.room_name)
                            .map((item: any) => item.qtnQueueNum || 0),
                    );

                    // Enable the next question to be visible on the UI
                    questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[
                        catIndex
                    ].questions.map((copyItem: any) => {
                        if (copyItem.id == next_question_id) {
                            return {
                                ...copyItem,
                                qtnQueueNum: Number((maxQtnQueueNumInCurrentRoom + 0.1).toFixed(1)),
                            };
                        } else {
                            return copyItem;
                        }
                    });
                }

                // Dispatch action to update question and answer data
                dispatch(
                    actions.singleProject.updateQuestionAnswerDataAfterSelectionChange({
                        data: questionAnswerDataCopy,
                    }),
                );
            }
        };

        return (
            <div
                style={{
                    height: "auto",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 16,
                    display: "flex",
                    flexWrap: "wrap",
                }}
            >
                {contentData?.map(
                    (
                        button: {
                            isToSkipQuestion: boolean;
                            isExclusive: boolean;
                            next_question_id: any;
                            isSelected: any;
                            buttonContent: string;
                        },
                        index: number,
                    ) => (
                        <BaseButton
                            key={index}
                            classes={button.isSelected ? "primary default" : "selected default"}
                            style={{
                                border: "0.50px #004D71 solid",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "44px",
                            }}
                            variant={button.isSelected ? "contained" : "outlined"}
                            labelStyles={{
                                fontSize: 18,
                                fontFamily: "Roboto",
                                fontWeight: "500",
                                wordWrap: "break-word",
                            }}
                            onClick={() =>
                                handleClick(
                                    index,
                                    button.next_question_id,
                                    button.isToSkipQuestion,
                                    button,
                                )
                            }
                            label={button.buttonContent}
                        />
                    ),
                )}
            </div>
        );
    };
    const handleSaveConditionsButton = (questionId: any, meta_field: any, condition: any) => {
        let questionAnswerDataCopy: any = JSON.parse(JSON.stringify(questionAnswerData)); // Create a deep copy of the questionAnswerData object

        //enable next question to visible on UI
        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[catIndex].questions.map(
            (copyItem: any) => {
                if (copyItem.id == questionId) {
                    return {
                        ...copyItem,
                        meta_data: {
                            ...copyItem.meta_data,
                            [meta_field]: condition,
                        },
                    };
                } else {
                    return copyItem;
                }
            },
        );

        dispatch(
            actions.singleProject.updateQuestionAnswerDataAfterSelectionChange({
                data: questionAnswerDataCopy,
            }),
        );
    };
    const [condition, setCondition] = useState("");

    function handleClickMetaDataUpdatesButton(questionId: any, meta_field: any) {
        let questionAnswerDataCopy: any = JSON.parse(JSON.stringify(questionAnswerData)); // Create a deep copy of the questionAnswerData object
        questionAnswerDataCopy[catIndex].questions = questionAnswerDataCopy[catIndex].questions.map(
            (copyItem: any) => {
                if (copyItem.id == questionId) {
                    return {
                        ...copyItem,
                        meta_data: {
                            ...copyItem.meta_data,
                            [meta_field]:
                                copyItem?.meta_data && copyItem?.meta_data[meta_field] === undefined
                                    ? true
                                    : !copyItem?.meta_data?.[meta_field],
                        },
                    };
                } else {
                    return copyItem;
                }
            },
        );
        dispatch(
            actions.singleProject.updateQuestionAnswerDataAfterSelectionChange({
                data: questionAnswerDataCopy,
            }),
        );
    }
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
                position: "relative", // Add this
            }}
        >
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "40%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1,
                    }}
                >
                    <CircularProgress />
                </div>
            )}
            <Typography variant="text_34_regular">{question}</Typography>
            {questionInfo?.item_id ? (
                <>
                    <Grid
                        gridAutoFlow={"column"}
                        columnGap={"1.5rem"}
                        display={"grid"}
                        margin={"2rem 2rem"}
                    >
                        <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2 }} />
                        <Grid gridAutoFlow={"row"} rowGap={"18px"} display={"grid"}>
                            <Typography variant="text_18_medium">{`${questionInfo.item_name}`}</Typography>
                            <ButtonRows />
                            <Box
                                gap={"10px"}
                                display={"grid"}
                                gridAutoFlow={"column"}
                                justifyContent={"flex-start"}
                            >
                                <BaseCheckbox
                                    onClick={() =>
                                        handleClickMetaDataUpdatesButton(
                                            questionInfo.id,
                                            "is_damaged",
                                        )
                                    }
                                />
                                <Typography variant="text_14_regular">
                                    {"Only do this if the item is damaged"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid gridAutoFlow={"row"} rowGap={"16px"} display={"grid"} margin={"0 2rem"}>
                        <Typography variant="text_18_regular">{`Would this apply to specific ${questionInfo.item_name}? If not, please continue below.`}</Typography>
                        <Grid
                            gap={"20px"}
                            display={"grid"}
                            gridAutoFlow={"column"}
                            justifyContent={"flex-start"}
                        >
                            <BaseButton
                                key={"only-some-units"}
                                classes={
                                    questionInfo?.meta_data?.is_some_units
                                        ? "primary default"
                                        : "selected default"
                                }
                                style={{
                                    border: "0.50px #004D71 solid",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "44px",
                                }}
                                variant={
                                    questionInfo?.meta_data?.is_some_units
                                        ? "contained"
                                        : "outlined"
                                }
                                labelStyles={{
                                    fontSize: 18,
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    wordWrap: "break-word",
                                }}
                                onClick={() =>
                                    handleClickMetaDataUpdatesButton(
                                        questionInfo.id,
                                        "is_some_units",
                                    )
                                }
                                label={"Only in Some Units"}
                            />
                            <BaseButton
                                key={"create-lower-budget-version"}
                                classes={
                                    questionInfo?.meta_data?.is_dependant
                                        ? "primary default"
                                        : "selected default"
                                }
                                style={{
                                    border: "0.50px #004D71 solid",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "44px",
                                }}
                                variant={
                                    questionInfo?.meta_data?.is_dependant ? "contained" : "outlined"
                                }
                                labelStyles={{
                                    fontSize: 18,
                                    fontFamily: "Roboto",
                                    fontWeight: "500",
                                    wordWrap: "break-word",
                                }}
                                onClick={() =>
                                    handleClickMetaDataUpdatesButton(
                                        questionInfo.id,
                                        "is_dependant",
                                    )
                                }
                                label={"Create Lower Budget Version"}
                            />
                        </Grid>
                        <Typography variant="text_16_regular">{`Based on existing conditions`}</Typography>
                    </Grid>
                    {questionInfo?.meta_data?.is_some_units && (
                        <Grid
                            display={"grid"}
                            gridAutoFlow={"column"}
                            justifyContent={"space-between"}
                            margin={"0 2rem"}
                            width={`calc(100% - 4rem)`}
                        >
                            <Grid display={"grid"} gridAutoFlow={"row"} rowGap={4}>
                                <Grid display={"grid"} gridAutoFlow={"row"} rowGap={2}>
                                    <Typography variant="text_16_medium">{`What is the state of item that would necessitate this scope? `}</Typography>
                                    <Typography variant="text_14_medium">{`e.g. if countertop is laminate, replace`}</Typography>
                                </Grid>
                                <Grid display={"grid"} gridAutoFlow={"column"} columnGap={4}>
                                    <BaseTextField
                                        onChange={(e: {
                                            target: { value: React.SetStateAction<string> };
                                        }) => setCondition(e.target.value)}
                                        style={{
                                            borderRadius: "4px",
                                            border: "1px solid var(--v-3-colors-border-normal-hovered, #999EA4)",
                                            background: " var(--Color, #FFF)",
                                        }}
                                        size="small"
                                    />
                                    <BaseButton
                                        key={"condition"}
                                        classes="primary default"
                                        variant="contained"
                                        labelStyles={{
                                            fontSize: 14,
                                            fontFamily: "Roboto",
                                            fontWeight: "500",
                                            wordWrap: "break-word",
                                        }}
                                        onClick={() =>
                                            handleSaveConditionsButton(
                                                questionInfo.id,
                                                "condition",
                                                condition,
                                            )
                                        }
                                        label={"Save Conditions"}
                                    />
                                </Grid>
                            </Grid>
                            <Grid display={"grid"} gridAutoFlow={"row"} rowGap={3}>
                                <Typography variant="text_14_medium">{`current conditions:`}</Typography>
                                <Typography variant="text_14_regular">{`if granite, demo and install`}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </>
            ) : (
                <Grid gridAutoFlow={"row"} rowGap={"30px"} display={"grid"}>
                    <Typography variant="text_18_light">{hint}</Typography>
                    <ButtonRows />
                </Grid>
            )}
        </div>
    );
};

export default QuestionAnswerWrapper;
