import { Divider, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import { useLocation, useNavigate } from "react-router-dom";
import BaseButton from "components/button";
import BaseTextField from "components/text-field";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import {
    initialContractorErrors,
    checkEmail,
    ContractorDialogConstants,
} from "../common/utils/constants";
import { IContractorFormData, IContractorErrors } from "../common/utils/interfaces";
import BaseDataGrid from "components/data-grid";
import CommonDialog from "../common/dialog";
import { columns } from "modules/rfp-manager/project-list";
import ContentPlaceholder from "components/content-placeholder";
import { CONTRACTOR_DETAILS, intitalFormData } from "./constant";
// import VendorSearchDialog from "./entrata-map-contractor-modal";
import { gql } from "@apollo/client";

export const GET_ENTRATA_VENDOR_LOCATIONS = gql`
    query Query($ownershipId: String) {
        getEntrataVendorLocations(ownership_id: $ownershipId)
    }
`;

const ContractorsDetail = () => {
    // Redux
    const dispatch = useAppDispatch();
    const { contractors, projects, loading, saved, error } = useAppSelector((state) => ({
        loading: state.ims.ims.loading,
        saved: state.ims.ims.saved,
        error: state.ims.ims.error,
        contractors: state.ims.ims.contractors,
        projects: state.rfpService.project.projectDetails,
        loadingProjects: state.rfpService.project.loading,
    }));

    //Navigation
    const state = useLocation().state as any;
    const navigate = useNavigate();
    // const [isEntrataDialogOpen, openEntrataDialog] = useState(false);

    //State to store if form in editable mode (not editable by default)
    const [isEditable, setIsEditable] = useState(false);
    // State for displaying the status dialog of the update operation (loading /error/save)
    let [openDialog, setOpenDialog] = React.useState<boolean>(false);
    // State for storing contractor details
    const [contractorData, setContractorData] = useState<IContractorFormData>(
        intitalFormData(state),
    );
    //State for storing the status of required fields
    const [errors, setErrors] = useState<IContractorErrors>();

    //Function for setting form in edit mode
    const onEdit = () => {
        if (!isEditable) setIsEditable(true);
        else onSave();
    };

    //Function for saving modified contractor details
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
        setOpenDialog(true);
        dispatch(
            actions.imsActions.editOrganizationStart({
                input: {
                    name: contractorData.contractorName?.trim(),
                    street_name: contractorData.streetAddress?.trim(),
                    city: contractorData.city?.trim(),
                    //@ts-ignore
                    state: contractorData.state?.trim(),
                    zip_code: contractorData.zipCode?.trim(),
                    contact_number: "",
                    id: state?.details?.id,
                },
                type: "Contractor",
            }),
        );
        setErrors(initialContractorErrors);
        setIsEditable(false);
        //eslint-disable-next-line
    }, [contractorData, contractors]);

    //Hooks
    useEffect(() => {
        dispatch(
            actions.rfpService.fetchProjectDetailsStart({
                user_id: "",
                organization_id: state?.details?.id,
            }),
        );
        //eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (saved || error) {
            setTimeout(() => {
                setOpenDialog(false);
                dispatch(actions.imsActions.resetState({}));
            }, 2000);
        }
        //eslint-disable-next-line
    }, [saved, error]);

    return (
        <>
            <CommonDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                loading={loading}
                error={error}
                loaderText={ContractorDialogConstants.LOADER_EDIT_TEXT}
                errorText={ContractorDialogConstants.ERROR_TEXT}
                saved={saved}
                savedText={ContractorDialogConstants.SAVED_EDIT_TEXT}
                width="40rem"
                minHeight="26rem"
            />
            <Grid
                container
                sx={{ paddingLeft: "2.5rem", paddingRight: "2.5rem", marginTop: "2rem" }}
                direction={"column"}
            >
                <Grid item>
                    <Stack direction={"row"} spacing={2}>
                        <IconButton
                            sx={{ paddingTop: 0, paddingLeft: 0 }}
                            onClick={() => navigate(-1)}
                        >
                            <KeyboardArrowLeftRoundedIcon fontSize="large" htmlColor="#000000" />
                        </IconButton>
                        <Typography variant="text_24_medium">
                            {state?.details?.contractor}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item sx={{ marginTop: "1rem" }}>
                    <Paper elevation={3} sx={{ padding: "1.5rem" }}>
                        <Grid container>
                            <Grid item sx={{ display: "flex", alignItems: "center" }} xs>
                                <Typography variant="text_16_semibold">
                                    {CONTRACTOR_DETAILS.header}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
                        <Grid container rowSpacing={6} columnSpacing={4}>
                            <Grid item xs={6}>
                                <BaseTextField
                                    fullWidth
                                    label={CONTRACTOR_DETAILS.name_label}
                                    variant={"outlined"}
                                    value={contractorData?.contractorName}
                                    disabled={isEditable ? false : true}
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            contractorName: e.target.value,
                                        }));
                                    }}
                                    error={errors?.contractorName}
                                    helper={
                                        errors?.contractorName
                                            ? CONTRACTOR_DETAILS.required_text
                                            : undefined
                                    }
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <BaseTextField
                                    fullWidth
                                    label={CONTRACTOR_DETAILS.email_label}
                                    variant={"outlined"}
                                    disabled
                                    size="small"
                                    value={contractorData?.googleWorkspaceEmail}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <BaseTextField
                                    fullWidth
                                    label={CONTRACTOR_DETAILS.address_label}
                                    variant={"outlined"}
                                    disabled={isEditable ? false : true}
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            streetAddress: e.target.value,
                                        }));
                                    }}
                                    error={errors?.streetAddress}
                                    helper={
                                        errors?.streetAddress
                                            ? CONTRACTOR_DETAILS.required_text
                                            : undefined
                                    }
                                    value={contractorData?.streetAddress}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <BaseTextField
                                    fullWidth
                                    label={CONTRACTOR_DETAILS.city_label}
                                    variant={"outlined"}
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }));
                                    }}
                                    error={errors?.city}
                                    helper={
                                        errors?.city ? CONTRACTOR_DETAILS.required_text : undefined
                                    }
                                    value={contractorData?.city}
                                    disabled={isEditable ? false : true}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <BaseTextField
                                    fullWidth
                                    label={CONTRACTOR_DETAILS.state_label}
                                    variant={"outlined"}
                                    size="small"
                                    onChange={(e: any) => {
                                        setContractorData((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }));
                                    }}
                                    value={contractorData?.state}
                                    disabled={isEditable ? false : true}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <BaseTextField
                                    fullWidth
                                    label={CONTRACTOR_DETAILS.zip_code_label}
                                    variant={"outlined"}
                                    value={contractorData?.zipCode}
                                    disabled={isEditable ? false : true}
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
                        <Grid container sx={{ marginTop: "1rem" }}>
                            <Grid item sx={{ display: "flex", justifyContent: "flex-start" }} xs>
                                {isEditable && (
                                    <BaseButton
                                        onClick={() => {
                                            setIsEditable(false);
                                            setContractorData(intitalFormData(state));
                                            setErrors(initialContractorErrors);
                                        }}
                                        label={CONTRACTOR_DETAILS.Cancel}
                                        classes="grey default spaced"
                                        variant={"text_14_regular"}
                                        sx={{ marginRight: "10px" }}
                                    />
                                )}
                                <BaseButton
                                    onClick={() => {
                                        onEdit();
                                    }}
                                    label={
                                        !isEditable
                                            ? CONTRACTOR_DETAILS.Edit
                                            : CONTRACTOR_DETAILS.Save
                                    }
                                    classes="primary default spaced"
                                    variant={"text_16_semibold"}
                                />
                            </Grid>
                            {/* <Grid item>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        // startIcon={<img src={AddIcon} alt="Map to Entrata" />}
                                        style={{ height: "100%" }}
                                        onClick={() => openEntrataDialog(true)}
                                    >
                                        Map to Entrata
                                    </Button>
                                </Box>
                            </Grid> */}
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item sx={{ marginTop: "2rem" }}>
                    <Typography variant="text_18_semibold">
                        {CONTRACTOR_DETAILS.project_history_text}
                    </Typography>
                </Grid>
                {/* <VendorSearchDialog
                    open={isEntrataDialogOpen}
                    onClose={() => openEntrataDialog(false)}
                    id={state?.details?.id}
                /> */}
                <Grid item sx={{ marginTop: "1rem" }}>
                    <BaseDataGrid
                        columns={columns}
                        rows={projects}
                        rowsPerPageOptions={[10, 20, 30]}
                        hideFooter={projects?.length > 10 ? false : true}
                        disableSelectionOnClick={true}
                        onRowClick={(rowData: any) => {
                            navigate(`/rfp/admin/${state?.details?.id}/projects/${rowData.id}`, {
                                state: {
                                    projectDetails: rowData.row,
                                },
                            });
                        }}
                        getRowId={(row: any) => row.project_id}
                        getRowHeight={() => "auto"}
                        rowHeight={125}
                        components={{
                            NoRowsOverlay: () => (
                                <Stack sx={{ margin: "10px" }}>
                                    <ContentPlaceholder
                                        onLinkClick={() => {}}
                                        text={CONTRACTOR_DETAILS.empty_project_placeholder}
                                        aText=""
                                        height="250px"
                                    />
                                </Stack>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default ContractorsDetail;
