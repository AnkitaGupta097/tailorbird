import { Button, ButtonProps, styled } from "@mui/material";

export const StyledChipButton = styled(Button)<ButtonProps>(() => ({
    textTransform: "none",
    border: "1px solid #004D71",
    borderRadius: "5px",
    fontWeight: "500",
    fontSize: "14px",
    "&.primary": {
        "&.default": {
            backgroundColor: "#FFFFFF",
            color: "#004D71",
            "&:hover": {
                backgroundColor: "#EEEEEE",
            },
        },
        "&.disabled": {
            backgroundColor: "#FFFFFF",
            color: "#004D71",
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.selected": {
        "&.default": {
            backgroundColor: "#DDF0F0",
            color: "#004D71",
            "&:hover": {
                backgroundColor: "#EEEEEE",
            },
        },
        "&.disabled": {
            backgroundColor: "#57B6B2",
            color: "#004D71",
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
    },
}));
