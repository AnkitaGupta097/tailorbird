import { Grid, SxProps, Theme, LinearProgressProps } from "@mui/material";
import React from "react";
import { StyledLinearProgress, StyledTypography } from "./style";

interface IBaseProgressBarProps extends LinearProgressProps {
    label?: string;
    linearProgressSx?: SxProps<Theme>;
    typographySx?: SxProps<Theme>;
}

const BaseProgressBar: React.FC<IBaseProgressBarProps> = ({
    variant,
    value,
    label,
    sx,
    linearProgressSx,
    typographySx,
    ...rest
}) => {
    return (
        <>
            <Grid container direction="row" sx={sx} alignItems="center" spacing={2}>
                <Grid item xs>
                    <StyledLinearProgress
                        {...rest}
                        variant={variant ?? "determinate"}
                        sx={linearProgressSx}
                        value={value}
                    />
                </Grid>

                {label && (
                    <Grid item>
                        <StyledTypography variant="text_14_regular" sx={typographySx}>
                            {label}
                        </StyledTypography>
                    </Grid>
                )}
            </Grid>
        </>
    );
};
export default BaseProgressBar;
