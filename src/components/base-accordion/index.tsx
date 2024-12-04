import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    SxProps,
    Typography,
    TypographyPropsVariantOverrides,
} from "@mui/material";
import React, { ReactElement, ReactNode, useState } from "react";
import expandMoreIcon from "../../assets/icons/expand-accordion.svg";
import AppTheme from "styles/theme";
import { OverridableStringUnion } from "@mui/types";
import { Variant } from "@mui/material/styles/createTypography";
import AccordianDetailVirtualizedList from "./AccordianDetailVirtualizedList";
import BaseCheckbox from "components/checkbox";

interface IBaseAccordion {
    title: ReactNode;
    divider?: ReactElement<any>;
    accordionStyling?: SxProps;
    accordionSummarySx?: SxProps;
    accordionDetailsSx?: SxProps;
    summaryStyling?: SxProps;
    summaryVariant?: OverridableStringUnion<"inherit" | Variant, TypographyPropsVariantOverrides>;
    detailsStyling?: SxProps;
    detailsVariant?: OverridableStringUnion<"inherit" | Variant, TypographyPropsVariantOverrides>;
    accordionExpandIcon?: ReactElement<any>;
    components: ReactElement<any>[] | string[];
    defaultExpanded?: boolean;
    summaryDetail?: ReactNode;
    summaryAddition?: ReactNode;
    summaryIcon?: ReactNode;
    enableVirtualizedList?: boolean;
    checkbox?: { isSelected: boolean; onClick: any };
}

const borderColor = "#D2D5D8";

const contentPadding: SxProps = {
    paddingLeft: "20px",
    paddingRight: "28.3px",
};

const BaseAccordion: React.FC<IBaseAccordion> = ({
    title,
    divider,
    checkbox,
    accordionExpandIcon,
    accordionStyling,
    accordionDetailsSx,
    accordionSummarySx,
    summaryStyling,
    summaryVariant,
    detailsStyling,
    detailsVariant,
    components,
    defaultExpanded,
    summaryDetail,
    summaryIcon,
    summaryAddition,
    enableVirtualizedList,
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(
        defaultExpanded ?? components?.length !== 0,
    );
    return (
        <Accordion
            disabled={components?.length === 0}
            disableGutters
            expanded={isExpanded}
            onChange={(e: any, expanded) => setIsExpanded(expanded)}
            elevation={0}
            sx={accordionStyling}
            TransitionProps={{ unmountOnExit: true }}
        >
            <AccordionSummary expandIcon={accordionExpandIcon} sx={accordionSummarySx}>
                <Grid
                    container
                    justifyContent={"space-between"}
                    spacing={2}
                    alignItems={"center"}
                    flexDirection="row"
                >
                    <Grid item spacing={2} alignItems={"center"} flexDirection="row">
                        <Grid container flexDirection="row" gap={3} alignItems="center">
                            {checkbox && (
                                <Grid item>
                                    <BaseCheckbox
                                        size="small"
                                        checked={checkbox?.isSelected}
                                        onClick={(e: React.SyntheticEvent) => {
                                            e.stopPropagation();
                                            checkbox.onClick();
                                        }}
                                    />
                                </Grid>
                            )}
                            {summaryIcon && <Grid item>{summaryIcon}</Grid>}
                            <Grid item>
                                <Typography variant={summaryVariant} sx={summaryStyling}>
                                    {title}
                                </Typography>
                            </Grid>
                            {summaryAddition && <Grid item>{summaryAddition}</Grid>}
                        </Grid>
                    </Grid>
                    {summaryDetail && <Grid item>{summaryDetail}</Grid>}
                </Grid>
            </AccordionSummary>
            {divider}
            <AccordionDetails sx={accordionDetailsSx}>
                {enableVirtualizedList ? (
                    <AccordianDetailVirtualizedList
                        components={components}
                        detailsVariant={detailsVariant}
                        detailsStyling={detailsStyling}
                    />
                ) : (
                    components?.map((ele, idx) => (
                        <Typography
                            key={idx}
                            variant={detailsVariant}
                            sx={{
                                ...detailsStyling,
                                ...(typeof ele === "string" && {
                                    display: "block",
                                    wordWrap: "break-word",
                                }),
                            }}
                        >
                            {ele}
                        </Typography>
                    ))
                )}
            </AccordionDetails>
        </Accordion>
    );
};

BaseAccordion.defaultProps = {
    summaryStyling: {
        fontFamily: "Roboto",
        color: "#232323",
    },
    summaryVariant: "text_18_medium",
    detailsStyling: {
        fontFamily: "Roboto",
        color: AppTheme.text.medium,
        display: "flex",
        lineHeight: "20px",
    },
    detailsVariant: "text_14_regular",
    accordionExpandIcon: <img src={expandMoreIcon} alt="expand" />,
    divider: (
        <hr
            style={{
                color: borderColor,
                opacity: 0.5,
                marginRight: "20px",
                marginLeft: "20px",
            }}
        />
    ),
    accordionStyling: {
        boxShadow: "none",
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        transform: "none",
    },
    accordionSummarySx: { ...contentPadding },
    accordionDetailsSx: { ...contentPadding, paddingTop: "20px", paddingBottom: "20px" },
    enableVirtualizedList: false,
};

export default BaseAccordion;
