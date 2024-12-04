import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Typography,
} from "@mui/material";
import { IAccordion } from "../../interfaces";
import styled from "@emotion/styled";
import AppTheme from "../../../../styles/theme";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const handleChange = (expanded: boolean, setExpanded: any) => {
    setExpanded(!expanded);
};

const CustomAccordionDetails = styled(AccordionDetails)({
    "&.root": {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
    "&.MuiAccordionDetails-root": {
        padding: "0",
    },
});

const AccordionComponent = (props: IAccordion) => {
    return (
        <Accordion
            expanded={props?.expanded}
            square
            defaultExpanded
            sx={{
                marginBottom: "none",
            }}
            disableGutters
        >
            <AccordionSummary
                aria-label="Expand"
                aria-controls="panel1a-content"
                onClick={() => handleChange(props?.expanded, props?.setExpanded)}
                id="panel1a-header"
                sx={{
                    paddingTop: "1rem",
                    ".MuiAccordionSummary-content": {
                        marginBottom: 0,
                        paddingBottom: 0,
                        borderBottom: "0.1rem solid #DEDEDE",
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                        display: "none",
                    },
                }}
            >
                <Grid
                    container
                    justifyContent="space-between"
                    sx={{
                        borderBottom: props?.expanded
                            ? `.5px solid ${AppTheme.border.divider}`
                            : undefined,
                        width: "100vw",
                    }}
                >
                    <Grid item onClick={() => handleChange(props?.expanded, props?.setExpanded)}>
                        <Box>
                            <Typography
                                variant="heading"
                                color="textPrimary"
                                sx={{
                                    display: "inline-block",
                                    borderBottom: `2px solid ${AppTheme.border.accordionBottom}`,
                                    paddingBottom: ".5rem",
                                    marginLeft: "2.5rem",
                                    position: "relative",
                                    top: "0.1rem",
                                }}
                            >
                                {props?.title}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item marginRight="5rem">
                        {props?.expanded ? <ExpandLess /> : <ExpandMore />}
                    </Grid>
                </Grid>
            </AccordionSummary>
            <CustomAccordionDetails className="accordion-content">
                {props?.component}
            </CustomAccordionDetails>
        </Accordion>
    );
};

export default AccordionComponent;
