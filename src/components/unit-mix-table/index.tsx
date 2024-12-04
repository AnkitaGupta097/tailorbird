import { gql } from "@apollo/client";
import {
    Grid,
    Switch,
    TextField,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCellProps,
    styled,
} from "@mui/material";
import { GridRenderCellParams, GridActionsCellItem } from "@mui/x-data-grid";
import BaseSnackbar from "components/base-snackbar";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { graphQLClient } from "utils/gql-client";
import TrackerUtil from "utils/tracker";
import DeSelectIcon from "../../assets/icons/deselect.svg";
import { map, cloneDeep, debounce } from "lodash";
import UnitMixActionMenu from "./unit-mix-action";
import CreateUnit from "./create-unit-modal";
import { ReactComponent as DownLoad } from "assets/icons/download-icon.svg";
import { DOWNLOAD_UNIT_MIX } from "stores/projects/details/overview/overview-queries";
import actions from "stores/actions";
import { useAppDispatch, useAppSelector } from "stores/hooks";

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
    height: "39px",
}));

type IUnitMixTable = React.ComponentProps<"div"> & { project_id: string };

const GET_UNIT_MIX_DATA = gql`
    query Query($projectId: String) {
        getProjectFloorPlans(project_id: $projectId) {
            id
            projectId: project_id
            name
            type
            commercial_name
            unit_type
            renoUnits: reno_units
            totalUnits: total_units
            area
            areaUom: area_uom
            revitMetadata {
                id
                name
                is_active
                is_translated
                floor_plan_id
                system_remarks
            }
        }
        getPropertyUnits(project_id: $projectId) {
            created_at
            details_json
            floor_plan_id
            id
            is_active
            project_id
            rent_roll_id
            unit_name
            updated_at
            floor
            area
        }
        getRentRoll(project_id: $projectId) {
            id
            user_set_data {
                inventory_column
            }
        }
    }
`;
const GET_DEACTIVATED_PROPERTY_UNITS = gql`
    query Query($projectId: String, $isActive: Boolean) {
        getPropertyUnits(project_id: $projectId, is_active: $isActive) {
            created_at
            details_json
            floor_plan_id
            id
            is_active
            project_id
            rent_roll_id
            unit_name
            updated_at
            floor
            area
        }
    }
`;
const UPDATE_PROPERTY_UNIT = gql`
    mutation UpdatePropertyUnit(
        $unit_id: String
        $unit_name: String
        $floor: String
        $area: Float
    ) {
        updatePropertyUnit(unit_id: $unit_id, unit_name: $unit_name, floor: $floor, area: $area) {
            rent_roll_id
            unit_name
            project_id
            created_at
            is_active
            floor_plan_id
            id
            details_json
            updated_at
            floor
            area
        }
    }
`;

