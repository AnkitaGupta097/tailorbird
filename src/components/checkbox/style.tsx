import styled from "@emotion/styled";
import { Checkbox, CheckboxProps } from "@mui/material";

export const StyledCheckBox = styled(Checkbox)<CheckboxProps>(function () {
    return {
        width: "1.25rem",
        height: "1.25rem",
        border: "1px solid #004D71",
        borderRadius: "4px",
        boxSizing: "border-box",
    };
});
