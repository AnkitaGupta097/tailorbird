import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Switch,
    Typography,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCellProps,
    TableHead,
    TextFieldProps,
    styled,
    TableRow,
    IconButton,
    Tooltip,
    DialogProps,
    TableCell,
    Button,
    MenuItem,
    Menu,
    TextareaAutosize,
} from "@mui/material";
import AddIcon from "../../../../../assets/icons/icon-add.svg";
import { ReactComponent as TickIcon } from "../../../../../assets/icons/tick-icon.svg";
import { ReactComponent as CloseCircle } from "../../../../../assets/icons/close-circle.svg";
import BaseIconButton from "../../../../../components/base-icon-button";
import { map, cloneDeep, isEmpty, filter, flatMap, findIndex, isEqual } from "lodash";
import AppTheme from "../../../../../styles/theme";
import { useParams } from "react-router-dom";
import actions from "../../../../../stores/actions";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import { getUnitDetail } from "../service";
import { useAppSelector, useAppDispatch } from "../../../../../stores/hooks";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { ReactComponent as ErrorIcon } from "../../../../../assets/icons/error-icon.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ConfirmationModal from "../../../../../components/confirmation-modal";
import { ReactComponent as Cross } from "../../../../../assets/icons/close-red-icon.svg";
import ErrorGrid from "../common/error-grid";
import BaseSnackbar from "../../../../../components/base-snackbar";
import { useSnackbar } from "notistack";
import { graphQLClient } from "utils/gql-client";
import { UPDATE_UNIT_MIX } from "stores/projects/details/floor-plans/floor-plans-mutations";
import DeSelectIcon from "../../../../../assets/icons/deselect.svg";

interface IUnitMixModal {
    isOpen: boolean;
    handleClose: any;
    unitsEditable: boolean;
}

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

const StyledSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-switchBase": {
        "&.Mui-checked": {
            "& + .MuiSwitch-track": {
                background: theme.background.info,
                border: "1.5px solid #004D71",
            },
            "& .MuiSwitch-thumb": {
                color: theme.text.info,
            },
        },
    },
    "& .MuiSwitch-track": {
        border: `1.5px solid ${theme.border.outer}`,
        backgroundColor: theme.background.header,
        borderRadius: 22 / 2,
        height: "88%",
        "&:before, &:after": {
            content: '""',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
        },
    },
    "& .MuiSwitch-thumb": {
        color: theme.border.outer,
        boxShadow: "none",
        width: 16,
        height: 16,
        margin: 2,
    },
}));

const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
    input: {
        fontFamily: "IBM Plex Sans Regular",
        fontWeight: "400",
        fontSize: "0.87rem",
        lineHeight: "1.125rem",
        height: "21px",
        paddingTop: "0px",
        paddingBottom: "0px",
    },
    div: {
        backgroundColor: AppTheme.common.white,
    },
}));

const StyledDialog = styled(Dialog)<DialogProps>(() => ({
    "& .MuiPaper-root": {
        maxWidth: "100%",
        padding: "15px",
    },
}));

