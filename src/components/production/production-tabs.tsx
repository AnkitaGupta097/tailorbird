import React, { useEffect, useRef, useState } from "react";
import { compact, isUndefined } from "lodash";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BaseTabs from "components/base-tabs";
import {
    FEATURE_FLAGS,
    GET_SCOPE,
    PRODUCTION_TABS,
    PRODUCTION_TABS_NAME,
    productionTabUrl,
} from "./constants";
import { useProductionContext } from "context/production-context";
import { useAppSelector, useAppDispatch } from "stores/hooks";
import BaseLoader from "components/base-loading";
import ProjectKPI from "./common/project-kpi";
import TrackerUtil from "utils/tracker";
import actions from "stores/actions";
import { SUBSCRIBE_ORG_UPDATE } from "./constants";
import { wsclient } from "stores/gql-client";
import { graphQLClient } from "utils/gql-client";
import { shallowEqual } from "react-redux";
import { GrowthBook, GrowthBookProvider, useFeature } from "@growthbook/growthbook-react";
import { IUser } from "App";
import ZeroStateComponent from "components/zero-state-component";
import { Grid } from "@mui/material";
import { FeatureFlagConstants } from "utils/constants";

const growthbook = new GrowthBook({
    enableDevMode: true,
    trackingCallback: (experiment, result) => {
        console.log("Experiment Viewed", {
            experimentId: experiment.key,
            variationId: result.variationId,
        });
    },
});

