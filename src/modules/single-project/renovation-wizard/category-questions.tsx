import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import QuestionAnswerWrapper from "./question-answer-wrapper";
import actions from "stores/actions";

const CategoryQuestions: React.FC = () => {
    const dispatch = useAppDispatch();
    const { questionAnswerData, loading, presentCategoryId, presentQuestionId } = useAppSelector(
        (state) => ({
            questionAnswerData: state.singleProject.renovationWizard.questionAnswerData.data,
            presentQuestionId:
                state.singleProject.renovationWizard.questionAnswerData.currentQuestionId,

            loading: state.singleProject.renovationWizard.rooms.loading,
            presentCategoryId:
                state.singleProject.renovationWizard.questionAnswerData.currentCategoryId,
        }),
    );
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    useEffect(() => {
        setCurrentCategoryIndex(
            questionAnswerData.findIndex((item: any) => item.category_id == presentCategoryId),
        );
    }, [presentCategoryId, questionAnswerData]);

    useEffect(() => {
        if (presentQuestionId == null && presentCategoryId == null) {
            let currentCategoryId = null;
            let currentQuestionId = null;

            if (questionAnswerData) {
                questionAnswerData?.map((detail: any, idx: number) => {
                    let isSubcategoryQuestionUpdated = false;
                    if (idx == 0) {
                        currentCategoryId = detail.category_id;
                    }

                    return {
                        ...detail,
                        questions: detail?.questions?.map((question: any, index: number) => {
                            const isSubcategoryQuestion = question.isSubcategoryQuestion;

                            const copyUpdated = {
                                ...question,
                                buttonContent: question.question_description,
                                isSubcategoryQuestion: question.room_name == null && index == 0,
                                isCurrentQuestion:
                                    isSubcategoryQuestion && isSubcategoryQuestionUpdated == false,
                                qtnQueueNum:
                                    isSubcategoryQuestion && isSubcategoryQuestionUpdated == false
                                        ? Number(0.0)
                                        : null,

                                prevQtnQueueNum: null,
                                answers: question.answers.map((answer: any) => {
                                    return {
                                        ...answer,
                                        buttonContent: answer.answer_description,
                                        isSelected: false,
                                    };
                                }),
                            };

                            if (
                                isSubcategoryQuestion == true &&
                                idx == 0 &&
                                isSubcategoryQuestionUpdated == false
                            ) {
                                currentQuestionId = question.id;
                            }
                            if (isSubcategoryQuestion == true) {
                                isSubcategoryQuestionUpdated = true;
                            }
                            return copyUpdated;
                        }),
                    };
                });
            }

            dispatch(
                actions.singleProject.updateCurrentCategoryId({
                    currentCategoryId: currentCategoryId,
                }),
            );
            dispatch(
                actions.singleProject.updateCurrentQuestionId({
                    currentQuestionId: currentQuestionId,
                }),
            );
        }
        // eslint-disable-next-line
    }, []);
    console.log("questionAnswerData", questionAnswerData);

    return (
        <>
            {questionAnswerData
                ?.filter((cat: any) => cat.category_id == presentCategoryId)
                .map((item: any, index: any) => {
                    return (
                        <div key={index}>
                            {item?.questions
                                ?.filter((qtn: any) => qtn.isCurrentQuestion)
                                ?.map(
                                    (question: {
                                        question_description: string;
                                        id: any;
                                        answers: any[];
                                    }) => {
                                        return (
                                            <QuestionAnswerWrapper
                                                key={question?.id}
                                                catIndex={currentCategoryIndex}
                                                qtnKey={question?.id}
                                                question={question?.question_description}
                                                hint={"Select all that apply"}
                                                contentData={question?.answers}
                                                loading={loading}
                                                questionInfo={question}
                                                questionAnswerData={questionAnswerData}
                                            />
                                        );
                                    },
                                )}
                        </div>
                    );
                })}
        </>
    );
};
export default CategoryQuestions;
