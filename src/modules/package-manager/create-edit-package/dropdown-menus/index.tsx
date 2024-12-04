import { Grid, Typography, TextField, Autocomplete } from "@mui/material";
import React, { FC } from "react";
import { DropdownMenusConstants } from "../../constants";
import { ISearchFilterProps } from "../../interfaces";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material";
import { PrimaryButton } from "../../common";
import AppTheme from "../../../../styles/theme";

function getValidOptions(options: Array<String> | undefined) {
    if (!options) return [];
    return options?.filter((option) => !!option);
}

const PackageDiv = styled("div")({
    height: "100%",
    minWidth: "65px",
    background: AppTheme.buttons.secondary,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
});

const CustomAutocomplete = styled(Autocomplete)(() => ({
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: `1px solid ${AppTheme.border.divider}`,
        borderBottom: `3px solid ${AppTheme.border.divider}`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: AppTheme.border.divider,
    },
}));

const AutocompleteTextField = styled(TextField)({
    fontSize: "14px",
    borderRadius: "0px",
    [`& fieldset`]: {
        borderRadius: 0,
    },
});

const SearchButton = styled(PrimaryButton)({
    minHeight: "56px",
    borderRadius: 0,
});

const ContainerGrid = styled(Grid)({
    width: "100%",
    minHeight: "56px",
    ".MuiGrid-item": {
        minHeight: "56px",
    },
});

const DropdownMenus: FC<ISearchFilterProps> = (props: ISearchFilterProps) => {
    const isLabor = props.isLabor;
    return (
        <ContainerGrid container direction="row">
            <Grid item>
                <PackageDiv>
                    <Typography>{isLabor ? "L" : "M"}</Typography>
                </PackageDiv>
            </Grid>
            <Grid item xs>
                <CustomAutocomplete
                    disabled={props.showProgress}
                    getOptionLabel={(option: any) => option.name}
                    fullWidth
                    onChange={(e, value) =>
                        //@ts-ignore
                        props.onChange("ownership_group_id", value?.id ?? "")
                    }
                    popupIcon={<KeyboardArrowDownIcon />}
                    options={getValidOptions(props.ownership)}
                    renderInput={(params) => (
                        <AutocompleteTextField
                            placeholder={DropdownMenusConstants.OWNERSHIP}
                            {...params}
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            <Grid item xs>
                <CustomAutocomplete
                    disabled={props.showProgress}
                    fullWidth
                    onChange={(e, value) => {
                        props.onChange("package", value);
                    }}
                    popupIcon={<KeyboardArrowDownIcon />}
                    options={props.package ?? []}
                    renderOption={(props, option: any) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        );
                    }}
                    isOptionEqualToValue={(option: any, value: any) => value.id == option.id}
                    getOptionLabel={(option: any) => option.name}
                    renderInput={(params) => (
                        <AutocompleteTextField
                            placeholder={DropdownMenusConstants.PACKAGE}
                            {...params}
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            {isLabor ? null : (
                <Grid item xs>
                    <CustomAutocomplete
                        // style={autoFilterStyle}
                        disabled={props.showProgress}
                        fullWidth
                        onChange={(e, value) => {
                            props.onChange("manufacturer", value);
                        }}
                        popupIcon={<KeyboardArrowDownIcon />}
                        options={getValidOptions(props.supplier)}
                        renderInput={(params) => (
                            <AutocompleteTextField
                                placeholder={DropdownMenusConstants.MANUFACTURER}
                                {...params}
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
            )}
            <Grid item xs>
                <CustomAutocomplete
                    // style={autoFilterStyle}
                    disabled={props.showProgress}
                    fullWidth
                    onChange={(e, value) => {
                        props.onChange("category", value);
                    }}
                    popupIcon={<KeyboardArrowDownIcon />}
                    options={getValidOptions(props.category)}
                    renderInput={(params) => (
                        <AutocompleteTextField
                            placeholder={DropdownMenusConstants.CATEGORY}
                            {...params}
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            <Grid item xs>
                <CustomAutocomplete
                    // style={autoFilterStyle}
                    disabled={props.showProgress}
                    fullWidth
                    onChange={(e, value) => {
                        props.onChange("subcategory", value);
                    }}
                    popupIcon={<KeyboardArrowDownIcon />}
                    options={getValidOptions(props.subcategory)}
                    renderInput={(params) => (
                        <AutocompleteTextField
                            placeholder={DropdownMenusConstants.ITEM}
                            {...params}
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            {isLabor ? null : (
                <React.Fragment>
                    <Grid item xs>
                        <CustomAutocomplete
                            // style={autoFilterStyle}
                            disabled={props.showProgress}
                            fullWidth
                            onChange={(e, value) => {
                                props.onChange("style", value);
                            }}
                            popupIcon={<KeyboardArrowDownIcon />}
                            options={getValidOptions(props.style)}
                            renderInput={(params) => (
                                <AutocompleteTextField
                                    placeholder={DropdownMenusConstants.STYLE}
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs>
                        <CustomAutocomplete
                            // style={autoFilterStyle}
                            disabled={props.showProgress}
                            fullWidth
                            onChange={(e, value) => {
                                props.onChange("finish", value);
                            }}
                            popupIcon={<KeyboardArrowDownIcon />}
                            options={getValidOptions(props.finish)}
                            renderInput={(params) => (
                                <AutocompleteTextField
                                    placeholder={DropdownMenusConstants.FINISH}
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs>
                        <CustomAutocomplete
                            // style={autoFilterStyle}
                            disabled={props.showProgress}
                            fullWidth
                            onChange={(e, value) => {
                                props.onChange("grade", value);
                            }}
                            popupIcon={<KeyboardArrowDownIcon />}
                            options={getValidOptions(props.grade)}
                            renderInput={(params) => (
                                <AutocompleteTextField
                                    placeholder={DropdownMenusConstants.GRADE}
                                    {...params}
                                    variant="outlined"
                                />
                            )}
                        />
                    </Grid>
                </React.Fragment>
            )}
            <Grid
                item
                style={{
                    minWidth: "140px",
                }}
            >
                <SearchButton variant="contained" onClick={() => props.onSearch()}>
                    <SearchIcon
                        style={{
                            marginRight: "5%",
                        }}
                    />
                    <Typography variant="buttonTypography">
                        {DropdownMenusConstants.SEARCH}
                    </Typography>
                </SearchButton>
            </Grid>
        </ContainerGrid>
    );
};

export default React.memo(DropdownMenus);
