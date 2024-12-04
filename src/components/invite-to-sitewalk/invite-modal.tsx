import React, { useEffect, useState } from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { graphQLClient } from "utils/gql-client";
import { GET_ORGANIZATION_SITEWALK_STATUS, INVITE_TO_SITEWALK } from "./constants";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";

interface ISitewalkInviteModalProps {
    organization_id: string;
    project_id: string;
    organization_name: string;
    isOpen: boolean;
    onInvite: Function;
    onClose: Function;
}

interface SitewalkInviteConfig {
    sitewalkDate: string | null;
    sitewalkTime: string;
    buildingContact: string;
    buildingContactEmail: string;
    buildingContactPhone: string;
    note: string;
}

const SitewalkInviteModal: React.FC<ISitewalkInviteModalProps> = ({
    organization_id,
    project_id,
    organization_name,
    isOpen,
    onInvite,
    onClose,
}) => {
    const [sitewalkInviteConfig, setSitewalkConfig] = useState({
        sitewalkDate: null,
        sitewalkTime: "",
        note: "",
        buildingContact: "",
        buildingContactEmail: "",
        buildingContactPhone: "",
    } as SitewalkInviteConfig);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSitewalkInvite();
        // eslint-disable-next-line
    }, []);

    const { enqueueSnackbar } = useSnackbar();

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    async function getSitewalkInvite() {
        setLoading(true);
        try {
            const response = await graphQLClient.query(
                "getOrganizationSitewalkStatus",
                GET_ORGANIZATION_SITEWALK_STATUS,
                {
                    projectId: project_id,
                    organizationId: organization_id,
                },
            );
            const { getOrganizationSitewalkStatus } = response;
            const { invite_config } = getOrganizationSitewalkStatus;

            const date_time = invite_config.scheduled_date_time.split(" ");
            const date_parts = date_time[0].split("-");
            // Received date from server is of format DD-MM-YYYY
            // Reformat to YYYY-MM-DD
            setSitewalkConfig({
                sitewalkDate: `${date_parts[2]}-${date_parts[0]}-${date_parts[1]}`,
                sitewalkTime: date_time[1],
                note: invite_config.note,
                buildingContact: invite_config.building_contact,
                buildingContactEmail: invite_config.building_contact_email,
                buildingContactPhone: invite_config.building_contact_phone,
            });
        } catch (error) {
            console.error(error);
            setSitewalkConfig({
                sitewalkDate: null,
                sitewalkTime: "",
                note: "",
                buildingContact: "",
                buildingContactEmail: "",
                buildingContactPhone: "",
            });
        } finally {
            setLoading(false);
        }
    }

    async function inviteToSitewalk() {
        setLoading(true);
        // const localDate = new Date();
        if (
            (sitewalkInviteConfig.sitewalkDate && !sitewalkInviteConfig.sitewalkTime) ||
            (sitewalkInviteConfig.sitewalkTime && !sitewalkInviteConfig.sitewalkDate)
        ) {
            showSnackBar("error", "Select either both time and date or none");
            setLoading(false);
            return;
        }
        try {
            const payload = {
                projectId: project_id,
                organizationId: organization_id,
                sitewalkDate: sitewalkInviteConfig.sitewalkDate,
                sitewalkTime: sitewalkInviteConfig.sitewalkTime,
                buildingContact: sitewalkInviteConfig.buildingContact,
                buildingContactEmail: sitewalkInviteConfig.buildingContactEmail,
                buildingContactPhone: sitewalkInviteConfig.buildingContactPhone,
                note: sitewalkInviteConfig.note,
            };
            const response = await graphQLClient.mutate(
                "inviteToSitewalk",
                INVITE_TO_SITEWALK,
                payload,
            );
            const { inviteToSitewalk } = response;
            onInvite(inviteToSitewalk);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen}>
            <DialogTitle>{organization_name}: Invite To Sitewalk</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid>
                        <Typography>Sitewalk Date (Optional)</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={sitewalkInviteConfig.sitewalkDate}
                                onChange={(newValue: any) => {
                                    setSitewalkConfig({
                                        ...sitewalkInviteConfig,
                                        sitewalkDate: newValue
                                            ? (newValue.format("YYYY-MM-DD") as string)
                                            : newValue,
                                    });
                                }}
                                renderInput={(params) => (
                                    <>
                                        <TextField
                                            disabled={loading}
                                            fullWidth
                                            variant={"outlined"}
                                            {...params}
                                            size="small"
                                            error={false}
                                            helperText={"Select Date"}
                                        />
                                    </>
                                )}
                                disabled={false}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid style={{ marginLeft: "auto" }}>
                        <Typography>Sitewalk Time (Optional)</Typography>
                        <TextField
                            size="small"
                            type="time"
                            fullWidth
                            disabled={loading}
                            value={sitewalkInviteConfig.sitewalkTime}
                            onChange={(e) => {
                                setSitewalkConfig({
                                    ...sitewalkInviteConfig,
                                    sitewalkTime: e.target.value,
                                });
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container marginBottom={4}>
                    <Typography>Building Contact (Optional)</Typography>
                    <TextField
                        size="small"
                        fullWidth
                        disabled={loading}
                        value={sitewalkInviteConfig.buildingContact}
                        onChange={(e) => {
                            setSitewalkConfig({
                                ...sitewalkInviteConfig,
                                buildingContact: e.target.value,
                            });
                        }}
                    />
                </Grid>
                <Grid container marginBottom={4}>
                    <Grid marginRight={2}>
                        <Typography>Building Contact Email (Optional)</Typography>
                        <TextField
                            size="small"
                            fullWidth
                            disabled={loading}
                            value={sitewalkInviteConfig.buildingContactEmail}
                            onChange={(e) => {
                                setSitewalkConfig({
                                    ...sitewalkInviteConfig,
                                    buildingContactEmail: e.target.value,
                                });
                            }}
                        />
                    </Grid>
                    <Grid marginLeft={"auto"}>
                        <Typography>Contact Phone Number (Optional)</Typography>
                        <Grid marginLeft={"auto"}>
                            <TextField
                                size="small"
                                fullWidth
                                disabled={loading}
                                value={sitewalkInviteConfig.buildingContactPhone}
                                onChange={(e) => {
                                    setSitewalkConfig({
                                        ...sitewalkInviteConfig,
                                        buildingContactPhone: e.target.value,
                                    });
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    <Typography>Message (Optional)</Typography>
                    <TextField
                        size="small"
                        multiline
                        disabled={loading}
                        fullWidth
                        value={sitewalkInviteConfig.note}
                        onChange={(e) => {
                            setSitewalkConfig({
                                ...sitewalkInviteConfig,
                                note: e.target.value,
                            });
                        }}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container marginBottom={4} paddingLeft={4}>
                    <Grid>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={loading}
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid marginLeft={2}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={inviteToSitewalk}
                            disabled={loading}
                        >
                            <Grid container>
                                <Grid>Invite</Grid>
                                {loading && (
                                    <Grid marginLeft={2}>
                                        <CircularProgress size={12} />
                                    </Grid>
                                )}
                            </Grid>
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default SitewalkInviteModal;
