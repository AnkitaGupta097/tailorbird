import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import AppTheme from "styles/theme";
import { Grid, Typography, TypographyProps } from "@mui/material";
import BaseToggle from "components/toggle";

interface IOption {
    value: string;
    toggles: any;
}

interface ITooglesListProps {
    options: IOption[];
    titleText?: string;
    titleTextTypographyProps?: TypographyProps;
    selected: any;
    disabled?: boolean;

    // eslint-disable-next-line no-unused-vars
    onSelectHandler: (selectedValues: string[]) => void;
}

// eslint-disable-next-line react/display-name
const TooglesList = React.forwardRef((props: ITooglesListProps) => {
    const { options, selected, onSelectHandler, titleText } = props;

    const handleToggle = (itemValue: string, toggleValue: string, checked: boolean) => {
        const currentToggles = selected[itemValue] || {};
        const newToggleValues = { ...currentToggles };

        newToggleValues[toggleValue] = checked;

        const newVal = { ...selected, [itemValue]: newToggleValues };
        onSelectHandler(newVal);
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
            <Grid container flexDirection="column">
                {options.map((option) => {
                    const { value, toggles } = option;
                    return (
                        <Grid
                            item
                            key={`option-list-toggles-${value}`}
                            container
                            flexDirection="row"
                            gap={2}
                        >
                            {toggles?.map((toggle: any) => (
                                <Grid item key={toggle.value}>
                                    <ListItem key={toggle.value} disablePadding>
                                        <BaseToggle
                                            checked={
                                                selected[value]
                                                    ? selected[value][toggle.value]
                                                    : false
                                            }
                                            onChange={(checked: boolean) => {
                                                handleToggle(value, toggle.value, checked);
                                            }}
                                            value={toggle.display}
                                        />
                                    </ListItem>
                                </Grid>
                            ))}
                        </Grid>
                    );
                })}
            </Grid>
        </List>
    );
});

export default TooglesList;
