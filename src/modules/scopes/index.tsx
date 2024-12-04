/* eslint-disable no-unused-vars */
import { Grid, Snackbar, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import actions from "../../stores/actions";
import ScopeEditorContainerv2 from "./scope-editor-2-0/scope-editor-2-0-container";
import ScopeEditorContainer from "./scopes-editor/scopes-editor-container";
import ScopeContainer from "./scopes-list/scopes-list-container";
import { useParams, useLocation } from "react-router-dom";

const defaultScopeData = {
    id: "",
    type: "",
    ownership: "",
    name: "",
    description: "",
    scopeList: [],
    isEdit: false,
    ownershipGroupId: "",
    projectType: "",
    containerVersion: "2.1",
    scopeType: "",
};

const Scopes = () => {
    const { id, version } = useParams();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { isScopeEditor, snackbar, scopesList } = useAppSelector((state) => ({
        isScopeEditor: state.scopes.showScopeEditor,
        snackbar: state.common.snackbar,
        scopesList: state.scopes.scopeLibraries,
    }));
    const [scopeData, setScopeData] = useState(defaultScopeData);

    const getTempProjectType = (state: any) => {
        return state.tempProjectType || "INTERIOR";
    };

    useEffect(() => {
        dispatch(actions.scopes.fetchDependantScopeItemsStart({}));
        dispatch(actions.scopes.fetchScopeLibrariesListStart({}));
        // on component unmount setting the scope and rollup info to default
        return () => {
            dispatch(
                actions.scopes.updateScopeEditorReduxData({
                    showScopeEditor: false,
                    scopeMerge: null,
                    projectMerge: null,
                    loadingRollup: false,
                }),
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.title = `Tailorbird | Scope`;
        // if the path name is scopes then by default making is edit to false
        if (location.pathname === "/scopes") {
            dispatch(
                actions.scopes.updateScopeEditorReduxData({
                    showScopeEditor: false,
                }),
            );
            setScopeData((state) => {
                return { ...state, isEdit: false };
            });
        } else if (location.pathname.includes("new")) {
            if (location?.state != null && typeof location?.state == "object") {
                dispatch(
                    actions.scopes.fetchMDMContainerTreeStart({
                        projectType: getTempProjectType(location?.state),
                        containerVersion: version,
                    }),
                );

                if (
                    version == "2.0" &&
                    (scopeData.type == "OWNERSHIP" || scopeData?.scopeType == "OWNERSHIP")
                ) {
                    dispatch(
                        actions.scopes.fetchMergeRenoItemByOwnershipStart({
                            organizationId: scopeData.ownershipGroupId,
                        }),
                    );
                }
            }
        } else if (location.pathname.includes("edit")) {
            const selectedScopeInfo = scopesList.find((scope: any) => scope.id == id);
            setScopeData(selectedScopeInfo);
            dispatch(actions.scopes.fetchScopeLibraryStart({ id: id }));
            setScopeData((state) => {
                return { ...state, isEdit: true };
            });
            dispatch(
                actions.scopes.updateScopeEditorReduxData({
                    showScopeEditor: true,
                }),
            );

            if (
                version == "2.0" &&
                (selectedScopeInfo?.type == "OWNERSHIP" ||
                    selectedScopeInfo?.scopeType == "OWNERSHIP")
            ) {
                dispatch(
                    actions.scopes.fetchMergeRenoItemByOwnershipStart({
                        organizationId: selectedScopeInfo?.ownershipGroupId,
                    }),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.key, id, version, scopesList]);

    return (
        <React.Fragment>
            <Grid container className="App-title-container">
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
                <Grid container className="Projects-container">
                    <Grid item md={6} sm={6} xs={6} className="Projects-title">
                        {isScopeEditor
                            ? scopeData?.isEdit
                                ? `${scopeData.name}`
                                : `New Standard Scope : ${scopeData.name}`
                            : "Scopes"}
                    </Grid>
                </Grid>
                {isScopeEditor ? (
                    version == "1.0" ? (
                        <ScopeEditorContainer scopeData={scopeData} setScopeData={setScopeData} />
                    ) : (
                        <ScopeEditorContainerv2 scopeData={scopeData} setScopeData={setScopeData} />
                    )
                ) : (
                    <ScopeContainer scopeData={scopeData} setScopeData={setScopeData} />
                )}
            </Grid>
        </React.Fragment>
    );
};

export default Scopes;
