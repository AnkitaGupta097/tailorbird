import React from "react";

import FilterSidebar from "../filter-sidebar";
import FilterSection, { KeyValueObject } from "../filter-sidebar/filter-section";
import { UNIT_SCOPE_STATUSES } from "../constants";

type IUnitScopeFilters = React.ComponentPropsWithRef<"div"> & {
    unitScopes: Array<any>;
    unitScopeStatuses: Array<KeyValueObject>;
    // eslint-disable-next-line no-unused-vars
    onFilterClick: (type: string, value: string[]) => void;
};

const UnitScopeFilters = ({ unitScopes, unitScopeStatuses, onFilterClick }: IUnitScopeFilters) => {
    const getScopeStatuses = (): Array<KeyValueObject> => {
        return unitScopeStatuses
            .filter((status) =>
                [UNIT_SCOPE_STATUSES.pending_approval, UNIT_SCOPE_STATUSES.not_applicable].includes(
                    status.value,
                ),
            )
            .map((status) => {
                const count = (
                    unitScopes?.filter((scopeDetail) => scopeDetail.status === status.value) || []
                ).length;

                return {
                    ...status,
                    display: count > 0 ? `${status.display} (${count})` : status.display,
                };
            });
    };

    const isContractorAssigned = (items: Array<any>) => {
        return items.some((item) => item.contractor_org_id != null);
    };

    const getAssignments = (): Array<KeyValueObject> => {
        const assignedCount = (
            unitScopes?.filter((scope) => isContractorAssigned(scope.items)) || []
        ).length;

        const unassignedCount = (unitScopes || []).length - assignedCount;

        const assignedDisplay = assignedCount > 0 ? `Assigned (${assignedCount})` : "Assigned";
        const unassignedDisplay =
            unassignedCount > 0 ? `Unassigned (${unassignedCount})` : "Unassigned";

        return [
            { display: assignedDisplay, value: "assigned" },
            { display: unassignedDisplay, value: "unassigned" },
        ];
    };

    return (
        <FilterSidebar>
            <FilterSection
                label="Scope Status"
                filterItems={getScopeStatuses()}
                onFilterClick={(value: string[]) => onFilterClick("status", value)}
            />
            <FilterSection
                label="Scope Assignments"
                filterItems={getAssignments()}
                onFilterClick={(value: string[]) => onFilterClick("assignment", value)}
            />
        </FilterSidebar>
    );
};

export default UnitScopeFilters;
