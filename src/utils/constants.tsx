export class FeatureFlagConstants {
    static RENT_ROLL = "rentroll";
    static CONTAINER_2 = "container_2";
    static CONTAINER_ADMIN = "container_admin";
    static RFP_2_BIDDING_PORTAL = "rfp_2_bidding_portal";
    static PROPERTY_FEATURE = "property_feature";
    static PROPERTY_BACK_FILL = "property_back_fill";
    static COMBINE_LINE_ITEMS = "combine_line_items";
    static RENO_WIZARD_CONSUMER = "reno_wizard_consumer";
    static BID_LEVELING = "bid_leveling";
    static PROPERTY_MISSING_DATA_UPLOAD = "property_missing_data_upload";
    static DATA_UPLOAD_THROUGH_WHATSAPP = "data_upload_through_whatsapp";
    static SOW_EXH_A = "sow_exh_a";
    static CHAT_FUNCTIONALITY_ENABLED = "chat_functionality_enabled";
    static TB_ORG_IDS = "tb_org_id";
    static CLASS_4_BUDGET_DOWNLOAD = "class_4_budget_download";
    static ENTRATA_IMPORT_RENT_ROLL = "entrata_import_rent_roll";
    static AUTO_RELEASE_UNIT = "auto_release_unit";
    static KEY_STATS_ENABLED = "key_stats_enabled";
    static INTERIOR_DETAILED_STATS_ENABLED = "interior_detailed_stats_enabled";
    static EXTERIOR_DETAILED_STATS_ENABLED = "exterior_detailed_stats_enabled";
    static COMMON_AREA_DETAILED_STATS_ENABLED = "common_area_detailed_stats_enabled";
    static PRECISE_VALUES_IN_RFP2 = "precise_values_in_rfp2";
    static INTERIOR_KEY_STATS_ENABLED = "interior_key_stats_enabled";
    static EXTERIOR_KEY_STATS_ENABLED = "exterior_key_stats_enabled";
    static COMMON_AREA_KEY_STATS_ENABLED = "common_area_key_stats_enabled";
    static SITE_KEY_STATS_ENABLED = "site_key_stats_enabled";
    static FORGE_VIEWER_MODEL_BROWSER_ENABLED = "forge_viewer_model_browser_enabled";
    static TBP_2_DATA_ADMIN = "tbp_2_data_admin";
}

export const PATH_BY_ROLE: any = {
    asset_manager: "/properties-consumer",
    construction_operations: "/properties-consumer",
    admin: "/admin-properties/active",
};

export const NOTIFICATION_TYPE: any = {
    APPROVALS: [
        "APPROVAL_SCOPE_ITEM",
        "APPROVAL_PRICING_GROUP",
        "APPROVAL_UNIT_SCOPE",
        "APPROVAL_CONTRACTOR_UNIT",
        "APPROVAL_RENO_UNIT",
    ],
    REVIEWED: [
        "REVIEW_SCOPE_ITEM",
        "REVIEW_PRICING_GROUP",
        "REVIEW_UNIT_SCOPE",
        "REVIEW_CONTRACTOR_UNIT",
        "REVIEW_RENO_UNIT",
    ],
    UNIT: ["UPDATE_RENOVATION_UNIT", "RELEASE_UNIT", "UNSCHEDULE_RENOVATION_UNIT"],
    UNIT_SCOPE: ["UPDATE_UNIT_SCOPE"],
    INVOICE: ["GENERATE_INVOICE"],
};
export const ALLOWED_ROLES_TO_PROPERTYS = ["asset_manager", "construction_operations", "admin"];
