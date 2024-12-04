import {
    Grid,
    Typography,
    Autocomplete,
    TextField,
    InputLabel,
    InputAdornment,
} from "@mui/material";
import BaseTextField from "components/text-field";
import React, { useState, useEffect } from "react";
import OwnershipDialogIcon from "../../../assets/icons/icon-user-dialog.svg";
import CommonDialog from "../common/dialog";
import {
    checkEmail,
    checkOwnership,
    initialOwnershipData,
    OwnershipDialogConstants,
} from "../common/utils/constants";
import { IOwnershipDialog, IOwnershipFormData } from "../common/utils/interfaces";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import BaseAutoComplete from "components/auto-complete";

//eslint-disable-next-line
const OwnershipDialog = ({ open, onClose, isEdit, data, isDelete }: IOwnershipDialog) => {
    const [ownershipData, setOwnershipData] = useState<IOwnershipFormData>(initialOwnershipData);
    const [ownershipError, setOwnershipError] = useState<boolean>(false);
    //eslint-disable-next-line
    const dispatch = useAppDispatch();
    //eslint-disable-next-line
    const { loading, saved, error, users, ownerships } = useAppSelector((state) => ({
        loading: state.ims.ims.loading,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        ownerships: state.ims.ims.ownerships,
        users: state.ims.ims.users,
    }));

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

    const onSave = () => {
        if (
            !ownershipData?.ownershipName ||
            ownershipData.ownershipName === "" ||
            (!isEdit && checkOwnership(ownerships, ownershipData.ownershipName))
        ) {
            setOwnershipError(true);
            return;
        }
        if (isEdit) {
            dispatch(
                actions.imsActions.editOrganizationStart({
                    input: {
                        name: ownershipData.ownershipName?.trim(),
                        street_name: ownershipData.streetAddress?.trim(),
                        city: ownershipData.city?.trim(),
                        state: ownershipData.state?.trim(),
                        zip_code: ownershipData.zipCode?.trim(),
                        ownership_url: ownershipData.tailorbirdContact?.trim(),
                        contact_number: "",
                        id: data.id,
                    },
                    type: "Ownership",
                }),
            );
        } else {
            dispatch(
                actions.imsActions.addOrganizationStart({
                    input: {
                        name: ownershipData.ownershipName?.trim(),
                        street_name: ownershipData.streetAddress?.trim(),
                        city: ownershipData.city?.trim(),
                        state: ownershipData.state?.trim(),
                        zip_code: ownershipData.zipCode?.trim(),
                        ownership_url: ownershipData.ownershipUrl?.trim(),
                        organization_type: ownershipData.organizationType,
                        primary_tb_contact: ownershipData?.tailorbirdContact?.trim(),
                        google_workspace_email: `${ownershipData.googleWorkspaceEmail}${process.env.REACT_APP_GOOGLE_WORKSPACE_DOMAIN}`,
                        org_category: "DEMAND",
                    },
                    type: "Ownership",
                }),
            );
        }
        setOwnershipData(initialOwnershipData);
        setOwnershipError(false);
    };
    const isValidUrl = (url?: string | null) => {
        //eslint-disable-next-line
        if (!url || url === "") {
            return true;
        }
        // if (!url || url === "" || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(url))
        //eslint-disable-next-line
        if (
            !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
                url,
            )
        ) {
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (isEdit && data) {
            setOwnershipData(() => ({
                city: data?.city,
                ownershipName: data.name,
                ownershipUrl: data.ownership_url,
                state: data.state,
                zipCode: data.zip_code,
                streetAddress: data.street_name,
                googleWorkspaceEmail: data.googleWorkspaceEmail,
            }));
        } else {
            setOwnershipData(initialOwnershipData);
        }
        //eslint-disable-next-line
    }, [data]);

    return (
        <>
            <CommonDialog
                open={open}
                onClose={onClose}
                title={OwnershipDialogConstants.title}
                iconSrc={OwnershipDialogIcon}
                onSave={onSave}
                deleteDialog={isDelete}
                deleteText={OwnershipDialogConstants.DELETE_TEXT}
                error={error}
                saved={saved}
                loading={loading}
                errorText={OwnershipDialogConstants.ERROR_TEXT}
                loaderText={
                    isEdit
                        ? OwnershipDialogConstants.LOADER_EDIT_TEXT
                        : isDelete
                        ? OwnershipDialogConstants.DELETING_ORG
                        : OwnershipDialogConstants.LOADER_TEXT
                }
                savedText={
                    isEdit
                        ? OwnershipDialogConstants.SAVED_EDIT_TEXT
                        : !isDelete
                        ? OwnershipDialogConstants.SAVED_TEXT
                        : OwnershipDialogConstants.DELETED_TEXT
                }
                onDelete={() => {
                    dispatch(
                        actions.imsActions.deleteOrganizationStart({
                            id: data.id,
                            type: "Ownership",
                        }),
                    );
                }}
                width="40rem"
                minHeight="26rem"
            >
                <Grid container direction="column" spacing="1rem">
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {OwnershipDialogConstants.OWNERSHIP_NAME}
                                        </Typography>
                                    }
                                    fullWidth
                                    onChange={(e: any) =>
                                        setOwnershipData((prev) => ({
                                            ...prev,
                                            ownershipName: e.target.value,
                                        }))
                                    }
                                    disabled={isEdit}
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
                            <Grid item sm={6}>
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
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={12}>
                                <Autocomplete
                                    multiple
                                    filterSelectedOptions
                                    options={OwnershipDialogConstants.ORG_TYPES}
                                    getOptionLabel={(option: any) => option.label}
                                    renderInput={(params) => (
                                        <>
                                            <InputLabel
                                                sx={{ color: "#757575", marginBottom: "5px" }}
                                            >
                                                <Typography variant="text_12_regular">
                                                    {OwnershipDialogConstants.ORGANIZATION_TYPE}
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
                                        setOwnershipData((prev) => ({
                                            ...prev,
                                            organizationType: selectedOrgTypes,
                                        }));
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={12}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {OwnershipDialogConstants.GOOGLE_WORKSPACE_EMAIL}
                                        </Typography>
                                    }
                                    InputProps={{
                                        endAdornment: !isEdit ? (
                                            <InputAdornment position="end">
                                                <Typography variant="text_14_regular">
                                                    {process.env.REACT_APP_GOOGLE_WORKSPACE_DOMAIN}
                                                </Typography>
                                            </InputAdornment>
                                        ) : null,
                                    }}
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) =>
                                        setOwnershipData((prev) => ({
                                            ...prev,
                                            googleWorkspaceEmail: e.target.value,
                                        }))
                                    }
                                    value={ownershipData.googleWorkspaceEmail}
                                    error={ownershipError}
                                    helper={
                                        ownershipError
                                            ? checkEmail(
                                                  ownerships,
                                                  ownershipData?.googleWorkspaceEmail,
                                              ) && ownershipData?.googleWorkspaceEmail !== ""
                                                ? "Please use another email"
                                                : "This Field is needed"
                                            : undefined
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={12}>
                                <BaseAutoComplete
                                    fullWidth
                                    disableClearable={false}
                                    filterSelectedOptions
                                    options={tailorbirdPrimaryContacts()}
                                    getOptionLabel={(option: any) => option.name}
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {OwnershipDialogConstants.TAILORBIRD_CONTACT}
                                        </Typography>
                                    }
                                    size="small"
                                    onChange={(_: any, updatedContact: any) => {
                                        setOwnershipData((prev) => ({
                                            ...prev,
                                            tailorbirdContact: updatedContact?.id,
                                        }));
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={12}>
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
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={4}>
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
                            <Grid item sm={4}>
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
                            <Grid item sm={4}>
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
                                        if (event.keyCode === 69) event.preventDefault();
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CommonDialog>
        </>
    );
};
export default OwnershipDialog;
