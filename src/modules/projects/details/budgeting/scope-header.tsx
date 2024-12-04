import React, { useEffect, useMemo, useState } from "react";
import {
    List,
    ListItem,
    Box,
    Typography,
    styled,
    ListItemProps,
    MenuItem,
    CircularProgress as Loader,
    Dialog,
    DialogTitle,
    Grid,
} from "@mui/material";
import AddIcon from "../../../../assets/icons/icon-add.svg";
import EllipseIcon from "../../../../assets/icons/icon-ellipses.svg";
import CloseIcon from "../../../../assets/icons/icon-close.svg";
import BaseDialog from "../../../../components/base-dialog";
import BaseIconButton from "../../../../components/base-icon-button";
import BaseIconMenu from "../../../../components/base-icon-menu";
import BaseButton from "../../../../components/base-button";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import ScopeDefinitoin from "./scopes/scope-definition";
import { BUDGETING_SCOPES } from "./constants";
import AppTheme from "../../../../styles/theme";
import dispatchActions from "../../../../stores/actions";
import { useParams } from "react-router-dom";
import { getSelections } from "./scopes/base-scope/service";
import { USER_DETAILS } from "../../constant";
import { cloneDeep } from "lodash";

interface IScopeHeader {
    scope: string;
    //eslint-disable-next-line
    changeActiveScope: (v: any) => void;
    lockedScopes: string[];
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    isBaseScopeInvDefined?: any;
}

const ActiveListLabel = styled(ListItem)<ListItemProps>(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light,
    borderRadius: "0.5rem 0.5rem 0 0",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    width: "200px",
}));

const ListLabel = styled(ListItem)<ListItemProps>((props: any) => ({
    backgroundColor: `${props["data-active"] ? props.theme.palette.secondary.main : "none"}`,
    color: props.theme.palette.text.primary,
    borderRadius: "0.5rem 0.5rem 0 0",
    justifyContent: "space-between",
    display: "flex",
    cursor: "pointer",
    width: "200px",
}));
const sortData = (a: any, b: any) => {
    return a?.name?.toLowerCase()?.localeCompare(b?.name?.toLowerCase());
};

