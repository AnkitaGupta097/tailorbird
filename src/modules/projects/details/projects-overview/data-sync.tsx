import { gql } from "@apollo/client";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    Typography,
} from "@mui/material";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { graphQLClient } from "utils/gql-client";
import TrackerUtil from "utils/tracker";

const query = gql`
    mutation SyncV2ProjectDataFromProperty($projectId: String) {
        syncV2ProjectDataFromProperty(project_id: $projectId)
    }
`;
const SYNC_CONTAINER = gql`
    mutation SyncContainer($projectId: String) {
        syncContainer(project_id: $projectId) {
            id
        }
    }
`;
type DataSyncButtonProps = React.ComponentProps<"div"> & {
    project_id: string;
};

const DataSyncButton = ({ project_id, ...props }: DataSyncButtonProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [progress, setIsProgress] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    async function onDataSync() {
        setIsProgress(true);
        TrackerUtil.event("PROJECT_DATA_SYNC_FROM_PROPERTY_CLICKED", { project_id });
        try {
            await graphQLClient.mutate("", query, { projectId: project_id });
            showSnackBar("success", "Project data synced from the property");
        } catch (error) {
            TrackerUtil.error(error, { project_id, name: "PROJECT_DATA_SYNC_FROM_PROPERTY" });
            showSnackBar("error", "Project data could not be synced from the property");
        } finally {
            setIsProgress(false);
        }
    }
    const syncContainer = async () => {
        try {
            const response = await graphQLClient.mutate("syncContainer", SYNC_CONTAINER, {
                projectId: project_id,
            });
            const numberOfProjectsSynced = response?.syncContainer?.length ?? 0;
            showSnackBar("success", `${numberOfProjectsSynced} items synced!`);
        } catch (error) {
            showSnackBar("error", "Container sync failed!");
        }
    };
    return (
        <div {...props}>
            <Box width="184px" gap="6px" display="flex" flexDirection="column">
                <Button
                    variant="contained"
                    onClick={() => {
                        setModalOpen(true);
                    }}
                >
                    Sync Takeoffs
                </Button>
                <Button variant="contained" onClick={syncContainer}>
                    Sync Container
                </Button>
            </Box>
            <Dialog open={modalOpen}>
                <DialogContent>
                    <Grid container>
                        <Grid item>
                            <Typography>
                                You are about to sync new data into project from the property. The
                                variations in this project might need rework after data sync from
                                properties. Are you sure you want to sync data?
                            </Typography>
                        </Grid>
                        <Grid flexDirection={"row"} container marginTop={"8px"}>
                            <Grid marginLeft={"auto"}>
                                <Button
                                    disabled={progress}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        setModalOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid marginLeft={"8px"}>
                                <Button
                                    disabled={progress}
                                    variant="contained"
                                    color="error"
                                    onClick={onDataSync}
                                >
                                    <Grid flexDirection={"row"} container>
                                        <Grid marginRight={"4px"}>
                                            {progress && <CircularProgress size={"12px"} />}
                                        </Grid>
                                        <Grid>Proceed</Grid>
                                    </Grid>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DataSyncButton;
