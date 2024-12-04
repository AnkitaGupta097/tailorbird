import React from "react";
import { StyledChip } from "./style";

interface IBaseChip {
    label: string | React.ReactNode;
    variant?: "filled" | "outlined" | undefined;
    bgcolor: string;
    textColor: string;
    [v: string]: any;
}

const BaseChip = ({ label, variant, bgcolor, textColor, ...chipProps }: IBaseChip) => {
    return (
        <StyledChip
            textColor={textColor}
            bgcolor={bgcolor}
            label={label}
            variant={variant}
            {...chipProps}
        />
    );
};

export default BaseChip;
