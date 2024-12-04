import React, { ReactNode, useEffect, useState } from "react";
import { Menu, SxProps, Theme, Grid } from "@mui/material";
import BaseIconButton from "../base-icon-button";

interface IBaseIconMenu {
    icon: any;
    content?: ReactNode;
    parentClassName: string;
    children?: any;
    isMenuOpen: boolean;
    // eslint-disable-next-line
    setIsMenuOpen: (v: boolean) => void;
    sx?: {
        button?: SxProps<Theme> | undefined;
        menu?: SxProps<Theme> | undefined;
        grid?: SxProps<Theme> | undefined;
    };
    [v: string]: any;
}

const BaseIconMenu = ({
    icon,
    content,
    parentClassName,
    children,
    isMenuOpen,
    setIsMenuOpen,
    sx,
    ...others
}: IBaseIconMenu) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        if (!isMenuOpen) {
            setAnchorEl(null);
        }
    }, [isMenuOpen]);

    return (
        <Grid className="Base-icon-menu-container" sx={sx?.grid}>
            <BaseIconButton
                icon={icon}
                classes={`${parentClassName}-menu-icon-button`}
                onClick={handleClick}
                sx={sx?.button}
            />
            <Menu
                id="baseIconMenu"
                aria-labelledby="baseIconMenuButton"
                className={`${parentClassName}-menu`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={sx?.menu}
                {...others}
            >
                {content ? content : children}
            </Menu>
        </Grid>
    );
};

export default BaseIconMenu;
