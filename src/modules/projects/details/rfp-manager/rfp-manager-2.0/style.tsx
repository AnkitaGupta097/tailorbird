import styled from "@emotion/styled";
import { Grid, GridProps } from "@mui/material";

export const StyledGrid = styled(Grid)<GridProps>(() => ({
    "&.container": {
        paddingRight: "2.4rem",
    },
}));
