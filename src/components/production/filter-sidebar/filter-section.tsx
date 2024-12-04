import React, { useState } from "react";
import { Grid, List, ListItem, Typography } from "@mui/material";
import { pull } from "lodash";

export interface KeyValueObject {
    [key: string]: any;
}

type IFilterSection = React.ComponentPropsWithRef<"div"> & {
    label: string;
    filterItems: Array<KeyValueObject>;
    //eslint-disable-next-line
    onFilterClick: (arg: string[]) => void;
};

const FilterSection = ({ label, filterItems, onFilterClick }: IFilterSection) => {
    const [selected, setSelected] = useState<any>([]);

    const onSelect = (filterItem: any) => {
        const value = filterItem.value;
        const updatedSelected = [...selected];

        if (selected.indexOf(value) === -1) {
            updatedSelected.push(value);
        } else {
            pull(updatedSelected, value);
        }
        setSelected(updatedSelected);
        onFilterClick(updatedSelected);
    };

    return (
        <Grid>
            <Typography color={"#004D71"} fontWeight={"bold"} fontSize={"18px"}>
                {label}
            </Typography>
            <List>
                <Grid container flexDirection="column">
                    {filterItems?.map((filterItem) => (
                        <Grid item key={filterItem.value}>
                            <ListItem
                                key={filterItem.value}
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelect(filterItem)}
                                sx={{ paddingTop: "4px", paddingBottom: "4px" }}
                            >
                                <Typography
                                    variant={
                                        selected.indexOf(filterItem.value) === -1
                                            ? "text_12_regular"
                                            : "text_12_semibold"
                                    }
                                >
                                    {filterItem.display}
                                </Typography>
                            </ListItem>
                        </Grid>
                    ))}
                </Grid>
            </List>
        </Grid>
    );
};

export default FilterSection;
