import { graphQLClient } from "utils/gql-client";
import { GET_BID_LEVELING_DATA_V2 } from "../gql/queries/getBidLevelingDataV2";
import { GET_PROPERTY_DETAILS } from "stores/properties-consumer/queries";
import { FLOORING_STATE_TYPE } from "../constants";
import { CREATE_SCOPE_SELECTION } from "../gql/mutations/CreateScopeSelection";

const mngItems = (items: any, selectedItems: any) => {
    const filteredItems = items?.filter((item: any) => selectedItems.includes(item?.id));
    if (filteredItems.length > 0) {
        filteredItems.unshift(items[0]);
    }
    return filteredItems;
};

export const updateScopeSelector = async (payload: any): Promise<any> =>
    graphQLClient.mutate("createScopeSelection", CREATE_SCOPE_SELECTION, {
        ...payload,
    });

export const rowReducer = (
    groupedRows: Record<FLOORING_STATE_TYPE, any[]>,
    category: any,
    projectType: string,
) => {
    const categoryItems = category?.items || [];

    const categoryName = category?.name;
    const isFlooring = categoryName?.toLowerCase()?.includes("flooring");
    const isGroundFlooring = isFlooring && categoryName?.toLowerCase().includes("ground");
    const isUpperFlooring = isFlooring && categoryName?.toLowerCase().includes("upper");

    if (isFlooring && projectType.toLowerCase() !== "interior") {
        groupedRows.default.push(...categoryItems);
    }

    if (!isFlooring) {
        groupedRows.default.push(...categoryItems);
        groupedRows.consolidated.push(...categoryItems);
        groupedRows.ground.push(...categoryItems);
        groupedRows.upper.push(...categoryItems);
    }

    if (isFlooring && (isGroundFlooring || isUpperFlooring)) {
        groupedRows.default.push(...categoryItems);
    }

    if (isFlooring && isGroundFlooring) {
        groupedRows.ground.push(...categoryItems);
    }

    if (isFlooring && isUpperFlooring) {
        groupedRows.upper.push(...categoryItems);
    }

    if (isFlooring && !isGroundFlooring && !isUpperFlooring) {
        groupedRows.consolidated.push(...categoryItems);
    }

    return groupedRows;
};

export const addSubTotalRow = (rows: {
    default: any[];
    ground: any[];
    upper: any[];
    consolidated: any[];
}) => {
    // This will append Subtotal Rows to Rows array
    Object.values(rows).forEach(
        (
            value: {
                hierarchy: string[];
                [x: string]: any;
            }[],
        ) => {
            let i;
            for (i = value.length - 1; i >= 0; i--) {
                if (
                    ["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                        value[i].hierarchy?.[0],
                    )
                ) {
                    continue;
                }
                break;
            }
            if (i < 0) {
                i = 0;
            }
            value.splice(i, 0, { hierarchy: ["Subtotal"], id: "Subtotal" });
        },
    );
};

export const getBidLevelingData = (
    projectId: string,
    scopeSelection: string,
    workType: string,
): Promise<any> =>
    graphQLClient.query("getBidLevelingDataV2", GET_BID_LEVELING_DATA_V2, {
        projectId,
        scopeSelection,
        workType,
    });

export const roundPrice = (price: number): string =>
    (Math.ceil(price * 100) / 100).toLocaleString("en-US");

export const getPropertyName = async (propertyId: string): Promise<string> =>
    graphQLClient
        .query("getProperty", GET_PROPERTY_DETAILS, { propertyId })
        .then((data: any) => data?.getProperty?.name)
        .catch((error: any) => console.error(error.stack));

export const getSelectedBidItems = (selectedIds: any[], allBidItemsResp: any) => {
    return {
        ...allBidItemsResp,
        categories: allBidItemsResp?.categories?.map((cat: any) => {
            return {
                ...cat,
                items: mngItems(cat?.items, selectedIds),
            };
        }),
    };
};

