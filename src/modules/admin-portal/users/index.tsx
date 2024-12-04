import { Typography, Grid, Paper, Stack, Box, Tooltip } from "@mui/material";
import { GridActionsCellItem, GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useState, useEffect, useMemo } from "react";
import AppTheme from "../../../styles/theme";
import ContentPlaceholder from "../../../components/content-placeholder";
import Loader from "../common/loader";
import UserModal from "./modal/userModal";
import { graphQLClient } from "utils/gql-client";
import { ROLE_MAPPING } from "../common/utils/constants";
import { RESEND_INVITE, EDIT_USER, DELETE_USER } from "stores/ims/queries";
import { IUser } from "../common/utils/interfaces";
import { isEmpty } from "lodash";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { STATUS } from "../common/utils/constants";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import ConfirmationModal from "components/confirmation-modal";
import DataGridPro from "components/data-grid-pro";
import BaseButton from "components/button";
import { OwnershipDialogConstants } from "../common/utils/constants";
import { ReactComponent as AddPerson } from "../../../assets/icons/add_person.svg";

const UserTab: React.FC = () => {
    //States
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const user_id = localStorage.getItem("user_id");
    const organization_id = localStorage.getItem("organization_id");

    const { users, isEditable, currentEditingUser, loading } = useAppSelector((state) => ({
        users: state.ims.ims.users,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        loading: state.ims.ims.loading,
        isEditable: state.biddingPortal.isEditable,
        currentEditingUser: state.biddingPortal.currentEditingUser,
    }));

    const [displayRows, setRows] = useState<any>([]);
    const [isModal, setModal] = useState<any>(false);
    const [isUpdate, setIsUpdate] = useState<any>(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [openWarningModal, setWarningModal] = useState({
        deactive: "",
        revoke: "",
    });

    useEffect(() => {
        if (isEditable && currentEditingUser) {
            dispatch(
                actions.biddingPortal.unlockProjectForEditingStart({
                    projectId: currentEditingUser?.projectId,
                    userID: user_id,
                    organization_id: organization_id,
                }),
            );
        }

        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(users)) {
            let rows: any[] = users
                .map((user: IUser) => ({
                    name: user?.name,
                    email: user.email,
                    roles: user?.roles,
                    status: user?.status,
                    street_address: user.street_address,
                    zip_code: user.zip_code,
                    city: user.city,
                    state: user.state,
                    contact_number: user?.contact_number,
                    organization: user.organization,
                    id: user.id,
                    is_billing_manager_access: user.is_billing_manager_access,
                    is_approval_workflow: user.is_approval_workflow,
                }))
                .sort((a, b) => {
                    if (a.name.trim().toLowerCase() < b.name.trim().toLowerCase()) {
                        return -1;
                    }
                    return 1;
                });
            setRows([...rows]);
        }
        //eslint-disable-next-line
    }, [users]);
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    const cancleWarningModal = (key: string) => {
        setWarningModal({ ...openWarningModal, [key]: "" });
    };

    const resendInvite = async (email: string, message?: string) => {
        try {
            await graphQLClient.mutate("resendInvite", RESEND_INVITE, {
                payload: { email: email },
            });
            showSnackBar("success", message || "Invite resent.");
            dispatch(actions.imsActions.fetchAllUsersStart({}));
        } catch (error) {
            showSnackBar("error", "Something went wrong.");
        }
    };

    const updateUserStatus = async (id: string, status: string) => {
        try {
            await graphQLClient.mutate("editUser", EDIT_USER, {
                payload: { id, status },
            });
            showSnackBar("success", "User deactivated.");
            dispatch(actions.imsActions.fetchAllUsersStart({}));
            cancleWarningModal("deactive");
        } catch (error) {
            showSnackBar("error", "Something went wrong.");
            cancleWarningModal("deactive");
        }
    };

    const revokeUser = async (id: string) => {
        try {
            await graphQLClient.mutate("deleteUser", DELETE_USER, {
                deleteUserId: id,
            });
            showSnackBar("success", "Invite revoked.");
            dispatch(actions.imsActions.fetchAllUsersStart({}));
            cancleWarningModal("revoke");
        } catch (error) {
            showSnackBar("error", "Something went wrong.");
            cancleWarningModal("revoke");
        }
    };

    const UserColumns: GridColumns = useMemo(
        () => [
            {
                field: "person",
                headerName: "Person",
                flex: 2,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <>
                            <Typography
                                variant="text_14_regular"
                                color={
                                    params.row.status == "DEACTIVATED"
                                        ? AppTheme.text.medium
                                        : AppTheme.text.dark
                                }
                            >
                                {params.row.name}
                            </Typography>
                            <Typography variant="text_14_regular" color={AppTheme.text.medium}>{`${
                                localStorage.getItem("email") === params.row.email ? " ( you )" : ""
                            }`}</Typography>
                        </>
                    );
                },
                valueGetter: (params) => params.row.name,
            },
            {
                field: "email",
                headerName: "Email",
                flex: 3,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant="text_14_regular"
                        color={params.row.status == "DEACTIVATED" ? AppTheme.text.medium : ""}
                    >
                        {params.row?.email}
                    </Typography>
                ),
            },
            {
                field: "role",
                headerName: "Role",
                flex: 2,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant="text_14_regular"
                        color={params.row.status == "DEACTIVATED" ? AppTheme.text.medium : ""}
                    >
                        {ROLE_MAPPING[params.row?.roles]}
                    </Typography>
                ),
                valueGetter: (params) => ROLE_MAPPING[params.row?.roles],
            },
            {
                field: "org_name",
                headerName: "Organization Name",
                headerAlign: "left",
                align: "left",
                flex: 2,
                width: 300,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="text_14_regular">
                        {params?.row?.organization?.name}
                    </Typography>
                ),
                valueGetter: (params) => params?.row?.organization?.name,
            },
            {
                field: "org_type",
                headerName: "Organization Type",
                headerAlign: "left",
                align: "left",
                flex: 3,
                renderCell: (params: GridRenderCellParams) => (
                    <Tooltip
                        title={params.row.organization?.organization_type?.map((type: string) => (
                            //eslint-disable-next-line
                            <Typography variant="text_14_regular">
                                {params.row.organization?.organization_type?.length > 0 &&
                                    OwnershipDialogConstants.ORG_TYPES_MAP[
                                        type as keyof typeof OwnershipDialogConstants.ORG_TYPES_MAP
                                    ]}
                            </Typography>
                        ))}
                    >
                        <Typography variant="text_14_regular">
                            {isEmpty(params.row.organization?.organization_type)
                                ? "-"
                                : params.row?.organization?.organization_type?.length > 1
                                ? `${
                                      OwnershipDialogConstants.ORG_TYPES_MAP[
                                          params?.row?.organization
                                              ?.organization_type[0] as keyof typeof OwnershipDialogConstants.ORG_TYPES_MAP
                                      ]
                                  } + ${params.row?.organization?.organization_type?.length - 1}`
                                : OwnershipDialogConstants.ORG_TYPES_MAP[
                                      params?.row?.organization
                                          ?.organization_type?.[0] as keyof typeof OwnershipDialogConstants.ORG_TYPES_MAP
                                  ]}
                        </Typography>
                    </Tooltip>
                ),
            },
            {
                field: "status",
                headerName: "Activity",
                flex: 1,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography
                        variant="text_14_regular"
                        color={params.row.status == "DEACTIVATED" ? AppTheme.text.medium : ""}
                    >
                        {STATUS[params.row?.status]}
                    </Typography>
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
                                    setEditUser(params.row);
                                    setModal(true);
                                    setIsUpdate(true);
                                }}
                                showInMenu
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            />,
                            <GridActionsCellItem
                                placeholder=""
                                key={`menu-settings-${params.row?.id}`}
                                label={"Deactivate User "}
                                onClick={() => {
                                    const loggedEmail = localStorage.getItem("email");
                                    if (loggedEmail === params.row.email) {
                                        showSnackBar(
                                            "error",
                                            "This user cannot be deleted. Every team must contain at least 1 admin.",
                                        );
                                    } else {
                                        setWarningModal({
                                            ...openWarningModal,
                                            deactive: params.row?.id,
                                        });
                                    }
                                }}
                                showInMenu
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            />,
                        ];
                    } else if (params.row.status == "DEACTIVATED") {
                        actionArr = [
                            <GridActionsCellItem
                                placeholder=""
                                key={`menu-settings-${params.row?.id}`}
                                label={"Reactivate User"}
                                onClick={() => {
                                    resendInvite(
                                        params.row?.email,
                                        "User reactivation invite sent.",
                                    );
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
                                    resendInvite(params.row?.email);
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
        ], //eslint-disable-next-line
        [users],
    );

    return (
        <Grid container px={7} mt={4}>
            <Grid item md={12} sm={12}>
                <Stack direction={"row"} justifyContent="flex-end" spacing={3} paddingTop={"1rem"}>
                    <BaseButton
                        onClick={() => {
                            setModal(true);
                            setIsUpdate(false);
                        }}
                        label={" Add User"}
                        style={{ padding: "1rem" }}
                        variant="text_16_semibold"
                        classes={`primary default`}
                        startIcon={<AddPerson style={{ marginLeft: 5 }} />}
                    />
                </Stack>
            </Grid>
            <Grid item md={12} style={{ marginTop: 10 }}>
                <Paper elevation={3}>
                    <DataGridPro
                        columns={UserColumns}
                        rows={displayRows}
                        rowsPerPageOptions={[10, 20, 30]}
                        loading={false}
                        componentsProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                        }}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "person", sort: "asc" }],
                            },
                            pagination: { paginationModel: { pageSize: 20 } },
                        }}
                        components={{
                            Toolbar: GridToolbarQuickFilter,
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
        </Grid>
    );
};

export default UserTab;
