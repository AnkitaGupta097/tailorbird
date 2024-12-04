import { Button, ButtonProps, styled } from "@mui/material";

export const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
    textTransform: "none",
    "&.primary": {
        "&.default": {
            backgroundColor: "#004D71",
            color: theme.button.active.textColor,
            "&:hover": {
                backgroundColor: "#00344D",
            },
        },
        "&.disabled": {
            backgroundColor: "#004D71",
            color: theme.button.active.textColor,
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.secondary": {
        "&.default": {
            backgroundColor: "#57B6B2",
            color: theme.button.active.textColor,
            "&:hover": {
                backgroundColor: "#479491",
            },
        },
        "&.disabled": {
            backgroundColor: "#57B6B2",
            color: theme.button.active.textColor,
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.special": {
        "&.default": {
            color: theme.button.active.textColor,
            backgroundColor: "#410099",
            "&:hover": {
                backgroundColor: "#21004D",
            },
        },
        "&.disabled": {
            backgroundColor: "#410099",
            color: theme.button.active.textColor,
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.error": {
        "&.default": {
            color: theme.button.active.textColor,
            backgroundColor: "#D90000",
            "&:hover": {
                backgroundColor: "#A80000",
            },
        },
        "&.disabled": {
            backgroundColor: "#D90000",
            color: theme.button.active.textColor,
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.invisible": {
        "&.default": {
            color: theme.palette.text.primary,
            backgroundColor: "#FFFFFF",
            "&:hover": {
                backgroundColor: "#EEEEEE",
            },
        },
        "&.disabled": {
            backgroundColor: "#AAAAAA",
            color: theme.button.active.textColor,
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.disabledwithoutBG": {
            color: theme.palette.text.primary,
            backgroundColor: "#FFFFFF",
            cursor: "not-allowed",
            pointerEvents: "auto",
            opacity: 0.3,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.grey": {
        "&.default": {
            color: theme.palette.text.primary,
            backgroundColor: "#EEEEEE",
            "&:hover": {
                backgroundColor: "#CCCCCC",
            },
        },
        "&.active": {
            backgroundColor: "#004D71",
            color: theme.button.active.textColor,
        },
        "&.spaced": {
            padding: "1rem 0.9rem 1rem 0.9rem",
        },
    },
    "&.decline": {
        "&.default": {
            color: "red",
            backgroundColor: "Transparent",
            "&:hover": {
                backgroundColor: "#CCCCCC",
            },
        },
    },
}));
