import { IRenovation } from "stores/projects/details/budgeting/base-scope/base-scope-models";

export interface IProject {
    latestRenovationVersion?: any;
    production_details?: any;
    production_config?: any;
    knock_flow_settings?: any;
    budgetStats?: any;
    id: string;
    name: string;
    organization_id: string;
    organization: {
        id: string;
        name: string;
    };
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    property_id: string;
    propertyId: string;
    ownershipGroupId: any;
    owner: string;
    createdAt: string;
    propertyType: string;
    projectType: string;
    startDate: string;
    endDate: string;
    approximateUnitCount: string;
    projectStatus: string;
    system_remarks: any;
    package_id: string;
    currentInventory: any;
    organisation_container_id: string;
}

export interface IPerson {
    id: string;
    name: string;
    companyName: string;
    thumbnail: string;
}

export interface ITags {
    file_size: number;
    is_archive: boolean;
    is_cover_image?: boolean;
    projectId?: string;
}
export interface IFileDetails {
    id: number;
    file_name: string;
    created_by: string;
    created_at: string;
    tags?: ITags;
    is_active: boolean;
    file_type: string;
    s3_file_path?: any;
    gdoc_sso_url?: string;
}

export interface IUploadFileDetails extends IFileDetails {
    loading: boolean;
    error: string;
    data: any;
}
export interface INavigation {
    loading: boolean;
    error: string;
    steps: any[];
    currentStep: any;
}
export interface IRooms {
    room_name: string;
    name: string;
    isSelected: boolean;
}
export interface IRenovationWizard {
    isInitial: boolean;
    inventoryList: any;
    currentInventory: any;
    renoItemList: any;
    uploadDetails: any[];
    packageList: IUploadFileDetails;
    navigation: INavigation;
    rooms: { loading: boolean; data: IRooms[] };
    questionAnswerData: {
        currentCategoryId: any;
        currentQuestionId: any;
        data: any[];
        originalResponse: any[];
        skippedCategorys: any[];
        isReachedLastQuestionOnSurvey: boolean;
        isPreviousQuestionExists: boolean;
        savingChanges: boolean;
        specOptions: { loading: boolean; data: any };
        specParameters: { loading: boolean; data: any };
    };
    questionResponses: { loadind: boolean; data: any[] };
    breadCrumbTopLevel: { data: any[] };
    breadcrumsData: any[];
}
export interface ILeveledBidSheet {
    id: number;
    file_name: string;
    created_by: string;
    created_at: string;
    tags: ITags;
    is_active: boolean;
    file_type: string;
}
export interface Contract {
    id: number;
    file_name: string;
    created_by: string;
    created_at: string;
    tags: ITags;
    is_active: boolean;
    file_type: string;
}

interface BidRequest {
    created_at: string;
    id: string;
    reno_item_version: number;
    // ... other properties
}

interface OrganizationDetail {
    organization_id: string;
    bid_status: string;
    invited_on: string | null;
    bid_versions: null;
    bid_requests: BidRequest[];
    bid_responses: any[]; // You can replace 'any' with a specific interface if needed
    // ... other properties
}
export interface IRFP {
    leveledBidSheets: ILeveledBidSheet[];
    bidStatistics: OrganizationDetail[];
    contracts: { loading: boolean; data: Contract[] };
}
export interface IProduction {
    haveAccessToProduction: boolean;
    supportEmail: "support@tailorbird.us";
}
export interface IProgressDetails {
    unitType: string;
    floorPlanType: string;
    inventory: string;
    completed: string;
    inProgress: string;
    notStarted: string;
}
export interface IApprovalAndChangeOrder {
    type: string;
    amount: string;
    submissionDate: string;
    submittedBy: string;
    approvalDate: string;
    approvalBy: string;
}
export interface IProjectAnalytics {
    renovationProgress: {
        totalUnitsInprop: number;
        totalRenoUnits: number;
        completed: any;
        inprogress: any;
        notStarted: any;
        details: any[];
    };
    renovationTime: {
        renovationTimePerUnit: string;
        averageNoOfUnitsTurnedPerMonth: string;
        renoTimeByUnit: {
            columns: string[];
            data: any[];
            avgRenoTimePerUnit: number;
        };
        monthByMonthUnitsTurned: any[];
    };
    spendAnalysis: {
        estimatedBudget: number;
        actualSpend: number;
        estimatedWavg: string;
        avgWavg: string;
        budgetApprovalsAndChangeOrders: IApprovalAndChangeOrder[];
        spendAnalysisMonthByMonth: {
            workType: any[];
            category: any[];
        };
    };
}

export interface IRenovationWizardV2 {
    projects: { loading: boolean; data: any[] };
    uploadedFiles: { loading: boolean; data: any[] };
    renovationItems: {
        loading: boolean;
        data: IRenovation[];
        addingRenoItems: boolean;
        updatingRenoItems: boolean;
    };
    loading?: boolean;
    submitted?: boolean;
    projectContainer: { loading: boolean; data: any[] };
    projectCodices: { loading: boolean; data: any[] };
    projectPackageContents: { loading: boolean; data: any; addingMaterial: boolean };
    basePackage: { loading: boolean; data: any };
    notes: string;
    currentStep: number;
}

export interface ISingleProject {
    projectDetails: IProject;
    keyPeople: IPerson[];
    renovationWizard: IRenovationWizard;
    RFP: IRFP;
    production: IProduction;
    projectAnalytics: IProjectAnalytics;
    loading?: boolean;
    updating?: boolean;
    renovationWizardV2: IRenovationWizardV2;
}
