import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    InputBase,
    styled,
    MenuItem,
    InputAdornment,
    Select,
    Dialog,
    Typography,
    DialogContent,
    TextField,
    Button,
    FormHelperText,
    FormControl,
    DialogTitle,
    CircularProgress as Loader,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import { map, find, isEmpty, cloneDeep } from "lodash";
import actions from "../../../../stores/actions";
import { PROJECT_DATA, PROJECT_TYPE, RFP_PROJECT_VERSIONS } from "../../constant";
import { useNavigate } from "react-router-dom";
import OwnerShip from "../../../../components/ownership-dropdown";
import { IOrg } from "../../../package-manager/interfaces";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

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
}));
const STextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-root": {
        borderRadius: 5,
        backgroundColor: "#fcfcfb",
        fontSize: 16,
        marginTop: 10,
        height: "45px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    },
}));

interface IProjectModal {
    /* eslint-disable-next-line */
    setProjectModal: (val: boolean) => void;
    openModal: boolean;
}

const CreateProject = ({ setProjectModal, openModal }: IProjectModal) => {
    const navigate = useNavigate();
    const { organization, isProjectCreated, projectDetails, allUsers } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            snackbar: state.common.snackbar,
            isProjectCreated: state.tpsm.created_project.loading,
            projectDetails: state.tpsm.created_project.projectDetails,
            allUsers: state.tpsm.all_User,
        };
    });
    const dispatch = useAppDispatch();
    const [projectData, setProjectData] = useState(PROJECT_DATA);
    const [validateField, setValidation] = useState({
        name: false,
        ownership_group_id: false,
        user_id: false,
    });

    const updateProjectData = (key: string, data: any) => {
        let val = data;
        let obj = {};
        if (key === "ownership_group_id") {
            setValidation({ ...validateField, ownership_group_id: false });
        }
        if (key === "name") {
            setValidation({ ...validateField, name: false });
        }
        if (key === "user_id") {
            setValidation({ ...validateField, user_id: false });
        }
        if (key === "project_type" && val === PROJECT_TYPE[2].value) {
            obj = { container_version: "2.0" };
        } else if (key === "project_type") {
            obj = { container_version: "1.0" };
        }
        setProjectData({ ...projectData, [key]: val, ...obj });
    };

    useEffect(() => {
        if (projectDetails) {
            navigate(`/admin-projects/${projectDetails.id}/overview`);
            dispatch(actions.tpsm.createProjectModify(""));
        }
        // eslint-disable-next-line
    }, [projectDetails]);

    const createNewProject = () => {
        const validation = cloneDeep(validateField);
        if (
            isEmpty(projectData.ownership_group_id) ||
            isEmpty(projectData.name) ||
            isEmpty(projectData.user_id)
        ) {
            if (isEmpty(projectData.ownership_group_id)) {
                validation.ownership_group_id = true;
            }
            if (isEmpty(projectData.name)) {
                validation.name = true;
            }
            if (isEmpty(projectData.user_id)) {
                validation.user_id = true;
            }
            setValidation(validation);
            return false;
        } else {
            dispatch(
                actions.tpsm.createProjectStart({
                    ownership_group_id: projectData.ownership_group_id,
                    opportunity_id: projectData.opportunity_id,
                    name: projectData.name,
                    street_address: projectData.street_address,
                    city: projectData.city,
                    state: projectData.state,
                    zipcode: projectData.zipcode,
                    property_url: projectData.property_url,
                    property_type: projectData.property_type,
                    per_unit_target_budget: projectData.per_unit_target_budget,
                    management: projectData.management,
                    management_url: projectData.management_url,
                    user_id: projectData.user_id,
                    project_type: projectData.project_type,
                    container_version: projectData.container_version,
                    rfp_project_version: projectData.rfp_project_version,
                }),
            );
        }
    };
    const is_rfp_bidding_portal = useFeature(FeatureFlagConstants.RFP_2_BIDDING_PORTAL).on;
    return (
        <Dialog
            open={openModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => setProjectModal(false)}
            className="create-project-modal"
        >
            <DialogTitle id="alert-dialog-title">Create Project</DialogTitle>

            <DialogContent sx={{ "align-self": "center" }}>
                {isProjectCreated ? (
                    <Loader />
                ) : (
                    <Box mb={1} className="Projects-overview Projects-create-container">
                        <Grid container style={{ padding: "25px" }}>
                            <Grid item md={4} style={{ paddingRight: "15px" }}>
                                <Typography variant="text_14_regular">Ownership Group</Typography>
                                <Box height={44}>
                                    <OwnerShip
                                        helperText="Ownership group required*"
                                        error={validateField.ownership_group_id}
                                        value={
                                            find(organization, {
                                                id: projectData.ownership_group_id,
                                            }) ?? null
                                        }
                                        setState={(val?: IOrg) => {
                                            updateProjectData("ownership_group_id", val?.id);
                                        }}
                                        autocompleteSx={{
                                            ".MuiInputBase-input": {
                                                height: "0.7rem",
                                                marginRight: "0.5rem",
                                            },
                                            marginTop: ".7rem",
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={4} pr={4}>
                                <Typography variant="text_14_regular">Project Name</Typography>
                                <STextField
                                    fullWidth
                                    error={validateField.name}
                                    id="filled-error-helper-text"
                                    helperText="Project name required*"
                                    value={projectData.name}
                                    onChange={(e) => updateProjectData("name", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={2}>
                                <Typography variant="text_14_regular">Project Type</Typography>
                                <Box style={{ marginRight: ".5rem" }}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        fullWidth
                                        value={projectData.project_type}
                                        onChange={(e) =>
                                            updateProjectData("project_type", e.target.value)
                                        }
                                        placeholder="Project-type"
                                        sx={{
                                            height: "44px",
                                            marginTop: ".7rem",
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
                            <Grid item md={2}>
                                <Typography variant="text_14_regular">Opportunity Id</Typography>
                                <SInput
                                    fullWidth
                                    value={projectData.opportunity_id}
                                    onChange={(e) =>
                                        updateProjectData("opportunity_id", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid
                                container
                                style={{
                                    marginTop: `${
                                        validateField.ownership_group_id || validateField.name
                                            ? "20px"
                                            : "0px"
                                    }`,
                                }}
                            >
                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">
                                        Property URL (optional)
                                    </Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.property_url}
                                        onChange={(e) =>
                                            updateProjectData("property_url", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">Management</Typography>
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
                                    <Typography variant="text_14_regular">
                                        Management URL
                                    </Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.management_url}
                                        onChange={(e) =>
                                            updateProjectData("management_url", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: "20px" }}>
                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">
                                        Street Address
                                    </Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.street_address}
                                        onChange={(e) =>
                                            updateProjectData("street_address", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">City</Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.city}
                                        onChange={(e) => updateProjectData("city", e.target.value)}
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography variant="text_14_regular">State</Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.state}
                                        onChange={(e) => updateProjectData("state", e.target.value)}
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                                <Grid item md={2}>
                                    <Typography variant="text_14_regular">Zipcode</Typography>
                                    <SInput
                                        fullWidth
                                        type="number"
                                        value={projectData.zipcode}
                                        onChange={(e) =>
                                            updateProjectData("zipcode", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container style={{ marginTop: "20px" }}>
                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">Property Type</Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.property_type}
                                        onChange={(e) =>
                                            updateProjectData("property_type", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">
                                        Per Unit Target Budget (optional)
                                    </Typography>
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

                                <Grid item md={4}>
                                    <Typography variant="text_14_regular">User</Typography>
                                    <Box mt={2.4} pr={2}>
                                        <FormControl error={validateField.user_id} fullWidth>
                                            <Select
                                                id="demo-simple-select"
                                                fullWidth
                                                value={projectData.user_id}
                                                onChange={(e) =>
                                                    updateProjectData("user_id", e.target.value)
                                                }
                                                sx={{ height: "44px" }}
                                            >
                                                {!allUsers.loading &&
                                                    map(allUsers.users, (user) => (
                                                        <MenuItem key={user.id} value={user.id}>
                                                            {user.name}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                            <FormHelperText>User name required*</FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container style={{ marginTop: "20px" }}>
                                {is_rfp_bidding_portal && (
                                    <Grid item md={4}>
                                        <Typography variant="text_14_regular">
                                            RFP Project Version
                                        </Typography>
                                        <Box mt={2.4} pr={2}>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                fullWidth
                                                value={projectData.rfp_project_version}
                                                onChange={(e) =>
                                                    updateProjectData(
                                                        "rfp_project_version",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="RFP Project Versions"
                                                sx={{ height: "44px" }}
                                            >
                                                {RFP_PROJECT_VERSIONS.map((RFP_PROJECT_VERSION) => (
                                                    <MenuItem
                                                        key={RFP_PROJECT_VERSION}
                                                        value={RFP_PROJECT_VERSION}
                                                    >
                                                        {RFP_PROJECT_VERSION}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                            <Grid container>
                                <Grid item md={4} style={{ paddingTop: "30px" }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ height: "40px" }}
                                        onClick={() => setProjectModal(false)}
                                    >
                                        <Typography variant="text_16_semibold"> Cancel</Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={createNewProject}
                                        style={{ marginLeft: "10px", height: "40px" }}
                                    >
                                        <Typography variant="text_16_semibold"> Create</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateProject;
