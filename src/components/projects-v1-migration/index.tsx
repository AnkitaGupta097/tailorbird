// import { gql } from "@apollo/client";
import {
    Autocomplete,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    Grid,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import BaseDataGrid from "components/data-grid";
import { GET_ALL_OWNERSHIPS } from "queries/b2b/project/project";
import React, { useEffect, useState } from "react";
import { GET_ALL_PROPERTIES } from "stores/projects/properties/property-queries";
import { graphQLClient } from "utils/gql-client";
import { GET_PROJECTS, TAG_PROPERTY } from "./constants";
import TrackerUtil from "utils/tracker";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { useNavigate } from "react-router-dom";
import { useFeature } from "@growthbook/growthbook-react";
import { FeatureFlagConstants } from "utils/constants";

const PropertyTagging = () => {
    const [propertyList, setPropertyList] = useState([] as Array<any>);
    const [rows, setRows] = useState([] as Array<any>);
    const [showModal, setShowModal] = useState(false);
    const [organizations, setOrganizations] = useState([] as Array<any>);
    const [selectedProperty, setSelectedProperty] = useState(undefined as any);
    const [selectedOrganization, setSelectedOrganization] = useState(undefined as any);
    const [newPropertyName, setNewPropertyName] = useState("");
    const [taggingInProgress, setTaggingInProgress] = useState(false);
    const [searchOrganizationName, setSearchOrganizationName] = useState("");
    const [searchProjectName, setSearchProjectName] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const featureDisabled = useFeature(FeatureFlagConstants.PROPERTY_BACK_FILL).off;

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    async function getV1Projects() {
        const orgs = new Map<string, string>();
        const response = (await graphQLClient.query("getProjects", GET_PROJECTS)).getProjects
            .filter((s: any) => s.property_id === null)
            .map((s: any) => {
                const org_name = s?.organization?.name;
                orgs.set(s.ownershipGroupId, org_name);
                return { ...s, organization_name: org_name, isSelected: false };
            });
        setRows(response);
    }

    async function getProperty() {
        const response = (await graphQLClient.query("getProperties", GET_ALL_PROPERTIES))
            .getProperties;
        setPropertyList(response);
        // console.log({ response });
    }

    async function getOrganization() {
        const response = (await graphQLClient.query("getAllOrganizations", GET_ALL_OWNERSHIPS))
            .getAllOrganizations;
        setOrganizations(response);
    }

    async function moveProjects() {
        setTaggingInProgress(true);
        const projectIds = rows.filter((row) => row.isSelected).map((s) => s.id);
        try {
            await graphQLClient.mutate("", TAG_PROPERTY, {
                propertyId: selectedProperty?.id ?? null,
                projectIds: projectIds,
                ownershipId: selectedOrganization?.id ?? null,
                propertyName: newPropertyName,
                propertyType: "",
            });

            showSnackBar("success", "Projects Are Tagged To The Property");
            getProperty();
            getOrganization();
            setRows([...rows.filter((s) => !projectIds.includes(s.id))]);
            setShowModal(false);
            gotoPropertyDataBackfill();
        } catch (err) {
            TrackerUtil.error(err, {});
            showSnackBar("error", "Property Tagging Failed");
        } finally {
            setTaggingInProgress(false);
        }
    }

    const showHeader = rows.filter((s) => s.isSelected).length > 0;

    function gotoPropertyDataBackfill() {
        navigate("/property-data-backfill");
    }

    useEffect(() => {
        getV1Projects();
        getProperty();
        getOrganization();
    }, []);
    const columns = [
        {
            field: "selected",
            headerName: "",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => (
                <Checkbox
                    disabled={featureDisabled}
                    style={{ color: "grey" }}
                    checked={params.row.isSelected}
                    onChange={() => {
                        setRows([
                            ...rows.map((s) => {
                                if (s.id == params.row.id) {
                                    const { isSelected } = s;
                                    return { ...s, isSelected: !isSelected };
                                }
                                return s;
                            }),
                        ]);
                    }}
                />
            ),
        },
        {
            field: "organization_name",
            headerName: "Organization Name",
            flex: 2,
        },
        { field: "name", headerName: "Project Name", flex: 2 },
        {
            field: "projectType",
            headerName: "Project Type",
            flex: 2,
        },
    ];

    const filteredRows = rows
        .filter((row: any) =>
            row.organization_name.toLowerCase().includes(searchOrganizationName.toLowerCase()),
        )
        .filter((row: any) => row.name.toLowerCase().includes(searchProjectName.toLowerCase()));

    return (
        <Grid margin={4}>
            <Grid marginTop={8} flexDirection={"column"}>
                <Grid container>
                    <Grid marginRight={4}>
                        <TextField
                            value={searchOrganizationName}
                            placeholder="Search Organization"
                            onChange={(e) => {
                                setSearchOrganizationName(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            value={searchProjectName}
                            placeholder="Search Project Name"
                            onChange={(e) => {
                                setSearchProjectName(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid marginLeft={"auto"} marginRight={4}>
                        <Button
                            onClick={() => {
                                gotoPropertyDataBackfill();
                            }}
                            variant="contained"
                            style={{ marginLeft: "auto" }}
                        >
                            Goto Property Data Backfill
                        </Button>
                    </Grid>
                    <Grid>
                        <Button
                            disabled={!showHeader}
                            onClick={() => {
                                setShowModal(true);
                            }}
                            variant="contained"
                            style={{ marginLeft: "auto" }}
                        >
                            Move To Property
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid marginTop={4}>
                <BaseDataGrid columns={columns} rows={filteredRows} rowsPerPageOptions={[50]} />
            </Grid>
            <Dialog
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
            >
                <DialogContent>
                    <Grid padding={4}>
                        <Grid>
                            <Typography>Select Existing Property</Typography>
                            <Autocomplete
                                disabled={taggingInProgress}
                                value={selectedProperty}
                                options={propertyList.map((s) => {
                                    return { label: s.name, id: s.id };
                                })}
                                onChange={(e, value) => {
                                    console.log({ e });
                                    setSelectedProperty(value);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                        <center>
                            <Typography>––– or –––</Typography>
                        </center>

                        <Grid>
                            <Typography>Create New Property</Typography>
                            <Grid>
                                <TextField
                                    disabled={taggingInProgress}
                                    placeholder="Property Name"
                                    value={newPropertyName}
                                    fullWidth
                                    onChange={(e) => {
                                        setNewPropertyName(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid marginTop={4}>
                                <Autocomplete
                                    disabled={taggingInProgress}
                                    value={selectedOrganization}
                                    options={organizations.map((s) => {
                                        return { label: s.name, id: s.id };
                                    })}
                                    onChange={(e, value) => {
                                        console.log({ e });
                                        setSelectedOrganization(value);
                                    }}
                                    renderInput={(props) => (
                                        <TextField placeholder="Organization Name" {...props} />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Divider style={{ marginTop: "4px" }} />
                        <Grid>
                            {showHeader && (
                                <Typography>The following projects will be moved</Typography>
                            )}
                            {rows
                                .filter((s) => s.isSelected)
                                .map((t) => (
                                    <ListItem key={t.id}>
                                        <ListItemText
                                            primary={t.name}
                                            secondary={`${t.projectType} | ${t.organization_name}`}
                                            secondaryTypographyProps={{ color: "black" }}
                                        />
                                    </ListItem>
                                ))}
                        </Grid>
                    </Grid>
                    <Grid flexDirection={"row"} container>
                        <Button
                            disabled={taggingInProgress}
                            onClick={moveProjects}
                            variant="contained"
                            style={{ marginLeft: "auto" }}
                        >
                            <Grid container>
                                {taggingInProgress && (
                                    <Grid marginRight={4}>
                                        <CircularProgress size={12} />
                                    </Grid>
                                )}
                                <Grid>
                                    {taggingInProgress ? "Moving Projects" : "Move Projects"}
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

export default PropertyTagging;
