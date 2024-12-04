import React from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { PROJECT_TYPE } from "../constant";
import { CheckedIcon, Icon } from "../../package-manager/common";

export interface IProjectFilters {
    setFilters: any;
}

const ProjectFilters = ({ setFilters }: IProjectFilters) => {
    return (
        <Box display="flex" justifyContent="flex-end" mt={5}>
            {PROJECT_TYPE.map((type, key) => (
                <FormControlLabel
                    control={<Checkbox checkedIcon={<CheckedIcon />} icon={<Icon />} />}
                    label={type.label}
                    labelPlacement="end"
                    key={key}
                    onClick={(e: any) => {
                        setFilters(type.value, e.target.checked);
                    }}
                />
            ))}
        </Box>
    );
};

export default ProjectFilters;
