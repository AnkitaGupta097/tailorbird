import createSagaMiddleware from "redux-saga";
import { Reducer, configureStore, MiddlewareArray, combineReducers } from "@reduxjs/toolkit";
import {
    IBudgeting,
    reducer as budgetingReducer,
    budgetingSagas,
} from "./projects/details/budgeting";
import {
    IFloorplans,
    reducer as floorplanReducer,
    floorplanSagas,
} from "./projects/details/floor-plans";
import { IscraperServiceState, scraperServiceReducer, scrapersSaga } from "./scraper";
import { commonReducer, ICommonState } from "./common";
import { IMDMState, mdmReducer, mdmSaga } from "./mdm";
import { reducer as propertiesServiceReducer } from "./projects/properties";
import {
    IProjectDetails,
    reducer as projectDetailsReducer,
    projectDetailsSagas,
} from "./projects/details/index";
import {
    IPropertyDetails,
    reducer as propertyDetailsReducer,
    propertyDetailsSagas,
} from "./projects/properties/details/index";
// import {
//     IPropertyOverview,
//     reducer as propertyOverviewReducer,
//     overviewSagas as overviewSagasProperties,
// } from "./projects/properties/details/overview";
import {
    IProjectOverview,
    reducer as overviewReducer,
    overviewSagas,
} from "./projects/details/overview";
import {
    IRfpManagerState,
    reducer as rfpProjectManager,
    rfpProjectManagerSagas,
} from "./projects/details/rfp-manager";
import { IScopes, reducer as scopesReducer, scopesSagas } from "./scopes";
import { ITPSM, reducer as tpsmReducer, tpsmSagas } from "./projects/tpsm";
import { IPackageManagerState, packageManagerReducer, packagesSaga } from "./packages";
import { IRfpServiceState, rfpSaga, rfpServiceReducer } from "./rfp";
import { IIMSState, imsReducer, imsSaga } from "./ims";
import {
    IPropertiesConsumer,
    reducer as propertiesConsumerReducer,
    propertiesConsumerSaga,
} from "./properties-consumer";
import {
    IFileUtility,
    reducer as fileUtilityReducer,
    fileUtilitySagas,
} from "./projects/file-utility";
import { IBiddingPortal, biddingPortalReducer, biddingPortalSaga } from "./bidding-portal";
import { IProperties, propertySagas } from "./projects/properties";
import { ISingleProject, singleProjectReducer, singleProjectDetailsSaga } from "./single-project";
import { IRenovationUnits, unitReducer, unitsSaga } from "./production/units";
import { IInvoicesState, invoicesSaga, invoicesReducer } from "./production/invoices";
import { IProject, productionProjectReducer, productionProjectSaga } from "./production/project";
import { IUnitScopeState, unitScopesReducer, unitScopesSaga } from "./production/unit-scopes";

import {
    IUnitApprovalState,
    unitApprovalsReducer,
    unitApprovalsSaga,
} from "./production/unit-approvals";
import { IApprovalState, approvalReducer, approvalsSaga } from "./production/approvals";
import { IAgreementState, agreementReducer, agreementSaga } from "./production/agreements";
import {
    IProjectDemand,
    reducer as projectDemandReducer,
    projectsDemandSaga,
} from "./projects/demand";
interface AppState {
    budgeting: IBudgeting;
    common: ICommonState;
    projectDetails: IProjectDetails;
    propertyDetails: IPropertyDetails;
    projectsDemand: IProjectDemand;
    mdm: IMDMState;
    scraperService: IscraperServiceState;
    tpsm: ITPSM;
    property: IProperties;
    fileUtility: IFileUtility;
    projectOverview: IProjectOverview;
    rfpProjectManager: IRfpManagerState;
    packageManager: IPackageManagerState;
    scopes: IScopes;
    projectFloorplans: IFloorplans;
    rfpService: IRfpServiceState;
    ims: IIMSState;
    biddingPortal: IBiddingPortal;
    propertiesConsumer: IPropertiesConsumer;
    singleProject: ISingleProject;
    renoUnitsData: IRenovationUnits;
    unitApprovalState: IUnitApprovalState;
    invoicesState: IInvoicesState;
    approvalState: IApprovalState;
    renoUnitScopesData: IUnitScopeState;
    productionProject: IProject;
    agreementState: IAgreementState;
}

const sagaMiddlerware = createSagaMiddleware();

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    budgeting: budgetingReducer,
    mdm: mdmReducer,
    common: commonReducer,
    scraperService: scraperServiceReducer,
    projectDetails: projectDetailsReducer,
    projectsDemand: projectDemandReducer,
    propertyDetails: propertyDetailsReducer,
    property: propertiesServiceReducer,
    tpsm: tpsmReducer,
    fileUtility: fileUtilityReducer,
    projectOverview: overviewReducer,
    packageManager: packageManagerReducer,
    scopes: scopesReducer,
    projectFloorplans: floorplanReducer,
    rfpService: rfpServiceReducer,
    ims: imsReducer,
    rfpProjectManager: rfpProjectManager,
    biddingPortal: biddingPortalReducer,
    propertiesConsumer: propertiesConsumerReducer,
    singleProject: singleProjectReducer,
    renoUnitsData: unitReducer,
    unitApprovalState: unitApprovalsReducer,
    approvalState: approvalReducer,
    renoUnitScopesData: unitScopesReducer,
    productionProject: productionProjectReducer,
    invoicesState: invoicesReducer,
    agreementState: agreementReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: new MiddlewareArray().concat(sagaMiddlerware),
});

sagaMiddlerware.run(budgetingSagas);
sagaMiddlerware.run(mdmSaga);
sagaMiddlerware.run(scrapersSaga);
sagaMiddlerware.run(projectDetailsSagas);
sagaMiddlerware.run(tpsmSagas);
sagaMiddlerware.run(fileUtilitySagas);
sagaMiddlerware.run(overviewSagas);
sagaMiddlerware.run(packagesSaga);
sagaMiddlerware.run(scopesSagas);
sagaMiddlerware.run(floorplanSagas);
sagaMiddlerware.run(rfpSaga);
sagaMiddlerware.run(imsSaga);
sagaMiddlerware.run(rfpProjectManagerSagas);
sagaMiddlerware.run(biddingPortalSaga);
sagaMiddlerware.run(propertySagas);
sagaMiddlerware.run(projectsDemandSaga);
sagaMiddlerware.run(propertyDetailsSagas);
// sagaMiddlerware.run(overviewSagasProperties);
sagaMiddlerware.run(propertiesConsumerSaga);
sagaMiddlerware.run(singleProjectDetailsSaga);
sagaMiddlerware.run(unitsSaga);
sagaMiddlerware.run(unitApprovalsSaga);
sagaMiddlerware.run(approvalsSaga);
sagaMiddlerware.run(unitScopesSaga);
sagaMiddlerware.run(invoicesSaga);
sagaMiddlerware.run(agreementSaga);
sagaMiddlerware.run(productionProjectSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
