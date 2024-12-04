import React, { useState, useEffect } from "react";
import {
    Autocomplete,
    TextField,
    ListItem,
    Grid,
    CircularProgress as Loader,
    styled,
    GridProps,
    Typography,
    Dialog,
    DialogTitle,
    Box,
} from "@mui/material";
import BaseButton from "../../../../../components/base-button";
import { useAppDispatch, useAppSelector } from "../../../../../stores/hooks";
import actions from "../../../../../stores/actions";
import { useParams, useNavigate } from "react-router-dom";
import BaseSelectionCard from "../../../../../components/base-selection-card";
import EllipseIcon from "../../../../../assets/icons/icon-ellipses.svg";
import { BASE_PACKAGE_HEADER, BASE_PACKAGE_FIELD_LABEL } from "../constants";
import BaseIconButton from "../../../../../components/base-icon-button";
import CloseIcon from "../../../../../assets/icons/icon-close.svg";
import { USER_DETAILS } from "../../../constant";

const StyledActionGrid = styled(Grid)<GridProps>(() => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "0 1rem 0 0.5rem",
    marginLeft: "0.2rem",
    width: "100%",
}));

const BasePackage = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { packages, basePackages, loading, projectDetails } = useAppSelector((state) => ({
        packages: state.budgeting.commonEntities.packages,
        basePackages: state.budgeting.details.basePackage,
        loading: state.budgeting.details.basePackage.loading,
        projectDetails: state.projectDetails.data,
    }));
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<any>(null);
    const [showIcon, setShowIcon] = useState<any>(true);

    const navigateToPackagesScreen = () => {
        navigate(`/packages/new?projectId=${params.projectId}&is_alternate=false`, {
            state: {
                redirect: `/admin-projects/${params?.projectId}/budgeting`,
                projectId: params?.projectId,
                isAlt: false,
            },
        });
    };
    const selectPackage = (e: any, newVal: any) => {
        setSelectedValue(newVal);
    };

    const deleteBasePackage = () => {
        setConfirmationOpen(false);
        dispatch(
            actions.budgeting.deleteBasePackageStart({
                projectId: params.projectId,
                packageId: selectedValue.id,
                createdBy: USER_DETAILS.id ? USER_DETAILS.id : null,
            }),
        );
        setSelectedValue(null);
    };

    const editPackage = () => {
        navigate(`/packages/edit?packageId=${basePackages?.data[0]?.id}`, {
            state: {
                redirect: `/admin-projects/${params?.projectId}/budgeting`,
                projectId: params?.projectId,
                isAlt: false,
            },
        });
        setOpen(false);
    };

    const savePackageChange = () => {
        dispatch(
            actions.budgeting.addBasePackageStart({
                projectId: params.projectId,
                packageId: selectedValue.id,
                ownershipId: projectDetails?.ownershipGroupId,
                createdBy: USER_DETAILS.id ? USER_DETAILS.id : null,
                version: "2.0",
            }),
        );
        setOpen(false);
        setSelectedValue(null);
    };

    useEffect(() => {
        const bPackage = basePackages.data?.find((p) => p?.id);
        if (bPackage?.id) {
            setSelectedValue(bPackage);
        } else {
            setSelectedValue(null);
        }
    }, [basePackages]);

    useEffect(() => {
        if (!basePackages.data?.[0]?.id) {
            setShowIcon(true);
        } else {
            setShowIcon(false);
        }
    }, [basePackages]);

    const Header = () => {
        const closeModal = () => {
            setOpen(!open);
        };
        return (
            <Box component="div" style={{ display: "flex", alignItems: "space-between" }}>
                <Typography variant="heading" className="Base-package-header">
                    {BASE_PACKAGE_HEADER}
                </Typography>
                <BaseIconButton
                    icon={CloseIcon}
                    onClick={closeModal}
                    classes="Variation-header-close-icon"
                    style={{ marginLeft: "auto", marginRight: 0 }}
                />
            </Box>
        );
    };

    const Content = () =>
        loading ? (
            <Grid>
                <Loader />
            </Grid>
        ) : (
            <Grid className="Base-package-content">
                <Typography variant="labelText" className="Base-package-content-label">
                    {BASE_PACKAGE_FIELD_LABEL}
                </Typography>
                {packages ? (
                    <Autocomplete
                        id="basePackageAutoFeild"
                        className="Base-package-auto-feild"
                        sx={{
                            width: "41rem",
                            marginTop: "0.625rem",
                        }}
                        disabled={!packages.length}
                        options={packages}
                        autoHighlight
                        getOptionLabel={(option: any) => (option.name ? option.name : "")}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        renderOption={(props, option: any) => (
                            <ListItem component="li" {...props}>
                                {option.name ?? ""} {option.location}
                            </ListItem>
                        )}
                        value={selectedValue}
                        onChange={selectPackage}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    style: { fontSize: 14 },
                                }}
                                label={
                                    !packages.length
                                        ? `No base packages found for the ownership`
                                        : ""
                                }
                                className="Base-package-auto-text-feild"
                            />
                        )}
                        size="small"
                    />
                ) : null}
            </Grid>
        );

    const Actions = () => (
        <React.Fragment>
            <StyledActionGrid className="Base-package-pop-button">
                <Grid className="BasePackage-buttonSpace">
                    <BaseButton
                        label="Cancel"
                        onClick={() => setOpen(false)}
                        classes="BasePackage-actions disabled"
                    />
                    <BaseButton
                        label="Add"
                        onClick={savePackageChange}
                        classes="BasePackage-actions active"
                    />
                </Grid>
                <Grid>
                    {!selectedValue || !selectedValue.name ? (
                        <BaseButton
                            label="New Base Package"
                            onClick={() => navigateToPackagesScreen()}
                            classes="BasePackage-actions active Base-package-add-new"
                        />
                    ) : null}
                </Grid>
            </StyledActionGrid>
        </React.Fragment>
    );

    const ConfirmationDialog = () => {
        return (
            <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
                <DialogTitle
                    sx={{
                        padding: "1rem",
                        paddingBottom: "0",
                        marginLeft: "2.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    <Typography variant="dialogHeader">Delete Base Package</Typography>
                </DialogTitle>
                <Grid container sx={{ padding: "1.5rem", paddingTop: "0" }}>
                    <Grid item md={12} sx={{ marginBottom: "2rem", marginLeft: "2rem" }}>
                        <Typography variant="dialogContent">
                            Are you sure you want to delete the base package.
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Grid item md={6}>
                            <BaseButton
                                label="Cancel"
                                type="active"
                                onClick={() => setConfirmationOpen(false)}
                                sx={{ marginLeft: "2rem" }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <BaseButton
                                label="Delete"
                                type="danger"
                                onClick={deleteBasePackage}
                                sx={{ marginLeft: "12rem" }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        );
    };

    // const details = basePackages?.data ? basePackages?.data : [];
    // eslint-disable-next-line;
    const bPackage = basePackages.data?.find((p) => p?.id);
    const details = bPackage?.id?.length
        ? [bPackage] // packages.filter((pack: any) => packageIds?.includes(pack.id))
        : [];
    return (
        <React.Fragment>
            <BaseSelectionCard
                label={"Base Package"}
                content={<Content />}
                actions={<Actions />}
                header={<Header />}
                selections={details}
                selectedItem={selectedValue}
                menuActions={{
                    Edit: { action: editPackage },
                    Remove: { action: () => setConfirmationOpen(true) },
                }}
                open={open}
                setOpen={setOpen}
                parentClassName={"Budgeting"}
                icon={{ show: showIcon, menuIcon: EllipseIcon }}
                isLoading={loading}
                dialogSx={{ minWidth: "24rem" }}
            />
            <ConfirmationDialog />
        </React.Fragment>
    );
};

export default React.memo(BasePackage);
