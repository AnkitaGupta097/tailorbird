import { Dangerous, InfoOutlined } from "@mui/icons-material";
import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";

import BaseDataGrid from "components/data-grid";
import React, { useEffect, useState } from "react";
import { GET_ALL_PROPERTIES } from "stores/projects/properties/property-queries";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECTS, MIGRATE_PROJECTS } from "./constants";
import TrackerUtil from "utils/tracker";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

const ProjectMigration = () => {
    const [propertyList, setPropertyList] = useState([] as Array<any>);
    const [selectedProperty, setSelectedProperty] = useState(undefined as any);
    const [selectedInterior, setSelectedInterior] = useState("");
    const [selectedCommonArea, setSelectedCommonArea] = useState("");
    const [selectedExterior, setSelectedExterior] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [migrationErrors, setMigrationErrors] = useState({} as any);
    const featureDisabled = useFeature(FeatureFlagConstants.PROPERTY_BACK_FILL).off;
    async function getProperty() {
        const projects = (await graphQLClient.query("getProjects", GET_PROJECTS)).getProjects;
        const response = (
            await graphQLClient.query("getProperties", GET_ALL_PROPERTIES)
        ).getProperties.map((s: any) => {
            const _projects = projects.filter((project: any) => project.property_id == s.id);
            console.log({ _projects });
            return {
                ...s,
                projects: _projects,
                num_projects: _projects.length,
                user_action_required: true,
            };
        });
        setPropertyList(response);
    }

    async function sendForMigration() {
        setIsLoading(true);
        setMigrationErrors({});
        try {
            const response = await graphQLClient.mutate("migrateProjects", MIGRATE_PROJECTS, {
                propertyId: selectedProperty.id,
                interiorProjectId: selectedInterior,
                commonAreaProjectId: selectedCommonArea,
                exteriorProjectId: selectedExterior,
            });
            setMigrationErrors(response.errors);
            getProperty();
        } catch (error) {
            TrackerUtil.error(error, {});
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getProperty();
    }, []);

    const isModalOpen = !!selectedProperty;
    const columns = [
        { field: "name", headerName: "Property Name", flex: 1.5 },
        {
            field: "num_projects",
            headerName: "Number of Projects",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return params.row.projects.length - 1 ?? 0;
            },
        },
        {
            field: "user_action_required",
            headerName: "Backfill Status",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const interiorProjects = params.row.projects
                    .filter((s: any) => s.system_remarks.container_version == "2.0")
                    .filter((s: any) => s.projectType == "INTERIOR");
                const commonAreaProjects = params.row.projects
                    .filter((s: any) => s.system_remarks.container_version == "2.0")
                    .filter((s: any) => s.projectType == "COMMON_AREA");
                const exteriorProjects = params.row.projects
                    .filter((s: any) => s.system_remarks.container_version == "2.0")
                    .filter((s: any) => s.projectType == "EXTERIOR");
                let user_action_required =
                    (interiorProjects.length > 0 &&
                        interiorProjects.length ==
                            interiorProjects.filter((s: any) => s.version == "1.0").length) ||
                    (exteriorProjects.length > 0 &&
                        exteriorProjects.length ==
                            exteriorProjects.filter((s: any) => s.version == "1.0").length) ||
                    (commonAreaProjects.length > 0 &&
                        commonAreaProjects.length ==
                            commonAreaProjects.filter((s: any) => s.version == "1.0").length);
                if (user_action_required) {
                    return (
                        <Button
                            disabled={featureDisabled}
                            onClick={() => {
                                setSelectedProperty(params.row);
                            }}
                        >
                            <Grid container>
                                <Grid>
                                    <Dangerous htmlColor="red" />
                                </Grid>
                                <Grid>
                                    <Typography>User Action Required</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    );
                }
                return "Normal";
            },
        },
    ];

    const container2Projects = (selectedProperty?.projects ?? [])
        .filter((project: any) => project?.system_remarks?.container_version == "2.0")
        .sort((a: any, b: any) => {
            if (a.projectType < b.projectType) {
                return 1;
            }
            return -1;
        });
    const container1Projects = (selectedProperty?.projects ?? []).filter(
        (project: any) => project?.system_remarks?.container_version == "1.0",
    );

    const interiorProjects =
        selectedProperty?.projects
            .filter((s: any) => s.system_remarks.container_version == "2.0")
            .filter((s: any) => s.projectType == "INTERIOR") ?? [];
    const commonAreaProjects =
        selectedProperty?.projects
            .filter((s: any) => s.system_remarks.container_version == "2.0")
            .filter((s: any) => s.projectType == "COMMON_AREA") ?? [];
    const exteriorProjects =
        selectedProperty?.projects
            .filter((s: any) => s.system_remarks.container_version == "2.0")
            .filter((s: any) => s.projectType == "EXTERIOR") ?? [];
    let interiorMustBeSelected =
        interiorProjects.length == interiorProjects.filter((s: any) => s.version == "1.0").length;
    let exteriorMustBeSelected =
        exteriorProjects.length == exteriorProjects.filter((s: any) => s.version == "1.0").length;
    let commonAreaMustBeSelected =
        commonAreaProjects.length ==
        commonAreaProjects.filter((s: any) => s.version == "1.0").length;

    return (
        <Grid margin={4} container>
            <BaseDataGrid columns={columns} rows={propertyList} rowsPerPageOptions={[50]} />
            <Dialog
                open={isModalOpen}
                onClose={() => {
                    setSelectedProperty(undefined);
                    setMigrationErrors({});
                    setSelectedCommonArea("");
                    setSelectedInterior("");
                    setSelectedInterior("");
                }}
            >
                <DialogContent>
                    <Grid padding={4}>
                        <Grid>
                            <Typography fontSize={21}>{selectedProperty?.name}</Typography>
                        </Grid>
                        <Grid marginTop={8}>
                            <Grid>
                                {container2Projects.length > 0 && (
                                    <Grid>
                                        <Typography>Container-2 Projects</Typography>
                                        <Typography fontSize={12}>
                                            Select Main Projects From Following Projects For Data
                                            Backfill
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid>
                                    {container2Projects.length == 0 && (
                                        <Typography>No Container-2 Projects</Typography>
                                    )}
                                </Grid>
                                {container2Projects.length > 0 && (
                                    <Grid>
                                        {interiorMustBeSelected && (
                                            <Grid>
                                                <Typography fontSize={12} marginTop={4}>
                                                    Interior Projects
                                                </Typography>
                                                {container2Projects
                                                    .filter((s: any) => s.projectType == "INTERIOR")
                                                    .map((project: any) => (
                                                        <Grid key={project.id}>
                                                            <Grid>
                                                                <Checkbox
                                                                    style={{ color: "grey" }}
                                                                    checked={
                                                                        project.id ==
                                                                        selectedInterior
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedInterior(
                                                                            project.id ==
                                                                                selectedInterior
                                                                                ? null
                                                                                : project.id,
                                                                        );
                                                                    }}
                                                                />
                                                                <a
                                                                    href={`/admin-projects/${project.id}/overview`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {project.name} (
                                                                    {project.projectType})
                                                                </a>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        )}
                                        {commonAreaMustBeSelected && (
                                            <Grid>
                                                <Typography fontSize={12} marginTop={4}>
                                                    Common Area Projects
                                                </Typography>
                                                {container2Projects
                                                    .filter(
                                                        (s: any) => s.projectType == "COMMON_AREA",
                                                    )
                                                    .map((project: any) => (
                                                        <Grid key={project.id}>
                                                            <Grid>
                                                                <Checkbox
                                                                    style={{ color: "grey" }}
                                                                    color="primary"
                                                                    checked={
                                                                        project.id ==
                                                                        selectedCommonArea
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedCommonArea(
                                                                            project.id ==
                                                                                selectedCommonArea
                                                                                ? null
                                                                                : project.id,
                                                                        );
                                                                    }}
                                                                />
                                                                <a
                                                                    href={`/admin-projects/${project.id}/overview`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {project.name} (
                                                                    {project.projectType})
                                                                </a>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        )}
                                        {exteriorMustBeSelected && (
                                            <Grid>
                                                <Typography fontSize={12} marginTop={4}>
                                                    Exterior Projects
                                                </Typography>
                                                {container2Projects
                                                    .filter((s: any) => s.projectType == "EXTERIOR")
                                                    .map((project: any) => (
                                                        <Grid key={project.id}>
                                                            <Grid>
                                                                <Checkbox
                                                                    style={{ color: "grey" }}
                                                                    checked={
                                                                        project.id ==
                                                                        selectedExterior
                                                                    }
                                                                    onClick={() => {
                                                                        setSelectedExterior(
                                                                            project.id ==
                                                                                selectedExterior
                                                                                ? null
                                                                                : project.id,
                                                                        );
                                                                    }}
                                                                />
                                                                <a
                                                                    href={`/admin-projects/${project.id}/overview`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {project.name} (
                                                                    {project.projectType})
                                                                </a>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                            <Grid marginTop={8}>
                                {container1Projects.length > 0 && (
                                    <Grid>
                                        <Typography>Container-1 Projects</Typography>
                                    </Grid>
                                )}
                                <Grid>
                                    {container1Projects.length == 0 && (
                                        <Typography>No Container-1 Projects</Typography>
                                    )}
                                </Grid>
                                <Grid>
                                    {container1Projects.length > 0 && (
                                        <Typography marginTop={4}>
                                            <Grid container>
                                                <Grid>
                                                    <InfoOutlined />
                                                </Grid>
                                                <Grid marginLeft={2}>
                                                    Following Projects Will Be In Read Only Mode
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid>
                                    <ol type="1">
                                        {container1Projects.map((project: any) => (
                                            <li key={project.id}>
                                                <a
                                                    href={`/admin-projects/${project.id}/overview`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {project.name} ({project.projectType})
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid marginLeft={"auto"}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={sendForMigration}
                                disabled={isLoading}
                            >
                                <Grid container>
                                    {isLoading && (
                                        <Grid marginRight={4}>
                                            <CircularProgress size={12} />
                                        </Grid>
                                    )}
                                    <Grid>{isLoading ? "Backfilling" : "Backfill"}</Grid>
                                </Grid>
                            </Button>
                        </Grid>
                    </Grid>
                    {Object.keys(migrationErrors).length > 0 && (
                        <Typography>Data backfill Errors</Typography>
                    )}
                    {Object.keys(migrationErrors).map((key) => {
                        return (
                            <Grid key={key} marginBottom={8}>
                                <Typography fontSize={18}>{key}</Typography>
                                {migrationErrors[key].map((s: any) => {
                                    return (
                                        <Grid key={s} marginLeft={4} marginTop={2}>
                                            - {s}
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        );
                    })}
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

export default ProjectMigration;
