import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Stack, styled, TextField, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "../common";
import { landingPageConstants } from "../constants";
import React from "react";
import { ISearchBar } from "../interfaces";
const BlockTypography = styled(Typography)(({ theme }) => ({
    display: "block",
    background: theme.background.header,
    padding: "0.8rem 2.5rem",
}));

const SearchBar: React.FC<ISearchBar> = ({ setSearchText, showStandardPkgDialog }) => {
    const theme = useTheme();
    return (
        <Stack>
            <BlockTypography variant="text_26_medium">
                {landingPageConstants.PACKAGES}
            </BlockTypography>
            <Stack
                direction="row"
                sx={{
                    margin: "1.5rem 2.5rem",
                }}
                spacing={3}
                justifyContent="center"
            >
                <TextField
                    InputProps={{
                        endAdornment: <SearchIcon htmlColor={theme.palette.secondary.dark} />,
                    }}
                    fullWidth
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
                <PrimaryButton
                    sx={{ height: "100%", width: "auto", whiteSpace: "nowrap" }}
                    startIcon={
                        <AddIcon
                            sx={{
                                marginBottom: ".125rem",
                            }}
                        />
                    }
                    onClick={() => showStandardPkgDialog(true)}
                >
                    <Typography variant="buttonText">
                        {landingPageConstants.STANDARD_PKG}
                    </Typography>
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};
export default SearchBar;
