import { Divider, Grid } from "@mui/material";
import React from "react";
import DetailCardHeader from "../common/detail-card-header";
import AppTheme from "styles/theme";
import KeyValueRow from "./key-value-row";

interface IUnitDetailCardProps {
    unit: any;
    onClose: () => void;
    actionItemComponent?: React.ReactNode;
    actionButtons?: React.ReactNode;
    rows: Array<any>;
    height?: string;
}

/**
    Read only view of unit detail card
 */
const UnitDetailCard = (props: IUnitDetailCardProps) => {
    const { unit, actionItemComponent, actionButtons, onClose, rows, height } = props;

    const renderRows = (dataRows: any) => {
        return (
            <>
                {dataRows.map((dataRow: any) => {
                    return (
                        <>
                            <KeyValueRow field={dataRow.key} value={dataRow.value} />
                            <Divider />
                        </>
                    );
                })}
            </>
        );
    };

    return (
        <Grid container flexDirection="column" sx={{ background: AppTheme.common.white }}>
            {unit && <DetailCardHeader unit={unit} onClose={onClose} />}

            <Grid item style={{ height: height || "420px", overflowY: "auto" }}>
                <Grid container flexDirection="column">
                    <Grid item sx={{ margin: "0px 16px" }}>
                        <Grid container justifyContent="space-between">
                            <Grid item xs={3}>
                                <KeyValueRow field="Unit Type" value={unit?.unit_type} />
                            </Grid>
                            <Grid item xs={3}>
                                <KeyValueRow field="Floor Plan" value={unit?.floor_plan_name} />
                            </Grid>
                            <Grid item xs={3}>
                                <KeyValueRow field="Sq FT" value={unit?.area} />
                            </Grid>
                        </Grid>
                        <Divider />
                        {renderRows(rows || [])}
                    </Grid>
                    <Grid item sx={{ margin: "0px 16px" }}>
                        {actionItemComponent}
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sx={{ margin: "0px 16px" }}>
                {actionButtons}
            </Grid>
        </Grid>
    );
};

export default UnitDetailCard;
