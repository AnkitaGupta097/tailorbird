import { Grid, Typography, Box, Stack, Paper } from "@mui/material";
import AppTheme from "../../../styles/theme";
import BaseDataGrid from "components/data-grid";
import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { IValue } from "../constant";
import ConfirmationModal from "components/confirmation-modal";
import Loader from "modules/admin-portal/common/loader";
import ContentPlaceholder from "../../../components/content-placeholder";
import { ActionMenuText } from "../constant";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import { cloneDeep, isEmpty } from "lodash";
import { graphQLClient } from "utils/gql-client";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { STATUS } from "modules/admin-portal/common/utils/constants";
import BaseAutoComplete from "components/auto-complete";
import BaseSnackbar from "components/base-snackbar";
import { RESEND_INVITE, EDIT_USER, DELETE_USER } from "stores/ims/queries";
import UserModal from "modules/admin-portal/users/modal/userModal";
import CommonDialog from "modules/admin-portal/common/dialog";
import Link from "@mui/material/Link";

const COLLABORATOR_DIALOG_TEXT = {
    ADD_NEW_USER_LOADER_TEXT: "User is being added",
    ADD_NEW_USER_ERROR_TEXT: "User creation failed",
    ADD_NEW_USER_SUCCESS_TEXT: "User is successfully added",
    DELETE_USER_LOADER_TEXT: "User is being deleted",
    RESEND_INVITE_LOADER_TEXT: "Invitation is being sent",
    INVITE_COLLABORATORS_LOADER_TEXT: "Your invitation is being sent",
};

