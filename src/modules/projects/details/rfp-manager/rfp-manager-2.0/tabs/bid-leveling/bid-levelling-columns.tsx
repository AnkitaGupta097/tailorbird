import { GridActionsColDef, GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid-pro";
import { IInitialColumnFilters } from "./components/column-filter/column-filters-with-state";
import { roundPrice } from "./helper";

export const bidLevelingColumns: Array<GridColDef | GridActionsColDef> = [
    {
        field: "name",
        headerName: "Scope Detail",
        headerAlign: "left",
        align: "left",
        minWidth: 200,
    },
    {
        field: "description",
        headerName: "Description",
        headerAlign: "left",
        align: "left",
        minWidth: 200,
    },
];

export const getColumns = (
    data: any[],
    currentTab: string,
    columnFilters: IInitialColumnFilters,
    applyColumnFilters: boolean = false,
    totals: Record<"totals" | "subtotals", Record<string, number>>,
) => {
    const contractorCols: Array<GridColDef | GridActionsColDef> = [];
    const floorplanCols: Array<GridColDef | GridActionsColDef> = [];
    const inventoryCols: Array<GridColDef | GridActionsColDef> = [];
    const contractorColGrouping: GridColumnGroupingModel = [];
    const pricingPlaceholder = "N/A";
    const pricingKey = currentTab === "aggregate" ? "agg_price" : "wtd_avg_price";

    // This will iterate through all the contractors and create columns for each of those
    data?.forEach((contractor: any) => {
        const contractorHeaderName = `Contractor:[${contractor?.name}]`;
        if (
            applyColumnFilters &&
            !columnFilters?.selectedContractors?.includes(contractor?.name) &&
            columnFilters?.selectedContractors &&
            columnFilters?.selectedContractors?.length != 0
        ) {
            return;
        }
        let contractorField = `Contractor:${contractor?.name}`;
        contractorCols.push({
            field: contractorField,
            headerName: contractorHeaderName,
            headerAlign: "left",
            align: "left",
            minWidth: 200,
            renderCell: (params) => {
                const subtotal = totals["subtotals"][contractorField];
                const total = totals["totals"][contractorField];

                if (params?.row?.id === "Subtotal")
                    return subtotal ? `$${roundPrice(subtotal)}` : pricingPlaceholder;

                if (params?.row?.id === "Total")
                    return total ? `$${roundPrice(total)}` : pricingPlaceholder;

                const ctr = params?.row?.contractors?.find(
                    (ct: any) => ct?.name === contractor?.name,
                );
                const price = ctr?.[pricingKey];

                return price > 0 ? `$${roundPrice(price)}` : pricingPlaceholder;
            },
        });
        let floorplanChildren: any[] = [];
        // This will check if we have enabled filters & do we want to show floorplans or no
        if (columnFilters?.showFloorplan || !applyColumnFilters) {
            // For each floorplan, Create a Column & push it to floorplanCols array
            contractor?.floorplans?.forEach((floorplan: any) => {
                const floorplanHeaderName = `Floorplan:${floorplan?.name}`;
                // If filters are applied and this floorplan is selected then we add it to the floorplan children or we skip it
                if (
                    applyColumnFilters &&
                    columnFilters.selectedFloorplans.findIndex(
                        (fp) => fp.fp_name == floorplan.name,
                    ) == -1
                ) {
                    return;
                }
                let floorplanField = `Contractor:${contractor?.name}-Floorplan:${floorplan?.name}`;
                floorplanCols.push({
                    field: floorplanField,
                    headerName: floorplanHeaderName,
                    headerAlign: "left",
                    align: "left",
                    minWidth: 200,
                    renderCell: (params) => {
                        const subtotal = totals["subtotals"][floorplanField];
                        const total = totals["totals"][floorplanField];

                        if (params?.row?.id === "Subtotal")
                            return subtotal ? `$${roundPrice(subtotal)}` : pricingPlaceholder;

                        if (params?.row?.id === "Total")
                            return total ? `$${roundPrice(total)}` : pricingPlaceholder;

                        const fp = params?.row?.contractors
                            ?.find((ct: any) => ct?.name === contractor?.name)
                            ?.floorplans?.find(
                                (eachFp: any) => eachFp.commercial_name == floorplan?.name,
                            );
                        const price = fp?.[pricingKey];

                        return price > 0 ? `$${roundPrice(price)}` : pricingPlaceholder;
                    },
                });
                let inventoryChildren: any[] = [];
                // If we have fiters applied and we don't want to show inventory, Then append floorplanChildren with field
                // else append with another level of nesting with inventories
                if (applyColumnFilters && !columnFilters?.showInventory) {
                    floorplanChildren.push({
                        field: `Contractor:${contractor?.name}-Floorplan:${floorplan?.name}`,
                    });
                } else {
                    floorplan?.inventories?.forEach((inventory: any) => {
                        if (
                            applyColumnFilters &&
                            !columnFilters?.selectedInventories?.includes(inventory?.name)
                        ) {
                            return;
                        }
                        const inventoryFieldName = `Contractor:${contractor.name}-Floorplan:${floorplan.name}-Inventory:${inventory?.name}`;
                        inventoryCols.push({
                            field: inventoryFieldName,
                            headerName: `Inventory:${inventory?.name}`,
                            headerAlign: "left",
                            align: "left",
                            minWidth: 200,

                            renderCell: (params) => {
                                const subtotal = totals["subtotals"][inventoryFieldName];
                                const total = totals["totals"][inventoryFieldName];

                                if (params?.row?.id === "Subtotal")
                                    return subtotal
                                        ? `$${roundPrice(subtotal)}`
                                        : pricingPlaceholder;

                                if (params?.row?.id === "Total")
                                    return total ? `$${roundPrice(total)}` : total;

                                const price = params?.row?.contractors
                                    ?.find((ct: any) => ct?.name === contractor?.name)
                                    ?.floorplans?.find(
                                        (eachFp: any) => eachFp.commercial_name === floorplan?.name,
                                    )
                                    ?.inventories?.find(
                                        (inv: any) => inv.name === inventory?.name,
                                    )?.[pricingKey];

                                return price > 0 ? `$${roundPrice(price)}` : pricingPlaceholder;
                            },
                        });
                        inventoryChildren.push({ field: inventoryFieldName });
                    });
                    floorplanChildren.push({
                        groupId: floorplanHeaderName,
                        children: inventoryChildren,
                    });
                }
            });
            contractorColGrouping.push({
                groupId: contractorHeaderName,
                children: floorplanChildren,
            });
        }
        // If Filters are applied and we don't want to show floorplans, we add inventories directly onto the ColumnGrouping
        else if (
            applyColumnFilters &&
            columnFilters?.showInventory &&
            !columnFilters?.showFloorplan
        ) {
            let inventory_children: Array<GridColDef | GridActionsColDef> = [];
            contractor?.inventories_without_fp?.forEach(
                (inventory: { name: string; agg_price: number; wtd_avg_price: number }) => {
                    if (
                        columnFilters?.selectedInventories?.length > 0 &&
                        !columnFilters?.selectedInventories?.includes(inventory?.name)
                    ) {
                        return;
                    }
                    const inventoryFieldName = `Contractor:${contractor.name}-Inventory:${inventory?.name}`;
                    inventoryCols.push({
                        field: inventoryFieldName,
                        headerName: `Inventory:${inventory?.name}`,
                        headerAlign: "left",
                        align: "left",
                        minWidth: 150,
                        renderCell: (params) => {
                            const subtotal = totals["subtotals"][inventoryFieldName];
                            const total = totals["totals"][inventoryFieldName];

                            if (params?.row?.id === "Subtotal")
                                return subtotal ? `$${roundPrice(subtotal)}` : pricingPlaceholder;

                            if (params?.row?.id === "Total")
                                return total ? `$${roundPrice(total)}` : pricingPlaceholder;

                            const price = params?.row?.contractors
                                ?.find((ct: any) => ct?.name === contractor?.name)
                                ?.inventories_without_fp?.find(
                                    (inv: any) => inv.name == inventory?.name,
                                )?.[pricingKey];

                            return price > 0 ? `$${roundPrice(price)}` : pricingPlaceholder;
                        },
                    });
                    inventory_children.push({ field: inventoryFieldName });
                },
            );
            contractorColGrouping.push({
                groupId: contractorHeaderName,
                children: inventory_children,
            });
        }
    });
    // If no filters applied, we return inventory columns, if any filters are applied based on that we return the columns
    let returnCol = inventoryCols;
    if (applyColumnFilters) {
        if (
            (columnFilters?.showFloorplan && columnFilters?.showInventory) ||
            columnFilters.showInventory
        ) {
            returnCol = inventoryCols;
        } else if (columnFilters?.showFloorplan) {
            returnCol = floorplanCols;
        } else {
            returnCol = contractorCols;
        }
    }

    return {
        columns: [...bidLevelingColumns, ...returnCol],
        columnGroupingModel: contractorColGrouping,
    };
};
