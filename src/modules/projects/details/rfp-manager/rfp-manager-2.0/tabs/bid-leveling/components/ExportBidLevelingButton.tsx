import React, { useEffect } from "react";
import ArrowTooltip from "modules/rfp-manager/pricing-summary-table/arrowTooltip";
import { IconButton } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";
import BaseSnackbar from "components/base-snackbar";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import { find } from "lodash";
import { getPropertyName } from "../helper";

interface IExportBlView {
    blColumns: any[];
    blRows: any[];
    blColumnGroupingModel: any[];
    contractors: any[];
    Content: any[];
    isDisabled: boolean;
    BlTotals: any;
}

const ExportBidLevelingButton: React.FC<IExportBlView> = ({
    isDisabled,
    blColumns,
    blRows,
    blColumnGroupingModel,
    contractors,
    Content,
    BlTotals,
}) => {
    const [showError, setErrorModal] = React.useState<boolean>(false);
    const { organization, project, snackbar } = useAppSelector((state) => ({
        organization: state.tpsm.organization,
        project: state?.projectDetails?.data,
        snackbar: state?.common.snackbar,
    }));
    const [owner, setOwner] = React.useState("");
    const [propertyName, setPropertyName] = React.useState("");

    useEffect(() => {
        if (organization) {
            setOwner(find(organization, { id: project?.ownershipGroupId })?.name ?? "");
        }
        if (propertyName?.length === 0) {
            getPropertyName(project?.propertyId).then((name) => setPropertyName(name ?? ""));
        }
        // eslint-disable-next-line
    }, [organization]);

    //Setup header
    const groupedHeaders: any[] = [];
    const groupesL1: any[] = [];
    let to_match_field: any = {};
    if (blColumnGroupingModel?.length > 0) {
        blColumnGroupingModel.map((level1: any) => {
            groupesL1.push(level1?.groupId);
            let groupL2: any = [];
            if (level1?.children) {
                level1?.children.map((level2: any) => {
                    if (level2?.groupId) groupL2.push(level2?.groupId);

                    if (level2?.children) {
                        level2?.children.map((level3: any, itr: number) => {
                            groupesL1.push("");
                            if (itr > 0) {
                                groupL2.push("");
                            }
                            to_match_field[level3?.field] = ["N/A", "N/A"];
                        });
                    } else {
                        to_match_field[level2?.field] = ["N/A", "N/A"];
                        groupesL1.push("");
                    }
                });

                groupedHeaders.push(...groupL2);
                if (groupesL1[groupesL1.length - 1] == "") {
                    groupesL1.pop();
                }
            } else {
                to_match_field[level1?.field] = ["N/A", "N/A"];
            }
        });
    } else {
        contractors?.map((contractor: any) => {
            to_match_field[`Contractor:${contractor}`] = ["N/A", "N/A"];
        });
    }
    let not_in_content =
        !Content.includes("Scope Detail") && !Content.includes("Description")
            ? ["Scope Detail", "Description"]
            : !Content.includes("Scope Detail")
            ? ["Scope Detail"]
            : !Content.includes("Description")
            ? ["Description"]
            : [];
    let empty_cells_to_add =
        not_in_content?.length === 2
            ? [""]
            : not_in_content?.length === 1
            ? ["", ""]
            : ["", "", ""];
    const FinalgroupedHeaders =
        groupesL1?.length > 0 && groupedHeaders.length > 0
            ? [
                  [...empty_cells_to_add, ...groupesL1],
                  [...empty_cells_to_add, ...groupedHeaders],
                  ["Category", ...blColumns.filter((el) => !not_in_content.includes(el))],
              ]
            : groupesL1?.length > 0
            ? [
                  [...empty_cells_to_add, ...groupesL1],
                  ["Category", ...blColumns.filter((el) => !not_in_content.includes(el))],
              ]
            : [["Category", ...blColumns.filter((el) => !not_in_content.includes(el))]];

    //setup rows
    const rows_data: any = {};
    for (let i = 0; i < blRows?.length; i++) {
        let newfields = { ...to_match_field };
        let item = blRows[i];
        if (!Content?.includes("Scope Detail") && item?.hierarchy?.length > 1) {
            continue;
        }
        if (item?.id != "Subtotal") {
            item?.contractors?.map((contractor: any) => {
                contractor?.floorplans.map((fp: any) => {
                    fp?.inventories?.map((inv: any) => {
                        if (
                            Object.keys(to_match_field).includes(
                                `Contractor:${contractor?.name}-Floorplan:${fp?.commercial_name}-Inventory:${inv?.name}`,
                            )
                        ) {
                            newfields[
                                `Contractor:${contractor?.name}-Floorplan:${fp?.commercial_name}-Inventory:${inv?.name}`
                            ] = [inv?.agg_price ?? "N/A", inv?.wtd_avg_price ?? "N/A"];
                        }
                    });
                    if (
                        Object.keys(to_match_field).includes(
                            `Contractor:${contractor?.name}-Floorplan:${fp?.commercial_name}`,
                        )
                    ) {
                        newfields[
                            `Contractor:${contractor?.name}-Floorplan:${fp?.commercial_name}`
                        ] = [fp?.agg_price ?? "N/A", fp?.wtd_avg_price ?? "N/A"];
                    }
                });
                contractor?.inventories_without_fp?.map((inv: any) => {
                    if (
                        Object.keys(to_match_field).includes(
                            `Contractor:${contractor?.name}-Inventory:${inv?.name}`,
                        )
                    ) {
                        newfields[`Contractor:${contractor?.name}-Inventory:${inv?.name}`] = [
                            inv?.agg_price ?? "N/A",
                            inv?.wtd_avg_price ?? "N/A",
                        ];
                    }
                });

                if (Object.keys(to_match_field).includes(`Contractor:${contractor?.name}`)) {
                    newfields[`Contractor:${contractor?.name}`] = [
                        contractor?.agg_price ?? "N/A",
                        contractor?.wtd_avg_price ?? "N/A",
                    ];
                }
            });
            if (item?.hierarchy.length > 1) {
                newfields["category"] = "";
            } else {
                newfields["category"] = item?.hierarchy[0];
            }

            if (Content?.includes("Description"))
                newfields["description"] = item?.description ?? "";
            if (Content?.includes("Scope Detail")) newfields["scope_details"] = item?.name ?? "";
            rows_data[item?.id] = newfields;
        }
    }

    //Create Subtotal
    let subTotalFieldes: any = { ...to_match_field };
    subTotalFieldes = Object.keys(to_match_field).reduce((subTotals, key) => {
        return {
            ...subTotals,
            [key]: [BlTotals?.aggregate?.subtotals?.[key], BlTotals?.wtd_avg?.subtotals?.[key]],
        };
    }, subTotalFieldes);

    //Create Subtotal
    to_match_field = Object.keys(to_match_field).reduce((to_match, key) => {
        return {
            ...to_match,
            [key]: [BlTotals?.aggregate?.totals?.[key], BlTotals?.wtd_avg?.totals?.[key]],
        };
    }, to_match_field);
    to_match_field["category"] = "Total";
    if (Content?.includes("Description")) to_match_field["description"] = "";
    if (Content?.includes("Scope Detail")) to_match_field["scope_details"] = "";
    rows_data["Total"] = to_match_field;

    //Create excel fit arrays
    const rows_array_agg: any[] = [];
    const rows_array_wavg: any[] = [];

    let belowLineCatFound: boolean = false;

    Object.keys(rows_data).map((id) => {
        let Agg_row: any[] = [];
        let wavg_row: any[] = [];
        let sub_agg_row = ["Subtotal"];
        let sub_wavg_row = ["Subtotal"];
        Agg_row.push(rows_data[id]?.category);
        wavg_row.push(rows_data[id]?.category);

        if (rows_data[id]?.scope_details != undefined) {
            Agg_row.push(rows_data[id]?.scope_details);
            wavg_row.push(rows_data[id]?.scope_details);
            sub_agg_row.push("");
            sub_wavg_row.push("");
        }
        if (rows_data[id]?.description != undefined) {
            Agg_row.push(rows_data[id]?.description);
            wavg_row.push(rows_data[id]?.description);
            sub_agg_row.push("");
            sub_wavg_row.push("");
        }

        for (let key in rows_data[id]) {
            if (key != "category" && key != "scope_details" && key != "description") {
                //Populate subtotal row
                if (
                    !belowLineCatFound &&
                    (rows_data[id]?.category == "Profit & Overhead" ||
                        rows_data[id]?.category == "General Conditions" ||
                        rows_data[id]?.category == "Tax")
                ) {
                    sub_agg_row.push(subTotalFieldes[key][0]);
                    sub_wavg_row.push(subTotalFieldes[key][1]);
                }
                Agg_row.push(rows_data[id][key][0]);
                wavg_row.push(rows_data[id][key][1]);
            }
        }
        if (
            !belowLineCatFound &&
            (rows_data[id]?.category == "Profit & Overhead" ||
                rows_data[id]?.category == "General Conditions" ||
                rows_data[id]?.category == "Tax")
        ) {
            rows_array_agg.push(sub_agg_row);
            rows_array_wavg.push(sub_wavg_row);
            belowLineCatFound = true;
        }
        rows_array_agg.push(Agg_row);
        rows_array_wavg.push(wavg_row);
    });
    const excelData_agg = [...FinalgroupedHeaders, ...rows_array_agg];
    const excelData_wavg = [...FinalgroupedHeaders, ...rows_array_wavg];

    const excelData = {
        data: [excelData_wavg, excelData_agg],
        Content,
        header_row_count: FinalgroupedHeaders.length,
        projectName: project?.name,
        owner,
        propertyName,
    };

    const excelWorker: Worker = React.useMemo(
        () => new Worker(new URL("../workers/export-BL-worker.ts", import.meta.url)),
        [],
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        const workerEvent = async (event: MessageEvent) => {
            if (event.data?.status === "failed") {
                setErrorModal(true);
            } else {
                const buffer = event.data.payload.buffer;
                saveAs(new Blob([buffer]), `BL-${project?.name}.xlsx`);
            }
        };
        excelWorker.addEventListener("message", workerEvent);
        return () => {
            dispatch(actions.common.closeSnack());
        };
        //eslint-disable-next-line
    }, []);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (showError) {
            enqueueSnackbar("", {
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="error"
                        description="Export to excel failed"
                    />
                ),
            });
            setTimeout(() => {
                setErrorModal(false);
            }, 2000);
        }
        //eslint-disable-next-line
    }, [showError, snackbar.open]);
    return (
        <ArrowTooltip title="Export Bid Leveling to Excel" arrow>
            <IconButton
                sx={{
                    width: "48px",
                    height: "48px",
                    top: ".25rem",
                    bgcolor: "#EEEEEE",
                    borderRadius: "5px",
                    marginLeft: "16px",
                    "&:hover": {
                        bgcolor: "#909090",
                    },
                }}
                disabled={isDisabled}
                onClick={() => {
                    excelWorker.postMessage({
                        action: "generate_excel",
                        payload: {
                            excelData,
                        },
                    });
                }}
            >
                <FileDownloadIcon htmlColor={isDisabled ? "grey" : "black"} />
            </IconButton>
        </ArrowTooltip>
    );
};

export default ExportBidLevelingButton;
