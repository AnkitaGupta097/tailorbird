import {
    LinearProgress,
    LinearProgressProps,
    Typography,
    TypographyProps,
    styled,
} from "@mui/material";

export const StyledLinearProgress = styled(LinearProgress)<LinearProgressProps>(() => ({
    ".MuiLinearProgress-bar1Determinate": {
        backgroundColor: "#57B6B2",
    },
    "&.MuiLinearProgress-root.MuiLinearProgress-determinate": {
        backgroundColor: "#BCE2E0",
    },
}));

export const StyledTypography = styled(Typography)<TypographyProps>(() => ({
    color: "#757575",
}));