const UnitMixTable = ({ project_id, ...props }: IUnitMixTable) => {
    useEffect(() => {
        getUnitMixData();
        // eslint-disable-next-line
    }, []);
    const { propertyDetails } = useAppSelector((state) => {
        return {
            floorplans: state.projectFloorplans.floorplans,
            propertyDetails: state.propertyDetails.data,
        };
    });
    const dispatch = useAppDispatch();

    const [floorPlans, setFloorPlans] = useState([] as Array<any>);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState("" as any);
    const [units, setUnits] = useState([] as Array<any>);
    const [isLoading, setIsLoading] = useState(false);
    const [preupdateData, setPreupdateData] = useState({} as any);
    const [changedData, setChangedData] = useState({} as any);
    const [searchText, setSearchText] = useState("");
    const [selectAllGround, setSelectAllGround] = React.useState<any>(false);
    const [activeUnits, setActiveUnits] = useState([] as any);
    const [rentRollId, setRentRollId] = useState<string>("");
    async function getUnitMixData() {
        // GET_ALL_FLOOR_PLAN_DATA
        const response: any = await graphQLClient.query("getProjectFloorPlans", GET_UNIT_MIX_DATA, {
            projectId: project_id,
        });
        const deactivatedPropertyUnits: any = await graphQLClient.query(
            "getPropertyUnits",
            GET_DEACTIVATED_PROPERTY_UNITS,
            {
                projectId: project_id,
                isActive: false,
            },
        );
        setFloorPlans(response?.getProjectFloorPlans ?? []);
        setSelectedFloorPlan(response.getProjectFloorPlans?.[0]?.id);
        setRentRollId(response.getRentRoll.id);
        let inventoryColumn = null as any;
        try {
            inventoryColumn = response.getRentRoll.user_set_data.inventory_column;
        } catch (error) {
            TrackerUtil.error(error, {});
        }
        setUnits([
            ...(response?.getPropertyUnits.map((s: any) => {
                let scope = "";
                try {
                    scope = JSON.parse(s.details_json)[inventoryColumn];
                } catch (error) {
                    TrackerUtil.error(error, {});
                }
                return { ...s, scope: scope };
            }) ?? []),
            ...(deactivatedPropertyUnits?.getPropertyUnits.map((s: any) => {
                let scope = "";
                try {
                    scope = JSON.parse(s.details_json)[inventoryColumn];
                } catch (error) {
                    TrackerUtil.error(error, {});
                }
                return { ...s, scope: scope };
            }) ?? []),
        ]);
    }

    useEffect(() => {
        setActiveUnits(units.filter((s) => s.floor_plan_id == selectedFloorPlan));
        //eslint-disable-next-line
    }, [units]);

    useEffect(() => {
        if (searchText) {
            const filteredFloorPlans =
                floorPlans?.filter((s) => {
                    return s.name.toLowerCase().includes(searchText.toLowerCase());
                }) || [];
            if (!filteredFloorPlans.find((fp) => fp.id === selectedFloorPlan)) {
                setSelectedFloorPlan(filteredFloorPlans[0]?.id);
            }
        } else {
            setSelectedFloorPlan(floorPlans[0]?.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    useEffect(() => {
        const activeUnits = units.filter((s) => s.floor_plan_id == selectedFloorPlan);
        let selectDeselect = true;
        for (let i = 0; i < activeUnits.length; i++) {
            if (activeUnits[i].floor === "upper") {
                selectDeselect = false;
                break;
            }
        }
        setActiveUnits(activeUnits);
        setSelectAllGround(selectDeselect);
        //eslint-disable-next-line
    }, [selectedFloorPlan]);
    const refetchUnitMixData = () => {
        getUnitMixData();
        dispatch(
            actions.projectFloorplans.fetchFloorplanDataStart({
                id: propertyDetails.projects?.find((elm: any) => elm.type === "DEFAULT").id,
            }),
        );
    };
    const getTableRow = () => {
        //eslint-disable-next-line

        return map(
            activeUnits.sort((a: { is_active: boolean }, b: { is_active: boolean }) =>
                a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1,
            ),
            (data) => {
                let inventoryValue = null;
                try {
                    const cleanedJsonString = data?.details_json?.replace(/'/g, '"') ?? {}; // Replace single quotes with double quotes
                    const jsonObject = JSON.parse(cleanedJsonString);
                    inventoryValue = jsonObject?.INVENTORY || jsonObject?.Inventory || data?.scope;
                } catch (e) {
                    inventoryValue = data?.scope;
                    console.error(e);
                }

                return (
                    <TableRow>
                        <DataCell>
                            <div style={{ padding: "4px" }}>
                                <TextField
                                    disabled={isLoading || !data.is_active}
                                    onChange={(e) => {
                                        userChangeAction(data.id, "unit_name", e.target.value);
                                    }}
                                    fullWidth
                                    value={data.unit_name}
                                    size="small"
                                    variant="outlined"
                                />
                            </div>
                        </DataCell>
                        <DataCell
                            style={{
                                paddingLeft: "16px",
                            }}
                        >
                            <div style={{ padding: "4px" }}>
                                <TextField
                                    disabled={isLoading || !data.is_active}
                                    type="number"
                                    fullWidth
                                    value={data.area ?? floorPlanMap.get(data.floor_plan_id).area}
                                    onChange={(e) => {
                                        userChangeAction(
                                            data.id,
                                            "area",
                                            Number.parseFloat(e.target.value),
                                        );
                                    }}
                                    size="small"
                                    variant="outlined"
                                />
                            </div>
                        </DataCell>
                        <DataCell>
                            <div style={{ padding: "4px" }}>
                                <Switch
                                    disabled={isLoading || !data.is_active}
                                    checked={data.floor?.toLowerCase() === "ground"}
                                    onChange={(e: any, isChecked: boolean) => {
                                        console.debug({ e });
                                        const value = isChecked ? "ground" : "upper";
                                        userChangeAction(data.id, "floor", value);
                                    }}
                                />
                            </div>
                        </DataCell>
                        <DataCell>
                            <div style={{ padding: "4px" }}>
                                <Typography>{inventoryValue}</Typography>
                            </div>
                        </DataCell>
                        <DataCell>
                            <UnitMixActionMenu
                                projectId={project_id}
                                unitId={data.id}
                                isActive={data?.is_active}
                                refetchUnitMixData={refetchUnitMixData}
                            />
                        </DataCell>
                        {/* {renderInventoryRow(data, fpIndex)} */}
                    </TableRow>
                );
            },
        );
    };
    const onSelectAll = async (ele: any, type: any) => {
        let unitDataCopy = cloneDeep(units);
        let changedDataCopy = cloneDeep(changedData);

        if (type === "ground") {
            unitDataCopy = unitDataCopy.map((elm: any) => {
                if (selectedFloorPlan === elm.floor_plan_id) {
                    const object = changedData[elm.id] ?? {};

                    object["floor"] = selectAllGround ? "upper" : "ground";

                    const _preupdateData = preupdateData ?? {};
                    if (!_preupdateData[elm.id]) {
                        _preupdateData[elm.id] = units.find((s) => s.id == elm.id);
                    }

                    changedDataCopy = { ...changedDataCopy, [elm.id]: object };
                    return { ...elm, floor: selectAllGround ? "upper" : "ground" };
                }
                return elm;
            });
            setChangedData({ ...changedData, ...changedDataCopy });
            setSelectAllGround(!selectAllGround);
        }

        setUnits(unitDataCopy);
    };

    const { enqueueSnackbar } = useSnackbar();
    const showSnackBar = (variant: any, message: string) => {
        enqueueSnackbar("", {
            variant: variant,
            action: <BaseSnackbar variant={variant} title={message} />,
        });
    };

    const floorPlanMap = new Map(floorPlans.map((floorPlan) => [floorPlan.id, floorPlan]));

    async function userChangeAction(unit_id: string, key: string, value: any) {
        const object = changedData[unit_id] ?? {};
        object[key] = value;
        const _preupdateData = preupdateData ?? {};
        if (!_preupdateData[unit_id]) {
            _preupdateData[unit_id] = units.find((s) => s.id == unit_id);
        }
        setPreupdateData({ ...preupdateData, ..._preupdateData });
        setChangedData({ ...changedData, [unit_id]: object });
        setUnits(
            units.map((s) => {
                if (s.id == unit_id) {
                    return { ...s, [key]: value };
                }
                return s;
            }),
        );
    }

    async function sendDataToServer() {
        const update_data = [] as Array<any>;
        Object.keys(changedData).forEach((unit_id) => {
            update_data.push({ unit_id: unit_id, ...changedData[unit_id] });
        });
        if (update_data.length == 0) {
            return;
        }
        setIsLoading(true);
        try {
            const mapped_calls = update_data.map((s) =>
                graphQLClient.mutate("", UPDATE_PROPERTY_UNIT, s),
            );
            const response = await Promise.allSettled(mapped_calls);
            const hasErrors = response.filter((s) => s.status == "rejected").length > 0;
            if (hasErrors) {
                response.forEach((s: any, index: number) => {
                    if (s.status == "rejected") {
                        const unit_id = update_data[index]["unit_id"];
                        let errorDescription =
                            s.reason.graphQLErrors[0].extensions.response.body.error.description;
                        if (errorDescription == "duplicate-unit-names") {
                            errorDescription = `Cannot rename unit '${preupdateData[unit_id]["unit_name"]}' to '${update_data[index]["unit_name"]}'; duplicate unit-name`;
                        }
                        showSnackBar("error", errorDescription);
                        setUnits(
                            units.map((s) => {
                                if (s.id == unit_id) {
                                    return { ...preupdateData };
                                }
                                return s;
                            }),
                        );
                    }
                });
            } else {
                showSnackBar("success", "Successfully Updated Property Units");
            }
            setChangedData({});
            setPreupdateData({});
        } catch (error) {
            TrackerUtil.error(error, {});
        } finally {
            setIsLoading(false);
        }
    }

    async function onDeactivate(id: any) {
        console.log(id);
        return;
    }

    const isSaveDisable = (): boolean => {
        if (Object.keys(changedData).length <= 0) return true;
        else return false;
    };
    const refetchUnits = () => {
        getUnitMixData();
    };
    //eslint-disable-next-line
    const columns = [
        {
            field: "unit_name",
            headerName: "Unit Number",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <div style={{ padding: "4px" }}>
                        <TextField
                            disabled={isLoading}
                            onChange={(e) => {
                                userChangeAction(params.row.id, "unit_name", e.target.value);
                            }}
                            fullWidth
                            value={params.row.unit_name}
                            size="small"
                            variant="outlined"
                        />
                    </div>
                );
            },
        },
        {
            field: "area",
            headerName: "Unit Area (SQ FT)",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <div style={{ padding: "4px" }}>
                        <TextField
                            disabled={isLoading}
                            type="number"
                            fullWidth
                            value={
                                params.row.area ?? floorPlanMap.get(params.row.floor_plan_id).area
                            }
                            onChange={(e) => {
                                userChangeAction(
                                    params.row.id,
                                    "area",
                                    Number.parseFloat(e.target.value),
                                );
                            }}
                            size="small"
                            variant="outlined"
                        />
                    </div>
                );
            },
        },
        {
            field: "floor",
            headerName: () => {
                return <Button>Unit on Ground Floor</Button>;
            },
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <div style={{ padding: "4px" }}>
                        <Switch
                            disabled={isLoading}
                            checked={params.row.floor?.toLowerCase() === "ground"}
                            onChange={(e: any, isChecked: boolean) => {
                                console.debug({ e });
                                const value = isChecked ? "ground" : "upper";
                                userChangeAction(params.row.id, "floor", value);
                            }}
                        />
                    </div>
                );
            },
        },
        {
            field: "scope",
            headerName: "Reno Scope",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <div style={{ padding: "4px" }}>
                        <Typography>{params.row.scope}</Typography>
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "Action",
            type: "actions",
            //eslint-disable-next-line
            getActions: (params: any) => {
                return [
                    <GridActionsCellItem
                        placeholder=""
                        key="edit"
                        // icon={<img src={"Deactivate"} alt="Edit Icon" />}
                        label={"Deactivate"}
                        onClick={() => {
                            onDeactivate?.(params.id as string);
                        }}
                        showInMenu
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    />,
                ];
            },
        },
    ];

    const downloadUnitMixFile = async () => {
        const res = await graphQLClient.query("downloadUnitMixes", DOWNLOAD_UNIT_MIX, {
            projectId: project_id,
        });
        window.open(res.downloadUnitMixes.s3_signed_url);
    };

    return (
        <div {...props}>
            <div style={{ marginBottom: "16px" }}>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        borderBottom: "1px solid #DFE0EB",
                        paddingBottom: "8px",
                        paddingTop: "2px",
                    }}
                >
                    <div
                        style={{
                            borderBottom: "2px solid #004D71",
                            marginTop: "-4px",
                            marginBottom: "-1px",
                        }}
                    >
                        <Typography variant="text_18_semibold">Unit Mix Details</Typography>
                    </div>
                    <Grid marginLeft={"8px"}>
                        <TextField
                            size="small"
                            placeholder="Search by Floorplan Name"
                            onChange={debounce((e) => setSearchText(e.target.value), 200)}
                            style={{ width: "360px" }}
                            inputProps={{
                                autoComplete: "off",
                            }}
                        />
                    </Grid>
                    <div style={{ alignSelf: "end" }}>
                        <Button
                            variant="text"
                            size="large"
                            startIcon={<DownLoad />}
                            onClick={downloadUnitMixFile}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        overflowX: "auto",
                        width: "90%",
                        whiteSpace: "nowrap",
                        gap: "8px",
                        paddingBottom: "12px",
                    }}
                >
                    {floorPlans
                        ?.filter((s) => {
                            return s.name.toLowerCase().includes(searchText.toLowerCase());
                        })
                        .map((s) => (
                            // eslint-disable-next-line
                            <div
                                key={s.id}
                                onClick={() => setSelectedFloorPlan(s.id)}
                                style={{
                                    padding: 8,
                                    border: "1px solid black",
                                    borderRadius: "4px",
                                    flex: "1",
                                    cursor: "pointer",
                                    backgroundColor:
                                        s.id == selectedFloorPlan ? "#DAF3FF" : "white",
                                }}
                            >
                                <Typography>
                                    {s.name} ({s.type})
                                </Typography>
                            </div>
                        ))}
                </div>
                <CreateUnit
                    projectId={project_id}
                    floorPlanId={selectedFloorPlan}
                    rentRollId={rentRollId}
                    refetchUnits={refetchUnits}
                />
            </div>
            {activeUnits.length > 0 && (
                <Box mt={5}>
                    <Box display={"flex"}>
                        <Box sx={{ width: "100%" }}>
                            <Table
                                className="Variation-table"
                                padding="normal"
                                size="small"
                                sx={{
                                    borderCollapse: "separate",
                                    borderSpacing: "0.25rem 0",
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <RegularCell className="Variation-table-header-highlight">
                                            <Typography variant="text_16_semibold">
                                                Unit
                                                <Box>
                                                    <Typography variant="text_16_semibold">
                                                        Number
                                                    </Typography>
                                                </Box>
                                            </Typography>
                                        </RegularCell>
                                        <RegularCell className="Variation-table-regular">
                                            <Typography variant="text_16_semibold">
                                                Unit Area
                                                <Box>
                                                    <Typography variant="text_16_semibold">
                                                        (SQ FT)
                                                    </Typography>
                                                </Box>
                                            </Typography>
                                        </RegularCell>
                                        <RegularCell className="Variation-table-regular">
                                            <Typography variant="text_16_semibold">
                                                Unit on the
                                                <Box>
                                                    <Typography variant="text_16_semibold">
                                                        Ground Floor
                                                    </Typography>

                                                    <Box sx={{ paddingTop: "10px" }}>
                                                        <Button
                                                            sx={{
                                                                width: "96px",
                                                                height: "13px",

                                                                fontFamily: "IBM Plex Sans",
                                                                fontStyle: "normal",
                                                                fontWeight: "500",
                                                                fontSize: "10px",
                                                                lineHeight: "13px",
                                                                /* identical to box height */

                                                                display: "flex",
                                                                alignItems: "center",

                                                                /* v2 colors/Primary/Trust Blue Dark 

                                                                            color: "#00344D",

                                                                            /* Inside auto layout */

                                                                flex: "none",
                                                                order: "0",
                                                                flexGrow: "0",
                                                                justifyContent:
                                                                    "flex-start !important",
                                                                padding:
                                                                    "0px 0px 0px 0px !important",
                                                            }}
                                                            onClick={(ele) =>
                                                                onSelectAll(ele, "ground")
                                                            }
                                                            // disabled={!unitsEditable}
                                                        >
                                                            {selectAllGround
                                                                ? "Deselect all"
                                                                : "Select All"}
                                                            {selectAllGround ? (
                                                                <img
                                                                    src={DeSelectIcon}
                                                                    style={{
                                                                        paddingLeft: "8px",
                                                                    }}
                                                                    alt="deselct icon"
                                                                />
                                                            ) : null}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Typography>
                                        </RegularCell>
                                        <RegularCell className="Variation-table-regular">
                                            <Typography variant="text_16_semibold">
                                                Reno Scope
                                            </Typography>
                                        </RegularCell>
                                        <RegularCell className="Variation-table-regular">
                                            <Typography variant="text_16_semibold">
                                                Action
                                            </Typography>
                                        </RegularCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{getTableRow()}</TableBody>
                            </Table>
                        </Box>
                    </Box>
                </Box>
            )}
            {/* <Box>
                            {anchor && (
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchor}
                                    sx={{ marginTop: "5px" }}
                                    open={Boolean(anchor)}
                                    onClose={closeAnchorMenu}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            setConfirm(true);
                                            setAnchor(null);
                                        }}
                                    >
                                        <Box display="flex" alignItems={"center"}>
                                            <Box mr={2} mt={1}>
                                                <Cross />
                                            </Box>
                                            <Typography variant="text_16_regular">
                                                Remove Inventory
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                </Menu>
                            )}
                        </Box> */}
            {/* {!isSaveDisable() && (
                            <Box mt={6}>
                                <Typography variant="text_14_medium">
                                    Any comments before saving?
                                </Typography>
                                <Box mt={2}>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={3}
                                        placeholder=" Type your comments here"
                                        style={{
                                            width: "100%",
                                            borderRadius: "5px",
                                            border: `1px solid ${AppTheme.border.textarea}`,
                                        }}
                                        onChange={(e) => setRemark(e.target.value)}
                                    />
                                </Box>
                            </Box>
                        )} */}
            <Box display="flex" mt={4}>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ height: "40px", marginRight: "15px" }}
                    onClick={
                        () => {}
                        // isEqual(unitDataDefault?.[selectedFp.id], selectedUnitData)
                        //     ? handleClose()
                        //     : setCancleModal(true)
                    }
                >
                    <Typography variant="text_16_semibold"> Cancel</Typography>
                </Button>
                <Button
                    variant="contained"
                    style={{ height: "40px" }}
                    onClick={sendDataToServer}
                    disabled={isSaveDisable()}
                >
                    <Typography variant="text_16_semibold"> Save</Typography>
                </Button>
            </Box>
        </div>
    );
};

export default UnitMixTable;
