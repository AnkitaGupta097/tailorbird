import { gql } from "@apollo/client";
import theme from "../../styles/theme";
import { rfpProductionProjectsUrl, rfpProductionTabsUrl } from "modules/rfp-manager/helper";

const APPROVAL_STATUS_COLOR_MAP: any = {
    in_review: { variant: "outlined", textColor: "#D72C0D", borderColor: "#D72C0D" },
    rejected: { variant: "outlined", textColor: "#6A6464" },
    approved: { variant: "outlined", textColor: "#0E845C" },
};

const PRODUCTION_TABS_NAME = {
    units: "Units",
    invoices: "Invoices",
    setting: "Settings",
    agreements: "Agreements",
    approvals: "Approvals",
    unitScheduler: "Unit Scheduler",
    admin: "Admin",
};

export const productionTabUrl = (projectId: any, isRFPProject: boolean = false) => {
    const role = localStorage.getItem("role") || "";
    const userID = localStorage.getItem("user_id") || "";

    return isRFPProject
        ? rfpProductionTabsUrl(role, userID, projectId)
        : `/consumer/projects/${projectId}/production`;
};

export const productionProjectsUrl = (isRFPProject: boolean = false) => {
    const role = localStorage.getItem("role") || "";
    const userID = localStorage.getItem("user_id") || "";

    return isRFPProject ? rfpProductionProjectsUrl(role, userID) : "/consumer/projects/";
};

const PRODUCTION_TABS = [
    {
        label: PRODUCTION_TABS_NAME.unitScheduler,
        value: "/unit-scheduler",
    },
    {
        label: PRODUCTION_TABS_NAME.units,
        value: "/units",
    },
    {
        label: PRODUCTION_TABS_NAME.invoices,
        value: "/invoices",
    },
    {
        label: PRODUCTION_TABS_NAME.setting,
        value: "/settings",
    },
    {
        label: PRODUCTION_TABS_NAME.agreements,
        value: "/agreements",
    },
    {
        label: PRODUCTION_TABS_NAME.approvals,
        value: "/approvals",
    },
    {
        label: PRODUCTION_TABS_NAME.admin,
        value: "/admin",
    },
];

const PENDING_APPROVAL = "pending_approval";
const PENDING_ADDITION = "pending_addition";
const NOT_APPLICABLE = "not_applicable";
const SCOPE_COMPLETION = "scope_completion";
const IN_REVIEW = "in_review";

const UNIT_STATUSES = {
    unscheduled: "Unscheduled",
    pending_acceptance: "Pending Acceptance",
    scheduled: "Scheduled",
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
    not_renovating: "Non reno",
} as any;

const UNIT_SCOPE_STATUSES = {
    not_started: "not_started",
    in_progress: "in_progress",
    completed: "completed",
    pending_approval: "pending_approval",
    not_applicable: "not_applicable",
} as any;

export const AGREEMENT_TYPES = {
    executed: "Executed",
    live: "Live",
} as any;

export const isSelectedType = (selectedType: string[], type: string) => {
    return selectedType?.includes(type);
};

export const isSelectedCategory = (selectedCategory: any[], category: string) => {
    return selectedCategory?.some((selected: { name: string }) => selected?.name === category);
};

export const AGREEMENT_STEPS = ["Contractor", "Work Type", "Categories", "Floor Plans"];

const INVOICE_TYPE_COLOR_MAP: any = {
    draft: { label: "Draft Invoice", bgcolor: theme.background.alert, textColor: theme.text.alert },
    final: {
        label: "Final Invoice",
        bgcolor: theme.background.successDefault,
        textColor: theme.text.successDark,
    },
    downloaded: {
        label: "Final Invoice",
        bgcolor: theme.background.successDefault,
        textColor: theme.text.successDark,
    },
};

const UNIT_STATUS_COLOR_MAP: any = {
    unscheduled: { variant: "outlined", textColor: "#6A6464" },
    pending_acceptance: { variant: "filled", bgcolor: "#FFD79D", textColor: "#B86800" },
    pending_approval: { variant: "filled", bgcolor: "#FFD79D", textColor: "#B86800" },
    scheduled: { variant: "outlined", textColor: "#0E845C" },
    not_started: { variant: "filled", bgcolor: "#C9CCCF", textColor: "#6A6464" },
    in_progress: { variant: "filled", bgcolor: "#BCDFEF", textColor: "#00344D" },
    completed: { variant: "filled", bgcolor: "#AEE9D1", textColor: "#0E845C" },
};

