import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    // InputBase,
    styled,
    MenuItem,
    // InputAdornment,
    Select,
    Dialog,
    Typography,
    DialogContent,
    TextField,
    Button,
    // FormHelperText,
    // FormControl,
    DialogTitle,
    CircularProgress as Loader,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../../stores/hooks";
import { map, find, isEmpty, cloneDeep } from "lodash";
import actions from "../../../../stores/actions";
import { PROPERTY_DATA, PROPERTY_TYPE } from "../../constant";
import { useNavigate } from "react-router-dom";
import OwnerShip from "../../../../components/ownership-dropdown";
import { IOrg } from "../../../package-manager/interfaces";
// import { useFeature } from "@growthbook/growthbook-react";
// import { FeatureFlagConstants } from "utils/constants";

// const SInput = styled(InputBase)(({ theme }) => ({
//     "& .MuiInputBase-input": {
//         borderRadius: 5,
//         backgroundColor: "#fcfcfb",
//         border: "1px solid #CCCCCC",
//         fontSize: 16,
//         marginTop: 10,
//         padding: "10px 12px",
//         marginRight: "15px",
//         transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
//     },
// }));
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
    const { organization, isProjectCreated, propertyDetails } = useAppSelector((state) => {
        return {
            organization: state.tpsm.organization,
            snackbar: state.common.snackbar,
            isProjectCreated: state.property.created_property.loading,
            propertyDetails: state.property.created_property.propertyDetails,
        };
    });
    const dispatch = useAppDispatch();
    const [propertyData, setProjectData] = useState(PROPERTY_DATA);
    const [validateField, setValidation] = useState({
        name: false,
        ownership_group_id: false,
        address: false,
        user_id: false,
        operator_id: false,
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
        setProjectData({ ...propertyData, [key]: val, ...obj });
    };

    useEffect(() => {
        console.log(propertyDetails);
        if (propertyDetails) {
            navigate(`/admin-properties/${propertyDetails.id}/overview`);
            dispatch(actions.property.createPropertyModify(""));
        }
        // eslint-disable-next-line
    }, [propertyDetails]);

    const createNewProject = () => {
        const validation = cloneDeep(validateField);
        if (isEmpty(propertyData.ownership_group_id) || isEmpty(propertyData.name)) {
            if (isEmpty(propertyData.ownership_group_id)) {
                validation.ownership_group_id = true;
            }
            if (isEmpty(propertyData.name)) {
                validation.name = true;
            }
            setValidation(validation);
            return false;
        } else {
            dispatch(
                actions.property.createPropertyStart({
                    ownership_group_id: propertyData.ownership_group_id,
                    operator_id: propertyData.operator_id,
                    name: propertyData.name,
                    type: propertyData.type,
                    address: propertyData.address,
                    zipcode: propertyData.zipcode,
                }),
            );
        }
    };
    return (
        <Dialog
            open={openModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => setProjectModal(false)}
            className="create-project-modal"
        >
            <DialogTitle
                style={{
                    border: "1px solid #DEDEDE",
                    paddingTop: "20px",
                    fontFamily: "IBM Plex Sans",
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "16px",
                    lineHeight: "21px",
                    color: "#000000",
                }}
            >
                Create Property
            </DialogTitle>

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
                                        filterOrgs={true}
                                        value={
                                            find(organization, {
                                                id: propertyData.ownership_group_id,
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
                                <Typography variant="text_14_regular">Property Name</Typography>
                                <STextField
                                    fullWidth
                                    error={validateField.name}
                                    id="filled-error-helper-text"
                                    helperText="Project name required*"
                                    value={propertyData.name}
                                    onChange={(e) => updateProjectData("name", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4} pr={4}>
                                <Typography variant="text_14_regular">Property Type</Typography>
                                <Box style={{ marginRight: ".5rem" }}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        fullWidth
                                        value={propertyData.type}
                                        onChange={(e) => updateProjectData("type", e.target.value)}
                                        placeholder="Project-type"
                                        sx={{
                                            height: "44px",
                                            marginTop: ".7rem",
                                        }}
                                    >
                                        {map(PROPERTY_TYPE, (property) => (
                                            <MenuItem key={property.value} value={property.value}>
                                                {property.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={4} pr={4}>
                                <Typography variant="text_14_regular">Property Address</Typography>
                                <STextField
                                    fullWidth
                                    error={validateField.address}
                                    id="filled-error-helper-text"
                                    helperText="Project name required*"
                                    value={propertyData.address}
                                    onChange={(e) => updateProjectData("address", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4} pr={4}>
                                <Typography variant="text_14_regular">Zipcode</Typography>
                                <STextField
                                    fullWidth
                                    type="number"
                                    value={propertyData.zipcode}
                                    onChange={(e) => updateProjectData("zipcode", e.target.value)}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            <Grid item md={4} pr={4}>
                                <Typography variant="text_14_regular">Operator</Typography>
                                <Box height={44}>
                                    <OwnerShip
                                        helperText="Ownership group required*"
                                        error={validateField.operator_id}
                                        value={
                                            find(organization, {
                                                id: propertyData.operator_id,
                                            }) ?? null
                                        }
                                        setState={(val?: IOrg) => {
                                            updateProjectData("operator_id", val?.id);
                                        }}
                                        autocompleteSx={{
                                            ".MuiInputBase-input": {
                                                height: "0.7rem",
                                                marginRight: "0.5rem",
                                            },
                                            marginTop: ".7rem",
                                        }}
                                        org_type="OPERATOR"
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={4} pr={4}>
                                <Typography variant="text_14_regular">Autodesk URL</Typography>
                                <STextField
                                    fullWidth
                                    type="text"
                                    value={propertyData.autodesk_url}
                                    onChange={(e) =>
                                        updateProjectData("autodesk_url", e.target.value)
                                    }
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </Grid>
                            {/*<Grid
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
                                        Opportunity Id
                                    </Typography>
                                    <SInput
                                        fullWidth
                                        value={projectData.opportunity_id}
                                        onChange={(e) =>
                                            updateProjectData("opportunity_id", e.target.value)
                                        }
                                        inputProps={{ "aria-label": "search" }}
                                    />
                                </Grid>
                                <Grid item md={8}>
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
                            </Grid>
                            <Grid container style={{ marginTop: "20px" }}>
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
                            </Grid>*/}

                            {/* <Grid container style={{ marginTop: "20px" }}>
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
                                <Grid container>
                                    {container_2_enabled && (
                                        <Grid item md={4}>
                                            <Typography variant="text_14_regular">
                                                Container Version
                                            </Typography>
                                            <Box mt={2.4} pr={2}>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    fullWidth
                                                    value={projectData.container_version}
                                                    onChange={(e) =>
                                                        updateProjectData(
                                                            "container_version",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="users"
                                                    sx={{ height: "44px" }}
                                                >
                                                    {map(
                                                        PROJECT_CONTAINER_VERSIONS,
                                                        (container_version) => {
                                                            const isDisable =
                                                                container_version == "1.0" &&
                                                                projectData.project_type ==
                                                                    PROJECT_TYPE[2].value;
                                                            return (
                                                                <MenuItem
                                                                    key={container_version}
                                                                    value={container_version}
                                                                    disabled={isDisable}
                                                                >
                                                                    {container_version}
                                                                </MenuItem>
                                                            );
                                                        },
                                                    )}
                                                </Select>
                                            </Box>
                                        </Grid>
                                    )}
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
                                </Grid>
                            </Grid> */}
                            <Grid container style={{ justifyContent: "end" }}>
                                <Grid item md={4.3} style={{ paddingTop: "30px" }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{
                                            width: "146px",
                                            height: "50px",
                                            left: "0px",
                                            bottom: "0px",
                                            background: "#EEEEEE",
                                            borderRadius: "5px",
                                        }}
                                        onClick={() => setProjectModal(false)}
                                    >
                                        <Typography
                                            style={{
                                                position: "absolute",
                                                width: "44px",
                                                height: "18px",
                                                left: "57px",
                                                bottom: "17px",
                                                fontFamily: "IBM Plex Sans",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                lineHeight: "18px",
                                            }}
                                        >
                                            {" "}
                                            Cancel
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={createNewProject}
                                        style={{
                                            marginLeft: "10px",
                                            height: "50px",
                                            // position: "absolute",
                                            width: "146px",
                                            // height: "50px",
                                            // left: "162px",
                                            bottom: "0px",
                                            background: "#004D71",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        <Typography
                                            style={{
                                                width: "31px",
                                                height: "18px",
                                                left: "220px",
                                                bottom: "18px",
                                                fontFamily: "'IBM Plex Sans'",
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                fontSize: "14px",
                                                lineHeight: "18px",
                                                textAlign: "center",

                                                color: "#FFFFFF",
                                            }}
                                        >
                                            Save
                                        </Typography>
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
