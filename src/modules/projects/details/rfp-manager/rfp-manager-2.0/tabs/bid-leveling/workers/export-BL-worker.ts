import moment from "moment";
import { logo } from "../../../../../../../rfp-manager/pricing-summary-table/logobase64";

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

export async function exportToExcel({ excelData }: { excelData: any }) {
    const { data, Content, header_row_count, projectName, owner, propertyName } = excelData;

    //@ts-ignore
    const { Workbook } = await import("exceljs/dist/exceljs.bare");
    const wb = new Workbook();
    try {
        for (let idx = 0; idx < data.length; idx++) {
            let sheetName = idx == 0 ? "Wtd Average" : "Aggregate";
            let ws = wb.addWorksheet(sheetName, {
                views: [{ showGridLines: true }],
            });

            let details_array = [
                [],
                [],
                [idx == 0 ? "Wtd Average" : "Aggregate", "Bid Leveling Sheet"],
                [],
                ...data[idx],
            ];
            ws.addRows(details_array);
            let tbLogo = wb.addImage({ base64: logo, extension: "png" });

            ws.addImage(tbLogo, {
                tl: { col: 0.35, row: 0.95 },
                ext: { width: 129, height: 14 },
            });
            let property_richText_style = {
                richText: [
                    {
                        text: "{Header}\n",
                        font: {
                            size: 10,
                            name: "Source Sans Pro",
                            color: { argb: "ffA6A6A6" },
                            family: 3,
                        },
                    },
                    {
                        text: "{Details}",
                        font: {
                            size: 14,
                            name: "Source Sans Pro",
                            color: { argb: "ff595959" },
                            family: 3,
                        },
                    },
                ],
            };
            let owner_style = JSON.parse(
                JSON.stringify(property_richText_style)
                    .replace("{Header}", "OWNER")
                    .replace("{Details}", owner),
            );
            let property_style = JSON.parse(
                JSON.stringify(property_richText_style)
                    .replace("{Header}", "PROPERTY")
                    .replace("{Details}", propertyName),
            );
            let project_style = JSON.parse(
                JSON.stringify(property_richText_style)
                    .replace("{Header}", "PROJECT NAME")
                    .replace("{Details}", projectName),
            );
            let date_style = JSON.parse(
                JSON.stringify(property_richText_style)
                    .replace("{Header}", "GENERATED ON")
                    .replace("{Details}", moment(new Date()).format("MM/DD/YYYY")),
            );
            ws.getCell("B1").value = owner_style;
            ws.getCell("C1").value = property_style;
            ws.getCell("D1").value = project_style;
            ws.getCell("E1").value = date_style;
            let header_end_row = header_row_count + 4;
            let header_end_col = Content?.length + 1;
            let col_group_start_col = [];
            for (let i = 0; i < details_array?.length; i++) {
                let row_n = i + 1;
                let start_col = header_end_col + 1;
                let end_col = 0;
                for (let j = 0; j < data[idx][0]?.length; j++) {
                    let col_n = j + 1;
                    let col_letter = columnToLetter(col_n);
                    let cell_address = `${col_letter}${row_n}`;
                    //merge cells
                    if (row_n > 4 && row_n < header_end_row) {
                        if (
                            col_n != start_col &&
                            ((details_array[i][j] != "" && details_array[i][j - 1] == "") ||
                                (details_array[i][j] == "" && col_n == data[idx][0]?.length))
                        ) {
                            end_col = col_n == data[idx][0]?.length ? col_n : col_n - 1;
                            ws.mergeCells(row_n, start_col, row_n, end_col);
                            if (row_n == 5) {
                                col_group_start_col.push(start_col);
                                ws.getRow(row_n).getCell(start_col).border = {
                                    left: { style: "thin" },
                                    top: { style: "thin" },
                                    right: { style: "thin" },
                                };
                            }
                            start_col = col_n;
                        }
                    }
                    let bg_color =
                        row_n == 3 && col_n == 1 && idx == 0
                            ? "ff05573C"
                            : row_n == 3 && col_n == 1 && idx == 1
                            ? "ff320175"
                            : row_n == 3 && col_n > 1 && idx == 0
                            ? "ff0E845C"
                            : row_n == 3 && col_n > 1 && idx == 1
                            ? "ff6C34BA"
                            : row_n > 4 && row_n < header_end_row && col_n > header_end_col
                            ? "ffF2F2F2"
                            : row_n >= header_end_row &&
                              (details_array[i][0] == "Category" ||
                                  details_array[i][0] == "Subtotal" ||
                                  details_array[i][0] == "Total")
                            ? "ffF2F2F2"
                            : "ffffff";

                    // variable for text format
                    let font_color = row_n == 3 ? "ffffff" : "ff000000";
                    let font_size = row_n == 3 ? 14 : 10;
                    let font_bold =
                        row_n == 3 && col_n == 1
                            ? true
                            : row_n > 4 && row_n <= header_end_row
                            ? true
                            : row_n > header_end_row && col_n == 1
                            ? true
                            : false;
                    let text_format =
                        row_n > header_end_row && col_n > header_end_col ? `"$"#,##0.00_)` : ``;
                    ws.getCell(cell_address).numFmt = text_format;
                    if (
                        row_n < header_end_row ||
                        (row_n >= header_end_row &&
                            (details_array[i][0] == "Category" ||
                                details_array[i][0] == "Subtotal" ||
                                details_array[i][0] == "Total"))
                    ) {
                        ws.getCell(cell_address).fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: bg_color },
                        };
                    }
                    ws.getCell(cell_address).font = {
                        name: "Source Sans Pro",
                        family: 3,
                        size: font_size,
                        color: { argb: font_color },
                        bold: font_bold,
                    };
                    // column width
                    if (row_n == header_end_row) {
                        let col_width =
                            col_n == 1 ? 27.27 : col_n > 1 && col_n <= header_end_col ? 32 : 26.8;
                        ws.getColumn(col_n).width = col_width;
                    }
                    //Apply border
                    let border_style =
                        row_n == 3 && col_n == 2
                            ? { left: { style: "thick", color: { argb: "FFFFFFFF" } } }
                            : row_n > 4 &&
                              row_n <= header_end_row &&
                              col_group_start_col.includes(col_n)
                            ? {
                                  top: { style: "thin" },
                                  bottom: { style: "thin" },
                                  left: { style: "thin" },
                              }
                            : row_n == details_array?.length && col_n == data[idx][0]?.length
                            ? { bottom: { style: "thin" }, right: { style: "thin" } }
                            : row_n == details_array?.length
                            ? { bottom: { style: "thin" } }
                            : row_n > 5 && row_n <= header_end_row && col_n == data[idx][0]?.length
                            ? {
                                  top: { style: "thin" },
                                  bottom: { style: "thin" },
                                  right: { style: "thin" },
                              }
                            : row_n > 5 && row_n <= header_end_row && col_n > header_end_col + 1
                            ? { top: { style: "thin" }, bottom: { style: "thin" } }
                            : row_n == header_end_row && col_n <= header_end_col
                            ? { top: { style: "thin" }, bottom: { style: "thin" } }
                            : row_n > header_end_row && col_n == data[idx][0]?.length
                            ? { right: { style: "thin" } }
                            : row_n > header_end_row && col_group_start_col.includes(col_n)
                            ? { left: { style: "thin" } }
                            : row_n == 5 &&
                              header_row_count > 1 &&
                              col_n == data[idx][0]?.length &&
                              details_array[i][j] == ""
                            ? {
                                  left: { style: "thin" },
                                  top: { style: "thin" },
                                  bottom: { style: "thin" },
                                  right: { style: "thin" },
                              }
                            : {};

                    ws.getCell(cell_address).border = border_style;
                }
                // set row height
                let row_height =
                    row_n == 1
                        ? 45
                        : row_n == 2 || row_n == 4
                        ? 9.75
                        : row_n == header_end_row
                        ? 36
                        : 27.8;
                ws.getRow(row_n).height = row_height;
                ws.getRow(row_n).alignment = {
                    wrapText: true,
                    vertical: "middle",
                    horizontal: "left",
                };

                //Setting row groups
                if (
                    row_n > header_end_row &&
                    details_array[i][0] == "" &&
                    row_n <= details_array?.length
                ) {
                    ws.getRow(row_n).outlineLevel = 1;
                } else if (
                    row_n >= header_end_row &&
                    (details_array[i][0] != "" || row_n == details_array.length) &&
                    row_n <= details_array?.length
                ) {
                    // Set borders
                    for (let x = 1; x <= data[idx][0]?.length; x++) {
                        let borderStyle =
                            row_n == details_array.length && col_group_start_col.includes(x)
                                ? {
                                      bottom: { style: "thin" },
                                      left: { style: "thin" },
                                  }
                                : col_group_start_col.includes(x)
                                ? {
                                      top: { style: "thin" },
                                      bottom: { style: "thin" },
                                      left: { style: "thin" },
                                  }
                                : x == data[idx][0]?.length
                                ? {
                                      top: { style: "thin" },
                                      bottom: { style: "thin" },
                                      right: { style: "thin" },
                                  }
                                : { top: { style: "thin" }, bottom: { style: "thin" } };
                        ws.getRow(row_n).getCell(x).border = borderStyle;
                    }
                }
            }
            ws.getCell("A3").alignment = { vertical: "middle", horizontal: "center" };
        }
    } catch (e: any) {
        return { status: "failed", message: "Export to excel failed" };
    }
    const buffer_data = { status: "success", buffer: await wb.xlsx.writeBuffer() };
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
