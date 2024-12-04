import React, { Dispatch, FC, SetStateAction } from "react";
import ColumnFilters from "components/coulumn-filters";
import { isEqual } from "lodash";
export type IInitialColumnFilters = {
    selectedFloorplans: Array<{ fp_name: string; bed_bath_count: string }>;
    selectedInventories: Array<string>;
    selectedContractors: Array<string>;
    showInventory: boolean;
    showFloorplan: boolean;
};
export let initialColumnFilters: IInitialColumnFilters = {
    selectedFloorplans: [],
    selectedInventories: [],
    selectedContractors: [],
    showInventory: false,
    showFloorplan: false,
};

type IColumnFiltersWithState = {
    floorplans: Array<{ fp_name: string; bed_bath_count: string }>;
    contractors: Array<string>;
    inventories: Array<string>;
    setColumnFilters: Dispatch<SetStateAction<IInitialColumnFilters>>;
    columnFilters: any;
    expanded: boolean;
    setExpanded: Function;
    appliedFilters: Record<string, boolean>;
    setAppliedFilters: Dispatch<SetStateAction<any>>;
    internalColumnFiltersState: IInitialColumnFilters;
    setinternalColumnFiltersState: Dispatch<SetStateAction<IInitialColumnFilters>>;
    isDisabled: boolean;
};

export const ColumnFiltersWithStates: FC<IColumnFiltersWithState> = ({
    floorplans,
    contractors,
    inventories,
    setColumnFilters,
    columnFilters,
    expanded,
    setExpanded,
    setAppliedFilters,
    appliedFilters,
    internalColumnFiltersState,
    setinternalColumnFiltersState,
    isDisabled,
}) => {
    return (
        <ColumnFilters
            isDisabled={isDisabled}
            expanded={expanded}
            setExpanded={setExpanded}
            areFiltersApplied={appliedFilters.columnFilters}
            floorplans={floorplans}
            contractors={contractors}
            inventories={inventories}
            onClearFilters={() => {
                setinternalColumnFiltersState(initialColumnFilters);
                setColumnFilters(initialColumnFilters);
                setAppliedFilters((prev: any) => ({ ...prev, columnFilters: false }));
            }}
            selectedContractors={internalColumnFiltersState.selectedContractors}
            selectedFloorplans={internalColumnFiltersState.selectedFloorplans}
            selectedInventories={internalColumnFiltersState.selectedInventories}
            onContractorsChange={(contractors: Array<any>) => {
                setinternalColumnFiltersState((prev) => ({
                    ...prev,
                    selectedContractors: contractors,
                }));
            }}
            onFloorplanChange={(floorplans: Array<any>) => {
                setinternalColumnFiltersState((prev) => ({
                    ...prev,
                    selectedFloorplans: floorplans,
                }));
            }}
            onInventoriesChange={(inventories: Array<any>) => {
                setinternalColumnFiltersState((prev) => ({
                    ...prev,
                    selectedInventories: inventories,
                }));
            }}
            showFloorplan={internalColumnFiltersState.showFloorplan}
            showInventory={internalColumnFiltersState.showInventory}
            onApply={() => {
                if (isEqual(columnFilters, internalColumnFiltersState)) {
                    return;
                }
                setColumnFilters({ ...internalColumnFiltersState });
                setExpanded();
                setAppliedFilters((prev: any) => ({ ...prev, columnFilters: true }));
            }}
            onCancel={() => {
                setinternalColumnFiltersState(columnFilters);
                setExpanded();
            }}
            onChangeShowFloorplan={() => {
                setinternalColumnFiltersState((prev) => ({
                    ...prev,
                    showFloorplan: !prev.showFloorplan,
                }));
            }}
            onChangeShowInventories={() => {
                setinternalColumnFiltersState((prev) => ({
                    ...prev,
                    showInventory: !prev.showInventory,
                }));
            }}
        />
    );
};
