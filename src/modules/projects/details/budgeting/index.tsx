/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Grid, CircularProgress as Loader, Snackbar, Alert } from "@mui/material";
import BasePackage from "./base-package";
import Variation from "./variation";
import ScopeHeader from "./scope-header";
import BaseScope from "./scopes/base-scope";
import AltScope from "./scopes/alt-scope";
import FlooringScope from "./scopes/flooring-scope";
import { useAppDispatch, useAppSelector } from "../../../../stores/hooks";
import { useParams } from "react-router-dom";
import actions from "../../../../stores/actions";
import { BUDGETING_LOCKED_SCOPES } from "./constants";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import ConfirmationModal from "components/confirmation-modal";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { graphQLClient } from "utils/gql-client";
import { CREATE_RENOVATION_VERSION } from "./bidbook-v2/actions/mutation-contsants";

const Budgeting = () => {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { snackbar, isAltScopeDefined, isFlooringScopeDefined, isFloorSplit, inventories } =
        useAppSelector((state) => ({
            snackbar: state.common.snackbar,
            isAltScopeDefined: state.budgeting.commonEntities.budgetMetadata.isAltScopeDefined,
            isFlooringScopeDefined:
                state.budgeting.commonEntities.budgetMetadata.isFlooringScopeDefined,
            isFloorSplit: state.budgeting.commonEntities.budgetMetadata.isFloorSplit,
            inventories: state.budgeting.details.baseScope.inventories.data || [],
        }));
    const [scope, setScope] = useState("base-scope");
    const [lockedScopes, setLockedScopes] = useState(BUDGETING_LOCKED_SCOPES);
    const [isBaseScopeInvDefined, setIsBaseScopeInvDefined] = useState(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [bidbookSaveInprogress, setBidbookSaveInprogress] = useState(false);
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };
    const changeActiveScope = (e: any) => {
        const scope = e.target.dataset?.scope ?? "base-scope";

        if (lockedScopes.includes(scope)) {
            setLockedScopes(lockedScopes.filter((s) => s !== scope));
            setScope(scope);
        } else {
            setScope(scope);
        }
    };
    const location = useLocation();

    const saveAsNewVersionConfirm = async () => {
        try {
            setBidbookSaveInprogress(true);
            await graphQLClient.mutate("CreateRenovationVersion", CREATE_RENOVATION_VERSION, {
                createRenovationVersionPayload: {
                    project_id: projectId,
                    created_by: localStorage.getItem("user_id"),
                },
            });
            showSnackBar("success", "Version updated successfully");
        } catch (e) {
            console.log("error in update", e);

            showSnackBar("error", "Unable to update the version");
        } finally {
            setBidbookSaveInprogress(false);
            setConfirm(false);
        }
    };

    useEffect(() => {
        const searchParamsObj = queryString.parse(location.search);
        if (searchParamsObj && searchParamsObj?.origin == "flooringScope") {
            setScope("flooring-scope");
            if (searchParamsObj?.inv_id) {
                dispatch(
                    actions.budgeting.updateCurrentInv({
                        selectedInv: searchParamsObj?.inv_id,
                    }),
                );
            }
        }
        if (searchParamsObj && searchParamsObj?.origin == "altScope") {
            setScope("alt-scope");
        }
    }, [location]);

    useEffect(() => {
        if (inventories?.length > 0) {
            let firstInv = inventories.find((i: any, index: any) => index == 0);
            if (firstInv?.baseScopeId != null) {
                setIsBaseScopeInvDefined(true);
            } else {
                setIsBaseScopeInvDefined(false);
            }
        }
    }, [inventories]);

    useEffect(() => {
        dispatch(
            actions.budgeting.fetchBudgetingDetailsStart({
                projectId,
            }),
        );
        dispatch(actions.budgeting.fetchExportDetailsStart({ projectId, onBudgetingLoad: true }));
    }, []);

    useEffect(
        () => () => {
            dispatch(actions.budgeting.clearBudgetingMetaData());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        if ((isFlooringScopeDefined && isFloorSplit) || isAltScopeDefined) {
            setLockedScopes((prevLockedScopes) => {
                const updatedScopes = [...prevLockedScopes];

                if (isFlooringScopeDefined && isFloorSplit) {
                    const index = updatedScopes.indexOf("flooring-scope");
                    if (index !== -1) {
                        updatedScopes.splice(index, 1);
                    }
                }

                if (isAltScopeDefined) {
                    const index = updatedScopes.indexOf("alt-scope");
                    if (index !== -1) {
                        updatedScopes.splice(index, 1);
                    }
                }

                return updatedScopes;
            });
        }
    }, [isAltScopeDefined, isFloorSplit, isFlooringScopeDefined]);

    useEffect(() => {
        const actionsMap: any = {
            "flooring-scope": actions.budgeting.fetchFlooringTakeOffsStart,
            "alt-scope": actions.budgeting.fetchAltScopeEditTreeStart,
        };

        for (const scope of ["flooring-scope", "alt-scope"]) {
            if (!lockedScopes.includes(scope)) {
                dispatch(actionsMap[scope]({ projectId }));
            }
        }
    }, [lockedScopes, dispatch, projectId]);

    const renderChildren = () => {
        if (scope === "base-scope") return <BaseScope />;
        else if (scope === "alt-scope") return <AltScope />;
        else return <FlooringScope />;
    };

    return (
        <Grid style={{ margin: "12px 24px" }}>
            <Grid container spacing={2}>
                {/* <StatusIndicator /> */}
                <ConfirmationModal
                    text={
                        "Are you sure you want to save this bidbook as a new version for RFP Manager?"
                    }
                    onCancel={() => setConfirm(false)}
                    onProceed={() => saveAsNewVersionConfirm()}
                    open={confirm}
                    variant={"general"}
                    cancelText={"Cancel"}
                    actionText="Save as New Version"
                    loading={bidbookSaveInprogress}
                    loadingText="Saving New Version"
                />
                <Snackbar
                    open={snackbar.open}
                    onClose={() => dispatch(actions.common.closeSnack())}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={3000}
                >
                    <Alert
                        onClose={() => dispatch(actions.common.closeSnack())}
                        severity={snackbar.variant}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
                <Grid item md={6} sm={6} xs={12} lg={4}>
                    <Grid className="Budgeting-top-item">
                        <BasePackage />
                    </Grid>
                </Grid>
                <Grid item md={6} sm={6} xs={12} lg={8}>
                    <Grid className="Budgeting-top-item">
                        <Variation />
                    </Grid>
                </Grid>
                <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    marginTop={5}
                    className="Budgeting-tabs-container"
                >
                    <ScopeHeader
                        lockedScopes={lockedScopes}
                        scope={scope}
                        changeActiveScope={changeActiveScope}
                        setConfirm={setConfirm}
                        isBaseScopeInvDefined={isBaseScopeInvDefined}
                    />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    {renderChildren()}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default React.memo(Budgeting);
