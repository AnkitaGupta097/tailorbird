import { Grid, Link, Paper, Stack, Typography } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import BaseDataGrid from "components/data-grid";
import React, { useEffect, useState } from "react";
import BaseChip from "components/chip";
import AppContainer from "components/app-container";
import { StyledGrid } from "./style";
import ProjectSearch from "./search";
import { isEmpty, filter } from "lodash";
import { IFilter } from "modules/projects/active";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { getBgColor, getText, getTextColor } from "../helper";
import { ProjectDetailsText, ProjectListText } from "../constant";
import CommonDialog from "modules/admin-portal/common/dialog";
import ContentPlaceholder from "components/content-placeholder";
import moment from "moment";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

export const columns = [
    {
        field: "project_name",
        headerName: "Property Name",
        headerAlign: "left",
        align: "left",
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="text_14_regular">
                {params.row.project_name?.length !== 0 ? params.row.project_name : "-"}
            </Typography>
        ),
    },
    {
        field: "ownership_group_name",
        headerName: "Ownership Group",
        headerAlign: "left",
        align: "left",
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="text_14_regular">
                {params.row.ownership_group_name?.length !== 0
                    ? params.row.ownership_group_name
                    : "-"}
            </Typography>
        ),
    },
    {
        field: "property_type",
        headerName: "Property Type",
        headerAlign: "left",
        align: "left",
        flex: 0.6,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="text_14_regular">
                {params.row.property_type?.length !== 0 ? params.row.property_type : "-"}
            </Typography>
        ),
    },
    {
        field: "due_date",
        headerName: "Due Date",
        headerAlign: "left",
        align: "left",
        flex: 0.5,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="text_14_regular">
                {moment(
                    params.row.rfp_project_version === "2.0"
                        ? params.row?.rfp_bid_details?.bid_due_date
                        : params.row.bid_due_date,
                ).format("MM/DD/YYYY")}
            </Typography>
        ),
    },
    {
        field: "address",
        headerName: "Address",
        headerAlign: "left",
        align: "left",
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
            <Typography variant="text_14_regular">
                {params.row.address?.length !== 0 ? params.row.address : "-"}
            </Typography>
        ),
    },
    {
        field: "bidbook_url",
        headerName: "Bidbook",
        headerAlign: "left",
        align: "left",
        flex: 0.5,
        renderCell: (params: GridRenderCellParams) =>
            params.row.bidbook_url !== "UNASSIGNED" ? (
                <Link
                    sx={{ margin: 0 }}
                    href={params.row.bidbook_url}
                    target="_blank"
                    underline="none"
                >
                    <Typography variant="text_14_regular">{ProjectDetailsText.OPEN}</Typography>
                </Link>
            ) : (
                "-"
            ),
    },
    {
        field: "folder_url",
        headerName: "RFP Folder",
        headerAlign: "left",
        align: "left",
        flex: 0.5,
        renderCell: (params: GridRenderCellParams) =>
            params.row.folder_url !== "UNASSIGNED" ? (
                <Link
                    sx={{ margin: 0 }}
                    href={params.row.folder_url}
                    target="_blank"
                    underline="none"
                >
                    <Typography variant="text_14_regular">{ProjectDetailsText.OPEN}</Typography>
                </Link>
            ) : (
                "-"
            ),
    },
    {
        field: "bid_status",
        headerName: "Bid Status",
        headerAlign: "left",
        align: "left",
        flex: 0.7,
        renderCell: (params: GridRenderCellParams) => (
            <BaseChip
                variant="filled"
                label={getText(params.row.bid_status)}
                bgcolor={getBgColor(params.row.bid_status)}
                textColor={getTextColor(params.row.bid_status)}
                sx={{ marginTop: "1rem", marginBottom: "1rem" }}
            />
        ),
    },
];

