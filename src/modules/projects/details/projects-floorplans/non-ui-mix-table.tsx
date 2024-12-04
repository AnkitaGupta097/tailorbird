import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import actions from "stores/actions";
import {
    Button,
    CircularProgress,
    LinearProgress,
    Table,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { graphQLClient } from "utils/gql-client";
import { UPDATE_INVENTORY_MIX } from "stores/projects/details/floor-plans/floor-plans-mutations";
import { TextField } from "@mui/material";

const NonUIMixtable = () => {
    const { projectId } = useParams();
    const dispatch = useAppDispatch();
    const { id }: any = JSON.parse(localStorage.getItem("user_details") || "{}");
    const [inputDisabled, setInputDisabled] = useState(false);
    const { floorplans, isLoading, inventories, inventoryMixes, projectDetails } = useAppSelector(
        (state: any) => ({
            floorplans: state.projectFloorplans.floorplans,
            isLoading:
                state.projectFloorplans.floorplans.loading &&
                state.projectFloorplans.inventories.loading &&
                state.projectFloorplans.inventoryMixes.loading,
            inventories: state.projectFloorplans.inventories,
            inventoryMixes: state.projectFloorplans.inventoryMixes,
            projectDetails: state.projectDetails.data,
        }),
    );
    const inventory_name = inventories?.data?.[0]?.name ?? null;
    const [inventoryMixMap, setInventoryMixMap] = useState({} as any);
    const [renoUnitsMap, setRenoUnitsMap] = useState({} as any);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const updatedInventoryMixMap: any = {};
        const fpIds = new Map((floorplans.data ?? []).map((fp: any) => [fp.id, true]));
        (inventoryMixes?.data ?? [])
            .filter((inventoryMix: any) => fpIds.get(inventoryMix.floorplanId))
            .forEach((inventoryMix: any) => {
                updatedInventoryMixMap[inventoryMix.floorplanId] = inventoryMix.count;
            });
        setInventoryMixMap((prevInventoryMixMap: any) => ({
            ...prevInventoryMixMap,
            ...updatedInventoryMixMap,
        }));
        // eslint-disable-next-line
    }, [inventoryMixes.data, floorplans.data]);

    useEffect(() => {
        for (const data of Object.entries(renoUnitsMap)) {
            const foundObject = floorplans.data.find((obj: any) => obj.id === data[0]);
            const val = data[1] as Number;
            if (
                foundObject &&
                (foundObject.totalUnits < val || 0 > val.valueOf() || val.valueOf() % 1 > 0)
            ) {
                setHasError(true);
                return;
            }
        }
        setHasError(false);
    }, [renoUnitsMap, floorplans.data]);

    const projectType = (projectDetails?.projectType ?? "").toLowerCase() as string;

    async function updateUnitMix(newInventoryMixMap: any) {
        setLoading(true);
        setInputDisabled(true);
        try {
            await graphQLClient.mutate("", UPDATE_INVENTORY_MIX, {
                input: {
                    project_id: projectId,
                    updated_by: id,
                    inventory_list: [
                        {
                            inventory_name: inventory_name,
                            floor_plan_counts: Object.entries(newInventoryMixMap).map((data) => {
                                return {
                                    floor_plan_id: data[0],
                                    count: data[1],
                                };
                            }),
                        },
                    ],
                },
            });
            setInventoryMixMap(newInventoryMixMap);
        } finally {
            setInputDisabled(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
        dispatch(actions.projectFloorplans.fetchUnitMixDataStart(projectId));
        // eslint-disable-next-line
    }, [projectId]);
    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <div style={{ margin: 32, cursor: inputDisabled ? "progress" : "pointer" }}>
            <Table>
                <TableHead>
                    <TableCell>
                        {projectType == "common_area" ? "Common Area Name" : "Building Name"}
                    </TableCell>
                    <TableCell>Area</TableCell>
                    <TableCell>Total Areas</TableCell>
                    <TableCell>Total Reno Areas</TableCell>
                </TableHead>
                {floorplans.data.map((s: any) => {
                    return (
                        <TableRow key={s.id}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.area}</TableCell>
                            <TableCell>{s.totalUnits}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    fullWidth
                                    error={
                                        (renoUnitsMap[s.id] ?? inventoryMixMap[s.id]) > s.totalUnits
                                    }
                                    helperText={
                                        (renoUnitsMap[s.id] ?? inventoryMixMap[s.id]) > s.totalUnits
                                            ? "Reno Areas can't be greater than Total Areas"
                                            : null
                                    }
                                    // value={renoUnitsMap[s.id] ?? s.renoUnits}
                                    defaultValue={inventoryMixMap[s.id]}
                                    onChange={(e) => {
                                        let input = Number(e.target.value);
                                        console.log(input, "printing inputs");
                                        renoUnitsMap[s.id] = input;
                                        setRenoUnitsMap((prevRenoUnitMap: any) => ({
                                            ...prevRenoUnitMap,
                                            [s.id]: input,
                                        }));
                                        if (input > s.totalUnits) {
                                            return;
                                        }
                                    }}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </Table>
            <div style={{ textAlign: "right", marginTop: 20, marginRight: 20 }}>
                {loading ? (
                    <CircularProgress color="info" />
                ) : (
                    <Button
                        variant="contained"
                        disabled={hasError}
                        onClick={() => {
                            updateUnitMix({
                                ...inventoryMixMap,
                                ...renoUnitsMap,
                            });
                        }}
                    >
                        Save
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NonUIMixtable;
