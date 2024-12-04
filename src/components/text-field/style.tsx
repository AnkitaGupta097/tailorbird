import { styled, TextField, TextFieldProps } from "@mui/material";

export const StyledTextField = styled(TextField)<TextFieldProps>((props) => ({
    "& .MuiInputBase-root": {
        height: props.multiline ? "auto " : "45px",
    },
    "& fieldset": {
        borderWidth: "1px",
        borderRadius: "5px",
    },
    "&.enabled": {
        "& fieldset": {
            borderColor: "#CCCCCC",
        },
        "&:hover fieldset": {
            borderColor: "#AAAAAA",
        },
    },
    "&.disabled": {
        "& fieldset": {
            borderColor: "#CCCCCC",
            cursor: "not-allowed",
            pointerEvents: "auto",
        },
    },
    "&.error": {
        "& fieldset": {
            borderColor: "#D90000",
        },
        "&:hover fieldset": {
            borderColor: "#D90000",
        },
    },
}));
