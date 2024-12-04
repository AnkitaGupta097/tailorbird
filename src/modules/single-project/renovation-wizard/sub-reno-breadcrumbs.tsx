import React from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import appTheme from "styles/theme";
import { map, find, filter, isEmpty, has } from "lodash";
import { useAppSelector } from "stores/hooks";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import { ReactComponent as SuccessIcon } from "assets/icons/success-icon.svg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const SubRenoBreadCrumbs = ({ currentQuestions }: any) => {
    const { questionAnswerData } = useAppSelector((state) => {
        return {
            questionAnswerData: state.singleProject.renovationWizard.questionAnswerData,
        };
    });
    const { currentCategoryId, data } = questionAnswerData;
    const currentCategory = find(data, { category_id: currentCategoryId });

    let subset = {};
    if (!isEmpty(currentCategory)) {
        subset = filter(
            currentCategory.questions,
            (questions: any) => questions.room_name && questions.category_id && !questions.item_id,
        );
    }

    const getIcon = (answer: any) => {
        if (has(answer, "isDone")) {
            return (
                <CheckCircleIcon
                    style={{
                        fill: appTheme.text.success,
                        marginRight: "5px",
                    }}
                />
            );
        }
        if (answer.isSelected) {
            return <SuccessIcon />;
        }
        if (currentQuestions.item_name == answer.buttonContent) {
            return (
                <ArrowCircleRightIcon
                    sx={{
                        fill: appTheme.buttons.primary,
                    }}
                />
            );
        }
    };
    return (
        <Box mr={4}>
            <Card
                sx={{
                    width: "100%",
                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.10)",
                    minHeight: "500px",
                }}
            >
                <Box py={5} px={3}>
                    <Box display="flex" alignItems="center" mb={3}>
                        <img
                            src={getCategoryIcon(currentCategory?.name)}
                            width={20}
                            height={20}
                            alt={`${currentCategory?.name} icon`}
                            style={{ paddingRight: "5px" }}
                            className="Scope-table-reno-category-image"
                        />
                        <Typography variant="text_16_semibold" color={appTheme.border.medium}>
                            {currentCategory?.name}
                        </Typography>
                    </Box>
                    <Divider />
                    {!isEmpty(subset) &&
                        map(subset, (data: any) => {
                            return (
                                <Box mt={2} pl={2}>
                                    <Typography
                                        variant="text_16_regular"
                                        color={appTheme.border.medium}
                                    >
                                        {data.room_name}
                                    </Typography>
                                    <Box>
                                        {map(data.answers, (answer) => {
                                            return (
                                                <Box
                                                    pl={2}
                                                    mb={1}
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    <Box width={"30px"}>{getIcon(answer)}</Box>
                                                    <Typography
                                                        variant={
                                                            answer.isSelected
                                                                ? "text_16_bold"
                                                                : "text_16_regular"
                                                        }
                                                        color={appTheme.border.medium}
                                                    >
                                                        {answer.buttonContent}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            );
                        })}
                </Box>
            </Card>
        </Box>
    );
};

export default SubRenoBreadCrumbs;
