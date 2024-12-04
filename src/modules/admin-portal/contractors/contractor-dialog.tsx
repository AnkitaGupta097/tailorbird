import { Grid, InputAdornment, Typography } from "@mui/material";
import React, { useState, useCallback, useEffect } from "react";
import AddContractor from "../../../assets/icons/add-contractor.svg";
import BaseTextField from "components/text-field";
import CommonDialog from "../common/dialog";
import {
    checkEmail,
    ContractorDialogConstants,
    initialContractorErrors,
    intitalFormData,
} from "../common/utils/constants";
import {
    IContractorDialog,
    IContractorFormData,
    IContractorErrors,
} from "../common/utils/interfaces";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";

//eslint-disable-next-line
const ContractorDialog = ({ open, onClose, isEdit, data, isDelete }: IContractorDialog) => {
    const [contractorData, setContractorData] = useState<IContractorFormData>(intitalFormData);
    const [errors, setErrors] = useState<IContractorErrors>();
    const dispatch = useAppDispatch();
    const { contractors, loading, saved, error } = useAppSelector((state) => ({
        loading: state.ims.ims.loading,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        contractors: state.ims.ims.contractors,
    }));

    const onSave = useCallback(() => {
        const errors: IContractorErrors = { ...initialContractorErrors };
        if (!contractorData?.contractorName || contractorData?.contractorName.trim() === "") {
            errors.contractorName = true;
        }
        if (
            !contractorData?.googleWorkspaceEmail ||
            contractorData?.googleWorkspaceEmail.trim() === "" ||
            checkEmail(contractors, contractorData?.googleWorkspaceEmail)
        ) {
            errors.googleWorkspaceEmail = true;
        }
        if (!contractorData?.streetAddress || contractorData?.streetAddress.trim() === "") {
            errors.streetAddress = true;
        }
        if (!contractorData?.city || contractorData?.city.trim() === "") {
            errors.city = true;
        }
        if (Object.values(errors).reduce((prev, curr) => (!!curr === true ? 1 + prev : prev)) > 0) {
            setErrors(errors);
            return;
        }
        if (isEdit) {
            dispatch(
                actions.imsActions.editOrganizationStart({
                    input: {
                        name: contractorData.contractorName?.trim(),
                        street_name: contractorData.streetAddress?.trim(),
                        city: contractorData.city?.trim(),
                        state: contractorData.state?.trim(),
                        zip_code: contractorData.zipCode?.trim(),
                        contact_number: "",
                        id: data.id,
                    },
                    type: "Contractor",
                }),
            );
        } else {
            dispatch(
                actions.imsActions.addOrganizationStart({
                    input: {
                        name: contractorData.contractorName?.trim(),
                        street_name: contractorData.streetAddress?.trim(),
                        city: contractorData.city?.trim(),
                        state: contractorData.state?.trim(),
                        zip_code: contractorData.zipCode?.trim(),
                        contact_number: "",
                        google_workspace_email: `${contractorData.googleWorkspaceEmail}${process.env.REACT_APP_GOOGLE_WORKSPACE_DOMAIN}`,
                        organization_type: null,
                        org_category: "CONTRACTOR",
                    },
                    type: "Contractor",
                }),
            );
        }
        setContractorData(intitalFormData);
        setErrors(initialContractorErrors);
        //eslint-disable-next-line
    }, [contractorData, contractors, isEdit]);
    useEffect(() => {
        if (isEdit && data) {
            setContractorData(() => ({
                city: data.city,
                contractorName: data.name,
                googleWorkspaceEmail: data.google_workspace_email,
                state: data.state,
                streetAddress: data.street_name,
                zipCode: data.zip_code,
            }));
        } else {
            setContractorData(intitalFormData);
        }

        //eslint-disable-next-line
    }, [data]);

    return (
        <>
            <CommonDialog
                title="Contractor"
                iconSrc={AddContractor}
                open={open}
                onClose={onClose}
                onSave={onSave}
                deleteDialog={isDelete}
                deleteText={ContractorDialogConstants.DELETE_TEXT}
                error={error}
                saved={saved}
                loading={loading}
                errorText={ContractorDialogConstants.ERROR_TEXT}
                loaderText={
                    isEdit
                        ? ContractorDialogConstants.LOADER_EDIT_TEXT
                        : isDelete
                        ? ContractorDialogConstants.DELETING_ORG
                        : ContractorDialogConstants.LOADER_TEXT
                }
                savedText={
                    isEdit
                        ? ContractorDialogConstants.SAVED_EDIT_TEXT
                        : !isDelete
                        ? ContractorDialogConstants.SAVED_TEXT
                        : ContractorDialogConstants.DELETED_TEXT
                }
                onDelete={() => {
                    dispatch(
                        actions.imsActions.deleteOrganizationStart({
                            id: data.id,
                            type: "Contractor",
                        }),
                    );
                }}
                width="40rem"
                minHeight="26rem"
            >
                <Grid container direction="column" spacing="1rem">
                    <Grid item sm mt="1rem">
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {ContractorDialogConstants.CONTRACTOR_NAME}
                                        </Typography>
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            contractorName: e.target.value,
                                        }));
                                    }}
                                    error={errors?.contractorName}
                                    helper={
                                        errors?.contractorName ? "This Field is needed" : undefined
                                    }
                                    value={contractorData?.contractorName}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {ContractorDialogConstants.GOOGLE_WORKSPACE_EMAIL}
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
                                    disabled={isEdit}
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            googleWorkspaceEmail: `${e.target.value.trim()}`,
                                        }));
                                    }}
                                    error={errors?.googleWorkspaceEmail}
                                    helper={
                                        errors?.googleWorkspaceEmail
                                            ? checkEmail(
                                                  contractors,
                                                  contractorData?.googleWorkspaceEmail,
                                              ) && contractorData?.googleWorkspaceEmail !== ""
                                                ? "Please use another email"
                                                : "This Field is needed"
                                            : undefined
                                    }
                                    value={contractorData?.googleWorkspaceEmail}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {ContractorDialogConstants.STREET_ADRESS}
                                        </Typography>
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            streetAddress: e.target.value,
                                        }));
                                    }}
                                    error={errors?.streetAddress}
                                    helper={
                                        errors?.streetAddress ? "This Field is needed" : undefined
                                    }
                                    value={contractorData?.streetAddress}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {ContractorDialogConstants.CITY}
                                        </Typography>
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }));
                                    }}
                                    error={errors?.city}
                                    helper={errors?.city ? "This Field is needed" : undefined}
                                    value={contractorData?.city}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container direction="row" spacing="2rem">
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {ContractorDialogConstants.STATE}
                                        </Typography>
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }));
                                    }}
                                    value={contractorData?.state}
                                />
                            </Grid>
                            <Grid item sm={6}>
                                <BaseTextField
                                    variant="outlined"
                                    label={
                                        <Typography variant="text_12_regular">
                                            {ContractorDialogConstants.ZIPCODE}
                                        </Typography>
                                    }
                                    fullWidth
                                    value={contractorData?.zipCode}
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
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            zipCode: e.target.value,
                                        }));
                                    }}
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
export default ContractorDialog;
