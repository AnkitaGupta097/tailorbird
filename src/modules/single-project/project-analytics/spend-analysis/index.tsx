import React, { useEffect, useState } from "react";
import { isNil, isNumber } from "lodash";
import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Divider,
    Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "components/button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChangeOrderModal from "./change-order-modal";
import MonthlySpendModal from "./monthly-spend-modal";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { getRoundedOffAndFormattedAmount } from "components/production/helper";

function SpendAnalysis() {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
    const [showMonthlySpendModal, setShowMonthlySpendModal] = useState(false);

    const { estimatedBudget, actualSpend } = useAppSelector(
        (state) => ({
            estimatedBudget: state.singleProject.projectAnalytics.spendAnalysis.estimatedBudget,
            actualSpend: state.singleProject.projectAnalytics.spendAnalysis.actualSpend,
        }),
        shallowEqual,
    );

    const budgetDiff =
        isNumber(estimatedBudget) && isNumber(actualSpend)
            ? estimatedBudget - actualSpend
            : undefined;

    const diffSign = budgetDiff ? (budgetDiff > 0 ? "-" : "+") : undefined;

    const percentageBudgetDiff =
        isNumber(budgetDiff) && estimatedBudget
            ? Math.abs((budgetDiff * 100) / estimatedBudget).toFixed(2)
            : undefined;

    useEffect(() => {
        dispatch(
            actions.singleProject.fetchProjectBudgetStart({
                projectId,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Accordion elevation={0}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-level-bid-content"
                    id="panel-level-bid-header"
                >
                    <Typography variant="text_18_semibold" color={"#232323"} marginLeft={"2rem"}>
                        Spend Analysis
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Stack sx={Styles.content} alignItems={"baseline"}>
                        <Stack sx={Styles.details}>
                            <Stack sx={Styles.Flex}>
                                <Typography variant="text_16_semibold" color="#232323">
                                    Estimated Budget
                                </Typography>
                                <Typography variant="text_14_regular" color="#232323">
                                    {isNil(estimatedBudget)
                                        ? "-"
                                        : `$${getRoundedOffAndFormattedAmount(estimatedBudget)}`}
                                </Typography>
                            </Stack>
                            <Stack sx={Styles.Flex}>
                                <Typography variant="text_16_semibold" color="#232323">
                                    Projected Actual Spend
                                </Typography>
                                <Typography variant="text_14_regular" color="#232323">
                                    {isNil(actualSpend)
                                        ? "-"
                                        : `$${getRoundedOffAndFormattedAmount(actualSpend)}`}
                                </Typography>
                            </Stack>
                            <Typography
                                variant="text_16_semibold"
                                color={budgetDiff ? (budgetDiff > 0 ? "#00B779" : "#D72C0D") : ""}
                                textAlign={"end"}
                                width={"100%"}
                                style={{ borderTop: "1px solid #C9CCCF", paddingTop: "5px" }}
                            >
                                {!isNil(budgetDiff)
                                    ? `${diffSign}$${getRoundedOffAndFormattedAmount(
                                          Math.abs(budgetDiff),
                                      )} (${diffSign}${percentageBudgetDiff}%)`
                                    : "-"}
                            </Typography>
                        </Stack>
                        <Stack sx={Styles.details}>
                            <Button
                                classes="primary outlined"
                                onClick={() => setShowChangeOrderModal(true)}
                                label={""}
                                endIcon={<ArrowForwardIosIcon />}
                                style={{
                                    width: "fit-content",
                                    borderRadius: "4px",
                                    border: "1px solid var(--v-3-colors-action-primary-default, #004D71)",
                                    alignItems: "center",
                                    padding: "10px 20px",
                                }}
                            >
                                <Typography variant="text_16_semibold">
                                    View Budget Approvals and Change Orders
                                </Typography>
                            </Button>
                            <Divider sx={{ height: "1px", color: "#C9CCCF" }} />
                            <Button
                                classes="primary outlined"
                                onClick={() => setShowMonthlySpendModal(true)}
                                label={""}
                                endIcon={<ArrowForwardIosIcon />}
                                style={{
                                    width: "fit-content",
                                    borderRadius: "4px",
                                    border: "1px solid var(--v-3-colors-action-primary-default, #004D71)",
                                    alignItems: "center",
                                    padding: "10px 20px",
                                }}
                            >
                                <Typography variant="text_16_semibold">
                                    View Month by Month Spend Details
                                </Typography>
                            </Button>
                        </Stack>
                    </Stack>
                </AccordionDetails>
            </Accordion>
            {showChangeOrderModal && (
                <ChangeOrderModal
                    openModal={showChangeOrderModal}
                    modalHandler={setShowChangeOrderModal}
                />
            )}
            {showMonthlySpendModal && (
                <MonthlySpendModal
                    openModal={showMonthlySpendModal}
                    modalHandler={setShowMonthlySpendModal}
                />
            )}
        </>
    );
}
export default SpendAnalysis;
const Styles = {
    details: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "20px",
        flex: "0.4",
    },
    content: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: "60px",
        justifyContent: "center",
        marginBottom: "2rem",
    },
    Flex: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
};
