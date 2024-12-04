/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Grid,
} from "@mui/material";
import RenoHeader from "../common/reno-header";
import ErrorIcon from "@mui/icons-material/Error";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import appTheme from "styles/theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import actions from "../../../stores/actions";
import { map, size, keys, filter } from "lodash";
import Loader from "modules/admin-portal/common/loader";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getCategoryIcon } from "modules/projects/details/budgeting/category-icons";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { STEPS_NAME } from "../contants";

const ScopeSummary = () => {
    const dispatch = useAppDispatch();
    const { currentInventory, renoItemList, loading } = useAppSelector((state) => {
        return {
            currentInventory: state.singleProject.renovationWizard.currentInventory,
            inventoryList: state.singleProject.renovationWizard.inventoryList.data,
            renoItemList: state.singleProject.renovationWizard.renoItemList.data,
            loading: state.singleProject.renovationWizard.renoItemList.loading,
        };
    });
    const [expanded, setExpanded] = useState<string[]>([`panel-${keys(renoItemList)[0]}`]);

    const changeExpanded = (e: any, panel: string, newExpanded: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (newExpanded) {
            setExpanded([...expanded, panel]);
        } else {
            setExpanded([...expanded.filter((e: any) => e !== panel)]);
        }
    };

    return (
        <Box sx={{ filter: `blur(${loading ? "2px" : "0px"}) ` }}>
            {loading && (
                <Box position="absolute" width="100%" zIndex={1}>
                    <Loader />
                </Box>
            )}
            <Box display="flex" justifyContent="space-between">
                <RenoHeader title={`${currentInventory?.name} Scope Summary`} />
            </Box>
            <Box mt={10} mb={4} ml={8}>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => dispatch(actions.singleProject.previousStep(""))}
                >
                    <ArrowBackIcon
                        style={{ fill: appTheme.scopeHeader.label, marginRight: "5px" }}
                    />
                    <Typography variant="text_14_medium" color={appTheme.scopeHeader.label}>
                        Go to Previous
                    </Typography>
                </Box>
            </Box>
            <Box mb={10}>
                {map(renoItemList, (category, index) => {
                    let sum = 0;
                    map(category, (item) => (sum = sum + size(item)));
                    return (
                        <Box display="flex">
                            {currentInventory.scope_status == "completed" && (
                                <ErrorIcon
                                    sx={{
                                        fill: appTheme.buttons.error,
                                        marginTop: "15px",
                                        paddingRight: "10px",
                                    }}
                                />
                            )}
                            <Accordion
                                expanded={expanded.includes(`panel-${index}`)}
                                disableGutters={true}
                                key={`panel-${index}`}
                                className="Scope-table-section-cat-table"
                                style={{
                                    marginTop: `${index == "0" ? "0px" : "1px"}`,
                                    border: "1px solid #EEEEEE",
                                    borderRadius: "8px",
                                    flexGrow: 1,
                                }}
                            >
                                <AccordionSummary
                                    onClick={(e) =>
                                        changeExpanded(
                                            e,
                                            `panel-${index}`,
                                            !expanded.includes(`panel-${index}`),
                                        )
                                    }
                                    expandIcon={
                                        <ArrowDropDownIcon sx={{ fill: appTheme.text.white }} />
                                    }
                                    aria-controls={`panel-${index}d-content`}
                                    id={`panel-${index}d-header`}
                                    className="Scope-table-category-title-group"
                                    style={{
                                        paddingLeft: "16px",
                                        backgroundColor: appTheme.buttons.primary,
                                        borderRadius: "8px",
                                    }}
                                >
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <img
                                            src={getCategoryIcon(index)}
                                            width={20}
                                            height={20}
                                            style={{ marginRight: "5px" }}
                                            alt={`${index} icon`}
                                            className="Scope-table-reno-category-image"
                                        />
                                        <Typography
                                            variant="text_16_medium"
                                            color={appTheme.common.white}
                                        >
                                            {`${index} ( ${sum} items )`}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails style={{ padding: "0px" }}>
                                    {map(category, (room: any, roomName) => {
                                        return (
                                            <Box>
                                                <Grid
                                                    container
                                                    height="60px"
                                                    alignItems="center"
                                                    sx={{
                                                        backgroundColor: appTheme.background.header,
                                                    }}
                                                    px={4}
                                                    py={2}
                                                >
                                                    <Grid item md={1}>
                                                        <Box alignItems="center" display="flex">
                                                            {currentInventory.scope_status ==
                                                                "completed" && (
                                                                <ErrorOutlineIcon
                                                                    sx={{
                                                                        paddingRight: "2px",
                                                                    }}
                                                                />
                                                            )}
                                                            <Typography variant="text_14_medium">
                                                                {roomName}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <Typography variant="text_14_medium">
                                                            {`Items (${size(room)})`}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <Typography variant="text_14_medium">
                                                            Actions
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={1} pr={2}>
                                                        <Typography variant="text_14_medium">
                                                            Spec Selection
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={1}>
                                                        <Typography variant="text_14_medium">
                                                            All Units
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={1}>
                                                        <Typography variant="text_14_medium">
                                                            Done as Needed
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <Typography variant="text_14_medium">
                                                            Only In Some Units
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={2}>
                                                        <Typography variant="text_14_medium">
                                                            Budget Version
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Divider />
                                                {map(room, (item, itemName) => {
                                                    const data = filter(
                                                        item,
                                                        (row) =>
                                                            row.work_type == "Material" &&
                                                            !row.subcategory.includes(
                                                                "Install kit",
                                                            ),
                                                    );
                                                    return (
                                                        <>
                                                            <Grid
                                                                container
                                                                alignItems="center"
                                                                px={4}
                                                                py={3}
                                                            >
                                                                <Grid
                                                                    item
                                                                    md={1}
                                                                    justifyContent="center"
                                                                    display="flex"
                                                                >
                                                                    {currentInventory.scope_status ==
                                                                        "completed" && (
                                                                        <div>
                                                                            <ErrorIcon
                                                                                sx={{
                                                                                    fill: appTheme
                                                                                        .buttons
                                                                                        .error,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Grid>
                                                                <Grid item md={2}>
                                                                    <Typography
                                                                        variant="text_16_regular"
                                                                        color={
                                                                            appTheme.border.medium
                                                                        }
                                                                    >
                                                                        {itemName}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={2} pl={2}>
                                                                    {map(
                                                                        item.filter(
                                                                            (row: any) =>
                                                                                row.work_type ==
                                                                                "Labor",
                                                                        ),
                                                                        (data) => {
                                                                            return (
                                                                                <Box mt={1}>
                                                                                    <Typography
                                                                                        variant="text_16_regular"
                                                                                        color={
                                                                                            appTheme
                                                                                                .border
                                                                                                .medium
                                                                                        }
                                                                                    >
                                                                                        {data.scope}
                                                                                    </Typography>
                                                                                </Box>
                                                                            );
                                                                        },
                                                                    )}
                                                                </Grid>
                                                                <Grid item md={1} pr={2}>
                                                                    <Typography
                                                                        variant="text_16_regular"
                                                                        color={
                                                                            appTheme.border.medium
                                                                        }
                                                                    >
                                                                        {data[0]?.spec_selection
                                                                            ? data[0]
                                                                                  ?.spec_selection
                                                                            : "--"}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={1}>
                                                                    <Typography
                                                                        variant="text_16_regular"
                                                                        color={
                                                                            appTheme.border.medium
                                                                        }
                                                                    >
                                                                        {data[0]?.all_units
                                                                            ? "yes"
                                                                            : "--"}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={1}>
                                                                    <Typography
                                                                        variant="text_16_regular"
                                                                        color={
                                                                            appTheme.border.medium
                                                                        }
                                                                    >
                                                                        {data[0]?.done_as_needed
                                                                            ? "yes"
                                                                            : "--"}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item md={2}>
                                                                    <Typography
                                                                        variant="text_16_regular"
                                                                        color={
                                                                            appTheme.border.medium
                                                                        }
                                                                    >
                                                                        {data[0]?.only_in_some_unit
                                                                            ? data[0]
                                                                                  ?.only_in_some_unit
                                                                            : "--"}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    md={2}
                                                                    display="flex"
                                                                    justifyContent="space-between"
                                                                >
                                                                    <Typography
                                                                        variant="text_16_regular"
                                                                        color={
                                                                            appTheme.border.medium
                                                                        }
                                                                    >
                                                                        {data[0]?.budget_version
                                                                            ? data[0]
                                                                                  ?.budget_version
                                                                            : "--"}
                                                                    </Typography>
                                                                    <ArrowCircleRightOutlinedIcon
                                                                        sx={{
                                                                            fill: appTheme.buttons
                                                                                .primary,
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => {
                                                                            dispatch(
                                                                                actions.singleProject.changeStep(
                                                                                    STEPS_NAME.CATEGORY_QUESTIONS,
                                                                                ),
                                                                            );
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <Divider />
                                                        </>
                                                    );
                                                })}
                                            </Box>
                                        );
                                    })}
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ScopeSummary;
