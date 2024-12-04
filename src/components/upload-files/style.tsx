import { Box, styled, BoxProps } from "@mui/material";

export const StyledBox = styled(Box)<BoxProps>(() => ({
    height: "140px",
    width: "600px",
    background: "#dfe0eb1a",
    border: "1px dashed #dedede",
    borderRadius: "8px",
}));
