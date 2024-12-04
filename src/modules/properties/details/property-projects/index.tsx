import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import BaseDataGrid from "components/data-grid";
import NewProjectButton from "./new-project-button";
import { graphQLClient } from "utils/gql-client";
import { PROPERTY_PROJECT_QUERY } from "./constants";
import { useNavigate, useParams } from "react-router-dom";
import ArchiveIcon from "../../../../assets/icons/icon-archive.svg";
import HumanReadableData from "components/human-readable-date";
import NewProjectModal from "./new-project-modal";
import { DELETE_PROJECT } from "stores/projects/tpsm/tpsm-queries";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import TrackerUtil from "utils/tracker";
import actions from "stores/actions";
import { useAppDispatch } from "stores/hooks";
import { useAppSelector } from "stores/hooks";

const PropertyProjects = () => {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const {
        propertyDetails,
        configurations = [],
        // confugration_fetched,
    } = useAppSelector((state) => ({
        // ownership: state.ims.ims.ownership,
        // ownerships: state.ims.ims.ownerships,
        propertyDetails: state.propertyDetails.data,
        // saved: state.ims.ims.saved,
        // error: state.ims.ims.error,
        // users: state.ims.ims.users,
        // configuration: state.ims.ims.configuration,
        configurations: state.ims.ims.configurations,
        confugration_fetched: state.ims.ims.confugration_fetched,
    }));

    const isLoading = false;
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    async function archiveProject(project_id: string) {
        try {
            await graphQLClient.mutate("archiveProject", DELETE_PROJECT, {
                projectId: project_id,
            });
            showSnackBar("success", "Project Archived");
            setProjects([...projects.filter((project) => project.id != project_id)]);
        } catch (error) {
            TrackerUtil.error(error, { project_id });
            showSnackBar("error", "Unable To Archive The Project");
        }
    }
    const tableColumns = [
        {
            headerName: "Project Name",
            field: "name",
            flex: 3,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row.name}</Typography>
            ),
        },
        {
            headerName: "Project Type",
            field: "project_type",
            flex: 1.5,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row.project_type}</Typography>
            ),
        },
        {
            headerName: "Creation Date",
            field: "created_at",
            flex: 1.5,
            renderCell: (params: GridRenderCellParams) => (
                <HumanReadableData
                    style={{ fontSize: "14px" }}
                    dateString={params.row.created_at}
                />
            ),
        },
        {
            headerName: "Project Version",
            field: "version",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row.version}</Typography>
            ),
        },
        {
            headerName: "Actions",
            field: "actions",
            flex: 0.5,
            type: "actions",
            //eslint-disable-next-line
            getActions: (params: any) => {
                return [
                    <GridActionsCellItem
                        placeholder=""
                        key={`menu-settings-${params.row?.id}`}
                        label={"Archive"}
                        icon={<img src={ArchiveIcon} alt="Delete Icon" />}
                        onClick={() => {
                            archiveProject(params.row.id);
                        }}
                        showInMenu
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                ];
            },
        },
    ];

    const [projects, setProjects] = useState([] as Array<any>);
    const [showModal, setShowModal] = useState(false as boolean);

    async function getProjects() {
        const data = await graphQLClient.query("getProjects", PROPERTY_PROJECT_QUERY, {
            propertyId,
        });
        const projects = data.getProjects.filter(
            (project: any) => project.project_type.toLowerCase() != "default",
        );
        setProjects(projects);
    }

    useEffect(() => {
        if (propertyDetails) {
            dispatch(
                actions.imsActions.getOrganizationContainersStart({
                    id: propertyDetails?.ownershipGroupId,
                }),
            );
        }
        // eslint-disable-next-line
    }, [propertyDetails]);

    useEffect(() => {
        getProjects();
        if (!propertyDetails) {
            dispatch(actions.propertyDetails.fetchPropertyDetailsStart(propertyId));
        }
        // eslint-disable-next-line
    }, [propertyId]);

    const navigateToProject = (project_id: string) => {
        navigate(`/admin-projects/${project_id}/overview`);
    };
    return (
        <Grid container flexDirection={"column"}>
            <Grid item margin={4} marginLeft={"auto"}>
                <NewProjectButton onAddNewProject={() => setShowModal(true)} />
            </Grid>
            <Grid item style={{ margin: "0px 16px" }}>
                <BaseDataGrid
                    columns={tableColumns}
                    rows={projects}
                    rowsPerPageOptions={[10, 20, 30]}
                    loading={isLoading}
                    onRowClick={(callbackData: any) => {
                        const { id } = callbackData;
                        navigateToProject(id as string);
                    }}
                />
            </Grid>
            {/* Below section for modals */}
            <NewProjectModal
                open={showModal}
                configurations={configurations}
                property_id={propertyId as string}
                onCancelClicked={() => setShowModal(false)}
                onProjectCreate={async (project_id: string) => {
                    setShowModal(false);
                    await getProjects();
                    navigateToProject(project_id);
                }}
            />
        </Grid>
    );
};

export default PropertyProjects;