const CollaboratorsList = () => {
    const organizationId = localStorage.getItem("organization_id") || "";
    const { projectId, role } = useParams();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [isModal, setModal] = useState<any>(false);
    const [openWarningModal, setWarningModal] = useState({
        deactive: "",
        revoke: "",
        invite: "",
    });
    const isAdmin = role === "contractor_admin" || role === "admin";
    const user_id = localStorage.getItem("user_id");
    const [editUser, setEditUser] = useState<any>(null);
    const [newUser, setNewUser] = useState<any>(null);
    const [deleteUser, setDeleteUser] = useState<any>({ deleteText: "", open: false, row: null });
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [collaborators, setCollaborators] = useState<IValue[]>([]);
    const [value, setValue] = React.useState<any[]>([]);
    const [isUpdate, setIsUpdate] = useState<any>(false);
    let [loader, setLoader] = React.useState<{
        open: boolean;
        loaderText: string;
        errorText: string;
        saveText: string;
    }>({ open: false, loaderText: "", errorText: "", saveText: "" });
    const { contractorWithUsers, users, loading, error, loaderState, projectDetails } =
        useAppSelector((state) => {
            return {
                contractorWithUsers: projectId
                    ? state.rfpProjectManager.details?.[projectId]?.collaboratorsList
                    : [],
                loading: state.rfpProjectManager.loading,
                error: state.rfpProjectManager.error,
                loaderState: state.rfpProjectManager.loaderState,
                users: state.ims.ims.usersByOrg?.[organizationId] ?? [],
                projectDetails: state?.projectDetails?.data,
            };
        });

    const defaultRows = [
        {
            id: "add_row",
            name: "",
            email: "",
            role: "",
            status: "",
            action: "",
        },
    ];

    const rfp_project_version = "2.0";

    useEffect(() => {
        setLoader({
            open: true,
            loaderText: "Please wait. Loading project details ...",
            errorText: "",
            saveText: "",
        });
        dispatch(actions.projectDetails.fetchProjectDetailsStart(projectId));
        if (isAdmin) {
            dispatch(
                actions.imsActions.fetchUsersByOrgIdStart({
                    organization_id: organizationId,
                }),
            );
        }
        dispatch(
            actions.rfpProjectManager.fetchAssignedContractorListForOrganizationStart({
                project_id: projectId,
                organization_id: organizationId,
                rfp_project_version: rfp_project_version,
            }),
        );
        setTimeout(() => {
            setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
            setTimeout(() => {
                dispatch(
                    actions.rfpProjectManager.resetState({
                        project_id: projectId,
                    }),
                );
            }, 200);
        }, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let notAssignedUsers: any[] = [];
        if (contractorWithUsers?.length > 0 && users.length > 0) {
            users.map((user: any) => {
                const index = contractorWithUsers.findIndex(
                    (item: any) => item.email === user.email,
                );
                const currentIndex = notAssignedUsers.findIndex(
                    (item: any) => item.email === user.email,
                );
                if (index === -1 && currentIndex === -1 && user.status !== "INACTIVE") {
                    notAssignedUsers.push(user);
                }
            });
        }
        if (notAssignedUsers.length > 0) {
            setAvailableUsers(notAssignedUsers);
        }
    }, [users, contractorWithUsers]);

    useEffect(() => {
        if (newUser && users.length > 0) {
            const imsUser = users.find((item: any) => item.email === newUser.email);
            const userExistsOnList = contractorWithUsers.findIndex(
                (item: any) => item.email === newUser.email,
            );
            if (imsUser && userExistsOnList == -1) {
                setValue((prev) => [...prev, imsUser]);
                setNewUser(null);
            }
        }
    }, [users, newUser, contractorWithUsers]);

    useEffect(() => {
        if (contractorWithUsers?.length > 0) {
            let collaboratorsOnProject = contractorWithUsers.map((i: any) => {
                let user = cloneDeep(i);
                user.role = user.roles[0] == "CONTRACTOR_ADMIN" ? "Contractor Admin" : "Estimator";
                return user;
            });
            setCollaborators(collaboratorsOnProject);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractorWithUsers]);

    useEffect(() => {
        if ((!loading || error.statusCode !== 200) && loader.open) {
            setTimeout(() => {
                setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                setTimeout(() => {
                    dispatch(
                        actions.rfpProjectManager.resetState({
                            project_id: projectId,
                        }),
                    );
                }, 200);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error.statusCode]);

    useEffect(() => {
        if (loaderState.open) {
            setLoader(loaderState);
            setTimeout(() => {
                setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                dispatch(
                    actions.rfpProjectManager.resetState({
                        project_id: projectId,
                    }),
                );
            }, 1000);
        }
        //eslint-disable-next-line
    }, [loaderState]);

    const cancleWarningModal = (key: string) => {
        setWarningModal({ ...openWarningModal, [key]: "" });
    };

    const removeUserFromProject = () => {
        if (deleteUser?.row) {
            setLoader({
                open: true,
                loaderText: COLLABORATOR_DIALOG_TEXT.DELETE_USER_LOADER_TEXT,
                errorText: "",
                saveText: "",
            });
            dispatch(
                actions.rfpProjectManager.removeCollaboratorStart({
                    contractors_list: [
                        { contractor_id: deleteUser?.row?.id, organization_id: organizationId },
                    ],
                    project_id: projectId,
                    rfp_project_version: rfp_project_version,
                }),
            );
            setDeleteUser({ deleteText: "", open: false, row: null });
        }
    };

    const resendInvite = async (email: string, message?: string) => {
        try {
            await graphQLClient.mutate("resendInvite", RESEND_INVITE, {
                payload: { email: email },
            });
            showSnackBar("success", message || "Invite resent.");
            dispatch(actions.imsActions.fetchAllUsersStart(organizationId));
        } catch (error) {
            showSnackBar("error", "Something went wrong.");
        }
    };

    const reInviteCollaborators = (userData: any): void => {
        dispatch(
            actions.rfpProjectManager.inviteCollaboratorsStart({
                collaborators: [collaborators.find((user: any) => user?.id === userData.id)],
                project_id: projectId,
                organizationId: organizationId,
                collaboratorsList: contractorWithUsers ?? [],
                rfp_project_version: "2.0",
                invited_by: user_id,
            }),
        );
    };

    const inviteCollaborators = async () => {
        setLoader({
            open: true,
            loaderText: COLLABORATOR_DIALOG_TEXT.INVITE_COLLABORATORS_LOADER_TEXT,
            errorText: "",
            saveText: "",
        });

        setCollaborators([...collaborators, ...value]);
        if (value.length > 0) {
            dispatch(
                actions.rfpProjectManager.inviteCollaboratorsStart({
                    collaborators: value,
                    project_id: projectId,
                    organizationId: organizationId,
                    collaboratorsList: contractorWithUsers ?? [],
                    rfp_project_version: "2.0",
                    invited_by: user_id,
                }),
            );
        }
        setAvailableUsers([]);
        setValue([]);
        setWarningModal({ ...openWarningModal, invite: "" });
    };

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    const revokeUser = async (id: string) => {
        try {
            await graphQLClient.mutate("deleteUser", DELETE_USER, {
                deleteUserId: id,
            });
            showSnackBar("success", "Invite revoked.");
            dispatch(actions.imsActions.fetchAllUsersStart(organizationId));
            dispatch(
                actions.rfpProjectManager.fetchAssignedContractorListForOrganizationStart({
                    project_id: projectId,
                    organization_id: organizationId,
                    rfp_project_version: rfp_project_version,
                }),
            );
            cancleWarningModal("revoke");
        } catch (error) {
            showSnackBar("error", "Something went wrong.");
            cancleWarningModal("revoke");
        }
    };

    const updateUserStatus = async (id: string, status: string) => {
        try {
            await graphQLClient.mutate("editUser", EDIT_USER, {
                payload: { id, status },
            });
            showSnackBar("success", "User deactivated.");
            dispatch(actions.imsActions.fetchAllUsersStart(organizationId));
            cancleWarningModal("deactive");
        } catch (error) {
            showSnackBar("error", "Something went wrong.");
            cancleWarningModal("deactive");
        }
    };

    const allRows = [...defaultRows, ...collaborators];

    const columns = [
        {
            field: "name",
            headerName: "Person",
            headerAlign: "left",
            align: "left",
            minWidth: 200,
            flex: 2,
            colSpan: ({ row }: { row: any }) => {
                if (row.id === "add_row") {
                    return 2;
                }
                return undefined;
            },
            renderCell: (params: GridRenderCellParams) => {
                if (params.row.id === "add_row") {
                    return (
                        <>
                            <BaseAutoComplete
                                variant={"filled"}
                                options={availableUsers}
                                onChange={(event: any, newValue: any) => {
                                    if (newValue?.id) {
                                        setWarningModal({
                                            ...openWarningModal,
                                            invite: params.row?.id,
                                        });
                                        setValue([newValue]);
                                    }
                                }}
                                style={{ width: 400 }}
                                placeholder={"Add from collaborators on your other bids"}
                                selectOnFocus
                                clearOnBlur
                                getOptionLabel={(option: { name: any }) => option.name}
                                PaperProps={{
                                    sx: {
                                        padding: "5px",
                                    },
                                }}
                            />
                        </>
                    );
                } else {
                    return (
                        <>
                            <Typography
                                fontFamily={"IBM Plex Sans"}
                                variant="text_14_regular"
                                color={
                                    params.row.status == "DEACTIVATED"
                                        ? AppTheme.text.medium
                                        : { color: "#004D71" }
                                }
                            >
                                {localStorage.getItem("email") === params.row.email
                                    ? `${params?.row?.name} (You)`
                                    : params?.row?.name}
                            </Typography>
                        </>
                    );
                }
            },
        },
        {
            field: "role",
            headerName: "Role",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Typography
                        fontFamily={"IBM Plex Sans"}
                        fontSize={"14px"}
                        fontStyle={"normal"}
                        fontWeight={"400"}
                        lineHeight={"normal"}
                        sx={{ color: "#757575" }}
                    >
                        {params?.row?.role} &nbsp;
                    </Typography>
                </>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            autowidth: true,
            flex: 3,
            colSpan: ({ row }: { row: any }) => {
                if (row.id === "add_row") {
                    return 5;
                }
                return undefined;
            },
            renderCell: (params: GridRenderCellParams) => {
                if (params.row.id === "add_row") {
                    return (
                        <Box
                            display="flex"
                            alignItems="center"
                            onClick={() => {
                                setModal(true);
                                setIsUpdate(false);
                            }}
                        >
                            <AddIcon />
                            <Box ml={1.5}>
                                <Typography
                                    variant="text_14_medium"
                                    color={AppTheme.scopeHeader.label}
                                >
                                    Add a new user to your team
                                </Typography>
                            </Box>
                        </Box>
                    );
                } else {
                    return (
                        <>
                            <Typography
                                fontFamily={"IBM Plex Sans"}
                                fontSize={"14px"}
                                fontStyle={"normal"}
                                fontWeight={"400"}
                                lineHeight={"normal"}
                                sx={{ color: "#757575" }}
                            >
                                {params?.row?.email} &nbsp;
                            </Typography>
                        </>
                    );
                }
            },
        },
        {
            field: "status",
            headerName: "Activity",
            autowidth: true,
            flex: 2,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Typography
                        fontFamily={"IBM Plex Sans"}
                        fontSize={"14px"}
                        fontStyle={"normal"}
                        fontWeight={"400"}
                        lineHeight={"normal"}
                        sx={{ color: "#757575" }}
                    >
                        {STATUS[params.row?.status]}
                    </Typography>
                </>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            flex: 1,
            getActions: (params: any) => {
                let actionArr;
                if (params.row.status == "ACTIVE") {
                    actionArr = [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={"Edit Details"}
                            onClick={() => {
                                setEditUser({ ...params.row, roles: params.row?.role });
                                setModal(true);
                                setIsUpdate(true);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key="remove"
                            label={ActionMenuText.REMOVE}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                            onClick={() => {
                                setDeleteUser({
                                    row: params.row,
                                    open: true,
                                    deleteText: "Are you sure you want to delete this user?",
                                });
                                // removeUserFromProject();
                            }}
                            disabled={params?.row?.id === user_id ? true : false}
                        />,
                    ];
                } else if (params.row.status == "DEACTIVATED") {
                    actionArr = [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={"Reactivate User"}
                            onClick={() => {
                                resendInvite(params.row?.email, "User reactivation invite sent.");
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                } else {
                    actionArr = [
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={"Resend Invite "}
                            onClick={() => {
                                reInviteCollaborators(params.row);
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                        <GridActionsCellItem
                            placeholder=""
                            key={`menu-settings-${params.row?.id}`}
                            label={"Revoke Invite"}
                            onClick={() => {
                                setWarningModal({
                                    ...openWarningModal,
                                    revoke: params.row?.id,
                                });
                            }}
                            showInMenu
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        />,
                    ];
                }
                return actionArr;
            },
        },
    ];
    return (
        <Grid container px={7} mt={4}>
            <Grid item justifyContent="space-between" xs>
                <Stack direction="row" alignItems="center">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Link
                            href={`/rfp/${role}/${user_id}/projects/v2`}
                            underline="always"
                            sx={{
                                alignItems: "center",
                                color: "#004D71",
                                fontFamily: "Roboto",
                                marginLeft: "0",
                            }}
                        >
                            <Typography variant="text_16_regular">Project Dashboard</Typography>
                        </Link>
                    </Box>
                    /
                    <Link
                        href={`/rfp/${role}/${user_id}/projects/${projectId}/v2`}
                        underline="always"
                        sx={{
                            alignItems: "center",
                            color: "#004D71",
                            fontFamily: "Roboto",
                        }}
                    >
                        {projectDetails?.name}
                    </Link>
                    /
                    <Link
                        underline="none"
                        sx={{
                            color: "#757575",
                            alignItems: "center",
                            fontFamily: "Roboto",
                        }}
                    >
                        Collaborators
                    </Link>
                </Stack>
            </Grid>
            <Grid item md={12} style={{ marginTop: 10, marginBottom: 5 }}>
                <Typography
                    fontFamily={"IBM Plex Sans"}
                    variant="h2"
                    fontStyle={"normal"}
                    fontWeight={300}
                    fontSize={26}
                    lineHeight={"32px"}
                    paddingBottom={4}
                >
                    Collaborators
                </Typography>
                <CommonDialog
                    open={loader.open || deleteUser.open}
                    onClose={() => {
                        setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                        setDeleteUser({ deleteText: "", open: false, row: null });
                    }}
                    loading={loading}
                    error={error.statusCode !== 200}
                    loaderText={loader.loaderText}
                    errorText={loader.errorText}
                    saved={
                        !loading &&
                        error.statusCode == 200 &&
                        !deleteUser.open &&
                        loader.saveText?.length > 0
                    }
                    savedText={loader.saveText}
                    deleteDialog={deleteUser.open}
                    deleteText={deleteUser.deleteText}
                    onDelete={removeUserFromProject}
                    width="40rem"
                    minHeight="26rem"
                />
                <Paper elevation={3}>
                    <BaseDataGrid
                        disableColumnMenu={false}
                        columns={columns}
                        rows={allRows}
                        rowsPerPageOptions={[10, 20, 30]}
                        loading={false}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack sx={{ margin: "10px" }}>
                                    {loading ? (
                                        <Loader />
                                    ) : (
                                        <Box style={{ zIndex: 5, pointerEvents: "all" }}>
                                            <ContentPlaceholder
                                                onLinkClick={() => {
                                                    setModal(true);
                                                }}
                                                text={"No users created."}
                                                aText="Create new user"
                                                height="90px"
                                                isLink
                                            />
                                        </Box>
                                    )}
                                </Stack>
                            ),
                        }}
                        sx={{
                            // pointer cursor on ALL rows
                            "& .MuiDataGrid-row:hover": {
                                cursor: "pointer",
                            },
                        }}
                        hideFooter={users?.length < 10 ? true : false}
                        getRowId={(row: any) => row.id}
                    />
                </Paper>
            </Grid>
            {isModal && (
                <UserModal
                    openModal={isModal}
                    modalHandler={setModal}
                    editUser={editUser ? editUser : {}}
                    setEditUser={setEditUser}
                    isUpdate={isUpdate}
                    contractorDetails={{
                        project_id: projectDetails?.id,
                        organization_id: organizationId,
                        rfp_project_version: rfp_project_version,
                    }}
                />
            )}
            <ConfirmationModal
                text={"  Are you sure you want to deactivate this user?"}
                onCancel={() => cancleWarningModal("deactive")}
                onProceed={() => updateUserStatus(openWarningModal.deactive, "DEACTIVATED")}
                open={!isEmpty(openWarningModal.deactive)}
                variant="deletion"
                actionText="Delete"
            />
            <ConfirmationModal
                text={"Are you sure you want to revoke this invite?"}
                onCancel={() => cancleWarningModal("revoke")}
                onProceed={() => revokeUser(openWarningModal.revoke)}
                open={!isEmpty(openWarningModal.revoke)}
                variant="creation"
                actionText="Revoke"
            />
            <ConfirmationModal
                text={
                    "Are you sure you want to invite a collaborator from outside your organisation?"
                }
                onCancel={() => cancleWarningModal("invite")}
                onProceed={() => {
                    inviteCollaborators();
                }}
                open={!isEmpty(openWarningModal.invite)}
                variant="creation"
                actionText="Invite"
            />
        </Grid>
    );
};

export default CollaboratorsList;
