import React, { useState, useEffect } from "react";
import {
    Box,
    Dialog,
    Typography,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Button,
    FormHelperText,
    InputLabel,
    Stack,
    Switch,
    Autocomplete,
    TextField,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import appTheme from "styles/theme";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import {
    ROLES,
    userErrors,
    USER_INFO,
    ORGANIZATION_TYPE,
    OWNERSHIP_ROLES,
    TOGGLE_ACCESS,
    UserDialogConstants,
} from "../../common/utils/constants";
import { map, isEmpty, cloneDeep } from "lodash";
import BaseTextField from "components/text-field";
import PhoneNumberField from "components/phone-field";
import { graphQLClient } from "utils/gql-client";
import { ADD_USER, EDIT_USER } from "stores/ims/queries";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import Loader from "../../common/loader";
import BaseRadio from "components/base-radio";
import BaseAutoComplete from "components/auto-complete";

interface ICreateNewItemModal {
    /* eslint-disable-next-line */
    modalHandler: (val: boolean) => void;
    openModal: boolean;
    editUser: any;
    setEditUser: any;
    isUpdate: boolean;
    contractorDetails?: {
        project_id: string;
        organization_id: string;
        rfp_project_version: string;
    };
}

const UserModal = ({
    modalHandler,
    openModal,
    editUser,
    setEditUser,
    isUpdate,
    contractorDetails,
}: ICreateNewItemModal) => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const organization_id = localStorage.getItem("organization_id") ?? "";
    const loggedUserRole = localStorage.getItem("role");
    const { contractors, ownerships } = useAppSelector((state) => ({
        contractors: state.ims.ims.contractors,
        ownerships: state.ims.ims.ownerships,
    }));

    const [errorText, setErrorText] = useState(userErrors);
    const [isLoading, setLoading] = useState(false);
    const [organizationType, setOrganizationType] = useState(ORGANIZATION_TYPE[0].value);
    const [userInfo, setUserInfo] = useState(USER_INFO);

    useEffect(() => {
        if (!isEmpty(editUser)) {
            const userDetail = cloneDeep(editUser);
            if (userDetail?.roles === "ADMIN") {
                setOrganizationType(ORGANIZATION_TYPE[1].value);
            } else {
                setOrganizationType(ORGANIZATION_TYPE[0].value);
            }
            setUserInfo({ ...userDetail, contractor: userDetail?.organization?.id });
        }
        return () => {
            setEditUser(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);
    // console.log(userInfo);
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    const updateUserInfo = (key: string, value: any) => {
        setErrorText({ ...errorText, [key]: false });
        setUserInfo({ ...userInfo, [key]: value });
    };

    useEffect(() => {
        let selectedGroup = contractors?.find(({ id }) => id === userInfo?.contractor);

        if (!selectedGroup)
            selectedGroup = ownerships?.find(({ id }) => id === userInfo?.contractor);

        if (isEmpty(editUser))
            setUserInfo({
                ...userInfo,
                street_address: selectedGroup?.street_name ?? "",
                city: selectedGroup?.city ?? "",
                state: selectedGroup?.state ?? "",
                zip_code: selectedGroup?.zip_code ?? "",
            });
        //eslint-disable-next-line
    }, [userInfo?.contractor]);

    const fetchAssignedContractorList = (contractorDetails?: {
        project_id: string;
        organization_id: string;
        rfp_project_version: string;
    }) => {
        dispatch(
            actions.rfpProjectManager.fetchAssignedContractorListForOrganizationStart({
                project_id: contractorDetails?.project_id,
                organization_id: contractorDetails?.organization_id,
                rfp_project_version: contractorDetails?.rfp_project_version,
            }),
        );
        dispatch(
            actions.imsActions.fetchUsersByOrgIdStart({
                organization_id: contractorDetails?.organization_id,
            }),
        );
    };
    const onSave = async () => {
        const validation = cloneDeep(errorText);
        if (
            isEmpty(userInfo.name) ||
            (isEmpty(userInfo.roles) && organizationType !== ORGANIZATION_TYPE[1].value) ||
            isEmpty(userInfo.email) ||
            (isEmpty(userInfo.contractor) && loggedUserRole === "admin")
        ) {
            if (isEmpty(userInfo.name)) {
                validation.name = true;
            }
            if (isEmpty(userInfo.roles) && organizationType !== ORGANIZATION_TYPE[1].value) {
                validation.roles = true;
            }
            if (isEmpty(userInfo.email)) {
                validation.email = true;
            }
            if (isEmpty(userInfo.contractor) && loggedUserRole === "admin") {
                validation.contractor = true;
            }

            setErrorText({ ...validation });
        } else {
            const inputReq = {
                name: userInfo.name,
                roles: userInfo?.roles,
                contact_number: userInfo?.contact_number,
                street_address: userInfo?.street_address?.trim(),
                city: userInfo?.city?.trim(),
                state: userInfo?.state?.trim(),
                zip_code: userInfo?.zip_code?.trim(),
                is_billing_manager_access: userInfo.is_billing_manager_access,
                is_approval_workflow: userInfo.is_approval_workflow,
                organization_id: loggedUserRole === "admin" ? userInfo.contractor : organization_id,
            };
            setLoading(true);
            if (!isUpdate) {
                try {
                    await graphQLClient.mutate("createUser", ADD_USER, {
                        payload: {
                            ...inputReq,
                            email: userInfo.email?.trim()?.toLowerCase(),
                        },
                    });
                    if (contractorDetails) {
                        fetchAssignedContractorList(contractorDetails);
                    }
                    dispatch(actions.imsActions.fetchAllUsersStart({}));
                    showSnackBar("success", "New user invite sent.");
                } catch (error: any) {
                    const errorMessage =
                        error?.graphQLErrors?.length &&
                        error?.graphQLErrors[0]?.extensions?.response?.body?.message;
                    showSnackBar("error", errorMessage || "Something went wrong.");
                }
            } else {
                try {
                    await graphQLClient.mutate("editUser", EDIT_USER, {
                        payload: {
                            ...inputReq,
                            id: userInfo?.id,
                            status: userInfo?.status,
                        },
                    });
                    if (contractorDetails) {
                        fetchAssignedContractorList(contractorDetails);
                    }

                    dispatch(actions.imsActions.fetchAllUsersStart({}));
                    showSnackBar("success", "User updated successfully.");
                } catch (error: any) {
                    const errorMessage =
                        error?.graphQLErrors?.length &&
                        error?.graphQLErrors[0]?.extensions?.response?.body?.message;
                    showSnackBar("error", errorMessage || "Something went wrong.");
                }
            }
            modalHandler(false);
        }
        dispatch(actions.imsActions.fetchAllUsersStart({}));
    };

    return (
        <Dialog
            open={openModal}
            fullWidth={true}
            maxWidth="sm"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => modalHandler(false)}
        >
            <Box
                p={5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={2.5}
                sx={{ borderBottom: `1px solid ${appTheme.border.inner}` }}
            >
                <Typography variant="text_16_medium">{`${
                    isUpdate ? "Update" : "Add"
                } user`}</Typography>
                <CloseOutlinedIcon
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        modalHandler(false);
                        dispatch(actions.budgeting.createNewItem({}));
                    }}
                />
            </Box>
            <Box p={5} minHeight="300px">
                {isLoading ? (
                    <Loader />
                ) : (
                    <Grid container>
                        <Grid item md={12} mb={5}>
                            {loggedUserRole === "admin" && (
                                <>
                                    <Grid item md={12}>
                                        <Box display={"flex"} alignItems="center">
                                            <Box mr={4}>
                                                <Typography variant="text_14_regular" color="black">
                                                    Organization Type* :
                                                </Typography>
                                            </Box>
                                            <BaseRadio
                                                options={ORGANIZATION_TYPE}
                                                alignment="row"
                                                onValChange={(value) => setOrganizationType(value)}
                                                value={organizationType}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item md={12} mt={3}>
                                        {loggedUserRole === "admin" && (
                                            <Stack width="100%">
                                                <InputLabel
                                                    sx={{ color: "#757575", marginBottom: "5px" }}
                                                >
                                                    <Typography variant="text_14_regular">
                                                        {organizationType === "contractor"
                                                            ? UserDialogConstants.CONTRACTOR_NAME
                                                            : UserDialogConstants.OWNERSHIP_NAME}
                                                    </Typography>
                                                </InputLabel>
                                                <Autocomplete
                                                    options={
                                                        organizationType === "contractor"
                                                            ? contractors ?? []
                                                            : ownerships ?? []
                                                    }
                                                    getOptionLabel={(option: any) => option?.name}
                                                    onChange={(e: any, value: any) => {
                                                        updateUserInfo("contractor", value.id);
                                                    }}
                                                    isOptionEqualToValue={(
                                                        option: any,
                                                        value: any,
                                                    ) => option.id === value.id}
                                                    renderInput={(params: any) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            placeholder={`Select ${organizationType} Name`}
                                                            error={errorText.contractor}
                                                            helperText={
                                                                errorText.contractor &&
                                                                "This Field is required"
                                                            }
                                                        />
                                                    )}
                                                    value={userInfo.organization}
                                                />
                                            </Stack>
                                        )}
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item md={12} mb={5}>
                            <BaseTextField
                                label="Name*"
                                style={{ width: "100%" }}
                                // classes={errorText?.item_name && "error"}
                                value={userInfo.name}
                                helper={errorText?.name ? "Name field is required*" : ""}
                                onChange={(e: any) => updateUserInfo("name", e.target.value)}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Typography variant="text_14_regular">Role*</Typography>
                            <Box mt={2.4}>
                                <FormControl fullWidth error={errorText.roles}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        displayEmpty
                                        value={userInfo.roles}
                                        fullWidth
                                        onChange={(e) => updateUserInfo("roles", e.target.value)}
                                        placeholder="users"
                                        sx={{ height: "44px" }}
                                    >
                                        <MenuItem value="" style={{ display: "none" }}>
                                            <Typography
                                                variant="text_14_regular"
                                                color={appTheme.text.medium}
                                            >
                                                Select a role
                                            </Typography>
                                        </MenuItem>
                                        {map(
                                            organizationType === ORGANIZATION_TYPE[1].value
                                                ? OWNERSHIP_ROLES
                                                : ROLES,
                                            (role, index) => (
                                                <MenuItem key={index} value={role.value}>
                                                    {role.label}
                                                </MenuItem>
                                            ),
                                        )}
                                    </Select>
                                    <FormHelperText> Roles field is required*</FormHelperText>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item md={12}>
                            <BaseTextField
                                label="Email*"
                                style={{ width: "100%" }}
                                // classes={errorText?.email && "error"}
                                helper={errorText.email ? "Email field is required*" : ""}
                                value={userInfo.email}
                                // disabled={isItemDisabled()}
                                onChange={(e: any) => updateUserInfo("email", e.target.value)}
                            />
                        </Grid>
                        <Grid item md={12} mt={5}>
                            <PhoneNumberField
                                onChange={(value: any) => {
                                    updateUserInfo("contact_number", value);
                                }}
                                value={userInfo.contact_number}
                                label="Phone number"
                                size="small"
                                containerSpacing={2.5}
                                variant="outlined"
                                containerStyle={{
                                    marginTop: ".25rem",
                                }}
                                fullWidth
                            />
                        </Grid>
                        {!isEmpty(userInfo.roles) &&
                            TOGGLE_ACCESS?.[userInfo.roles].includes(
                                "IS_BILLING_MANAGER_ACCESS",
                            ) && (
                                <Grid item md={6} mt={5}>
                                    <Stack width="100%">
                                        <InputLabel sx={{ color: "#757575" }}>
                                            <Typography variant="text_14_regular">
                                                Is billing manager accessible
                                            </Typography>
                                        </InputLabel>
                                        <Switch
                                            checked={userInfo.is_billing_manager_access}
                                            onChange={(e, value) =>
                                                updateUserInfo("is_billing_manager_access", value)
                                            }
                                        />
                                    </Stack>
                                </Grid>
                            )}
                        {!isEmpty(userInfo.roles) &&
                            TOGGLE_ACCESS?.[userInfo.roles].includes("IS_APPROVAL_WORKFLOW") && (
                                <Grid item md={6} mt={5}>
                                    <Stack width="100%">
                                        <InputLabel sx={{ color: "#757575" }}>
                                            <Typography variant="text_14_regular">
                                                Is approval workflow
                                            </Typography>
                                        </InputLabel>
                                        <Switch
                                            checked={userInfo.is_approval_workflow}
                                            onChange={(e, value) =>
                                                updateUserInfo("is_approval_workflow", value)
                                            }
                                        />
                                    </Stack>
                                </Grid>
                            )}
                        <Grid item md={12} mt={2}>
                            <InputLabel sx={{ color: "#000000" }}>
                                <Typography variant="text_14_regular">Address</Typography>
                            </InputLabel>
                            <BaseAutoComplete
                                freeSolo
                                options={
                                    organizationType === ORGANIZATION_TYPE[0].value
                                        ? contractors
                                              ?.filter(({ street_name }) => street_name?.length > 0)
                                              ?.map(({ street_name }) => street_name)
                                        : ownerships
                                              ?.filter(({ street_name }) => street_name?.length > 0)
                                              ?.map(({ street_name }) => street_name)
                                }
                                disableClearable={false}
                                variant="outlined"
                                style={{ width: "100%" }}
                                value={userInfo?.street_address}
                                onInputChange={(_: any, val: string) =>
                                    updateUserInfo("street_address", val)
                                }
                                onChange={(_: any, updatedAddress: string) =>
                                    updateUserInfo("street_address", updatedAddress)
                                }
                            />
                        </Grid>
                        <Grid item md={4} mt={5} pr={2}>
                            <BaseTextField
                                label="City"
                                // classes={errorText?.item_name && "error"}
                                // helper={errorText?.item_name}
                                value={userInfo.city}
                                // disabled={isItemDisabled()}
                                onChange={(e: any) => updateUserInfo("city", e.target.value)}
                            />
                        </Grid>
                        <Grid item md={4} mt={5} px={1}>
                            <BaseTextField
                                label="State"
                                // classes={errorText?.item_name && "error"}
                                // helper={errorText?.item_name}
                                value={userInfo.state}
                                // disabled={isItemDisabled()}
                                onChange={(e: any) => updateUserInfo("state", e.target.value)}
                            />
                        </Grid>
                        <Grid item md={4} mt={5} pl={2}>
                            <BaseTextField
                                label="ZIP Code"
                                // classes={errorText?.item_name && "error"}
                                // helper={errorText?.item_name}
                                value={userInfo.zip_code}
                                // disabled={isItemDisabled()}
                                onChange={(e: any) => updateUserInfo("zip_code", e.target.value)}
                            />
                        </Grid>
                        <Grid container>
                            <Grid item md={4} mt={7}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ height: "40px" }}
                                    onClick={() => modalHandler(false)}
                                >
                                    <Typography variant="text_16_semibold"> Cancel</Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={onSave}
                                    style={{ marginLeft: "10px", height: "40px" }}
                                >
                                    <Typography variant="text_16_semibold">
                                        {isUpdate ? "Update" : "Save"}
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Dialog>
    );
};

export default UserModal;
