import React, { useEffect, useState } from "react";
import { isNil, isUndefined } from "lodash";
import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Stack,
    Divider,
    Box,
    Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "components/button";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import RenoProgressDetails from "./reno-progress-details";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";

interface ICreateNewItemModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    renovationProgress: any;
}
//supportive fuunctions
const RenovationProgressDetailsModal = ({
    modalHandler,
    openModal,
    renovationProgress,
}: ICreateNewItemModal) => {
    const { totalRenoUnits, totalUnitsInprop, inprogress, completed, notStarted } =
        renovationProgress ?? {};

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
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_18_bold">Renovation Progress Information</Typography>
                <CloseOutlinedIcon
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
                <RenoProgressGraph
                    completed={completed}
                    inProgress={inprogress}
                    notStarted={notStarted}
                    totalCount={totalUnitsInprop}
                    renoUnitCount={totalRenoUnits}
                />
                <RenoProgressDetails />
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

const RenoProgressGraph = ({
    completed,
    inProgress,
    notStarted,
    totalCount,
    renoUnitCount,
}: any) => {
    const calculatePercentage = (value: any, total: any) => {
        return total && !isNil(value) ? ((value / total) * 100).toFixed(2) : undefined;
    };
    const completedWidth = calculatePercentage(completed, renoUnitCount);
    const inProgressWidth = calculatePercentage(inProgress, renoUnitCount);
    const notStartedWidth = calculatePercentage(notStarted, renoUnitCount);

    const displayCompleted = isUndefined(completedWidth)
        ? "-"
        : `${completed} (${completedWidth}%)`;
    const displayInprogress = isUndefined(inProgressWidth)
        ? "-"
        : `${inProgress} (${inProgressWidth}%)`;
    const displayNotStarted = isUndefined(notStartedWidth)
        ? "-"
        : `${notStarted} (${notStartedWidth}%)`;

    return (
        <Stack sx={Styles.content}>
            <Stack sx={Styles.details}>
                <Stack sx={Styles.Flex}>
                    <Typography variant="text_16_semibold" color="#232323">
                        Total Units in Property:
                    </Typography>
                    <Typography variant="text_14_regular" color="#232323">
                        {totalCount}
                    </Typography>
                </Stack>
                <Divider sx={{ height: "1px", borderColor: "#C9CCCF", width: "100%" }} />
                <Stack sx={Styles.Flex}>
                    <Typography variant="text_16_semibold" color="#232323">
                        Total to Renovate:
                    </Typography>
                    <Typography variant="text_14_regular" color="#232323">
                        {renoUnitCount}
                    </Typography>
                </Stack>
            </Stack>

            <div style={{ flex: "0.5" }}>
                <div
                    style={{
                        width: "100%",
                        height: "16px",
                        backgroundColor: "lightgray",
                        borderRadius: "5px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <div
                        style={{
                            width: `${completedWidth}%`,
                            height: "100%",
                            backgroundColor: "#00B779",
                            borderRadius: "5px 0px 0px 5px",
                        }}
                    ></div>
                    <div
                        style={{
                            width: `${inProgressWidth}%`,
                            height: "100%",
                            backgroundColor: "#FFAB00",
                        }}
                    ></div>
                    <div
                        style={{
                            width: `${notStartedWidth}%`,
                            height: "100%",
                            backgroundColor: "gray",
                            borderRadius: "0px 5px 5px 0px",
                        }}
                    ></div>
                </div>
                <div
                    style={{
                        marginTop: "10px",
                        display: "flex",
                        flexDirection: "row",
                        gap: 27,
                    }}
                >
                    <Stack
                        direction={"column"}
                        gap={1}
                        sx={{
                            alignItems: "start",
                        }}
                    >
                        <Typography
                            variant="text_14_medium"
                            style={{
                                color: "#6D7175",
                            }}
                        >
                            Completed
                        </Typography>
                        <Typography
                            variant="text_16_semibold"
                            style={{
                                color: "#00B779",
                                textAlign: "center",
                            }}
                        >
                            {displayCompleted}
                        </Typography>
                    </Stack>
                    <Stack
                        direction={"column"}
                        gap={1}
                        sx={{
                            alignItems: "start",
                        }}
                    >
                        <Typography
                            variant="text_14_medium"
                            style={{
                                color: "#6D7175",
                            }}
                        >
                            In Progress
                        </Typography>
                        <Typography
                            variant="text_16_semibold"
                            style={{
                                color: "#FFAB00",
                                textAlign: "center",
                            }}
                        >
                            {displayInprogress}
                        </Typography>
                    </Stack>
                    <Stack
                        direction={"column"}
                        gap={1}
                        sx={{
                            alignItems: "start",
                        }}
                    >
                        <Typography
                            variant="text_14_medium"
                            style={{
                                color: "#6D7175",
                            }}
                        >
                            Not Started
                        </Typography>
                        <Typography
                            variant="text_16_semibold"
                            style={{
                                color: "#6D7175",
                                textAlign: "center",
                            }}
                        >
                            {displayNotStarted}
                        </Typography>
                    </Stack>
                </div>
            </div>
        </Stack>
    );
};
//ends

function RenoavtionProgress() {
    const [showProgressModal, setShowProgressModal] = useState(false);
    const dispatch = useAppDispatch();
    const { projectId } = useParams();

    const { renovationProgress } = useAppSelector(
        (state) => ({
            renovationProgress: state.singleProject.projectAnalytics.renovationProgress,
            // loading: state.singleProject.loading,
        }),
        shallowEqual,
    );

    const { totalRenoUnits, totalUnitsInprop, inprogress, completed, notStarted } =
        renovationProgress ?? {};

    useEffect(() => {
        dispatch(
            actions.singleProject.fetchUnitStatusMapStart({
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
                        Renovation Progress
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <RenoProgressGraph
                        completed={completed}
                        inProgress={inprogress}
                        notStarted={notStarted}
                        totalCount={totalUnitsInprop}
                        renoUnitCount={totalRenoUnits}
                    />
                    <Stack alignItems={"center"} marginBottom={2} marginRight="2.5%">
                        <Button
                            classes="primary outlined"
                            onClick={() => setShowProgressModal(true)}
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
                            <Typography variant="text_16_semibold">Open Details</Typography>
                        </Button>
                    </Stack>
                </AccordionDetails>
            </Accordion>
            {showProgressModal && (
                <RenovationProgressDetailsModal
                    modalHandler={setShowProgressModal}
                    openModal={showProgressModal}
                    renovationProgress={renovationProgress}
                />
            )}
        </>
    );
}
export default RenoavtionProgress;

const Styles = {
    details: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "20px",
        flex: "0.3",
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
