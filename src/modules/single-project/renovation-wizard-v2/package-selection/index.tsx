import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import BaseDataGrid from "components/data-grid";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import { PROJECT_TYPE } from "modules/projects/constant";
import { find } from "lodash";
import BaseButton from "components/button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PackageContentsModal from "./package-contents-modal";
import { useAppSelector } from "stores/hooks";
import { PROJECT_TYPE_BG_COLOR } from "modules/rfp-manager/common/constants";
import ConfirmationDialog from "../common/confirmation-dialog";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import moment from "moment";
import { useParams } from "react-router-dom";
// import { fetchBasePackage } from "../utils";

const PackageSelection = () => {
    const { projectId } = useParams();
    const [selectedProject, setSelectedProject] = useState<any>();
    const dispatch = useDispatch();

    const { projectDetails, projects, projectsLoading, basePackage } = useAppSelector((state) => ({
        projectsLoading: state.singleProject.renovationWizardV2.projects.loading,
        projects: state.singleProject.renovationWizardV2.projects.data,
        basePackage: state.singleProject.renovationWizardV2.basePackage.data,
        projectDetails: state.singleProject.projectDetails,
    }));

    useEffect(() => {
        dispatch(actions.singleProject.getBasePackageStart(projectDetails.id));
        // Get projects
        dispatch(
            actions.singleProject.getProjectsStart({
                filters: [
                    {
                        name: "ownership_group",
                        values: [projectDetails.organization.name],
                    },
                    {
                        name: "project_type",
                        values: [projectDetails.projectType],
                    },
                    // TODO: Add status in filters later
                ],
            }),
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [showPackageContentModal, setShowPackageContentModal] = useState<boolean>(false);
    const [showPackageSelectionConfirmationModal, setShowPackageSelectionConfirmationModal] =
        useState<boolean>(false);

    const getContent = (project: any) => {
        setSelectedProject(project);
        toggleShowPackageContentModal();
    };

    const selectPackage = (currentProject: any) => {
        dispatch(
            actions.singleProject.createRenoItemsFromExistingProjectStart({
                current_project_id: projectId,
                selected_project_id: currentProject.id,
                organization_id: projectDetails.organization_id,
                created_by: JSON.parse(localStorage.getItem("user_details")!)?.name,
                ownership_group_id: projectDetails.organization_id,
                ownership_group_name: projectDetails.owner,
                user_id: localStorage.getItem("user_id"),
                selected_package_id: currentProject.basePackage.package_id,
            }),
        );
    };

    const toggleShowPackageContentModal = () => {
        setShowPackageContentModal(!showPackageContentModal);
    };

    const toggleShowPackageSelectionConfirmationModal = () => {
        setShowPackageSelectionConfirmationModal(!showPackageSelectionConfirmationModal);
    };

    const handlePackageSelection = (currentProject: any, isCurrentSelectedProject: boolean) => {
        setSelectedProject(currentProject);
        // if current project has no base-package yet, we dont need to show confirmation modal
        if (!basePackage.package_id) {
            selectPackage(currentProject);
        } else if (!isCurrentSelectedProject) {
            toggleShowPackageSelectionConfirmationModal();
        } else {
            dispatch(actions.singleProject.incRenoWizardV2CurrentStep({}));
        }
    };

    //Columns
    const projectListColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Project",
                flex: 1.5,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">{params.row.name}</Typography>
                ),
            },
            {
                field: "projectType",
                headerName: "Project Type",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => {
                    const label = find(PROJECT_TYPE, {
                        value: params.row.project_type,
                    })?.label;

                    const color =
                        PROJECT_TYPE_BG_COLOR[
                            params.row.project_type as keyof typeof PROJECT_TYPE_BG_COLOR
                        ] ?? "black";

                    return (
                        <Chip
                            label={label}
                            sx={{
                                border: `1px solid ${color}`,
                                borderRadius: "4px",
                                color: color,
                                background: "white",
                            }}
                        />
                    );
                },
                sortable: false,
            },
            {
                field: "creationDate",
                headerName: "Creation Date",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {moment(params.row.created_at).format("MM/DD/YYYY")}
                    </Typography>
                ),
                type: "dateTime",
                valueGetter: (params: GridRenderCellParams) =>
                    params.row.created_at && new Date(params.row.created_at),
            },
            {
                field: "contents",
                headerName: "Contents",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <BaseButton
                        label="See Contents"
                        onClick={() => getContent(params.row)}
                        labelStyles={{ fontSize: 14, fontWeight: 600 }}
                    />
                ),
                sortable: false,
            },
            {
                field: "",
                headerName: "",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => {
                    const projectBasePackage = params.row.basePackage;
                    let isCurrentSelectedProject = false;
                    if (projectBasePackage) {
                        if (
                            basePackage.derived_from &&
                            projectBasePackage.package_id === basePackage.derived_from
                        ) {
                            isCurrentSelectedProject = true;
                        }
                    }
                    return (
                        <BaseButton
                            label={
                                isCurrentSelectedProject
                                    ? "Currently selected package"
                                    : "Select this package"
                            }
                            onClick={() =>
                                handlePackageSelection(params.row, isCurrentSelectedProject)
                            }
                            labelStyles={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: isCurrentSelectedProject ? "#00B779" : "#004D71",
                            }}
                            endIcon={
                                <ArrowForwardIosIcon
                                    sx={{ color: isCurrentSelectedProject ? "#00B779" : "#004D71" }}
                                />
                            }
                        />
                    );
                },
                sortable: false,
            },
        ], //eslint-disable-next-line
        [projects],
    );

    let projectsToShow = [
        ...projects.filter((p) => p.id !== projectId && !!p.basePackage?.package_id),
    ];
    const currentSelectedProjectIdx = projectsToShow.findIndex(
        (p) => p.basePackage.package_id === basePackage.derived_from,
    );
    if (currentSelectedProjectIdx !== -1) {
        const currentSelectedProject = projectsToShow[currentSelectedProjectIdx];
        projectsToShow.splice(currentSelectedProjectIdx, 1);
        projectsToShow.unshift(currentSelectedProject);
    }

    return (
        <Stack justifyContent="center" p={0}>
            <Box textAlign="center">
                <Typography variant="text_34_medium">
                    Start by selecting a package from a previous project
                </Typography>
            </Box>
            <Box paddingTop={8}>
                <Box sx={{ border: "1px solid #C9CCCF", borderRadius: "4px" }}>
                    <Box p={4}>
                        <Typography>Package</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <BaseDataGrid
                            columns={projectListColumns}
                            rows={projectsToShow}
                            rowsPerPageOptions={[10, 20, 30]}
                            disableColumnMenu={false}
                            // hideFooter={projects?.length > 10 ? true : false}
                            getRowId={(row: any) => row.id}
                            loading={projectsLoading}
                        />
                    </Box>
                </Box>
            </Box>
            {showPackageContentModal && (
                <PackageContentsModal
                    open={showPackageContentModal}
                    onClose={toggleShowPackageContentModal}
                    projectName={selectedProject.name}
                    projectId={selectedProject.id}
                />
            )}

            {showPackageSelectionConfirmationModal && (
                <ConfirmationDialog
                    title="Are you sure you want to select a different package?"
                    content="Are you sure you want to select this new package? All of your current progress will be lost and you will need to start over."
                    open={showPackageSelectionConfirmationModal}
                    onCancel={toggleShowPackageSelectionConfirmationModal}
                    onDone={() => (
                        selectPackage(selectedProject),
                        toggleShowPackageSelectionConfirmationModal()
                    )}
                    doneBtnLabel="Yes, I Want to Select New Package"
                />
            )}
        </Stack>
    );
};

export default PackageSelection;
