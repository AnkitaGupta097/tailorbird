/* eslint-disable */
import SearchIcon from "@mui/icons-material/Search";
import {
    Autocomplete,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Slider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_RENOVATION_UNITS, UPDATE_RENO_UNITS } from "stores/production/units/queries";
import { graphQLClient } from "utils/gql-client";
import React from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ENTRATA_JOB_PHASES } from "modules/properties/details/properties-overview/job-mapping";
import { useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useDispatch } from "react-redux";
import { useProductionContext } from "context/production-context";
import { FEATURE_FLAGS } from "../constants";

enum RenovationUnitStatus {
    UNSCHEDULED = "unscheduled",
    PENDING_ACCEPTANCE = "pending_acceptance",
    SCHEDULED = "scheduled",
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PENDING_APPROVAL = "pending_approval",
    NOT_RENOVATING = "not_renovating",
}

const next_status_validator = {
    [RenovationUnitStatus.UNSCHEDULED]: [RenovationUnitStatus.SCHEDULED],
    [RenovationUnitStatus.SCHEDULED]: [
        RenovationUnitStatus.NOT_STARTED,
        RenovationUnitStatus.UNSCHEDULED,
    ],
};

const UnitSchedulerCM = () => {
    const [unitData, setUnitData] = useState([]);
    const [searchFilter, setSearchFilter] = useState("");
    const { projectId } = useParams();
    const [selections, setSelections] = useState<any>({});
    const [nextStatus, setNextStatus] = useState<any>("");
    const [dataToRender, setDataToRender] = useState<any>([]);
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [entrataJobs, setEntrataJobs] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [contractor, setContractor] = useState<any>();
    const [entrataJob, setEntrataJob] = useState<any>();
    const dispatch = useDispatch();
    const { hasFeature } = useProductionContext();
    const showAdminView = hasFeature(FEATURE_FLAGS.ADMIN_VIEW);
    // const [updateJobPhaseMapping] = useMutation(UPDATE_PROJECT);
    const {
        propertyDetails,
        loading: projectLoading,
        projectDetails,
    } = useAppSelector((state) => {
        return {
            propertyDetails: state.propertyDetails.data,
            loading: state.propertyDetails.loading,
            projectDetails: state.singleProject.projectDetails,
        };
    });

    useEffect(() => {
        if (projectDetails?.propertyId) {
            dispatch(actions.propertyDetails.fetchPropertyDetailsStart(projectDetails?.propertyId));
        }
        return () => {
            dispatch(actions.propertyDetails.propertyDetailsInit(""));
        };
    }, [projectDetails]);

    const pms_property_id = propertyDetails?.property_id_mappings?.filter(
        (f: any) => f.type === "entrata",
    );

    const [getJobPhases, { loading: vendorLoading }] = useLazyQuery(GET_ENTRATA_JOB_PHASES, {
        variables: {
            ownershipId: propertyDetails?.ownershipGroupId,
            pmsPropertyId: pms_property_id,
        },
    });

    const getjobs: () => any = async () => {
        console.log({
            ownershipId: propertyDetails?.ownershipGroupId,
            pmsPropertyId: pms_property_id?.[0]?.property_id,
        });
        const { data: jobs }: any = await getJobPhases({
            variables: {
                ownershipId: propertyDetails?.ownershipGroupId,
                pmsPropertyId: pms_property_id?.[0]?.property_id,
            },
        });
        console.log({ entraJobsRes: jobs });
        const phases = jobs?.getEntrataJobs?.response?.result?.jobs?.job[0]?.jobPhases;
        const contracts = jobs?.getEntrataJobs?.response?.result?.jobs?.job[0]?.apContracts;
        const jobArray = phases?.jobPhase?.map((m: any) => ({
            jobPhaseId: m.id,
            jobPhaseName: m.name,
        }));
        const contractArray = contracts?.apContract?.map((m: any) => ({
            contractId: m.id,
            contractName: m.name,
        }));
        setContracts(contractArray ?? []);
        setEntrataJobs(jobArray ?? []);
    };

    const Submit = () => {
        if (!entrataJob && !contractor && !nextStatus) return setError("please select status");
        if (nextStatus == RenovationUnitStatus.SCHEDULED && (!startDate || !endDate)) {
            return setError("Start Date and End Date should be present");
        }
        let selectedIds = Object.keys(selections)?.filter(
            (selection: any) => selections[selection],
        );
        if (nextStatus) {
            let selectedUnits = dataToRender?.filter((renderUnit: any) =>
                selectedIds.includes(renderUnit.id),
            );
            let errorIds: any[] = [];
            for (let selectedUnit of selectedUnits) {
                let selectUnitNextStatuses: RenovationUnitStatus[] = (next_status_validator as any)[
                    selectedUnit.status
                ];
                if (!selectUnitNextStatuses.includes(nextStatus)) {
                    errorIds.push(selectedUnit.id);
                }
            }
            setDataToRender((prev: any) => {
                let newData = prev.map((row: any) => {
                    if (errorIds.includes(row.id)) {
                        row = { ...row, error: true };
                    } else {
                        row = { ...row, error: false };
                    }

                    return row;
                });
                return newData;
            });

            if (errorIds.length) {
                setError("you have some invalid transitions");
                return;
            }
        }

        const renoInput: any = {
            unitIds: selectedIds,
        };
        if (entrataJob && contractor) {
            const pms_input = [
                {
                    type: "entrata",
                    jobPhaseId: entrataJob.jobPhaseId?.toString(),
                    jobPhaseName: entrataJob.jobPhaseName,
                    contractName: contractor.contractName,
                    contractId: contractor.contractId,
                },
            ];
            renoInput["pmsJobPhases"] = pms_input;
        }

        if (nextStatus) {
            renoInput["status"] = nextStatus;
        }

        if (startDate) {
            renoInput["renoStartDate"] = startDate;
        }

        if (endDate) {
            renoInput["renoEndDate"] = endDate;
        }

        updateRenovationUnits(renoInput);
    };

    const columns = [
        { label: "Unit Name", key: "unit_name" },
        { label: "Floor Plan Name", key: "floor_plan_name" },
        { label: "Job Phase Name", key: "jobPhaseName" },
        { label: "Contractor Name", key: "contractName" },
        { label: "Status", key: "status" },
        { label: "Renovation Start Date", key: "renovation_start_date" },
        { label: "Renovation End Date", key: "renovation_end_date" },
    ];

    useEffect(() => {
        getRenovationUnits();

        // eslint-disable-next-line
    }, [projectId]);

    useEffect(() => {
        if (!projectLoading) {
            if (propertyDetails?.ownershipGroupId) {
                getjobs();
            }
        }
    }, [projectLoading, propertyDetails]);

    async function getRenovationUnits() {
        setLoading(true);
        const { getRenovationUnits } = await graphQLClient.query(
            "getRenovationUnits",
            GET_RENOVATION_UNITS,
            { projectId },
        );

        setUnitData(
            getRenovationUnits.map((renoUnit: any) => {
                if (renoUnit.pms_job_phases) {
                    const pms_job = JSON.parse(JSON.stringify(renoUnit.pms_job_phases?.[0]));
                    return {
                        ...renoUnit,
                        jobPhaseName: pms_job?.["job_phase_name"],
                        contractName: pms_job?.["contract_name"],
                    };
                }
                return renoUnit;
            }),
        );
        setLoading(false);
    }

    async function updateRenovationUnits(renoInput: any) {
        setLoading(true);
        const data = await graphQLClient.mutate("UpdateRenoUnits", UPDATE_RENO_UNITS, {
            renoInput,
        });

        await getRenovationUnits();
        setLoading(false);
    }

    useEffect(() => {
        if (!unitData?.length) return;
        const searchedUnitsNames = searchFilter
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);
        let data =
            searchedUnitsNames.length > 0
                ? unitData.filter((s: any) =>
                      searchedUnitsNames.includes(s.unit_name.toLowerCase()),
                  )
                : unitData;
        setDataToRender(data);
    }, [searchFilter, unitData]);

    const isGlobalChecked =
        Object.values(selections)?.filter(Boolean).length === Object.keys(selections).length;
    const hasSelections = Object.values(selections).some(Boolean);

    const handleSelectAllClick = () => {
        if (isGlobalChecked) {
            setSelections({});
        } else {
            const newSelections: any = {};
            dataToRender.forEach((row: any) => {
                newSelections[row.id] = true;
            });
            setSelections(newSelections);
        }
    };

    const handleCheckboxClick = (id: any) => {
        setSelections({ ...selections, [id]: !selections[id] });
    };
    if (!showAdminView) {
        return <></>;
    }
    return (
        <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search By Unit Name"
                    InputProps={{
                        endAdornment: <SearchIcon />,
                    }}
                />
                {hasSelections && (
                    <Grid container spacing={3} sx={{ marginTop: 5, width: "100%" }}>
                        <Grid item container xs={12} alignItems="center" spacing={2}>
                            <Grid item xs={true}>
                                <Typography variant="subtitle1">Change Status:</Typography>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: "black" }}>Status</InputLabel>{" "}
                                    <Select
                                        defaultValue=""
                                        label="Status"
                                        inputProps={{ "aria-label": "Change Reno Unit Status" }}
                                        onChange={(e) => setNextStatus(e.target.value)}
                                        value={nextStatus}
                                    >
                                        <MenuItem value={RenovationUnitStatus.UNSCHEDULED}>
                                            Unschedule
                                        </MenuItem>
                                        <MenuItem value={RenovationUnitStatus.SCHEDULED}>
                                            Schedule
                                        </MenuItem>
                                        <MenuItem value={RenovationUnitStatus.NOT_STARTED}>
                                            Release
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={Submit}>
                                    Update
                                </Button>{" "}
                                {error && <div style={{ color: "red" }}>{error}</div>}
                            </Grid>

                            <Grid
                                container
                                spacing={4}
                                display={"flex"}
                                justifyContent={"center"}
                                mt={1}
                            >
                                <Grid item xs={3}>
                                    <Autocomplete
                                        loading={vendorLoading}
                                        fullWidth
                                        options={entrataJobs}
                                        getOptionLabel={(option) => option.jobPhaseName}
                                        onChange={(_, newValue) => setEntrataJob(newValue)}
                                        isOptionEqualToValue={(option: any, value: any) => {
                                            return option.jobPhaseId === value.jobPhaseId;
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Entrata Job Phases"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {vendorLoading ? (
                                                                <CircularProgress
                                                                    color="inherit"
                                                                    size={20}
                                                                />
                                                            ) : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    style: { color: "black" },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Autocomplete
                                        loading={vendorLoading}
                                        fullWidth
                                        options={contracts}
                                        getOptionLabel={(option: any) => option?.contractName}
                                        onChange={(_, newValue) => setContractor(newValue)}
                                        isOptionEqualToValue={(option: any, value: any) => {
                                            return option?.contractId === value?.contractId;
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Entrata Contracts"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {vendorLoading ? (
                                                                <CircularProgress
                                                                    color="inherit"
                                                                    size={20}
                                                                />
                                                            ) : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    style: { color: "black" },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {nextStatus == RenovationUnitStatus.SCHEDULED && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Change Date(s) :
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="date"
                                            label="Schedule Start Date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                                color: "primary",
                                                style: { color: "black" },
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="date"
                                            label="Shedule End Date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                                color: "primary",
                                                style: { color: "black" },
                                            }} // Label color adjusted here
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>

            <Grid item xs={12}>
                {loading ? (
                    "Loading ....."
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                Object.values(selections)?.filter(Boolean).length >
                                                    0 && !isGlobalChecked
                                            }
                                            checked={isGlobalChecked}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.key}>{column.label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataToRender?.map((row: any) => (
                                    <TableRow
                                        key={row.id}
                                        selected={!!selections[row.id]}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                        }}
                                        style={{
                                            backgroundColor: (row?.error &&
                                                selections[row.id] &&
                                                "red") as any,
                                        }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={!!selections[row.id]}
                                                onChange={() => handleCheckboxClick(row.id)}
                                            />
                                        </TableCell>
                                        {columns.map((column) => (
                                            <TableCell key={`${row.id}-${column.key}`}>
                                                {column.key === "contractor" ? (
                                                    <Select
                                                        defaultValue=""
                                                        fullWidth
                                                        value={row.contractor}
                                                    >
                                                        <MenuItem value="Joe">Joe</MenuItem>
                                                        <MenuItem value="Jess">Jess</MenuItem>
                                                        <MenuItem value="Heather">Heather</MenuItem>
                                                        <MenuItem value="Varun">Varun</MenuItem>
                                                    </Select>
                                                ) : column.key === "down_payment" ? (
                                                    <Slider
                                                        defaultValue={30}
                                                        step={1}
                                                        marks
                                                        min={0}
                                                        max={100}
                                                        valueLabelDisplay="auto"
                                                    />
                                                ) : (
                                                    row[column.key]
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Grid>
        </Grid>
    );
};

export default UnitSchedulerCM;
