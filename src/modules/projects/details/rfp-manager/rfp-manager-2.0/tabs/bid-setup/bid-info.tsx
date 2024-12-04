import { Grid, InputLabel, Paper, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BaseAutoComplete from "components/auto-complete";
import BaseTextField from "components/text-field";
import { EMAIL_METADATA, PROJECT_DATA } from "modules/projects/constant";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import BaseButton from "components/button";
import BaseToggle from "components/toggle";
import { isEmpty } from "lodash";
import actions from "stores/actions";
import { getUnitMixData } from "modules/projects/details/projects-floorplans/service";
import moment from "moment";

interface BidInfoProps {
    activeStep: any;
    setActiveStep: any;
    setIsBidSetup: any;
    projectType?: string;
}

const BidInfo = ({ activeStep, setActiveStep, setIsBidSetup, projectType }: BidInfoProps) => {
    const { projectId } = useParams();
    let { allAdmins, projectDetails, unitMix } = useAppSelector((state) => {
        return {
            allAdmins: projectId ? state.rfpProjectManager.details?.[projectId]?.AdminList : [],
            projectDetails: state.projectDetails.data,
            unitMix: state.projectFloorplans.unitMix,
        };
    });
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const initialUserErrors: any = {
        bid_due_date: false,
        tailorbird_contact_user_id: false,
        turn_rate: false,
    };

    const [projectData, setProjectData] = useState(PROJECT_DATA);
    const [field, setField] = useState<{
        bid_due_date: string;
        expected_start_date: string;
        include_alt_bid_requests: boolean;
        include_flooring_scope: boolean;
        is_ve_accepted: boolean;
        projectId: string | undefined;
        project_specific_notes: string;
        tailorbird_contact_phone_number: string;
        tailorbird_contact_user_id: string;
        total_units: number;
        turn_rate: string;
        per_unit_target_budget: string;
    }>({
        bid_due_date: "",
        expected_start_date: "",
        include_alt_bid_requests: false,
        include_flooring_scope: false,
        is_ve_accepted: false,
        projectId: projectId,
        project_specific_notes: "",
        tailorbird_contact_phone_number: "",
        tailorbird_contact_user_id: "",
        total_units: 0,
        turn_rate: "",
        per_unit_target_budget: "",
    });
    const [errors, setErrors] = useState<any>(initialUserErrors);
    const dispatch = useAppDispatch();

    const onSave = useCallback(() => {
        field.projectId = projectId;
        projectData.rfp_bid_details = field;
        dispatch(
            actions.projectDetails.updateProjectStart({
                project_id: projectId,
                input: projectData,
            }),
        );
        setErrors(initialUserErrors);
        //eslint-disable-next-line
    }, [field]);

    useEffect(() => {
        dispatch(actions.projectFloorplans.fetchUnitMixDataStart(projectId));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isEmpty(projectDetails)) {
            let total_units = 0;
            const rfp_project_version =
                parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
                    .toFixed(1)
                    .toString() ?? "1.0";
            setProjectData({
                ownership_group_id: projectDetails?.ownershipGroupId,
                organisation_container_id: projectDetails?.organisation_container_id,
                opportunity_id: projectDetails.opportunityId,
                name: projectDetails.name,
                street_address: projectDetails.streetAddress,
                city: projectDetails.city,
                state: projectDetails.state,
                zipcode: projectDetails.zipcode,
                property_url: projectDetails.propertyUrl,
                property_type: projectDetails.propertyType,
                per_unit_target_budget: projectDetails.perUnitTargetBudget,
                management: projectDetails.management,
                management_url: projectDetails.management_url,
                user_id: projectDetails.userId,
                project_type: projectDetails.projectType,
                container_version: projectDetails.container_version,
                rfp_project_version: rfp_project_version,
                rfp_bid_details: projectDetails.rfp_bid_details,
                msa: projectDetails?.msa,
            });
            if (!isEmpty(unitMix)) {
                const updatedUnitMix: any = getUnitMixData(unitMix);
                total_units = updatedUnitMix?.totalRenoUnits;
            }
            setField({
                bid_due_date: projectDetails?.rfp_bid_details?.bid_due_date ?? "",
                expected_start_date: projectDetails?.rfp_bid_details?.expected_start_date ?? "",
                include_alt_bid_requests:
                    projectDetails?.rfp_bid_details?.include_alt_bid_requests ?? false,
                include_flooring_scope:
                    projectDetails?.rfp_bid_details?.include_flooring_scope ?? false,
                is_ve_accepted: projectDetails?.rfp_bid_details?.is_ve_accepted ?? false,
                projectId: projectId,
                project_specific_notes:
                    projectDetails?.rfp_bid_details?.project_specific_notes ?? "",
                tailorbird_contact_phone_number:
                    projectDetails?.rfp_bid_details?.tailorbird_contact_phone_number ?? "",
                tailorbird_contact_user_id:
                    projectDetails?.rfp_bid_details?.tailorbird_contact_user_id ?? "",
                total_units: total_units,
                turn_rate: projectDetails?.rfp_bid_details?.turn_rate ?? "",
                per_unit_target_budget: projectDetails?.perUnitTargetBudget ?? "",
            });

            setEmail(
                allAdmins?.filter(
                    (admin: { id: any }) =>
                        admin.id === projectDetails?.rfp_bid_details?.tailorbird_contact_user_id,
                )?.[0]?.email,
            );
            setName(
                allAdmins?.filter(
                    (admin: { id: any }) =>
                        admin.id === projectDetails?.rfp_bid_details?.tailorbird_contact_user_id,
                )?.[0]?.name,
            );

            if (isEmpty(projectDetails?.rfp_bid_details?.bid_due_date)) {
                errors.bid_due_date = true;
            }

            if (
                isEmpty(projectDetails?.rfp_bid_details?.turn_rate) &&
                projectType?.toLowerCase() === "interior"
            ) {
                errors.turn_rate = true;
            }
            if (
                projectDetails?.rfp_bid_details?.tailorbird_contact_user_id === undefined ||
                projectDetails?.rfp_bid_details?.tailorbird_contact_user_id === 0
            ) {
                errors.tailorbird_contact_user_id = true;
            }
            if (
                //@ts-ignore
                Object.values(errors).reduce((prev, curr) => (!!curr === true ? 1 + prev : prev)) >
                0
            ) {
                setErrors(errors);
            }
            setIsBidSetup(!Object.values(errors).some((item) => item === true));
        }
        // eslint-disable-next-line
    }, [projectDetails, unitMix]);

    useEffect(() => {
        if (field.tailorbird_contact_user_id?.length > 0) {
            errors.tailorbird_contact_user_id = false;
        }
        if (!isEmpty(field.bid_due_date)) {
            errors.bid_due_date = false;
        }

        if (!isEmpty(field.turn_rate) || projectType?.toLowerCase() !== "interior") {
            errors.turn_rate = false;
        }

        if (isEmpty(field.bid_due_date) || field.bid_due_date === null) {
            errors.bid_due_date = true;
        }

        if (isEmpty(field.turn_rate) || field.turn_rate === null) {
            projectType?.toLowerCase() === "interior" && (errors.turn_rate = true);
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
        }

        setIsBidSetup(!Object.values(errors).some((item) => item === true));

        //eslint-disable-next-line
    }, [field?.bid_due_date, field?.tailorbird_contact_user_id, field?.turn_rate]);
    return (
        <Paper elevation={3} sx={{ padding: "24px" }}>
            <Grid container rowSpacing={6} columnSpacing={4}>
                <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            minDate={new Date()}
                            value={field.bid_due_date}
                            onChange={(newValue) => {
                                setField((prev: any) => ({
                                    ...prev,
                                    bid_due_date: moment(new Date(newValue ?? ""))?.format(
                                        "MM/DD/YYYY",
                                    ),
                                }));
                            }}
                            renderInput={(params) => (
                                <>
                                    <InputLabel sx={{ color: "#757575", marginBottom: "5px" }}>
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
                                            errors.bid_due_date ? "This is a required field" : ""
                                        }
                                    />
                                </>
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                    <BaseToggle label={"Auto-send email reminders"} />
                </Grid>
                <Grid item xs={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            minDate={new Date()}
                            value={moment(field.expected_start_date)}
                            onChange={(newValue) => {
                                setField((prev: any) => ({
                                    ...prev,
                                    expected_start_date: moment(new Date(newValue ?? ""))?.format(
                                        "MM/DD/YYYY",
                                    ),
                                }));
                            }}
                            renderInput={(params) => (
                                <>
                                    <InputLabel sx={{ color: "#757575", marginBottom: "5px" }}>
                                        <Typography variant="text_12_regular">
                                            {EMAIL_METADATA.START_DATE}
                                        </Typography>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        variant={"outlined"}
                                        {...params}
                                        size="small"
                                    />
                                </>
                            )}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4}>
                    <BaseAutoComplete
                        variant={"outlined"}
                        options={allAdmins?.map((admin: { name: any }) => admin.name)}
                        placeholder={EMAIL_METADATA.PLACE_HOLDER}
                        label={EMAIL_METADATA.CONTACT}
                        onChange={(event: any, newValue: any) => {
                            let email = allAdmins?.filter(
                                (admin: { name: any }) => admin.name === newValue,
                            )?.[0]?.email;
                            field.tailorbird_contact_user_id = allAdmins?.filter(
                                (admin: { name: any }) => admin.name === newValue,
                            )?.[0]?.id;
                            let name = allAdmins?.filter(
                                (admin: { id: string }) =>
                                    admin.id === field.tailorbird_contact_user_id,
                            )?.[0]?.name;
                            setField(field);
                            setEmail(email);
                            setName(name);
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
                        value={name}
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
                    />
                </Grid>
                <Grid item xs={4}>
                    <BaseAutoComplete
                        variant={"outlined"}
                        options={EMAIL_METADATA.OPTIONS}
                        placeholder={EMAIL_METADATA.SELECT}
                        label={EMAIL_METADATA.IS_VE_ACCEPTED}
                        onChange={(event: any, newValue: any) => {
                            setField((prev) => ({
                                ...prev,
                                is_ve_accepted:
                                    newValue === EMAIL_METADATA.OPTIONS[0] ? true : false,
                            }));
                        }}
                        value={
                            field.is_ve_accepted === true
                                ? EMAIL_METADATA.OPTIONS[0]
                                : EMAIL_METADATA.OPTIONS[1]
                        }
                    />
                </Grid>
                {projectType?.toLowerCase() === "interior" ? (
                    <Grid item xs={4}>
                        <BaseTextField
                            fullWidth
                            label={EMAIL_METADATA.TOTAL_UNITS}
                            variant={"outlined"}
                            value={field.total_units}
                            size="small"
                            disabled={true}
                        />
                    </Grid>
                ) : null}
                {projectType?.toLowerCase() === "interior" ? (
                    <Grid item xs={4}>
                        <BaseTextField
                            fullWidth
                            label={EMAIL_METADATA.TURN_RATE}
                            variant={"outlined"}
                            onChange={(event: any) => {
                                setField((prev) => ({
                                    ...prev,
                                    turn_rate: event.target.value,
                                }));
                            }}
                            value={field.turn_rate}
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
                            error={errors.turn_rate}
                            helperText={errors.turn_rate ? "This is a required field" : ""}
                        />
                    </Grid>
                ) : null}
                <Grid item xs={4}>
                    <BaseTextField
                        fullWidth
                        label={EMAIL_METADATA.PER_UNIT_TARGET_BUDGET}
                        variant={"outlined"}
                        onChange={(event: any) => {
                            setField((prev) => ({
                                ...prev,
                                per_unit_target_budget: event.target.value,
                            }));
                        }}
                        value={field.per_unit_target_budget}
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
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item sx={{ display: "flex", justifyContent: "flex-start" }} xs>
                            <BaseButton
                                onClick={() => {
                                    onSave();
                                    setActiveStep(activeStep + 1);
                                }}
                                label={EMAIL_METADATA.SAVE}
                                classes={
                                    Object.values(errors).some((item) => item === true)
                                        ? "primary disabled spaced"
                                        : "primary default spaced"
                                }
                                variant={"text_16_semibold"}
                                disabled={
                                    Object.values(errors).some((item) => item === true)
                                        ? true
                                        : false
                                }
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BidInfo;
