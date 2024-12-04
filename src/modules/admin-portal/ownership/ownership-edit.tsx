import BaseTextField from "components/text-field";
// import OwnershipDialogIcon from "../../../assets/icons/icon-user-dialog.svg";
import CommonDialog from "../common/dialog";
import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useParams } from "react-router-dom";
import OwnershipDialogIcon from "../../../assets/icons/icon-user-dialog.svg";
import actions from "stores/actions";
import BaseDataGrid from "components/data-grid";
import { GridColumns, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import ContentPlaceholder from "components/content-placeholder";
import { useNavigate } from "react-router-dom";
import BaseButton from "components/button";
import RedWarningIcon from "../../../assets/icons/icon_warning_red.svg";
import ExclamationIcon from "../../../assets/icons/icon-exclamation.svg";

import {
    Box,
    Paper,
    Grid,
    Typography,
    CircularProgress as Loader,
    Autocomplete,
    TextField,
    InputLabel,
    Button,
    Stack,
    Dialog,
    DialogContent,
    Tooltip,
} from "@mui/material";
import {
    checkOwnership,
    initialOwnershipData,
    initialConfigurationData,
    OwnershipDialogConstants,
} from "../common/utils/constants";
import { IConfigurationFormData, IOwnershipFormData } from "../common/utils/interfaces";
import { isEmpty } from "lodash";
import BaseAutoComplete from "components/auto-complete";
import { gql } from "@apollo/client";
import { graphQLClient } from "utils/gql-client";

const GET_PROJECTS = gql`
    query getProjects($version: String) {
        getProjects(version: $version) {
            id
            name
            ownershipGroupId: ownership_group_id
            streetAddress: street_address
            city
            projectType: project_type
            state
            zipcode
            userId: user_id
            createdAt: created_at
            isDeleted: is_deleted
            opportunityId: opportunity_id
            version
            property_id
            system_remarks
        }
    }
`;

const OwnershipEdit = () => {
    const [ownershipData, setOwnershipData] = useState<IOwnershipFormData>(initialOwnershipData);
    const [ownershipError, setOwnershipError] = useState<boolean>(false);

    const [ownershipSet, setOwnershipSet] = useState<boolean>(false);
    const [refContainerId, setRefContainerId] = useState<string | null>(null);
    const [configurationDialog, setConfigurationDialog] = useState<boolean>(false);
    const [configurationData, setConfigurationData] =
        useState<IConfigurationFormData>(initialConfigurationData);
    const [projects, setProjects] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>("");
    const navigate = useNavigate();
    const { organizationId } = useParams();

    const {
        ownership,
        ownerships,
        loading,
        // saved,
        // error,
        users,
        configuration,
        configurations = [],
        confugration_fetched,
    } = useAppSelector((state) => ({
        ownership: state.ims.ims.ownership,
        ownerships: state.ims.ims.ownerships,
        loading: state.ims.ims.loading,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        users: state.ims.ims.users,
        configuration: state.ims.ims.configuration,
        configurations: state.ims.ims.configurations,
        confugration_fetched: state.ims.ims.confugration_fetched,
    }));

    const deleteConfiguration = () => {
        dispatch(
            actions.imsActions.deleteOrganizationContainerStart({
                id: deleteId,
            }),
        );
        setDeleteDialog(false);
    };

    const ConfigurationColumns: GridColumns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name",
                flex: 4.0,
                renderCell: (params: GridRenderCellParams) => (
                    <Box flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                        <Typography variant="text_14_regular">{params.row.name}</Typography>
                        {params.row?.is_default && (
                            <Tooltip title={"Default config"}>
                                <img
                                    style={{ marginLeft: "6px", marginBottom: "-5px" }}
                                    src={ExclamationIcon}
                                    alt="default config"
                                    title="default config"
                                />
                            </Tooltip>
                        )}
                    </Box>
                ),
            },
            {
                field: "projects",
                headerName: "Projects",
                flex: 4.0,
                renderCell: (params: GridRenderCellParams) => {
                    console.log(projects);

                    return (
                        <Typography variant="text_14_regular">
                            {params.row.project_ids.reduce(
                                (project_names: any, project_id: any, index: number) => {
                                    if (index === 0)
                                        return projects.find(
                                            (project: any) => project.id === project_id,
                                        )?.["name"];
                                    else
                                        return (
                                            //eslint-disable-next-line
                                            project_names +
                                            ", " +
                                            projects.find(
                                                (project: any) => project.id === project_id,
                                            )?.["name"]
                                        );
                                },
                                "",
                            )}
                        </Typography>
                    );
                },
            },
            // {
            //     field: "totalUnits",
            //     headerName: `Total Units (${unitMixDetail?.totalUnits})`,
            //     flex: 0.8,
            //     renderCell: (params: GridRenderCellParams) => (
            //         <Typography>
            //             <Typography variant="text_14_regular">
            //                 {params.row.totalUnits}
            //             </Typography>
            //         </Typography>
            //     ),
            // },
            {
                field: "actions",
                headerName: "Action",
                flex: 1.25,
                type: "actions",
                //eslint-disable-next-line
                getActions: (params: any) => {
                    return [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            disabled={
                                params.row?.is_default &&
                                organizationId != process.env.TAILORBIRD_ORGANISATION_ID
                            }
                            label={"Edit"}
                            // icon={
                            //     <img
                            //         src={ArchiveIcon}
                            //         alt="Delete Icon"
                            //     />
                            // }
                            onClick={() => {
                                navigate(
                                    `/admin/ownerships/${organizationId}/configuration/${params.row?.id}`,
                                );
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-setdefault-${params.row?.id}`}
                            label={"Duplicate config"}
                            onClick={() => {
                                setRefContainerId(params.row?.id);
                                openConfigurationDialog();
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={"Delete"}
                            // icon={
                            //     <img
                            //         src={ArchiveIcon}
                            //         alt="Delete Icon"
                            //     />
                            // }
                            onClick={() => {
                                setDeleteDialog(true);
                                setDeleteId(params.row.id);
                                // deleteConfiguration(params.row.id);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                },
            },
        ],
        //eslint-disable-next-line
        [configurations],
    );
    //eslint-disable-next-line
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!ownershipSet) {
            dispatch(
                actions.imsActions.getOrganisationnByIdStart({
                    input: {
                        id: organizationId,
                    },
                    type: "Ownership",
                }),
            );
        }
        //eslint-disable-next-line
    }, [ownershipSet]);

    useEffect(() => {
        if (!isEmpty(ownership)) {
            setOwnershipData({
                city: ownership.city,
                ownershipName: ownership.name,
                ownershipUrl: ownership.ownership_url,
                state: ownership.state,
                streetAddress: ownership.street_name,
                zipCode: ownership.zip_code,
                tailorbirdContact: ownership.primary_tb_contact,
                organizationType: ownership.organization_type?.map((elm: any) => {
                    if (elm.label == undefined) {
                        return {
                            value: elm,
                            label: OwnershipDialogConstants.ORG_TYPES.find(
                                (org: any) => org.value == elm,
                            )?.label,
                        };
                    } else {
                        return elm;
                    }
                }),
                googleWorkspaceEmail: ownership.google_workspace_email,
            });
            setOwnershipSet(true);
        }
        //eslint-disable-next-line
    }, [ownership, OwnershipDialogConstants]);

    useEffect(() => {
        getProjects();
        dispatch(
            actions.imsActions.getOrganizationContainersStart({
                id: organizationId,
            }),
        );
        //eslint-disable-next-line
    }, []);

    const getProjects = async () => {
        const response = (await graphQLClient.query("getProjects", GET_PROJECTS)).getProjects;

        // console

        setProjects(response.filter((elm: any) => organizationId === elm.ownershipGroupId));
    };

    const isValidUrl = (url?: string | null) => {
        //eslint-disable-next-line
        if (!url || url === "") return true;
        // if (!url || url === "" || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(url))
        //eslint-disable-next-line
        if (
            !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
                url,
            )
        )
            return false;
        return true;
    };

    const onSave = () => {
        if (!ownershipData?.ownershipName || ownershipData.ownershipName === "") {
            setOwnershipError(true);
            return;
        }
        dispatch(
            actions.imsActions.editOrganizationStart({
                input: {
                    name: ownershipData.ownershipName?.trim(),
                    street_name: ownershipData.streetAddress?.trim(),
                    city: ownershipData.city?.trim(),
                    state: ownershipData.state?.trim(),
                    zip_code: ownershipData.zipCode?.trim(),
                    ownership_url: ownershipData.ownershipUrl,
                    primary_tb_contact: ownershipData.tailorbirdContact?.trim(),
                    organization_type: ownershipData?.organizationType?.map((elm: any) => {
                        if (elm.label != undefined) {
                            return elm.value;
                        } else {
                            return elm;
                        }
                    }),
                    contact_number: "",
                    id: organizationId,
                },
                type: "Ownership",
            }),
        );
        // setOwnershipSet(false);
        setOwnershipError(false);
    };
    const tailorbirdPrimaryContacts = () => {
        return users
            ?.filter((user: any) => user?.roles === "ADMIN")
            .sort((a: any, b: any) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
    };

    // const calculateSelectedUser = () => {
    //     return users
    //         ?.filter((user: any) => user?.roles === "ADMIN")
    //         .find((elm: any) => elm.id === ownershipData.tailorbirdContact)?.name;
    // };

    const openConfigurationDialog = () => {
        setConfigurationDialog(true);
    };

    const onAddConfiguration = () => {
        console.log(configurationData);
        dispatch(
            actions.imsActions.addOrganizationContainerStart({
                input: {
                    name: configurationData.name?.trim(),
                    project_ids: configurationData.projectIds,
                    organisation_id: organizationId,
                    ref_container_id: refContainerId,
                },
            }),
        );
        setRefContainerId(null);
    };

    return (
        <>
            <CommonDialog
                open={configurationDialog}
                onClose={() => {
                    setConfigurationData(initialConfigurationData);
                    setConfigurationDialog(false);
                    setRefContainerId(null);
                }}
                title={"Configuration"}
                iconSrc={OwnershipDialogIcon}
                onSave={onAddConfiguration}
                error={configuration.error}
                saved={configuration.saved}
                loading={configuration.loading}
                errorText={"Error occured while trying to save configuration."}
                loaderText={"Configuraiton is being added."}
                savedText={"Configuraiton added successfully."}
                width="40rem"
                minHeight="13rem"
            >
                <Grid container direction="column" spacing="1rem">
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={12}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            Enter Name*
                                        </Typography>
                                    }
                                    fullWidth
                                    onChange={(e: any) =>
                                        setConfigurationData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    size="small"
                                    // value={configurationData.name}
                                    error={ownershipError}
                                    helper={
                                        ownershipError
                                            ? checkOwnership(
                                                  ownerships,
                                                  ownershipData.ownershipName,
                                              )
                                                ? "Please use Another organization name"
                                                : "This Field is required"
                                            : undefined
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <Autocomplete
                                    multiple
                                    filterSelectedOptions
                                    options={projects.map((s: any) => {
                                        return { label: s.name, id: s.id };
                                    })}
                                    getOptionLabel={(option: any) => option.label}
                                    renderInput={(params) => (
                                        <>
                                            <InputLabel
                                                sx={{ color: "#757575", marginBottom: "5px" }}
                                            >
                                                <Typography variant="text_12_regular">
                                                    {"Projects"}
                                                </Typography>
                                            </InputLabel>
                                            <TextField
                                                {...params}
                                                variant={"outlined"}
                                                size="small"
                                                inputProps={{
                                                    ...params?.inputProps,
                                                }}
                                            />
                                        </>
                                    )}
                                    fullWidth
                                    disableClearable={false}
                                    style={{ width: "100%" }}
                                    onChange={(event: any, selectedOptions: any) => {
                                        const selectedOrgTypes = selectedOptions.map(
                                            (option: any) => option.id,
                                        );
                                        setConfigurationData((prev) => ({
                                            ...prev,
                                            projectIds: selectedOrgTypes,
                                        }));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
            </CommonDialog>

            <>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <Box mx={6} my={3} className="Projects-overview">
                            <Paper elevation={3}>
                                <Grid container style={{ padding: "25px" }}>
                                    <Grid item md={12} style={{ marginBottom: "20px" }}>
                                        <span className="label">{ownershipData.ownershipName}</span>
                                    </Grid>
                                    <Grid container style={{ marginTop: "20px" }}>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {OwnershipDialogConstants.OWNERSHIP_NAME}
                                                    </Typography>
                                                }
                                                fullWidth
                                                disabled={true}
                                                onChange={(e: any) =>
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        ownershipName: e.target.value,
                                                    }))
                                                }
                                                size="small"
                                                value={ownershipData.ownershipName}
                                                error={ownershipError}
                                                helper={
                                                    ownershipError
                                                        ? checkOwnership(
                                                              ownerships,
                                                              ownershipData.ownershipName,
                                                          )
                                                            ? "Please use Another organization name"
                                                            : "This Field is required"
                                                        : undefined
                                                }
                                            />
                                        </Grid>
                                        <Grid item sm={4} style={{ paddingLeft: "20px" }}>
                                            <BaseAutoComplete
                                                fullWidth
                                                disableClearable={false}
                                                filterSelectedOptions
                                                options={tailorbirdPrimaryContacts()}
                                                getOptionLabel={(option: any) => option.name}
                                                variant="outlined"
                                                value={{
                                                    id: ownershipData.tailorbirdContact,
                                                    //@ts-ignore
                                                    name:
                                                        tailorbirdPrimaryContacts()?.find(
                                                            (elm: any) =>
                                                                elm.id ===
                                                                ownershipData.tailorbirdContact,
                                                        )?.name ?? "",
                                                }} //calculateSelectedUser()
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {
                                                            OwnershipDialogConstants.TAILORBIRD_CONTACT
                                                        }
                                                    </Typography>
                                                }
                                                size="small"
                                                onChange={(_: any, updatedContact: any) => {
                                                    console.log(updatedContact, "updated contanct");
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        tailorbirdContact: updatedContact?.id,
                                                    }));
                                                }}
                                            />
                                        </Grid>
                                        <Grid item sm={4} style={{ paddingLeft: "20px" }}>
                                            <Autocomplete
                                                multiple
                                                filterSelectedOptions
                                                value={ownershipData.organizationType?.map(
                                                    (elm: any) => {
                                                        if (elm.label == undefined) {
                                                            return {
                                                                value: elm,
                                                                label: OwnershipDialogConstants.ORG_TYPES.find(
                                                                    (org) => org.value === elm,
                                                                )?.label,
                                                            };
                                                        } else {
                                                            return elm;
                                                        }
                                                    },
                                                )}
                                                defaultValue={ownershipData.organizationType?.map(
                                                    (elm: any) => {
                                                        if (elm.label == undefined) {
                                                            return {
                                                                value: elm,
                                                                label: OwnershipDialogConstants.ORG_TYPES.find(
                                                                    (org) => org.value === elm,
                                                                )?.label,
                                                            };
                                                        } else {
                                                            return elm;
                                                        }
                                                    },
                                                )}
                                                options={OwnershipDialogConstants.ORG_TYPES}
                                                getOptionLabel={(option: any) => option.label}
                                                renderInput={(params) => (
                                                    <>
                                                        <InputLabel
                                                            sx={{
                                                                color: "#757575",
                                                                marginBottom: "5px",
                                                            }}
                                                        >
                                                            <Typography variant="text_12_regular">
                                                                {
                                                                    OwnershipDialogConstants.ORGANIZATION_TYPE
                                                                }
                                                            </Typography>
                                                        </InputLabel>
                                                        <TextField
                                                            {...params}
                                                            variant={"outlined"}
                                                            size="small"
                                                            inputProps={{
                                                                ...params?.inputProps,
                                                            }}
                                                        />
                                                    </>
                                                )}
                                                fullWidth
                                                disableClearable={false}
                                                style={{ width: "100%" }}
                                                onChange={(event: any, selectedOptions: any) => {
                                                    const selectedOrgTypes = selectedOptions.map(
                                                        (option: any) => option.value,
                                                    );
                                                    const updatedSelections: any =
                                                        OwnershipDialogConstants.ORG_TYPES.filter(
                                                            (org) => {
                                                                if (
                                                                    selectedOrgTypes.includes(
                                                                        org.value,
                                                                    )
                                                                ) {
                                                                    return org;
                                                                }
                                                            },
                                                        );

                                                    setOwnershipData((prev: any) => ({
                                                        ...prev,
                                                        organizationType: updatedSelections,
                                                    }));
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginTop: "20px" }}>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {OwnershipDialogConstants.OWNERSHIP_URL}
                                                    </Typography>
                                                }
                                                fullWidth
                                                onChange={(e: any) =>
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        ownershipUrl: e.target.value,
                                                    }))
                                                }
                                                size="small"
                                                value={ownershipData.ownershipUrl}
                                                error={ownershipError}
                                                helper={
                                                    // ownershipUrlError
                                                    //?
                                                    isValidUrl(ownershipData.ownershipUrl)
                                                        ? undefined
                                                        : "Please use a valid url"
                                                }
                                            />
                                        </Grid>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {
                                                            OwnershipDialogConstants.GOOGLE_WORKSPACE_EMAIL
                                                        }
                                                    </Typography>
                                                }
                                                fullWidth
                                                disabled={true}
                                                size="small"
                                                value={ownershipData.googleWorkspaceEmail}
                                            />
                                        </Grid>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {OwnershipDialogConstants.STREET_ADDRESS}
                                                    </Typography>
                                                }
                                                fullWidth
                                                size="small"
                                                onChange={(e: any) =>
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        streetAddress: e.target.value,
                                                    }))
                                                }
                                                value={ownershipData.streetAddress}
                                            />
                                        </Grid>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {OwnershipDialogConstants.CITY}
                                                    </Typography>
                                                }
                                                fullWidth
                                                size="small"
                                                onChange={(e: any) =>
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        city: e.target.value,
                                                    }))
                                                }
                                                value={ownershipData.city}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginTop: "20px" }}>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {OwnershipDialogConstants.STATE}
                                                    </Typography>
                                                }
                                                value={ownershipData.state}
                                                fullWidth
                                                size="small"
                                                onChange={(e: any) =>
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        state: e.target.value,
                                                    }))
                                                }
                                            />
                                        </Grid>
                                        <Grid item md={4} style={{ paddingLeft: "20px" }}>
                                            <BaseTextField
                                                variant="outlined"
                                                label={
                                                    <Typography variant="text_12_regular">
                                                        {OwnershipDialogConstants.ZIPCODE}
                                                    </Typography>
                                                }
                                                value={ownershipData.zipCode}
                                                fullWidth
                                                size="small"
                                                type="number"
                                                sx={{
                                                    "input::-webkit-outer-spin-button": {
                                                        "-webkit-appearance": "none",
                                                        margin: 0,
                                                    },
                                                    "input::-webkit-inner-spin-button": {
                                                        "-webkit-appearance": "none",
                                                        margin: 0,
                                                    },
                                                    "input[type=number]": {
                                                        "-moz-appearance": "textfield",
                                                    },
                                                }}
                                                onChange={(e: any) =>
                                                    setOwnershipData((prev) => ({
                                                        ...prev,
                                                        zipCode: e.target.value,
                                                    }))
                                                }
                                                onKeyDown={(event: any) => {
                                                    if (event.keyCode === 69)
                                                        event.preventDefault();
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item md={4} style={{ paddingTop: "30px" }}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                style={{ height: "40px" }}
                                                onClick={() => navigate("/admin/ownerships")}
                                            >
                                                <Typography variant="text_16_semibold">
                                                    {" "}
                                                    Cancel
                                                </Typography>
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={onSave}
                                                style={{ marginLeft: "10px", height: "40px" }}
                                            >
                                                <Typography variant="text_16_semibold">
                                                    {" "}
                                                    Save
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            paddingTop: "50px",
                                        }}
                                    >
                                        <span
                                            style={{ fontWeight: "500", fontSize: "21px" }}
                                            className="label"
                                        >
                                            Container Configurations
                                        </span>

                                        <Button
                                            variant="contained"
                                            onClick={openConfigurationDialog}
                                            style={{ marginLeft: "10px", height: "40px" }}
                                        >
                                            <Typography variant="text_16_semibold">
                                                {" "}
                                                + Configuration
                                            </Typography>
                                        </Button>
                                    </Box>
                                    <Grid container style={{ marginTop: "20px" }}>
                                        <BaseDataGrid
                                            columns={ConfigurationColumns}
                                            rows={configurations}
                                            rowsPerPageOptions={[10, 20, 30]}
                                            loading={!confugration_fetched}
                                            // onRowClick={(rowData: any) => {
                                            //     navigate(`/projects/${rowData.id}/overview`);
                                            // }}
                                            disableColumnMenu={false}
                                            components={{
                                                NoRowsOverlay: () => (
                                                    <Stack sx={{ margin: "10px" }}>
                                                        <ContentPlaceholder
                                                            // onLinkClick={() => {
                                                            //     setProjectModal(true);
                                                            // }}
                                                            text={`No configurations created.`}
                                                            aText=""
                                                            height="90px"
                                                        />
                                                    </Stack>
                                                ),
                                            }}
                                            hideFooter={configurations?.length < 10 ? true : false}
                                            getRowId={(row: any) => row.id}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                        {/* <>
                            {deleteDialog && (
                                <Stack height="100%" justifyContent="center" alignItems="center">
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            padding: "1rem",
                                            marginBottom: "3rem",
                                        }}
                                    >
                                        <img src={RedWarningIcon} alt="Delete icon" />
                                    </Paper>
                                    <Typography variant="text_18_regular" mb="2rem">
                                        {"Are you sure you want to delete this configuration"}
                                    </Typography>
                                    <Stack direction="row" justifyContent="flex-end" spacing="1rem">
                                        <BaseButton
                                            classes="grey default"
                                            onClick={() => setDeleteDialog(false)}
                                            label="No"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                        />
                                        <BaseButton
                                            classes="primary default"
                                            label="Yes"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                            onClick={() => deleteConfiguration?.()}
                                        />
                                    </Stack>
                                </Stack>
                            )}
                        </> */}

                        <Dialog open={deleteDialog}>
                            <DialogContent>
                                <Stack height="100%" justifyContent="center" alignItems="center">
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            padding: "1rem",
                                            marginBottom: "3rem",
                                        }}
                                    >
                                        <img src={RedWarningIcon} alt="Delete icon" />
                                    </Paper>
                                    <Typography variant="text_18_regular" mb="2rem">
                                        {"Are you sure you want to delete this configuration?"}
                                    </Typography>
                                    <Stack direction="row" justifyContent="flex-end" spacing="1rem">
                                        <BaseButton
                                            classes="grey default"
                                            onClick={() => setDeleteDialog(false)}
                                            label="No"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                        />
                                        <BaseButton
                                            classes="primary default"
                                            label="Yes"
                                            sx={{
                                                minHeight: "3rem",
                                            }}
                                            onClick={() => deleteConfiguration?.()}
                                        />
                                    </Stack>
                                </Stack>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </>
            {/* <Grid item md={12}>
                <Paper elevation={3}></Paper>
            </Grid> */}
        </>
    );
};

export default OwnershipEdit;
