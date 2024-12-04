import React, { useEffect, useState } from "react";
import actions from "../../../../../../stores/actions";
import { useAppDispatch, useAppSelector } from "../../../../../../stores/hooks";
import ScopeTable from "../scope-table";
import {
    Grid,
    Autocomplete,
    ListItem,
    TextField,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    styled,
    GridProps,
} from "@mui/material";
import BaseSelectionCard from "../../../../../../components/base-selection-card";
import EllipseIcon from "../../../../../../assets/icons/icon-ellipses.svg";
import CloseIcon from "../../../../../../assets/icons/icon-close.svg";
import BaseButton from "../../../../../../components/base-button";
import { useNavigate, useParams } from "react-router-dom";
import "./alt-scope.css";
import BaseIconButton from "../../../../../../components/base-icon-button";
import { USER_DETAILS } from "../../../../constant";
import {
    getCatTreeFromRenoItems,
    getRenoItemsWithWavgValues,
    getOverallWAVG,
} from "../base-scope/service";
import { cloneDeep } from "lodash";

const StyledActionGrid = styled(Grid)<GridProps>(() => ({
    display: "flex",
    justifyContent: "space-between",
    padding: "0 1rem 0 0.5rem",
    marginLeft: "0.2rem",
    width: "100%",
}));

