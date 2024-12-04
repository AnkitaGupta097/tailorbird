import { StyledRadio } from "./style";
import React from "react";
import { RadioProps } from "@mui/material";
const BaseRadio: React.FC<RadioProps> = ({ checked, ...rest }: RadioProps) => {
    return <StyledRadio checked={checked} {...rest}></StyledRadio>;
};

export default BaseRadio;
