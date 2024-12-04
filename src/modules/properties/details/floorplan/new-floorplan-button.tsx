import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { Grid, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Add } from "@mui/icons-material";
import TrackerUtil from "utils/tracker";

type INewProjectButtonProps = React.ComponentProps<"div"> & {
    onAddNewFloorplan: any;
};

export default function NewProjectButton({ onAddNewFloorplan }: INewProjectButtonProps) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    const onAddFloorplan = (takeOffType: any) => {
        onAddNewFloorplan(takeOffType);
        TrackerUtil.event("PROPERTY_NEW_PROJECT_CLICKED");
        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Stack direction="row" spacing={2}>
            <div>
                <Button
                    style={{ height: "48px", width: "auto" }}
                    color="primary"
                    variant="contained"
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? "composition-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <Typography fontWeight={"500"}>Action</Typography>

                    <ArrowDropDownIcon />
                </Button>
                <Popper
                    style={{ zIndex: "20000" }}
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }: any) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === "bottom-start" ? "left top" : "left bottom",
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        <MenuItem
                                            id="new-project-button-add-project"
                                            onClick={() => onAddFloorplan("FLOORPLAN")}
                                        >
                                            <Grid container flexDirection={"row"}>
                                                <Grid>
                                                    <Add />
                                                </Grid>
                                                <Grid marginLeft={"8px"}>
                                                    <Typography>Add Floorplan</Typography>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                        <MenuItem
                                            id="new-project-button-add-project"
                                            onClick={() => onAddFloorplan("BUILDING")}
                                        >
                                            <Grid container flexDirection={"row"}>
                                                <Grid>
                                                    <Add />
                                                </Grid>
                                                <Grid marginLeft={"8px"}>
                                                    <Typography>Add Building</Typography>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                        <MenuItem
                                            id="new-project-button-add-project"
                                            onClick={() => onAddFloorplan("COMMON_AREA")}
                                        >
                                            <Grid container flexDirection={"row"}>
                                                <Grid>
                                                    <Add />
                                                </Grid>
                                                <Grid marginLeft={"8px"}>
                                                    <Typography>Add Common Area</Typography>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                        <MenuItem
                                            id="new-project-button-add-project"
                                            onClick={() => onAddFloorplan("SITE")}
                                        >
                                            <Grid container flexDirection={"row"}>
                                                <Grid>
                                                    <Add />
                                                </Grid>
                                                <Grid marginLeft={"8px"}>
                                                    <Typography>Add Site</Typography>
                                                </Grid>
                                            </Grid>
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </Stack>
    );
}