const ScopeHeader = ({
    scope,
    changeActiveScope,
    lockedScopes,
    setConfirm,
    isBaseScopeInvDefined,
}: IScopeHeader) => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const {
        scopeTree,
        loading,
        basePackage,
        altPackage,
        bidbook,
        projectDetails,
        contractorWithUsers,
    } = useAppSelector((state) => ({
        scopeTree: state.budgeting.details.altScope.scopeTrees,
        loading: state.budgeting.details.altScope.scopeTrees.loading,
        basePackage: state.budgeting.details.basePackage.data?.[0],
        altPackage: state.budgeting.details.altScope.packages.data?.[0],
        bidbook: state.budgeting.bidbook,
        projectDetails: state.projectDetails.data,
        contractorWithUsers: projectId
            ? state.rfpProjectManager.details?.[projectId]?.assignedContractorList
            : [],
    }));
    const rfp_project_version =
        parseFloat((projectDetails as any)?.system_remarks?.rfp_project_version)
            .toFixed(1)
            .toString() ?? "1.0";
    const [open, setOpen] = useState(false);
    const [isAltEdit, setIsAltEdit] = useState(false);
    const [altConfirmationOpen, setAltConfirmationOpen] = useState(false);
    const [scopeChanges, setScopeChanges] = useState<any>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [bidInterval, setBidInterval] = useState<any>();
    const [isBidIntervalActive, setIsBidIntervalActive] = useState<boolean>(false);
    const [budgetingScopes, setBudgetingScopes] = useState<any>(BUDGETING_SCOPES);
    const saveAltDefinitionDetails = (e: any) => {
        const data = getSelections(scopeChanges, scopeTree.data, "create");
        dispatch(
            dispatchActions.budgeting.createAltScopeStart({
                projectId,
                basePackageId: basePackage?.id,
                altPackageId: altPackage?.id,
                data,
                createdBy: USER_DETAILS?.id || "user",
            }),
        );
        e.target.dataset.scope = "alt-scope";
        setOpen(false);
        changeActiveScope(e);
    };

    useEffect(() => {
        dispatch(
            dispatchActions.rfpProjectManager.fetchAssignedContractorListStart({
                project_id: projectId,
                rfp_project_version: rfp_project_version,
            }),
        );
        //eslint-disable-next-line
    }, []);

    const disableExport = useMemo(() => {
        return !!(contractorWithUsers as Array<any>)?.find((c: any) => c.bid_status === "awarded");
    }, [contractorWithUsers]);

    useEffect(() => {
        if (!scopeChanges.length) {
            setScopeChanges(
                cloneDeep(scopeTree.data)
                    .map((cat: any) => {
                        cat.items?.sort(sortData);
                        return cat;
                    })
                    ?.sort(sortData),
            );
        }
        // eslint-disable-next-line
    }, [scopeTree.data]);

    useEffect(() => {
        if (
            bidbook.data.generateBidbookStatus &&
            bidbook.data.generateBidbookStatus === "IN_PROGRESS" &&
            !isBidIntervalActive
        ) {
            setBidInterval(
                setInterval(() => {
                    dispatch(dispatchActions.budgeting.fetchExportDetailsStart({ projectId }));
                }, 10000),
            );
            setIsBidIntervalActive(true);
        } else if (
            bidbook.data.generateBidbookStatus &&
            (bidbook.data.generateBidbookStatus === "SUCCESS" ||
                bidbook.data.generateBidbookStatus === "FAILED")
        ) {
            clearInterval(bidInterval);
            setIsBidIntervalActive(false);
        }
        // eslint-disable-next-line
    }, [bidbook]);

    const getScopeItem = (scope: string) => scope.toLowerCase().split(" ").join("-");

    const isDialogOpened = (scope: string) => !lockedScopes.includes(scope);

    const handleExport = () => {
        dispatch(
            dispatchActions.budgeting.createBidBookStart({
                projectId,
                projectName: projectDetails.name,
                createdBy: USER_DETAILS.id ? USER_DETAILS.id : "user",
            }),
        );
    };

    const content = loading ? (
        <Loader />
    ) : (
        <ScopeDefinitoin
            scopeItems={scopeChanges}
            setScopeItems={setScopeChanges}
            scopeLabel={"alt-scope"}
        />
    );

    const Header = () => {
        const closeModal = () => {
            setOpen(!open);
        };

        return (
            <Box component="div" style={{ display: "flex", alignItems: "space-between" }}>
                <Typography variant="heading">
                    {isAltEdit ? "Update" : "Create"} Alt Scope
                </Typography>
                <BaseIconButton icon={CloseIcon} onClick={closeModal} sx={{ marginLeft: "auto" }} />
            </Box>
        );
    };

    const updateAltDefinitionDetails = () => {
        setIsAltEdit(false);
        const data = getSelections(scopeChanges, scopeTree.data, "update");
        if (data?.length) {
            dispatch(
                dispatchActions.budgeting.updateAltScopeStart({
                    projectId,
                    basePackageId: basePackage?.id,
                    altPackageId: altPackage?.id,
                    data,
                    updatedBy: USER_DETAILS.id ? USER_DETAILS.id : "user_user",
                }),
            );
        }
        setOpen(false);
    };

    const actions = (
        <BaseButton
            label={isAltEdit ? "Update" : "Create"}
            classes="Base-scope-create-button active"
            onClick={isAltEdit ? updateAltDefinitionDetails : saveAltDefinitionDetails}
            sx={{ marginLeft: "1rem" }}
        />
    );

    const removeScope = (e: any, item: string) => {
        if (item.includes("alt")) setAltConfirmationOpen(true);
        else if (item.includes("flooring")) {
            dispatch(
                dispatchActions.budgeting.deleteGroupStart({
                    projectId,
                    updatedBy: USER_DETAILS.id ? USER_DETAILS.id : "user",
                }),
            );
            lockedScopes.push("flooring-scope");
            let e = { target: { dataset: { scope: "base-scope" } } };
            changeActiveScope(e);
        }
        setIsMenuOpen(false);
    };

    const editScope = (item: string) => {
        if (item === "alt-scope") {
            dispatch(
                dispatchActions.budgeting.fetchAltScopeEditTreeStart({
                    projectId,
                }),
            );
            setOpen(true);
            setIsAltEdit(true);
        }
        setIsMenuOpen(false);
    };

    const deleteAltScope = () => {
        dispatch(dispatchActions.budgeting.deleteAltScopeStart({ projectId }));
        setAltConfirmationOpen(false);
        lockedScopes.push("alt-scope");
        let e = { target: { dataset: { scope: "base-scope" } } };
        changeActiveScope(e);
    };

    useEffect(() => {
        let budgetingScopesCopy = JSON.parse(JSON.stringify(budgetingScopes));
        if (
            projectDetails.projectType === "COMMON_AREA" ||
            projectDetails.projectType === "EXTERIOR"
        ) {
            setBudgetingScopes(
                budgetingScopesCopy.filter(
                    (item: any) => item?.toLowerCase().includes("flooring") === false,
                ),
            );
        } else {
            setBudgetingScopes(BUDGETING_SCOPES);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectDetails]);

    const ConfirmationDialog = () => {
        return (
            <Dialog open={altConfirmationOpen} onClose={() => setAltConfirmationOpen(false)}>
                <DialogTitle
                    sx={{
                        padding: "1rem",
                        paddingBottom: "0",
                        marginLeft: "2.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    <Typography variant="dialogHeader">Delete Alt Scope</Typography>
                </DialogTitle>
                <Grid container sx={{ padding: "1.5rem", paddingTop: "0" }}>
                    <Grid item md={12} sx={{ marginBottom: "2rem", marginLeft: "2rem" }}>
                        <Typography variant="dialogContent">
                            Are you sure you want to delete alt scope?
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Grid item md={6}>
                            <BaseButton
                                label="Cancel"
                                type="active"
                                onClick={() => setAltConfirmationOpen(false)}
                                sx={{ marginLeft: "2rem" }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <BaseButton
                                label="Delete"
                                type="danger"
                                onClick={deleteAltScope}
                                sx={{ marginLeft: "12rem" }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
        );
    };

    const menuContent = (item: string) => {
        return [
            item !== "flooring-scope" ? (
                <MenuItem key="edit-item" onClick={() => editScope(item)}>
                    Edit
                </MenuItem>
            ) : null,
            <MenuItem
                data-scope={"base-scope"}
                key="remove-item"
                onClick={(e) => removeScope(e, item)}
            >
                Remove
            </MenuItem>,
        ];
    };

    const setScopeOpen = (e: any, scopeItem: string) => {
        if (scopeItem === "alt-scope") {
            dispatch(dispatchActions.budgeting.fetchAltScopeTreeStart({ projectId }));
            setOpen(true);
        } else if (scopeItem === "flooring-scope") {
            dispatch(
                dispatchActions.budgeting.setupGroupStart({
                    projectId,
                    createdBy: USER_DETAILS.is ? USER_DETAILS.id : "user",
                }),
            );
            setTimeout(() => {
                changeActiveScope(e);
            }, 2000);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                sx={{
                    borderBottom: 2,
                    borderColor: AppTheme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <List
                    style={{
                        display: "flex",
                        padding: 0,
                        height: "50px",
                        gap: "0.313rem",
                        minWidth: "613px",
                        flexDirection: "row",
                    }}
                >
                    {budgetingScopes.map((scopeItem: any) =>
                        scope === getScopeItem(scopeItem) ? (
                            <ActiveListLabel key={scopeItem} data-scope={getScopeItem(scopeItem)}>
                                <Typography
                                    variant="tab"
                                    sx={{
                                        fontWeight: 700,
                                        width: "100%",
                                    }}
                                    data-scope={getScopeItem(scopeItem)}
                                >
                                    {scopeItem}
                                </Typography>
                                {lockedScopes.includes(getScopeItem(scopeItem)) ? (
                                    <BaseIconButton
                                        icon={AddIcon}
                                        parentClassName={`Scope-header`}
                                        classes={`Budgeting-card-icon-button`}
                                        onClick={() => setOpen(true)}
                                    />
                                ) : getScopeItem(scopeItem) !== "base-scope" ? (
                                    <BaseIconMenu
                                        content={menuContent(getScopeItem(scopeItem))}
                                        icon={EllipseIcon}
                                        parentClassName={`Scope-header`}
                                        isMenuOpen={isMenuOpen}
                                        setIsMenuOpen={setIsMenuOpen}
                                        sx={{
                                            button: {
                                                background: "transparent !important",
                                                float: "right !important",
                                                marginRight: "0 !important",
                                                ...(scope !== getScopeItem(scopeItem) && {
                                                    filter: "invert(1)",
                                                }),
                                            },
                                        }}
                                        onClick={(e: any) => e.preventDefault()}
                                    />
                                ) : null}
                            </ActiveListLabel>
                        ) : (
                            <ListLabel
                                key={scopeItem}
                                data-scope={getScopeItem(scopeItem)}
                                data-active={isDialogOpened(getScopeItem(scopeItem))}
                                sx={{
                                    pointerEvents:
                                        scopeItem != "Base Scope" && !isBaseScopeInvDefined
                                            ? "none"
                                            : "all",
                                }}
                            >
                                <Typography
                                    onClick={
                                        scopeItem != "Base Scope" && !isBaseScopeInvDefined
                                            ? () => null
                                            : isDialogOpened(getScopeItem(scopeItem))
                                            ? changeActiveScope
                                            : (e) => setScopeOpen(e, getScopeItem(scopeItem))
                                    }
                                    variant="tab"
                                    sx={{
                                        fontWeight: 700,
                                        width: "100%",
                                    }}
                                    data-scope={getScopeItem(scopeItem)}
                                    data-active={isDialogOpened(getScopeItem(scopeItem))}
                                >
                                    {scopeItem}
                                </Typography>
                                {lockedScopes.includes(getScopeItem(scopeItem)) ? (
                                    <BaseIconButton
                                        icon={AddIcon}
                                        classes={`Budgeting-card-icon-button`}
                                        data-scope={getScopeItem(scopeItem)}
                                        data-active={isDialogOpened(getScopeItem(scopeItem))}
                                        onClick={
                                            scopeItem != "Base Scope" && !isBaseScopeInvDefined
                                                ? () => null
                                                : isDialogOpened(getScopeItem(scopeItem))
                                                ? changeActiveScope
                                                : (e: any) =>
                                                      setScopeOpen(e, getScopeItem(scopeItem))
                                        }
                                    />
                                ) : getScopeItem(scopeItem) !== "base-scope" ? (
                                    <BaseIconMenu
                                        content={menuContent(getScopeItem(scopeItem))}
                                        icon={EllipseIcon}
                                        parentClassName={`Scope-header`}
                                        isMenuOpen={isMenuOpen}
                                        setIsMenuOpen={setIsMenuOpen}
                                        sx={{
                                            button: {
                                                background: "transparent !important",
                                                filter: "invert(1)",
                                                float: "right",
                                                marginRight: "0 !important",
                                            },
                                        }}
                                        onClick={(e: any) => e.preventDefault()}
                                    />
                                ) : null}
                            </ListLabel>
                        ),
                    )}
                    <BaseDialog
                        button={""}
                        content={content}
                        actions={actions}
                        header={<Header />}
                        open={open}
                        setOpen={setOpen}
                        sx={{
                            "& > .MuiDialog-container > .MuiPaper-root": {
                                width: "60rem",
                            },
                        }}
                    />
                </List>
                <Grid style={{ marginLeft: "auto" }}>
                    <BaseButton
                        label={
                            rfp_project_version !== "2.0"
                                ? bidbook.loading ||
                                  bidbook.data.generateBidbookStatus === "IN_PROGRESS"
                                    ? "Loading..."
                                    : bidbook.data.generateBidbookStatus === "SUCCESS"
                                    ? "Export again"
                                    : "Export"
                                : "Save Bidbook"
                        }
                        disabled={disableExport}
                        onClick={() => {
                            bidbook.data.disableExportButton ||
                            bidbook.loading ||
                            bidbook.data.generateBidbookStatus === "IN_PROGRESS"
                                ? () => {}
                                : rfp_project_version !== "2.0"
                                ? handleExport()
                                : setConfirm(true);
                        }}
                        type={
                            bidbook.data.disableExportButton ||
                            bidbook.loading ||
                            bidbook.data.generateBidbookStatus === "IN_PROGRESS" ||
                            disableExport
                                ? "disabled"
                                : "export"
                        }
                    />
                    {bidbook.data.folderUrl && rfp_project_version !== "2.0" ? (
                        <BaseButton
                            label="Google Folder"
                            onClick={() => window.open(bidbook.data.folderUrl, "_blank")?.focus()}
                            type="active"
                        />
                    ) : null}
                    {bidbook.data.bidbookUrl && rfp_project_version !== "2.0" ? (
                        <BaseButton
                            label="Google Sheet"
                            onClick={() => window.open(bidbook.data.bidbookUrl, "_blank")?.focus()}
                            type="activeLight"
                        />
                    ) : null}
                </Grid>
                <ConfirmationDialog />
            </Box>
        </Box>
    );
};

export default React.memo(ScopeHeader);
