import {
    Autocomplete,
    FormControlLabel,
    Grid,
    InputLabel,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import UserDialogIcon from "../../../assets/icons/icon-user-dialog.svg";
import BaseRadio from "components/radio";
import BaseTextField from "components/text-field";
import CommonDialog from "../common/dialog";
import {
    intitalUserFormData,
    userErrors,
    UserDialogConstants,
    ROLES,
    ALL_ROLES,
    // PERSONA,
    OWNERSHIP_ROLES,
} from "../common/utils/constants";
import { IUserDialog, IUserFormData, IUserErrors, IUser } from "../common/utils/interfaces";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { useLazyQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "stores/projects/details/rfp-manager/rfp-manager-queries";
import PhoneNumberField from "components/phone-field";

const getLoaderText = (isEdit?: boolean, isDelete?: boolean, isResendInvite?: boolean): string => {
    if (isEdit) return UserDialogConstants.EDIT_TEXT;
    else if (isResendInvite) return UserDialogConstants.RESEND_INVITE_LOADING;
    else if (isDelete) return UserDialogConstants.LOADER_DELETE;
    else return UserDialogConstants.SAVING_TEXT;
};

const getSavedText = (isEdit?: boolean, isDelete?: boolean, isResendInvite?: boolean): string => {
    if (isEdit) return UserDialogConstants.EDITED_TEXT;
    else if (isResendInvite) return UserDialogConstants.RESENT_INVITE;
    else if (isDelete) return UserDialogConstants.DELETED_USER;
    else return UserDialogConstants.SAVED_TEXT;
};
const getErrorText = (isEdit?: boolean, isDelete?: boolean, isResendInvite?: boolean): string => {
    if (isEdit) return UserDialogConstants.ERROR_EDIT;
    else if (isResendInvite) return UserDialogConstants.ERROR_RESEND_INVITE;
    else if (isDelete) return UserDialogConstants.ERROR_DELETE;
    else return UserDialogConstants.ERROR_USER_CREATE;
};

const checkIfEmailIsTaken = (users: IUser[], email?: string, id?: string) => {
    let user = users?.find(
        (user: { email: string }) => user.email.toLowerCase() == email?.toLowerCase(),
    );
    if (user?.id === id || user === undefined) {
        return false;
    }
    return true;
};

const isValidEmail = (email?: string) => {
    //eslint-disable-next-line
    if (!email || email === "" || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return false;
    return true;
};

const UserDialog = ({ open, onClose, isEdit, data, isDelete, isResendInvite }: IUserDialog) => {
    const [userData, setUserData] = useState<IUserFormData>(intitalUserFormData);
    const [errors, setErrors] = useState<IUserErrors>(userErrors);
    const [orgId, setOrgId] = useState<string>("");
    const dispatch = useAppDispatch();
    const { users, contractors, ownerships, loading, saved, error } = useAppSelector((state) => ({
        contractors: state.ims.ims.contractors,
        ownerships: state.ims.ims.ownerships,
        loading: state.ims.ims.loading,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        users: state.ims.ims.users,
    }));
    const user_email = localStorage.getItem("email");
    const user_id = localStorage.getItem("user_id");
    const [getOrganizationDetail] = useLazyQuery(GET_USER_BY_ID, {
        fetchPolicy: "network-only",
        variables: {
            userId: user_id,
        },
        onCompleted(response) {
            if (response?.getUserById) {
                setOrgId(response?.getUserById?.organization?.id);
            }
        },
    });

    const role = localStorage.getItem("role");

    const onSave = useCallback(() => {
        let errors: IUserErrors = { ...userErrors };
        if (!userData.contractor && role === "admin") {
            errors.contractor = true;
        }
        if (
            !isValidEmail(userData.email) ||
            checkIfEmailIsTaken(users, userData?.email?.trim(), data?.id)
        ) {
            errors.email = true;
        }
        if (!userData.name || userData.name.trim().length === 0) {
            errors.name = true;
        }

        if (userData.organizationType === "Contractor" && !userData.roles) {
            errors.roles = true;
        }
        if (Object.values(errors).reduce((prev, curr) => (!!curr === true ? 1 + prev : prev)) > 0) {
            setErrors(errors);
            return;
        }
        if (isEdit) {
            dispatch(
                actions.imsActions.editUserStart({
                    input: {
                        id: data.id,
                        name: userData.name?.trim(),
                        organization_id:
                            userData?.contractor === null ? orgId : userData?.contractor?.id,
                        roles: userData?.roles?.value ?? "ADMIN",
                        contact_number: userData?.phoneNumber?.trim(),
                        street_address: userData?.streetAddress?.trim(),
                        city: userData?.city?.trim(),
                        state: userData?.state?.trim(),
                        zip_code: userData?.zipCode?.trim(),
                        is_billing_manager_access: userData?.is_billing_manager_access,
                        is_approval_workflow: userData?.is_approval_workflow,
                        // persona: userData?.persona?.value,
                    },
                }),
            );
        } else {
            dispatch(
                actions.imsActions.addUserStart({
                    input: {
                        name: userData.name,
                        email: userData.email?.toLowerCase(),
                        organization_id:
                            userData?.contractor === null ? orgId : userData?.contractor?.id,
                        roles: userData?.roles?.value ?? "ADMIN",
                        contact_number: userData?.phoneNumber,
                        street_address: userData?.streetAddress?.trim(),
                        city: userData?.city?.trim(),
                        state: userData?.state?.trim(),
                        zip_code: userData?.zipCode?.trim(),
                        is_billing_manager_access: userData?.is_billing_manager_access,
                        is_approval_workflow: userData?.is_approval_workflow,
                        // persona: userData?.persona?.value,
                    },
                }),
            );
        }
        setUserData(intitalUserFormData);
        setErrors(userErrors);
        //eslint-disable-next-line
    }, [users, userData, data, isEdit]);

    const onDelete = () => {
        dispatch(
            actions.imsActions.deleteUserStart({
                id: data.id,
            }),
        );
        setTimeout(() => {
            onClose?.();
        }, 2000);
        //eslint-disable-next-line
    };

    useEffect(() => {
        if (isEdit && data) {
            setUserData(() => ({
                organizationType: data?.organization?.google_workspace_email
                    ? "Contractor"
                    : "Ownership",
                contractor: data?.organization,
                email: data.email,
                name: data.name,
                phoneNumber: data.contact_number,
                roles: ALL_ROLES.find((role) => role.value === data.roles) ?? data.roles,
                state: data.state,
                city: data.city,
                streetAddress: data.street_address,
                zipCode: data.zip_code,
                is_billing_manager_access: data?.is_billing_manager_access,
                is_approval_workflow: data?.is_approval_workflow,
                // persona: PERSONA.find((persona) => persona.value === data.persona) ?? data.persona,
            }));
        } else {
            setUserData(intitalUserFormData);
        }
        //eslint-disable-next-line
    }, [data]);
    useEffect(() => {
        if (role === "contractor_admin") getOrganizationDetail();
        if (!ownerships || !contractors || contractors.length == 0 || ownerships.length == 0) {
            dispatch(actions.imsActions.fetchContractorStart({}));
            dispatch(actions.imsActions.fetchOwnershipStart({}));
        }
        setUserData(intitalUserFormData);
        return () => {
            dispatch(actions.imsActions.resetState({}));
        };
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEdit) setUserData((prev) => ({ ...prev, contractor: null, roles: null }));
        //eslint-disable-next-line
    }, [userData.organizationType]);

    return (
        <>
            <CommonDialog
                open={open}
                title={UserDialogConstants.title}
                iconSrc={UserDialogIcon}
                onClose={() => {
                    onClose();
                    setErrors(userErrors);
                    setUserData(intitalUserFormData);
                }}
                onSave={onSave}
                onDelete={onDelete}
                loaderText={getLoaderText(isEdit, isDelete, isResendInvite)}
                savedText={getSavedText(isEdit, isDelete, isResendInvite)}
                saved={saved}
                error={error}
                loading={loading}
                errorText={getErrorText(isEdit, isDelete, isResendInvite)}
                deleteText={UserDialogConstants.DELETE_TEXT}
                deleteDialog={isDelete}
                width="40rem"
                minHeight={
                    role === "contractor_admin" &&
                    !loading &&
                    !saved &&
                    !isDelete &&
                    !error &&
                    UserDialogConstants.title
                        ? ""
                        : "26rem"
                }
            >
                <Grid container direction="column" spacing="1rem">
                    {role === "admin" && (
                        <Grid item mt="1rem">
                            <Stack direction="row" width="100%" alignItems="center" spacing="2rem">
                                <Typography variant="text_12_semibold">
                                    {UserDialogConstants.ORG_TYPE}
                                </Typography>
                                <FormControlLabel
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.CONTRACTOR}
                                        </Typography>
                                    }
                                    control={
                                        <BaseRadio
                                            checked={userData?.organizationType === "Contractor"}
                                            onClick={() => {
                                                setUserData((data) => {
                                                    return {
                                                        ...data,
                                                        organizationType: "Contractor",
                                                    };
                                                });
                                            }}
                                            disabled={isEdit}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.OWNERSHIP}
                                        </Typography>
                                    }
                                    control={
                                        <BaseRadio
                                            checked={userData?.organizationType === "Ownership"}
                                            onClick={() => {
                                                setUserData((data) => {
                                                    return {
                                                        ...data,
                                                        organizationType: "Ownership",
                                                    };
                                                });
                                            }}
                                            disabled={isEdit}
                                        />
                                    }
                                />
                            </Stack>
                        </Grid>
                    )}
                    <Grid item sm>
                        {role === "admin" && (
                            <Stack width="100%">
                                <InputLabel sx={{ color: "#757575", marginBottom: "5px" }}>
                                    <Typography variant="text_12_regular">
                                        {userData.organizationType === "Contractor"
                                            ? UserDialogConstants.CONTRACTOR_NAME
                                            : UserDialogConstants.OWNERSHIP_NAME}
                                    </Typography>
                                </InputLabel>
                                <Autocomplete
                                    options={
                                        userData.organizationType === "Contractor"
                                            ? contractors ?? []
                                            : ownerships ?? []
                                    }
                                    value={userData.contractor}
                                    getOptionLabel={(option: any) => option?.name}
                                    onChange={(e, value) => {
                                        setUserData((prev) => ({ ...prev, contractor: value }));
                                    }}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            placeholder={`Select ${userData.organizationType} Name`}
                                            error={errors.contractor}
                                            helperText={
                                                errors.contractor && "This Field is required"
                                            }
                                        />
                                    )}
                                    disabled={isEdit}
                                />
                            </Stack>
                        )}
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.NAME}
                                        </Typography>
                                    }
                                    error={errors.name}
                                    helper={errors.name ? "This field is required" : undefined}
                                    fullWidth
                                    value={userData.name}
                                    size="small"
                                    onChange={(e: any) => {
                                        setUserData((prev) => ({ ...prev, name: e.target.value }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.EMAIL}
                                        </Typography>
                                    }
                                    disabled={isEdit}
                                    error={errors.email}
                                    helper={
                                        errors.email
                                            ? isValidEmail(userData.email)
                                                ? checkIfEmailIsTaken(
                                                      users,
                                                      userData?.email?.trim(),
                                                      data?.id,
                                                  )
                                                    ? "Please use a different email"
                                                    : undefined
                                                : "Please enter a valid email"
                                            : undefined
                                    }
                                    fullWidth
                                    value={userData.email}
                                    onChange={(e: any) => {
                                        setUserData((prev) => ({ ...prev, email: e.target.value }));
                                        if (
                                            isValidEmail(e.target.value) &&
                                            !checkIfEmailIsTaken(
                                                users,
                                                e.target.value?.trim(),
                                                data?.id,
                                            )
                                        ) {
                                            setErrors((errors) => ({ ...errors, email: false }));
                                        }
                                    }}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing="2rem" alignItems="start">
                            <Grid item sm>
                                <PhoneNumberField
                                    onChange={(newPhoneNumber: any) =>
                                        setUserData((prev) => ({
                                            ...prev,
                                            phoneNumber: newPhoneNumber,
                                        }))
                                    }
                                    value={userData.phoneNumber}
                                    label={UserDialogConstants.PH_NUMBER}
                                    size="small"
                                    containerSpacing={2.5}
                                    variant="outlined"
                                    containerStyle={{
                                        marginTop: ".25rem",
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <Stack width="100%">
                                    <InputLabel sx={{ color: "#757575", marginBottom: "5px" }}>
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.ROLE}
                                        </Typography>
                                    </InputLabel>
                                    <Autocomplete
                                        options={
                                            userData?.organizationType === "Contractor"
                                                ? ROLES
                                                : OWNERSHIP_ROLES
                                        }
                                        getOptionLabel={(option) => option.label}
                                        value={userData.roles}
                                        onChange={(e, value) => {
                                            setUserData((prev) => ({
                                                ...prev,
                                                roles: value,
                                                is_billing_manager_access:
                                                    value?.value == "ADMIN" ||
                                                    value?.value == "ESTIMATOR"
                                                        ? false
                                                        : userData.is_billing_manager_access,
                                                is_approval_workflow:
                                                    value?.value == "ADMIN" ||
                                                    value?.value == "ESTIMATOR"
                                                        ? false
                                                        : userData.is_approval_workflow,
                                            }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                error={errors.roles}
                                                helperText={
                                                    errors.roles && "This Field is required"
                                                }
                                            />
                                        )}
                                        disabled={userData.email === user_email ? true : false}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing="2rem" alignItems="start">
                            {/* {userData?.organizationType === "Contractor" && (
                                <Grid item sm={6}>
                                    <Stack width="100%">
                                        <InputLabel sx={{ color: "#757575", marginBottom: "5px" }}>
                                            <Typography variant="text_12_regular">
                                                {UserDialogConstants.PERSONA}
                                            </Typography>
                                        </InputLabel>
                                        <Autocomplete
                                            options={PERSONA}
                                            getOptionLabel={(option) => option.label}
                                            value={userData.persona}
                                            onChange={(e, value) => {
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    persona: value,
                                                }));
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} size="small" />
                                            )}
                                            disabled={userData.email === user_email ? true : false}
                                        />
                                    </Stack>
                                </Grid>
                            )} */}
                            {userData?.roles &&
                                userData?.roles?.value !== "ADMIN" &&
                                userData?.roles?.value !== "ESTIMATOR" && (
                                    <Grid item sm>
                                        <Stack width="100%">
                                            <InputLabel
                                                sx={{ color: "#757575", marginBottom: "5px" }}
                                            >
                                                <Typography variant="text_12_regular">
                                                    {UserDialogConstants.IS_BILLING_MANAGER_ACCESS}
                                                </Typography>
                                            </InputLabel>
                                            <Switch
                                                checked={userData.is_billing_manager_access}
                                                onChange={(e, value) => {
                                                    setUserData((data) => {
                                                        return {
                                                            ...data,
                                                            is_billing_manager_access: value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                )}

                            {userData?.organizationType === "Ownership" &&
                                userData?.roles &&
                                userData?.roles?.value !== "ADMIN" &&
                                userData?.roles?.value !== "ESTIMATOR" && (
                                    <Grid item sm>
                                        <Stack width="100%">
                                            <InputLabel
                                                sx={{ color: "#757575", marginBottom: "5px" }}
                                            >
                                                <Typography variant="text_12_regular">
                                                    {UserDialogConstants.IS_APPROVAL_WORKFLOW}
                                                </Typography>
                                            </InputLabel>
                                            <Switch
                                                checked={userData.is_approval_workflow}
                                                onChange={(e, value) => {
                                                    setUserData((data) => {
                                                        return {
                                                            ...data,
                                                            is_approval_workflow: value,
                                                        };
                                                    });
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                )}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.STREET_ADDRESS}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={userData.streetAddress}
                                    size="small"
                                    onChange={(e: any) => {
                                        setUserData((prev) => ({
                                            ...prev,
                                            streetAddress: e.target.value,
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.CITY}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={userData.city}
                                    onChange={(e: any) => {
                                        setUserData((prev) => ({ ...prev, city: e.target.value }));
                                    }}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.STATE}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={userData.state}
                                    size="small"
                                    onChange={(e: any) => {
                                        setUserData((prev) => ({ ...prev, state: e.target.value }));
                                    }}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {UserDialogConstants.ZIP_CODE}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={userData.zipCode}
                                    onChange={(e: any) => {
                                        setUserData((prev) => ({
                                            ...prev,
                                            zipCode: e.target.value,
                                        }));
                                    }}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CommonDialog>
        </>
    );
};
export default UserDialog;
