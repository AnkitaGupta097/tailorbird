/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Grid, Paper, Typography, Stack, useTheme } from "@mui/material";
import BaseDataGrid from "components/data-grid";
import { isEmpty, filter, find, mapValues } from "lodash";
import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { PROJECT_TYPE } from "../constant";
import { useAppSelector, useAppDispatch } from "../../../stores/hooks";
import ContentPlaceholder from "../../../components/content-placeholder";
import ArchiveIcon from "../../../assets/icons/icon-archive.svg";
import RestoreIcon from "../../../assets/icons/icon-restore.svg";
import actions from "../../../stores/actions";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BaseLoader from "../../../components/base-loading";
import ConfirmationModal from "../../../components/confirmation-modal";
import { graphQLClient } from "../../../utils/gql-client";
import { useSnackbar } from "notistack";
import BaseSnackbar from "../../../components/base-snackbar";
import { DELETE_PROJECT, RESTORE_PROJECT } from "../../../stores/projects/tpsm/tpsm-queries";

interface IColumn {
    id: "name" | "group" | "address" | "projectType" | "createdAt" | "action";
    label: string;
    width?: string;
    align?: "right";
}
export interface IProjectDetails {
    id: string;
    name: string;
    organization_id: string;
    streetAddress: string;
    ownershipGroupId: any;
    projectType: string;
    createdAt: string;
}

const columns: readonly IColumn[] = [
    { id: "name", label: "Project Name", width: "20%" },
    { id: "group", label: "Ownership Group", width: "20%" },
    {
        id: "address",
        label: "Address",
        width: "25%",
    },

    {
        id: "createdAt",
        label: "Creation Date",
        width: "15%",
    },
    {
        id: "projectType",
        label: "Project Type",
        width: "10%",
    },
    {
        id: "action",
        label: "Action",
        width: "10%",
    },
];

interface IProjectsListTable {
    projects: any;
    type: String;
    setProjectModal?: any;
    searchText?: any;
    filterList?: any;
}