const SCOPE_STATUS_COLOR_MAP: any = {
    pending_approval: { variant: "filled", bgcolor: "#FFD79D", textColor: "#B86800" },
    not_started: { variant: "filled", bgcolor: "#C9CCCF", textColor: "#6A6464" },
    in_progress: { variant: "filled", bgcolor: "#BCDFEF", textColor: "#00344D" },
    completed: { variant: "filled", bgcolor: "#AEE9D1", textColor: "#0E845C" },
};

const DELETE_FILE = gql`
    mutation DeleteProjectFile($input: DeleteProjectFileInput) {
        deleteProjectFile(input: $input)
    }
`;

const GET_SCOPE = gql`
    query GetUnitScope($unitScopeId: Int) {
        getUnitScope(unit_scope_id: $unitScopeId) {
            id
            is_active
            reno_unit_id
            system_remarks
            started_at
            ended_at
            last_price
            updated_at
            project_id
            created_at
            scope
            status
            start_price
            price
            scope_approval_id
            renovation_start_date
            renovation_end_date
            material_price
            labor_price
            material_and_labor_price
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
            }
            items {
                id
                category
                project_id
                floor_plan_id
                scope
                bid_item_id
                contractor_org_id
                inventory_id
                scope_approval_id
                item
                work_type
                parent_bid_item_id
                start_price
                percent_contrib_to_scope_total
                price
                total_price
                last_price
                pricing_group_id
                takeoff_value
                status
                manufacturer
                model_number
                description
                groups {
                    id
                    category
                    project_id
                    floor_plan_id
                    scope
                    bid_item_id
                    contractor_org_id
                    inventory_id
                    item
                    work_type
                    parent_bid_item_id
                    start_price
                    price
                    last_price
                    pricing_group_id
                    takeoff_value
                    status
                    uom
                    manufacturer
                    model_number
                    description
                }
                uom
            }
        }
    }
`;

const GET_SIBLING_RENO_UNITS = gql`
    query SiblingRenoUnits($pricingGroupId: Int, $unitScopeItemId: Int) {
        siblingRenoUnits(pricingGroupId: $pricingGroupId, unitScopeItemId: $unitScopeItemId) {
            unitId
            id
            unitName
        }
    }
`;

const GET_CONTRACTOR_SCOPES_STATUS = gql`
    query GetContractorScopeStatus($contractorOrgId: String!, $projectId: String!) {
        getContractorScopeStatus(contractorOrgId: $contractorOrgId, projectId: $projectId) {
            completed
        }
    }
`;

const DOWNLOAD_MOBILIZATION_INVOICE = gql`
    query DownloadMobilizationInvoice($invoiceId: Int!) {
        downloadMobilizationInvoice(invoiceId: $invoiceId) {
            fileName
            downloadLink
            id
        }
    }
`;

const GET_CONTRACTORS_ON_PRODUCTION = gql`
    query GetContractorsOnProduction($projectId: String!) {
        getContractorsOnProduction(projectId: $projectId) {
            id
            name
        }
    }
`;

const GENERATE_RETAINAGE_INVOICE = gql`
    mutation GenerateRetainageInvoice($contractorOrgId: String!, $projectId: String!) {
        generateRetainageInvoice(contractorOrgId: $contractorOrgId, projectId: $projectId) {
            id
            downloadLink
            fileName
        }
    }
`;

const GENERATE_MOBILIZATION_INVOICE = gql`
    mutation GenerateMobilizationInvoice(
        $contractorOrgId: String!
        $projectId: String!
        $mobilizedAmount: Float!
    ) {
        generateMobilizationInvoice(
            contractorOrgId: $contractorOrgId
            projectId: $projectId
            mobilizedAmount: $mobilizedAmount
        ) {
            id
            downloadLink
            fileName
        }
    }
`;

const GET_PROJECT_FILE = gql`
    query GetProjectFile($fileId: Int) {
        getProjectFile(file_id: $fileId) {
            id
            project_id
            file_name
            bucket_name
            is_uploaded
            is_active
            file_type
            created_at
            uploaded_at
            updated_at
            created_by
            deleted_by
            signed_url
            download_link
            cdn_path
            tags
            system_remarks
        }
    }
`;

