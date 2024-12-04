import React from "react";
import { StyledTextArea } from "./style";

interface IBaseTextArea {
    value?: any;
    onChange?: any;
    [v: string]: any;
}

const BaseTextArea = ({ value, onChange, ...textFieldProps }: IBaseTextArea) => {
    return <StyledTextArea value={value} onChange={onChange} {...textFieldProps} />;
};

export default BaseTextArea;
