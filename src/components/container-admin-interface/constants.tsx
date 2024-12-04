import { gql } from "@apollo/client";

export const CONTAINER_CATEGORY_QUERY = gql`
    query GetCategories {
        getCategories {
            id
            category
        }
    }
`;

export const ORGANIZATION_CONTAINER_CATEGORY_QUERY = gql`
    query GetOrganisationContainerGroups($organisationContainerId: String) {
        getOrganisationContainerGroups(organisation_container_id: $organisationContainerId) {
            l1
            cost_code
            items {
                id
                item_name
                cost_code
                subcategory
                work_type
                category
                scope
                codex
                container_item_id
                item_index
            }
            merged_items {
                id
                item_name
                cost_code
                subcategory
                work_type
                category
                scope
                codex
                container_item_id
                merge_configuration {
                    labour_merge
                    scope_merge
                }
            }
            l2s {
                l2
                cost_code
                l3s {
                    l3
                    cost_code
                }
            }
        }
    }
`;
export const CONTAINER_DATA_QUERY = gql`
    query getContainerV2($allItems: Boolean, $isActive: Boolean) {
        getContainerItemsV2(all_items: $allItems, is_active: $isActive) {
            category
            id
            item_name
            uoms {
                uom
            }
            is_active
            project_support
        }
        getContainerV2(all_items: $allItems) {
            category
            component
            item_name
            scope
            work_type
            project_support
            is_active
            id
            subcategory
            cost_code
        }
    }
`;

export const SAVE_CONTAINER_ITEM = gql`
    mutation CreateContainerItemV2($input: CreateItemV2) {
        createContainerItemV2(input: $input) {
            id
        }
    }
`;

export const SAVE_CONTAINER_COMMON_ITEM = gql`
    mutation CreateContainerCommonItemV2($input: CreateCommonItemV2) {
        createContainerCommonItemV2(input: $input)
    }
`;

export const CONTAINER_COLUMNS = [
    "category",
    "component",
    "item_name",
    "uom",
    "projectSupport",
    "deleted",
];
export const PROJECT_SUPPORT = ["interior", "common_area", "exterior"];
export const SCOPES = [
    "Demo Existing",
    "Install New",
    "Add New",
    "Repair Existing",
    "Refinish Existing",
    "Remove and Store",
    "Reinstall Existing",
];

export const SCOPE_WORK_MAP = {
    "Demo Existing": "Labor",
    "Install New": "Simple Material/Labor",
    "Add New": "Simple Material/Labor",
    "Repair Existing": "Mat&Labor",
    "Refinish Existing": "Mat&Labor",
    "Remove and Store": "Labor",
    "Reinstall Existing": "Labor",
} as any;

export const UOMS = ["Count", "SQFT", "LNIN", "LNFT"];

export const SIMPLE_MATERIAL_LABOR = "Simple Material/Labor";
export const MATERIAL_LABOR_KIT = "Material/Labor with Kit";
export const CONTAINER_COMMON_CATEGORIES = ["General Conditions", "Profit & Overhead", "Tax"];

export const downloadJSON = (obj: any) => {
    const blob = new Blob([JSON.stringify(obj)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = `container_json_${new Date().getTime()}.json`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();
};
