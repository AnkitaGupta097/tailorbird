import { Clear } from "@mui/icons-material";
import { Divider, Grid, IconButton, Typography } from "@mui/material";
import BaseChip from "components/chip";
import { useProductionContext } from "context/production-context";

import React from "react";
import ProgressBar from "./progress-bar";
import { UNIT_STATUS_COLOR_MAP } from "../constants";
import { convertToDisplayUnit } from "../converter-util";

interface IDetailCardProps {
    unit?: any;
    onClose?: () => void;
}

const DetailCardHeader = ({ unit, onClose }: IDetailCardProps) => {
    const { constants } = useProductionContext();
    const possibleUnitStatuses = constants.RenovationUnitStatus ?? [];

    const chipProps = unit.status
        ? { ...UNIT_STATUS_COLOR_MAP[`${unit.status}`] }
        : {
              variant: "outlined",
              textColor: "#6A6464",
          };

    const calculateProgress = () => {
        const { total_work, completed_work } = unit?.unit_stats ?? {};
        return total_work && completed_work ? Math.round((completed_work / total_work) * 100) : 0;
    };

    return (
        <Grid container flexDirection="column">
            <Grid
                container
                justifyContent="space-between"
                sx={{ padding: "16px" }}
                alignItems="center"
            >
                <Grid item>
                    <Typography color="primary" variant="text_24_medium">
                        {unit.unit_name ?? ""}
                    </Typography>
                </Grid>
                <Grid item marginLeft="auto">
                    <BaseChip
                        label={
                            unit.status
                                ? convertToDisplayUnit(unit.status, possibleUnitStatuses)
                                : ""
                        }
                        {...chipProps}
                        sx={{ borderRadius: "4px" }}
                    />
                    <IconButton onClick={onClose} sx={{ paddingRight: 0 }}>
                        <Clear />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>
            <Grid item sx={{ padding: "16px", height: "50px" }}>
                <ProgressBar value={calculateProgress()} />
            </Grid>
        </Grid>
    );
};

export default DetailCardHeader;
