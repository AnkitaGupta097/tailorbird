import styled from "@emotion/styled";
import { Chip } from "@mui/material";

const options = {
    shouldForwardProp: (prop: any) => prop !== "bgcolor" && prop !== "color",
};

export const StyledChip = styled(
    Chip,
    options,
)(
    ({
        bgcolor,
        textColor,
        borderColor,
    }: {
        bgcolor: string;
        textColor: string;
        borderColor?: string;
    }) => ({
        color: textColor,
        backgroundColor: bgcolor,
        borderColor: borderColor,
    }),
);
