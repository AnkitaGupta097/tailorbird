import React, { useEffect, useState } from "react";
import { isEmpty, isNil, isNumber, sumBy } from "lodash";
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
import RenoTimeModal from "./renovation-time-modal";
import MonthlyUnitTurnedModal from "./monthly-unit-turned-modal";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { INITIAL_RENO_TIME_TABLE_COLUMNS } from "stores/single-project/single-project-init";
import moment from "moment";

function RenoavtionTime() {
    const [showRenoTimeModal, setShowRenoTimeModal] = useState(false);
    const [showMonthlyUnitModal, setShowMonthlyUnitModal] = useState(false);
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const { monthlyUnits, avgRenoTimePerUnit } = useAppSelector(
        (state) => ({
            monthlyUnits:
                state.singleProject.projectAnalytics.renovationTime.monthByMonthUnitsTurned,
            avgRenoTimePerUnit:
                state.singleProject.projectAnalytics.renovationTime.renoTimeByUnit
                    .avgRenoTimePerUnit,
        }),
        shallowEqual,
    );

    const averageUnitsTurnedPerMonth = monthlyUnits?.length
        ? `${(sumBy(monthlyUnits, "count") / monthlyUnits.length).toFixed(2)} units`
        : "-";

    useEffect(() => {
        if (isEmpty(monthlyUnits)) {
            dispatch(
                actions.singleProject.fetchMonthlyTurnedUnitsStart({
                    projectId,
                }),
            );
        }

        if (isNil(avgRenoTimePerUnit)) {
            dispatch(
                actions.singleProject.fetchRenoTimeByUnitStart({
                    projectId,
                    columns: INITIAL_RENO_TIME_TABLE_COLUMNS,
                }),
            );
        }
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
                        Renovation Time
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Stack sx={Styles.content} alignItems={"center"}>
                        <Stack sx={Styles.details}>
                            <Stack sx={Styles.Flex}>
                                <Typography variant="text_16_semibold" color="#232323">
                                    Average Renovation Time per Unit:
                                </Typography>
                                <Typography
                                    variant="text_14_regular"
                                    color="#232323"
                                    minWidth={"70px"}
                                >
                                    {isNumber(avgRenoTimePerUnit)
                                        ? `${moment
                                              .duration(avgRenoTimePerUnit, "seconds")
                                              .asDays()
                                              .toFixed(4)} days`
                                        : "-"}
                                </Typography>
                            </Stack>
                            <Divider sx={{ height: "1px", color: "#C9CCCF" }} />
                            <Stack sx={Styles.Flex}>
                                <Typography variant="text_16_semibold" color="#232323">
                                    Average Number of Units Turned per Month:
                                </Typography>
                                <Typography
                                    variant="text_14_regular"
                                    color="#232323"
                                    minWidth={"70px"}
                                >
                                    {averageUnitsTurnedPerMonth}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack sx={Styles.details}>
                            <Button
                                classes="primary outlined"
                                onClick={() => setShowRenoTimeModal(true)}
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
                                    View Renovation Time by Unit
                                </Typography>
                            </Button>
                            <Divider sx={{ height: "1px", color: "#C9CCCF" }} />
                            <Button
                                classes="primary outlined"
                                onClick={() => setShowMonthlyUnitModal(true)}
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
                                    View Month by Month of Units Turned
                                </Typography>
                            </Button>
                        </Stack>
                    </Stack>
                </AccordionDetails>
            </Accordion>
            {showRenoTimeModal && (
                <RenoTimeModal openModal={showRenoTimeModal} modalHandler={setShowRenoTimeModal} />
            )}
            {showMonthlyUnitModal && (
                <MonthlyUnitTurnedModal
                    openModal={showMonthlyUnitModal}
                    modalHandler={setShowMonthlyUnitModal}
                />
            )}
        </>
    );
}
export default RenoavtionTime;

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
