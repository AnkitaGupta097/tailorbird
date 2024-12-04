import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputLabel,
    TextField,
    Typography,
} from "@mui/material";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import React, { useCallback, useEffect, useState } from "react";
import BaseTextField from "components/text-field";
import BaseAutoComplete from "components/auto-complete";
import BaseButton from "components/button";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CommonDialog from "modules/admin-portal/common/dialog";
import { BID_BOOK_DIALOG, EMAIL_METADATA } from "modules/projects/constant";
import { downloadAsTextFile, getCustomErrorText } from "modules/rfp-manager/helper";

interface IEmailMetaData {
    allAdmins: {
        id: string;
        name: string;
        email: string;
    }[];
    emailMetadata: { open: boolean; isGenerateCopies: boolean };
    setEmailMetadata: React.Dispatch<
        React.SetStateAction<{ open: boolean; isGenerateCopies: boolean }>
    >;
    setAddEmailMetadataModal: React.Dispatch<React.SetStateAction<boolean>>;
    existingEmailMetadata: any;
    project_id: string | undefined;
}

const EmailMetaData = ({
    allAdmins,
    emailMetadata,
    setEmailMetadata,
    existingEmailMetadata,
    project_id,
    setAddEmailMetadataModal,
}: IEmailMetaData) => {
    const [email, setEmail] = useState("");
    const initialUserErrors: any = {
        bid_due_date: false,
        tailorbird_contact_user_id: false,
    };
    const [field, setField] = useState<{
        bid_due_date: string;
        include_alt_bid_requests: boolean;
        include_flooring_scope: boolean;
        project_id: string | undefined;
        project_specific_notes: string;
        tailorbird_contact_phone_number: string;
        tailorbird_contact_user_id: string;
    }>({
        bid_due_date: existingEmailMetadata?.bid_due_date ?? "",
        include_alt_bid_requests: existingEmailMetadata?.include_alt_bid_requests ?? null,
        include_flooring_scope: existingEmailMetadata?.include_flooring_scope ?? null,
        project_id: project_id,
        project_specific_notes: existingEmailMetadata?.project_specific_notes ?? "",
        tailorbird_contact_phone_number:
            existingEmailMetadata?.tailorbird_contact_phone_number ?? "",
        tailorbird_contact_user_id: existingEmailMetadata?.tailorbird_contact_user_id ?? "",
    });
    let [loader, setLoader] = React.useState<{
        open: boolean;
        loaderText: string;
        errorText: string;
        saveText: string;
    }>({ open: false, loaderText: "", errorText: "", saveText: "" });

    const [errors, setErrors] = useState<any>(initialUserErrors);
    const dispatch = useAppDispatch();

    const {
        loading,
        error,
        assignedContractorList,
        storeEmailMetadata,
        errorText,
        projectDetails,
    } = useAppSelector((state) => {
        return {
            loading: project_id ? state.rfpProjectManager.details?.[project_id]?.loading : false,
            error: project_id ? state.rfpProjectManager.details?.[project_id]?.error : false,
            errorText: project_id ? state.rfpProjectManager.details?.[project_id]?.errorText : "",
            assignedContractorList: project_id
                ? state.rfpProjectManager.details?.[project_id]?.assignedContractorList
                : [],
            storeEmailMetadata: project_id
                ? state.rfpProjectManager.details?.[project_id]?.emailMetaData
                : null,
            projectDetails: state.projectDetails.data,
        };
    });
    const [isGenerateCopies, setIsGenerateCopies] = useState(false);
    const [isMetadataUpdated, setIsMetadataUpdated] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const onEdit = () => {
        if (existingEmailMetadata && !isEditable) setIsEditable(true);
        else onSave();
    };

    const onSave = useCallback(() => {
        let errors = { ...initialUserErrors };
        if (field.bid_due_date?.length === 0) {
            errors.bid_due_date = true;
        }
        if (
            field.tailorbird_contact_user_id === undefined ||
            field.tailorbird_contact_user_id?.length === 0
        ) {
            errors.tailorbird_contact_user_id = true;
        }
        //@ts-ignore
        if (Object.values(errors).reduce((prev, curr) => (!!curr === true ? 1 + prev : prev)) > 0) {
            setErrors(errors);
            return;
        }

        if (emailMetadata.isGenerateCopies) {
            setIsGenerateCopies(true);
        }
        field.project_id = project_id;
        const date = new Date(field.bid_due_date);
        let formattedDate = date?.toISOString().substring(0, 10);
        field.bid_due_date = formattedDate;
        dispatch(
            actions.rfpProjectManager.updateEmailMetaDataStart({
                field: {
                    ...field,
                    rfp_project_version:
                        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
                            .toFixed(1)
                            .toString() ?? "1.0",
                },
                project_id: project_id,
            }),
        );

        setLoader({
            open: true,
            loaderText: EMAIL_METADATA.LOADER_TEXT,
            errorText: EMAIL_METADATA.ERROR_TEXT,
            saveText: EMAIL_METADATA.SAVE_TEXT,
        });
        setEmailMetadata({ open: false, isGenerateCopies: false });
        if (!emailMetadata.isGenerateCopies) {
            setAddEmailMetadataModal(false);
        }
        setErrors(initialUserErrors);
        setIsEditable(false);
        // }
        //eslint-disable-next-line
    }, [field]);

    useEffect(() => {
        if (storeEmailMetadata && !isMetadataUpdated) {
            setIsMetadataUpdated(true);
        }
    }, [storeEmailMetadata, isMetadataUpdated]);

    useEffect(() => {
        if (isMetadataUpdated && isGenerateCopies && assignedContractorList?.length > 0) {
            const isInvited = assignedContractorList.some(
                (contractor: any) => contractor?.bid_status === "Invited",
            );
            if (!isInvited) {
                dispatch(
                    actions.rfpProjectManager.createBidBookStart({
                        project_id: project_id,
                        generate_copies_for_new_gcs: true,
                        regenerate_copies_of_existing_gcs: false,
                    }),
                );
                setLoader({
                    open: true,
                    loaderText: BID_BOOK_DIALOG.GC_COPIES_LOADING,
                    errorText: BID_BOOK_DIALOG.GC_COPIES_FAILED,
                    saveText: `${BID_BOOK_DIALOG.GC_COPIES_SAVED}`,
                });
                setAddEmailMetadataModal(false);
            }
        }
        //eslint-disable-next-line
    }, [isMetadataUpdated, isGenerateCopies]);

    useEffect(() => {
        if (assignedContractorList?.length > 0) {
            const isInvited = assignedContractorList.some(
                (contractor: any) => contractor?.bid_status === "Invited",
            );
            if (isInvited) {
                setIsGenerateCopies(false);
            }
        }
        //eslint-disable-next-line
    }, [assignedContractorList]);

    useEffect(() => {
        if (isGenerateCopies && error) {
            setIsGenerateCopies(false);
        }
    }, [error, isGenerateCopies]);

    useEffect(() => {
        if ((!loading || error) && !isGenerateCopies && !errorText?.length) {
            setTimeout(() => {
                setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
                //dispatch(actions.rfpProjectManager.resetState({}));
            }, 2000);
        }
        //eslint-disable-next-line
    }, [loading, error, isGenerateCopies, errorText]);

    useEffect(() => {
        if (existingEmailMetadata && allAdmins) {
            setField(() => ({
                bid_due_date: existingEmailMetadata?.bid_due_date,
                include_alt_bid_requests: existingEmailMetadata?.include_alt_bid_requests,
                include_flooring_scope: existingEmailMetadata?.include_flooring_scope,
                project_id: "",
                project_specific_notes: existingEmailMetadata?.project_specific_notes,
                tailorbird_contact_phone_number:
                    existingEmailMetadata?.tailorbird_contact_phone_number,
                tailorbird_contact_user_id: existingEmailMetadata?.tailorbird_contact_user_id,
            }));
            setEmail(
                allAdmins?.filter(
                    (admin) => admin.id === existingEmailMetadata?.tailorbird_contact_user_id,
                )?.[0]?.email,
            );
            setIsEditable(false);
        }
    }, [existingEmailMetadata, allAdmins]);

    useEffect(() => {
        setField({
            bid_due_date: "",
            include_alt_bid_requests: false,
            include_flooring_scope: false,
            project_id: project_id,
            project_specific_notes: "",
            tailorbird_contact_phone_number: "",
            tailorbird_contact_user_id: "",
        });
        if (!existingEmailMetadata) setIsEditable(true);
        //eslint-disable-next-line
    }, []);

    const downloadErrorFile = () => {
        downloadAsTextFile(errorText, `error_${project_id}.txt`);
        setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
        dispatch(
            actions.rfpProjectManager.resetState({
                project_id: project_id,
            }),
        );
    };

    const resetStoreState = () => {
        if (!loading) {
            setLoader({ open: false, loaderText: "", errorText: "", saveText: "" });
            setErrors(initialUserErrors);
            dispatch(
                actions.rfpProjectManager.resetState({
                    project_id: project_id,
                }),
            );
        }
    };

    return (
        <>
            <CommonDialog
                open={loader.open}
                onClose={resetStoreState}
                loading={loading || isGenerateCopies}
                //@ts-ignore
                error={error}
                loaderText={loader.loaderText}
                errorText={errorText?.length ? getCustomErrorText(errorText) : loader.errorText}
                saved={!loading && !isGenerateCopies && !error}
                savedText={loader.saveText}
                width="40rem"
                minHeight="26rem"
                errorName={errorText?.length ? "Baseline bidbook error:" : false}
                downloadFile={downloadErrorFile}
            />
            <Dialog
                open={emailMetadata.open}
                onClose={() => {
                    setEmailMetadata({ open: false, isGenerateCopies: false });
                    setErrors(initialUserErrors);
                    setIsEditable(false);
                }}
                fullWidth
                maxWidth={"lg"}
            >
                <DialogTitle>
                    <Grid container>
                        <Grid item sx={{ display: "flex", alignItems: "center" }} xs={11}>
                            <MailOutlineRoundedIcon />
                            <Typography variant="text_16_semibold" marginLeft={"13px"}>
                                {EMAIL_METADATA.TITLE}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "0.5rem" }} />
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: "1rem" }}>
                    <Grid container rowSpacing={6} columnSpacing={4}>
                        <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    minDate={new Date()}
                                    value={field.bid_due_date}
                                    onChange={(newValue) => {
                                        setField((prev: any) => ({
                                            ...prev,
                                            bid_due_date: newValue,
                                        }));
                                    }}
                                    renderInput={(params) => (
                                        <>
                                            <InputLabel
                                                sx={{ color: "#757575", marginBottom: "5px" }}
                                            >
                                                <Typography variant="text_12_regular">
                                                    {EMAIL_METADATA.DUE_DATE}
                                                </Typography>
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                variant={"outlined"}
                                                {...params}
                                                size="small"
                                                error={errors.bid_due_date}
                                                helperText={
                                                    errors.bid_due_date
                                                        ? "This is a required field"
                                                        : ""
                                                }
                                            />
                                        </>
                                    )}
                                    disabled={isEditable ? false : true}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                            <BaseAutoComplete
                                variant={"outlined"}
                                options={allAdmins?.map((admin) => admin.name)}
                                placeholder={EMAIL_METADATA.PLACE_HOLDER}
                                label={EMAIL_METADATA.CONTACT}
                                onChange={(event: any, newValue: any) => {
                                    let email = allAdmins?.filter(
                                        (admin) => admin.name === newValue,
                                    )?.[0]?.email;
                                    field.tailorbird_contact_user_id = allAdmins?.filter(
                                        (admin) => admin.name === newValue,
                                    )?.[0]?.id;
                                    setField(field);
                                    setEmail(email);
                                }}
                                isError={
                                    allAdmins?.length === 0 || errors.tailorbird_contact_user_id
                                        ? true
                                        : false
                                }
                                helperText={
                                    allAdmins?.length === 0
                                        ? EMAIL_METADATA.HELPER_TEXT
                                        : errors.tailorbird_contact_user_id
                                        ? "This is a required field"
                                        : ""
                                }
                                value={
                                    allAdmins?.filter(
                                        (admin) => admin.id === field.tailorbird_contact_user_id,
                                    )?.[0]?.name
                                }
                                disabled={isEditable ? false : true}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <BaseTextField
                                fullWidth
                                label={EMAIL_METADATA.EMAIL}
                                variant={"outlined"}
                                value={email}
                                disabled
                                classes="disabled"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <BaseTextField
                                fullWidth
                                label={EMAIL_METADATA.PHONE_NUMBER}
                                variant={"outlined"}
                                onChange={(event: any) => {
                                    setField((prev) => ({
                                        ...prev,
                                        tailorbird_contact_phone_number: event.target.value,
                                    }));
                                }}
                                value={field.tailorbird_contact_phone_number}
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
                                disabled={isEditable ? false : true}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <BaseAutoComplete
                                variant={"outlined"}
                                options={EMAIL_METADATA.OPTIONS}
                                placeholder={"Select"}
                                label={EMAIL_METADATA.FLOORING_SCOPE}
                                onChange={(event: any, newValue: any) => {
                                    setField((prev) => ({
                                        ...prev,
                                        include_flooring_scope:
                                            newValue === EMAIL_METADATA.OPTIONS[0] ? true : false,
                                    }));
                                }}
                                value={
                                    field.include_flooring_scope === true
                                        ? EMAIL_METADATA.OPTIONS[0]
                                        : EMAIL_METADATA.OPTIONS[1]
                                }
                                disabled={isEditable ? false : true}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <BaseAutoComplete
                                variant={"outlined"}
                                options={EMAIL_METADATA.OPTIONS}
                                placeholder={EMAIL_METADATA.SELECT}
                                label={EMAIL_METADATA.ALTERNATIVE_BID_REQUEST}
                                onChange={(event: any, newValue: any) => {
                                    setField((prev) => ({
                                        ...prev,
                                        include_alt_bid_requests:
                                            newValue === EMAIL_METADATA.OPTIONS[0] ? true : false,
                                    }));
                                }}
                                value={
                                    field.include_alt_bid_requests === true
                                        ? EMAIL_METADATA.OPTIONS[0]
                                        : EMAIL_METADATA.OPTIONS[1]
                                }
                                disabled={isEditable ? false : true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BaseTextField
                                fullWidth
                                label={EMAIL_METADATA.NOTES}
                                variant={"outlined"}
                                onChange={(event: any) => {
                                    setField((prev) => ({
                                        ...prev,
                                        project_specific_notes: event.target.value,
                                    }));
                                }}
                                value={field.project_specific_notes}
                                size="small"
                                disabled={isEditable ? false : true}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingTop: 0, paddingBottom: "1rem" }}>
                    <Grid container sx={{ marginLeft: "1rem" }}>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-start" }} xs>
                            {!(existingEmailMetadata && !isEditable) && (
                                <BaseButton
                                    onClick={() => {
                                        setEmailMetadata({ open: false, isGenerateCopies: false });
                                        setErrors(initialUserErrors);
                                        setIsEditable(false);
                                    }}
                                    label={EMAIL_METADATA.CANCEL}
                                    classes="grey default spaced"
                                    variant={"text_14_regular"}
                                    sx={{ marginRight: "10px" }}
                                />
                            )}
                            <BaseButton
                                onClick={() => {
                                    existingEmailMetadata ? onEdit() : onSave();
                                }}
                                label={
                                    existingEmailMetadata && !isEditable
                                        ? EMAIL_METADATA.EDIT
                                        : EMAIL_METADATA.SAVE
                                }
                                classes="primary default spaced"
                                variant={"text_16_semibold"}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EmailMetaData;
