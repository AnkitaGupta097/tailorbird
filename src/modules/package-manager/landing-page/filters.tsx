import { Checkbox, FormControlLabel, Stack } from "@mui/material";
import React from "react";
import { CheckedIcon, Icon } from "../common";
import { FilterNames } from "../constants";

export interface IFilterProps {
    setValue: React.Dispatch<React.SetStateAction<any>>;
}
//eslint-disable-next-line
const Filters: React.FC<IFilterProps> = ({ setValue }) => {
    const onClick = (key: string, value: boolean) => {
        let col = FilterNames[key as keyof typeof FilterNames];
        setValue((prev: any) => ({ ...prev, [col]: value }));
    };
    return (
        <React.Fragment>
            <Stack direction="row" spacing={2} mb=".5rem">
                {Object.keys(FilterNames).map((key: string) => (
                    <FormControlLabel
                        control={<Checkbox checkedIcon={<CheckedIcon />} icon={<Icon />} />}
                        onClick={(e: any) => {
                            onClick(key, e.target.checked);
                        }}
                        label={FilterNames[key as keyof typeof FilterNames]}
                        labelPlacement="end"
                        key={key}
                    />
                ))}
            </Stack>
        </React.Fragment>
    );
};

export default Filters;
