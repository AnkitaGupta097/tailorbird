import React, { ReactElement, useState } from "react";
import { Button, Grid, SxProps } from "@mui/material";
import plusIcon from "../../assets/icons/show-details-button.svg";
import minusIcon from "../../assets/icons/hide-details-button.svg";
import AppTheme from "styles/theme";

interface ISectionHeader {
    expandLabel: string;
    collapseLabel: string;
    expandIcon?: ReactElement<any>;
    collapseIcon?: ReactElement<any>;
    btnStyling?: SxProps;
    components: ReactElement<any>[];
    componentStyling?: SxProps;
    defaultCollapsed?: boolean;
    alignContent?: "above" | "below";
}

const CollapsibleSection: React.FC<ISectionHeader> = ({
    expandLabel,
    collapseLabel,
    expandIcon,
    btnStyling,
    collapseIcon,
    components,
    componentStyling,
    defaultCollapsed,
    alignContent = "below",
}) => {
    const [isCollapsed, setCollapsed] = useState<boolean>(defaultCollapsed ?? false);

    return (
        <Grid container>
            <Grid
                container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {!isCollapsed && alignContent === "above" && (
                    <Grid container display={"block"}>
                        {components?.map((component, idx) => (
                            <Grid item key={idx} sx={componentStyling}>
                                {component}
                            </Grid>
                        ))}
                    </Grid>
                )}
                <hr style={hrStyling} />
                <Grid item>
                    <Button sx={btnStyling} onClick={() => setCollapsed(!isCollapsed)}>
                        {isCollapsed ? expandIcon : collapseIcon}
                        {isCollapsed ? expandLabel : collapseLabel}
                    </Button>
                </Grid>
                <hr style={hrStyling} />
            </Grid>
            {!isCollapsed && alignContent === "below" && (
                <Grid container display={"block"}>
                    {components?.map((component, idx) => (
                        <Grid item key={idx} sx={componentStyling}>
                            {component}
                        </Grid>
                    ))}
                </Grid>
            )}
        </Grid>
    );
};

const borderColor = "#D2D5D8";

const btnImgStyling: React.CSSProperties = {
    marginRight: "7px",
    opacity: 0.5,
};

const hrStyling: React.CSSProperties = {
    flex: 1,
    border: `1px solid ${borderColor}`,
};

CollapsibleSection.defaultProps = {
    expandIcon: <img src={plusIcon} alt="open/close" style={btnImgStyling} />,
    collapseIcon: <img src={minusIcon} alt="open/close" style={btnImgStyling} />,
    btnStyling: {
        color: AppTheme.text.medium,
        fontFamily: "Roboto",
        fontWeight: 500,
        border: `2px solid ${borderColor}`,
    },
    componentStyling: { marginTop: "24px" },
};

export default CollapsibleSection;