const RfpProjects = () => {
    // Redux
    const navigate = useNavigate();
    const { role, userID } = useParams();
    const is_rfp_2 = useFeature(FeatureFlagConstants.RFP_2_BIDDING_PORTAL).on;
    if (is_rfp_2) navigate(`/rfp/${role}/${userID}/projects/v2`);
    const dispatch = useAppDispatch();
    const organization_id = localStorage.getItem("organization_id");
    const { projects, loading, isEditable, currentEditingUser } = useAppSelector((state) => {
        return {
            projects: state.rfpService.project.projectDetails,
            loading: state.rfpService.project.loading,
            isEditable: state.biddingPortal.isEditable,
            currentEditingUser: state.biddingPortal.currentEditingUser,
        };
    });
    const [yourProjects, setYourProjects] = useState<any[]>([]);
    const [searchedProject, setSearchedProject] = useState([]);
    const [filterList] = useState<IFilter>({
        INTERIOR: false,
        COMMON_AREA: false,
        EXTERIOR: false,
    });

    useEffect(() => {
        setYourProjects(projects); // eslint-disable-next-line
    }, [projects]);

    useEffect(() => {
        const finalProject = isEmpty(searchedProject) ? projects : searchedProject;
        if (filterList.COMMON_AREA && filterList.INTERIOR) {
            setYourProjects(finalProject);
        } else if (filterList.COMMON_AREA) {
            const filteredProjects: any = filter(
                finalProject,
                (project) => project.property_type.toUpperCase() === "COMMON_AREA",
            );
            setYourProjects(filteredProjects);
        } else if (filterList.INTERIOR) {
            const filteredProjects: any = filter(
                finalProject,
                (project) => project.property_type.toUpperCase() === "INTERIOR",
            );
            setYourProjects(filteredProjects);
        } else {
            setYourProjects(finalProject);
        }
        // eslint-disable-next-line
    }, [filterList]);

    const handleSearch = (value: string) => {
        if (isEmpty(value)) {
            setSearchedProject([]);
            setYourProjects(projects);
        } else {
            const searchedProjects: any = filter(
                projects,
                (row) =>
                    row.address?.toLowerCase().includes(value) ||
                    row.project_name?.toLowerCase().includes(value) ||
                    row.ownership_group_name?.toLowerCase().includes(value),
            );
            setSearchedProject(searchedProjects);
            setYourProjects(searchedProjects);
        }
    };

    useEffect(() => {
        dispatch(
            actions.rfpService.fetchProjectDetailsStart({
                user_id: userID,
                organization_id: "",
            }),
        );
        if (isEditable && currentEditingUser) {
            dispatch(
                actions.biddingPortal.unlockProjectForEditingStart({
                    projectId: currentEditingUser?.projectId,
                    organization_id: organization_id,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <CommonDialog
                open={loading}
                onClose={() => {}}
                loading={loading}
                loaderText={"Please wait. Projects loading ..."}
                width="40rem"
                minHeight="26rem"
            />
        );
    }

    return (
        <Grid container>
            <Grid item md={12}>
                <AppContainer title={role === "admin" ? "Admin" : `${ProjectListText.PROJECTS}`} />
            </Grid>
            <StyledGrid item md={12} className={"container"}>
                <Grid container>
                    <StyledGrid item md={12} className="container input">
                        <ProjectSearch setSearchValue={handleSearch} />
                    </StyledGrid>
                    <Grid item md={12}>
                        <Paper elevation={3}>
                            <BaseDataGrid
                                columns={columns}
                                rows={yourProjects}
                                rowsPerPageOptions={[10, 20, 30]}
                                hideFooter={yourProjects?.length > 10 ? false : true}
                                disableSelectionOnClick={true}
                                onRowClick={(rowData: any) => {
                                    navigate(`/rfp/${role}/${userID}/projects/${rowData.id}`, {
                                        state: {
                                            projectDetails: rowData.row,
                                        },
                                    });
                                }}
                                getRowId={(row: any) => row.project_id}
                                getRowHeight={() => "auto"}
                                rowHeight={125}
                                components={{
                                    NoRowsOverlay: () => (
                                        <Stack sx={{ margin: "10px" }}>
                                            <ContentPlaceholder
                                                onLinkClick={() => {}}
                                                text="No projects to bid at the moment."
                                                aText=""
                                                height="250px"
                                            />
                                        </Stack>
                                    ),
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </StyledGrid>
        </Grid>
    );
};

export default RfpProjects;
