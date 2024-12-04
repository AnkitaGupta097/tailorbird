import { Popover, Stack, Typography } from "@mui/material";
import React from "react";

interface IActionMenu {
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
    content: any;
}

const ActionMenu = ({ anchorEl, setAnchorEl, content }: IActionMenu) => {
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Typography sx={{ p: 2 }}>
                    <Stack spacing={2}>{content}</Stack>
                </Typography>
            </Popover>
        </div>
    );
};

export default ActionMenu;