export const groupedFpReducer = (
    fpWithGroupId: {
        bed_bath_count: string;
        fp_name: string;
    }[],
    eachGroup: {
        floorplan_unit_type: string;
        floorplans: Array<string>;
    },
): {
    bed_bath_count: string;
    fp_name: string;
}[] => {
    const { floorplan_unit_type: bed_bath_count, floorplans } = eachGroup;

    fpWithGroupId.push(
        ...floorplans.map((fp_name) => ({
            fp_name,
            bed_bath_count,
        })),
    );
    return fpWithGroupId;
};

export const getTotals = (props: {
    rows: Array<any>;
    tab: string;
}): {
    totals: Record<string, number>;
    subtotals: Record<string, number>;
} => {
    let { rows, tab } = props;
    let pricingKey: "agg_price" | "wtd_avg_price" =
        tab === "wtd_avg" ? "wtd_avg_price" : "agg_price";
    let totals: Record<string, number> = {};
    let subtotal: Record<string, number> = {};

    // Iterate over all Contractors , Floorplans for Each and Inventories for Each, Calculate Total
    // and Subtotal at once to not compute them on Column Change
    rows?.forEach((row) => {
        if (!row?.is_parent) return;
        else {
            row?.contractors.forEach(
                (ctr: { name: string; agg_price: number; wtd_avg_price: number }) => {
                    let key = `Contractor:${ctr?.name}`;
                    totals[key] = (totals[key] ?? 0) + (ctr[pricingKey] ?? 0);
                    if (
                        !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                            row.hierarchy?.[0],
                        )
                    ) {
                        subtotal[key] = (subtotal[key] ?? 0) + (ctr[pricingKey] ?? 0);
                    }
                },
            );
        }
    });
    rows?.forEach((row: { contractors: any; hierarchy: string[]; is_parent: boolean }) => {
        if (!row?.is_parent) return;
        else {
            row?.contractors.forEach(
                (ctr: {
                    name: string;
                    floorplans: {
                        name: string;
                        agg_price: number;
                        wtd_avg_price: number;
                        commercial_name: string;
                    }[];
                }) => {
                    ctr.floorplans.forEach((floorplan) => {
                        let key = `Contractor:${ctr?.name}-Floorplan:${floorplan?.commercial_name}`;
                        totals[key] = (totals[key] ?? 0) + (floorplan[pricingKey] ?? 0);
                        if (
                            !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                row.hierarchy?.[0],
                            )
                        ) {
                            subtotal[key] = (subtotal[key] ?? 0) + (floorplan[pricingKey] ?? 0);
                        }
                    });
                },
            );
        }
    });

    rows?.forEach((row) => {
        if (!row?.is_parent) return;
        else {
            row?.contractors.forEach(
                (ctr: {
                    name: string;
                    floorplans: {
                        name: string;
                        commercial_name: string;
                        agg_price: number;
                        wtd_avg_price: number;
                        inventories: {
                            name: string;
                            agg_price: number;
                            wtd_avg_price: number;
                        }[];
                    }[];
                }) => {
                    ctr.floorplans.forEach((floorplan) => {
                        floorplan.inventories.forEach((inv) => {
                            let key = `Contractor:${ctr?.name}-Floorplan:${floorplan?.commercial_name}-Inventory:${inv?.name}`;
                            totals[key] = (totals[key] ?? 0) + (inv[pricingKey] ?? 0);
                            if (
                                !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                    row.hierarchy?.[0],
                                )
                            ) {
                                subtotal[key] = (subtotal[key] ?? 0) + (inv[pricingKey] ?? 0);
                            }
                        });
                    });
                },
            );
        }
    });
    rows?.forEach((row) => {
        if (!row?.is_parent) return;
        else {
            row?.contractors.forEach(
                (ctr: {
                    name: string;
                    inventories_without_fp: {
                        name: string;
                        agg_price: number;
                        wtd_avg_price: number;
                    }[];
                }) => {
                    ctr.inventories_without_fp.forEach((inventory_without_fp) => {
                        let key = `Contractor:${ctr?.name}-Inventory:${inventory_without_fp?.name}`;
                        totals[key] = (totals[key] ?? 0) + (inventory_without_fp[pricingKey] ?? 0);
                        if (
                            !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                row.hierarchy?.[0],
                            )
                        ) {
                            subtotal[key] =
                                (subtotal[key] ?? 0) + (inventory_without_fp[pricingKey] ?? 0);
                        }
                    });
                },
            );
        }
    });

    return {
        totals: totals,
        subtotals: subtotal,
    };
};

