import { KeyboardArrowLeft } from "@mui/icons-material";
import { Grid, Stack, Typography, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { scraperText } from "../../constant";
import { INavigationBar } from "../../interface";
import { useNavigate } from "react-router-dom";

const DecoratedStack = styled(Stack)({
    "&:hover": {
        cursor: "pointer",
        textDecoration: "underline",
    },
});

const NavigationBar: React.FC<INavigationBar> = (props) => {
    // hooks
    const nav = useNavigate();
    const theme = useTheme();
    const onClose = () => nav(`/scraper`);
    const fileNameWithoutUUID =
        props.fileName?.indexOf("/") > -1
            ? props.fileName.substring(props.fileName.indexOf("/") + 1)
            : props.fileName;
    return (
        <React.Fragment>
            <Grid container direction="column">
                <Grid
                    item
                    sx={{
                        background: theme.palette.secondary.main,
                        padding: "0.75rem 0",
                        boxShadow: "2px 0px 5px 2px rgba(0 , 0 , 0 , 0.1) inset",
                    }}
                >
                    <Typography sx={{ margin: "0.5rem 0 0 2.5rem" }} variant="heading2">
                        {scraperText.scraperTitle}
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container mt="1.5rem" width="99vw">
                        <Grid item xs>
                            <Stack direction="row" justifyContent="space-between">
                                <DecoratedStack
                                    direction="row"
                                    alignItems="center"
                                    onClick={onClose}
                                    ml={props?.margin}
                                >
                                    <KeyboardArrowLeft fontSize="large" />
                                    <Typography variant="heading2">
                                        {fileNameWithoutUUID}
                                    </Typography>
                                </DecoratedStack>
                                <Stack
                                    direction="row"
                                    spacing={4}
                                    sx={{ marginRight: props?.margin }}
                                >
                                    {props?.content}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
export default React.memo(NavigationBar);
