import React, { useEffect } from "react";
import {
    Button,
    Divider,
    Grid,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { find } from "lodash";
import Select from "components/select";
import AppTheme from "styles/theme";
import BaseToggle from "components/toggle";
import CheckboxList from "components/checkbox-list";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { Controller, useForm } from "react-hook-form";
import actions from "stores/actions";
import {
    fromProductionConfigPayload,
    toKnockSettingPayload,
    toProductionConfigPayload,
} from "./requestMapper";
import BaseAutoComplete from "components/auto-complete";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { useProductionContext } from "context/production-context";
import TrackerUtil from "utils/tracker";
import NotificationOptionCard from "./NotificationOptionCard";
import { shallowEqual } from "react-redux";
import { FeatureFlagConstants } from "utils/constants";
import { useFeature } from "@growthbook/growthbook-react";
import { FEATURE_FLAGS } from "../constants";
import TogglesList from "./toggles-list";
import BaseLoader from "components/base-loading";

const Settings = () => {
    const { constants, projectId, hasFeature } = useProductionContext();
    const { allFinalInvoices, allUsers, userLoading, snackbarState, projectDetails, updating } =
        useAppSelector((state) => {
            return {
                allFinalInvoices: state.invoicesState.finalInvoices,
                allUsers: state.tpsm.all_User.users,
                userLoading: state.tpsm.all_User.loading,
                snackbarState: state.common.snackbar,
                projectDetails: state.singleProject.projectDetails,
                updating: state.singleProject.updating,
            };
        }, shallowEqual);
    const autoReleaseFeatureEnabled = useFeature(FeatureFlagConstants.AUTO_RELEASE_UNIT).on;
    const canEditSettings = true;
    // hasFeature(FEATURE_FLAGS.EDIT_PROJECT_SETTINGS);
    const canEditNotificationPreferences = hasFeature(FEATURE_FLAGS.EDIT_NOTIFICATION_PREFERENCES);

    const isUserCM = hasFeature(FEATURE_FLAGS.EDIT_INVOICE_TITLE);

    const notificationsList = constants?.KnockFlowSettings || {};

    const {
        control,
        watch,
        trigger,
        handleSubmit,
        reset,
        getValues,
        formState: { isValid, errors },
        setError,
    } = useForm({
        defaultValues: fromProductionConfigPayload(projectDetails ?? {}),
        mode: "onChange",
    });

    useEffect(() => {
        const updatedFormValues = fromProductionConfigPayload(projectDetails ?? {});
        reset(updatedFormValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectDetails]);

    const getFinalInvoices = () => {
        if (!allFinalInvoices) {
            dispatch(actions.production.invoices.fetchFinalInvoicesStart({ projectId }));
        }
    };
    const isRetainageDisabled =
        (allFinalInvoices && allFinalInvoices?.length > 0 ? true : false) || !isUserCM;

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    const retainageOptions: any = [
        { label: "0.0%", value: "0.0" },
        { label: "5.0%", value: "5.0" },
        { label: "10.0%", value: "10.0" },
        { label: "15.0%", value: "15.0" },
        { label: "20.0%", value: "20.0" },
    ];

    // effect to handle openSnack action, we can add this in App.tsx during refactor.
    useEffect(() => {
        const { open, variant, message } = snackbarState;
        open &&
            enqueueSnackbar("", {
                variant: variant,
                action: <BaseSnackbar variant={variant} title={message?.toString() ?? ""} />,
                onClose: () => {
                    dispatch(actions.common.closeSnack());
                },
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snackbarState.open]);

    const userOptions =
        userLoading && !projectDetails
            ? []
            : allUsers
                  ?.filter((u: any) => u?.organization?.id === projectDetails?.ownershipGroupId)
                  .map((user: any) => {
                      return { value: user.id, label: user.name };
                  });

    const onSubmit = (data: any) => {
        const productionConfig = {
            ...toProductionConfigPayload(data),
        };

        if (data.autoInvoicing) {
            const configErrors = [];
            if (!productionConfig.invoice_frequency) {
                configErrors.push({
                    key: "invoiceGenerationInterval",
                    value: "Invoice Generation interval",
                });
            }

            if (!productionConfig.invoice_generate_condition) {
                configErrors.push({
                    key: "invoiceGenerationCondition",
                    value: "Invoice Generation condition",
                });
            }

            if (!productionConfig.first_invoice_date) {
                configErrors.push({
                    key: "firstInvoiceDate",
                    value: "first invoice date",
                });
            }

            if ((productionConfig.projected_unit_renovation_duration as number) <= 0) {
                configErrors.push({
                    key: "projectedUnitRenovationDuration",
                    value: "Project duration",
                });
            }

            if (configErrors.length) {
                configErrors.map((config: { key: any; value: string }) =>
                    setError(config.key, { message: `${config.value} can't be null` }),
                );
                return;
            }
        }

        const flowSettings = toKnockSettingPayload(
            projectDetails?.knock_flow_settings,
            getValues("notificationPreferences"),
            getValues("notificationChannelPreferences"),
        );

        TrackerUtil.event("CLICKED_SAVE_PROJECT_SETTINGS", {
            projectId,
            projectName: projectDetails?.name,
        });

        dispatch(
            actions.singleProject.updateSingleProjectStart({
                project_id: projectId,
                projectName: projectDetails?.name,
                input: {
                    knock_flow_settings: flowSettings,
                    production_config: productionConfig,
                },
            }),
        );
    };

    useEffect(() => {
        TrackerUtil.event("PRODUCTION_SETTINGS_SCREEN", {
            projectId,
            projectName: projectDetails?.name,
        });
        trigger();
        getFinalInvoices();
        //eslint-disable-next-line
    }, []);

    const shouldShowNotificationCard = (cardType: string) => {
        let showCard = false;
        if (cardType === "UNIT") {
            showCard =
                (autoReleaseFeatureEnabled && canEditSettings) ||
                (canEditNotificationPreferences && notificationsList[cardType]?.flows);
        } else if (cardType === "APPROVALS" || cardType === "REVIEWED") {
            showCard = canEditNotificationPreferences && notificationsList[cardType]?.flows;
        } else if (cardType === "INVOICE") {
            showCard =
                canEditSettings ||
                (canEditNotificationPreferences && notificationsList[cardType]?.flows);
        }
        return showCard;
    };

    return (
        <>
            {updating ? (
                <BaseLoader />
            ) : (
                canEditSettings && (
                    <Grid
                        container
                        direction="column"
                        rowSpacing={4}
                        sx={{
                            borderRadius: "4px",
                            border: `1px solid ${AppTheme.border.textarea}`,
                            padding: "16px",
                            marginTop: "32px",
                        }}
                    >
                        <Grid item xs={12}>
                            <Typography variant="text_18_medium" color="#232323">
                                Basic Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="text_14_regular" color={AppTheme.text.medium}>
                                Please provide the following information in order to set up your
                                project for production.
                            </Typography>
                        </Grid>

                        <Grid container item spacing={4} alignItems="flex-start">
                            <Grid item xs={4}>
                                <Controller
                                    disabled={!isUserCM}
                                    name="projectLead"
                                    control={control}
                                    rules={{
                                        required: "Project Lead is required",
                                    }}
                                    render={({ field, fieldState }) => (
                                        <BaseAutoComplete
                                            disabled={!isUserCM}
                                            labelComponent={
                                                <div style={{ marginBottom: "4px" }}>
                                                    <Typography
                                                        variant="text_14_medium"
                                                        color="#202223"
                                                    >
                                                        {"Project Lead"}
                                                    </Typography>
                                                </div>
                                            }
                                            value={
                                                find(userOptions, { value: field.value })?.label ??
                                                ""
                                            }
                                            options={userOptions ?? []}
                                            renderOption={(props: any, option: any) => {
                                                return (
                                                    <li {...props} key={option.value}>
                                                        {option.label}
                                                    </li>
                                                );
                                            }}
                                            onChange={(
                                                event: React.SyntheticEvent,
                                                selected: { value: string; label: string },
                                            ) => field.onChange(selected?.value)}
                                            placeholder={"Please choose one"}
                                            error={fieldState.error}
                                            errorText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item spacing={4}>
                                <Controller
                                    disabled={!isUserCM}
                                    name="projectedUnitRenovationDuration"
                                    control={control}
                                    rules={{
                                        // eslint-disable-next-line
                                        validate: (value, formValues) =>
                                            Number.parseInt(`${value}`, 10) > 0 ||
                                            "Projected Unit Renovation Duration must be atleast 1 day",
                                        required: "Projected Unit Renovation Duration is required",
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <Typography variant="text_14_medium" color="#202223">
                                                {"Projected Unit Renovation Duration"}
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                disabled={!isUserCM}
                                                style={{ marginTop: "4px" }}
                                                sx={{
                                                    "& .MuiInputBase-input": {
                                                        paddingTop: "6px !important",
                                                        paddingBottom: "6px !important",
                                                        height: "28px !important",
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Typography color={"black"}>
                                                                Days
                                                            </Typography>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                value={field.value}
                                                onChange={(event: any) => {
                                                    let parsedNumber = Number.parseInt(
                                                        event.target?.value,
                                                        10,
                                                    );
                                                    field.onChange(
                                                        Number.isNaN(parsedNumber)
                                                            ? ""
                                                            : parsedNumber,
                                                    );
                                                }}
                                                error={
                                                    !!errors?.projectedUnitRenovationDuration
                                                        ?.message
                                                }
                                                placeholder={
                                                    "Please Provide Projected Unit Renovation Duration In Days"
                                                }
                                            />
                                        </>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )
            )}
            {shouldShowNotificationCard("INVOICE") && (
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
                        <Typography variant="text_18_medium" color="#232323">
                            Invoicing
                        </Typography>
                    </Grid>
                    {canEditSettings && (
                        <>
                            <Grid container item columnSpacing={24} direction="row">
                                <Grid item>
                                    <Controller
                                        name="invoiceGenerationCondition"
                                        control={control}
                                        render={({ field }) => (
                                            <CheckboxList
                                                disabled={!isUserCM}
                                                titleText="What will be the condition for generating an invoice?"
                                                options={
                                                    constants?.InvoiceGenerateCondition?.map(
                                                        (c: any) => {
                                                            return {
                                                                label: c.display,
                                                                value: c.value,
                                                            };
                                                        },
                                                    ) ?? []
                                                }
                                                isSingleSelect
                                                onSelectHandler={(selected) =>
                                                    field.onChange(selected[0])
                                                }
                                                selected={field.value ? [field.value] : []}
                                                errorText={
                                                    errors?.invoiceGenerationCondition?.message
                                                }
                                                {...field}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Divider sx={{ margin: "16px 0" }} />
                        </>
                    )}
                    {canEditNotificationPreferences && notificationsList["INVOICE"]?.flows && (
                        <Grid item container xs={12}>
                            <Grid item xs={3}>
                                <Controller
                                    name="notificationPreferences"
                                    control={control}
                                    render={({ field }) => (
                                        <CheckboxList
                                            titleText={notificationsList["INVOICE"]?.name}
                                            titleTextTypographyProps={{
                                                color: "#232323",
                                                fontWeight: "600",
                                            }}
                                            options={
                                                notificationsList["INVOICE"]?.flows?.map(
                                                    (c: any) => {
                                                        return {
                                                            label: c.name,
                                                            value: c.flow,
                                                        };
                                                    },
                                                ) ?? []
                                            }
                                            onSelectHandler={(selected) => field.onChange(selected)}
                                            selected={field.value ?? []}
                                            {...field}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs>
                                <Controller
                                    name={"notificationChannelPreferences"}
                                    control={control}
                                    render={({ field }) => (
                                        <TogglesList
                                            titleText="Choose where you get notified"
                                            titleTextTypographyProps={{
                                                color: "#232323",
                                                fontWeight: "600",
                                            }}
                                            options={
                                                notificationsList["INVOICE"].flows?.map(
                                                    (c: any) => {
                                                        return {
                                                            toggles: constants?.KnockChannels,
                                                            value: c.flow,
                                                        };
                                                    },
                                                ) ?? []
                                            }
                                            onSelectHandler={(selected) => field.onChange(selected)}
                                            selected={field.value}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}
                    {canEditSettings && (
                        <Grid item xs={12}>
                            <Divider sx={{ margin: "16px 0" }} />
                            <Grid item xs={12}>
                                <Typography variant="text_14_medium" color="#232323">
                                    Mobilization Percentage %
                                </Typography>

                                <Grid item xs={2}>
                                    <Controller
                                        name="demobilizationPercentage"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                disabled={!isUserCM}
                                                type="number"
                                                value={field.value}
                                                onChange={({ target }) => {
                                                    console.log(
                                                        "demobilizationPercentage",
                                                        target.value,
                                                    );
                                                    field.onChange(Number(target.value));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {canEditSettings && (
                        <Grid item xs={12}>
                            <Divider sx={{ margin: "16px 0" }} />
                            <Grid item xs={12}>
                                <Typography variant="text_18_medium" color="#232323">
                                    Retainage
                                </Typography>
                                <Grid item xs={12}>
                                    <Tooltip title={"Can only be set before production starts."}>
                                        <span>
                                            <Controller
                                                name="retainageEnabled"
                                                control={control}
                                                disabled={isRetainageDisabled}
                                                render={({ field }) => (
                                                    <BaseToggle
                                                        disabled={isRetainageDisabled}
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        value="Hold Retainage"
                                                    />
                                                )}
                                            />
                                        </span>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={2}>
                                    <Controller
                                        name="retainagePercentage"
                                        disabled={!watch("retainageEnabled") || isRetainageDisabled}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                headerLabel=""
                                                headerLabelTypographyProps={{
                                                    variant: "text_14_medium",
                                                    color: "#202223",
                                                }}
                                                selectProps={{
                                                    variant: "outlined",
                                                    fullWidth: true,
                                                    disabled:
                                                        !watch("retainageEnabled") ||
                                                        isRetainageDisabled,
                                                    onChange: field.onChange,
                                                    size: "small",
                                                    defaultValue: field.value,
                                                }}
                                                options={retainageOptions}
                                                placeholder={"Please choose one"}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            )}

            {shouldShowNotificationCard("APPROVALS") && (
                <NotificationOptionCard
                    canEditNotificationPreferences={canEditNotificationPreferences}
                    control={control}
                    cardTitle={"Approvals"}
                    // toggleFieldKey="autoApproval"
                    // toggleFieldTitle="Auto Approval"
                    checkListKey={"notificationPreferences"}
                    channelsKey="notificationChannelPreferences"
                    checkListTitle={notificationsList["APPROVALS"]?.name}
                    checkListTitleTypographyProps={{ color: "#232323", fontWeight: "600" }}
                    options={notificationsList["APPROVALS"]?.flows ?? []}
                    channelOptions={constants?.KnockChannels}
                />
            )}

            {shouldShowNotificationCard("REVIEWED") && (
                <NotificationOptionCard
                    canEditNotificationPreferences={canEditNotificationPreferences}
                    control={control}
                    cardTitle={"Reviews"}
                    checkListKey={"notificationPreferences"}
                    channelsKey="notificationChannelPreferences"
                    checkListTitle={notificationsList["REVIEWED"]?.name}
                    checkListTitleTypographyProps={{ color: "#232323", fontWeight: "600" }}
                    options={notificationsList["REVIEWED"]?.flows ?? []}
                    channelOptions={constants?.KnockChannels}
                />
            )}

            <Grid item sx={{ marginTop: "32px" }}>
                <Button
                    disabled={!isValid}
                    size="medium"
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                >
                    Confirm
                </Button>
            </Grid>
        </>
    );
};

export default Settings;
