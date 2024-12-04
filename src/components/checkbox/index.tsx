import React from "react";
import { StyledCheckBox } from "./style";

interface ICheckboxProps {
    [v: string]: any;
}

const BaseCheckbox = ({ ...checkboxProps }: ICheckboxProps) => {
    return <StyledCheckBox {...checkboxProps} />;
};

export default BaseCheckbox;
