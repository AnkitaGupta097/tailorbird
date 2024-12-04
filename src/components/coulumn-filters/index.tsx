import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Checkbox,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    InputLabel,
    Stack,
    Switch,
    TextField,
    Typography,
    darken,
    lighten,
    styled,
} from "@mui/material";
import BaseButton from "components/button";
import { FILTER_CHIP_BG_COLOR } from "modules/projects/details/rfp-manager/rfp-manager-2.0/tabs/bid-leveling/constants";
import React from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" htmlColor="#CCC" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const incomplete = <IndeterminateCheckBoxIcon fontSize="small" />;

const GroupHeader = styled("div")(({ theme }) => ({
    position: "sticky",
    top: "-8px",
    padding: "4px 10px",
    color: theme.palette.primary.main,
    backgroundColor:
        theme.palette.mode === "light"
            ? lighten(theme.palette.primary.light, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled("ul")({
    padding: 0,
});

//TODO: Change checkIcon
const CustomizedSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
        borderRadius: 22 / 2,
        "&:before, &:after": {
            content: '""',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
        },
        "&:before": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        "&:after": {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "none",
        width: 16,
        height: 16,
        margin: 2,
    },
}));

type ColumnFiltersType = {
    expanded: boolean;
    onClearFilters: Function;
    setExpanded: Function;
    areFiltersApplied: boolean;
    contractors: Array<string>;
    inventories: Array<string>;
    floorplans: Array<{ fp_name: string; bed_bath_count: string }>;
    onContractorsChange: Function;
    onInventoriesChange: Function;
    onFloorplanChange: Function;
    showInventory: boolean;
    showFloorplan: boolean;
    selectedContractors: Array<string>;
    selectedInventories: Array<string>;
    selectedFloorplans: Array<{ fp_name: string; bed_bath_count: string }>;
    onChangeShowFloorplan: Function;
    onChangeShowInventories: Function;
    onApply: Function;
    onCancel: Function;
    isDisabled: boolean;
};

const TEXT_CONSTANTS = {
    COL_DETAILS: "Column Details",
    CLEAR_FILTERS: "Clear all Filters",
    CONTRACTORS: "Contractors",
    INVENTORIES: "Inventories",
    FLOOR_PLAN: "Floor Plans",
    CANCEL: "Cancel",
    APPLY: "Apply",
};

const ColumnFilters: React.FC<ColumnFiltersType> = ({
    expanded,
    onClearFilters,
    setExpanded,
    areFiltersApplied,
    inventories,
    contractors,
    floorplans,
    onContractorsChange,
    onInventoriesChange,
    onFloorplanChange,
    selectedContractors,
    selectedFloorplans,
    selectedInventories,
    showFloorplan,
    showInventory,
    onChangeShowFloorplan,
    onChangeShowInventories,
    onCancel,
    onApply,
    isDisabled,
}) => {
    return (
        <Accordion
            expanded={expanded}
            disabled={isDisabled}
            onChange={() => setExpanded(!open)}
            sx={{
                border: "1px solid #CCCCCC",
            }}
        >
            <AccordionSummary sx={{ m: "0 1rem" }}>
                <Stack direction="column" width="100%">
                    <Stack direction="row" alignItems="center">
                        <Typography variant="text_18_medium">
                            {TEXT_CONSTANTS.COL_DETAILS}{" "}
                            {isDisabled && <CircularProgress size={20} />}
                        </Typography>
                        <Stack
                            direction="row"
                            alignItems="center"
                            ml="1rem"
                            sx={{
                                visibility: !areFiltersApplied ? "hidden" : "visible",
                            }}
                        >
                            <FiberManualRecordIcon htmlColor="#00B779" fontSize="small" />
                            <IconButton onClick={() => onClearFilters()}>
                                <CloseIcon fontSize="small" />
                                <Typography variant="text_14_medium">
                                    {TEXT_CONSTANTS.CLEAR_FILTERS}
                                </Typography>
                            </IconButton>
                        </Stack>
                        <KeyboardArrowDownIcon
                            sx={{
                                marginLeft: "auto",
                                marginRight: 0,
                                transform: expanded ? "rotate(180deg)" : "none",
                            }}
                        />
                    </Stack>
                    {expanded ? <Divider flexItem /> : null}
                </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ m: "0 1rem" }}>
                <Grid container direction="row">
                    <Grid xs={12} item>
                        <InputLabel htmlFor="contractors-list">
                            <Typography variant="text_14_medium" color="#202223">
                                {TEXT_CONSTANTS.CONTRACTORS}
                            </Typography>
                        </InputLabel>
                        <Autocomplete
                            //TODO: Define object type for this
                            options={contractors}
                            multiple
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            ChipProps={{
                                sx: {
                                    borderRadius: "5px",
                                    bgcolor: FILTER_CHIP_BG_COLOR,
                                },
                                deleteIcon: <CloseIcon fontSize="small" />,
                            }}
                            value={selectedContractors}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                            id="contractors-list"
                            onChange={(e, val) => onContractorsChange?.(val)}
                        />
                    </Grid>
                    <Grid xs={5.7} item mr="2rem">
                        <InputLabel htmlFor="inventories-list">
                            <Stack direction="row" gap="2" alignItems={"center"}>
                                <Typography variant="text_14_medium" color="#202223">
                                    {TEXT_CONSTANTS.INVENTORIES}
                                </Typography>
                                <CustomizedSwitch
                                    checked={showInventory}
                                    id="inventory-check"
                                    onChange={() => {
                                        onChangeShowInventories();
                                    }}
                                />
                            </Stack>
                        </InputLabel>
                        <Autocomplete
                            id="inventories-list"
                            options={inventories}
                            ChipProps={{
                                sx: {
                                    borderRadius: "5px",
                                    backgroundColor: showInventory
                                        ? FILTER_CHIP_BG_COLOR
                                        : "#E4E5E7",
                                },
                                deleteIcon: <CloseIcon fontSize="small" />,
                            }}
                            multiple
                            onChange={(e, val) => {
                                onInventoriesChange(val);
                            }}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            value={selectedInventories}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                        />
                    </Grid>
                    <Grid xs item>
                        <InputLabel htmlFor="floorplans-list">
                            <Stack direction="row" gap="2" alignItems={"center"}>
                                <Typography variant="text_14_medium" color="#202223">
                                    {TEXT_CONSTANTS.FLOOR_PLAN}
                                </Typography>
                                <CustomizedSwitch
                                    checked={showFloorplan}
                                    id="floorplan-check"
                                    onChange={() => {
                                        onChangeShowFloorplan();
                                    }}
                                />
                            </Stack>
                        </InputLabel>
                        <Autocomplete
                            id="floorplans-list"
                            options={floorplans}
                            multiple
                            ChipProps={{
                                sx: {
                                    borderRadius: "5px",
                                    backgroundColor: showFloorplan
                                        ? FILTER_CHIP_BG_COLOR
                                        : "#E4E5E7",
                                },
                                deleteIcon: <CloseIcon fontSize="small" />,
                            }}
                            isOptionEqualToValue={(opt, val) => val.fp_name == opt.fp_name}
                            getOptionLabel={(option) => option.fp_name}
                            groupBy={(option) => option.bed_bath_count}
                            value={selectedFloorplans}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.fp_name}
                                </li>
                            )}
                            onChange={(e, value) => {
                                onFloorplanChange(value);
                            }}
                            renderGroup={(params) => {
                                let filteredFps = floorplans?.filter(
                                    (fp) => fp.bed_bath_count == params.group,
                                );

                                let itemsCount = 0;
                                filteredFps.forEach((fp) => {
                                    let index = selectedFloorplans.findIndex(
                                        (val) => val.fp_name === fp.fp_name,
                                    );
                                    if (index > -1) {
                                        itemsCount++;
                                    }
                                });
                                let selected: string | null = "all";
                                if (itemsCount == 0) {
                                    selected = null;
                                } else if (itemsCount > 0 && filteredFps.length > itemsCount) {
                                    selected = "partial";
                                }
                                return (
                                    <li key={params.key}>
                                        <GroupHeader
                                            onClick={() => {
                                                if (selected === "all") {
                                                    onFloorplanChange(
                                                        selectedFloorplans.filter(
                                                            (fp) => !filteredFps.includes(fp),
                                                        ),
                                                    );
                                                } else {
                                                    onFloorplanChange(
                                                        Array.from(
                                                            new Set<any>([
                                                                ...selectedFloorplans,
                                                                ...filteredFps,
                                                            ]),
                                                        ),
                                                    );
                                                }
                                            }}
                                            sx={{
                                                backgroundColor: "#FFF",
                                            }}
                                        >
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={
                                                    selected == "all" ? checkedIcon : incomplete
                                                }
                                                style={{ marginRight: 8 }}
                                                checked={!!selected}
                                            />
                                            {params.group}
                                            <Divider />
                                        </GroupHeader>
                                        <GroupItems>{params.children}</GroupItems>
                                    </li>
                                );
                            }}
                        />
                    </Grid>
                </Grid>
                <Stack direction="row" m="1rem 0rem" gap="2rem">
                    <BaseButton label="Cancel" classes="grey default" onClick={() => onCancel()} />
                    <BaseButton label="Apply" classes="primary default" onClick={() => onApply()} />
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};

export default ColumnFilters;