const UnitMixModal = ({ isOpen, handleClose, unitsEditable }: IUnitMixModal) => {
    const { projectId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const { unitMix, projectDetails } = useAppSelector((state: any) => ({
        unitMix: state.projectFloorplans.unitMix,
        projectDetails: state.projectDetails.data,
    }));

    const [selectedFp, setSelectedFp] = useState<any>(unitMix.projectFloorPlan[0]);
    const [unitData, setUnitData] = useState<any>(null);
    const [unitDataDefault, setUnitDataDefault] = useState<any>(null);
    const [selectedUnitData, setSelectedUnitData] = useState<any>(null);
    const [confirm, setConfirm] = useState(false);
    const [cancleModal, setCancleModal] = useState(false);
    const [remark, setRemark] = useState("");
    const [inventory, setInventory] = useState<any>(null);
    const [inventoryDefault, setInventoryDefault] = useState<any>(null);
    const [unselectedInventory, setUnselectedInventory] = useState<any>([]);
    const [duplicateUnit, setDuplicateUnit] = useState<any>([]);
    const [isChecked, setIsChecked] = useState<any>(false);
    const [isRowErrorChecked, setIsRowErrorChecked] = useState<any>(false);
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
    const [inventoryIndexData, setInventoryIndexData] = React.useState<any>(null);
    const [selectAllIsReno, setSelectAllIsReno] = React.useState<any>(false);
    const [selectAllGround, setSelectAllGround] = React.useState<any>(false);
    const [selectAllInventory, setSelectAllInventory] = React.useState<any>([]);

    useEffect(() => {
        setUnitData(getUnitDetail(unitMix));
        setInventory(unitMix.inventory);
        setInventoryDefault(unitMix.inventory);
        setUnitDataDefault(getUnitDetail(unitMix));
        // eslint-disable-next-line
    }, [unitMix]);
    useEffect(() => {
        if (unitData) {
            !isChecked && !isRowErrorChecked && setSelectedUnitData(unitData[selectedFp.id]);
        }
        // eslint-disable-next-line
    }, [unitData]);

    const onInventoryClick = (ele: any, index: any, iData: any) => {
        setAnchor(ele.target);
        setInventoryIndexData({ index, ...iData });
    };

    const updateInventoryName = (ele: any, iData: any, index: any) => {
        iData = { ...iData, name: ele.target.value };
        const arrInventory = cloneDeep(inventory);
        arrInventory[index] = iData;
        setInventory([...arrInventory]);
    };

    const onSelectAll = async (ele: any, type: any, inventoryIndex: any = null) => {
        let selectedUnitDataCopy = cloneDeep(selectedUnitData);
        const unitDataCopy = cloneDeep(unitData);

        if (type === "is_reno") {
            selectedUnitDataCopy = selectedUnitDataCopy.map((elm: any) => {
                return { ...elm, is_renovated: !selectAllIsReno };
            });
            setSelectAllIsReno(!selectAllIsReno);
        } else if (type === "ground") {
            selectedUnitDataCopy = selectedUnitDataCopy.map((elm: any) => {
                return { ...elm, floor: selectAllGround ? "upper" : "ground" };
            });
            setSelectAllGround(!selectAllGround);
        } else if (type === "inventory") {
            if (selectAllInventory[inventoryIndex]) {
                selectedUnitDataCopy = selectedUnitDataCopy.map((elm: any) => {
                    return { ...elm, inventory_index: null };
                });
            } else {
                if (isChecked) {
                    setUnselectedInventory([]);
                    setIsChecked(false);
                }
                selectedUnitDataCopy = selectedUnitDataCopy.map((elm: any) => {
                    return { ...elm, inventory_index: inventoryIndex };
                });
            }
            setSelectedUnitData([...selectedUnitDataCopy]);
            unitDataCopy[selectedFp.id] = selectedUnitDataCopy;
            setUnitData(unitDataCopy);

            const selectAllInventoryCopy = cloneDeep(selectAllInventory);

            if (selectAllInventory[inventoryIndex] === false) {
                selectAllInventory.map((elm: any, index: any) => {
                    if (index === inventoryIndex)
                        selectAllInventoryCopy[index] = !selectAllInventory[inventoryIndex];
                    else selectAllInventoryCopy[index] = selectAllInventory[inventoryIndex];
                });
            } else {
                selectAllInventoryCopy[inventoryIndex] = !selectAllInventory[inventoryIndex];
            }

            setSelectAllInventory(selectAllInventoryCopy);
        }

        setSelectedUnitData([...selectedUnitDataCopy]);
        unitDataCopy[selectedFp.id] = selectedUnitDataCopy;
        setUnitData(unitDataCopy);
    };

    const getDeletionIcon = (iData: any, index: any) => {
        return (
            <IconButton
                id="demo-positioned-button"
                aria-controls={"demo-positioned-menu"}
                onClick={(e: any) => {
                    iData.isDefault ? null : onInventoryClick(e, index, iData);
                }}
                sx={{ padding: "0px", paddingLeft: "4px" }}
            >
                <PendingOutlinedIcon
                    sx={{
                        transform: "rotate(90deg)",
                        fontSize: "20px",
                    }}
                    htmlColor={iData.isDefault ? AppTheme.border.outer : AppTheme.text.info}
                />
            </IconButton>
        );
    };
    const getInventoryColumn = () => {
        return map(inventory, (i, index) => {
            return (
                <RegularCell className="Variation-table-regular">
                    <Typography variant="text_16_semibold">Inventory {index + 1}</Typography>
                    <Box display="flex" alignItems="center">
                        <StyledTextField
                            label=""
                            onChange={(e: any) => updateInventoryName(e, i, index)}
                            value={i.name}
                            sx={{
                                width: "8rem",
                                "& div": {
                                    border: `1px solid ${
                                        isEmpty(i.name)
                                            ? AppTheme.text.error
                                            : AppTheme.palette.text.primary
                                    }`,
                                    borderRadius: "5px",
                                },
                                "& fieldset": {
                                    border: "none",
                                },
                            }}
                        />
                        {i.isDefault ? (
                            <Tooltip
                                title={
                                    <Typography variant="text_12_medium">
                                        The base inventory cannot be removed.
                                    </Typography>
                                }
                                arrow
                            >
                                {getDeletionIcon(i, index)}
                            </Tooltip>
                        ) : (
                            getDeletionIcon(i, index)
                        )}
                    </Box>
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

                                /* v2 colors/Primary/Trust Blue Dark */

                                color: "#00344D",

                                /* Inside auto layout */

                                flex: "none",
                                order: "0",
                                flexGrow: "0",
                                justifyContent: "flex-start !important",
                                padding: "0px 0px 0px 0px !important",
                            }}
                            onClick={(ele) => onSelectAll(ele, "inventory", index)}
                        >
                            {selectAllInventory[index] ? "Deselect all" : "Select All"}

                            {selectAllInventory[index] ? (
                                <img
                                    src={DeSelectIcon}
                                    style={{ paddingLeft: "8px" }}
                                    alt="deselct icon"
                                />
                            ) : null}
                        </Button>
                    </Box>
                </RegularCell>
            );
        });
    };

    const onCellClick = (iIndex: number, fpIndex: number) => {
        const selectedUnitDataCopy = cloneDeep(selectedUnitData);
        const unitDataCopy = cloneDeep(unitData);
        const unselectedInventoryCopy = cloneDeep(unselectedInventory);
        if (isChecked) {
            const data = unselectedInventoryCopy.splice(fpIndex, 1);
            unitDataCopy[selectedFp.id] = map(unitDataCopy[selectedFp.id], (value) => {
                return data[0].id == value.id
                    ? { ...value, inventory_index: iIndex }
                    : { ...value };
            });
            setUnitData(unitDataCopy);
            setUnselectedInventory([...unselectedInventoryCopy]);
            setSelectedUnitData([...unselectedInventoryCopy]);
            if (isEmpty(unselectedInventoryCopy)) {
                setIsChecked(false);
            }
        } else {
            selectedUnitDataCopy[fpIndex].inventory_index = iIndex;
            setSelectedUnitData([...selectedUnitDataCopy]);
            unitDataCopy[selectedFp.id] = selectedUnitDataCopy;
            setUnitData(unitDataCopy);
        }
    };

    const removeInventorySelection = (fpIndex: number) => {
        const selectedUnitDataCopy = cloneDeep(selectedUnitData);
        const unitDataCopy = cloneDeep(unitData);
        selectedUnitDataCopy[fpIndex].inventory_index = null;
        setSelectedUnitData([...selectedUnitDataCopy]);
        unitDataCopy[selectedFp.id] = selectedUnitDataCopy;
        setUnitData(unitDataCopy);
    };

    const renderInventoryRow = (data: any, fpIndex: any) => {
        return map(inventory, (i, index: any) => {
            if (data.inventory_index !== null) {
                return data.inventory_index == index ? (
                    <DataCell>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            px={4}
                            sx={{
                                height: "inherit",
                                background: data.is_renovated
                                    ? AppTheme.background.info
                                    : AppTheme.background.header,
                            }}
                        >
                            <Box>
                                <TickIcon />
                            </Box>
                            {data.is_renovated && (
                                <Box
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => removeInventorySelection(fpIndex)}
                                >
                                    <CloseCircle />
                                </Box>
                            )}
                        </Box>
                    </DataCell>
                ) : (
                    <DataCell
                        sx={{ cursor: "pointer", height: "100%" }}
                        onClick={() => data.is_renovated && onCellClick(index, fpIndex)}
                    ></DataCell>
                );
            } else {
                return data.is_renovated ? (
                    <DataCell
                        sx={{ cursor: "pointer", height: "100%" }}
                        onClick={() => data.is_renovated && onCellClick(index, fpIndex)}
                    >
                        <ErrorIcon style={{ paddingLeft: "16px" }} />
                    </DataCell>
                ) : (
                    <DataCell sx={{ cursor: "pointer", height: "100%" }}>
                        <HelpOutlineIcon
                            style={{ color: AppTheme.border.outer, paddingLeft: "16px" }}
                        />
                    </DataCell>
                );
            }
        });
    };

    const updateRenovation = (ele: any, fpIndex: any) => {
        const selectedUnitDataCopy = cloneDeep(selectedUnitData);
        const unitDataCopy = cloneDeep(unitData);
        selectedUnitDataCopy[fpIndex].is_renovated = ele.target.checked;
        setSelectedUnitData([...selectedUnitDataCopy]);
        unitDataCopy[selectedFp.id] = selectedUnitDataCopy;
        setUnitData(unitDataCopy);
    };

    const updateFloor = (ele: any, fpIndex: any) => {
        const selectedUnitDataCopy = cloneDeep(selectedUnitData);
        const unitDataCopy = cloneDeep(unitData);
        selectedUnitDataCopy[fpIndex].floor = ele.target.checked ? "ground" : "upper";
        setSelectedUnitData([...selectedUnitDataCopy]);
        unitDataCopy[selectedFp.id] = selectedUnitDataCopy;
        setUnitData(unitDataCopy);
    };

    const updateUnitNumber = (ele: any, data: any, index: any) => {
        const unitDataCopy = cloneDeep(unitData);
        const duplicateUnitCopy = cloneDeep(duplicateUnit);
        if (isRowErrorChecked) {
            unitDataCopy[data.floor_plan_id] = map(unitDataCopy[data.floor_plan_id], (value) => {
                return data.id == value.id
                    ? { ...value, unit_name: ele.target.value }
                    : { ...value };
            });
        } else {
            unitDataCopy[data.floor_plan_id][index].unit_name = ele.target.value;
        }
        const duplicateIndex = findIndex(duplicateUnitCopy, { id: data.id });
        if (duplicateIndex >= 0) {
            duplicateUnitCopy.splice(duplicateIndex, 1);
        }
        const duplicates = filter(
            flatMap(unitDataCopy),
            (unit: any) => unit.unit_name == ele.target.value,
        );
        if (duplicates.length > 1) {
            setDuplicateUnit([...duplicateUnitCopy, unitDataCopy[data.floor_plan_id][index]]);
        } else {
            setDuplicateUnit(duplicateUnitCopy);
        }
        if (duplicates.length == 1 && isEmpty(duplicateUnitCopy)) {
            setSelectedUnitData(unitDataCopy[selectedFp.id]);
            setIsRowErrorChecked(false);
        } else {
            setSelectedUnitData(duplicateUnitCopy);
        }
        setUnitData(unitDataCopy);
    };

    const isUnitDuplicate = (data: any) => {
        const duplicates = filter(
            flatMap(unitData),
            (unit: any) => unit.unit_name == data.unit_name,
        );
        return duplicates.length > 1 ? true : false;
    };

    const getTableRow = () => {
        return map(selectedUnitData, (data, fpIndex) => {
            return (
                <TableRow>
                    <DataCell>
                        <StyledSwitch
                            checked={data.is_renovated}
                            onChange={(e: any) => updateRenovation(e, fpIndex)}
                        />
                    </DataCell>
                    <DataCell>
                        <StyledTextField
                            disabled={!unitsEditable}
                            label=""
                            sx={{
                                width: "8rem",
                                height: "100%",
                                "& div": {
                                    height: "inherit",
                                },
                                "& input": {
                                    height: "30px",
                                    border: `1px solid ${
                                        isUnitDuplicate(data)
                                            ? AppTheme.text.error
                                            : AppTheme.palette.text.primary
                                    }`,
                                    borderRadius: "5px",
                                },
                                "& fieldset": {
                                    border: "none",
                                },
                            }}
                            onChange={(e: any) => updateUnitNumber(e, data, fpIndex)}
                            value={data.unit_name}
                        />
                    </DataCell>
                    <DataCell
                        style={{
                            paddingLeft: "16px",
                        }}
                    >
                        <Typography variant="text_16_regular">{data.area}</Typography>
                    </DataCell>
                    <DataCell>
                        <StyledSwitch
                            disabled={!unitsEditable}
                            checked={data.floor == "ground"}
                            onChange={(e: any) => updateFloor(e, fpIndex)}
                        />
                    </DataCell>
                    {renderInventoryRow(data, fpIndex)}
                </TableRow>
            );
        });
    };

    const onInventoryDelete = () => {
        const inventoryCopy = cloneDeep(inventory);
        const unitDataCopy = cloneDeep(unitData);
        unitDataCopy[selectedFp.id] = map(unitDataCopy[selectedFp.id], (value) => {
            return inventoryIndexData.index == value.inventory_index
                ? { ...value, inventory_index: null }
                : { ...value };
        });
        inventoryCopy.splice(Number(inventoryIndexData.index), 1);
        setUnitData(unitDataCopy);
        setInventory([...inventoryCopy]);
        setInventoryIndexData(null);
        setConfirm(false);
    };

    const closeAnchorMenu = () => {
        setAnchor(null);
    };

    const addInventory = () => {
        setInventory([...inventory, { id: "", isDefault: false, name: "" }]);
    };

    useEffect(() => {
        const inventorySelectedMap: any = {};
        const filterData = filter(selectedUnitData, (data) => {
            if (!inventorySelectedMap[data.inventory_index]) {
                inventorySelectedMap[data.inventory_index] = 0;
            }
            inventorySelectedMap[data.inventory_index]++;
            return data.is_renovated && data.inventory_index == null;
        });
        setUnselectedInventory(filterData);

        const selectAllInventoryCopy = cloneDeep(selectAllInventory);

        Object.keys(inventorySelectedMap).map((elm: any) => {
            if (inventorySelectedMap[elm] === 0) {
                selectAllInventoryCopy[elm] = false;
            } else if (inventorySelectedMap[elm] === selectedUnitData.length) {
                selectAllInventoryCopy[elm] = true;
            } else {
                selectAllInventoryCopy[elm] = false;
            }
        });

        setSelectAllInventory(selectAllInventoryCopy);

        let selectedUnitDataCopy = cloneDeep(selectedUnitData);

        let i = 0;
        let countReno = 0,
            countGround = 0;
        while (selectedUnitDataCopy?.length > i) {
            if (selectedUnitDataCopy[i].is_renovated === true) {
                countReno++;
            }
            if (selectedUnitDataCopy[i].floor === "ground") {
                countGround++;
            }
            i++;
        }

        setSelectAllGround(countGround === i);
        setSelectAllIsReno(countReno === i);
        // eslint-disable-next-line
    }, [selectedUnitData]);

    const totalRenoUnit =
        selectedUnitData &&
        filter(selectedUnitData, (data) => {
            return data.is_renovated;
        });

    const onCheckBoxChange = (ele: any) => {
        if (ele.target.checked) {
            setSelectedUnitData(unselectedInventory);
        } else {
            const unitDataCopy = cloneDeep(unitData);
            setSelectedUnitData(unitDataCopy[selectedFp.id]);
        }
        setIsChecked(ele.target.checked);
    };

    const isSaveDisable = () => {
        if (!isEmpty(unselectedInventory)) {
            return true;
        }
        if (!isEmpty(duplicateUnit)) {
            return true;
        }
        const emptyName = filter(inventory, (data) => {
            return isEmpty(data.name);
        });
        if (emptyName.length > 0) {
            return true;
        }
        if (
            isEqual(unitDataDefault?.[selectedFp.id], selectedUnitData) &&
            unitDataDefault &&
            isEqual(inventoryDefault, inventory) &&
            inventoryDefault
        ) {
            return true;
        }

        return false;
    };

    const onSave = async () => {
        const payload = {
            floor_plan_id: selectedFp.id,
            inventories: map(inventory, (val) => val.name),
            project_id: projectId,
            remark: remark,
            user_id: projectDetails.userId,
            unit_mix: map(selectedUnitData, (data) => ({
                inventory_id: data.inventory_index,
                is_renovated: data.is_renovated,
                unit_id: data.id,
                unit_name: data.unit_name,
                floor: data.floor,
            })),
        };
        dispatch(actions.projectFloorplans.updateUnitMixStart(""));
        try {
            const res = await graphQLClient.mutate("updateUnitMix", UPDATE_UNIT_MIX, {
                input: payload,
            });
            if (res?.success) {
                dispatch(actions.projectFloorplans.fetchUnitMixDataStart(projectId));
                dispatch(actions.projectFloorplans.fetchFloorplanDataStart({ id: projectId }));
                dispatch(
                    actions.projectFloorplans.fetchUserRemarkStart({
                        projectId,
                        location: "unit_mix_edit",
                    }),
                );
            } else {
                enqueueSnackbar("", {
                    variant: "error",
                    action: <BaseSnackbar variant="error" title="Error" description={res?.error} />,
                });
                dispatch(actions.projectFloorplans.updateUnitMixFailure(""));
            }
        } catch (error) {
            enqueueSnackbar("", {
                variant: "error",
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="Error"
                        description="Unable to update the sheet."
                    />
                ),
            });
            dispatch(actions.projectFloorplans.updateUnitMixFailure(""));
        }
    };

    const toggleErrorRow = (ele: any) => {
        if (ele.target.checked) {
            setSelectedUnitData(duplicateUnit);
        } else {
            const unitDataCopy = cloneDeep(unitData);
            setSelectedUnitData(unitDataCopy[selectedFp.id]);
        }
        setIsRowErrorChecked(ele.target.checked);
    };

    const fPSelection = () => {
        if (!isEqual(unitDataDefault?.[selectedFp.id], selectedUnitData)) {
            enqueueSnackbar("", {
                variant: "error",
                action: (
                    <BaseSnackbar
                        variant="error"
                        title="Error"
                        description="Save changes before selecting a different floorplan type."
                    />
                ),
            });
        }
    };

    return (
        <StyledDialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Box display={"flex"} alignItems="center">
                    <Box mr={4}>
                        <Typography variant="text_18_semibold">Select Floorplan Type</Typography>
                    </Box>
                    <Box width="300px" onClick={fPSelection}>
                        <Autocomplete
                            sx={{ "& div div": { height: "48px" } }}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setSelectedFp(newValue);
                                    setSelectedUnitData(unitData[newValue.id]);
                                }
                            }}
                            fullWidth
                            freeSolo
                            value={
                                selectedFp
                                    ? selectedFp?.label
                                        ? selectedFp.label
                                        : `${selectedFp.type} - ${selectedFp.name}`
                                    : ""
                            }
                            clearOnBlur
                            selectOnFocus
                            options={map(unitMix.projectFloorPlan, (value: any) => ({
                                label: `${value.type} - ${value.name}`,
                                ...value,
                            }))}
                            disabled={
                                isEqual(unitDataDefault?.[selectedFp.id], selectedUnitData)
                                    ? false
                                    : true
                            }
                            popupIcon={<KeyboardArrowDownIcon />}
                            forcePopupIcon
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                {selectedUnitData && (
                    <Box mt={5}>
                        {unselectedInventory.length > 0 && (
                            <ErrorGrid
                                onCheck={(e: any) => {
                                    onCheckBoxChange(e);
                                }}
                                title={` Inventory not selected for ${unselectedInventory.length} Reno
                    Unit`}
                                actionText=" Show only unselected"
                            />
                        )}
                        {duplicateUnit.length > 0 && (
                            <ErrorGrid
                                onCheck={(e: any) => {
                                    toggleErrorRow(e);
                                }}
                                title="Unit numbers entered below already exist"
                                actionText=" only show error row"
                            />
                        )}
                        <Box display={"flex"}>
                            <Box>
                                <Table
                                    className="Variation-table"
                                    padding="normal"
                                    size="small"
                                    sx={{ borderCollapse: "separate", borderSpacing: "0.25rem 0" }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <RegularCell className="Variation-table-header-highlight">
                                                <Typography variant="text_16_semibold">
                                                    Reno Units
                                                    <Box>
                                                        <Typography variant="text_16_semibold">
                                                            {totalRenoUnit.length}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ paddingTop: "10px" }}>
                                                        <Typography variant="text_16_semibold">
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

                                                                    /* v2 colors/Primary/Trust Blue Dark */

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
                                                                    onSelectAll(ele, "is_reno")
                                                                }
                                                            >
                                                                {selectAllIsReno
                                                                    ? "Deselect all"
                                                                    : "Select All"}
                                                                {selectAllIsReno ? (
                                                                    <img
                                                                        src={DeSelectIcon}
                                                                        style={{
                                                                            paddingLeft: "8px",
                                                                        }}
                                                                        alt="deselct icon"
                                                                    />
                                                                ) : null}
                                                            </Button>
                                                        </Typography>
                                                    </Box>
                                                </Typography>
                                            </RegularCell>
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

                                                                    /* v2 colors/Primary/Trust Blue Dark */

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
                                                                disabled={!unitsEditable}
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
                                            {getInventoryColumn()}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>{getTableRow()}</TableBody>
                                </Table>
                            </Box>
                            <Box
                                px={2.5}
                                sx={{
                                    background: AppTheme.palette.secondary.main,
                                    height: "auto",
                                }}
                                display="flex"
                                alignItems={"center"}
                            >
                                <BaseIconButton
                                    icon={AddIcon}
                                    onClick={addInventory}
                                    classes="Variation-item-icon-button"
                                />
                            </Box>{" "}
                        </Box>
                    </Box>
                )}
                <Box>
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
                </Box>
                {!isSaveDisable() && (
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
                                    resize: "none",
                                }}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </Box>
                    </Box>
                )}
                <Box display="flex" mt={4}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ height: "40px", marginRight: "15px" }}
                        onClick={() =>
                            isEqual(unitDataDefault?.[selectedFp.id], selectedUnitData)
                                ? handleClose()
                                : setCancleModal(true)
                        }
                    >
                        <Typography variant="text_16_semibold"> Cancel</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        style={{ height: "40px" }}
                        onClick={onSave}
                        disabled={isSaveDisable()}
                    >
                        <Typography variant="text_16_semibold"> Save</Typography>
                    </Button>
                </Box>
                {confirm && (
                    <ConfirmationModal
                        text={`Are you sure you want to remove Inventory ${
                            inventoryIndexData?.index + 1
                        }?`}
                        onCancel={() => setConfirm(false)}
                        onProceed={onInventoryDelete}
                        open={confirm}
                        variant="deletion"
                        actionText="Delete"
                    />
                )}

                {cancleModal && (
                    <ConfirmationModal
                        text={
                            <Typography variant="text_18_regular">
                                Go back and save changes to unit mix table?
                                <Box mt={0.5}>If you don’t save, changes will be lost.</Box>
                            </Typography>
                        }
                        onCancel={() => setCancleModal(false)}
                        onProceed={handleClose}
                        open={cancleModal}
                        variant="deletion"
                        actionText="Don’t save"
                        cancelText="Go back"
                    />
                )}
            </DialogContent>
        </StyledDialog>
    );
};

export default UnitMixModal;
