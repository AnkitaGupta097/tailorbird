// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useAppSelector } from "stores/hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import BaseDataGrid from "components/data-grid";
import { graphQLClient } from "utils/gql-client";
import { useParams } from "react-router-dom";
import { UPDATE_PROJECT } from "stores/projects/details/index/index-queries";

export const GET_ENTRATA_JOB_PHASES = gql`
    query getEntrataJobs($ownershipId: String, $pmsPropertyId: String) {
        getEntrataJobs(ownership_id: $ownershipId, pms_property_id: $pmsPropertyId)
    }
`;

const PROPERTY_PROJECT_QUERY = gql`
    query GetProjects($propertyId: String, $version: String) {
        getProjects(property_id: $propertyId, version: $version) {
            id
            name
            project_type
            created_at
            version
            pms_job_phases
        }
    }
`;

const JobMapping = () => {
    const { propertyId } = useParams();
    const [rows, setRows] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [projects, setProjects] = useState([]);
    const [entrataJobs, setEntrataJobs] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [updateJobPhaseMapping] = useMutation(UPDATE_PROJECT);
    const [rowsPerPageOptions] = useState([5, 10, 25]);
    const { propertyDetails, loading } = useAppSelector((state) => {
        return {
            propertyDetails: state.propertyDetails.data,
            loading: state.propertyDetails.loading,
        };
    });

    async function getProjects() {
        const data = await graphQLClient.query("getProjects", PROPERTY_PROJECT_QUERY, {
            propertyId,
        });
        const projects = data.getProjects.filter(
            (project: any) => project.project_type.toLowerCase() != "default",
        );
        setProjects(projects);
    }
    console.log(projects, "projects");

    const columns = [
        {
            field: "name",
            headerName: "Project Name",
            width: 400,
            valueGetter: ({ row }) => row?.name,
        },
        {
            field: "project_type",
            headerName: "Project type",
            width: 400,
            valueGetter: ({ row }) => row?.project_type,
        },
        {
            field: "job_phase_id",
            headerName: "Job Phase Id",
            width: 300,
            valueGetter: ({ row }) =>
                row.pms_job_phases?.find((f) => f.type === "entrata")?.job_phase_id,
        },
        {
            field: "job_phase_name",
            headerName: "Job Phase Name",
            width: 300,
            valueGetter: ({ row }) =>
                row.pms_job_phases?.find((f) => f.type === "entrata")?.job_phase_name,
        },
        {
            field: "contract_id",
            headerName: "Contract Id",
            width: 300,
            valueGetter: ({ row }) =>
                row.pms_job_phases?.find((f) => f.type === "entrata")?.contract_id,
        },
        {
            field: "contract_name",
            headerName: "Contract Name",
            width: 300,
            valueGetter: ({ row }) =>
                row.pms_job_phases?.find((f) => f.type === "entrata")?.contract_name,
        },
    ];
    useEffect(() => {
        getProjects();
        // eslint-disable-next-line
    }, [propertyId]);

    const pms_property_id = propertyDetails?.property_id_mappings?.filter(
        (f: any) => f.type === "entrata",
    );
    const [getJobPhases, { loading: vendorLoading }] = useLazyQuery(GET_ENTRATA_JOB_PHASES, {
        variables: {
            ownershipId: propertyDetails?.ownershipGroupId,
            pmsPropertyId: pms_property_id,
        },
    });
    const { enqueueSnackbar } = useSnackbar();
    const getjobs = async () => {
        console.log(pms_property_id[0].property_id, propertyDetails.ownershipGroupId);

        const { data: jobs } = await getJobPhases({
            variables: {
                ownershipId: propertyDetails.ownershipGroupId,
                pmsPropertyId: pms_property_id[0].property_id,
            },
        });
        console.log({ jobs });
        const phases = jobs?.getEntrataJobs?.response?.result?.jobs?.job[0]?.jobPhases;
        const contracts = jobs?.getEntrataJobs?.response?.result?.jobs?.job[0]?.apContracts;
        const jobArray = phases.jobPhase.map((m) => ({
            jobPhaseId: m.id,
            jobPhaseName: m.name,
        }));
        const contractArray = contracts.apContract.map((m) => ({
            contractId: m.id,
            contractName: m.name,
        }));
        setContracts(contractArray);
        setEntrataJobs(jobArray);
    };

    useEffect(() => {
        if (!loading) {
            if (propertyDetails?.ownershipGroupId) {
                getjobs();
            }
        }
    }, [loading]);

    const handleAddRow = () => {
        setRows([
            ...rows,
            { tailorbirdProject: null, entrataJob: null, entrataContract: null, id: nextId },
        ]);
        setNextId(nextId + 1);
    };

    const handleRemoveRow = (indexToRemove) => {
        setRows((prevRows) => prevRows.filter((_, index) => index !== indexToRemove));
    };

    const isSaveDisabled = rows.some((row) => !row.tailorbirdProject || !row.entrataJob);

    const handleSave = () => {
        const mappedData = rows.map((row) => ({
            tailorbird_project_id: row.tailorbirdProject ? row.tailorbirdProject.id : null,
            job_phase_id: row.entrataJob ? row.entrataJob.jobPhaseId : null,
            job_phase_name: row.entrataJob ? row.entrataJob.jobPhaseName : null,
            contract_name: row.entrataContract ? row.entrataContract.contractName : null,
            contract_id: row.entrataContract ? row.entrataContract.contractId : null,
        }));
        console.log("Saving data:", mappedData);
        const input = {
            pms_type: "entrata",
            job_phase_id: mappedData[0].job_phase_id.toString(),
            job_phase_name: mappedData[0].job_phase_name,
            contract_name: mappedData[0].contract_name,
            contract_id: mappedData[0].contract_id,
        };

        updateJobPhaseMapping({
            variables: {
                project_id: mappedData[0].tailorbird_project_id,
                input,
            },
        })
            .then(() => {
                enqueueSnackbar("", {
                    variant: "success",
                    action: (
                        <BaseSnackbar variant={"success"} title={"JobPhase Mapped Successfully"} />
                    ),
                });
                getProjects();
            })
            .catch(() => {
                enqueueSnackbar("", {
                    variant: "error",
                    action: <BaseSnackbar variant={"error"} title={"Some Error Occurred."} />,
                });
            });
    };

    const handleChange = (index, key, value) => {
        console.log(index, key, value);

        const newRows = [...rows];
        newRows[index][key] = value;
        setRows(newRows);
    };
    // const data = projects.map((item: any) => ({ ...item, id: item.tailorbirdVendor?.id }));

    return (
        <div>
            <Box sx={{ textAlign: "center" }} mt={3}>
                <Typography variant="title">Job Phase Mapping</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" margin={4}>
                <Button variant="contained" color="primary" onClick={handleAddRow}>
                    Add Row
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSave}
                    style={{ marginLeft: 10 }}
                    disabled={isSaveDisabled}
                >
                    Save
                </Button>
            </Box>
            {rows.map((row, index) => (
                <Grid
                    container
                    spacing={4}
                    key={row.id}
                    display={"flex"}
                    justifyContent={"center"}
                    mt={1}
                >
                    <Grid item xs={4}>
                        <Autocomplete
                            fullWidth
                            options={projects ?? []}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, newValue) =>
                                handleChange(index, "tailorbirdProject", newValue)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Projects"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { color: "black" },
                                    }}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            loading={vendorLoading}
                            fullWidth
                            options={entrataJobs}
                            getOptionLabel={(option) => option.jobPhaseName}
                            onChange={(_, newValue) => handleChange(index, "entrataJob", newValue)}
                            isOptionEqualToValue={(option, value) => {
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
                                                    <CircularProgress color="inherit" size={20} />
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
                            getOptionLabel={(option) => option.contractName}
                            onChange={(_, newValue) =>
                                handleChange(index, "entrataContract", newValue)
                            }
                            isOptionEqualToValue={(option, value) => {
                                return option.contractId === value.contractId;
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
                                                    <CircularProgress color="inherit" size={20} />
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
                    <Grid item xs={2}>
                        <IconButton variant="contained" onClick={() => handleRemoveRow(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            {
                <Box mt={4}>
                    <BaseDataGrid
                        loa
                        rows={projects}
                        columns={columns}
                        rowsPerPageOptions={rowsPerPageOptions}
                        checkboxSelection
                        disableSelectionOnClick
                        loading={vendorLoading}
                        // onSelectionModelChange={(newSelection: string[]) => {
                        //     setSelected(newSelection);
                        // }}
                        // selectionModel={selected}
                        // components={{
                        //     BaseCheckbox: BaseCheckbox,
                        // }}
                    />
                </Box>
            }
        </div>
    );
};

export default JobMapping;
