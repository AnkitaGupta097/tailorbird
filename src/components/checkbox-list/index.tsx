import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BaseRadio from "components/radio";
import BaseCheckbox from "components/checkbox";
import AppTheme from "styles/theme";
import { FormHelperText, Typography, TypographyProps } from "@mui/material";

interface IOption {
    value: string;
    label: string;
}

interface ICheckboxListProps {
    options: IOption[];
    isSingleSelect?: boolean;
    titleText?: string;
    titleTextTypographyProps?: TypographyProps;
    selected: string[];
    disabled?: boolean;
    errorText?: string;
    // eslint-disable-next-line no-unused-vars
    onSelectHandler: (selectedValues: string[]) => void;
}

// eslint-disable-next-line react/display-name
const CheckboxList = React.forwardRef((props: ICheckboxListProps) => {
    const { options, isSingleSelect, selected, onSelectHandler, titleText, disabled, errorText } =
        props;

    const handleToggle = (value: string) => () => {
        if (isSingleSelect) {
            onSelectHandler([value]);
        } else {
            const currentIndex = selected.indexOf(value);
            const newSelectedValues = [...selected];

            if (currentIndex === -1) {
                newSelectedValues.push(value);
            } else {
                newSelectedValues.splice(currentIndex, 1);
            }

            onSelectHandler(newSelectedValues);
        }
    };

    return (
        <List>
            {titleText && (
                <ListItem disablePadding sx={{ marginBottom: "16px" }}>
                    <Typography
                        variant="text_14_regular"
                        color={AppTheme.text.medium}
                        {...props.titleTextTypographyProps}
                    >
                        {titleText}
                    </Typography>
                </ListItem>
            )}
            {options.map((option) => {
                const { value, label } = option;
                const labelId = `option-list-label-${value}`;

                return (
                    <ListItem key={value} disablePadding alignItems="flex-start">
                        <ListItemButton
                            disabled={disabled}
                            role={undefined}
                            onClick={handleToggle(value)}
                            disableGutters
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {isSingleSelect ? (
                                    <BaseRadio
                                        sx={{ padding: 0 }}
                                        checked={selected.indexOf(value) !== -1}
                                        size="small"
                                    />
                                ) : (
                                    <BaseCheckbox
                                        checked={selected.indexOf(value) !== -1}
                                        size="small"
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={label}
                                primaryTypographyProps={{
                                    color: AppTheme.palette.text.primary,
                                    variant: "text_14_medium",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
            {errorText && (
                <FormHelperText sx={{ color: "#D90000", marginTop: "5px" }}>
                    {errorText}
                </FormHelperText>
            )}
        </List>
    );
});

export default CheckboxList;