export const getSubtotal = (props: {
    AllRows: Array<any>;
    tab: string;
}): {
    // totals: Record<string, number>;
    subtotals: Record<string, number>;
} => {
    let { AllRows, tab } = props;
    let pricingKey: "agg_price" | "wtd_avg_price" =
        tab === "wtd_avg" ? "wtd_avg_price" : "agg_price";
    // let totals: Record<string, number> = {};

    // Iterate over all Contractors , Floorplans for Each and Inventories for Each, Calculate Total
    // and Subtotal at once to not compute them on Column Change
    let groupData: any = {};
    for (let group in AllRows) {
        let subtotal: Record<string, number> = {};
        const rows = AllRows[group];
        rows?.forEach((row: any) => {
            if (!row?.is_parent) return;
            else {
                row?.contractors.forEach(
                    (ctr: { name: string; agg_price: number; wtd_avg_price: number }) => {
                        let key = `Contractor:${ctr?.name}`;
                        // totals[key] = (totals[key] ?? 0) + (ctr[pricingKey] ?? 0);
                        if (
                            !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                row.hierarchy?.[0],
                            )
                        ) {
                            subtotal[key] = (subtotal[key] ?? 0) + (ctr[pricingKey] ?? 0);
                        }
                    },
                );
            }
        });
        rows?.forEach((row: { contractors: any; hierarchy: string[]; is_parent: boolean }) => {
            if (!row?.is_parent) return;
            else {
                row?.contractors.forEach(
                    (ctr: {
                        name: string;
                        floorplans: {
                            name: string;
                            commercial_name: string;
                            agg_price: number;
                            wtd_avg_price: number;
                        }[];
                    }) => {
                        ctr.floorplans.forEach((floorplan) => {
                            let key = `Contractor:${ctr?.name}-Floorplan:${floorplan?.commercial_name}`;
                            // totals[key] = (totals[key] ?? 0) + (floorplan[pricingKey] ?? 0);
                            if (
                                !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                    row.hierarchy?.[0],
                                )
                            ) {
                                subtotal[key] = (subtotal[key] ?? 0) + (floorplan[pricingKey] ?? 0);
                            }
                        });
                    },
                );
            }
        });

        rows?.forEach((row: any) => {
            if (!row?.is_parent) return;
            else {
                row?.contractors.forEach(
                    (ctr: {
                        name: string;
                        floorplans: {
                            name: string;
                            commercial_name: string;
                            agg_price: number;
                            wtd_avg_price: number;
                            inventories: {
                                name: string;
                                agg_price: number;
                                wtd_avg_price: number;
                            }[];
                        }[];
                    }) => {
                        ctr.floorplans.forEach((floorplan) => {
                            floorplan.inventories.forEach((inv) => {
                                let key = `Contractor:${ctr?.name}-Floorplan:${floorplan?.commercial_name}-Inventory:${inv?.name}`;
                                // totals[key] = (totals[key] ?? 0) + (inv[pricingKey] ?? 0);
                                if (
                                    !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                        row.hierarchy?.[0],
                                    )
                                ) {
                                    subtotal[key] = (subtotal[key] ?? 0) + (inv[pricingKey] ?? 0);
                                }
                            });
                        });
                    },
                );
            }
        });
        rows?.forEach((row: any) => {
            if (!row?.is_parent) return;
            else {
                row?.contractors.forEach(
                    (ctr: {
                        name: string;
                        inventories_without_fp: {
                            name: string;
                            agg_price: number;
                            wtd_avg_price: number;
                        }[];
                    }) => {
                        ctr.inventories_without_fp.forEach((inventory_without_fp) => {
                            let key = `Contractor:${ctr?.name}-Inventory:${inventory_without_fp?.name}`;
                            // totals[key] = (totals[key] ?? 0) + (inventory_without_fp[pricingKey] ?? 0);
                            if (
                                !["Tax", "General Conditions", "Profit & Overhead"]?.includes(
                                    row.hierarchy?.[0],
                                )
                            ) {
                                subtotal[key] =
                                    (subtotal[key] ?? 0) + (inventory_without_fp[pricingKey] ?? 0);
                            }
                        });
                    },
                );
            }
        });
        groupData[group] = subtotal;
    }

    return {
        // totals: totals,
        subtotals: groupData,
    };
};
const belowLineWorkType = ["Tax", "Profit & Overhead", "General Conditions"];
export const updatePercentRowsValue = (props: any) => {
    let finalObj: any = {};
    for (let key in props?.rows) {
        const updatedDataArray = props.rows?.[key].map((row: any) => {
            if (!belowLineWorkType.includes(row?.hierarchy[0])) {
                return row;
            } else {
                let newRow = JSON.parse(JSON.stringify(row));
                let subtotalVariable =
                    newRow?.name?.includes("Tax on Labor") &&
                    newRow?.name?.includes("Tax on Material")
                        ? "subtotalAll"
                        : newRow?.name?.includes("Tax on Labor")
                        ? "subtotalLabor"
                        : newRow?.name?.includes("Tax on Material")
                        ? "subtotalMaterial"
                        : "subtotalAll";

                for (let i = 0; i < row?.contractors?.length; i++) {
                    const contractor = row?.contractors[i];
                    if (!contractor?.is_percentage) {
                        continue;
                    }

                    let keyToCheck = `Contractor:${contractor?.name}`;
                    newRow.contractors[i].agg_price =
                        (newRow?.contractors[i]?.percentage / 100) *
                        props?.[subtotalVariable]?.aggregate?.subtotals?.[key]?.[keyToCheck];
                    newRow.contractors[i].wtd_avg_price =
                        (newRow?.contractors[i]?.percentage / 100) *
                        props?.[subtotalVariable]?.wtd_avg?.subtotals?.[key]?.[keyToCheck];

                    //floorplan updates
                    for (let j = 0; j < contractor?.floorplans?.length; j++) {
                        const fp = contractor?.floorplans[j];
                        keyToCheck = `Contractor:${contractor?.name}-Floorplan:${fp?.commercial_name}`;
                        newRow.contractors[i].floorplans[j].agg_price =
                            (newRow?.contractors[i]?.floorplans[j]?.percentage / 100) *
                            props?.[subtotalVariable]?.aggregate?.subtotals?.[key]?.[keyToCheck];
                        newRow.contractors[i].floorplans[j].wtd_avg_price =
                            (newRow?.contractors[i]?.floorplans[j]?.percentage / 100) *
                            props?.[subtotalVariable]?.wtd_avg?.subtotals?.[key]?.[keyToCheck];

                        //inventory Update
                        for (let k = 0; k < fp?.inventories?.length; k++) {
                            const inv = fp?.inventories[k];
                            keyToCheck = `Contractor:${contractor?.name}-Floorplan:${fp?.commercial_name}-Inventory:${inv?.name}`;

                            newRow.contractors[i].floorplans[j].inventories[k].agg_price =
                                (newRow?.contractors[i]?.floorplans[j]?.inventories[k]?.percentage /
                                    100) *
                                props?.[subtotalVariable]?.aggregate?.subtotals?.[key]?.[
                                    keyToCheck
                                ];
                            newRow.contractors[i].floorplans[j].inventories[k].wtd_avg_price =
                                (newRow?.contractors[i]?.floorplans[j]?.inventories[k]?.percentage /
                                    100) *
                                props?.[subtotalVariable]?.wtd_avg?.subtotals?.[key]?.[keyToCheck];
                        }
                    }
                    for (let l = 0; l < contractor?.inventories_without_fp?.length; l++) {
                        const invWithoutFP = contractor?.inventories_without_fp[l];
                        keyToCheck = `Contractor:${contractor?.name}-Inventory:${invWithoutFP?.name}`;
                        newRow.contractors[i].inventories_without_fp[l].agg_price =
                            (newRow?.contractors[i]?.inventories_without_fp[l]?.percentage / 100) *
                            props?.[subtotalVariable]?.aggregate?.subtotals?.[key]?.[keyToCheck];

                        newRow.contractors[i].inventories_without_fp[l].wtd_avg_price =
                            (newRow?.contractors[i]?.inventories_without_fp[l]?.percentage / 100) *
                            props?.[subtotalVariable]?.wtd_avg?.subtotals?.[key]?.[keyToCheck];
                    }
                }
                return newRow;
            }
        });
        const dataWithUpdatedCatSubtotal = updateCategorytotal(updatedDataArray);
        finalObj[key] = dataWithUpdatedCatSubtotal;
    }
    return finalObj;
};

