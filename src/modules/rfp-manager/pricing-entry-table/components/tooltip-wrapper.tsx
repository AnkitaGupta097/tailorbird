import { Tooltip, Typography } from "@mui/material";
import React from "react";

type TooltipWrapperType = {
    wrapWithTooltip?: boolean;
    tooltipText?: string;
    children: any;
};

const TooltipWrapper: React.FC<TooltipWrapperType> = ({
    wrapWithTooltip,
    tooltipText,
    children,
}) => {
    return wrapWithTooltip ? (
        <Tooltip
            title={
                <pre>
                    <Typography variant="text_14_regular">{tooltipText}</Typography>
                </pre>
            }
            arrow
        >
            {children}
        </Tooltip>
    ) : (
        <>{children}</>
    );
};

export default TooltipWrapper;
