import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper,
    Grid,
    InputBase,
    styled,
    MenuItem,
    InputAdornment,
    Select,
    Typography,
    Card,
    Divider,
    Button,
    Autocomplete,
    TextField,
    IconButton,
} from "@mui/material";
import "./projects-overview.css";
import AddIcon from "../../../../assets/icons/icon-add.svg";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import { map, debounce, isEmpty, find } from "lodash";
import actions from "../../../../stores/actions";
import FileUploadModal from "./file-upload-modal";
import { useNavigate, useParams } from "react-router-dom";
import { PROJECT_DATA, PROJECT_TYPE, PROJECT_STATUS } from "../../constant";
import TakeOffsTable from "./take-offs-table";
import OwnerShip from "../../../../components/ownership-dropdown";
import { IOrg } from "../../../package-manager/interfaces";
import RentRollModal from "./modal/rent-roll-modal";
import ColumnMapModal from "./modal/column-map-modal";
import AppTheme from "../../../../styles/theme";
import { ReactComponent as DownLoad } from "../../../../assets/icons/download-icon.svg";
import { ReactComponent as Cross } from "../../../../assets/icons/cross-icon.svg";
import { useSnackbar } from "notistack";
import BaseLoader from "../../../../components/base-loading";
import BaseSnackbar from "../../../../components/base-snackbar";
import ConfirmationModal from "../../../../components/confirmation-modal";
import DataSyncButton from "./data-sync";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TrackerUtil from "utils/tracker";
import { PROPERTY_TYPE } from "modules/properties/constant";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const SInput = styled(InputBase)(({ theme }) => ({
    "& .MuiInputBase-input": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        border: "1px solid #CCCCCC",
        fontSize: 16,
        marginTop: 10,
        padding: "10px 12px",
        marginRight: "15px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
    "&:hover": {
        pointer: "cursor",
    },
}));

