import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Select,
    Switch,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import {
    GET_UNIT_LEVEL_PRICES_TAKEOFF_STATUS,
    UPDATE_UNIT_LEVEL_PRICES_TAKEOFF_STATUS,
} from "../constants";
import { useProductionContext } from "context/production-context";
import { OpenInNew } from "@mui/icons-material";
import { useParams } from "react-router-dom";

type IFloorPlanCellProps = React.ComponentPropsWithRef<"div"> & {
    row: any;
    column: any;
    onFPLevelDataEdit: any;
};

const FloorPlanPrice = ({ row, column, onFPLevelDataEdit }: IFloorPlanCellProps) => {
    let price = null;
    let takeoff = null;
    let status = null;
    const [editMode, setEditMode] = useState(false);
    const [floorPlanMode, setFloorPlanMode] = useState(true);
    const [isLoadingUnitLevelData, setIsLoadingUnitLevelData] = useState(false);
    const [unitLevelData, setUnitLevelData] = useState([] as Array<any>);
    const [dataUpdateStore, setDataUpdateStore] = useState({} as any);
    const [floorPlanLevelDataStore, setFloorPlanLevelDataStore] = useState({} as any);
    const { projectId } = useParams();
    const [isUpdating, setIsUpdating] = useState(false);
    const {
        constants: { UnitScopeStatus: unitScopeItemStatuses },
    } = useProductionContext();
    try {
        if (row.aggregatedData.get(column.key).priceList.length > 1) {
            price = "Multiple";
        } else {
            price = row.aggregatedData.get(column.key).priceList[0];
        }
    } catch (err) {
        price = "Not Set";
    }
    try {
        if (row.aggregatedData.get(column.key).takeoffValueList.length > 1) {
            takeoff = "Multiple";
        } else {
            takeoff = row.aggregatedData.get(column.key).takeoffValueList[0];
        }
    } catch (err) {
        takeoff = "Not Set";
    }
    try {
        if (row.aggregatedData.get(column.key).unitScopeItemStatusList.length > 1) {
            status = "Multiple";
        } else {
            status = row.aggregatedData.get(column.key).unitScopeItemStatusList[0];
        }
    } catch (err) {
        status = "Not Set";
    }

    async function getUnitLevelPrices() {
        try {
            setIsLoadingUnitLevelData(true);
            const { getUnitLevelPriceScopeStatus } = await graphQLClient.query(
                "getUnitLevelPriceScopeStatus",
                GET_UNIT_LEVEL_PRICES_TAKEOFF_STATUS,
                {
                    unitScopeItemIds: row.aggregatedData.get(column.key).unitScopeItemIdList,
                },
            );
            setUnitLevelData(getUnitLevelPriceScopeStatus);
        } finally {
            setIsLoadingUnitLevelData(false);
        }
    }
    useEffect(() => {
        if (!floorPlanMode) {
            getUnitLevelPrices();
        }
        // eslint-disable-next-line
    }, [floorPlanMode]);
    async function editPriceTakeoffStatus() {
        setIsUpdating(true);
        try {
            let payload = [];
            if (floorPlanMode) {
                const entries = Object.entries(floorPlanLevelDataStore) as Array<Array<string>>;
                payload = row.aggregatedData
                    .get(column.key)
                    .unitScopeItemIdList.map((unitScopeItemId: any) => {
                        const updatedData = { unitScopeItemId } as any;
                        entries.forEach((entry) => {
                            updatedData[entry[0]] = entry[1];
                        });
                        return updatedData;
                    });
            } else {
                payload = Object.entries(dataUpdateStore).map((dataObject: any) => {
                    return { unitScopeItemId: Number(dataObject[0]), ...dataObject[1] };
                });
            }
            await graphQLClient.mutate("", UPDATE_UNIT_LEVEL_PRICES_TAKEOFF_STATUS, { payload });
            onFPLevelDataEdit();
        } finally {
            setIsUpdating(false);
        }
    }
    return (
        <>
            <Dialog
                open={editMode}
                onClose={() => {
                    if (isUpdating) {
                        return;
                    }
                    setDataUpdateStore({});
                    setFloorPlanLevelDataStore({});
                    setFloorPlanMode(true);
                    setEditMode(false);
                    setUnitLevelData([]);
                }}
            >
                <DialogTitle>{`${column.key} | ${row.customerCategory} > ${row.item} - ${row.scope}`}</DialogTitle>
                <DialogContent>
                    <Grid container flexDirection={"column"}>
                        <Grid item>
                            <Grid container flexDirection={"row"}>
                                <Grid item>
                                    <Switch
                                        value={floorPlanMode}
                                        onChange={() => setFloorPlanMode(!floorPlanMode)}
                                    />
                                </Grid>
                                <Grid item>{floorPlanMode ? "Floorplan View" : "Unit View"}</Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {floorPlanMode ? (
                                <Grid container flexDirection={"column"} gap={4}>
                                    <Grid>
                                        <Typography>Current Price is {price}</Typography>
                                        <TextField
                                            type="number"
                                            disabled={isUpdating}
                                            placeholder="New Total Price"
                                            value={floorPlanLevelDataStore?.totalPrice ?? ""}
                                            onChange={(e) => {
                                                setFloorPlanLevelDataStore({
                                                    ...floorPlanLevelDataStore,
                                                    ["totalPrice"]: Number.parseFloat(
                                                        e.target.value,
                                                    ),
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid>
                                        <Typography>Current Takeoff is {takeoff}</Typography>
                                        <TextField
                                            type="number"
                                            disabled={isUpdating}
                                            placeholder="New Takeoff"
                                            value={floorPlanLevelDataStore?.takeoffValue ?? ""}
                                            onChange={(e) => {
                                                setFloorPlanLevelDataStore({
                                                    ...floorPlanLevelDataStore,
                                                    ["takeoffValue"]: Number.parseFloat(
                                                        e.target.value,
                                                    ),
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid>
                                        <Typography>Current Status is {status}</Typography>
                                        <Select
                                            disabled={isUpdating}
                                            value={floorPlanLevelDataStore?.status ?? ""}
                                            onChange={(e) => {
                                                setFloorPlanLevelDataStore({
                                                    ...floorPlanLevelDataStore,
                                                    ["status"]: e.target.value,
                                                });
                                            }}
                                        >
                                            {unitScopeItemStatuses.map((statusObject: any) => (
                                                <MenuItem
                                                    value={statusObject.value}
                                                    key={statusObject.value}
                                                >
                                                    {statusObject.display}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container>
                                    <Grid>
                                        <Typography>Unit Level View</Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography>
                                            {isLoadingUnitLevelData && <CircularProgress />}
                                        </Typography>
                                    </Grid>
                                    <TableContainer style={{ overflowX: "initial" }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Unit Name</TableCell>
                                                    <TableCell>Takeoff</TableCell>
                                                    <TableCell>Total Price</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {unitLevelData.map((unitLevelDataPoint) => (
                                                <TableRow key={unitLevelDataPoint.unitScopeItemId}>
                                                    <TableCell>
                                                        <Button
                                                            startIcon={<OpenInNew />}
                                                            onClick={() => {
                                                                window.open(
                                                                    `/consumer/projects/${projectId}/production/units/${unitLevelDataPoint.renoUnitId}`,
                                                                    "_blank",
                                                                );
                                                            }}
                                                        >
                                                            {unitLevelDataPoint.unitName}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            disabled={isUpdating}
                                                            value={
                                                                dataUpdateStore?.[
                                                                    unitLevelDataPoint
                                                                        .unitScopeItemId
                                                                ]?.takeoffValue ??
                                                                unitLevelDataPoint.takeoffValue
                                                            }
                                                            onChange={(e) => {
                                                                const dataStoreObject =
                                                                    dataUpdateStore[
                                                                        unitLevelDataPoint
                                                                            .unitScopeItemId
                                                                    ] ?? {};
                                                                setDataUpdateStore({
                                                                    ...dataUpdateStore,
                                                                    [unitLevelDataPoint.unitScopeItemId]:
                                                                        {
                                                                            ...dataStoreObject,
                                                                            ["takeoffValue"]:
                                                                                Number.parseFloat(
                                                                                    e.target.value,
                                                                                ),
                                                                        },
                                                                });
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            disabled={isUpdating}
                                                            value={
                                                                dataUpdateStore?.[
                                                                    unitLevelDataPoint
                                                                        .unitScopeItemId
                                                                ]?.totalPrice ??
                                                                unitLevelDataPoint.totalPrice
                                                            }
                                                            onChange={(e) => {
                                                                const dataStoreObject =
                                                                    dataUpdateStore[
                                                                        unitLevelDataPoint
                                                                            .unitScopeItemId
                                                                    ] ?? {};
                                                                setDataUpdateStore({
                                                                    ...dataUpdateStore,
                                                                    [unitLevelDataPoint.unitScopeItemId]:
                                                                        {
                                                                            ...dataStoreObject,
                                                                            ["totalPrice"]:
                                                                                Number.parseFloat(
                                                                                    e.target.value,
                                                                                ),
                                                                        },
                                                                });
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            disabled={isUpdating}
                                                            value={
                                                                dataUpdateStore?.[
                                                                    unitLevelDataPoint
                                                                        .unitScopeItemId
                                                                ]?.status ??
                                                                unitLevelDataPoint.status
                                                            }
                                                            onChange={(e) => {
                                                                const dataStoreObject =
                                                                    dataUpdateStore[
                                                                        unitLevelDataPoint
                                                                            .unitScopeItemId
                                                                    ] ?? {};
                                                                setDataUpdateStore({
                                                                    ...dataUpdateStore,
                                                                    [unitLevelDataPoint.unitScopeItemId]:
                                                                        {
                                                                            ...dataStoreObject,
                                                                            ["status"]:
                                                                                e.target.value,
                                                                        },
                                                                });
                                                            }}
                                                        >
                                                            {unitScopeItemStatuses.map(
                                                                (statusObject: any) => (
                                                                    <MenuItem
                                                                        value={statusObject.value}
                                                                        key={statusObject.value}
                                                                    >
                                                                        {statusObject.display}
                                                                    </MenuItem>
                                                                ),
                                                            )}
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isUpdating} onClick={editPriceTakeoffStatus}>
                        {isUpdating ? "Editing" : "Edit"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Tooltip title={`Price is ${price}, Takeoff is ${takeoff}, Status is ${status}`}>
                {/* eslint-disable-next-line */}
                <a
                    href="#"
                    style={{ color: "blue" }}
                    onClick={() => {
                        setEditMode(true);
                    }}
                >
                    Price: ${price}, Takeoff: {takeoff}, Status: {status}
                </a>
            </Tooltip>
        </>
    );
};

export default FloorPlanPrice;
