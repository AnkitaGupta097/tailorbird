import { sortGroupedBidItems } from "../common/sortGroupedBidItems";
import { logo } from "./logobase64";
import moment from "moment";

self.addEventListener("message", async (event: MessageEvent) => {
    const data: any = event.data;
    if (data.action === "generate_excel") {
        const buffer = await exportToExcel(data.payload);
        let respons: any = {
            status: null,
            message: null,
            payload: buffer,
        };
        if (buffer?.status == "failed") {
            respons.status = "failed";
            respons.message = "Export to excel failed";
        }
        self.postMessage(respons);
    }
});

export async function exportToExcel({
    groupedBidItems: data,
    GCName,
    projectName,
    propertyAddress,
    projectType,
    exportType,
    filteredProjectCost,
    categories,
}: {
    groupedBidItems: Array<any>;
    GCName: string;
    projectName: string;
    propertyAddress: string;
    projectType: string;
    exportType: string;
    filteredProjectCost: any;
    categories: any;
}) {
    data.sort(sortGroupedBidItems);
    //Workbook Name
    let now_date = new Date();
    let time_stamp = moment(now_date).format("MM_DD_YYYY hh;mm;ss"); // Windows:- A filename cannot contain any of the following characters: \ / : * ? " < > |
    let wb_name =
        data.length > 1
            ? `Exh C-[${projectName}]-${time_stamp}.xlsx`
            : `Exh C-[${projectName}-${data[0]?.fp_name}]-${time_stamp}.xlsx`;
    //@ts-ignore
    const { Workbook } = await import("exceljs/dist/exceljs.bare");
    const wb = new Workbook();
    const ws = wb.addWorksheet("Bid", {
        views: [{ showGridLines: false, state: "frozen", xSplit: 2, ySplit: 6 }],
    });
    try {
        const is_ca_ue_project = projectType?.toLowerCase() !== "interior" ? true : false;
        let bid_v = "Tailorbird Bid V: 11.1";
        ws.addRows([[""], ["", bid_v], ["", `Property Name: ${projectName}`]]);
        ws.getRow(1).height = 25;
        const imageSrc = logo;
        let tbLogo = wb.addImage({ base64: imageSrc, extension: "png" });

        ws.addImage(tbLogo, {
            tl: { col: 0, row: 0.1 },
            ext: { width: 217, height: 25 },
        });

        ws.getCell("B2").value = {
            richText: [{ text: "Tailorbird Bid V: ", font: { bold: true } }, { text: "11.1" }],
        };
        ws.getCell("B3").value = {
            richText: [{ text: "Property Name: ", font: { bold: true } }, { text: projectName }],
        };
        //create floorplan row array to be concat  sample: [FP1,UnitReno1,""........];
        let floorplan_array: any[] = [];
        let sqft_bed_bath: any[] = [];
        let qty_price_head: any[] = [];
        let unique_items_array: any[] = [];
        let unique_item_id_array: any[] = [];
        let unique_fp_inventory_array: any[] = [];
        let all_items_array: any[] = [];
        let all_items_id: any[] = [];
        let all_fp_inventory_array: any[] = [];
        let isAllFpExport = false;
        let tax_items_id: any[] = [];
        let allFpCategorySequence: any[] = data[0]?.categories?.map((cat: { category: any }) => {
            return cat?.category;
        });
        data.forEach((fp) => {
            //consider All FP
            const All_FP = fp?.fp_name == "All Floor Plans" && data.length > 1 ? false : true;
            if (All_FP) {
                let { inventory_name, sub_group_name, fp_name, fp_commercial_name } = fp;
                let fp_inventory;

                if (fp?.fp_name === "All Floor Plans") {
                    isAllFpExport = true;
                    fp_inventory = `${fp_commercial_name ?? fp_name}`;
                    floorplan_array.push(fp_inventory, 1);
                    qty_price_head.push("Quantity", "Price");
                } else {
                    fp_inventory = `${
                        fp_commercial_name ?? fp_name
                    }: ${inventory_name}: ${sub_group_name}`;
                    floorplan_array.push(fp_inventory, fp.total_units);
                    qty_price_head.push("Quantity", "Price");
                }
                let categories = fp.categories;
                let { fp_area, baths_count, beds_count } = categories[0]?.items[0] || {};
                let bed_bath_counts =
                    beds_count && baths_count ? `${beds_count}x${baths_count}` : "";
                sqft_bed_bath.push(fp_area, bed_bath_counts);
                for (let i = 0; i < categories.length; i++) {
                    let items = categories[i].items.slice().sort((a: any, b: any) => {
                        let current_cat =
                            a?.l3_name && a?.l3_name !== ""
                                ? `${a?.l1_name} ${a?.l2_name} ${a?.l3_name}`
                                : a?.l2_name && a?.l2_name !== ""
                                ? `${a?.l1_name} ${a?.l2_name}`
                                : `${a?.l1_name}`;

                        let next_cat =
                            b?.l3_name && b?.l3_name !== ""
                                ? `${b?.l1_name} ${b?.l2_name} ${b?.l3_name}`
                                : b?.l2_name && b?.l2_name !== ""
                                ? `${b?.l1_name} ${b?.l2_name}`
                                : `${b?.l1_name}`;
                        return current_cat > next_cat ? 1 : current_cat < next_cat ? -1 : 0;
                    });
                    let catidx = allFpCategorySequence.indexOf(categories[i]?.category);
                    let allFpCatData = data[0]?.categories[catidx]?.items;
                    //update for combined items in AllFp
                    for (let j = 0; j < allFpCatData.length; j++) {
                        let itemAllFp = allFpCatData[j];
                        if (itemAllFp.isParentCategory) {
                            continue;
                        }
                        const isCombineItem = itemAllFp?.type === "COMBINED";
                        if (isCombineItem) {
                            const childItems = itemAllFp?.children;
                            if (childItems?.length > 0) {
                                const mappedChildItem = childItems
                                    .sort((child1: any, child2: any) =>
                                        child1?.reno_item_id
                                            ?.toLowerCase()
                                            ?.localeCompare(child2?.reno_item_id?.toLowerCase()),
                                    )
                                    .map((child: any) => ({
                                        ...child,
                                        cid: `combined${j}`,
                                        subcategory: `${child?.subcategory} - (${itemAllFp?.combo_name})`,
                                    }));

                                for (let id = 0, n = mappedChildItem?.length; id < n; id++) {
                                    allFpCatData.splice(j + 1, 0, mappedChildItem[id]);
                                }
                            }
                        }
                    }
                    let allFpItemsObj: any = {};
                    allFpCatData.forEach(
                        (item: {
                            reno_item_id: string;
                            pc_item_id: string;
                            cid: string;
                            unique_price: number;
                            default_price: number;
                            total_price: number;
                            quantity: number;
                        }) => {
                            const price: number | "Combined" = item?.cid
                                ? "Combined"
                                : item?.unique_price > 0
                                ? item?.unique_price
                                : item?.default_price > 0
                                ? item?.default_price
                                : item?.total_price / item?.quantity;
                            [allFpItemsObj[item?.reno_item_id], allFpItemsObj[item?.pc_item_id]] = [
                                price,
                                price,
                            ];
                        },
                    );

                    //Data processing for each fp
                    for (let j = 0; j < items.length; j++) {
                        let item = items[j];
                        if (item.isParentCategory) {
                            continue;
                        }
                        const isCombineItem = item?.type === "COMBINED";
                        if (isCombineItem) {
                            items[j].subcategory = `🔃 Combined - ${items[j]?.combo_name}`;
                            const childItems = item?.children;
                            if (childItems?.length > 0) {
                                const mappedChildItem = childItems
                                    .sort((child1: any, child2: any) =>
                                        child1?.reno_item_id
                                            ?.toLowerCase()
                                            ?.localeCompare(child2?.reno_item_id?.toLowerCase()),
                                    )
                                    .map((child: any) => ({
                                        ...child,
                                        cid: `combined${j}`,
                                        subcategory: `${child?.subcategory} - (${item?.combo_name})`,
                                    }));

                                for (let id = 0, n = mappedChildItem?.length; id < n; id++) {
                                    items.splice(j + 1, 0, mappedChildItem[id]);
                                }
                            }
                        }
                        //check ALT
                        let cat = item?.is_alternate
                            ? "Alternates"
                            : item?.l3_name && item?.l3_name !== ""
                            ? `${item?.l1_name} > ${item?.l2_name} > ${item?.l3_name}`
                            : item?.l2_name && item?.l2_name !== ""
                            ? `${item?.l1_name} > ${item?.l2_name}`
                            : item?.l1_name && item?.l1_name !== ""
                            ? item?.l1_name
                            : item.category;
                        let Scope_details = `${
                            isCombineItem
                                ? item?.subcategory
                                : item?.scope === item?.subcategory
                                ? item?.scope
                                : item?.subcategory?.includes(item?.scope)
                                ? item?.subcategory
                                : `${item?.scope} - ${item?.subcategory}`
                        }${
                            fp?.fp_name === "All Floor Plans"
                                ? item?.inventory_name
                                    ? `-${item?.inventory_name}`
                                    : ""
                                : ""
                        }`;

                        let uomPrice =
                            allFpItemsObj[item?.reno_item_id] ?? allFpItemsObj[item?.pc_item_id];
                        let item_array = [
                            item?.reno_item_id,
                            cat,
                            item?.cid ? `  ➡️ ${Scope_details}` : Scope_details,
                            item.work_type,
                            item.description,
                            item?.manufacturer,
                            item?.model_no,
                            item.location,
                            item.specific_uom ?? item.uom,
                            1,
                            uomPrice,
                            "",
                            "",
                            "",
                            "",
                        ];
                        //pop last two items form item_array if CA/UI project
                        if (is_ca_ue_project) {
                            item_array.splice(item_array.length - 3, 2);
                        }

                        if (
                            unique_item_id_array.indexOf(item.reno_item_id) == -1 &&
                            !item?.is_alternate
                        ) {
                            unique_items_array.push(item_array);
                            unique_item_id_array.push(item.reno_item_id);
                        } else if (
                            unique_item_id_array.indexOf(item.reno_item_id + cat) == -1 &&
                            item?.is_alternate
                        ) {
                            unique_items_array.push(item_array);
                            unique_item_id_array.push(item.reno_item_id + cat);
                        }

                        if (item?.is_alternate) {
                            all_items_id.push(item.reno_item_id + cat);
                        } else {
                            all_items_id.push(item.reno_item_id);
                        }
                        all_items_array.push(item);
                        all_fp_inventory_array.push(fp_inventory);
                        3;

                        //push tax items to array
                        if (
                            cat?.toLowerCase() == "tax" &&
                            !tax_items_id.includes(item.reno_item_id)
                        ) {
                            tax_items_id.push(item.reno_item_id);
                        }
                    }
                }
                unique_fp_inventory_array.push(fp_inventory);
            }
        });
        //Map Floorplan qty and price
        for (let k = 0; k < unique_fp_inventory_array.length; k++) {
            let fp_inv = unique_fp_inventory_array[k];
            for (let l = 0; l < unique_item_id_array.length; l++) {
                let item_id = unique_item_id_array[l];
                let index_item_id = all_items_id.indexOf(item_id);
                let item_found_in_fp = false;
                while (index_item_id != -1) {
                    if (all_fp_inventory_array[index_item_id] == fp_inv) {
                        let item_obj = all_items_array[index_item_id];
                        let combined = item_obj.cid ? "Combined" : "";

                        unique_items_array[l].push(
                            item_obj?.specific_quantity ?? item_obj?.quantity,
                            combined,
                        );
                        item_found_in_fp = true;
                    }
                    index_item_id = all_items_id.indexOf(item_id, index_item_id + 1);
                }
                if (!item_found_in_fp) {
                    unique_items_array[l].push(0, "");
                }
            }
        }
        //create row #4 floorplan row
        let fp_row_fixed_value = [
            "",
            `Property Address: ${propertyAddress}`,
            null,
            "",
            "",
            "",
            "",
            "",
            "Each",
            "",
            "Aggregate",
            "",
            "WAVG FP",
            "",
        ];
        let aggregate_row_fixed = [
            "",
            `General Contractor: ${GCName}`,
            "",
            "",
            "",
            "",
            "",
            "",
            "Per Each UoM Quantity",
            null,
            "Total Aggregate for All Reno Units",
            null,
            "WAVG SQFT",
            null,
        ];
        let main_header_row = [
            "item_id",
            "Cat.",
            "Work Type",
            "Description",
            "Manufacturer",
            "Model #",
            "Location",
            "UOM",
            "Quantity",
            "Price",
            "Quantity",
            "Price",
            "Quantity",
            "Price",
        ];
        //Check project type and remove WAVG col if project is CA/UE
        if (is_ca_ue_project) {
            fp_row_fixed_value.splice(fp_row_fixed_value.length - 3, 2);
            aggregate_row_fixed.splice(aggregate_row_fixed.length - 3, 2);
            main_header_row.splice(main_header_row.length - 3, 2);
        }
        let fp_header_row = fp_row_fixed_value.concat(floorplan_array);
        let aggregate_row = aggregate_row_fixed.concat(sqft_bed_bath);
        let main_header_join = main_header_row.concat(qty_price_head);
        ws.addRows([fp_header_row, aggregate_row, main_header_join]);

        //make subtotal and total row array
        let subtotal_row: any = [];
        let last_total_row: any = [];
        main_header_join.forEach((el, indx) => {
            if (indx == 1) {
                subtotal_row.push("Subtotal");
            } else if (el == "Quantity") {
                subtotal_row.push("Subtotal");
                last_total_row.push("Total");
            } else {
                subtotal_row.push(null);
                last_total_row.push(null);
            }
        });
        let cat_item_obj: any = {};
        unique_items_array.forEach((row) => {
            if (!cat_item_obj[row[1]]) {
                let category = row.splice(1, 1);
                cat_item_obj[category] = [row];
            } else {
                let category = row.splice(1, 1);
                cat_item_obj[category].push(row);
            }
        });
        let subtotal_index_array: any[] = [];
        let NextSubtotal_index: number = 0;
        let bid_items_formated: any[] = [];
        let cat_order = categories ?? [];
        let found_cat = [];
        for (let key in cat_item_obj) {
            let is_cat_matches = false;
            for (let cat of cat_order) {
                is_cat_matches = key.includes(cat) ? true : is_cat_matches;
            }
            if (is_cat_matches) {
                found_cat.push(key);
            } else if (!is_cat_matches) {
                cat_item_obj[key].push(subtotal_row);
                cat_item_obj[key].splice(0, 0, ["", key]);
                bid_items_formated = [...bid_items_formated, ...cat_item_obj[key]];

                NextSubtotal_index = NextSubtotal_index + cat_item_obj[key].length;
                subtotal_index_array.push(NextSubtotal_index);
            }
        }
        for (let cat of cat_order) {
            for (let key of found_cat) {
                if (key == cat) {
                    cat_item_obj[key].push(subtotal_row);
                    cat_item_obj[key].splice(0, 0, ["", key]);
                    bid_items_formated = [...bid_items_formated, ...cat_item_obj[key]];

                    NextSubtotal_index = NextSubtotal_index + cat_item_obj[key].length;
                    subtotal_index_array.push(NextSubtotal_index);
                }
            }
        }
        bid_items_formated.push(last_total_row);
        ws.addRows(bid_items_formated);
        //rich text
        ws.getCell("B4").value = {
            richText: [
                { text: "Property Address: ", font: { bold: true } },
                { text: propertyAddress },
            ],
        };
        ws.getCell("B5").value = {
            richText: [{ text: "General Contractor: ", font: { bold: true } }, { text: GCName }],
        };

        //Setting Col width
        let col_with_obj: any = {
            "Cat.": 40,
            "Work Type": 13,
            Description: 44,
            Manufacturer: 17,
            "Model#": 17,
            Location: 14,
            UOM: 9,
            Quantity: 21,
            Price: 21,
        };
        for (let q = 1; q <= main_header_join.length; q++) {
            let header_name = main_header_join[q - 1];
            let col = ws.getColumn(q);
            col_with_obj.Quantity =
                header_name == "Quantity" && q > 14
                    ? col.values
                          .map((v: any) => v.toString().length)
                          .reduce((maxValue: number, currentValue: number) => {
                              return Math.max(maxValue, currentValue);
                          }, 0) + 10
                    : col_with_obj?.Quantity;

            col.width = col_with_obj[header_name as keyof typeof col_with_obj];
        }

        // setting up formula
        let fp_price_cols_letters: any[] = [];
        let aggregate_formula_array: any[] = [];
        let all_price_col_letter: any = [];
        let price_col = main_header_join.indexOf("Price") + 1;
        let last_row = ws.lastRow._number;
        let last_col = ws.lastColumn._number;
        let fp_qty_cols_letters: any = [];
        let price_start_col = is_ca_ue_project ? 14 : 16;
        while (price_col > 0) {
            let price_col_letter = columnToLetter(price_col);
            let qty_col_letter = columnToLetter(price_col - 1);
            all_price_col_letter.push(price_col_letter);
            if (price_col < price_start_col) {
                price_col = main_header_join.indexOf("Price", price_col) + 1;
                continue;
            }
            fp_price_cols_letters.push(price_col_letter);
            aggregate_formula_array.push(`IFERROR($${qty_col_letter}8*$${price_col_letter}$4,0)`);
            //FP price column formula
            fp_qty_cols_letters.push(qty_col_letter);
            price_col = main_header_join.indexOf("Price", price_col) + 1;
        }
        let total_reno_unit_formula = `SUM(${fp_price_cols_letters.join("4,")}4)`;
        if (!is_ca_ue_project) {
            ws.getCell("N4").value = {
                formula: isAllFpExport ? data[0].total_units : total_reno_unit_formula,
            };
        }
        for (let r = 8; r < last_row; r++) {
            let aggreagate_qty_formula = `=IFERROR(SUM(${aggregate_formula_array
                .join(",")
                .replaceAll("8", r.toString())}),0)`;
            let aggreagate_price_formula = `=if(J${r}="Combined","Combined",IFERROR($K${r}*J${r},0))`;

            //fill formulas for aggregate and WAVG
            ws.getCell(`K${r}`).value = { formula: aggreagate_qty_formula };
            ws.getCell(`L${r}`).value = { formula: aggreagate_price_formula };
            if (!is_ca_ue_project) {
                let WAVG_qty_formula = `=IFERROR(SUM(${aggregate_formula_array
                    .join(",")
                    .replaceAll("8", r.toString())})/$N$4,0)`;
                let wavg_price_formula = `=if(J${r}="Combined","Combined",IFERROR($M${r}*J${r},0))`;

                ws.getCell(`M${r}`).value = { formula: WAVG_qty_formula };
                ws.getCell(`N${r}`).value = { formula: wavg_price_formula };
            }
            //set formulas on Floorplan prices
            let fpCol: number = 16;
            while (fpCol <= last_col) {
                let qtyColLetter = columnToLetter(fpCol - 1);
                let fpColLetter = columnToLetter(fpCol);
                let fpColFormula = `=IFERROR(if(J${r}="Combined","Combined",J${r}*${qtyColLetter}${r}),0)`;
                ws.getCell(`${fpColLetter}${r}`).value = { formula: fpColFormula };
                fpCol += 2;
            }
        }

        const tax_percent_item: any = {};
        data[0]?.categories.forEach((cat_array: any) => {
            if (
                cat_array?.category?.toLowerCase() === "tax" ||
                cat_array?.category?.toLowerCase() === "profit & overhead" ||
                cat_array?.category?.toLowerCase() === "general conditions"
            ) {
                cat_array?.items.map((item: any) => {
                    if (item?.specific_uom?.toLowerCase() === "percentage") {
                        const split_array = item?.reno_item_id.split("#");
                        split_array.map((id: any) => {
                            tax_percent_item[id] = item?.default_price
                                ? item?.default_price
                                : item?.unique_price
                                ? item?.unique_price
                                : item?.total_price;
                        });
                    }
                });
            }
        });
        let last_category_row: any;
        fp_price_cols_letters.splice(0, 0, "L", "N");
        let work_type: string | null;
        bid_items_formated.forEach((row, i) => {
            work_type =
                !row[2] && row[1]?.toLowerCase() == "profit & overhead"
                    ? "po"
                    : !row[2] && row[1]?.toLowerCase() == "general conditions"
                    ? "gc"
                    : !row[2] && row[1]?.toLowerCase() == "tax"
                    ? "tx"
                    : !row[2]
                    ? null
                    : work_type;
            // let work_type = row[2]?.toLowerCase();
            let scope = row[1]?.toLowerCase();
            last_category_row =
                !last_category_row && work_type === "po" ? i + 6 : last_category_row;

            if (
                row[7]?.toLowerCase() == "percentage" &&
                (work_type === "po" || work_type === "gc" || work_type === "tx")
            ) {
                let tax_uom_cell = ws.getRow(i + 7).getCell(10);
                tax_uom_cell.value = tax_percent_item[row[0]];
                let array_aggregate_formula: any[] = [];

                fp_price_cols_letters.map((col: any) => {
                    let fp_price_cell = ws.getCell(`${col}${i + 7}`);
                    if (exportType === "full") {
                        let material_or_labor = scope.includes("tax on labor")
                            ? "*Labor*"
                            : "Material";
                        let formula_GC_PO_TX =
                            work_type == "po" || work_type == "gc"
                                ? `=SUMIF($B$7:$B$${last_category_row},"<>Subtotal",$${col}7:$${col}${last_category_row})*($J$${
                                      i + 7
                                  }/100)`
                                : `=SUMIF($C$7:$C$${last_category_row},"${material_or_labor}",${col}7:${col}${last_category_row})*($J$${
                                      i + 7
                                  }/100)`;
                        fp_price_cell.value = { formula: formula_GC_PO_TX };
                    } else if (col != "L" && col != "N") {
                        let filteredProjectData =
                            filteredProjectCost[
                                `${data[0]?.fp_name}${data[0]?.inventory_name}${data[0]?.sub_group_name}`
                            ];

                        let ApplliedCost = scope.includes("tax on labor")
                            ? filteredProjectData.laborCost
                            : scope.includes("tax on material")
                            ? filteredProjectData.materialCost
                            : filteredProjectData.categorySum;

                        let fpValue = ApplliedCost * (tax_percent_item[row[0]] / 100);
                        fp_price_cell.value = fpValue;
                        array_aggregate_formula.push(`IFERROR($${col}${i + 7}*$${col}$4,0)`);
                    }
                });
                //Aggregate and WAVG price for percent
                if (exportType !== "full") {
                    fp_price_cols_letters.splice(0, 2);
                    let aggregate_price_formula = `=IFERROR(SUM(${array_aggregate_formula.join(
                        ",",
                    )}),0)`;
                    let WAVG_price_formula = `${aggregate_price_formula}/$N$4`;
                    ws.getCell(`L${i + 7}`).value = { formula: aggregate_price_formula };
                    ws.getCell(`N${i + 7}`).value = { formula: WAVG_price_formula };
                }
            }
        });

        //fill color in header rows and format font
        let head_start_row = 4;
        let total_rows = bid_items_formated.length + 6;
        for (let n = head_start_row; n <= total_rows; n++) {
            for (let m = 1; m <= bid_items_formated[1].length; m++) {
                let col_letter = columnToLetter(m);
                let fp_start_col = is_ca_ue_project ? 13 : 15;
                let bgType = "pattern";
                let bgPattern = "solid";
                let bgColor = { argb: "ffffffff" }; //default

                //variable for text format
                let font_name = "IBM Plex Mono";
                let font_family = 3;
                let font_size = 10;
                let font_color = { argb: "ff000000" };
                let font_bold = false;
                let fornt_underline = false;
                let cell_address = `${col_letter}${head_start_row}`;
                if (head_start_row < 6) {
                    if (m > 8 && m < 11) {
                        bgColor = { argb: "ff004d71" };
                        font_color = { argb: "ffffffff" };
                        font_bold = true;
                        font_size = 11;
                    } else if (m > 10 && m < 13) {
                        bgColor = { argb: "ff001e61" };
                        font_color = { argb: "ffffffff" };
                        font_bold = true;
                        font_size = 11;
                    } else if (m > 12 && m < 15 && fp_start_col == 15) {
                        bgColor = { argb: "ff410099" };
                        font_color = { argb: "ffffffff" };
                        font_bold = true;
                        font_size = 11;
                    } else if (m >= fp_start_col && head_start_row == 4) {
                        bgColor = { argb: "ff57b6b2" };
                        font_bold = true;
                        font_size = 11;
                    } else if (m >= fp_start_col && head_start_row == 5) {
                        font_bold = true;
                        font_size = 11;
                    }
                } else if (head_start_row == 6) {
                    bgColor = { argb: "ff000000" };
                    font_color = { argb: "ffffffff" };
                    font_bold = true;
                    font_size = 11;
                } else if (bid_items_formated[n - 7][1] == "Subtotal") {
                    bgColor = { argb: "ff5f5f5f" };
                    font_color = { argb: "ffffffff" };
                    font_bold = true;
                    font_size = 11;
                } else if (n == total_rows) {
                    font_bold = true;
                    fornt_underline = true;
                } else if (n == 7 || subtotal_index_array.indexOf(n - 7) != -1) {
                    bgColor = { argb: "ff4f81bd" };
                    font_color = { argb: "ffffffff" };
                    font_bold = true;
                    font_size = 11;
                    if (m > 3) {
                        ws.getCell(cell_address).value = null;
                    }
                } else {
                    font_name = "IBM Plex Sans";
                    font_size = 11;
                }
                ws.getCell(cell_address).fill = {
                    type: bgType,
                    pattern: bgPattern,
                    fgColor: bgColor,
                };
                ws.getCell(cell_address).font = {
                    name: font_name,
                    family: font_family,
                    size: font_size,
                    color: font_color,
                    bold: font_bold,
                    underline: fornt_underline,
                };

                //Apply protection conditions on cell
                ws.getCell(cell_address).protection = {
                    locked: n > 7 && m == 10 ? false : true,
                };
                //cell formating
                if (head_start_row == 4 && m > 13) {
                    ws.getCell(
                        cell_address,
                    ).numFmt = `"Units Reno:"_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)`;
                }
                if (head_start_row == 5 && m >= fp_start_col) {
                    ws.getCell(
                        cell_address,
                    ).numFmt = `"SqFt:"_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)`;
                }
                if (head_start_row > 6 && m > 9) {
                    ws.getCell(
                        cell_address,
                    ).numFmt = `_(* #,##0.00_);_(* (#,##0);_(* "-"??_);_(@_)`;
                    ws.getCell(cell_address).alignment = {
                        vertical: "center",
                        horizontal: "right",
                    };
                }

                //Set border
                if ((head_start_row == 4 || head_start_row == 5) && m >= fp_start_col) {
                    ws.getCell(cell_address).border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                }
                if (head_start_row > 6) {
                    ws.getCell(cell_address).border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                }
            }
            head_start_row += 1;
        }

        //subtotal formula
        let range_start_row = 8;
        for (let s = 1; s <= subtotal_index_array.length; s++) {
            let range_end_row = 5 + subtotal_index_array[s - 1];

            for (let col_letter of all_price_col_letter) {
                let sutotal_formula = `=SUM(${col_letter}${range_start_row}:${col_letter}${range_end_row})`;
                let formula_cell = `${col_letter}${range_end_row + 1}`;
                ws.getCell(formula_cell).value = { formula: sutotal_formula };

                //protect cell
                ws.getCell(formula_cell).protection = { locked: true };
                //set Last total row formula
                if (s == subtotal_index_array.length) {
                    let formula_range = subtotal_index_array.map((el) => {
                        return `${col_letter}${el + 6}`;
                    });
                    let formula_total = `=SUM(${formula_range.join(",")})`;
                    let total_formula_cell = `${col_letter}${range_end_row + 2}`;
                    ws.getCell(total_formula_cell).value = {
                        formula: formula_total,
                    };
                    ws.getCell(total_formula_cell).protection = { locked: true };
                }
            }
            ws.getCell(`K${range_end_row + 1}`).value = "Subtotal";
            ws.getCell(`M${range_end_row + 1}`).value = "Subtotal";

            if (s == subtotal_index_array.length) {
                ws.getCell(`K${range_end_row + 2}`).value = "Total";
                ws.getCell(`M${range_end_row + 2}`).value = "Total";
            }
            range_start_row = range_end_row + 2;
        }

        //protect sheet
        await ws.protect("", {
            selectLockedCells: true,
            selectUnlockedCells: true,
        });

        // clear 1st and last 2 col
        let first_col = ws.getColumn(1);
        first_col.eachCell(function (cell: any) {
            cell.value = "";
        });
        first_col.hidden = true;
        ws.spliceColumns(main_header_join.length + 1, 2);
    } catch (e: any) {
        console.log(e.stack);
        return { status: "failed", message: "Export to excel failed" };
    }
    const buffer_data = { status: "success", wb_name, buffer: await wb.xlsx.writeBuffer() };
    return buffer_data;
}

function columnToLetter(column: number) {
    let temp,
        letter = "";
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}
