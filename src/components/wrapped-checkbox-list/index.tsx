/* eslint-disable no-unused-vars */
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BaseRadio from "components/radio";
import BaseCheckbox from "components/checkbox";
import AppTheme from "styles/theme";
import { Box, Checkbox, Typography, TypographyProps } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";

export interface Option {
    value: string;
    label: string;
}

interface WrappedCheckBoxListProps {
    options: Option[];
    titleText?: string;
    titleTextTypographyProps?: TypographyProps;
    selected: string[];
    disabled?: boolean;
    onSelectHandler: (selectedValues: string[]) => void;
}
const useStyles = makeStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0 1.25rem",
        margin: "0.63rem 0",
    },
    item: {
        width: "auto",
    },
});
const WrappedCheckBoxList = forwardRef(
    ({
        options,
        selected,
        onSelectHandler,
        titleText,
        disabled,
        titleTextTypographyProps,
    }: WrappedCheckBoxListProps) => {
        const [selectedValues, setSelectedValues] = useState<string[]>(selected);
        const classes = useStyles();

        const handleToggle = (value: string) => () => {
            const currentIndex = selectedValues.indexOf(value);
            const newSelectedValues = [...selectedValues];

            if (currentIndex === -1) {
                newSelectedValues.push(value);
            } else {
                newSelectedValues.splice(currentIndex, 1);
            }

            setSelectedValues(newSelectedValues);
        };

        useEffect(() => {
            onSelectHandler(selectedValues);
        }, [onSelectHandler, selectedValues]);

        return (
            <Box>
                {titleText && (
                    <Typography
                        variant="text_14_regular"
                        color={AppTheme.text.medium}
                        {...titleTextTypographyProps}
                    >
                        {titleText}
                    </Typography>
                )}
                <div className={classes.container}>
                    {options.map((option) => {
                        const { value, label } = option;
                        const labelId = `option-list-label-${value}`;

                        return (
                            <ListItem key={value} disablePadding className={classes.item}>
                                <ListItemButton
                                    disabled={disabled}
                                    role={undefined}
                                    onClick={handleToggle(value)}
                                    disableGutters
                                    sx={{
                                        padding: 1,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <BaseCheckbox
                                            checked={selectedValues.indexOf(value) !== -1}
                                            size="small"
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={label}
                                        primaryTypographyProps={{
                                            color: AppTheme.palette.text.primary,
                                            variant: "text_14_regular",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </div>
            </Box>
        );
    },
);

WrappedCheckBoxList.displayName = "WrappedCheckBoxList";
export default WrappedCheckBoxList;
