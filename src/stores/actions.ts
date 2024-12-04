import { scraperServiceActions } from "./scraper";
import { actions as budgetingActions } from "./projects/details/budgeting";
import { actions as floorplanActions } from "./projects/details/floor-plans";
import { commonActions } from "../stores/common";
import { actions as projectDetailsActions } from "./projects/details/index";
import { packageManagerActions } from "./packages";
import { actions as tpsmActions } from "./projects/tpsm";
import { actions as fileUtilityActions } from "./projects/file-utility";
import { actions as overviewActions } from "./projects/details/overview";
import { actions as scopesActions } from "./scopes";
import { actions as rfpProjectManagerActions } from "./projects/details/rfp-manager";
import { actions as biddingPortalActions } from "./bidding-portal";
import { mdmActions } from "./mdm";
import { rfpServiceActions } from "./rfp";
import { imsActions } from "./ims";
import { actions as propertyActions } from "./projects/properties";
import { actions as propertyDetailsActions } from "./projects/properties/details/index";
import { actions as singleProjectActions } from "./single-project";
import { actions as unitActions } from "./production/units";
import { actions as unitApprovalActions } from "./production/unit-approvals";
import { actions as approvalActions } from "./production/approvals";
import { actions as unitScopesAction } from "./production/unit-scopes";
import { actions as projectActions } from "./production/project";
import { actions as invoiceActions } from "./production/invoices";
import { actions as agreementActions } from "./production/agreements";

// import { actions as propertyOverviewActions } from "./projects/properties/details/overview";
import { propertiesConsumerActions } from "./properties-consumer";
import { ProjectsDemandActions } from "./projects/demand";
const actions = {
    common: { ...commonActions },
    budgeting: { ...budgetingActions },
    scraperService: { ...scraperServiceActions },
    projectDetails: { ...projectDetailsActions },
    propertyDetails: { ...propertyDetailsActions },
    projectDemand: { ...ProjectsDemandActions },
    // propertyOverview: { ...propertyOverviewActions },
    packageManager: { ...packageManagerActions },
    tpsm: { ...tpsmActions },
    property: { ...propertyActions },
    fileUtility: { ...fileUtilityActions },
    projectOverview: { ...overviewActions },
    mdm: { ...mdmActions },
    scopes: { ...scopesActions },
    projectFloorplans: { ...floorplanActions },
    rfpService: { ...rfpServiceActions },
    imsActions: { ...imsActions },
    rfpProjectManager: { ...rfpProjectManagerActions },
    biddingPortal: { ...biddingPortalActions },
    propertiesConsumer: { ...propertiesConsumerActions },
    singleProject: { ...singleProjectActions },
    production: {
        unit: unitActions,
        project: projectActions,
        unitApproval: unitApprovalActions,
        approval: approvalActions,
        unitScopes: unitScopesAction,
        invoices: invoiceActions,
        agreements: agreementActions,
    },
};

export default actions;
