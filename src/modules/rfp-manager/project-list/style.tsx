import styled from "@emotion/styled";
import { Grid, GridProps } from "@mui/material";

export const StyledGrid = styled(Grid)<GridProps>(() => ({
    "&.container": {
        marginLeft: "3rem",
        marginRight: "3rem",
        "&.input": {
            margin: "1.6rem 0 1.6rem 0",
        },
    },
}));
