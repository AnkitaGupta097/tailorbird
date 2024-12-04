/*
1. When any default price is change inside all floorplans, update rfp_response_item object in redux store for all floorplans
2. When any unique price is entered for a specific floorplan, update rfp_response_item object in redux store only for the ones which belongs to this floorplan
3. After 5 sec, compare rfp_response_item(originally fetch from api gateway) with copy of rfp_response_item (redux store). Find the difference and send that obj to api gateway. 
*/
export const rfp_response_item = [
    {
        id: "1",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        contractor_org_id: "ae166c6f-627a-4de1-8fb4-c1db3f203458",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "ccc99b2220444dc9bed1de68a750c44f",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 2,
        fp_name: "cnfa10a: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "2",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        contractor_org_id: "ae166c6f-627a-4de1-8fb4-c1db3f203458",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "ccc99b2220444dc9bed1de68a750c44f",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 2,
        fp_name: "cnfa10a: Partial Renovation",
        inv_name: "Partial Renovation",
        quantity: 1,
        inventory_id: "4feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Partial Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "2",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "76a3ce7c1076449d9f32667f77f204ce",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 45,
        fp_name: "cnfa10b: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "3",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "afaa7c77d18840078a237fa9b8a154ef",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfa10c: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "4",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "87603e5374714dbd9a32d9e721ba587e",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfb20e: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "5",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "88104269318346f498daabda9318cec9",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfb20f: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "6",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "ad92ce08119f461fbfc16e4391914d17",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfb20g: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "7",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "ec540da6d5234a5487d2ac9b09e9f073",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 43,
        fp_name: "cnfb20h: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "8",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "73dc9efe2bcf40d681802896c23ce5ca",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 67,
        fp_name: "cnfc30a: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "9",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "134eb364613c4cae8fd786a45e2c915f",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 42,
        fp_name: "cnfc30b: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "10",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "d3e5705f5e954b1aacafa613f129fe05",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 32,
        fp_name: "cnfc30c: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "11",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "efb9b522563b48a09053d907bac8a5a0",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 43,
        fp_name: "cnfa10d: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "12",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "410fe864a35f4947828ada8f5a0165ec",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfa10f: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "13",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "d94c96dc7911445784e7383e7dc4da1e",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 43,
        fp_name: "cnfb20a: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "14",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "281e42c9399d4539b5872f0bb023bc8b",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfa10e: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "15",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "9722d57eb1a6439caec9ca70da0bc760",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 32,
        fp_name: "cnfb20b: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "16",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "0594b9c3c0934b6a8e2a55c605016031",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 43,
        fp_name: "cnfb20c: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "17",
        reno_item_id: "40c4bba7-c198-449b-9e45-f79a90da6348",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "24bc7498630149fdbc76731eafc701a6",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 34,
        fp_name: "cnfb20d: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "36.62179487179487",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Edge Trim",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Cabinet",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 52,
        work_type: "Material",
    },
    {
        id: "18",
        reno_item_id: "aacd45b6-a878-4c20-81e6-5c9f1a48da48",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "ccc99b2220444dc9bed1de68a750c44f",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 23,
        fp_name: "cnfa10a: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "23",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Kitchen & Bath Finishes",
        subcategory: "Other Finish Work",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "MULTIPLE*",
        scope: "Replace counter top",
        item: "Edge Trim",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 53,
        work_type: "Labor",
    },
    {
        id: "19",
        reno_item_id: "5cc22966-9c34-442c-9dcd-8f7354294fed",
        date_created: "2023-03-22 12:07:46.953065",
        rfp_response_id: "a77db695-5191-4784-b89a-7dd897c97b8e",
        fp_id: "ccc99b2220444dc9bed1de68a750c44f",
        total_units: 10,
        is_unique_price: false,
        unique_price: 0,
        total_price: 0,
        price: 23,
        fp_name: "cnfa10a: Full Renovation",
        inv_name: "Full Renovation",
        quantity: 1,
        inventory_id: "3feda583135f4cf5bc23644f2b735298",
        date_captured: "2023-03-22 12:07:46.953065",
        each_price: "23",
        is_deleted: false,
        date_updated: "2023-03-22 12:07:46.953065",
        category: "Appliances",
        subcategory: "Cooktop",
        codex: "FP002",
        uom: "COUNT",
        is_alternate: false,
        description: null,
        manufacturer: null,
        model_number: null,
        location: "KITCHEN",
        scope: "Cooktop",
        item: "Cooktop",
        cost_code: null,
        group_name: null,
        sub_group_name: null,
        inventory_name: "Full Renovation",
        custom_columns: null,
        is_ve: false,
        row_id: 2,
        work_type: "Material",
    },
];

/*
Enities 

BidItems list

category, sub category, price, fp_id, inv_id

project + organization + response_id= 1

1 - 101 , kitchen, fp_id
1 - 102, kitchen, 
*/
