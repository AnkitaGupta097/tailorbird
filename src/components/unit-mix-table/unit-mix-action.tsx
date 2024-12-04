import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { graphQLClient } from "utils/gql-client";
import { ACTIVATE_PROPERTY_UNIT, DEACTIVATE_PROPERTY_UNIT } from "./property-unit.graphql";

export default function UnitMixActionMenu({
    isActive,
    projectId,
    unitId,
    refetchUnitMixData,
}: {
    isActive: boolean;
    projectId: string;
    unitId: string;
    refetchUnitMixData: () => void;
}) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeactivate = async () => {
        await graphQLClient.mutate("deactivatePropertyUnit", DEACTIVATE_PROPERTY_UNIT, {
            unitId,
        });
        refetchUnitMixData();
        handleClose();
    };
    const handleActivate = async () => {
        await graphQLClient.mutate("activatePropertyUnit", ACTIVATE_PROPERTY_UNIT, {
            projectId,
            unitId,
        });
        refetchUnitMixData();
        handleClose();
    };
    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                startIcon={<InfoIcon />}
            />

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {isActive ? (
                    <MenuItem onClick={handleDeactivate}>Deactivate</MenuItem>
                ) : (
                    <MenuItem onClick={handleActivate}>Activate</MenuItem>
                )}
            </Menu>
        </div>
    );
}
