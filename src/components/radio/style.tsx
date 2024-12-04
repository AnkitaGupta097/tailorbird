import { Radio, styled, RadioProps } from "@mui/material";

export const StyledRadio = styled(Radio)<RadioProps>(() => ({
    "&, &.Mui-checked": {
        color: "#004D71",
    },
}));
