import { styled, TextareaAutosize, TextareaAutosizeProps } from "@mui/material";

export const StyledTextArea = styled(TextareaAutosize)<TextareaAutosizeProps>(() => ({
    borderWidth: "1px",
    borderRadius: "5px",
    borderColor: "#CCCCCC",
    resize: "none",
}));
