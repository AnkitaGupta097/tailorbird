import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../stores/hooks";
import {
    Grid,
    Table,
    TableHead,
    TableRow,
    Box,
    TableCellProps,
    styled,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";
import { getUnitMixData } from "../service";
import { map, find } from "lodash";

const RegularCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
    background: theme.palette.secondary.main,
    color: theme.palette.text.primary,
    ".Variation-takeoff-issue,.Variation-takeoff-correct": {
        display: "flex",
        marginLeft: "5px",
    },
    ".Variation-table-error-count": {
        display: "flex",
        marginLeft: "5px",
    },
}));
const DataCell = styled(TableCell)<TableCellProps>(() => ({
    padding: "0px",
    paddingTop: "2px ",
    paddingBottom: "2px",
    paddingLeft: "16px",
    height: "39px",
}));

const UnitMixTable = () => {
    const { unitMix } = useAppSelector((state: any) => ({
        unitMix: state.projectFloorplans.unitMix,
    }));
    const [unitMixData, setUnitMixData] = useState<any>(null);
    const [unitMixDetail, setUnitMixDetail] = useState<any>(null);

    useEffect(() => {
        const updatedUnitMix: any = getUnitMixData(unitMix);
        const { data } = updatedUnitMix;
        setUnitMixDetail(updatedUnitMix);
        setUnitMixData(data);
        // eslint-disable-next-line
    }, [unitMix]);

    const getInventoryColumn = () => {
        return map(unitMix.inventory, (i, index) => {
            return (
                <RegularCell key={index} className="Variation-table-regular">
                    <Box>
                        <Typography variant="text_16_semibold">Inventory {index + 1}</Typography>
                    </Box>
                    <Typography variant="text_16_semibold">{`${i.name} (${
                        unitMixDetail[i.id]
                    })`}</Typography>
                </RegularCell>
            );
        });
    };

    const renderInventoryRow = (iData: any[]) => {
        return map(unitMix.inventory, (i) => {
            const data = find(iData, { inventory_id: i.id });
            return (
                <DataCell key={i.id}>
                    <Typography variant="text_16_regular">{data ? data.count : 0}</Typography>
                </DataCell>
            );
        });
    };

    const getTableRow = () => {
        return unitMixData.map((unitData: any, index: number) => {
            return (
                <TableRow key={index}>
                    <DataCell>
                        <Typography variant="text_16_regular">{unitData.type}</Typography>
                    </DataCell>
                    <DataCell>
                        <Typography variant="text_16_regular">
                            {unitData?.commercial_name ?? unitData.name}
                        </Typography>
                    </DataCell>
                    <DataCell>
                        <Typography variant="text_16_regular">{unitData.area}</Typography>
                    </DataCell>
                    <DataCell>
                        <Typography variant="text_16_regular">{unitData.totalUnits}</Typography>
                    </DataCell>
                    {renderInventoryRow(unitData.inventory)}
                    <DataCell>
                        <Typography variant="text_16_regular">{unitData.renoUnits}</Typography>
                    </DataCell>
                </TableRow>
            );
        });
    };

    return (
        <Grid item md={12} mb={2}>
            {unitMixData && (
                <Table
                    className="Variation-table"
                    padding="normal"
                    size="small"
                    sx={{ borderCollapse: "separate", borderSpacing: "0.25rem 0" }}
                >
                    <TableHead>
                        <TableRow>
                            <RegularCell className="Variation-table-header-highlight">
                                <Typography variant="text_16_semibold">Floorplan Type</Typography>
                            </RegularCell>
                            <RegularCell className="Variation-table-header-highlight">
                                <Typography variant="text_16_semibold">Floorplan Name</Typography>
                            </RegularCell>
                            <RegularCell className="Variation-table-regular">
                                <Typography variant="text_16_semibold">
                                    Standard Area
                                    <Box>
                                        <Typography variant="text_16_semibold">(SQ FT)</Typography>
                                    </Box>
                                </Typography>
                            </RegularCell>
                            <RegularCell className="Variation-table-regular">
                                <Typography variant="text_16_semibold">{`Total Units `}</Typography>
                                <Box>
                                    <Typography variant="text_16_semibold">
                                        ({unitMixDetail.totalUnits})
                                    </Typography>
                                </Box>
                            </RegularCell>
                            {getInventoryColumn()}
                            <RegularCell className="Variation-table-regular">
                                <Typography variant="text_16_semibold">Reno Units</Typography>
                                <Box>
                                    <Typography variant="text_16_semibold">
                                        ({unitMixDetail.totalRenoUnits})
                                    </Typography>
                                </Box>
                            </RegularCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{getTableRow()}</TableBody>
                </Table>
            )}
        </Grid>
    );
};

export default React.memo(UnitMixTable);