const ProjectsListTable = ({
    projects,
    type,
    setProjectModal,
    searchText,
    filterList,
}: IProjectsListTable) => {
    const theme = useTheme();

    const { enqueueSnackbar } = useSnackbar();

    const { organization, deleteProcess, restoreProcess, isLoading, allUsers } = useAppSelector(
        (state) => {
            return {
                organization: state.tpsm.organization,
                deleteProcess: state.tpsm.archive_projects.loading,
                isLoading: state.tpsm?.loading,
                restoreProcess: state.tpsm.archive_projects.loading,
                allUsers: state.tpsm.all_User?.users,
            };
        },
    );
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const getCreatedByName = (createdBy: any) => {
        let user = allUsers?.find((user: any) => user.id == createdBy);
        return user?.name || createdBy;
    };
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [confirm, setConfirm] = React.useState(false);
    const [projectId, setProjectId] = React.useState("");
    const organizationMap =
        organization && new Map(organization.map((org: any) => [org.id, org.name]));
    let rows: any[] = projects
        ?.slice()
        ?.sort((s1: any, s2: any) => Date.parse(s1.createdAt) - Date.parse(s2.createdAt))
        ?.reverse()
        ?.map((project: any) => ({
            id: project.id,
            name: project.name,
            city: project?.city,
            createdBy: getCreatedByName(project?.userId),
            createdAt: project?.createdAt,
            ownershipGroupId: project?.ownershipGroupId,
            ownershipGroup:
                project?.ownershipGroupId && organizationMap?.get(project?.ownershipGroupId),
            address: `${project?.streetAddress ?? ""} ${project?.city ?? "" ? "," : ""}${
                project?.city ?? ""
            }${project?.state ?? "" ? "," : ""}${project?.state ?? ""}${
                project?.zipcode ?? "" ? "-" : ""
            }${project?.zipcode ?? ""}`,
            projectType: project?.projectType,
            state: project?.state,
            streetAddress: project?.streetAddress,
            userId: project?.userId,
            zipcode: project?.zipcode,
            creationDate: moment.parseZone(project?.createdAt).local().format("L LT"),
        }));

    const [displayedRows, setDisplayedRows] = useState<any[]>(rows);

    //Columns
    const ProjectListColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Project Name",
                flex: 1.5,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                ),
            },
            {
                field: "ownershipGroup",
                headerName: "Ownership Group",
                flex: 0.6,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params.row.ownershipGroup || ""}
                    </Typography>
                ),
            },
            {
                field: "address",
                headerName: "Address",
                flex: 1.75,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.address}</Typography>
                ),
            },
            {
                field: "creationDate",
                headerName: "Creation Date",
                flex: 0.65,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.creationDate}</Typography>
                ),
            },
            {
                field: "projectType",
                headerName: "Project Type",
                flex: 0.45,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {
                            find(PROJECT_TYPE, {
                                value: params.row.projectType,
                            })?.label
                        }
                    </Typography>
                ),
            },
            {
                field: "actions",
                headerName: "Action",
                flex: 0.45,
                type: "actions",
                //eslint-disable-next-line
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={type == "general" ? "Archive" : "Restore"}
                            icon={
                                <img
                                    src={type == "general" ? ArchiveIcon : RestoreIcon}
                                    alt="Delete Icon"
                                />
                            }
                            onClick={() => {
                                setConfirm(true);
                                setProjectId(params.row?.id);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ], //eslint-disable-next-line
        [projects],
    );

    useEffect(() => {
        if (searchText === "") setDisplayedRows(rows);
        else
            setDisplayedRows(
                rows.filter(
                    (row) =>
                        row.streetAddress?.toLowerCase().includes(searchText) ||
                        row.name?.toLowerCase().includes(searchText) ||
                        find(organization, {
                            id: row.ownershipGroupId,
                        })
                            ?.name?.toLowerCase()
                            .includes(searchText),
                ),
            );
        //eslint-disable-next-line
    }, [projects, searchText, filterList]);

    useEffect(() => {
        dispatch(actions.tpsm.fetchAllProjectStart(""));
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        let filterValue: any = [];
        mapValues(filterList, (value, type) => {
            if (value) {
                filterValue.push(type);
            }
        });
        if (filterValue.length > 0) {
            setDisplayedRows(
                rows
                    ?.filter((project: any) => {
                        return filterValue.includes(project.projectType);
                    })
                    ?.filter((row: any) => {
                        const lowerCaseSearchText = searchText && searchText.trim().toLowerCase();
                        return lowerCaseSearchText
                            ? row.streetAddress?.toLowerCase().includes(searchText) ||
                                  row.name?.toLowerCase().includes(searchText) ||
                                  find(organization, {
                                      id: row.ownershipGroupId,
                                  })
                                      ?.name?.toLowerCase()
                                      .includes(searchText)
                            : true;
                    }),
            );
        } else if (searchText != "") {
            setDisplayedRows(rows);
        }
        //eslint-disable-next-line
    }, [projects, filterList]);

    const onProjectDelete = async () => {
        setConfirm(false);
        dispatch(actions.tpsm.deleteProjectStart(""));
        try {
            const res = await graphQLClient.mutate("archiveProject", DELETE_PROJECT, {
                projectId: projectId,
            });
            enqueueSnackbar("", {
                variant: "success",
                action: <BaseSnackbar variant="success" title={"Project Archive Successfully"} />,
            });
            dispatch(actions.tpsm.deleteProjectSuccess(res));
        } catch (error) {
            dispatch(actions.tpsm.deleteProjectError(error));
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={"Unable to Archive Project."} />,
            });
        }
    };

    const restoreProject = async () => {
        setConfirm(false);
        dispatch(actions.tpsm.restoreProjectStart(""));
        try {
            const res = await graphQLClient.mutate("undoArchiveProject", RESTORE_PROJECT, {
                projectId: projectId,
            });
            enqueueSnackbar("", {
                variant: "success",
                action: <BaseSnackbar variant="success" title={"Project restored Successfully"} />,
            });
            dispatch(actions.tpsm.restoreProjectSuccess(res));
            dispatch(actions.tpsm.fetchAllProjectStart(""));
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant="error" title={"Unable to restore Project."} />,
            });
        }
    };

    return (
        <Grid container>
            <Grid item md={12} style={{ marginTop: 10 }}>
                <Paper elevation={3}>
                    <BaseDataGrid
                        columns={ProjectListColumns}
                        rows={displayedRows}
                        rowsPerPageOptions={[10, 20, 30]}
                        loading={isLoading}
                        onRowClick={(rowData: any) => {
                            type == "general"
                                ? navigate(`/admin-projects/${rowData.id}/overview`)
                                : null;
                        }}
                        disableColumnMenu={false}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack sx={{ margin: "10px" }}>
                                    <ContentPlaceholder
                                        onLinkClick={() => {
                                            setProjectModal(true);
                                        }}
                                        text={
                                            searchText !== ""
                                                ? "No results found."
                                                : "No projects created."
                                        }
                                        aText=""
                                        height="90px"
                                    />
                                </Stack>
                            ),
                        }}
                        sx={{
                            // pointer cursor on ALL rows
                            "& .MuiDataGrid-row:hover": {
                                cursor: type == "general" ? "pointer" : "auto",
                            },
                        }}
                        hideFooter={projects?.lengthv > 10 ? true : false}
                        getRowId={(row: any) => row.id}
                    />
                </Paper>
            </Grid>
            <ConfirmationModal
                text={
                    type == "general"
                        ? "Are you sure,you want to archived this project?"
                        : "Are you sure, you want to restore this project"
                }
                onCancel={() => setConfirm(false)}
                onProceed={type == "general" ? onProjectDelete : restoreProject}
                open={confirm}
                variant={type == "general" ? "deletion" : ""}
                cancelText={type == "general" ? "Cancel" : "No"}
                actionText="yes"
            />
            {(deleteProcess || restoreProcess) && <BaseLoader />}
        </Grid>
    );
};

export default ProjectsListTable;
