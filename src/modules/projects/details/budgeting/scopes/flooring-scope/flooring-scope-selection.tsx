import React, { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { Box, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EllipseIcon from "../../../../../../assets/icons/icon-ellipses.svg";
import BaseIconMenu from "../../../../../../components/base-icon-menu";

interface SelectionProps {
    checked: boolean;
    isDefault: any;
    updateRowData: () => void;
    removeSelection: any;
}

const FlooringScopeSelection = ({
    checked,
    isDefault,
    updateRowData,
    removeSelection,
}: SelectionProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuContent = () => {
        return [
            <MenuItem
                data-scope={"base-scope"}
                key="remove-item"
                onClick={() => {
                    setIsMenuOpen(false);
                    removeSelection();
                }}
            >
                Remove
            </MenuItem>,
        ];
    };

    return (
        <Box
            sx={{
                position: "relative",
                backgroundColor: checked ? (!isDefault ? "#DAF3FF" : "#EEEEEE") : "#FFFFFF",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: checked ? "1" : "0",
                "&:hover": {
                    backgroundColor: !isDefault ? "#DAF3FF" : "#FFFFFF",
                    opacity: "1",
                },
            }}
        >
            <ButtonBase
                className={isDefault ? "my-element" : ""}
                sx={{
                    width: "100%",
                    height: "100%",
                    pointerEvents: isDefault ? "none" : "auto",
                    cursor: isDefault ? "not-allowed" : "auto",
                }}
                onClick={() => {
                    updateRowData();
                }}
                disabled={isDefault}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: checked ? "1" : "0",
                        "&:hover": {
                            backgroundColor: !isDefault ? "#DAF3FF" : "#FFFFFF",
                            opacity: "1",
                        },
                        cursor: isDefault ? "not-allowed" : "pointer",
                    }}
                >
                    <CheckIcon sx={{ align: "center", width: "16px", height: "16px" }} />
                </Box>
            </ButtonBase>
            {checked && (
                <BaseIconMenu
                    content={menuContent()}
                    icon={EllipseIcon}
                    parentClassName={`Scope-header`}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    sx={{
                        button: {
                            background: "transparent !important",
                            filter: "invert(1)",
                            cursor: isDefault ? "not-allowed" : "pointer",
                        },
                        grid: {
                            position: "absolute",
                            right: "5px",
                        },
                    }}
                    onClick={(e: any) => e.preventDefault()}
                />
            )}
        </Box>
    );
};

export default React.memo(FlooringScopeSelection);
