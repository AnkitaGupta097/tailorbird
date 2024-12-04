import React from "react";

import FilterSidebar from "components/production/filter-sidebar";
import FilterSection from "components/production/filter-sidebar/filter-section";

type IApprovalFilters = React.ComponentPropsWithRef<"div"> & {
    unitStatuses: any;
    approvalTypes: any;
    setFilters?: any;
};

const ApprovalFilters = ({ unitStatuses, approvalTypes, setFilters }: IApprovalFilters) => {
    return (
        <FilterSidebar>
            <FilterSection
                label="Approval Type"
                filterItems={approvalTypes}
                onFilterClick={(value) =>
                    setFilters((prevFilters: any) => {
                        return { ...prevFilters, approvalType: value };
                    })
                }
            />
            <FilterSection
                label="Unit Status"
                filterItems={unitStatuses}
                onFilterClick={(value) =>
                    setFilters((prevFilters: any) => {
                        return { ...prevFilters, unitStatuses: value };
                    })
                }
            />
        </FilterSidebar>
    );
};

export default ApprovalFilters;
