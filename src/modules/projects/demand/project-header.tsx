/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography } from "@mui/material";
import BaseButton from "components/base-button";
import { StyledGrid } from "./style";

interface IProjectsHeader {
    buttonAction: any;
}

const ProjectsHeader = ({ buttonAction }: IProjectsHeader) => {
    return (
        <StyledGrid className={"container projectApp"}>
            <StyledGrid item md={6} className={"container projectApp projects title"}>
                <Typography variant="text_26_medium">Project Overview</Typography>
            </StyledGrid>
            <StyledGrid item md={6} className={`container projectApp projects button`}>
                <BaseButton label="Add New Project" type="active" onClick={buttonAction} />
            </StyledGrid>
        </StyledGrid>
    );
};

export default ProjectsHeader;
