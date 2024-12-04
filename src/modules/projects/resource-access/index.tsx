import { useMutation, useQuery } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { GridRenderCellParams } from "@mui/x-data-grid";
import BaseAutoComplete from "components/auto-complete";
import BaseSnackbar from "components/base-snackbar";
import DataGridPro from "components/data-grid-pro";
import { useSnackbar } from "notistack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
    GET_RESOURCE_ACCESS,
    MAP_USER_TO_PROJECT,
    REMOVE_USER_FROM_PROJECT,
} from "stores/production/project/queries";
import { GET_ALL_USER } from "stores/projects/tpsm/tpsm-queries";
import { SNACKBAR_VARIANT } from "styles/common-constant";
import AppTheme from "styles/theme";

interface IUser {
    id: string;
    name: string;
    email: string;
    permission?: string;
}

interface IResourceAcess {
    user_id: string;
    permission: string;
}

const getDefaultValues = () => ({ user: "", persona: "" });

const useStyles = makeStyles(() => ({
    mainContainer: {
        padding: "15px",
    },
    tableContainer: {
        marginTop: "10px",
        padding: 0,
    },
    inputRoot: {
        alignItems: "center",
        "& .MuiInputBase-root": {
            height: "100%",
            alignItems: "center",
            padding: 0,
        },
    },

    listBox: {
        "& .MuiAutocomplete-listbox": {
            maxHeight: "200px",
        },
    },

    selectContainer: {
        display: "flex",
        alignItems: "start",
        justifyContent: "space-around",
        marginTop: "10px",
        height: "75px",
    },

    userSelect: {
        width: "350px",
    },

    personaSelect: {
        width: "550px",
    },
    btnContainer: { marginTop: "32px" },

    addBtn: { height: "32px", width: "120px" },
}));

const ResourceAccess = () => {
    const { projectId } = useParams();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { data, loading, refetch } = useQuery(GET_ALL_USER);
    const {
        data: resourceAccess,
        loading: resourceAccessLoading,
        refetch: resourceAcessRefetch,
    } = useQuery(GET_RESOURCE_ACCESS, { variables: { projectId } });
    const [addUserToProject] = useMutation(MAP_USER_TO_PROJECT);
    const [removeUserFromProject] = useMutation(REMOVE_USER_FROM_PROJECT);
    const personas = [
        { label: "GC", value: "general_contractor" },
        { label: "CM", value: "construction_manager" },
    ];
    const addedUsers: IResourceAcess[] = resourceAccess?.getResourceAccess || [];
    const resourceAccessSet = new Set(addedUsers.map((resource) => resource.user_id) || []);
    const usersToSelect: IUser[] = (data?.getAllUsers || []).filter(
        (user: IUser) => !(user.id in resourceAccessSet),
    );

    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    const resetData = () => {
        resourceAcessRefetch();
        refetch();
        reset();
    };

    const columns = [
        {
            field: "user",
            headerName: "User",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const user = (data?.getAllUsers || [])?.find(
                    (user: IUser) => user?.id == params?.row?.user_id,
                );
                return <Typography variant="text_16_semibold">{user?.email}</Typography>;
            },
        },

        {
            field: "permission",
            headerName: "Permission",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_16_semibold">{params.row?.permission}</Typography>
            ),
        },

        {
            field: "delete",
            headerName: "Delete User",
            headerAlign: "left",
            align: "left",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton
                    onClick={() => handleRemoveUser(params.row?.user_id)}
                    aria-label="delete"
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const { control, handleSubmit, setError, reset } = useForm({
        defaultValues: {
            ...getDefaultValues(),
        },
        mode: "onChange",
    });

    const handleAddUser = () => {
        handleSubmit(async (data) => {
            if (!data.user || !data.persona) {
                if (!data.user) {
                    setError("user", { message: "User is empty" });
                }
                if (!data.persona) {
                    setError("persona", { message: "Permission is empty" });
                }
                return;
            }
            const user_id = usersToSelect.find((user) => user.email == data.user)?.id;
            const permission = data.persona;
            const input = {
                resource_id: projectId,
                user_id: user_id,
                permission: permission,
                resource_type: "project",
                is_active: true,
            };
            try {
                const response = await addUserToProject({ variables: { input } });
                showSnackBar(SNACKBAR_VARIANT.SUCCESS, response.data?.mapUserToProject?.message);
            } catch (error: any) {
                showSnackBar(SNACKBAR_VARIANT.ERROR, error?.message || "Something went wrong");
            } finally {
                resetData();
            }
        })();
    };

    const handleRemoveUser = async (userId: string) => {
        const input = {
            resource_id: projectId,
            user_id: userId,
            resource_type: "project",
        };
        try {
            const response = await removeUserFromProject({ variables: { input } });
            showSnackBar(SNACKBAR_VARIANT.SUCCESS, response.data?.removeUserFromProject?.message);
        } catch (error: any) {
            showSnackBar(SNACKBAR_VARIANT.ERROR, error?.message || "Something went wrong");
        }

        resetData();
    };

    return (
        <div className={classes.mainContainer}>
            <Grid
                container
                direction="column"
                rowSpacing={4}
                justifyContent="flex-start"
                sx={{
                    borderRadius: "4px",
                    border: `1px solid ${AppTheme.border.textarea}`,
                    padding: "16px",
                    marginTop: "32px",
                }}
            >
                <Grid item xs={12}>
                    <Typography variant="text_18_medium">Resource Access</Typography>
                </Grid>
                {loading ? (
                    <CircularProgress style={{ marginTop: 5 }} color="info" />
                ) : (
                    <div className={classes.selectContainer}>
                        <div className={classes.userSelect}>
                            <Controller
                                name="user"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <BaseAutoComplete
                                        {...field}
                                        classes={{
                                            inputRoot: classes.inputRoot,
                                            listbox: classes.listBox,
                                        }}
                                        onChange={(
                                            event: React.SyntheticEvent,
                                            selected: { value: string; label: string },
                                        ) => field.onChange(selected?.value)}
                                        options={usersToSelect.map((user) => ({
                                            label: user.email,
                                            value: user.email,
                                        }))}
                                        sx={{ width: 300 }}
                                        label={"User"}
                                        error={fieldState.error}
                                        errorText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className={classes.personaSelect}>
                            <Controller
                                name="persona"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <BaseAutoComplete
                                        {...field}
                                        classes={{
                                            inputRoot: classes.inputRoot,
                                            listbox: classes.listBox,
                                        }}
                                        onChange={(
                                            event: React.SyntheticEvent,
                                            selected: { value: string; label: string },
                                        ) => field.onChange(selected?.value)}
                                        options={personas}
                                        error={fieldState.error}
                                        errorText={fieldState.error?.message}
                                        label={"Permission"}
                                        value={
                                            personas.find(
                                                (option) => option.value === field?.value,
                                            ) || null
                                        }
                                        getOptionLabel={(option: any) => option?.label || ""}
                                    />
                                )}
                            />
                        </div>

                        <div className={classes.btnContainer}>
                            <Button
                                onClick={handleAddUser}
                                className={classes.addBtn}
                                variant="contained"
                                color="primary"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                )}
            </Grid>
            <div className={classes.tableContainer}>
                <DataGridPro
                    disableColumnMenu={false}
                    autoHeight={false}
                    sx={{ height: "500px" }}
                    disableRowSelectionOnClick
                    columns={columns}
                    rows={addedUsers}
                    checkboxSelection={false}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 20, 30]}
                    hideToolbar
                    rowsPerPageOptions={[10]}
                    loading={resourceAccessLoading}
                />
            </div>
        </div>
    );
};

export default ResourceAccess;
