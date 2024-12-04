import { Grid, Tooltip, Typography } from "@mui/material";
import BaseButton from "components/button";
import BaseDataGrid from "components/data-grid";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import React, { useEffect, useState } from "react";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import InviteEstimators from "../invite-estimators";
import { IValue, ProjectDetailsText } from "../constant";
import AddUser from "../invite-estimators/add-user";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReactComponent as SendUpRight } from "../../../assets/icons/send_up_right.svg";
import BaseSvgIcon from "components/svg-icon";
import { ActionMenuText } from "../constant";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import actions from "stores/actions";
import { cloneDeep } from "lodash";
import CommonDialog from "modules/admin-portal/common/dialog";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { KebabMenuIcon } from "modules/admin-portal/common/utils/constants";
interface ICollaboratorsList {
    organizationId: string;
}

const COLLABORATOR_DIALOG_TEXT = {
    ADD_NEW_USER_LOADER_TEXT: "User is being added",
    ADD_NEW_USER_ERROR_TEXT: "User creation failed",
    ADD_NEW_USER_SUCCESS_TEXT: "User is successfully added",
    DELETE_USER_LOADER_TEXT: "User is being deleted",
    RESEND_INVITE_LOADER_TEXT: "Invitation is being sent",
    INVITE_COLLABORATORS_LOADER_TEXT: "Your invitation is being sent",
};

