import React from "react";
import FilterSidebar from "../filter-sidebar";
import FilterSection, { KeyValueObject } from "../filter-sidebar/filter-section";
import { useProductionContext } from "context/production-context";

type IUnitRenovationFilters = React.ComponentPropsWithRef<"div"> & {
    floorPlans: Array<any>;
    renovationUnits: Array<any>;
    // eslint-disable-next-line no-unused-vars
    onFilterClick: (type: string, value: string[]) => void;
};

const UnitRenovationFilters = ({
    floorPlans,
    onFilterClick,
    renovationUnits,
}: IUnitRenovationFilters) => {
    const unitTypes = {} as any;
    floorPlans.forEach((s: any) => {
        unitTypes[s.unit_type] = true;
    });

    const { constants } = useProductionContext();

    const getUnitScopeStatuses = (): Array<KeyValueObject> => {
        const renovationUnitStatus = constants?.RenovationUnitStatus;
        return renovationUnitStatus?.map((status: any) => {
            const count = (
                renovationUnits.filter((renoUnit) => renoUnit.status === status.value) || []
            ).length;

            return {
                ...status,
                display: count > 0 ? `${status.display} (${count})` : status.display,
            };
        });
    };

    const getFloorPlans = (): Array<KeyValueObject> => {
        return floorPlans.map((floorPlan: any) => {
            const count = (
                renovationUnits.filter((renoUnit) => renoUnit.floor_plan_id === floorPlan.id) || []
            ).length;

            return {
                value: floorPlan.id,
                display: count > 0 ? `${floorPlan.name} (${count})` : floorPlan.name,
            };
        });
    };

    const getUnitTypes = (): Array<KeyValueObject> => {
        return Object.keys(unitTypes).map((unitType: any) => {
            const count = (
                renovationUnits.filter((renoUnit) => renoUnit.unit_type === unitType) || []
            ).length;

            return {
                value: unitType,
                display: count > 0 ? `${unitType} (${count})` : unitType,
            };
        });
    };

    return (
        <FilterSidebar>
            <FilterSection
                label="Unit Status"
                filterItems={getUnitScopeStatuses()}
                onFilterClick={(value: string[]) => onFilterClick("unitStatus", value)}
            />
            <FilterSection
                label="Unit Type"
                filterItems={getUnitTypes()}
                onFilterClick={(value: string[]) => onFilterClick("unitType", value)}
            />
            <FilterSection
                label="Floor Plan"
                filterItems={getFloorPlans()}
                onFilterClick={(value: string[]) => onFilterClick("floorPlan", value)}
            />
        </FilterSidebar>
    );
};

export default UnitRenovationFilters;
