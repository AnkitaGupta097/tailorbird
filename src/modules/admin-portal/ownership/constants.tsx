import { gql } from "@apollo/client";

const CONTAINER_CONFIGURATION_GROUP_SUBGROUP_DATA = {
    name: "",
    cost_code: "",
    is_root_selected: false,
    tree_key: "root-2",
};

const CONTAINER_CONFIGURATION_NAME_PROJECTS_DATA = {
    name: "",
    project_ids: [],
};

const WORK_TYPE_LABOR = "labor";
const WORK_TYPE_MATERIAL = "material";

const WORK_PACKAGE = [
    {
        label: "Material and Labor",
        value: "Material and Labor",
        work_type: "material/labor",
    },
    {
        label: "Material and Labor and Kit",
        value: "Material and Labor and Kit",
        work_type: "material/labor with kit",
    },
    {
        label: "Material and Labor combined",
        value: "Material and Labor combined",
        work_type: "material_and_labor",
    },
    {
        label: "Labor only",
        value: "Labor only",
        work_type: "labor",
    },
];

const SAVE_CONTAINER_ITEM = gql`
    mutation CreateContainerItemV2($input: CreateItemV2) {
        createContainerItemV2(input: $input) {
            id
            category
            category_id
            component
            item_name
            item_id
            subcategory
            work_type
            work_type_id
            scope
            scope_id
            cost_code
            codex
            created_at
            updated_at
            remarks
            is_active
            project_support
        }
    }
`;

export {
    CONTAINER_CONFIGURATION_GROUP_SUBGROUP_DATA,
    CONTAINER_CONFIGURATION_NAME_PROJECTS_DATA,
    WORK_PACKAGE,
    SAVE_CONTAINER_ITEM,
    WORK_TYPE_LABOR,
    WORK_TYPE_MATERIAL,
};
