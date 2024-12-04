import React, { useEffect, useState } from "react";
import SearchBar from "./search-bar";
import { Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { IPackages, IDataState } from "../interfaces";
import { useAppDispatch, useAppSelector } from "../../../stores/hooks";
import { actions } from "../../../stores/packages/creation";
import PackagesTable from "./packages-table";
import Filters from "./filters";
import PkgSnackBar from "../common/snackbar";
import CreateStandardPkgDialog from "./create-standard-pkg-dialog";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    //eslint-disable-next-line
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const { data, packageId } = useAppSelector((state) => ({
        data: state.packageManager.packages.data,
        packageId: state.packageManager.packages.packageId,
    }));
    const [searchText, setSearchText] = useState<string | null>("");
    const [filters, setFilters] = useState({
        Base: false,
        Alt: false,
        Standard: false,
        Scraper: false,
    });
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    // handlers
    const onSubmit = () => {
        dispatch(
            actions.fetchPackagesStart({
                search_name: searchText,
                is_alt: filters.Alt,
                is_standard: filters.Standard,
                is_scraper: filters.Scraper,
                is_base: filters.Base,
            }),
        );
    };
    const onClose = () => setOpenDialog(false);
    const onSave = (pkg: IPackages, attrs: any) => {
        dispatch(
            actions.updatePackageMetaDataStart({
                input: {
                    package_id: pkg?.package_id,
                    name: attrs.name,
                    description: attrs.description,
                    msa: attrs.msa,
                },
                is_alt: filters.Alt,
                is_standard: filters.Standard,
                is_scraper: filters.Scraper,
                is_base: filters.Base,
            }),
        );
    };
    const onSaveStandardPkg = (data: IDataState) => {
        dispatch(
            actions.createPackageStart({
                input: {
                    name: data.name,
                    ownership: data.ownership,
                    description: data.description,
                    is_standard: true,
                    version: data.version.value,
                },
                is_alt: filters.Alt,
                is_standard: filters.Standard,
                is_scraper: filters.Scraper,
                is_base: filters.Base,
            }),
        );
    };

    // hooks
    useEffect(() => {
        document.title = `Tailorbird | Package manager`;
        dispatch(actions.fetchPackagesStart({}));
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        onSubmit();
        //eslint-disable-next-line
    }, [filters]);
    useEffect(() => {
        if (packageId) {
            nav(`/packages/edit?packageId=${packageId}`);
            dispatch(actions.updateState({}));
        }
        //eslint-disable-next-line
    }, [packageId]);

    return (
        <React.Fragment>
            <CreateStandardPkgDialog
                open={openDialog}
                onClose={onClose}
                onSave={onSaveStandardPkg}
            />
            <PkgSnackBar />
            <Grid container justifyContent="center">
                <Grid item width="100%">
                    <SearchBar
                        setSearchText={setSearchText}
                        showStandardPkgDialog={setOpenDialog}
                    />
                </Grid>
                <Grid item width="100%" ml="2.5rem" mr="2.5rem">
                    <Stack direction="row" justifyContent="space-between" width="100%">
                        <Typography
                            variant="heading"
                            sx={{
                                borderBottom: `2px solid ${theme.tab.divider}`,
                                color: theme.palette.primary.main,
                            }}
                        >
                            All
                        </Typography>
                        <Filters setValue={setFilters} />
                    </Stack>
                </Grid>
                <Divider
                    flexItem
                    sx={{
                        width: "100%",
                        color: "#000",
                    }}
                />
                <Grid item mr="2.5rem" ml="2.5rem" width="100%" mb="1rem">
                    <PackagesTable packages={data} onSave={onSave} searchText={searchText} />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default LandingPage;
