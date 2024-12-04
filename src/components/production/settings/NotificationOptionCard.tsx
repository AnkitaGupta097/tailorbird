import { Divider, Grid, Typography, TypographyProps } from "@mui/material";
import CheckboxList from "components/checkbox-list";
import BaseToggle from "components/toggle";
import React from "react";
import { Controller } from "react-hook-form";
import AppTheme from "styles/theme";
import TogglesList from "./toggles-list";

interface INotificationOptionCard {
    control: any;
    options: any;
    cardTitle?: string;
    toggleFieldKey?: string;
    toggleFieldTitle?: string;
    checkListKey: string;
    channelsKey: string;
    checkListTitle?: string;
    checkListTitleTypographyProps?: TypographyProps;
    canEditNotificationPreferences: Boolean;
    channelOptions: any;
}
const NotificationOptionCard = (props: INotificationOptionCard) => {
    const {
        control,
        options,
        cardTitle,
        toggleFieldKey,
        toggleFieldTitle,
        checkListKey,
        checkListTitle,
        checkListTitleTypographyProps,
        canEditNotificationPreferences,
        channelOptions,
        channelsKey,
    } = props;

    const showNotificationPreferences = canEditNotificationPreferences && !!options?.length;

    return (
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
                    {cardTitle}
                </Typography>
            </Grid>
            {toggleFieldKey && (
                <>
                    <Grid item xs={12}>
                        <Controller
                            name={toggleFieldKey}
                            control={control}
                            render={({ field }) => (
                                <BaseToggle
                                    checked={field.value}
                                    onChange={field.onChange}
                                    value={toggleFieldTitle}
                                />
                            )}
                        />
                    </Grid>
                    {showNotificationPreferences && (
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                    )}
                </>
            )}

            {showNotificationPreferences && (
                <Grid container item xs={12}>
                    <Grid item xs={3}>
                        <Controller
                            name={checkListKey}
                            control={control}
                            render={({ field }) => (
                                <CheckboxList
                                    titleText={checkListTitle}
                                    titleTextTypographyProps={checkListTitleTypographyProps}
                                    options={
                                        options?.map((c: any) => {
                                            return {
                                                label: c.name,
                                                value: c.flow,
                                            };
                                        }) ?? []
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
                            name={channelsKey}
                            control={control}
                            render={({ field }) => (
                                <TogglesList
                                    titleText="Choose where you get notified"
                                    titleTextTypographyProps={checkListTitleTypographyProps}
                                    options={
                                        options?.map((c: any) => {
                                            return {
                                                toggles: channelOptions,
                                                value: c.flow,
                                            };
                                        }) ?? []
                                    }
                                    onSelectHandler={(selected) => field.onChange(selected)}
                                    selected={field.value}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default NotificationOptionCard;