const AltScope = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        packages,
        altPackages,
        ownershipId,
        baseScopeRenoItems,
        floorPlanData,
        altScopeRenoItems,
        inventoryMixes,
        projectDetails,
    } = useAppSelector((state) => ({
        packages: state.budgeting.details.altScope.packages,
        altPackages: state.budgeting.details.altScope.altPackages,
        ownershipId: state.projectDetails.data.ownershipGroupId,
        baseScopeRenoItems: state.budgeting.details.baseScope.renovations.data,
        floorPlanData: state.projectFloorplans.floorplans.data,
        isOneOfEach: state.budgeting.commonEntities.isOneOfEach,
        altScopeRenoItems: state.budgeting.details.altScope.renovations?.data ?? [],
        inventoryMixes: state.projectFloorplans.inventoryMixes.data,
        projectDetails: state.projectDetails.data,
    }));

    const [selectedValue, setSelectedValue] = useState<any>("");
    const [open, setOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    useEffect(() => {
        dispatch(actions.budgeting.fetchAltPackageStart({ projectId }));
        dispatch(
            actions.budgeting.fetchAltPackagesStart({
                ownershipId,
                container_version:
                    parseFloat((projectDetails as any)?.system_remarks?.container_version)
                        .toFixed(1)
                        .toString() ?? "1.0",
            }),
        );
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (altPackages.data?.length && altPackages.data?.[0]?.id) {
            setSelectedValue(altPackages.data?.[0]);
        } else {
            setSelectedValue(null);
        }
    }, [altPackages]);

    useEffect(() => {
        let commonRenoItemsonBaseCompByAltRenoItems = baseScopeRenoItems.filter((o1: any) =>
            altScopeRenoItems.some((o2: any) => o1.item === o2.item),
        );
        let renoItemsCopy = cloneDeep(
            getRenoItemsWithWavgValues(
                commonRenoItemsonBaseCompByAltRenoItems,
                inventoryMixes,
                floorPlanData,
            ),
        );
        let catTree = getCatTreeFromRenoItems(renoItemsCopy);
        const { allRenoWavg, oneOfEachWavg } = getOverallWAVG(renoItemsCopy);

        dispatch(
            actions.budgeting.updateBaseDataForDiff({
                catTree: catTree,
                totalWavg: { allRenoWavg: allRenoWavg, oneOfEachWavg: oneOfEachWavg },
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseScopeRenoItems, inventoryMixes, altScopeRenoItems]);

    const selectPackage = (e: any, newVal: any) => {
        setSelectedValue(newVal);
    };

    const navigateToPackagesScreen = () => {
        navigate(`/packages/new?projectId=${projectId}&is_alternate=true`, {
            state: {
                redirect: `${location.pathname}?origin=altScope`,
                projectId: projectId,
                isAlt: true,
            },
        });
    };

    const Header = () => {
        const closeModal = () => {
            setOpen(!open);
        };
        return (
            <Box component="div" style={{ display: "flex", alignItems: "space-between" }}>
                <Typography variant="heading">Add an alt package</Typography>
                <BaseIconButton icon={CloseIcon} onClick={closeModal} sx={{ marginLeft: "auto" }} />
            </Box>
        );
    };

    const Content = () => (
        <Grid className="Alt-package-content">
            {packages.data ? (
                <Autocomplete
                    id="basePackageAutoFeild"
                    className="Alt-package-auto-feild"
                    sx={{ width: 300 }}
                    options={packages.data}
                    disabled={!packages?.data?.length}
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
                            }}
                            label={
                                !packages?.data?.length
                                    ? `No alt packages found for the ownership`
                                    : ""
                            }
                            className="Alt-package-auto-text-feild"
                        />
                    )}
                    size="small"
                />
            ) : null}
        </Grid>
    );

    const Actions = () => (
        <StyledActionGrid className="Alt-package-pop-button">
            <Grid className="AltPackage-buttonSpace">
                <BaseButton
                    label="Cancel"
                    onClick={() => setOpen(false)}
                    classes="Alt-package-actions disabled active-margin"
                />
                <BaseButton
                    label="Add"
                    onClick={savePackageChange}
                    classes="Alt-package-actions active active-margin"
                />
            </Grid>
            <Grid>
                {!selectedValue || !selectedValue.name ? (
                    <BaseButton
                        label="New Alt Package"
                        onClick={() => navigateToPackagesScreen()}
                        classes="AltPackage-actions active Alt-package-add-new"
                    />
                ) : null}
            </Grid>
        </StyledActionGrid>
    );

    const deleteAltPackage = () => {
        setConfirmationOpen(false);
        dispatch(
            actions.budgeting.deleteAltPackageStart({
                projectId,
                packageId: selectedValue.id,
                createdBy: USER_DETAILS.id || "user",
            }),
        );
        setSelectedValue(null);
    };

    const editPackage = () => {
        navigate(`/packages/edit?packageId=${altPackages?.data[0]?.id}&is_alternate=true`, {
            state: {
                redirect: `${location.pathname}?origin=altScope`,
                projectId: projectId,
                isAlt: true,
            },
        });
        setOpen(false);
    };

    const savePackageChange = () => {
        dispatch(
            actions.budgeting.addAltPackageStart({
                projectId,
                packageId: selectedValue.id,
                ownershipId,
                createdBy: USER_DETAILS.id || "user",
            }),
        );
        setOpen(false);
        setSelectedValue({ name: "" }); // TODO: check selection value after cleanup.
    };

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
                    <Typography variant="dialogHeader">Delete Alt Package</Typography>
                </DialogTitle>
                <Grid container sx={{ padding: "1.5rem", paddingTop: "0" }}>
                    <Grid item md={12} sx={{ marginBottom: "2rem", marginLeft: "2rem" }}>
                        <Typography variant="dialogContent">
                            Are you sure you want to delete alt package?
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
                                onClick={deleteAltPackage}
                                sx={{ marginLeft: "12rem" }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        );
    };

    return (
        <Grid container className="Alt-scope-container">
            <Grid item md={12} sm={12} lg={12} xl={12} xs={12}>
                <BaseSelectionCard
                    label={"Alt Package"}
                    content={<Content />}
                    actions={<Actions />}
                    header={<Header />}
                    selections={altPackages.data.filter((pkg) => pkg?.id)}
                    selectedItem={selectedValue}
                    open={open}
                    setOpen={setOpen}
                    parentClassName={"Alt-scope"}
                    icon={{
                        show: !(altPackages.data.length && altPackages.data?.[0]?.id),
                        menuIcon: EllipseIcon,
                    }}
                    menuActions={{
                        Edit: { action: editPackage },
                        Remove: { action: () => setConfirmationOpen(true) },
                    }}
                    dialogSx={{
                        "& > .MuiDialog-container > .MuiPaper-root": { width: "60rem" },
                    }}
                    isLoading={false}
                />
            </Grid>
            <Grid
                item
                md={12}
                sm={12}
                lg={12}
                xl={12}
                xs={12}
                marginTop={6}
                className="Inventory-container"
            >
                <ScopeTable showScopeTable={true} selectedInventory={[]} scopeType={"altScope"} />
            </Grid>
            <ConfirmationDialog />
        </Grid>
    );
};

export default React.memo(AltScope);
