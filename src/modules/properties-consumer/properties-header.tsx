/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Typography } from "@mui/material";
import BaseButton from "components/base-button";
import { StyledGrid } from "./style";

interface IPropertiesHeader {
    buttonAction: any;
}

const PropertiesHeader = ({ buttonAction }: IPropertiesHeader) => {
    return (
        <StyledGrid className={"container propertyApp"}>
            <StyledGrid item md={6} className={"container propertyApp projects title"}>
                <Typography variant="text_26_medium">Properties Overview</Typography>
            </StyledGrid>
            <StyledGrid item md={6} className={`container propertyApp projects button`}>
                <BaseButton label="Add New Property" type="active" onClick={buttonAction} />
            </StyledGrid>
        </StyledGrid>
    );
};

export default PropertiesHeader;