const DOWNLOAD_INVOICE = gql`
    mutation DownloadInvoice($invoiceId: Int) {
        downloadInvoice(invoice_id: $invoiceId) {
            id
            project_id
            file_name
            bucket_name
            s3_file_path
            s3_version_id
            is_uploaded
            is_active
            file_type
            created_at
            uploaded_at
            updated_at
            created_by
            deleted_by
            signed_url
            download_link
            cdn_path
            tags
            system_remarks
        }
    }
`;

const GET_LIVE_AGREEMENTS = gql`
    query GetLiveAgreementData($projectId: String) {
        getLiveAgreementData(project_id: $projectId) {
            scope_names
            floor_plans {
                fp_name
                scopes {
                    scope_name
                    price
                }
                units {
                    unit_name
                    scopes {
                        scope_name
                        price
                    }
                }
            }
        }
    }
`;

const GET_FILTERED_RENO_UNITS = gql`
    query GetFilteredRenovationUnits($projectId: String, $renoUnitFilters: [RenoUnitFiltersInput]) {
        getFilteredRenovationUnits(project_id: $projectId, reno_unit_filters: $renoUnitFilters) {
            is_active
            id
            unit_id
            release_date
            move_in_date
            move_out_date
            make_ready_date
            renovation_start_date
            renovation_end_date
            general_contractor
            project_id
            created_at
            updated_at
            scheduled_date
            status
            unit_name
            unit_type
            floor_plan_id
            floor_plan_name
            area
            approval_count
            scope_approval_id
            subs {
                id
                name
                street_name
                city
                state
                ownership_url
                zip_code
                google_workspace_email
                created_by
                contact_number
                organization_type
                primary_tb_contact
                org_category
            }
        }
    }
`;
const SUBSCRIBE_ORG_UPDATE = {
    query: `subscription Subscription($organizationId: String) {
        SubscribeToOrgUpdates(organization_id: $organizationId)
    }`,
};

const FEATURE_FLAGS = {
    RAISE_CHANGE_ORDER: "raise_change_orders",
    CANCEL_CHANGE_ORDER: "cancel_change_orders",
    REVIEW_CHANGE_ORDER: "review_change_orders",
    START_RENOVATION: "start_renovation",
    DOWNLOAD_INVOICE: "download_invoice",
    GENERATE_INVOICE: "generate_invoice",
    EDIT_UNIT_RELEASE_INFO: "edit_unit_release_info",
    EDIT_UNIT_SCOPE_ITEM_QTY: "edit_unit_scope_item_qty",
    ADD_NEW_LINE_ITEM: "add_new_line_item",
    AUTO_RELEASE_UNIT: "auto_release_unit",
    EDIT_PROJECT_SETTINGS: "edit_project_settings",
    EDIT_NOTIFICATION_PREFERENCES: "edit_notification_preferences",
    ACTIVATE_DEACTIVATE_LINE_ITEMS: "activate_deactivate_line_item",
    UPLOAD_INVOICE_SUPPORTING_DOCUMENTS: "upload_invoice_supporting_documents",
    EDIT_INVOICE_TITLE: "edit_invoice_title",
    FORWARD_INVOICE_TO_PMS: "forward_invoice_to_pms",
    ADMIN_VIEW: "admin_view",
};
const FORWARD_INVOICE_TO_PMS = gql`
    mutation ForwardInvoiceToPms($invoiceId: Int!) {
        forwardInvoiceToPms(invoiceId: $invoiceId) {
            invoiceId
            postedStatus
        }
    }
`;

const GET_INVOICE = gql`
    query GetInvoice($invoiceId: Int!) {
        getInvoice(invoiceId: $invoiceId) {
            createdAt
            updatedAt
            isActive
            projectId
            contractorId
            invoiceAmount
            projectFileId
            systemGenerated
            userSetInvoiceId
            supportingDocIds
            isForwardedToPms
        }
    }
`;

const GET_ADMIN_DATA_VIEW = gql`
    query GetAdminDataView($projectId: String!) {
        getAdminDataView(projectId: $projectId) {
            category
            rowIndex
            item
            workType
            description
            manufacturer
            modelNumber
            scope
            customerCategory
            customerCostCode
            aggregatedData {
                floorPlanName
                priceList
                takeoffValueList
                unitScopeItemIdList
                unitScopeItemStatusList
            }
            unitScopeItemIdList
            contractorOrgId
        }
    }
`;

