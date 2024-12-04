import React, { useEffect, useState } from "react";
import { isEmpty, map } from "lodash";
import { Typography, Dialog, Box, FormControlLabel, RadioGroup } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Button from "components/button";
import AppTheme from "styles/theme";
import actions from "stores/actions";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router";
import MonthlySpendTable from "./monthly-spend-table";
import BaseRadio from "components/radio";
import { kebabToSentenceCase } from "components/production/approvals/utils";

interface IMonthlySpendModalProps {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
}
const MonthlySpendModal = ({ modalHandler, openModal }: IMonthlySpendModalProps) => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const [groupColumn, setGroupColumn] = useState("category");

    const { monthlySpends, loading } = useAppSelector(
        (state) => ({
            monthlySpends:
                state.singleProject.projectAnalytics.spendAnalysis.spendAnalysisMonthByMonth,
            loading: state.singleProject.loading,
        }),
        shallowEqual,
    );

    useEffect(() => {
        const existingData =
            groupColumn === "category" ? monthlySpends.category : monthlySpends.workType;

        if (isEmpty(existingData)) {
            dispatch(
                actions.singleProject.fetchMonthlySpendAnalysisStart({
                    projectId,
                    groupColumn: groupColumn === "workType" ? "work_type" : "category",
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupColumn]);

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth={"lg"}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={6}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${AppTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">Spend Analysis Month by Month</Typography>
                <CloseOutlined
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                    }}
                />
            </Box>
            <Box p={6} minHeight="150px">
                <RadioGroup
                    aria-labelledby="radio-buttons-group"
                    name="radio-buttons-group"
                    row
                    sx={{ marginBottom: "16px" }}
                    value={groupColumn}
                    onChange={(e: any) => setGroupColumn(e.target.value)}
                >
                    <FormControlLabel
                        value="category"
                        control={<BaseRadio size="small" />}
                        label={<Typography variant="text_14_regular">By Category</Typography>}
                    />
                    <FormControlLabel
                        value="workType"
                        control={<BaseRadio size="small" />}
                        label={
                            <Typography variant="text_14_regular">
                                By Labor and Materials
                            </Typography>
                        }
                    />
                </RadioGroup>
                <MonthlySpendTable
                    loading={loading}
                    monthlySpends={
                        groupColumn === "category"
                            ? monthlySpends.category
                            : map(monthlySpends.workType, (obj) => ({
                                  ...obj,
                                  category: kebabToSentenceCase(obj.category),
                              }))
                    }
                />
            </Box>
            <Box>
                <Box pb={5} px={6} display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        style={{ height: "40px" }}
                        onClick={() => modalHandler(false)}
                        label={""}
                    >
                        <Typography variant="text_16_semibold"> Close</Typography>
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default MonthlySpendModal;