const CollaboratorsList = ({ organizationId }: ICollaboratorsList) => {
    const { projectId } = useParams();
    const { role } = useParams();
    const dispatch = useAppDispatch();
    const isAdmin = role === "contractor_admin" || role === "admin";
    // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const user_id = localStorage.getItem("user_id");
    const [addUser, setAddUser] = useState(false);
    const [newUser, setNewUser] = useState<any>(null);
    const [deleteUser, setDeleteUser] = useState<any>({ deleteText: "", open: false, row: null });
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [collaborators, setCollaborators] = useState<IValue[]>([]);
    const [value, setValue] = React.useState<IValue[]>([]);
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
                projectDetails: state.projectDetails.data,
            };
        });
    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";
    useEffect(() => {
        setLoader({
            open: true,
            loaderText: "Please wait. Loading project details ...",
            errorText: "",
            saveText: "",
        });
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
        // else if (loading) {
        //     // setTimeout(() => {
        //     //     setLoader({ open: true, loaderText: "", errorText: "", saveText: "" });
        //     // }, 2000);
        // }

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

    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    const addNewUser = (userData: {
        name: string;
        email: string;
        contact_number: string;
        role: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
    }) => {
        setLoader({
            open: true,
            loaderText: COLLABORATOR_DIALOG_TEXT.ADD_NEW_USER_LOADER_TEXT,
            errorText: COLLABORATOR_DIALOG_TEXT.ADD_NEW_USER_ERROR_TEXT,
            saveText: COLLABORATOR_DIALOG_TEXT.ADD_NEW_USER_SUCCESS_TEXT,
        });
        const role = userData.role === "Estimator" ? "ESTIMATOR" : "CONTRACTOR_ADMIN";
        setNewUser(userData);
        dispatch(
            actions.rfpProjectManager.createNewCollaboratorStart({
                input: {
                    name: userData.name.trim(),
                    email: userData.email?.trim()?.toLowerCase(),
                    organization_id: organizationId,
                    roles: role,
                    contact_number: userData?.contact_number?.trim(),
                    street_address: userData?.streetAddress?.trim(),
                    city: userData?.city?.trim(),
                    state: userData?.state?.trim(),
                    zip_code: userData?.zipCode?.trim(),
                },
                organization_id: organizationId,
                role: role,
                roles: ["CONTRACTOR_ADMIN", "ESTIMATOR"],
            }),
        );
        setAddUser(false);
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

    const resendInvite = (collaborator: any) => {
        setLoader({
            open: true,
            loaderText: COLLABORATOR_DIALOG_TEXT.RESEND_INVITE_LOADER_TEXT,
            errorText: "",
            saveText: "",
        });
        dispatch(
            actions.rfpProjectManager.sendInviteStart({
                collaborators: [collaborator],
                organizationId: organizationId,
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
        // setAnchorEl(null);
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
                    rfp_project_version: rfp_project_version,
                }),
            );
        }
        setAvailableUsers([]);
        setValue([]);
    };

    const columns = [
        {
            field: "name",
            headerName: "Name",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Typography sx={{ marginRight: "10px" }}>
                        {params.row.name?.length === 0 ? "-" : params.row?.name}
                    </Typography>
                    {params.row.status === "INVITE_SENT" && (
                        <Tooltip title="User invited, but not active.">
                            <ErrorOutlineIcon htmlColor="#004D71" fontSize="small" />
                        </Tooltip>
                    )}
                </>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography>{params.row.email?.length === 0 ? "-" : params.row?.email}</Typography>
            ),
        },
        {
            field: "contact_number",
            headerName: "Phone Number",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography>
                    {params.row.contact_number?.length === 0 ? "-" : params.row?.contact_number}
                </Typography>
            ),
        },
        {
            field: "role",
            headerName: "Role",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography>{params.row.role}</Typography>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            headerAlign: "center",
            type: "actions",
            align: "center",
            flex: 0.5,
            hide: role === "estimator" ? true : false,
            getActions: (rowParams: {
                id: string;
                row: {
                    organization_id: string;
                    bid_status: string;
                    CONTRACTOR_ADMIN: any[];
                    ESTIMATOR: any[];
                    id: string;
                };
            }) => {
                return [
                    <GridActionsCellItem
                        placeholder=""
                        key="resend"
                        label={ActionMenuText.RESEND_INVITE}
                        icon={<BaseSvgIcon htmlColor="#57B6B2" svgPath={<SendUpRight />} />}
                        showInMenu
                        onClick={() => {
                            resendInvite(rowParams.row);
                        }}
                        disabled={rowParams?.row?.id === user_id ? true : false}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                    <GridActionsCellItem
                        placeholder=""
                        key="remove"
                        label={ActionMenuText.REMOVE}
                        icon={<DeleteIcon htmlColor="#57B6B2" />}
                        showInMenu
                        onClick={() => {
                            setDeleteUser({
                                row: rowParams.row,
                                open: true,
                                deleteText: "Are you sure you want to delete this user?",
                            });
                            // removeUserFromProject(rowParams.row);
                        }}
                        disabled={rowParams?.row?.id === user_id ? true : false}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                ];
            },
        },
    ];

    return (
        <>
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
            <Grid container>
                <Grid item md={12}>
                    <Grid container md={12}>
                        <Grid item md={11} sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="heading">
                                {ProjectDetailsText.COLLABORATORS}
                            </Typography>
                        </Grid>
                        {isAdmin && (
                            <Grid item md={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <BaseButton
                                    classes="primary default spaced"
                                    variant={"text_16_semibold"}
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                    label={ProjectDetailsText.INVITE}
                                    startIcon={
                                        <PersonAddAltOutlinedIcon
                                            htmlColor="#FFFFFF"
                                            style={{ fontSize: "1.4rem" }}
                                        />
                                    }
                                    size={"small"}
                                ></BaseButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item md={12} marginTop="1rem" marginBottom={"2rem"}>
                    <BaseDataGrid
                        columns={columns}
                        rows={collaborators}
                        hideFooter={collaborators?.length > 10 ? false : true}
                        rowsPerPageOptions={[10, 20, 30]}
                        // checkboxSelection
                        disableSelectionOnClick
                        components={{
                            MoreActionsIcon: KebabMenuIcon,
                        }}
                        getRowId={(row: any) => row.email}
                    />
                </Grid>
                <InviteEstimators
                    isOpen={open}
                    setOpen={setOpen}
                    users={availableUsers}
                    inviteCollaborators={inviteCollaborators}
                    addUser={addUser}
                    collaborators={collaborators}
                    setAddUser={setAddUser}
                    value={value}
                    setValue={setValue}
                    setCollaborators={setCollaborators}
                />
                <AddUser
                    addUser={addUser}
                    value={value}
                    setAddUser={setAddUser}
                    addNewUser={addNewUser}
                />
            </Grid>
        </>
    );
};

export default CollaboratorsList;
