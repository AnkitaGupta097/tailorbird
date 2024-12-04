import React, { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Popover,
    Select,
    Stack,
    TextareaAutosize,
    Tooltip,
    Typography,
    styled,
} from "@mui/material";
import { IRenovation } from "stores/projects/details/budgeting/base-scope";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
// import BaseDataGridPro from "components/data-grid-pro";
import BaseDataGrid from "components/data-grid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useAppSelector } from "stores/hooks";
import AddItemsModal from "./add-items-modal";
import AddMaterialSpecModal from "./add-material-spec";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import actions from "stores/actions";
import successIcon from "assets/icons/check_circle.svg";
import warningIcon from "assets/icons/warning-amber.svg";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MaterialDetails from "./material-details";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Textarea = styled(TextareaAutosize)(
    () => `
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    resize: none;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

type ComponentRenovationItemsProps = {
    componentName: string;
    componentRenovationItems: IRenovation[];
    readOnly?: boolean;
};

const ComponentRenovationItems = ({
    componentName,
    componentRenovationItems,
    readOnly = false,
}: ComponentRenovationItemsProps) => {
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const {
        renovationItems,
        projectContainer,
        projectCodices,
        basePackage,
        projectPackageContents,
    } = useAppSelector((state) => ({
        renovationItems: state.singleProject.renovationWizardV2.renovationItems.data,
        projectContainer: state.singleProject.renovationWizardV2.projectContainer.data,
        projectCodices: state.singleProject.renovationWizardV2.projectCodices.data,
        basePackage: state.singleProject.renovationWizardV2.basePackage.data,
        projectPackageContents: state.singleProject.renovationWizardV2.projectPackageContents.data,
    }));

    const [materialToShow, setMaterialToShow] = useState<any>();
    const [notes, setNotes] = useState<string>();
    const [markOnlyAsNeeded, setMarkOnlyAsNeeded] = useState<boolean>();
    const [currentRenoItemId, setCurrentRenoItemId] = useState<string>();
    const [allowedItems, setAllowedItems] = useState<string[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [showAddItemsModal, setShowAddItemsModal] = useState<boolean>(false);
    const [showAddMaterialSpecModal, setShowAddMaterialSpecModal] = useState<boolean>(false);
    const [renoItemToAddMaterialFor, setRenoItemToAddMaterialFor] = useState<IRenovation>();
    const [newItemsAdded, setNewItemsAdded] = useState<string[]>([]);

    const handleActionChange = (renoItemId: string, action: string, pc_item_id?: string) => {
        if (action === LEAVE_AS_IS) {
            dispatch(
                actions.singleProject.updateRenovationItemsStart([
                    { reno_id: renoItemId, is_hidden: true },
                ]),
            );
        } else {
            dispatch(
                actions.singleProject.updateRenovationItemsStart([
                    { reno_id: renoItemId, pc_item_id: pc_item_id, scope: action },
                ]),
            );
        }
        // dispatch(actions.singleProject.updateRenovationItemsLocally({ renoItemId, action }));
    };

    const handleLocationChange = (renoItemId: string, location: string[]) => {
        dispatch(
            actions.singleProject.updateRenovationItemsStart([
                { reno_id: renoItemId, location: location.join(",") },
            ]),
        );
    };

    const getActionList = (item: string, category: string) => {
        let scopes = projectContainer
            .filter(
                (pc: any) =>
                    pc.item === item &&
                    pc.category === category &&
                    (pc.work_type === "Labor" || pc.work_type === "Material & Labor"),
            )
            .map((pc) => ({ scope: pc.scope, pc_item_id: pc.id }));
        return scopes;
    };

    const getLocationList = (pcItemId: String) => {
        const projectContainerItem = projectContainer.find(
            (pc) => pc.container_item_id === pcItemId,
        );
        if (!projectContainerItem) return [];
        const projectCodicesItem = projectCodices.find(
            (pc) => pc.id === projectContainerItem.project_codex_id,
        );
        return projectCodicesItem?.qualifier || [];
    };

    const getMaterialFromPackage = (materialId: string) => {
        return projectPackageContents.materials?.find((m: any) => m.material_id === materialId);
    };

    const toggleAddItemsModal = () => {
        setShowAddItemsModal(!showAddItemsModal);
    };

    const addItems = (componentName: string) => {
        setSelectedComponent(componentName);
        const existingItems = renovationItems.filter((ri) => ri.is_active).map((ri) => ri.item);
        const allowedItems = projectContainer.filter(
            (pc) =>
                pc.category === componentName &&
                (pc.work_type === "Labor" || pc.work_type === "Material & Labor") &&
                !existingItems.includes(pc.item) &&
                pc.scope === "Add New" &&
                projectCodices.find((codex) => codex.id === pc.project_codex_id)?.qualifier
                    ?.length > 0,
        );
        setAllowedItems(allowedItems);
        toggleAddItemsModal();
    };

    const createNewRenoItems = (selectedContainerItems: any[]) => {
        console.log("selectedContainerItems", selectedContainerItems);
        setNewItemsAdded(selectedContainerItems.map((sci) => sci.item));
        toggleAddItemsModal();
        const addRenoItemsPayload = selectedContainerItems.map((sci: any) => {
            return {
                project_id: projectId,
                pc_item_id: sci.id,
                work_id: null,
                created_by: localStorage.getItem("user_id"),
                is_demand_user_created: true,
            };
        });

        dispatch(actions.singleProject.addRenovationItemsStart(addRenoItemsPayload));
    };

    const toggleAddMaterialSpecModal = () => {
        setShowAddMaterialSpecModal(!showAddMaterialSpecModal);
    };

    const addMaterialSpec = (renoItem: IRenovation) => {
        setRenoItemToAddMaterialFor(renoItem);
        toggleAddMaterialSpecModal();
    };

    const LEAVE_AS_IS = "Leave as is";

    const deleteRenoItem = (renoItemId: string) => {
        console.log("deleting reno-item", renoItemId);
        dispatch(
            actions.singleProject.updateRenovationItemsStart([
                { reno_id: renoItemId, is_active: false },
            ]),
        );
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [materialPopoverAnchorEl, setMaterialPopoverAnchorEl] = useState<HTMLDivElement | null>(
        null,
    );

    const showPopover = (
        event: React.MouseEvent<HTMLButtonElement>,
        renoItemId: string,
        notes: string,
        markOnlyAsNeeded: boolean,
    ) => {
        setAnchorEl(event.currentTarget);
        setCurrentRenoItemId(renoItemId);
        setNotes(notes);
        setMarkOnlyAsNeeded(markOnlyAsNeeded);
    };

    const closePopOver = () => {
        setAnchorEl(null);
        setNotes("");
    };

    const showMaterialPopover = (
        event: React.MouseEvent<HTMLDivElement>,
        material: any,
        renoItemId: string,
    ) => {
        setMaterialPopoverAnchorEl(event.currentTarget);
        setCurrentRenoItemId(renoItemId);
        setMaterialToShow(material);
    };

    const closeMaterialPopOver = () => {
        setMaterialPopoverAnchorEl(null);
        setNotes("");
    };

    const saveNotesAndUpdateRenoItem = () => {
        dispatch(
            actions.singleProject.updateRenovationItemsStart([
                { reno_id: currentRenoItemId, notes: notes, mark_only_as_needed: markOnlyAsNeeded },
            ]),
        );
        closePopOver();
    };

    const componentRenovationItemColumns: GridColDef[] = [
        {
            field: "name",
            flex: 1.5,
            headerName: componentName,
            renderHeader: () => (
                <Box>
                    <Typography variant="text_14_semibold">{componentName}</Typography>
                    {!readOnly && (
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ padding: 1, marginLeft: 1, minWidth: 0 }}
                            onClick={() => addItems(componentName)}
                        >
                            add +
                        </Button>
                    )}
                </Box>
            ),
            renderCell: (params: GridRenderCellParams) => {
                if (params.row.is_demand_user_created && newItemsAdded.includes(params.row.item)) {
                    setTimeout(() => {
                        setNewItemsAdded([]);
                    }, 5000);
                    return (
                        <Box
                            display="flex"
                            p={1}
                            style={{
                                border: "solid 2px #00B779",
                                background: "#F1F8F5",
                                borderRadius: 4,
                            }}
                            marginLeft={2}
                            alignItems="center"
                        >
                            <Box pr={1}>
                                <img src={successIcon} alt="alert" />
                            </Box>
                            <Box>Successfully added</Box>
                        </Box>
                    );
                } else if (!(params.row.scope && params.row.location)) {
                    let warningMsg = "Not found in existing conditions";
                    if (params.row.is_demand_user_created) {
                        warningMsg = "All items required a location";
                    }
                    return (
                        <Tooltip title="All items require at least one location" placement="top">
                            <Box
                                display="flex"
                                p={1}
                                style={{
                                    border: "solid 2px #FFAB00",
                                    background: "#FFF5EA",
                                    borderRadius: 4,
                                }}
                                marginLeft={2}
                                alignItems="center"
                            >
                                <Box pr={1}>
                                    <img src={warningIcon} alt="alert" />
                                </Box>
                                <Box>{warningMsg}</Box>
                            </Box>
                        </Tooltip>
                    );
                } else return <></>;
            },
            sortable: false,
        },
        {
            field: "item",
            headerName: "Item",
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="text_14_regular">{params.row.item}</Typography>
            ),
        },
        {
            field: "scope",
            headerName: "Action",
            flex: 1.5,
            renderCell: (params: GridRenderCellParams) => {
                const { is_hidden, scope, is_demand_user_created, item, category } = params.row;
                if (is_demand_user_created) {
                    return (
                        <Box textAlign="center" pl={5}>
                            <Typography variant="text_16_regular">Add New</Typography>
                        </Box>
                    );
                }
                const actionList = getActionList(item, category);
                let value = scope;
                if (is_hidden) value = LEAVE_AS_IS;
                return (
                    <>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Select
                                value={value}
                                onChange={(e) =>
                                    handleActionChange(
                                        params.row.id,
                                        e.target.value,
                                        actionList.find((a) => a.scope === e.target.value)
                                            ?.pc_item_id,
                                    )
                                }
                                displayEmpty
                                sx={{
                                    boxShadow: "none",
                                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                                }}
                                disabled={readOnly}
                            >
                                {actionList.map((action) => (
                                    <MenuItem key={action.pc_item_id} value={action.scope}>
                                        {action.scope}
                                    </MenuItem>
                                ))}
                                <MenuItem value={LEAVE_AS_IS}>{LEAVE_AS_IS}</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                );
            },
            sortable: false,
        },
        {
            field: "work_id",
            headerName: "Material Spec Selection",
            flex: 1.5,
            renderCell: (params: GridRenderCellParams) => {
                if (params.row.work_type === "Labor") return <></>;
                else if (!readOnly && !params.row.work_id) {
                    return (
                        <Button
                            variant="text"
                            sx={{ color: "#8C9196" }}
                            onClick={() => addMaterialSpec(params.row)}
                            endIcon={<AddCircleOutlineIcon />}
                        >
                            Add Spec
                        </Button>
                    );
                } else {
                    const material = getMaterialFromPackage(params.row.work_id);
                    if (!material) return <></>;
                    return (
                        <Box
                            width={1}
                            onClick={(e) => showMaterialPopover(e, material, params.row.id)}
                            sx={{
                                cursor: "pointer",
                                whiteSpace: "normal !important",
                                wordWrap: "break-word !important",
                            }}
                            display="flex"
                            alignItems="center"
                        >
                            <Typography variant="text_14_regular">
                                {material.name || material.description}
                            </Typography>
                            <ArrowDropDownIcon />
                        </Box>
                    );
                }
            },
            sortable: false,
        },
        {
            field: "location",
            headerName: "Location",
            flex: 1.5,
            renderHeader: () => (
                <Box display="flex" alignItems="center">
                    <Typography variant="text_14_semibold">Location</Typography>
                    <Tooltip
                        title='"Location" is inclusive of all locations across different floorplans.'
                        placement="top"
                    >
                        <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                    </Tooltip>
                </Box>
            ),
            renderCell: (params: GridRenderCellParams) => {
                const { scope, pc_item_id } = params.row;
                const locationList = getLocationList(pc_item_id);
                if (readOnly || scope !== "Add New")
                    return (
                        <Tooltip
                            title={
                                <Box textAlign="left">
                                    {params.row.location?.split(",").map((l: string, i: number) => (
                                        <div key={i}>{l}</div>
                                    ))}
                                </Box>
                            }
                        >
                            <Box textAlign="center">
                                <Typography variant="text_14_regular">
                                    {params.row.location}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                return (
                    <>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Select
                                multiple
                                value={params.row.location?.split(",") || []}
                                onChange={(e) =>
                                    handleLocationChange(params.row.id, e.target.value)
                                }
                                displayEmpty
                                sx={{
                                    boxShadow: "none",
                                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                                }}
                                disabled={readOnly}
                            >
                                {locationList.map((location: any) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                );
            },
            sortable: false,
        },
        {
            field: "options",
            headerName: "Options",
            flex: 0.5,
            renderCell: (params: GridRenderCellParams) => {
                if (params.row.notes || params.row.mark_only_as_needed)
                    return (
                        <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                            sx={{ cursor: "pointer" }}
                        >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    border: "solid 1px #004D71",
                                    padding: "1px 2px",
                                    borderRadius: "50%",
                                    background: "white",
                                }}
                                width={20}
                                height={20}
                            >
                                <Box
                                    sx={{
                                        border: "solid 1px #004D71",
                                        borderRadius: "50%",
                                        background: "#004D71",
                                    }}
                                    width={16}
                                    height={16}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    onClick={(e: any) =>
                                        showPopover(
                                            e,
                                            params.row.id,
                                            params.row.notes,
                                            params.row.mark_only_as_needed,
                                        )
                                    }
                                >
                                    <MoreVertOutlinedIcon sx={{ fontSize: 15, color: "white" }} />
                                </Box>
                            </Box>
                        </Box>
                    );
                else
                    return (
                        <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                            sx={{ cursor: "pointer" }}
                        >
                            <Box
                                sx={{ border: "solid 1px #8C9196", borderRadius: "50%" }}
                                width={20}
                                height={20}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                onClick={(e: any) =>
                                    showPopover(
                                        e,
                                        params.row.id,
                                        params.row.notes,
                                        params.row.mark_only_as_needed,
                                    )
                                }
                            >
                                <MoreVertOutlinedIcon sx={{ fontSize: 15, color: "#8C9196" }} />
                            </Box>
                        </Box>
                    );
            },
            sortable: false,
        },
        {
            field: "delete",
            headerName: "Delete",
            flex: 0.5,
            renderHeader: () => (
                <Box display="flex" alignItems="center">
                    <Typography variant="text_14_semibold">Delete</Typography>
                    <Tooltip
                        title={`A row can be deleted if the item's action is "add new" For other items that do not require work, put "leave as is" for action.`}
                        placement="top"
                    >
                        <InfoOutlinedIcon sx={{ fontSize: 15 }} />
                    </Tooltip>
                </Box>
            ),
            renderCell: (params: GridRenderCellParams) => {
                if (params.row.is_demand_user_created) {
                    return (
                        <Box textAlign="center" width="100%">
                            <IconButton onClick={() => deleteRenoItem(params.row.id)}>
                                <DeleteOutlineIcon sx={{ color: "#8C9196" }} />
                            </IconButton>
                        </Box>
                    );
                } else return "";
            },
            sortable: false,
        },
    ];

    return (
        <Stack id={`component-${componentName}`}>
            <BaseDataGrid
                rows={componentRenovationItems.filter((renoItem: any) => renoItem.is_active)}
                columns={componentRenovationItemColumns}
                rowsPerPageOptions={[]}
                hideToolbar
                hideFooter
                sx={{
                    "& .MuiDataGrid-cell": {
                        padding: 0,
                        maxHeight: "70px !important",
                    },
                }}
                getRowId={(row: any) => row?.id}
            />
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={closePopOver}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box p={2}>
                    <Typography sx={{ p: 2 }}>Leave comment for the Tailorbird team</Typography>
                    <Textarea
                        minRows={3}
                        placeholder="Enter text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={readOnly}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    sx={{
                                        color: "#004D71",
                                        "&.Mui-checked": {
                                            color: "#004D71",
                                        },
                                    }}
                                    checked={markOnlyAsNeeded}
                                    onChange={() => setMarkOnlyAsNeeded(!markOnlyAsNeeded)}
                                    disabled={readOnly}
                                />
                            }
                            label='Mark as "only as needed"'
                        />
                    </FormGroup>
                    {!readOnly && (
                        <Box display="flex" justifyContent="end">
                            <Button variant="contained" onClick={saveNotesAndUpdateRenoItem}>
                                Save
                            </Button>
                        </Box>
                    )}
                </Box>
            </Popover>

            <Popover
                open={Boolean(materialPopoverAnchorEl)}
                anchorEl={materialPopoverAnchorEl}
                onClose={closeMaterialPopOver}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <MaterialDetails
                    renoItemId={currentRenoItemId!}
                    material={materialToShow}
                    closePopover={closeMaterialPopOver}
                />
            </Popover>

            {showAddItemsModal && (
                <AddItemsModal
                    open={showAddItemsModal}
                    allowedItems={allowedItems}
                    onClose={toggleAddItemsModal}
                    onDone={createNewRenoItems}
                    componentName={selectedComponent}
                />
            )}

            {showAddMaterialSpecModal && (
                <AddMaterialSpecModal
                    open={showAddMaterialSpecModal}
                    onClose={toggleAddMaterialSpecModal}
                    onDone={addMaterialSpec}
                    renoItemToAddMaterialFor={renoItemToAddMaterialFor!}
                    packageId={basePackage.package_id}
                />
            )}
        </Stack>
    );
};

export default ComponentRenovationItems;
