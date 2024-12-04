import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import { PROJECT_TYPE, RFP_PROJECT_VERSIONS } from "modules/properties/constant";
import React, { ComponentProps, useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import { CREATE_PROPERTY_PROJECT } from "./constants";
import TrackerUtil from "utils/tracker";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { FeatureFlagConstants } from "utils/constants";
import { useFeature } from "@growthbook/growthbook-react";
import { IContainerConfig } from "stores/ims/interfaces";

type INewProjectModalProps = ComponentProps<"div"> & {
    property_id: string;
    open: boolean;
    onProjectCreate: any;
    onCancelClicked: any;
    configurations: IContainerConfig[];
};

export const CONTAINER_VERSION = [
    // stopped support of 2.0 project
    // {
    //     label: "2.0",
    //     value: "2.0",
    // },
    {
        label: "2.1",
        value: "2.1",
    },
];
const NewProjectModal: React.FC<INewProjectModalProps> = ({
    property_id,
    open,
    onProjectCreate,
    onCancelClicked,
    configurations,
}) => {
    const [projectName, setProjectName] = useState("");
    const [projectType, setProjectType] = useState("");
    const [selectedConfig, setSelectedConfig] = useState("");
    const [rfpType, setRfpType] = useState("");
    const [containerVersion, setContainerVersion] = useState<"2.0" | "2.1">("2.1");
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (configurations && configurations.length) {
            const defaultConfigs = configurations.filter((item) => item.is_default == true);
            if (defaultConfigs.length) {
                setSelectedConfig(defaultConfigs[0].id);
            }
        }
    }, [configurations]);

    async function createProject() {
        setLoading(true);
        try {
            const response = await graphQLClient.mutate("createProject", CREATE_PROPERTY_PROJECT, {
                input: {
                    name: projectName,
                    project_type: projectType,
                    property_id: property_id,
                    organisation_container_id: selectedConfig,
                    rfp_project_version: rfpType,
                    container_version: containerVersion,
                },
            });
            const { id } = response;
            onProjectCreate(id);
        } catch (error: any) {
            const description = error.graphQLErrors[0].extensions.response.body.error.description;
            enqueueSnackbar("", {
                variant: "error",
                action: <BaseSnackbar variant={"error"} title={description} />,
            });
            TrackerUtil.error(error, {});
        } finally {
            setLoading(false);
        }
    }
    const is_rfp_bidding_portal = useFeature(FeatureFlagConstants.RFP_2_BIDDING_PORTAL).on;
    return (
        <Dialog open={open} className="property-new-project-modal">
            <DialogTitle fontWeight={500}>
                {loading ? "Creating Project" : "Create Project"}
            </DialogTitle>
            <Divider />
            <DialogContent style={{ margin: "0px 16px" }}>
                <>
                    <Grid container flexDirection={"column"} gap={4}>
                        <Grid>
                            <Grid paddingBottom={2}>
                                <Typography>Project Name</Typography>
                            </Grid>
                            <TextField
                                disabled={loading}
                                title="Project Name"
                                placeholder="Enter Project Name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </Grid>

                        <Grid>
                            <Grid paddingBottom={2}>
                                <Typography>Container config</Typography>
                            </Grid>
                            <Select
                                defaultValue={selectedConfig}
                                disabled={loading}
                                onChange={(e) => setSelectedConfig(e.target.value)}
                                title="Container config"
                                label="Container config"
                                value={selectedConfig}
                                placeholder="Select container config"
                                style={{ minWidth: "12em" }}
                            >
                                {configurations.map((config) => (
                                    <MenuItem
                                        value={config.id}
                                        key={config.id}
                                        selected={config.id == selectedConfig}
                                    >
                                        {config.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid>
                            <Grid paddingBottom={2}>
                                <Typography>Project Type</Typography>
                            </Grid>
                            <Select
                                defaultValue={projectType}
                                disabled={loading}
                                onChange={(e) => setProjectType(e.target.value)}
                                title="Project Type"
                                label="Project Type"
                                value={projectType}
                                placeholder="Select Project Type"
                                style={{ minWidth: "12em" }}
                            >
                                {PROJECT_TYPE.map((pType) => (
                                    <MenuItem
                                        value={pType.value}
                                        key={pType.value}
                                        selected={pType.value == projectType}
                                    >
                                        {pType.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid>
                            {is_rfp_bidding_portal && (
                                <Grid>
                                    <Grid paddingBottom={2}>
                                        <Typography>RFP Project Version</Typography>
                                    </Grid>
                                    <Box mt={2.4} pr={2}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            fullWidth
                                            value={rfpType}
                                            onChange={(e) => setRfpType(e.target.value)}
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
                        <Grid>
                            <Grid paddingBottom={2}>
                                <Typography>Container version</Typography>
                            </Grid>
                            <Select
                                defaultValue={containerVersion}
                                disabled={loading}
                                onChange={(e) =>
                                    setContainerVersion(e.target.value as "2.1" | "2.0")
                                }
                                title="Container version"
                                label="Container version"
                                value={containerVersion}
                                placeholder="Select Container Version"
                                style={{ minWidth: "12em" }}
                            >
                                {CONTAINER_VERSION.map((pType) => (
                                    <MenuItem
                                        value={pType.value}
                                        key={pType.value}
                                        selected={pType.value == containerVersion}
                                    >
                                        {pType.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>

                    <Grid container paddingTop={4} paddingBottom={4}>
                        <Grid marginLeft={"auto"} marginRight={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={loading}
                                onClick={onCancelClicked}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                                disabled={loading}
                                variant="contained"
                                onClick={() => {
                                    createProject();
                                }}
                            >
                                <Grid container>
                                    <Grid>{loading ? "Creating" : "Create"}</Grid>
                                    {loading && (
                                        <Grid marginLeft={"2px"}>
                                            <CircularProgress size={"12px"} />
                                        </Grid>
                                    )}
                                </Grid>
                            </Button>
                        </Grid>
                    </Grid>
                </>
            </DialogContent>
        </Dialog>
    );
};

export default NewProjectModal;
