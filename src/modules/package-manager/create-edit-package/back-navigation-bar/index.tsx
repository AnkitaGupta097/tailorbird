import { Grid, Typography, Button } from "@mui/material";
import { FC } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { BackNavigationBarConstants } from "../../constants";
import AddIcon from "@mui/icons-material/Add";
import { BackNavigationBarProps } from "../../interfaces";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import styled from "@mui/styled-engine";
import AppTheme from "../../../../styles/theme";

const GridContainer = styled(Grid)({
    padding: "1.5rem 2.5rem 1.5rem 2.5rem",
});

const TypographyWithIcon = styled(Typography)({
    display: "flex",
    alignItems: "center",
    "&:hover": {
        textDecoration: "underline",
        cursor: "pointer",
    },
});

const PrimaryButton = styled(Button)({
    minHeight: "3.125rem",
    backgroundColor: AppTheme.buttons.primary,
    paddingLeft: "0.8125rem",
    paddingRight: "0.8125rem",
    color: AppTheme.common.white,
    "&:hover": {
        backgroundColor: AppTheme.buttons.primary,
        color: AppTheme.common.white,
    },
});

const RemoveButton = styled(PrimaryButton)({
    backgroundColor: AppTheme.buttons.secondary,
    color: AppTheme.text.light,
    "&:hover": {
        backgroundColor: AppTheme.buttons.secondary,
        color: AppTheme.text.light,
    },
});

const BackNavigationBar: FC<BackNavigationBarProps> = (props: BackNavigationBarProps) => {
    //Navigation
    const navigate = useNavigate();
    const search = useLocation().search;
    const navState = useLocation().state as any;
    const packageId = new URLSearchParams(search).get("packageId") ?? "";
    const goBack = () => {
        if (navState?.redirect) {
            navigate(navState?.redirect, { replace: true, state: undefined });
        } else if (packageId) {
            navigate("/packages", { replace: true });
        } else {
            navigate(-1);
        }
    };

    return (
        <Grid container direction="column">
            <Grid
                item
                style={{
                    display: "block",
                    background: AppTheme.background.header,
                    boxShadow: `inset 0 0 10px ${AppTheme.background.boxShadow}`,
                }}
            >
                <Typography variant="h5" sx={{ margin: "1rem 2.5rem " }}>
                    {props?.projectName}
                </Typography>
            </Grid>
            <Grid item>
                <GridContainer container direction="row" justifyContent="space-between">
                    <Grid item>
                        <TypographyWithIcon variant="heading" onClick={goBack}>
                            <KeyboardArrowLeftIcon fontSize="large" />
                            <Typography variant="heading" sx={{ marginLeft: ".5rem" }}>
                                {BackNavigationBarConstants.BACK}
                            </Typography>
                        </TypographyWithIcon>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Grid container>
                                    <Grid item>
                                        <PrimaryButton
                                            onClick={() => {
                                                props.onClick(true);
                                            }}
                                            className="buttons"
                                            style={{
                                                marginRight: "1rem",
                                            }}
                                        >
                                            <AddIcon fontSize="medium" />
                                            <Typography
                                                variant="buttonTypography"
                                                style={{
                                                    marginLeft: "0.25rem",
                                                }}
                                            >
                                                {BackNavigationBarConstants.CREATE_SKU}
                                            </Typography>
                                        </PrimaryButton>
                                    </Grid>
                                    {props.showCopySelected ? (
                                        <Grid item>
                                            <PrimaryButton
                                                onClick={() => {
                                                    props.handleCopySKUs();
                                                }}
                                                style={{
                                                    marginRight: "1rem",
                                                }}
                                            >
                                                <Typography variant="buttonTypography">
                                                    {BackNavigationBarConstants.COPY_SELECTED_TEXT}
                                                </Typography>
                                            </PrimaryButton>
                                        </Grid>
                                    ) : null}
                                    {props.showSave ? (
                                        <Grid item>
                                            <PrimaryButton
                                                className="buttons"
                                                onClick={() => {
                                                    props.handleSave();
                                                }}
                                                style={{
                                                    marginRight: "1rem",
                                                    padding: " 0 1.625rem",
                                                }}
                                            >
                                                <Typography variant="buttonTypography">
                                                    {BackNavigationBarConstants.SAVE}
                                                </Typography>
                                            </PrimaryButton>
                                        </Grid>
                                    ) : null}
                                    {props.showRemove ? (
                                        <Grid item>
                                            <RemoveButton
                                                onClick={() => {
                                                    props.handleRemove();
                                                }}
                                            >
                                                <Typography variant="buttonTypography">
                                                    {BackNavigationBarConstants.REMOVE}
                                                </Typography>
                                            </RemoveButton>
                                        </Grid>
                                    ) : null}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </GridContainer>
            </Grid>
        </Grid>
    );
};

export default React.memo(BackNavigationBar);
