import styled from "@emotion/styled";
import { Grid, GridProps } from "@mui/material";

export const StyledGrid = styled(Grid)<GridProps>(() => ({
    "&.container": {
        "&.propertyApp": {
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            marginBottom: "5px",
            "&.projects": {
                paddingLeft: "3rem",
                paddingRight: "3rem",
                "&.title": {
                    color: "#000000",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                },
                "&.button": {
                    display: "flex",
                    justifyContent: "flex-end",
                    button: {
                        borderRadius: "4px",
                    },
                },
            },
        },
    },
}));
