/* eslint-disable */
import { Button, Checkbox, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { useAppDispatch } from "stores/hooks";
import { UPDATE_RENO_UNITS } from "stores/production/units/queries";
import { graphQLClient } from "utils/gql-client";
import actions from "stores/actions";
import LoadingButton from "@mui/lab/LoadingButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { EditCalendar } from "@mui/icons-material";

type Props = {
    state?: string;
    checkedUnits: string[];
    projectId: string | undefined;
    resetUnitMap: any;
    setSelectedType: any;
    setCheckAll: any;
};

enum RenovationUnitStatus {
    UNSCHEDULED = "unscheduled",
    SCHEDULED = "scheduled",
    NOT_STARTED = "not_started",
    NOT_RENOVATING = "not_renovating",
}

const stateMap: any = {
    scheduled: ["Unschedule", "Release", "Non Reno"],
    unscheduled: ["Schedule", "Non Reno","Release"],
    released: ["Non Reno"],
    nonReno: ["Renovate"],
};

const tabTransition: any = {
    Unschedule: "unscheduled",
    Schedule: "scheduled",
    Release: "released",
    "Non Reno": "nonReno",
    Renovate: "released",
};

const unitStateMap: any = {
    Unschedule: RenovationUnitStatus.UNSCHEDULED,
    Schedule: RenovationUnitStatus.SCHEDULED,
    Release: RenovationUnitStatus.NOT_STARTED,
    "Non Reno": RenovationUnitStatus.NOT_RENOVATING,
    Renovate: RenovationUnitStatus.NOT_STARTED,
};

const UnitsBlukUpdater: FC<Props> = ({
    state,
    checkedUnits,
    projectId,
    resetUnitMap,
    setSelectedType,
    setCheckAll
}) => {
    const selectedUnitMaps = checkedUnits;
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [selectedState, setSelectedState] = useState<string>("");
    const [startDate, setStartDate] = useState<string>();
    const [check, setCheck] = useState<boolean>(false)
    const [isDatePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    async function updateRenovationUnits(renoInput: any) {
        setLoading(true);
        await graphQLClient.mutate("UpdateRenoUnits", UPDATE_RENO_UNITS, {
            renoInput,
        });

        dispatch(
            actions.production.unit.fetchRenovationUnitsStart({
                project_id: projectId,
            }),
        );
        setLoading(false);
        setSelectedType(tabTransition[selectedState]);
        resetUnitMap();
    }

    const updateUnits = () => {
        const nextState = unitStateMap[selectedState];
        const renoInput: any = {
            unitIds: selectedUnitMaps,
            status: nextState,
        };
        if (startDate) {
            renoInput["renoStartDate"] = startDate;
        }
        if (nextState) {
            updateRenovationUnits(renoInput);
        }
    };
    const enableButton = selectedState && (selectedState == "Schedule" ? !!startDate : true);
    return selectedUnitMaps?.length ? (
        <Grid container flexDirection="row" id={"unit-bulk-updater"} alignItems="center">
            <Grid item>
                <Checkbox
                    style={{ color: "grey" }}
                    onClick={() => {
                        setCheckAll(check);
                        setCheck(!check);
                    }}
                    checked={check}
                />
            </Grid>
            <Grid item spacing={2} marginRight={2} width={200}>
                <Select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value as any)}
                    defaultValue=""
                    inputProps={{ "aria-label": "Change Reno Unit Status" }}
                    fullWidth
                >
                    {state &&
                        stateMap[state].map((nextState: string) => (
                            <MenuItem key={nextState} value={nextState}>
                                {nextState}
                            </MenuItem>
                        ))}
                </Select>
            </Grid>
            {selectedState == "Schedule" && (
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item md={6} width={300}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MuiDatePicker
                                    onClose={() => {
                                        setDatePickerOpen(false);
                                    }}
                                    open={isDatePickerOpen}
                                    value={startDate}
                                    onChange={(arg) => {
                                        const scheduledDate = (arg as any)?.toDate?.();
                                        const offset =
                                            scheduledDate.getTimezoneOffset() * 60 * 1000;
                                        const adjustedDate = new Date(
                                            scheduledDate.getTime() - offset,
                                        );
                                        const formattedDate = adjustedDate
                                            .toISOString()
                                            .split("T")[0];
                                        setStartDate(formattedDate);
                                    }}
                                    renderInput={(props) => (
                                        <>
                                            {/* The textfield is required to open the date-selection-modal in the same position as the button */}
                                            <TextField
                                                {...props}
                                                style={{
                                                    visibility: "hidden",
                                                    height: "0px",
                                                    position: "absolute",
                                                }}
                                            />
                                                <Button
                                                    startIcon={<EditCalendar />}
                                                    fullWidth
                                                    variant={"contained"}
                                                    color="primary"
                                                    onClick={() => {
                                                        setDatePickerOpen(true);
                                                    }}
                                                    style={{
                                                        height: "36px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <Typography variant="text_16_medium">
                                                        Schedule Unit
                                                    </Typography>
                                                </Button>
                                        
                                        </>
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <LoadingButton
                variant="contained"
                color="primary"
                disabled={!enableButton}
                onClick={() => updateUnits()}
                loading={loading}
                style={{ marginLeft: 5 }}
            >
                Move Units
            </LoadingButton>
        </Grid>
    ) : (
        <></>
    );
};

export default UnitsBlukUpdater;
