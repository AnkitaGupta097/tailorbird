import styled from "@emotion/styled";
import { Grid, GridProps } from "@mui/material";

export const StyledGrid = styled(Grid)<GridProps>(() => ({
    "&.container": {
        "&.app": {
            width: "100%",
            backgroundColor: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "4rem",
            "&.projects": {
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                "&.title": {
                    color: "#000000",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                },
                "&.tabs": {
                    display: "flex",
                    justifyContent: "flex-end",
                },
            },
        },
    },
}));