const ProductionTabs = () => {
    const { hasFeature, projectId, isRFPProject } = useProductionContext();
    const dispatch = useAppDispatch();
    const { email }: IUser = JSON.parse(localStorage.getItem("user_details") || "{}");
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const isInitialRender = useRef(true);

    const [loading, setLoading] = useState<boolean>(true);

    const {
        projectDetails,
        productionProjectId,
        constants,
        features,
        subscription,
        featureFlags,
        accessDenied,
    } = useAppSelector(
        (state) => ({
            projectDetails: state.singleProject.projectDetails,
            productionProjectId: state.productionProject.projectId,
            constants: state.productionProject.constants,
            features: state.productionProject.featureAccess,
            subscription: state.productionProject.subscription,
            featureFlags: state.common.featureFlags.data,
            accessDenied: state.productionProject.accessDenied,
        }),
        shallowEqual,
    );

    useEffect(() => {
        growthbook.setFeatures(featureFlags);
        growthbook.setAttributes({
            project_id: projectDetails?.id,
            project_type: projectDetails?.projectType,
            email: email,
        });
    }, [projectDetails, featureFlags, email]);

    const shouldShowAgreements = hasFeature("edit_agreements");
    const isTBP2DataAdmin = useFeature(FeatureFlagConstants.TBP_2_DATA_ADMIN).on;
    const showAdminView = hasFeature(FEATURE_FLAGS.ADMIN_VIEW);

    const tabsFilteredByFeatures = PRODUCTION_TABS.filter((tab: any) => {
        switch (tab.label) {
            case PRODUCTION_TABS_NAME.agreements:
                return shouldShowAgreements;
            case PRODUCTION_TABS_NAME.admin:
                return isTBP2DataAdmin;
            case PRODUCTION_TABS_NAME.unitScheduler:
                return showAdminView;
            default:
                return true;
        }
    });

    const [currentTab, setCurrentTab] = useState<string>(tabsFilteredByFeatures[0]?.value ?? "");

    useEffect(() => {
        if (!loading && !accessDenied) {
            let tab = "units";
            switch (true) {
                case currentPath.includes("unit-scheduler"):
                    tab = "/unit-scheduler";
                    break;
                case currentPath.includes("units"):
                    tab = "/units";
                    break;
                case currentPath.includes("approvals"):
                    tab = "/approvals";
                    break;
                case currentPath.includes("settings"):
                    tab = "/settings";
                    break;
                case currentPath.includes("invoices"):
                    tab = "/invoices";
                    break;
                case currentPath.includes("agreements"):
                    if (shouldShowAgreements) {
                        tab = "/agreements";
                    } else {
                        navigate("/404");
                    }
                    break;
            }

            setCurrentTab(tab);

            if (
                currentPath === productionTabUrl(projectId, isRFPProject) ||
                currentPath === `${productionTabUrl(projectId, isRFPProject)}/`
            ) {
                navigate(`${productionTabUrl(projectId, isRFPProject)}${currentTab}`);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPath, loading]);

    useEffect(() => {
        if (accessDenied && productionProjectId === projectId) {
            setLoading(false);
        } else if (
            !isUndefined(features) &&
            productionProjectId === projectId &&
            projectDetails?.id === projectId
        ) {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features, accessDenied, productionProjectId, projectDetails]);

    //reset production redux states if not prev project
    useEffect(() => {
        if (productionProjectId && productionProjectId !== projectId) {
            dispatch(actions.production.unit.resetState());
            dispatch(actions.production.unitApproval.resetState());
            dispatch(actions.production.approval.resetState());
            dispatch(actions.production.unitScopes.resetState());
            dispatch(actions.production.invoices.resetState());
            dispatch(actions.production.project.resetState());
        }

        if (!productionProjectId || productionProjectId !== projectId) {
            //unsubscribe previous project's subscription
            subscription && subscription();

            dispatch(
                actions.production.project.setProductionProjectStateStart({
                    projectId,
                    hasProductionConstants: !!constants,
                }),
            );
        }
        if (projectId && projectDetails?.id != projectId) {
            dispatch(
                actions.singleProject.fetchProductionProjectStart({
                    project_id: projectId,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (projectDetails?.id === projectId) {
            if (isInitialRender.current) {
                TrackerUtil.event("PRODUCTION_SCREEN", {
                    projectId,
                    projectName: projectDetails?.name,
                });
                isInitialRender.current = false;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectDetails]);

    const refetchApprovalsAndScope = async (data: any) => {
        dispatch(
            actions.production.unitApproval.fetchUnitApprovalsStart({
                projectId: productionProjectId,
                isReviewed: false,
                approvalType: [],
                unitStatus: [],
            }),
        );
        dispatch(
            actions.production.unitApproval.fetchUnitApprovalsStart({
                projectId: productionProjectId,
                isReviewed: true,
                approvalType: [],
                unitStatus: [],
            }),
        );

        let renoUnitId;
        if (data.resource_type === "unit_scope") {
            const scopeResonse = await graphQLClient.query("GetUnitScope", GET_SCOPE, {
                // eslint-disable-next-line radix
                unitScopeId: parseInt(data.resource_id),
            });
            const scope = scopeResonse.getUnitScope;
            renoUnitId = scope.reno_unit_id;
            dispatch(
                actions.production.unitScopes.updateScope({
                    scopeId: data.resource_id,
                    scope,
                }),
            );
        } else if (data.resource_type === "unit") {
            renoUnitId = data.resource_id;
        }

        if (renoUnitId) {
            dispatch(
                actions.production.approval.fetchApprovalsStart({
                    renoUnitId,
                }),
            );
        }
    };

    // const refetchUnit = (data: any) => {
    //     if (data.resource_type === "renovation_unit") {
    //         dispatch(
    //             actions.production.unit.fetchRenovationUnitStart({
    //                 renoUnitId: data.resource_id,
    //             }),
    //         );
    //     }
    // };

    const refetchInvoices = () => {
        dispatch(
            actions.production.invoices.fetchFinalInvoicesStart({ projectId, loading: false }),
        );
        dispatch(
            actions.production.invoices.fetchDraftInvoicesStart({ projectId, loading: false }),
        );
        dispatch(actions.production.invoices.fetchInvoiceMetaDataStart({ projectId }));
    };

    const refetchDraftInvoices = () => {
        dispatch(
            actions.production.invoices.fetchDraftInvoicesStart({ projectId, loading: false }),
        );
    };

    useEffect(() => {
        if (productionProjectId && !subscription) {
            const orgUpdateSubscription = wsclient.subscribe(
                {
                    ...SUBSCRIBE_ORG_UPDATE,
                    variables: {
                        organizationId: localStorage.getItem("organization_id"),
                    },
                },
                {
                    next: ({ data }: any) => {
                        const updates = data.SubscribeToOrgUpdates;
                        updates.forEach((event: any) => {
                            console.log(event);
                            if (event.project_id === productionProjectId) {
                                switch (event.event_name) {
                                    case "review_unit_scope_changes":
                                    case "review_scope_item":
                                    case "update_unit_scope":
                                    case "review_pricing_group":
                                        refetchApprovalsAndScope(event);
                                        break;
                                    case "generate_invoice":
                                        refetchInvoices();
                                        break;
                                    case "generate_draft_invoice":
                                        refetchDraftInvoices();
                                        break;
                                    // case "update_renovation_unit":
                                    // case "unschedule_reno_unit":
                                    // case "release_unit":
                                    //     refetchUnit(event);
                                    //     break;
                                }
                            }
                        });
                    },
                    error: (error: any) => {
                        // Called when an error occurs
                        console.error(error);
                    },
                    complete: () => {
                        // Called when the server signals that there will be no more events
                        console.log("Org Update Subscription is completed");
                    },
                },
            );

            return () => {
                !subscription &&
                    dispatch(
                        actions.production.project.setSubscription({
                            subscription: orgUpdateSubscription,
                        }),
                    );
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productionProjectId]);

    const isParentTab = () => {
        const parentTabs = [
            "units",
            "invoices",
            "settings",
            "approvals",
            "agreements",
            "unit-scheduler",
        ];
        const pathArray = compact(currentPath.split("/"));
        const lastElement = pathArray[pathArray.length - 1];
        return parentTabs.includes(lastElement);
    };

    const onTabChanged = (event: React.ChangeEvent<{}>, newValue: string) => {
        setCurrentTab(newValue);
        navigate(`${productionTabUrl(projectId, isRFPProject)}${newValue}`);
    };

    return (
        <GrowthBookProvider growthbook={growthbook}>
            {loading ? (
                <BaseLoader />
            ) : accessDenied ? (
                <Grid
                    container
                    style={{ position: "absolute" }}
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                    height={"80%"}
                >
                    <ZeroStateComponent label="This content is intended for Construction managers, General contractors. If you qualify, please contact tailorbird support." />
                </Grid>
            ) : (
                <div style={{ margin: "32px 16px 16px 16px", height: "100%", minHeight: "74vh" }}>
                    {isParentTab() && (
                        <>
                            <ProjectKPI projectDetails={projectDetails} />
                            <BaseTabs
                                currentTab={currentTab}
                                onTabChanged={onTabChanged}
                                tabList={tabsFilteredByFeatures}
                                tabColor="#004D71"
                            />
                        </>
                    )}
                    <Outlet />
                </div>
            )}
        </GrowthBookProvider>
    );
};

export default ProductionTabs;
