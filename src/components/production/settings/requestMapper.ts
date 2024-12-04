import { isEmpty } from "lodash";

const DEFAULT_PRODUCTION_CONFIG = {
    jobId: null,
    region: null,
    projectLead: null,
    projectStartDate: null,
    projectEndDate: null,
    autoInvoicing: false,
    retainageEnabled: false,
    retainagePercentage: null,
    mobilizedAmount: null,
    demobilizationPercentage: null,
    invoiceGenerationCondition: null,
    invoiceGenerationInterval: null,
    firstInvoiceDate: null,
    autoRelease: false,
    // autoApproval: false,
    notificationPreferences: [],
    notificationChannelPreferences: {},
    projectedUnitRenovationDuration: null,
};

export interface IProductionConfigFormData {
    jobId: string | null;
    region: string | null;
    projectLead: string | null;
    projectStartDate: string | null;
    projectEndDate: string | null;
    firstInvoiceDate: string | null;
    autoInvoicing: boolean;
    retainageEnabled: boolean;
    retainagePercentage: number | null;
    mobilizedAmount: any;
    demobilizationPercentage: number | null;
    invoiceGenerationCondition: string | null;
    invoiceGenerationInterval: string | null;
    autoRelease: boolean;
    // autoApproval: boolean;;
    notificationPreferences: string[];
    notificationChannelPreferences: { [key: string]: any };
    projectedUnitRenovationDuration: number | null;
}

export interface IProductionConfigPayload {
    job_id: string | null;
    region: string | null;
    project_lead: string | null;
    project_start_date: string | null;
    project_end_date: string | null;
    auto_invoicing: string | null;
    retainage_enabled: boolean;
    retainage_percentage: number | null;
    mobilized_amount: any;
    demobilization_percentage: number | null;
    invoice_generate_condition: string | null;
    invoice_frequency: string | null;
    first_invoice_date: string | null;
    auto_release: boolean;
    projected_unit_renovation_duration: number | null;
    // auto_approval: boolean;
}

export interface IKnockFlowSetting {
    id: string;
    project_id: string;
    user_id: string;
    org_id: string;
    flow_key: string;
    meta_data: any;
    subscribed: boolean;
}

type IKnockSettingUpdatePayload = {
    flow_key: string;
    meta_data: any;
    subscribed: boolean;
}[];

const getChannelMap = (notifications: IKnockFlowSetting[]) => {
    const channelMap: any = {};
    notifications.forEach((not) => {
        channelMap[not.flow_key] = not.meta_data;
    });
    return channelMap;
};

export const toProductionConfigPayload = (
    data: IProductionConfigFormData,
): IProductionConfigPayload => {
    return {
        job_id: data.jobId,
        region: data.region,
        project_lead: data.projectLead,
        project_start_date: data.projectStartDate,
        project_end_date: data.projectEndDate,
        auto_invoicing: data.autoInvoicing?.toString(),
        retainage_enabled: data.retainageEnabled,
        retainage_percentage: data.retainagePercentage,
        mobilized_amount: data.mobilizedAmount,
        demobilization_percentage: data.demobilizationPercentage,
        invoice_generate_condition: data.invoiceGenerationCondition,
        invoice_frequency: data.autoInvoicing ? data.invoiceGenerationInterval : null,
        first_invoice_date: data.autoInvoicing ? data.firstInvoiceDate : null,
        auto_release: data.autoRelease,
        projected_unit_renovation_duration: data.projectedUnitRenovationDuration,
        // auto_approval: data.autoApproval,
    };
};

export const toKnockSettingPayload = (
    knockSettings: IKnockFlowSetting[],
    notificationPreferences: string[],
    notificationChannelPreferences: any,
): IKnockSettingUpdatePayload => {
    return knockSettings?.map((setting) => ({
        flow_key: setting.flow_key,
        subscribed: notificationPreferences.includes(setting.flow_key),
        meta_data: notificationChannelPreferences[setting.flow_key],
    }));
};

export const fromProductionConfigPayload = (projectDetails: any): IProductionConfigFormData => {
    const payload: IProductionConfigPayload = projectDetails?.production_config ?? {};
    const knockFlowSettings: IKnockFlowSetting[] = projectDetails?.knock_flow_settings;

    return isEmpty(payload)
        ? DEFAULT_PRODUCTION_CONFIG
        : {
              jobId: payload.job_id,
              region: payload.region,
              projectLead: payload.project_lead,
              projectStartDate: payload.project_start_date,
              projectEndDate: payload.project_end_date,
              autoInvoicing: payload.auto_invoicing === "true" ? true : false,
              retainageEnabled: payload.retainage_enabled,
              retainagePercentage: payload.retainage_percentage,
              mobilizedAmount: payload.mobilized_amount,
              demobilizationPercentage: payload.demobilization_percentage,
              invoiceGenerationCondition: payload.invoice_generate_condition,
              invoiceGenerationInterval: payload.invoice_frequency,
              notificationPreferences:
                  knockFlowSettings
                      .filter((not: any) => not.subscribed)
                      .map((not) => not.flow_key) ?? [],
              notificationChannelPreferences: getChannelMap(knockFlowSettings),
              firstInvoiceDate: payload.first_invoice_date,
              autoRelease: payload.auto_release,
              projectedUnitRenovationDuration: payload.projected_unit_renovation_duration,
              //   autoApproval: payload.auto_approval,
          };
};