const ProjectsOverview = () => {
    const {
        organization,
        projectDetails,
        allUsers,
        loading,
        rentRollDb,
        isDeleteStatus,
        rentRollDetail,
        dataSourceUploadStatus,
        configurations = [],
    } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            projectDetails: state.projectDetails.data,
            allUsers: state.tpsm.all_User,
            rentRollDb: state.projectOverview.rentRollDb,
            loading: state.projectOverview.loading,
            isDeleteStatus: state.projectOverview.rentRollDb.isDeleteStatus,
            rentRollDetail: state.projectDetails.data?.rentRoll ?? {},
            dataSourceUploadStatus: state.projectOverview.dataSourceUploadStatus?.status,
            configurations: state.ims.ims.configurations,
        };
    });
    const {
        status: rentRollStatus,
        remoteFileReference,
        downloadLink: rentRollDownloadLink,
    } = rentRollDetail;
    const { status, data } = rentRollDb;
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const [isUploadModal, setUploadModal] = useState(false);
    const [projectData, setProjectData] = useState(PROJECT_DATA);
    const [openRentRoll, setRentRoll] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [openColumnMap, setColumnMap] = useState(false);
    const [alert, setAlert] = useState<any>({ variant: "", title: "" });

    useEffect(() => {
        if (!isEmpty(alert.variant)) {
            enqueueSnackbar("", {
                variant: alert.variant,
                action: <BaseSnackbar variant={alert.variant} title={alert.title} />,
            });
            setTimeout(() => {
                setAlert({ variant: "", title: "" });
            }, 200);
        }

        // eslint-disable-next-line
    }, [alert]);

    useEffect(() => {
        dispatch(actions.projectOverview.initStateUpdate(""));

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setAlert({
            variant: status,
            title:
                status == "success"
                    ? "Rent-roll column updated Successfully."
                    : rentRollDb?.error?.msg
                    ? rentRollDb.error.msg
                    : "Unable to update Rent-roll columns.",
        });
    }, [status, rentRollDb]);
    useEffect(() => {
        if (data?.error && data?.column == null) {
            setAlert({
                variant: "error",
                title: data.error,
            });
        }
    }, [data]);

    useEffect(() => {
        setAlert({
            variant: isDeleteStatus,
            title:
                isDeleteStatus == "success"
                    ? "Rent-roll file deleted Successfully."
                    : "Unable to delete Rent-roll file.",
        });
        // eslint-disable-next-line
    }, [isDeleteStatus]);
    console.log("consfigs", configurations);

    useEffect(() => {
        if (!isEmpty(projectDetails)) {
            setProjectData({
                ownership_group_id: projectDetails?.ownershipGroupId,
                organisation_container_id: projectDetails?.organisation_container_id,
                opportunity_id: projectDetails.opportunityId,
                name: projectDetails.name,
                street_address: projectDetails.streetAddress,
                city: projectDetails.city,
                state: projectDetails.state,
                zipcode: projectDetails.zipcode,
                property_url: projectDetails.propertyUrl,
                property_type: projectDetails.propertyType,
                per_unit_target_budget: projectDetails.perUnitTargetBudget,
                management: projectDetails.management,
                management_url: projectDetails.managementUrl,
                user_id: projectDetails.userId,
                project_type: projectDetails?.projectType,
                container_version: projectDetails.container_version,
                rfp_project_version: projectDetails.rfp_project_version,
                rfp_bid_details: projectDetails.rfp_bid_details,
                msa: projectDetails?.msa,
            });
            dispatch(
                actions.imsActions.getOrganizationContainersStart({
                    id: projectDetails?.ownershipGroupId,
                }),
            );
        }
        // eslint-disable-next-line
    }, [projectDetails]);

    // eslint-disable-next-line
    const updateProjectInfo = useCallback(
        debounce((key: string, data: any) => {
            dispatch(
                actions.projectDetails.updateProjectStart({
                    project_id: projectId,
                    input: { [key]: data },
                }),
            );
            //MIXPANEL : Event tracking for project updation
            TrackerUtil.event("PROJECT : Project Updated", {
                eventId: "project_project_updated",
                projectId,
                projectName: projectDetails?.name,
                bidStatus: projectDetails?.rfp_bid_details?.status,
                isProjectPublished: true,
            });
        }, 600),
        [],
    );

    const updateProjectData = (key: string, data: any) => {
        let val = data;
        setProjectData({ ...projectData, [key]: val });
        updateProjectInfo(key, data);
    };

    const deleteRentRoll = () => {
        setConfirm(false);
        dispatch(actions.projectOverview.deleteRentRollStart(projectId));
    };

    const downloadRentRollFile = async () => {
        window.open(rentRollDownloadLink);
    };

    const editProjectStatus = (status: string) => {
        dispatch(
            actions.projectDetails.updateProjectStatusStart({
                user_id: projectData.user_id,
                status,
                project_id: projectId,
            }),
        );
    };

    console.log(
        "org container name",
        projectData.organisation_container_id,
        configurations?.find((item) => item.id == projectData.organisation_container_id)?.name ??
            null,
    );

    const isLegacyProject = projectDetails.version == "1.0";
    const rentRollFileName = remoteFileReference && remoteFileReference.split("/").pop();
    const rentRollFeatureEnabled =
        projectDetails?.projectType == PROJECT_TYPE[0].value && isLegacyProject;
    const projectHasDSFiles = !!dataSourceUploadStatus && isLegacyProject;

    const showTakeoffTable =
        (projectHasDSFiles
            ? true
            : rentRollFeatureEnabled
            ? rentRollStatus == "success"
            : true || !!dataSourceUploadStatus) && isLegacyProject;
    return (
        <>
            <Box mx={6} my={3} className="Projects-overview">
                {loading && <BaseLoader />}
                <Paper elevation={3}>
                    <Grid container style={{ padding: "25px" }}>
                        <Grid item md={12} style={{ marginBottom: "20px" }}>
                            <span className="label">Project Details</span>
                        </Grid>
                        <Grid item md={4} style={{ paddingRight: "15px" }}>
                            {/* <IfFeatureEnabled feature=""> */}
                            <span className="input-label">Ownership Group</span>
                            {/* </IfFeatureEnabled> */}
                            <OwnerShip
                                disabled={projectDetails.propertyId ? true : false}
                                options={organization}
                                value={
                                    find(organization, {
                                        id: projectData.ownership_group_id,
                                    }) ?? null
                                }
                                setState={(val?: IOrg) => {
                                    updateProjectData("ownership_group_id", val?.id);
                                }}
                                refetchOrgFunc={() => {
                                    dispatch(actions.tpsm.fetchOrganizationStart({}));
                                }}
                                autocompleteSx={{
                                    ".MuiInputBase-input": {
                                        height: "0.85rem",
                                        marginRight: "0.5rem",
                                    },
                                    marginTop: ".5rem",
                                }}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <span className="input-label">Project Name</span>
                            <SInput
                                fullWidth
                                value={projectData.name}
                                onChange={(e) => updateProjectData("name", e.target.value)}
                                inputProps={{ "aria-label": "search" }}
                            />
                        </Grid>
                        <Grid item md={4}>
                            <span className="input-label">Project Type</span>
                            <Box style={{ marginRight: ".5rem" }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    value={projectData.project_type}
                                    onChange={(e) =>
                                        updateProjectData("project_type", e.target.value)
                                    }
                                    disabled
                                    placeholder="Project-type"
                                    sx={{
                                        height: "44px",
                                        marginTop: ".7rem",
                                        ".css-1kn7y0p-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                            {
                                                "-webkitTextFillColor": "#000000!important",
                                            },
                                    }}
                                >
                                    {map(PROJECT_TYPE, (project) => (
                                        <MenuItem key={project.value} value={project.value}>
                                            {project.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Grid>
                        <Grid container style={{ marginTop: "20px" }}>
                            <Grid item md={4} style={{ paddingRight: "15px" }}>
                                {/* <IfFeatureEnabled feature=""> */}
                                <span className="input-label">Project Status*</span>
                                {/* </IfFeatureEnabled> */}
                                <Autocomplete
                                    sx={{
                                        ".MuiInputBase-input": {
                                            height: "0.85rem",
                                            marginRight: "0.5rem",
                                        },
                                        marginTop: ".5rem",
                                    }}
                                    fullWidth
                                    options={PROJECT_STATUS}
                                    value={projectDetails?.status}
                                    getOptionLabel={(option: string) => option}
                                    clearOnBlur
                                    selectOnFocus
                                    onChange={(event, newValue: any) => {
                                        editProjectStatus(newValue);
                                    }}
                                    popupIcon={<KeyboardArrowDownIcon />}
                                    forcePopupIcon
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" />
                                    )}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Opportunity Id</span>
                                <SInput
                                    fullWidth
                                    value={projectData.opportunity_id}
                                    onChange={(e) =>
                                        updateProjectData("opportunity_id", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Container config</span>

                                <SInput
                                    fullWidth
                                    type="button"
                                    style={{ textOverflow: "ellipsis" }}
                                    onClick={() => {
                                        navigate(
                                            `/admin/ownerships/${projectData.ownership_group_id}/configuration/${projectData.organisation_container_id}`,
                                        );
                                    }}
                                    value={
                                        configurations?.find(
                                            (item) =>
                                                item.id == projectData.organisation_container_id,
                                        )?.name ?? null
                                    }
                                    endAdornment={
                                        <InputAdornment
                                            position="end"
                                            style={{
                                                position: "absolute",
                                                right: 30,
                                                paddingTop: "10px",
                                            }}
                                        >
                                            <IconButton aria-label="container config" edge="end">
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: "20px" }}>
                            <Grid item md={4}>
                                <span className="input-label">Street Address</span>
                                <SInput
                                    fullWidth
                                    value={projectData.street_address}
                                    onChange={(e) =>
                                        updateProjectData("street_address", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <span className="input-label">City</span>
                                <SInput
                                    fullWidth
                                    value={projectData.city}
                                    onChange={(e) => updateProjectData("city", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <span className="input-label">State</span>
                                <SInput
                                    fullWidth
                                    value={projectData.state}
                                    onChange={(e) => updateProjectData("state", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <span className="input-label">Zipcode</span>
                                <SInput
                                    fullWidth
                                    type="number"
                                    value={projectData.zipcode}
                                    onChange={(e) => updateProjectData("zipcode", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <span className="input-label">MSA</span>
                                <SInput
                                    fullWidth
                                    value={projectData.msa}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container style={{ marginTop: "20px" }}>
                            <Grid item md={4}>
                                <span className="input-label">Property URL (optional)</span>
                                <SInput
                                    fullWidth
                                    value={projectData.property_url}
                                    onChange={(e) =>
                                        updateProjectData("property_url", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4} style={{ marginRight: "20px" }}>
                                <span className="input-label">Property Type</span>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    value={projectData.property_type}
                                    onChange={(e) =>
                                        updateProjectData("property_type", e.target.value)
                                    }
                                    placeholder="Project-type"
                                    sx={{
                                        height: "44px",
                                        marginTop: ".7rem",
                                        ".css-1kn7y0p-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                                            {
                                                "-webkitTextFillColor": "#000000!important",
                                            },
                                    }}
                                >
                                    {map(PROPERTY_TYPE, (property_type) => (
                                        <MenuItem
                                            key={property_type.value}
                                            value={property_type.value}
                                        >
                                            {property_type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item md={3}>
                                <span className="input-label">
                                    Per Unit Target Budget (optional)
                                </span>
                                <Box pr={2}>
                                    <InputBase
                                        fullWidth
                                        value={projectData.per_unit_target_budget}
                                        onChange={(e) =>
                                            updateProjectData(
                                                "per_unit_target_budget",
                                                e.target.value,
                                            )
                                        }
                                        className="input-icon"
                                        inputProps={{ "aria-label": "search" }}
                                        style={{ border: "1px solid #CCCCCC" }}
                                        startAdornment={
                                            <InputAdornment position="start">$</InputAdornment>
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container style={{ marginTop: "20px" }}>
                            <Grid item md={4}>
                                <span className="input-label">User</span>
                                <Box mt={2.4} pr={2}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        fullWidth
                                        value={projectData.user_id}
                                        onChange={(e) =>
                                            updateProjectData("user_id", e.target.value)
                                        }
                                        sx={{ height: "44px" }}
                                    >
                                        {!allUsers.loading &&
                                            map(allUsers.users, (user, index) => (
                                                <MenuItem value={user.id} key={index}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Management</span>
                                <SInput
                                    fullWidth
                                    value={projectData.management}
                                    onChange={(e) =>
                                        updateProjectData("management", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4}>
                                <span className="input-label">Management Url</span>
                                <Box pr={2}>
                                    <SInput
                                        fullWidth
                                        value={projectData.management_url}
                                        onChange={(e) =>
                                            updateProjectData("management_url", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: "20px" }}>
                            <Grid item md={6}>
                                <span className="input-label">Offering Memo (optional)</span>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        disabled={true}
                                        startIcon={<img src={AddIcon} alt="add new Project" />}
                                        style={{ height: "100%" }}
                                    >
                                        Upload
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                {!isLegacyProject && (
                                    <div>
                                        <span className="input-label">Data Sync</span>
                                        <DataSyncButton
                                            project_id={projectId as string}
                                            style={{ marginTop: "4px" }}
                                        />
                                    </div>
                                )}

                                {isLegacyProject && <span className="input-label">Rent Roll</span>}
                                {isLegacyProject && (
                                    <Box mt={2}>
                                        {rentRollStatus == "success" ? (
                                            <Card
                                                sx={{
                                                    boxShadow: "0px 0px 21px rgba(0, 0, 0, 0.11)",
                                                }}
                                            >
                                                <Grid container py={3} px={6}>
                                                    <Grid item md={8}>
                                                        <Typography
                                                            variant="text_16_medium"
                                                            color={AppTheme.scopeHeader.label}
                                                        >
                                                            {rentRollFileName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={4}
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                    >
                                                        <Divider orientation="vertical" />
                                                        <Box
                                                            ml={3}
                                                            onClick={downloadRentRollFile}
                                                            sx={{ cursor: "pointer" }}
                                                        >
                                                            <DownLoad />
                                                        </Box>
                                                        <Box
                                                            ml={3}
                                                            onClick={() => setConfirm(true)}
                                                            sx={{ cursor: "pointer" }}
                                                        >
                                                            <Cross />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Card>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                disabled={!rentRollFeatureEnabled}
                                                onClick={() => setRentRoll(true)}
                                                startIcon={
                                                    <img src={AddIcon} alt="add new Project" />
                                                }
                                                style={{ height: "100%" }}
                                            >
                                                Upload
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                        {showTakeoffTable && <TakeOffsTable setUploadModal={setUploadModal} />}
                    </Grid>
                </Paper>
                <FileUploadModal
                    isModal={isUploadModal}
                    handleClose={() => setUploadModal(false)}
                />
                {openRentRoll && (
                    <RentRollModal
                        isOpen={openRentRoll}
                        handleClose={() => setRentRoll(false)}
                        setColumnMap={() => setColumnMap(true)}
                    />
                )}
                <ConfirmationModal
                    text="Are you sure you want to delete the Rent Roll file?"
                    onCancel={() => setConfirm(false)}
                    onProceed={deleteRentRoll}
                    open={confirm}
                    variant="deletion"
                    actionText="Delete"
                />
                <ColumnMapModal isOpen={openColumnMap} handleClose={() => setColumnMap(false)} />
            </Box>
        </>
    );
};

export default ProjectsOverview;
