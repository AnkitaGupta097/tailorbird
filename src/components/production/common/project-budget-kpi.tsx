import { Divider, Grid, Typography } from "@mui/material";
import { isNil } from "lodash";
import React from "react";
import KeyValueRow from "./key-value-row";
import AppTheme from "styles/theme";
import ProgressBar from "./progress-bar";
import { getAppropriateDateFormat, getRoundedOffAndFormattedAmount } from "../helper";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ProjectBudgetKPI = ({ isSticky, projectBudget }: any) => {
    const {
        start_date,
        end_date,
        completed_units,
        mobilized_amount,
        renovation_units,
        total_units,
        budget,
        spend,
    } = projectBudget ?? {};
    const progress =
        renovation_units && completed_units
            ? Math.ceil((completed_units / renovation_units) * 100)
            : 0;

    const budgetDiff = spend && budget && spend - budget;

    const renderBudgetDiff = () => {
        return (
            <Grid container columnGap={1} alignItems={"center"}>
                {!isNil(budgetDiff) && budgetDiff !== 0 && (
                    <Grid item alignSelf={"center"} maxHeight={"20px"}>
                        {budgetDiff > 0 ? (
                            <ArrowUpwardIcon
                                sx={{
                                    color: "#D72C0D",
                                    height: "20px",
                                    width: "20px",
                                }}
                            />
                        ) : (
                            <ArrowDownwardIcon
                                sx={{
                                    color: "#00B779",
                                    height: "20px",
                                    width: "20px",
                                }}
                            />
                        )}
                    </Grid>
                )}
                <Grid item>
                    <Typography
                        variant="text_14_semibold"
                        color={budgetDiff && (budgetDiff > 0 ? "#D72C0D" : "#00B779")}
                    >
                        {!isNil(budgetDiff)
                            ? `$${getRoundedOffAndFormattedAmount(Math.abs(budgetDiff))}`
                            : "-"}
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid
            container
            flexDirection="column"
            border={`1px solid ${AppTheme.border.textarea}`}
            padding={isSticky ? "8px" : "16px"}
        >
            {isSticky ? (
                <Grid item>
                    <Grid container justifyContent="space-between">
                        <Grid item>
                            <KeyValueRow
                                field="Projected Budget"
                                value={budget ? `$${getRoundedOffAndFormattedAmount(budget)}` : "-"}
                                spacing={4}
                            />
                        </Grid>
                        <Grid item>
                            <KeyValueRow
                                field="Projected Spend"
                                value={spend ? `$${getRoundedOffAndFormattedAmount(spend)}` : "-"}
                                spacing={4}
                            />
                        </Grid>
                        <Grid item>
                            <KeyValueRow
                                field="Mobilized Amount"
                                value={
                                    mobilized_amount
                                        ? `$${getRoundedOffAndFormattedAmount(
                                              Number(
                                                  Object.values(mobilized_amount).reduce(
                                                      (a: any, v: any) => a + v,
                                                      0,
                                                  ),
                                              ),
                                          )}`
                                        : "-"
                                }
                                spacing={4}
                            />
                            <Divider />
                        </Grid>
                        <Grid item>
                            <KeyValueRow
                                field="Budget Over/Under"
                                value={renderBudgetDiff()}
                                spacing={4}
                            />
                        </Grid>
                    </Grid>
                    <Divider />
                </Grid>
            ) : (
                <>
                    <Grid item>
                        <KeyValueRow
                            field="Projected Budget"
                            value={budget ? `$${getRoundedOffAndFormattedAmount(budget)}` : "-"}
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Projected Spend"
                            value={spend ? `$${getRoundedOffAndFormattedAmount(spend)}` : "-"}
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Mobilized Amount"
                            value={
                                mobilized_amount
                                    ? `$${getRoundedOffAndFormattedAmount(
                                          Number(
                                              Object.values(mobilized_amount).reduce(
                                                  (a: any, v: any) => a + v,
                                                  0,
                                              ),
                                          ),
                                      )}`
                                    : "-"
                            }
                            spacing={4}
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow field="Budget Over/Under" value={renderBudgetDiff()} />
                        <Divider />
                    </Grid>
                </>
            )}

            <Grid item minHeight={"40px"}>
                <Grid container justifyContent="space-between" columnGap={2}>
                    <Grid item>
                        <KeyValueRow field="Total Units" value={total_units ?? "-"} spacing={3} />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Renovation Units"
                            value={renovation_units ?? "-"}
                            spacing={3}
                        />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Start Date"
                            value={
                                <Typography variant="valueText">
                                    {getAppropriateDateFormat(start_date)}
                                </Typography>
                            }
                            spacing={3}
                        />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="End Date"
                            value={
                                <Typography variant="valueText">
                                    {getAppropriateDateFormat(end_date)}
                                </Typography>
                            }
                            spacing={3}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {!isSticky && (
                <Grid item xs={12}>
                    <ProgressBar value={progress} />
                </Grid>
            )}
        </Grid>
    );
};

export default ProjectBudgetKPI;
