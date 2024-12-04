import styled from "@emotion/styled";
import { Grid, GridProps } from "@mui/material";

export const StyledGrid = styled(Grid)<GridProps>(() => ({
    "&.projectListGrid": {
        // borderBottom: "0.5px solid #919191",
        marginTop: "10px",
        marginBottom: "36px",
        marginLeft: "16px",
        ".active": {
            display: "Grid",
        },
        ".inactive": {
            display: "None",
        },
    },
    "&.projectListGrid:last-child": {
        border: "None",
    },
    "&.container": {
        "&.projectApp": {
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