// const belowLineCat = ["Tax", "General Conditions", "Profit & Overhead"];
const updateCategorytotal = (updatedDataArray: any) => {
    let subtotalRowIdx: number | undefined;
    let subtotalRow: any;
    let subTotalObj: any = {};
    // let contractorDataAdded: any = [];
    const DataArray = updatedDataArray?.map((row: any, idx: number) => {
        if (row?.hierarchy?.length == 1) {
            subtotalRowIdx = idx;
            subtotalRow = JSON.parse(JSON.stringify(row));

            //make all the calculations zero for category totals
            subtotalRow = {
                ...subtotalRow,
                contractors: subtotalRow?.contractors?.map((ctr: any) => {
                    ctr.agg_price = 0;
                    ctr.wtd_avg_price = 0;

                    return {
                        ...ctr,
                        inventories_without_fp: ctr?.inventories_without_fp?.map((invWo: any) => {
                            invWo.agg_price = 0;
                            invWo.wtd_avg_price = 0;
                            return invWo;
                        }),
                        floorplans: ctr?.floorplans?.map((fp: any) => {
                            fp.agg_price = 0;
                            fp.wtd_avg_price = 0;
                            return {
                                ...fp,
                                inventories: fp?.inventories?.map((inv: any) => {
                                    inv.agg_price = 0;
                                    inv.wtd_avg_price = 0;
                                    return inv;
                                }),
                            };
                        }),
                    };
                }),
            };
        } else {
            if (subtotalRowIdx) {
                const contractorSequence = subtotalRow?.contractors?.map((ctr: any) => ctr?.name);
                for (let i = 0; i < row?.contractors?.length; i++) {
                    const contractor = row?.contractors[i];
                    let contractorIndex = contractorSequence.indexOf(contractor?.name);
                    if (contractorIndex < 0) continue;
                    subtotalRow.contractors[contractorIndex].agg_price =
                        subtotalRow.contractors[contractorIndex].agg_price + contractor?.agg_price;
                    subtotalRow.contractors[contractorIndex].wtd_avg_price =
                        subtotalRow.contractors[contractorIndex]?.wtd_avg_price +
                        contractor?.wtd_avg_price;

                    //floorplan updates
                    const fpSequence = subtotalRow?.contractors[i]?.floorplans?.map(
                        (fp: any) => fp?.commercial_name,
                    );
                    for (let j = 0; j < contractor?.floorplans?.length; j++) {
                        const fp = contractor?.floorplans[j];
                        let fpIndex = fpSequence.indexOf(fp?.commercial_name);
                        if (fpIndex < 0) continue;
                        subtotalRow.contractors[contractorIndex].floorplans[fpIndex].agg_price =
                            subtotalRow.contractors[contractorIndex].floorplans[fpIndex].agg_price +
                            fp?.agg_price;
                        subtotalRow.contractors[contractorIndex].floorplans[fpIndex].wtd_avg_price =
                            subtotalRow.contractors[contractorIndex]?.floorplans[fpIndex]
                                ?.wtd_avg_price + fp?.wtd_avg_price;

                        //inventory Update
                        const invSequence = subtotalRow?.contractors[i]?.floorplans[
                            j
                        ]?.inventories?.map((inv: any) => inv?.name);
                        for (let k = 0; k < fp?.inventories?.length; k++) {
                            const inv = fp?.inventories[k];
                            let invIndex = invSequence.indexOf(inv?.name);
                            if (invIndex < 0) continue;
                            subtotalRow.contractors[contractorIndex].floorplans[
                                fpIndex
                            ].inventories[invIndex].agg_price =
                                subtotalRow.contractors[contractorIndex].floorplans[fpIndex]
                                    .inventories[invIndex].agg_price + inv?.agg_price;
                            subtotalRow.contractors[contractorIndex].floorplans[
                                fpIndex
                            ].inventories[invIndex].wtd_avg_price =
                                subtotalRow.contractors[contractorIndex]?.floorplans[fpIndex]
                                    ?.inventories[invIndex].wtd_avg_price + inv?.wtd_avg_price;
                        }
                    }

                    //inv without floorplan update
                    const invWoSequence = subtotalRow?.contractors[i]?.inventories_without_fp?.map(
                        (inv: any) => inv?.name,
                    );
                    for (let l = 0; l < contractor?.inventories_without_fp?.length; l++) {
                        const invWithoutFP = contractor?.inventories_without_fp[l];
                        let invWoIndex = invWoSequence.indexOf(invWithoutFP?.name);
                        if (invWoIndex < 0) continue;
                        subtotalRow.contractors[contractorIndex].inventories_without_fp[
                            invWoIndex
                        ].agg_price =
                            subtotalRow.contractors[contractorIndex].inventories_without_fp[l]
                                .agg_price + invWithoutFP?.agg_price;
                        subtotalRow.contractors[contractorIndex].inventories_without_fp[
                            invWoIndex
                        ].wtd_avg_price =
                            subtotalRow.contractors[contractorIndex]?.inventories_without_fp[l]
                                ?.wtd_avg_price + invWithoutFP?.wtd_avg_price;
                    }
                }

                subTotalObj[subtotalRowIdx] = subtotalRow;
            }
        }
        return row;
    });
    for (let key in subTotalObj) {
        DataArray?.splice(key, 1, subTotalObj[key]);
    }
    return DataArray;
};

export const updateSequence = (response: { categories: any }) => {
    const belowTheLineCatSequenceArray = [
        "Alternates",
        "General Conditions",
        "Profit & Overhead",
        "Tax",
    ];
    const categoriesClone = JSON.parse(JSON.stringify(response?.categories));
    const orderedCat = categoriesClone?.sort((current: any, next: any) => {
        return belowTheLineCatSequenceArray.indexOf(current?.name) == -1 &&
            belowTheLineCatSequenceArray.indexOf(next?.name) == -1
            ? 0
            : belowTheLineCatSequenceArray.indexOf(current?.name) <=
              belowTheLineCatSequenceArray.indexOf(next?.name)
            ? -1
            : 1;
    });
    return { ...response, categories: orderedCat };
};

export { updateCategorytotal };
