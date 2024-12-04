import React from "react";

import BaseChip from "components/chip";
import { SCOPE_STATUS_COLOR_MAP } from "../constants";
import { useAppSelector } from "stores/hooks";

interface IScopeStatusChipProps {
    status: string;
}

const ScopeStatusChip = ({ status }: IScopeStatusChipProps) => {
    const { allStatuses } = useAppSelector((state) => {
        return {
            allStatuses: state.productionProject.constants?.UnitScopeStatus,
        };
    });

    const getScopeStatusChipProps = () => {
        const scopeStatus = allStatuses?.find((unitScopeStatus: any) => {
            return unitScopeStatus.value == status;
        });

        const props = SCOPE_STATUS_COLOR_MAP[status];

        return {
            ...props,
            label: scopeStatus?.display,
        };
    };

    return (
        <BaseChip
            label={"-"}
            bgcolor={""}
            textColor={""}
            {...getScopeStatusChipProps()}
            sx={{ borderRadius: "4px" }}
        />
    );
};

export default ScopeStatusChip;
