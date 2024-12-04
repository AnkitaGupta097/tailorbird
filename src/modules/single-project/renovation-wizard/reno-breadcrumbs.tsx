/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Box, Card, Typography } from "@mui/material";
import { useAppSelector } from "stores/hooks";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import appTheme from "styles/theme";
import { has, isEmpty, map } from "lodash";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const RenoBreadCrumbs = () => {
    const { categoryData, currentCategoryId, breadCrumbTopLevel } = useAppSelector((state) => {
        return {
            breadCrumbTopLevel: state.singleProject.renovationWizard.breadCrumbTopLevel.data,
            categoryData: state.singleProject.renovationWizard.questionAnswerData.data,
            currentCategoryId:
                state.singleProject.renovationWizard.questionAnswerData.currentCategoryId,
        };
    });

    const [breadcrumbData, setBreadcrumbData] = useState<any>([]);

    useEffect(() => {
        const data: any[] = [];
        map(categoryData, (item) => {
            data.push({
                name: item.name,
                icon: item.name,
                categoryId: item.category_id,
                isDone: has(item, "isDone") ? true : false,
            });
        });
        setBreadcrumbData([...breadCrumbTopLevel, ...data]);
        // eslint-disable-next-line
    }, [categoryData, breadCrumbTopLevel]);

    const getIcon = (data: any) => {
        if (data.isDone === true) {
            return <CheckCircleIcon style={{ fill: appTheme.text.success, marginRight: "5px" }} />;
        }

        if ((data.categoryId && currentCategoryId == data.categoryId) || data.isCurrent) {
            return (
                <ArrowCircleRightIcon
                    sx={{
                        fill: appTheme.buttons.primary,
                    }}
                />
            );
        }
        // }
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
                <Box py={5} px={2}>
                    {map(breadcrumbData, (data: any) => {
                        return (
                            <Box display="flex" alignItems="center" mb={1}>
                                <Box width="30px">{getIcon(data)}</Box>
                                <Box flexGrow={1}>
                                    <img
                                        src={getCategoryIcon(data.icon)}
                                        width={20}
                                        height={20}
                                        alt={`${data.icon} icon`}
                                        style={{ paddingRight: "5px" }}
                                        className="Scope-table-reno-category-image"
                                    />
                                    <Typography
                                        variant={
                                            (data.categoryId &&
                                                currentCategoryId == data.categoryId) ||
                                            data.isCurrent
                                                ? "text_16_semibold"
                                                : "text_16_regular"
                                        }
                                        color={appTheme.border.medium}
                                    >
                                        {data.name}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Card>
        </Box>
    );
};

export default RenoBreadCrumbs;
