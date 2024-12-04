import React, { ReactNode } from "react";

import { Grid, Typography } from "@mui/material";
import theme from "../../../styles/theme";
import KeyIcon from "@mui/icons-material/Key";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BaseChip from "components/chip";
import { UNIT_STATUS_COLOR_MAP } from "../constants";
import BaseAccordion from "components/base-accordion";
import { useProductionContext } from "context/production-context";
import ScopeItemCard from "../units/scope-item-card";
import ScopeStatusChip from "../common/scope-status-chip";
import { useAppSelector } from "stores/hooks";
import { shallowEqual } from "react-redux";

interface IInvoiceUnitCardProps {
    unit: any;
}

const InvoiceUnitCard = ({ unit }: IInvoiceUnitCardProps) => {
    const { constants } = useProductionContext();

    const { storeRenoUnit } = useAppSelector((state) => {
        return {
            storeRenoUnit: state.renoUnitsData.renoUnits?.find(
                (renoUnit) => unit.reno_unit_id === renoUnit.id,
            ),
        };
    }, shallowEqual);

    const getUnitChipProps = (statusValue: string) => {
        const unitStatus = constants?.RenovationUnitStatus?.find((status: any) => {
            return status.value === statusValue;
        });

        const props = UNIT_STATUS_COLOR_MAP[statusValue];

        return {
            ...props,
            label: unitStatus?.display,
        };
    };

    const viewableFields = {
        work_type_icon: true,
        item_name: true,
        uom: true,
        price: true,
        spec: true,
    };

    const getCategoryItems = (items: Array<any>) => {
        return items.map((item: any) => (
            <ScopeItemCard
                key={item.id}
                item={item}
                editableFields={[]}
                viewableFields={viewableFields}
                allStatuses={constants?.UnitScopeStatus || []}
                allUOMs={constants?.UnitOfMeasurements || []}
                hideSubItemDetail
            />
        ));
    };

    const getScopeStatusChip = (status: string): ReactNode => {
        return (
            <div style={{ marginRight: "8px" }}>
                <ScopeStatusChip status={status} />
            </div>
        );
    };

    return (
        <Grid
            container
            flexDirection="column"
            style={{
                borderRadius: "4px",
                border: `1px solid  ${theme.border.textarea}`,
                padding: "16px 20px",
            }}
            gap={5}
        >
            <Grid container gap={2} alignItems="center">
                <Grid>
                    <KeyIcon htmlColor={theme.icon.successDark} />
                </Grid>
                <Grid>
                    <Typography variant="text_24_medium" color={theme.scopeHeader.label}>
                        {unit?.unit_name}
                    </Typography>
                </Grid>
                <Grid>
                    <InfoOutlinedIcon htmlColor={theme.icon.subdued} />
                </Grid>
                <Grid>
                    <BaseChip
                        {...getUnitChipProps(storeRenoUnit?.status || unit.reno_unit_status)}
                        sx={{ borderRadius: "4px" }}
                    />
                </Grid>
            </Grid>

            {unit?.scopes.map((scope: any) => (
                <BaseAccordion
                    title={scope.scope_name}
                    components={getCategoryItems(scope.items)}
                    key={scope.category}
                    accordionStyling={{ border: "none" }}
                    summaryDetail={getScopeStatusChip(scope?.unit_scope_status)}
                    defaultExpanded={false}
                    accordionDetailsSx={{ padding: "8px" }}
                />
            ))}
        </Grid>
    );
};

export default InvoiceUnitCard;