const EDIT_PRODUCTION_DATA = gql`
    mutation Mutation(
        $column: String!
        $data: String!
        $operation: String!
        $unitScopeItemIds: [Int!]!
    ) {
        editProductionData(
            column: $column
            data: $data
            operation: $operation
            unitScopeItemIds: $unitScopeItemIds
        )
    }
`;

const GET_UNIT_SCOPE_NAMES = gql`
    query getUnitScopeNames($projectId: String!) {
        getUnitScopeNames(projectId: $projectId)
    }
`;

const GET_ALL_CONTRACTORS = gql`
    query GetAllOrganizations {
        getAllOrganizations(organization_type: Contractor) {
            id
            name
        }
    }
`;

export const GET_UNIT_LEVEL_PRICES_TAKEOFF_STATUS = gql`
    query GetUnitLevelPriceScopeStatus($unitScopeItemIds: [Int!]!) {
        getUnitLevelPriceScopeStatus(unitScopeItemIds: $unitScopeItemIds) {
            totalPrice
            takeoffValue
            status
            unitName
            unitScopeItemId
            renoUnitId
        }
    }
`;

export const UPDATE_UNIT_LEVEL_PRICES_TAKEOFF_STATUS = gql`
    mutation UpdateUnitLevelPriceTakeoffStatus(
        $payload: [ProductionUnitLevelPriceTakeoffStatusInput!]!
    ) {
        updateUnitLevelPriceTakeoffStatus(payload: $payload)
    }
`;

export const INIT_PRODUCTION_FROM_RFP_1 = gql`
    mutation InitProductionFromRfp1($importFromRfpInput: ImportRFPInput!) {
        initProductionFromRfp1(importFromRfpInput: $importFromRfpInput)
    }
`;

export const GET_CONTRACTOR_UNIT_SCOPE_ADMIN_VIEW_DATA = gql`
    query getContractorUnitScopeAdminDataView($projectId: String!) {
        getContractorUnitScopeAdminDataView(projectId: $projectId) {
            unitName
            unitId
            scope
            contractorUnitScopeId
            renovationStartDate
            renovationEndDate
            contractorOrgId
            status
        }
    }
`;

export const UPDATE_CONTRACTOR_UNIT_SCOPE_ADMIN_DATA = gql`
    mutation UpdateContractorScopeDataAdmin(
        $column: String!
        $value: String!
        $contractorUnitScopeId: [Int!]!
    ) {
        updateContractorScopeDataAdmin(
            column: $column
            value: $value
            contractorUnitScopeId: $contractorUnitScopeId
        )
    }
`;

export {
    UNIT_STATUSES,
    PRODUCTION_TABS,
    PENDING_APPROVAL,
    PENDING_ADDITION,
    NOT_APPLICABLE,
    GET_SCOPE,
    GET_SIBLING_RENO_UNITS,
    GENERATE_RETAINAGE_INVOICE,
    GENERATE_MOBILIZATION_INVOICE,
    GET_CONTRACTOR_SCOPES_STATUS,
    GET_CONTRACTORS_ON_PRODUCTION,
    DOWNLOAD_MOBILIZATION_INVOICE,
    INVOICE_TYPE_COLOR_MAP,
    UNIT_STATUS_COLOR_MAP,
    SCOPE_STATUS_COLOR_MAP,
    PRODUCTION_TABS_NAME,
    APPROVAL_STATUS_COLOR_MAP,
    GET_PROJECT_FILE,
    DELETE_FILE,
    FEATURE_FLAGS,
    DOWNLOAD_INVOICE,
    GET_LIVE_AGREEMENTS,
    SUBSCRIBE_ORG_UPDATE,
    UNIT_SCOPE_STATUSES,
    GET_FILTERED_RENO_UNITS,
    SCOPE_COMPLETION,
    IN_REVIEW,
    FORWARD_INVOICE_TO_PMS,
    GET_INVOICE,
    GET_ADMIN_DATA_VIEW,
    EDIT_PRODUCTION_DATA,
    GET_UNIT_SCOPE_NAMES,
    GET_ALL_CONTRACTORS,
};
