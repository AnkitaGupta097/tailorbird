import React, { useEffect } from "react";
import { isNil } from "lodash";
import KeyValueRow from "../common/key-value-row";
import { Divider, Grid, Typography } from "@mui/material";
import CollapsibleSection from "components/collapsible-section";
import { ReactComponent as ChevronUp } from "../../../assets/icons/chevron_Circle_Up.svg";
import { ReactComponent as ChevronDown } from "../../../assets/icons/Chevron_Circle_Down.svg";
import { getAppropriateDateFormat, getRoundedOffAndFormattedAmount } from "../helper";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { shallowEqual } from "react-redux";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import HumanReadableDate from "components/human-readable-date";

interface IUnitKPIProps {
    unit: any;
}

export const UnitKPIDetailCard = ({ unit, style }: any) => {
    const { current_contract_value, original_contract_value, cost_to_complete } =
        unit?.renoBudgetStat ?? {};
    const budgetDiff =
        current_contract_value &&
        original_contract_value &&
        current_contract_value - original_contract_value;

    return (
        <Grid container columnSpacing={4} marginBottom="16px" maxHeight="300px" style={style}>
            <Grid item xs={6}>
                <Grid container flexDirection="column">
                    <Grid item maxHeight={"40px"}>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <KeyValueRow field="Unit Type" value={unit.unit_type} spacing={4} />
                            </Grid>
                            <Grid item>
                                <KeyValueRow
                                    field="Floor Plan"
                                    value={unit.floor_plan_name}
                                    spacing={4}
                                />
                            </Grid>
                            <Grid item>
                                <KeyValueRow field="Sq FT" value={unit.area} spacing={4} />
                            </Grid>
                        </Grid>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Move-out Date"
                            value={
                                <Typography variant="text_14_semibold">
                                    {getAppropriateDateFormat(unit.move_out_date)}
                                </Typography>
                            }
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Release Date"
                            value={
                                <Typography variant="text_14_semibold">
                                    <HumanReadableDate dateString={unit.release_date} />
                                </Typography>
                            }
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Make Ready Date"
                            value={
                                <Typography variant="text_14_semibold">
                                    {getAppropriateDateFormat(unit.make_ready_date)}
                                </Typography>
                            }
                        />
                        <Divider />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container flexDirection="column">
                    <Grid item>
                        <KeyValueRow
                            field="Original Contract Value"
                            value={
                                original_contract_value
                                    ? `$${getRoundedOffAndFormattedAmount(original_contract_value)}`
                                    : "-"
                            }
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Current Contract Value"
                            value={
                                current_contract_value
                                    ? `$${getRoundedOffAndFormattedAmount(current_contract_value)}`
                                    : "-"
                            }
                        />
                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Budget Over/Under"
                            value={
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
                                            color={
                                                budgetDiff &&
                                                (budgetDiff > 0 ? "#D72C0D" : "#00B779")
                                            }
                                        >
                                            {!isNil(budgetDiff)
                                                ? `$${getRoundedOffAndFormattedAmount(
                                                      Math.abs(budgetDiff),
                                                  )}`
                                                : "-"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            }
                        />

                        <Divider />
                    </Grid>
                    <Grid item>
                        <KeyValueRow
                            field="Cost to Complete"
                            value={
                                cost_to_complete
                                    ? `$${getRoundedOffAndFormattedAmount(cost_to_complete)}`
                                    : "-"
                            }
                        />
                        <Divider />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const UnitKPI = ({ unit }: IUnitKPIProps) => {
    const { budgetStats } = useAppSelector((state) => {
        return {
            budgetStats:
                state.renoUnitsData.unitsBudget && state.renoUnitsData.unitsBudget[unit.id],
        };
    }, shallowEqual);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!budgetStats) {
            dispatch(
                actions.production.unit.fetchRenovationUnitBudgetStatStart({
                    renoUnitId: unit.id,
                }),
            );
        }
        // eslint-disable-next-line
    }, []);

    return (
        <CollapsibleSection
            defaultCollapsed={true}
            expandLabel="Show Above"
            collapseLabel="Hide Above"
            expandIcon={<ChevronDown style={{ marginRight: "7px" }} />}
            collapseIcon={<ChevronUp style={{ marginRight: "7px" }} />}
            alignContent="above"
            components={[
                <UnitKPIDetailCard
                    key="kpi-detail"
                    unit={{ ...unit, renoBudgetStat: budgetStats }}
                />,
            ]}
            componentStyling={{ transition: "max-height 1s ease", maxHeight: "300px" }}
        />
    );
};

export default UnitKPI;
